use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};

use crate::{
    PORT,
    get_ip::get_ip,
    state::{AppData, AppState, SBMessage, ServerMessage},
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
    let _ = state.sb_sender.send(SBMessage::SettingsUpdated);
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
