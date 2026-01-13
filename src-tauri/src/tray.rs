use std::{error::Error, sync::OnceLock};

use tauri::{
    AppHandle, Manager, Wry,
    menu::{Menu, MenuEvent, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent, TrayIconId},
};

use crate::{plugin_loader::stop, settings::get_tray_value};

pub static TRAY_ID: OnceLock<TrayIconId> = OnceLock::new();

pub fn build(app: &AppHandle) -> Result<(), Box<dyn Error>> {
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let open_item = MenuItem::with_id(app, "open", "Open", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&open_item, &quit_item])?;

    let on_tray_icon_event =
        |tray: &TrayIcon<Wry>, event: TrayIconEvent| -> Result<(), Box<dyn Error>> {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();

                if let Some(window) = app.get_webview_window("main") {
                    window.unminimize()?;
                    window.show()?;
                    window.set_focus()?;
                }
            }

            Ok(())
        };

    let on_menu_event = |app: &AppHandle, event: MenuEvent| -> Result<(), Box<dyn Error>> {
        match event.id.as_ref() {
            "quit" => {
                stop(app)?;
                app.exit(0);
            }
            "open" => {
                if let Some(window) = app.get_webview_window("main") {
                    window.unminimize()?;
                    window.show()?;
                    window.set_focus()?;
                }
            }
            _ => {}
        }

        Ok(())
    };

    let mut tray_builder = TrayIconBuilder::new()
        .menu(&menu)
        .on_tray_icon_event(move |tray, event| {
            if let Err(error) = on_tray_icon_event(tray, event) {
                tracing::error!("tray icon event error: {}", error);
            }
        })
        .on_menu_event(move |app, event| {
            if let Err(error) = on_menu_event(app, event) {
                tracing::error!("menu event error: {}", error);
            }
        });

    if let Some(icon) = app.default_window_icon() {
        tray_builder = tray_builder.icon(icon.clone());
    }

    let tray = tray_builder.build(app)?;

    TRAY_ID.set(tray.id().clone()).unwrap();

    // TODO: Refactor settings
    let tray_value = get_tray_value()?;
    tray.set_visible(tray_value)?;

    Ok(())
}
