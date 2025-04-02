use axum::{
    Router,
    extract::{State, ws::WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
};
use std::sync::OnceLock;
use std::{net::SocketAddr, path::Path, sync::Arc};
use tauri::{AppHandle, Manager, path::BaseDirectory};
use tokio::sync::broadcast::{self, Sender};
use tower_http::services::ServeDir;
use websocket::handle_socket;

mod websocket;

static APP_HANDLE: OnceLock<AppHandle> = OnceLock::new();
static SENDER: OnceLock<Arc<Sender<String>>> = OnceLock::new();

/// # Panics
pub fn app_handle<'a>() -> &'a AppHandle {
    APP_HANDLE.get().unwrap()
}

/// # Panics
pub fn sender<'a>() -> &'a Arc<Sender<String>> {
    SENDER.get().unwrap()
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn update() {
    let result = sender().send(String::from("update"));

    if let Err(message) = result {
        dbg!(message);
    }
}

/// # Panics
///
/// Will panic if can't setup
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .setup(|app| {
            let deck_path = app.path().resolve("deck", BaseDirectory::Resource)?;
            tauri::async_runtime::spawn(serve(using_serve_dir(&deck_path), 3001));

            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![update])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    APP_HANDLE.set(app.handle().to_owned()).unwrap();

    app.run(|_, _| {});
}

fn using_serve_dir(path: &Path) -> Router {
    let (tx, _rx) = broadcast::channel::<String>(3);
    let state = Arc::new(tx);

    SENDER.set(state.clone()).unwrap();

    Router::new()
        .nest_service("/deck", ServeDir::new(path))
        .route(
            "/ws",
            get(
                move |ws: WebSocketUpgrade, state: State<Arc<Sender<String>>>| {
                    handle_websocket(ws, state)
                },
            ),
        )
        .with_state(state)
}

async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[allow(clippy::unused_async)]
async fn handle_websocket(
    ws: WebSocketUpgrade,
    state: State<Arc<Sender<String>>>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}
