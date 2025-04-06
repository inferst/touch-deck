use axum::{
    Router,
    extract::{State, ws::WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
};
use std::sync::OnceLock;
use std::{net::SocketAddr, path::Path};
use tauri::{AppHandle, Manager, path::BaseDirectory};
use tokio::sync::broadcast::{self, Sender};
use tower_http::services::ServeDir;
use websocket::{client::client, server::handle_socket};

mod websocket;

#[derive(Debug, Clone)]
pub enum ClientMessage {
    SettingsUpdate,
    DoAction(String),
}

static APP_HANDLE: OnceLock<AppHandle> = OnceLock::new();
static SOCKET_SENDER: OnceLock<Sender<String>> = OnceLock::new();
static CLIENT_SENDER: OnceLock<Sender<ClientMessage>> = OnceLock::new();

/// # Panics
pub fn app_handle<'a>() -> &'a AppHandle {
    APP_HANDLE.get().unwrap()
}

/// # Panics
pub fn socket_sender<'a>() -> &'a Sender<String> {
    SOCKET_SENDER.get().unwrap()
}

/// # Panics
pub fn client_sender<'a>() -> &'a Sender<ClientMessage> {
    CLIENT_SENDER.get().unwrap()
}

#[tauri::command]
async fn deck_update() {
    socket_sender()
        .send(String::from("getData"))
        .expect("error while sending event");
}

#[tauri::command]
async fn settings_update() {
    client_sender()
        .send(ClientMessage::SettingsUpdate)
        .expect("error while sending event");
}

/// # Panics
///
/// Will panic if can't setup
#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    let app = tauri::Builder::default()
        .setup(|app| {
            let deck_path = app.path().resolve("deck", BaseDirectory::Resource)?;
            tauri::async_runtime::spawn(serve(using_serve_dir(&deck_path), 3001));

            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![deck_update, settings_update])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    APP_HANDLE.set(app.handle().to_owned()).unwrap();

    app.run(|_, _| {});
}

#[derive(Debug, Clone)]
struct SocketState {
    socket_sender: Sender<String>,
    client_sender: Sender<ClientMessage>,
}

fn using_serve_dir(path: &Path) -> Router {
    let (socket_tx, _rx) = broadcast::channel::<String>(3);

    SOCKET_SENDER.set(socket_tx.clone()).unwrap();

    let (client_tx, _rx) = broadcast::channel::<ClientMessage>(3);

    CLIENT_SENDER.set(client_tx.clone()).unwrap();

    let state = SocketState {
        socket_sender: socket_tx,
        client_sender: client_tx.clone(),
    };

    tokio::spawn(async {
        client(client_tx).await;
    });

    Router::new()
        .nest_service("/deck", ServeDir::new(path))
        .route(
            "/ws",
            get(move |ws: WebSocketUpgrade, state: State<SocketState>| handle_websocket(ws, state)),
        )
        .with_state(state)
}

async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[allow(clippy::unused_async)]
async fn handle_websocket(ws: WebSocketUpgrade, state: State<SocketState>) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}
