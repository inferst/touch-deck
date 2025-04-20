use axum::{
    Router,
    extract::{State, ws::WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
};
use commands::{deck_update, get_state, settings_update};
use state::AppState;
use std::sync::{Arc, OnceLock};
use std::{net::SocketAddr, path::Path};
use tauri::{AppHandle, Manager, path::BaseDirectory};
use tower_http::services::ServeDir;
use websocket::{client::client, server::handle_socket};

mod commands;
mod state;
mod websocket;

static APP_HANDLE: OnceLock<AppHandle> = OnceLock::new();

/// # Panics
pub fn app_handle<'a>() -> &'a AppHandle {
    APP_HANDLE.get().unwrap()
}

/// # Panics
///
/// Will panic if can't setup
#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    let app = tauri::Builder::default()
        .setup(|app| {
            let state = Arc::new(AppState::new());
            let socket_state = state.clone();

            app.manage(state);

            let deck_path = app.path().resolve("deck", BaseDirectory::Resource)?;
            tokio::spawn(serve(using_serve_dir(&deck_path, socket_state), 3001));

            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_state,
            deck_update,
            settings_update
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    APP_HANDLE.set(app.handle().to_owned()).unwrap();

    app.run(|_, _| {});
}

fn using_serve_dir(path: &Path, state: Arc<AppState>) -> Router {
    let client_state = state.clone();

    tokio::spawn(async {
        client(client_state).await;
    });

    Router::new()
        .nest_service("/deck", ServeDir::new(path))
        .route(
            "/ws",
            get(move |ws: WebSocketUpgrade, state: State<Arc<AppState>>| {
                handle_websocket(ws, state)
            }),
        )
        .with_state(state)
}

async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    axum::serve(listener, app).await.unwrap();
}

#[allow(clippy::unused_async)]
async fn handle_websocket(ws: WebSocketUpgrade, state: State<Arc<AppState>>) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}
