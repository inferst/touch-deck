use std::{error::Error, sync::Arc};

use server::Options;
use tauri::{App, Builder, Manager, Wry};

use crate::{
    plugin_loader::{stop, start},
    settings::get_tray_value,
    state::AppState,
    tray,
};

pub fn build(builder: Builder<Wry>) -> Builder<Wry> {
    builder.setup(setup).on_window_event(|window, event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            let tray_value = get_tray_value().unwrap();

            if tray_value {
                api.prevent_close();
                window.hide().unwrap();
            } else {
                stop(window.app_handle()).unwrap();
            }
        }
    })
}

pub fn setup(app: &mut App) -> Result<(), Box<dyn Error>> {
    let app = app.handle().clone();

    tauri::async_runtime::spawn(async move {
        let _ = tray::build(&app);

        let state = Arc::new(AppState::new());

        app.manage(state);

        let data_path = app.path().app_data_dir().unwrap();
        let app_path = app.path().resource_dir().unwrap();

        if let Err(error) = database::setup(data_path.clone()).await {
            tracing::error!("Database error: {}", error);
        }

        start(&app);

        let options = Options {
            app_path,
            data_path,
        };

        tokio::spawn(async move {
            let _ = server::start(options).await;
        });

        if tauri::is_dev() {
            let window = app.get_webview_window("main").unwrap();
            window.maximize().unwrap();
            window.open_devtools();
        }
    });

    Ok(())
}
