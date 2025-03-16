use std::{net::SocketAddr, path::Path};

use axum::Router;
use tauri::{Manager, path::BaseDirectory};
use tower_http::services::ServeDir;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {name}! You've been greeted from Rust!")
}

/// # Panics
///
/// Will panic if can't setup
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if !cfg!(dev) {
                let deck_path = app.path().resolve("deck", BaseDirectory::Resource)?;
                tauri::async_runtime::spawn(serve(using_serve_dir(&deck_path), 3000));
            }

            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn using_serve_dir(path: &Path) -> Router {
    Router::new().nest_service("/deck", ServeDir::new(path))
}

async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
