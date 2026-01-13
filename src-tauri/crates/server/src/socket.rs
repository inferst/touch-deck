use axum::extract::ws::{Message, WebSocket};
use database::{
    get_connection,
    models::{ActionSettings, Title},
    schema::{action_settings, plugin_settings, title},
};
use diesel::{insert_into, prelude::*};
use futures::StreamExt;
use std::error::Error;
use tokio::select;
use uuid::Uuid;

use crate::{
    SharedState,
    message::{Event, RequestEvent, ResponseEvent, WsMessage},
};

pub async fn handle_socket(mut socket: WebSocket, state: SharedState) {
    let mut rx = state.read().await.broadcaster.subscribe();

    loop {
        select! {
            msg = socket.next() => {
                match msg {
                    Some(Ok(Message::Text(text))) => {
                        if let Err(e) = handle_message(&mut socket, &state, &text).await {
                            tracing::error!("handle_message error: {:?}", e);
                        }
                    }
                    Some(Ok(_)) => {}
                    Some(Err(e)) => {
                        tracing::error!("ws error: {:?}", e);
                        break;
                    }
                    None => break,
                }
            }

            broadcast_msg = rx.recv() => {
                match broadcast_msg {
                    Ok(text) => {
                        if socket.send(Message::Text(text.into())).await.is_err() {
                            break;
                        }
                    }
                    Err(_) => break,
                }
            }
        }
    }

    tracing::info!("Client disconnected");
}

async fn handle_message(
    socket: &mut WebSocket,
    state: &SharedState,
    raw: &str,
) -> Result<(), Box<dyn Error>> {
    let msg: WsMessage = serde_json::from_str(raw)?;

    match msg {
        WsMessage::Event { event } => handle_event(state, &event).await?,
        WsMessage::Request { request_id, event } => {
            handle_request(socket, request_id, &event).await?;
        }
        _ => {}
    }

    Ok(())
}

async fn emit(state: &SharedState, msg: WsMessage) -> Result<(), Box<dyn Error>> {
    let serialized = serde_json::to_string(&msg)?;

    let broadcaster = state.read().await.broadcaster.clone();
    let _ = broadcaster.send(serialized);

    Ok(())
}

async fn handle_event(state: &SharedState, event: &Event) -> Result<(), Box<dyn Error>> {
    match event {
        Event::PressAction {
            instance_id: _,
            action_id: _,
        } => {
            let msg = WsMessage::Event {
                event: event.clone(),
            };

            emit(state, msg).await?;
        }
        Event::ReleaseAction {
            instance_id: _,
            action_id: _,
        } => {
            let msg = WsMessage::Event {
                event: event.clone(),
            };

            emit(state, msg).await?;
        }
        Event::SetTitle {
            instance_id: _,
            action_id,
            value,
        } => {
            let mut connection = get_connection()?;

            let values = (title::item_id.eq(action_id), title::value.eq(value));

            insert_into(title::table)
                .values(values)
                .on_conflict(title::item_id)
                .do_update()
                .set(values)
                .execute(&mut connection)?;
        }
        Event::SetActionSettings {
            instance_id: _,
            action_id,
            value,
        } => {
            let mut connection = get_connection()?;

            let values = (
                action_settings::item_id.eq(action_id),
                action_settings::settings.eq(value.as_str()),
            );

            insert_into(action_settings::table)
                .values(values)
                .on_conflict(action_settings::item_id)
                .do_update()
                .set(values)
                .execute(&mut connection)?;

            let msg = WsMessage::Event {
                event: event.clone(),
            };

            emit(state, msg).await?;
        }
        Event::SetPluginSettings { uuid, value } => {
            let mut connection = get_connection()?;

            let uuid = uuid.to_string();

            let values = (
                plugin_settings::uuid.eq(&uuid),
                plugin_settings::settings.eq(value.as_str()),
            );

            insert_into(plugin_settings::table)
                .values(values)
                .on_conflict(plugin_settings::uuid)
                .do_update()
                .set(values)
                .execute(&mut connection)?;

            let msg = WsMessage::Event {
                event: event.clone(),
            };

            emit(state, msg).await?;
        }
    }

    Ok(())
}

async fn handle_request(
    socket: &mut WebSocket,
    request_id: Uuid,
    event: &RequestEvent,
) -> Result<(), Box<dyn Error>> {
    match event {
        RequestEvent::GetTitle {
            instance_id: _,
            action_id,
        } => {
            let mut connection = get_connection()?;

            let title = title::table
                .select(Title::as_select())
                .filter(title::item_id.eq(action_id))
                .get_result(&mut connection)?;

            let response = ResponseEvent::GetTitle { title };

            let msg = Message::Text(response.to_string(request_id).into());

            socket.send(msg).await?;
        }
        RequestEvent::GetActionSettings {
            instance_id: _,
            action_id,
        } => {
            let mut connection = get_connection()?;

            let settings = action_settings::table
                .select(ActionSettings::as_select())
                .filter(action_settings::item_id.eq(action_id))
                .get_result(&mut connection)?;

            let response = ResponseEvent::GetActionSettings { settings };

            let msg = Message::Text(response.to_string(request_id).into());

            socket.send(msg).await?;
        }
    }

    Ok(())
}
