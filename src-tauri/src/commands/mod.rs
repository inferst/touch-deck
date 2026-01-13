use serde::{Deserialize, Serialize};
use server::PORT;
use std::{fs, sync::Arc};
use tauri::{AppHandle, Builder, Emitter, Manager, Wry};

use crate::{
    APP_HANDLE,
    commands::{dto::Manifests, error::Error},
    get_ip::get_ip,
    settings::get_tray_value,
    state::{AppData, AppState, SBMessage, ServerMessage},
    tray::TRAY_ID,
};

pub mod dto;
mod error;
pub mod repository;

pub fn invoke_handler(builder: Builder<Wry>) -> Builder<Wry> {
    builder.invoke_handler(tauri::generate_handler![
        get_state,
        deck_update,
        settings_update,
        get_deck_url,
        get_plugins,
        repository::get_profiles,
        repository::get_layout,
        repository::get_style,
        repository::get_pages,
        repository::get_board,
        repository::set_action,
        repository::set_layout,
        repository::set_style,
        repository::delete_board,
        repository::create_board,
        repository::swap_items,
    ])
}

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

#[tauri::command]
pub async fn get_plugins(app: AppHandle) -> Result<Manifests, Error> {
    let app_data_dir = app.path().app_data_dir()?;
    let plugins_path = app_data_dir.join("plugins");

    let mut manifests = Manifests { plugins: vec![] };

    if let Ok(entries) = fs::read_dir(plugins_path) {
        for entry in entries.flatten() {
            let mut path = entry.path();

            if path.is_dir() {
                path.push("manifest.json");

                if path.is_file()
                    && let Ok(exists) = path.try_exists()
                    && exists
                    && let Ok(json) = fs::read_to_string(path)
                    && let Ok(manifest) = serde_json::from_str(&json)
                {
                    manifests.plugins.push(manifest);
                }
            }
        }
    }

    Ok(manifests)
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
