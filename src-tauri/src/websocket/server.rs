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
use tokio::sync::{Mutex, broadcast::Sender};

use crate::{
    settings::{get_deck, get_layout, get_pages, get_settings},
    state::{AppState, SBMessage, ServerMessage},
};

#[derive(Serialize, Deserialize, Debug)]
struct MessageData {
    name: String,
    payload: Option<String>,
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
                let sb_sender = state.sb_sender.clone();

                match message.name.as_str() {
                    "getData" => get_data(sender).await,
                    "doAction" => do_action(sb_sender, message).await,
                    _ => println!("Unknown message"),
                }
            }
        }
    }

    task.abort();

    println!("Websocket disconnected");
}

async fn do_action(sb_sender: Sender<SBMessage>, message: MessageData) {
    if let Some(id) = message.payload {
        let _ = sb_sender.send(SBMessage::DoAction(id)).unwrap();
    }
}

async fn get_data(socket: Arc<Mutex<SplitSink<WebSocket, Message>>>) {
    let response = json!({
        "name": "getData",
        "payload": {
            "deck": get_deck(),
            "settings": get_settings(),
        }
    });

    let json_response = serde_json::to_string(&response).unwrap();

    let mut socket = socket.lock().await;
    socket
        .send(Message::Text(json_response.into()))
        .await
        .unwrap();
}
