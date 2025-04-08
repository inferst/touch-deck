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
use tokio::sync::Mutex;

use crate::{
    app_handle,
    state::{AppState, ClientMessage, ServerMessage},
};

#[derive(Serialize, Deserialize, Debug)]
struct MessageData {
    name: String,
    payload: Option<String>,
}

async fn get_data(socket: Arc<Mutex<SplitSink<WebSocket, Message>>>) {
    let store = app_handle().store("settings.json").unwrap();

    let pages = store.get("pages").unwrap();
    let layout = store.get("layout").unwrap();

    let response = json!({
        "name": "getData",
        "payload": {
            "pages": pages,
            "layout": layout,
        }
    });

    let json_response = serde_json::to_string(&response).unwrap();

    let mut socket = socket.lock().await;
    socket
        .send(Message::Text(json_response.into()))
        .await
        .unwrap();
}

pub async fn handle_socket(socket: axum::extract::ws::WebSocket, state: State<Arc<AppState>>) {
    println!("WebSocket Connected");

    let mut rx = state.server_sender.subscribe();

    let (sender, mut receiver) = socket.split();

    let socket_sender = Arc::new(Mutex::new(sender));
    let sender = socket_sender.clone();

    let task = tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            if ServerMessage::DataUpdated == message {
                get_data(sender.clone()).await;
            }
        }
    });

    while let Some(Ok(msg)) = receiver.next().await {
        if let Message::Text(text) = msg {
            if let Ok(message) = serde_json::from_str::<MessageData>(&text) {
                let sender = socket_sender.clone();

                dbg!(&message);

                match message.name.as_str() {
                    "getData" => get_data(sender).await,
                    "doAction" => {
                        if let Some(id) = message.payload {
                            let _ = state
                                .client_sender
                                .send(ClientMessage::DoAction(id))
                                .unwrap();
                        }
                    }
                    _ => println!("unknown message"),
                }
            }
        }
    }

    task.abort();

    println!("Websocket disconnected");
}
