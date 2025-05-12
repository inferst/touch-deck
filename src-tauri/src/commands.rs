use std::sync::Arc;

use local_ip_address::local_ip;
use tauri::{AppHandle, Manager};

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

#[tauri::command]
pub async fn get_deck_url(_app: AppHandle) -> String {
    let ip = local_ip().unwrap();
    format!("http://{}:{}/deck", ip.to_string(), PORT)
}
