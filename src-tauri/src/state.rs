use serde::{Deserialize, Serialize};
use tauri::Emitter;
use tokio::sync::{
    Mutex,
    broadcast::{self},
};

use crate::app_handle;

#[derive(Debug, Clone)]
pub enum ClientMessage {
    SettingsUpdated,
    DoAction(String),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ServerMessage {
    DataUpdated,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SocketStatus {
    #[serde(rename = "connected")]
    Connected,
    #[serde(rename = "disconnected")]
    Disconnected,
}

#[derive(Debug)]
pub struct AppState {
    pub status: Mutex<SocketStatus>,
    pub server_sender: broadcast::Sender<ServerMessage>,
    pub client_sender: broadcast::Sender<ClientMessage>,
}

impl AppState {
    pub fn new() -> Self {
        let (socket_tx, _rx) = broadcast::channel::<ServerMessage>(10);
        let (client_tx, _rx) = broadcast::channel::<ClientMessage>(10);

        AppState {
            status: Mutex::new(SocketStatus::Disconnected),
            server_sender: socket_tx,
            client_sender: client_tx.clone(),
        }
    }

    pub async fn set_status(&self, value: SocketStatus) {
        let mut status = self.status.lock().await;
        *status = value.clone();

        app_handle().emit::<SocketStatus>("streamerbot-status", value).unwrap();
    }

    pub async fn emit_status(&self) {
        let status = self.status.lock().await.clone();

        app_handle().emit::<SocketStatus>("streamerbot-status", status).unwrap();
    }
}
