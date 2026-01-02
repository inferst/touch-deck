use serde::{Deserialize, Serialize};
use serde_json::{Map, Value, from_value};
use std::sync::Arc;
use tauri::Wry;
use tauri_plugin_store::{Store, StoreExt};

use crate::app_handle;

const SETTINGS_PATH: &str = "settings.json";

pub fn store() -> Arc<Store<Wry>> {
    app_handle().store(SETTINGS_PATH).unwrap()
}

#[derive(Deserialize, Serialize)]
pub struct Connection {
    #[serde(default = "default_streamerbot")]
    pub streamerbot: Streamerbot,
}

#[derive(Deserialize, Serialize)]
pub struct Settings {
    #[serde(default = "default_connection")]
    pub connection: Connection,
}

#[derive(Deserialize, Serialize)]
pub struct Streamerbot {
    #[serde(default = "default_host")]
    pub host: String,
    #[serde(default = "default_port")]
    pub port: u16,
    #[serde(default = "default_endpoint")]
    pub endpoint: String,
}

pub fn default_connection() -> Connection {
    Connection {
        streamerbot: default_streamerbot(),
    }
}

pub fn default_streamerbot() -> Streamerbot {
    Streamerbot {
        host: default_host(),
        port: default_port(),
        endpoint: default_endpoint(),
    }
}

pub fn default_host() -> String {
    "127.0.0.1".to_string()
}

pub fn default_port() -> u16 {
    8080
}

pub fn default_endpoint() -> String {
    "/".into()
}

pub fn get_deck() -> Value {
    store().get("deck").unwrap()
}

pub fn get_settings() -> Value {
    store().get("settings").unwrap()
}

pub fn get_streamerbot_settings() -> serde_json::Result<Streamerbot> {
    let value = store().get("settings").unwrap_or(Value::Object(Map::new()));
    let settings: Settings = from_value(value)?;
    Ok(settings.connection.streamerbot)
}

pub fn set_action_settings(action_setings: Value) {
    let value = store().get("settings").unwrap_or(Value::Object(Map::new()));
}

pub fn get_tray_value() -> serde_json::Result<bool> {
    let value = store().get("tray").unwrap_or(Value::Bool(false));
    let value = from_value(value)?;
    Ok(value)
}
