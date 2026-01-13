use server::PORT;
use std::{error::Error, fs, sync::Arc};
use tauri::{AppHandle, Manager};
use tauri_plugin_shell::{ShellExt, process::CommandEvent};
use tracing::Level;

use crate::state::AppState;

pub fn stop(app: &AppHandle) -> Result<(), Box<dyn Error>> {
    if let Some(state) = app.try_state::<Arc<AppState>>() {
        let plugin_manager = state.plugin_manager.clone();
        let mut plugin_manager = plugin_manager.lock().unwrap();
        let child = plugin_manager.take().unwrap();
        child.kill()?;
    }

    Ok(())
}

pub fn start(app: &AppHandle) -> Result<(), Box<dyn Error>> {
    tracing::span!(Level::TRACE, "plugin loader");

    let shell = app.shell();
    let mut sidecar = shell.sidecar("plugin-manager")?;

    let plugins_path = app.path().app_data_dir()?.join("plugins");

    if !plugins_path.exists()
        && let Err(error) = fs::create_dir_all(&plugins_path)
    {
        tracing::error!("couldn't create plugins folder: {}", error);
    }

    sidecar = sidecar.args([
        format!("--plugins-path={}", plugins_path.to_str().unwrap()),
        format!("--port={}", PORT),
    ]);

    let (mut rx, child) = sidecar.spawn()?;

    if let Some(app_state) = app.try_state::<Arc<AppState>>() {
        let mut plugin_manager = app_state.plugin_manager.lock().unwrap();
        *plugin_manager = Some(child);
    }

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(data) => {
                    if let Ok(text) = String::from_utf8(data) {
                        let line = text.trim();
                        tracing::info!("server stdin {}", line);
                    }
                }
                CommandEvent::Stderr(data) => {
                    if let Ok(text) = String::from_utf8(data) {
                        eprintln!("server stderr {}", text.trim());
                    }
                }
                CommandEvent::Terminated(code) => {
                    println!("server terminated unexpectedly with code {:?}", code);
                }
                _ => {}
            }
        }
    });

    Ok(())
}
