use crate::database::schema::{
    board, color, icon, image, item, page, plugin_action, profile, title,
};
use diesel::prelude::*;
use serde::Serialize;

#[derive(Queryable, Selectable, Identifiable, Debug)]
#[diesel(table_name = profile)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Profile {
    pub id: i32,
    pub name: String,
}

#[derive(Queryable, Selectable, Identifiable, Debug)]
#[diesel(table_name = board)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Board {
    pub id: i32,
    pub profile_id: i32,
    pub rows: i32,
    pub cols: i32,
}

#[derive(Queryable, Selectable, Identifiable, Debug)]
#[diesel(primary_key(board_id))]
#[diesel(table_name = page)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Page {
    pub board_id: i32,
    pub name: Option<String>,
    pub icon: Option<String>,
}

#[derive(Queryable, Selectable, Identifiable, Debug, Clone, Serialize)]
#[diesel(table_name = item)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Item {
    pub id: i32,
    pub board_id: i32,
    pub row: i32,
    pub col: i32,
}

#[derive(Queryable, Selectable, Identifiable, Associations, Debug, Clone, Serialize)]
#[diesel(primary_key(item_id))]
#[diesel(table_name = title)]
#[diesel(belongs_to(Item))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Title {
    pub item_id: i32,
    pub font_id: i32,
    pub value: Option<String>,
    pub align: Option<i32>,
    pub color: Option<String>,
    pub size: Option<i32>,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = image)]
#[diesel(belongs_to(Item))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Image {
    pub item_id: i32,
    pub file_name: Option<String>,
    pub file_type: Option<String>,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = icon)]
#[diesel(belongs_to(Item))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Icon {
    pub item_id: i32,
    pub name: Option<String>,
    pub color: Option<String>,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = color)]
#[diesel(belongs_to(Item))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Color {
    pub item_id: i32,
    pub value: Option<String>,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = plugin_action)]
#[diesel(belongs_to(Item))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct PluginAction {
    pub item_id: i32,
    pub uuid: String,
    pub settings: Option<String>,
}
