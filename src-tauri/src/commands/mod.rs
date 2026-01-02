use serde::{Deserialize, Serialize};
use std::{fs, sync::Arc};
use tauri::{AppHandle, Emitter, Manager};

use crate::{
    APP_HANDLE, PORT,
    get_ip::get_ip,
    settings::get_tray_value,
    state::{AppData, AppState, SBMessage, ServerMessage},
    tray::TRAY_ID,
};

pub mod repository;

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

#[derive(Deserialize, Serialize)]
pub struct Action {
    name: String,
    uuid: String,
}

#[derive(Deserialize, Serialize)]
pub struct Manifest {
    name: String,
    uuid: String,
    category: String,
    description: String,
    actions: Vec<Action>,
}

#[derive(Deserialize, Serialize)]
pub struct PluginsData {
    plugins: Vec<Manifest>,
}

#[tauri::command]
pub async fn get_plugins_data(app: AppHandle) -> PluginsData {
    let plugins_path = app.path().app_data_dir().unwrap().join("plugins");

    let mut plugins_data = PluginsData { plugins: vec![] };

    if let Ok(entries) = fs::read_dir(plugins_path) {
        for entry in entries.flatten() {
            let mut path = entry.path();

            if path.is_dir() {
                path.push("manifest.json");

                if let Ok(exists) = path.try_exists()
                    && exists
                    && path.is_file()
                {
                    let json = fs::read_to_string(path).unwrap();
                    let manifest: Manifest = serde_json::from_str(&json).unwrap();

                    plugins_data.plugins.push(manifest);
                }
            }
        }
    }

    plugins_data
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
