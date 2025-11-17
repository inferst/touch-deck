use std::sync::Arc;

use serde::{Deserialize, Serialize};
use tauri::Emitter;
use tauri_plugin_shell::process::CommandChild;
use tokio::sync::{Mutex, broadcast, mpsc};

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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ClientMessage {
    Press{id: String, uuid: String},
    Release{id: String, uuid: String},
}

pub type Clients = Arc<std::sync::Mutex<Vec<mpsc::UnboundedSender<ClientMessage>>>>;

#[derive(Debug)]
pub struct AppState {
    pub data: Mutex<AppData>,
    pub server_sender: broadcast::Sender<ServerMessage>,
    pub clients: Clients,
    // Streamer.bot
    pub sb_sender: broadcast::Sender<SBMessage>,
    pub plugin_manager: Arc<std::sync::Mutex<Option<CommandChild>>>,
}

impl AppState {
    pub fn new() -> Self {
        let (socket_tx, _rx) = broadcast::channel::<ServerMessage>(1);
        let (sb_tx, _rx) = broadcast::channel::<SBMessage>(1);

        let data = Mutex::new(AppData {
            status: SocketStatus::Disconnected,
        });

        let clients: Clients = Arc::new(std::sync::Mutex::new(vec![]));

        AppState {
            data,
            server_sender: socket_tx,
            sb_sender: sb_tx.clone(),
            clients,
            plugin_manager: Arc::new(std::sync::Mutex::new(None)),
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
