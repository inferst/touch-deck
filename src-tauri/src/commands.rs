use local_ip_address::list_afinet_netifas;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};

use crate::{
    PORT,
    state::{AppData, AppState, ClientMessage, ServerMessage},
};

#[tauri::command]
pub async fn deck_update(app: AppHandle) {
    let state = app.state::<Arc<AppState>>();

    let _ = state.server_sender.send(ServerMessage::DataUpdated);
}

#[tauri::command]
pub async fn settings_update(app: AppHandle) {
    let state = app.state::<Arc<AppState>>();

    let _ = state.server_sender.send(ServerMessage::DataUpdated);
    let _ = state.client_sender.send(ClientMessage::SettingsUpdated);
}

#[tauri::command]
pub async fn get_state(app: AppHandle) -> AppData {
    let state = app.state::<Arc<AppState>>();
    let guard = state.data.lock().await;
    guard.clone()
}

#[derive(Clone, Serialize, Deserialize)]
struct ErrorEvent {
    message: String,
}

#[derive(thiserror::Error, Debug)]
enum Error {
    NotFound,
    LocalIpError(#[from] local_ip_address::Error),
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

fn get_ip() -> Result<String, Error> {
    let list = list_afinet_netifas().map_err(Error::LocalIpError)?;

    let ip = list.into_iter().find_map(|(_, ip)| {
        if ip.to_string().starts_with("192.168.") {
            Some(ip)
        } else {
            None
        }
    });

    match ip {
        Some(ip) => Ok(ip.to_string()),
        None => Err(Error::NotFound),
    }
}

#[tauri::command]
pub async fn get_deck_url(app: AppHandle) -> String {
    match get_ip() {
        Ok(ip) => {
            format!("http://{}:{}/deck", ip, PORT)
        }
        Err(err) => {
            app.emit(
                "error",
                ErrorEvent {
                    message: err.to_string(),
                },
            )
            .unwrap();
            "".to_string()
        }
    }
}
