use std::sync::Arc;

use tauri::{AppHandle, Manager};

use crate::state::{AppState, ClientMessage, ServerMessage};

#[tauri::command]
pub async fn deck_update(app: AppHandle) {
    let state = app.state::<Arc<AppState>>();

    state
        .server_sender
        .send(ServerMessage::DataUpdated)
        .expect("error while sending event");
}

#[tauri::command]
pub async fn settings_update(app: AppHandle) {
    let state = app.state::<Arc<AppState>>();

    let _ = state.server_sender.send(ServerMessage::DataUpdated);
    let _ = state.client_sender.send(ClientMessage::SettingsUpdated);
}

#[tauri::command]
pub async fn frontend_ready(app: AppHandle) {
    let state = app.state::<Arc<AppState>>();

    state.emit_status().await;
}
