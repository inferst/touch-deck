use axum::extract::{
    State,
    ws::{Message, WebSocket},
};
use futures::{
    sink::SinkExt,
    stream::{SplitSink, StreamExt},
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::sync::Arc;
use tauri_plugin_store::StoreExt;
use tokio::sync::{Mutex, broadcast::Sender};

use crate::app_handle;

#[derive(Serialize, Deserialize, Debug)]
struct MessageData {
    message: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Request {
    name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Response {
    name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Page {
    buttons: Vec<String>,
}

async fn send_buttons(socket: Arc<Mutex<SplitSink<WebSocket, Message>>>) {
    let app = app_handle();
    let store = app.store("settings.json").unwrap();

    let pages = store.get("pages").unwrap();

    let response = json!({
        "name": "buttons",
        "payload": pages
    });

    let json_response = serde_json::to_string(&response).unwrap();
    dbg!(&json_response);
    let _ = socket
        .lock()
        .await
        .send(Message::Text(json_response.into()))
        .await;
}

pub async fn handle_socket(
    socket: axum::extract::ws::WebSocket,
    state: State<Arc<Sender<String>>>,
) {
    println!("WebSocket Connected");

    let mut rx = state.subscribe();

    let (sender, mut receiver) = socket.split();

    let tx = Arc::new(Mutex::new(sender));
    let sender = tx.clone();

    let task = tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            println!("c {message}");

            if message == "update" {
                send_buttons(sender.clone()).await;
            }
        }
    });

    while let Some(Ok(msg)) = receiver.next().await {
        if let Message::Text(text) = msg {
            if let Ok(received) = serde_json::from_str::<MessageData>(&text) {
                println!("Received: {text}");

                let response = MessageData {
                    message: format!("Echo: {}", received.message),
                };

                let json_response = serde_json::to_string(&response).unwrap();
                let _ = tx
                    .clone()
                    .lock()
                    .await
                    .send(Message::Text(json_response.into()))
                    .await;
            }

            if let Ok(received) = serde_json::from_str::<Request>(&text) {
                println!("Received: {text}");

                if let "buttons" = received.name.as_str() {
                    send_buttons(tx.clone()).await;
                }
            }
        }
    }

    task.abort();

    println!("Websocket disconnected");
}
