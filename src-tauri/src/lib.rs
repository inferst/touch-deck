use axum::{
    Router,
    extract::{State, ws::WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
};
use commands::{deck_update, get_deck_url, get_state, settings_update};
use state::AppState;
use std::sync::{Arc, OnceLock};
use std::{net::SocketAddr, path::Path};
use tauri::{AppHandle, Manager, path::BaseDirectory};
use tower_http::services::ServeDir;
use websocket::{client::client, server::handle_socket};

use crate::{
    database::{DB_POOL, init_db, run_migrations},
    models::ProfilePage,
    settings::get_tray_value,
    tray::build_tray,
};

mod commands;
mod database;
mod get_ip;
mod models;
mod settings;
mod state;
mod tray;
mod websocket;

const PORT: u16 = 3001;

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
    tracing_subscriber::fmt::init();

    init_db().await;
    run_migrations().await;

    let connection = DB_POOL.get().unwrap();

    // let q = "SELECT id, name FROM profile";
    // let profiles = sqlx::query_as::<_, Profile>(q)
    //     .fetch_all(connection)
    //     .await
    //     .unwrap();

    let profiles = sqlx::query_as!(
        ProfilePage,
        r#"
        SELECT
            profile.id as id,
            profile.name as name,
            page.id as page_id,
            page.name as page_name,
            page.icon as page_icon
        FROM profile
        INNER JOIN page ON profile.id = page.profile_id
        "#
    )
    .fetch_all(connection)
    .await
    .unwrap();

    dbg!(profiles);

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .setup(|app| {
            let _ = build_tray(app);

            let state = Arc::new(AppState::new());
            let socket_state = state.clone();

            app.manage(state);

            let deck_path = app.path().resolve("deck", BaseDirectory::Resource)?;
            tokio::spawn(serve(using_serve_dir(&deck_path, socket_state), PORT));

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let tray_value = get_tray_value().unwrap();
                if tray_value {
                    api.prevent_close();
                    window.hide().unwrap();
                }
            }
        })
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_state,
            deck_update,
            settings_update,
            get_deck_url,
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
