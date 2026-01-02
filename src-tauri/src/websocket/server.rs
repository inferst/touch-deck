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
use tokio::sync::{Mutex, broadcast::Sender, mpsc};

use crate::{
    settings::{get_deck, get_settings},
    state::{AppState, ClientMessage, Clients, ServerMessage},
};

#[derive(Serialize, Deserialize, Debug)]
struct MessageId {
    id: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "name", content = "data", rename_all = "snake_case")]
enum RequestMessage {
    GetData,
    Press { id: String, uuid: String },
    Release { id: String, uuid: String },
}

pub async fn handle_socket(
    socket: axum::extract::ws::WebSocket,
    clients: Clients,
    state: State<Arc<AppState>>,
) {
    println!("WebSocket Connected");

    let (tx, mut rx) = mpsc::unbounded_channel::<ClientMessage>();
    {
        clients.lock().unwrap().push(tx);
    }

    let (sender, mut receiver) = socket.split();

    let sender = Arc::new(Mutex::new(sender));

    let socket_sender = sender.clone();

    tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            match msg {
                ClientMessage::Press { id, uuid } => {
                    let json = json!({
                        "name": "press",
                        "data": {
                            "id": id,
                            "uuid": uuid
                        }
                    })
                    .to_string();

                    let mut sender = socket_sender.lock().await;
                    let _ = sender.send(Message::Text(json.into())).await;
                }
                ClientMessage::Release { id, uuid } => {
                    let json = json!({
                        "name": "release",
                        "data": {
                            "id": id,
                            "uuid": uuid
                        }
                    })
                    .to_string();

                    let mut sender = socket_sender.lock().await;
                    let _ = sender.send(Message::Text(json.into())).await;
                }
                ClientMessage::GetActionSettigns { id } => {

                }
                ClientMessage::SetActionSettings { id } => {

                }
            }
        }
    });

    let mut rx = state.server_sender.subscribe();

    let sender = sender.clone();
    let socket_sender = sender.clone();

    let task = tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            if ServerMessage::DataUpdated == message {
                get_data(sender.clone()).await;
            }
        }
    });

    while let Some(Ok(msg)) = receiver.next().await {
        let clients = clients.clone();
        if let Message::Text(text) = msg {
            if let Ok(message) = serde_json::from_str::<RequestMessage>(&text) {
                let sender = socket_sender.clone();
                // let sb_sender = state.sb_sender.clone();

                match message {
                    RequestMessage::GetData => get_data(sender).await,
                    RequestMessage::Press { id, uuid } => {
                        let mut clients = clients.lock().unwrap();
                        for client in clients.iter_mut() {
                            client
                                .send(ClientMessage::Press {
                                    id: id.clone(),
                                    uuid: uuid.clone(),
                                })
                                .unwrap();
                        }
                    }
                    RequestMessage::Release { id, uuid } => {
                        let mut clients = clients.lock().unwrap();
                        for client in clients.iter_mut() {
                            client
                                .send(ClientMessage::Release {
                                    id: id.clone(),
                                    uuid: uuid.clone(),
                                })
                                .unwrap();
                        }
                    }
                    _ => println!("Unknown message"),
                }
            }
        }
    }

    task.abort();

    println!("Websocket disconnected");
}

// async fn action_pointer_up(clients: Clients, message: MessageData) {
//     if let Some(data) = message.data {
//         let mut clients = clients.lock().unwrap();
//
//         for client in clients.iter_mut() {
//             let json = json!({
//                 "name": "onPress",
//                 "data": data,
//             })
//             .to_string();
//
//             let _ = client.send(Message::Text(json.into())).await;
//         }
//     }
// }

// async fn do_action(sb_sender: Sender<SBMessage>, message: MessageId) {
//     if let Some(id) = message.payload {
//         match sb_sender.send(SBMessage::DoAction(id)) {
//             Ok(_) => {}
//             Err(error) => {
//                 tracing::error!("{}", error.to_string());
//             }
//         }
//     }
// }

async fn get_data(socket: Arc<Mutex<SplitSink<WebSocket, Message>>>) {
    let response = json!({
        "name": "get_data",
        "payload": {
            "deck": get_deck(),
            "settings": get_settings(),
        }
    });

    match serde_json::to_string(&response) {
        Ok(json) => {
            let mut socket = socket.lock().await;
            socket.send(Message::Text(json.into())).await.unwrap();
        }
        Err(error) => {
            tracing::error!("{}", error);
        }
    }
}
