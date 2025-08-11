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
pub struct Streamerbot {
    #[serde(default = "default_host")]
    pub host: String,
    #[serde(default = "default_port")]
    pub port: u16,
    #[serde(default = "default_endpoint")]
    pub endpoint: String,
}

pub fn default_host() -> String {
    "127.0.0.1".to_string()
}

pub fn default_port() -> u16 {
    8080
}

pub fn default_endpoint() -> String {
    "/".to_string()
}

pub fn get_pages() -> Value {
    store().get("pages").unwrap()
}

pub fn get_layout() -> Value {
    store().get("layout").unwrap()
}

pub fn get_streamerbot_settings() -> serde_json::Result<Streamerbot> {
    let value = store()
        .get("streamerbot")
        .unwrap_or(Value::Object(Map::new()));
    let streamerbot = from_value(value)?;
    Ok(streamerbot)
}
