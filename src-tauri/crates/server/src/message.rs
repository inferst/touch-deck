use database::models::{ActionSettings, Title};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum WsMessage {
    Event {
        event: Event,
    },
    Request {
        request_id: Uuid,
        event: RequestEvent,
    },
    Response {
        request_id: Uuid,
        event: ResponseEvent,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "event", rename_all = "snake_case")]
pub enum Event {
    PressAction {
        instance_id: Uuid,
        action_id: String,
    },
    ReleaseAction {
        instance_id: Uuid,
        action_id: String,
    },
    SetTitle {
        instance_id: Uuid,
        action_id: i32,
        value: String,
    },
    SetActionSettings {
        instance_id: Uuid,
        action_id: i32,
        value: Value,
    },
    SetPluginSettings {
        uuid: Uuid,
        value: Value,
    },
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "event", rename_all = "snake_case")]
pub enum RequestEvent {
    GetTitle { instance_id: Uuid, action_id: i32 },
    GetActionSettings { instance_id: Uuid, action_id: i32 },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "event", rename_all = "snake_case")]
pub enum ResponseEvent {
    GetTitle { title: Title },
    GetActionSettings { settings: ActionSettings },
}

impl ResponseEvent {
    pub fn to_string(self, request_id: Uuid) -> String {
        let response = WsMessage::Response {
            request_id,
            event: self,
        };

        serde_json::to_string(&response).unwrap()
    }
}
