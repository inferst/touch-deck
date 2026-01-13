use crate::database::schema::{
    action_settings, board, color, icon, image, item, layout, page, profile, style, title,
};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(
    TS, Queryable, Selectable, Identifiable, Insertable, Debug, Clone, Serialize, Deserialize,
)]
#[diesel(table_name = profile)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Profile {
    pub id: i32,
    pub name: String,
}

#[derive(TS, Queryable, Selectable, Insertable, Debug, Clone, Serialize, Deserialize)]
#[diesel(table_name = layout)]
#[derive(AsChangeset)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Layout {
    pub profile_id: i32,
    pub rows: Option<i32>,
    pub cols: Option<i32>,
}

#[derive(TS, Queryable, Selectable, Insertable, Debug, Clone, Serialize, Deserialize)]
#[diesel(table_name = style)]
#[derive(AsChangeset)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Style {
    profile_id: i32,
    spacing: Option<i32>,
    border_radius: Option<i32>,
    background_image: Option<String>,
    background_color: Option<String>,
}

#[derive(TS, Queryable, Selectable, Identifiable, Debug, Clone, Serialize)]
#[diesel(table_name = board)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Board {
    pub id: i32,
    pub profile_id: i32,
}

#[derive(TS, Insertable, Debug, Clone, Serialize, Deserialize)]
#[diesel(table_name = board)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct CreateBoard {
    pub profile_id: i32,
}

#[derive(
    TS, Queryable, Selectable, Identifiable, Insertable, Debug, Clone, Serialize, Deserialize,
)]
#[diesel(primary_key(board_id))]
#[diesel(table_name = page)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Page {
    pub board_id: i32,
    pub position: i32,
    pub name: Option<String>,
    pub icon: Option<String>,
}

#[derive(
    TS, Queryable, Selectable, Identifiable, Insertable, Debug, Clone, Serialize, Deserialize,
)]
#[diesel(table_name = item)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Item {
    pub id: i32,
    pub board_id: i32,
    pub row: i32,
    pub col: i32,
    pub kind: String,
}

#[derive(TS, Insertable, Debug, Clone, Serialize, Deserialize)]
#[diesel(table_name = item)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct CreateItem {
    pub id: Option<i32>,
    pub board_id: i32,
    pub row: i32,
    pub col: i32,
    pub kind: String,
}

#[derive(
    TS, Queryable, Selectable, Identifiable, Associations, Debug, Clone, Serialize, Deserialize,
)]
#[diesel(primary_key(item_id))]
#[diesel(table_name = title)]
#[diesel(belongs_to(Item))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Title {
    pub item_id: i32,
    pub font: Option<String>,
    pub value: Option<String>,
    pub align: Option<String>,
    pub color: Option<String>,
    pub size: Option<i32>,
}

#[derive(TS, Insertable, Debug, Clone, Serialize, Deserialize)]
#[diesel(table_name = title)]
#[derive(AsChangeset)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct CreateTitle {
    pub item_id: Option<i32>,
    pub value: Option<String>,
    pub align: Option<String>,
    pub color: Option<String>,
    pub size: Option<i32>,
    pub font: Option<String>,
}

impl CreateTitle {
    pub fn with_item_id(self, id: i32) -> Self {
        CreateTitle {
            item_id: Some(id),
            value: self.value,
            align: self.align,
            color: self.color,
            size: self.size,
            font: self.font,
        }
    }
}

#[derive(
    TS, Queryable, Selectable, Identifiable, Associations, Debug, Clone, Serialize, Deserialize,
)]
#[diesel(primary_key(item_id))]
#[diesel(table_name = image)]
#[diesel(belongs_to(Item))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Image {
    pub item_id: i32,
    pub file: Option<String>,
    pub image_type: Option<String>,
}

#[derive(TS, Insertable, Debug, Clone, Serialize, Deserialize)]
#[diesel(table_name = image)]
#[derive(AsChangeset)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct CreateImage {
    pub item_id: Option<i32>,
    pub file: Option<String>,
    pub image_type: Option<String>,
}

impl CreateImage {
    pub fn with_item_id(self, id: i32) -> Self {
        CreateImage {
            item_id: Some(id),
            file: self.file,
            image_type: self.image_type,
        }
    }
}

#[derive(
    TS, Queryable, Selectable, Identifiable, Associations, Debug, Clone, Serialize, Deserialize,
)]
#[diesel(primary_key(item_id))]
#[diesel(table_name = icon)]
#[diesel(belongs_to(Item))]
#[derive(AsChangeset)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Icon {
    pub item_id: i32,
    pub name: Option<String>,
    pub color: Option<String>,
}

#[derive(TS, Insertable, Debug, Clone, Serialize, Deserialize)]
#[diesel(table_name = icon)]
#[derive(AsChangeset)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct CreateIcon {
    pub item_id: Option<i32>,
    pub name: Option<String>,
    pub color: Option<String>,
}

impl CreateIcon {
    pub fn with_item_id(self, id: i32) -> Self {
        CreateIcon {
            item_id: Some(id),
            name: self.name,
            color: self.color,
        }
    }
}

#[derive(
    TS, Queryable, Selectable, Identifiable, Associations, Debug, Clone, Serialize, Deserialize,
)]
#[diesel(primary_key(item_id))]
#[diesel(table_name = color)]
#[diesel(belongs_to(Item))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Color {
    pub item_id: i32,
    pub value: Option<String>,
}

#[derive(TS, Insertable, Debug, Clone, Serialize, Deserialize)]
#[diesel(table_name = color)]
#[derive(AsChangeset)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct CreateColor {
    pub item_id: Option<i32>,
    pub value: Option<String>,
}

impl CreateColor {
    pub fn with_item_id(self, id: i32) -> Self {
        CreateColor {
            item_id: Some(id),
            value: self.value,
        }
    }
}

#[derive(TS, Queryable, Selectable, Insertable, Serialize, Deserialize)]
#[diesel(table_name = action_settings)]
#[derive(AsChangeset)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct ActionSettings {
    pub item_id: i32,
    pub settings: Option<String>,
}
