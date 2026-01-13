use axum::{
    Router,
    extract::{State, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
};
use std::{error::Error, net::SocketAddr, path::PathBuf, sync::Arc};
use tokio::sync::{RwLock, broadcast};
use tower_http::services::ServeDir;

use crate::socket::handle_socket;

mod message;
mod socket;

pub static PORT: u16 = 3001;

pub struct Options {
    pub app_path: PathBuf,
    pub data_path: PathBuf,
}

pub struct AppState {
    pub broadcaster: broadcast::Sender<String>,
}

pub type SharedState = Arc<RwLock<AppState>>;

impl Default for AppState {
    fn default() -> Self {
        let (tx, _) = broadcast::channel(256);

        Self { broadcaster: tx }
    }
}

pub async fn start(options: Options) -> Result<(), Box<dyn Error>> {
    let state = Arc::new(RwLock::new(AppState::default()));

    let addr = SocketAddr::from(([0, 0, 0, 0], PORT));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    let app = router(&options, state);

    axum::serve(listener, app).await?;

    Ok(())
}

fn router(options: &Options, state: SharedState) -> Router {
    let deck_path = options.app_path.join("deck");
    let plugins_path = options.data_path.join("plugins");

    Router::new()
        .nest_service("/deck", ServeDir::new(deck_path))
        .nest_service("/plugin", ServeDir::new(plugins_path))
        .route("/ws", get(ws_handler))
        .with_state(state)
}

async fn ws_handler(ws: WebSocketUpgrade, State(state): State<SharedState>) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}
