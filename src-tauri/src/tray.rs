use std::{error::Error, sync::OnceLock};

use tauri::{
    App, Manager,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent, TrayIconId},
};

use crate::{close_app, settings::get_tray_value};

pub static TRAY_ID: OnceLock<TrayIconId> = OnceLock::new();

pub fn build_tray(app: &mut App) -> Result<(), Box<dyn Error>> {
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let open_item = MenuItem::with_id(app, "open", "Open", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&open_item, &quit_item])?;

    let tray = TrayIconBuilder::new()
        .menu(&menu)
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                println!("left click pressed and released");
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.unminimize();
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                println!("quit menu item was clicked");
                close_app(app);
                app.exit(0);
            }
            "open" => {
                println!("open menu item was clicked");
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.unminimize();
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            _ => {
                println!("menu item {:?} not handled", event.id);
            }
        })
        .icon(app.default_window_icon().unwrap().clone())
        .build(app)?;

    TRAY_ID.set(tray.id().clone()).unwrap();

    let tray_value = get_tray_value().unwrap();
    tray.set_visible(tray_value).unwrap();

    Ok(())
}
