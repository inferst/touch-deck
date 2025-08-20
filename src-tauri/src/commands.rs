use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};

use crate::{
    APP_HANDLE, PORT,
    get_ip::get_ip,
    settings::get_tray_value,
    state::{AppData, AppState, SBMessage, ServerMessage},
    tray::TRAY_ID,
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

    let tray_value = get_tray_value().unwrap();

    let tray_id = TRAY_ID.get().unwrap();
    if let Some(tray) = APP_HANDLE.get().unwrap().tray_by_id(tray_id) {
        tray.set_visible(tray_value).unwrap();
    }
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
