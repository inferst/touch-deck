use std::sync::OnceLock;
use tauri::AppHandle;

mod app;
mod commands;
mod get_ip;
mod plugin_loader;
mod settings;
mod state;
mod tray;

static APP_HANDLE: OnceLock<AppHandle> = OnceLock::new();

pub fn app_handle<'a>() -> &'a AppHandle {
    APP_HANDLE.get().unwrap()
}

// #[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    tracing_subscriber::fmt::init();

    let mut app_builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init());

    app_builder = app::build(app_builder);
    app_builder = commands::invoke_handler(app_builder);

    let app = app_builder
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    APP_HANDLE.set(app.handle().to_owned()).unwrap();

    app.run(|_, _| {});
}
