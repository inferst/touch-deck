use futures::{SinkExt, StreamExt};
use serde_json::json;
use tauri_plugin_store::StoreExt;
use tokio::sync::broadcast::Sender;
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

use crate::{ClientMessage, app_handle};

async fn connect(sender: Sender<ClientMessage>) {
    let store = app_handle().store("settings.json").unwrap();
    let streamerbot = store.get("streamerbot").unwrap();

    let host = streamerbot
        .get("host")
        .map_or("127.0.0.1", |value| value.as_str().unwrap());

    let port = streamerbot
        .get("port")
        .map_or("8080", |value| value.as_str().unwrap());

    let endpoint = streamerbot
        .get("endpoint")
        .map_or("/", |value| value.as_str().unwrap());

    let url = format!("ws://{host}:{port}{endpoint}");

    dbg!(&url);

    let (ws_stream, _) = connect_async(url).await.expect("Failed to connect");
    println!("WebSocket handshake has been successfully completed");

    let (mut write, mut read) = ws_stream.split();

    let receive_task = tokio::spawn(async move {
        while let Some(msg) = read.next().await {
            match msg {
                Ok(Message::Text(txt)) => println!("📥 Ответ: {}", txt),
                Ok(Message::Close(_)) => {
                    println!("🔒 Соединение закрыто сервером");
                    break;
                }
                Ok(_) => {}
                Err(e) => {
                    eprintln!("❌ Ошибка получения: {}", e);
                    break;
                }
            }
        }
    });

    let mut rx = sender.subscribe();

    let _ = tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            if let ClientMessage::DoAction(id) = message {
                let data = json!({
                    "request": "DoAction",
                    "action": {
                        "id": id,
                    },
                    "id": "1",
                });

                let text = serde_json::to_string(&data).unwrap();

                dbg!(&text);

                let _ = write.send(Message::Text(text.into())).await;
            }
        }
    })
    .await;

    let _ = receive_task.await;
}

pub async fn client(sender: Sender<ClientMessage>) {
    let mut rx = sender.subscribe();
    let client_sender = sender.clone();

    let mut client_task = tokio::spawn(async move {
        connect(client_sender).await;
    });

    let _ = tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            let sender = sender.clone();

            if let ClientMessage::SettingsUpdate = message {
                client_task.abort();

                client_task = tokio::spawn(async move {
                    connect(sender).await;
                });
            }
        }
    })
    .await;
}
