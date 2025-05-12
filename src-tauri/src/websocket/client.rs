use std::{sync::Arc, time::Duration};

use futures::{SinkExt, StreamExt};
use serde_json::{Value, json};
use tauri::Manager;
use tauri_plugin_store::StoreExt;
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
    state::{AppState, ClientMessage, SocketStatus},
};

async fn connect_and_rerun(sender: Sender<ClientMessage>, abort_rx: Sender<()>) {
    loop {
        let abort_rx = abort_rx.subscribe();

        if let Ok(()) = connect(sender.clone(), abort_rx).await {
            println!("✅ Работа завершена корректно");
            break;
        }

        println!("🔁 Попытка переподключения через 5 секунд...");
        sleep(Duration::from_secs(5)).await;
    }
}

async fn connect(
    sender: Sender<ClientMessage>,
    mut abort_rx: broadcast::Receiver<()>,
) -> Result<(), ()> {
    let url = get_streamer_bot_url();

    match connect_async(&url).await {
        Ok((ws_stream, _)) => {
            println!("WebSocket handshake has been successfully completed: {url}");

            let state = app_handle().state::<Arc<AppState>>();
            state.set_status(SocketStatus::Connected).await;

            let (write, mut read) = ws_stream.split();

            let receive_task = tokio::spawn(async move {
                while let Some(msg) = read.next().await {
                    match msg {
                        Ok(Message::Text(txt)) => println!("📥 Ответ: {txt}"),
                        Ok(Message::Close(_)) => {
                            let state = app_handle().state::<Arc<AppState>>();
                            state.set_status(SocketStatus::Disconnected).await;
                            println!("🔒 Соединение закрыто сервером");
                            break;
                        }
                        Ok(_) => {}
                        Err(e) => {
                            eprintln!("❌ Ошибка получения: {e}");
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
                    if let ClientMessage::DoAction(id) = message {
                        let data = json!({
                            "request": "DoAction",
                            "action": {
                                "id": id,
                            },
                            "id": "deck",
                        });

                        let message = serde_json::to_string(&data).unwrap();

                        dbg!(&message);

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
            eprintln!("❌ Не удалось подключиться: {e}");
            Err(())
        }
    }
}

pub async fn client(state: Arc<AppState>) {
    let mut rx = state.client_sender.subscribe();
    let client_sender = state.client_sender.clone();

    let (abort_tx, _abort_rx) = broadcast::channel::<()>(10);
    let connect_abort_tx = abort_tx.clone();

    tokio::spawn(async move {
        connect_and_rerun(client_sender, connect_abort_tx).await;
    });

    let _ = tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            let sender = state.client_sender.clone();

            if let ClientMessage::SettingsUpdated = message {
                println!("\n\nSettingsUpdate\n\n");

                let state = app_handle().state::<Arc<AppState>>();
                state.set_status(SocketStatus::Disconnected).await;

                abort_tx.send(()).unwrap();

                let connect_abort_tx = abort_tx.clone();

                tokio::spawn(async move {
                    connect_and_rerun(sender, connect_abort_tx).await;
                });
            }
        }
    })
    .await;
}

fn get_value_string(value: &Value, key: &str, default: &str) -> String {
    value
        .get(key)
        .map_or(default, |v| v.as_str().unwrap_or(default))
        .to_string()
}

fn get_streamer_bot_url() -> String {
    let store = app_handle().store("settings.json").unwrap();
    let streamerbot = store.get("streamerbot").unwrap_or("");

    let default_host = "127.0.0.1";
    let default_port = "8080";
    let default_endpoint = "/";

    let host = get_value_string(&streamerbot, "host", default_host);
    let port = get_value_string(&streamerbot, "port", default_port);
    let endpoint = get_value_string(&streamerbot, "endpoint", default_endpoint);

    format!("ws://{host}:{port}{endpoint}")
}
