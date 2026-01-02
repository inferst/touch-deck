use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::database::{
    get_db_connection,
    models::{Board, Item, Page, Profile, Title},
    schema::title::{self, table},
};

#[tauri::command]
pub async fn get_profile() -> Profile {
    use crate::database::schema::profile::dsl::*;

    let mut connection = get_db_connection().unwrap();

    profile
        .filter(id.eq(1))
        .select(Profile::as_select())
        .get_result(&mut connection)
        .expect("Error loading profile")
}

#[tauri::command]
pub async fn get_board(filter_id: i32) -> Board {
    use crate::database::schema::board::dsl::*;

    let mut connection = get_db_connection().unwrap();

    board
        .filter(id.eq(filter_id))
        .select(Board::as_select())
        .get_result(&mut connection)
        .expect("Error loading board")
}

#[tauri::command]
pub async fn get_pages() -> Vec<Page> {
    use crate::database::schema::page::dsl::*;

    let mut connection = get_db_connection().unwrap();

    page.select(Page::as_select())
        .get_results(&mut connection)
        .expect("Error loading board")
}

#[tauri::command]
pub async fn get_items(board_id: i64) -> Vec<Item> {
    use crate::database::schema::item::dsl::*;

    let mut connection = get_db_connection().unwrap();

    item.select(Item::as_select())
        .get_results(&mut connection)
        .expect("Error loading board")
}

#[derive(Serialize)]
pub struct Action {
    item: Item,
    title: Option<Title>,
}

#[tauri::command]
pub async fn get_actions(board_id: i64) -> Vec<Action> {
    let mut connection = get_db_connection().unwrap();

    use crate::database::schema::item::dsl::*;

    let actions: Vec<Action> = item
        .left_join(title::table)
        .select((Item::as_select(), Option::<Title>::as_select()))
        .load::<(Item, Option<Title>)>(&mut connection)
        .map(|results| {
            results
                .iter()
                .map(|(item_data, title)| Action {
                    item: (*item_data).clone(),
                    title: (*title).clone(),
                })
                .collect()
        })
        .unwrap();

    actions
}
