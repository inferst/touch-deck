use serde::{Deserialize, Serialize};
use tauri::Emitter;
use tokio::sync::{Mutex, broadcast};

use crate::app_handle;

#[derive(Debug, Clone)]
pub enum SBMessage {
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
    #[serde(rename = "connecting")]
    Connecting,
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
    // Streamer.bot
    pub sb_sender: broadcast::Sender<SBMessage>,
}

impl AppState {
    pub fn new() -> Self {
        let (socket_tx, _rx) = broadcast::channel::<ServerMessage>(1);
        let (sb_tx, _rx) = broadcast::channel::<SBMessage>(1);

        let data = Mutex::new(AppData {
            status: SocketStatus::Disconnected,
        });

        AppState {
            data,
            server_sender: socket_tx,
            sb_sender: sb_tx.clone(),
        }
    }

    pub async fn set_status(&self, status: SocketStatus) {
        let mut data = self.data.lock().await;
        data.status = status;

        app_handle()
            .emit::<AppData>("state_update", data.clone())
            .unwrap();
    }
}
