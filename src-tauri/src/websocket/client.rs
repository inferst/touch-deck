use std::{sync::Arc, time::Duration};

use futures::{SinkExt, StreamExt};
use serde_json::json;
use tauri::Manager;
use tokio::{
    select,
    sync::{
        Mutex,
        broadcast::{self, Sender},
    },
    time::sleep,
};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

use crate::{
    app_handle,
    settings::get_streamerbot_settings,
    state::{AppState, SBMessage, SocketStatus},
};

const RECONNECT_DELAY: Duration = Duration::from_secs(5);

async fn connect_loop(sender: Sender<SBMessage>, abort_rx: Sender<()>) {
    loop {
        let abort_rx = abort_rx.subscribe();

        match connect_once(sender.clone(), abort_rx).await {
            Ok(_) => {
                tracing::info!("Connection closed gracefully");
                break;
            }
            Err(_) => {
                tracing::warn!("Connection error. Reconnecting in {RECONNECT_DELAY:?}...");
                sleep(RECONNECT_DELAY).await;
            }
        }
    }
}

async fn connect_once(
    sender: Sender<SBMessage>,
    mut abort_rx: broadcast::Receiver<()>,
) -> Result<(), ()> {
    let url = get_streamer_bot_url();

    match connect_async(&url).await {
        Ok((ws_stream, _)) => {
            tracing::info!("WebSocket handshake has been successfully completed: {url}");

            let state = app_handle().state::<Arc<AppState>>();
            state.set_status(SocketStatus::Connected).await;

            let (write, mut read) = ws_stream.split();

            let receive_task = tokio::spawn(async move {
                while let Some(msg) = read.next().await {
                    match msg {
                        Ok(Message::Close(_)) => {
                            let state = app_handle().state::<Arc<AppState>>();
                            state.set_status(SocketStatus::Disconnected).await;
                            println!("connect_async Connection closed");
                            break;
                        }
                        Ok(_) => {}
                        Err(e) => {
                            eprintln!("Error: {e}");
                            break;
                        }
                    }
                }
            });

            let mut rx = sender.subscribe();

            let write = Arc::new(Mutex::new(write));
            let ws_write = write.clone();

            let mut send_task = tokio::spawn(async move {
                while let Ok(message) = rx.recv().await {
                    if let SBMessage::DoAction(id) = message {
                        let data = json!({
                            "request": "DoAction",
                            "action": {
                                "id": id,
                            },
                            "id": "deck",
                        });

                        let message = serde_json::to_string(&data).unwrap();

                        let _ = write.lock().await.send(Message::Text(message.into())).await;
                    }
                }
            });

            select! {
                _ = receive_task => {
                    send_task.abort();
                    Err(())
                }
                _ = &mut send_task => {
                    Err(())
                }
                _ = abort_rx.recv() => {
                    send_task.abort();
                    let _ = ws_write.lock().await.close().await;
                    println!("WebSocket client exited");
                    Ok(())
                }
            }
        }
        Err(e) => {
            eprintln!("Couldn't connect: {e}");
            Err(())
        }
    }
}

pub async fn client(state: Arc<AppState>) {
    let mut rx = state.sb_sender.subscribe();
    let sb_sender = state.sb_sender.clone();

    let (abort_tx, _abort_rx) = broadcast::channel::<()>(1);
    let connect_abort_tx = abort_tx.clone();

    let mut url = get_streamer_bot_url();

    tokio::spawn(async move {
        connect_loop(sb_sender, connect_abort_tx).await;
    });

    let _ = tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            let sender = state.sb_sender.clone();

            if let SBMessage::SettingsUpdated = message {
                let new_url = get_streamer_bot_url();

                if url != new_url {
                    url = new_url;

                    let state = app_handle().state::<Arc<AppState>>();
                    state.set_status(SocketStatus::Connecting).await;

                    abort_tx.send(()).unwrap();

                    let connect_abort_tx = abort_tx.clone();

                    tokio::spawn(async move {
                        connect_loop(sender, connect_abort_tx).await;
                    });
                }
            }
        }
    })
    .await;
}

fn get_streamer_bot_url() -> String {
    let settings = get_streamerbot_settings().unwrap();

    format!(
        "ws://{}:{}{}",
        settings.host, settings.port, settings.endpoint
    )
}
