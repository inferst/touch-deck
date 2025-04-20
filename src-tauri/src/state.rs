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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppData {
    pub status: SocketStatus,
}

#[derive(Debug)]
pub struct AppState {
    pub data: Mutex<AppData>,
    pub server_sender: broadcast::Sender<ServerMessage>,
    pub client_sender: broadcast::Sender<ClientMessage>,
}

impl AppState {
    pub fn new() -> Self {
        let (socket_tx, _rx) = broadcast::channel::<ServerMessage>(1);
        let (client_tx, _rx) = broadcast::channel::<ClientMessage>(1);

        let data = Mutex::new(AppData {
            status: SocketStatus::Disconnected,
        });

        AppState {
            data,
            server_sender: socket_tx,
            client_sender: client_tx.clone(),
        }
    }

    pub async fn set_status(&self, status: SocketStatus) {
        let mut data = self.data.lock().await;
        data.status = status;
        let new_data = data.clone();
        drop(data);

        self.set_state_data(new_data).await;
    }

    pub async fn set_state_data(&self, value: AppData) {
        let mut data = self.data.lock().await;
        *data = value.clone();

        app_handle().emit::<AppData>("state-update", value).unwrap();
    }
}
