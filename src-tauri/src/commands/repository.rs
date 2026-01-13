use diesel::update;
use diesel::{delete, dsl::max, insert_into, prelude::*};

use crate::commands::dto::{
    ActionDto, BoardDto, CreateActionDto, CreateBoardDto, PageDto, ProfileDto,
};
use crate::commands::dto::{LayoutDto, StyleDto};
use database::error::Error;
use database::get_writer;
use database::models::{Layout, Style};
use database::schema::{layout, style};
use database::{
    get_connection,
    models::{Board, Color, Icon, Image, Item, Page, Profile, Title},
    schema::{board, color, icon, image, item, page, profile, title},
};

#[tauri::command]
pub async fn create_board(board: CreateBoardDto, create_page: bool) -> Result<(), Error> {
    let writer = get_writer()?;
    let mut connection = writer.lock().unwrap();

    connection.transaction::<(), Error, _>(|connection| {
        let result: Board = insert_into(board::table)
            .values(&board.board)
            .get_result(connection)?;

        if create_page {
            let last_position: Option<i32> =
                page::table.select(max(page::position)).first(connection)?;

            let new_position = last_position.unwrap_or(0) + 1;

            insert_into(page::table)
                .values((
                    page::board_id.eq(result.id),
                    page::position.eq(new_position),
                ))
                .execute(connection)?;
        }

        Ok(())
    })
}

#[tauri::command]
pub async fn delete_board(board_id: i32) -> Result<bool, Error> {
    let writer = get_writer()?;
    let mut connection = writer.lock().unwrap();

    let result = delete(board::table)
        .filter(board::id.eq(board_id))
        .execute(&mut *connection)?;

    Ok(result > 0)
}

#[tauri::command]
pub async fn swap_items(row1: i32, col1: i32, row2: i32, col2: i32) -> Result<(), Error> {
    let writer = get_writer()?;
    let mut connection = writer.lock().unwrap();

    connection.transaction::<(), Error, _>(|connection| {
        let item1 = item::table
            .select(Item::as_select())
            .filter(item::row.eq(row1))
            .filter(item::col.eq(col1))
            .first(connection);

        let item2 = item::table
            .select(Item::as_select())
            .filter(item::row.eq(row2))
            .filter(item::col.eq(col2))
            .first(connection);

        if let Ok(item1) = item1 {
            // Sqlite doesn't support checking constraints on commit
            // We must set temporary data
            if let Ok(item2) = &item2 {
                update(item::table)
                    .filter(item::id.eq(item2.id))
                    .set((item::row.eq(-1), item::col.eq(-1)))
                    .execute(connection)?;
            }

            update(item::table)
                .filter(item::id.eq(item1.id))
                .set((item::row.eq(row2), item::col.eq(col2)))
                .execute(connection)?;
        }

        if let Ok(item2) = item2 {
            update(item::table)
                .filter(item::id.eq(item2.id))
                .set((item::row.eq(row1), item::col.eq(col1)))
                .execute(connection)?;
        }

        Ok(())
    })
}

#[tauri::command]
pub async fn set_action(action: CreateActionDto) -> Result<(), Error> {
    let writer = get_writer()?;
    let mut connection = writer.lock().unwrap();

    connection.transaction::<(), Error, _>(|connection| {
        let item: Item = {
            if let Some(id) = action.item.id {
                item::table
                    .select(Item::as_select())
                    .filter(item::id.eq(id))
                    .get_result(connection)?
            } else {
                insert_into(item::table)
                    .values(&action.item)
                    .get_result(connection)?
            }
        };

        if let Some(title) = action.title {
            let title = title.with_item_id(item.id);

            insert_into(title::table)
                .values(&title)
                .on_conflict(title::item_id)
                .do_update()
                .set(&title)
                .execute(connection)?;
        }

        if let Some(image) = action.image {
            let image = image.with_item_id(item.id);

            insert_into(image::table)
                .values(&image)
                .on_conflict(image::item_id)
                .do_update()
                .set(&image)
                .execute(connection)?;
        }

        if let Some(icon) = action.icon {
            let icon = icon.with_item_id(item.id);

            insert_into(icon::table)
                .values(&icon)
                .on_conflict(icon::item_id)
                .do_update()
                .set(&icon)
                .execute(connection)?;
        }

        if let Some(color) = action.color {
            let color = color.with_item_id(item.id);

            insert_into(color::table)
                .values(&color)
                .on_conflict(color::item_id)
                .do_update()
                .set(&color)
                .execute(connection)?;
        }

        Ok(())
    })
}

#[tauri::command]
pub async fn get_profiles() -> Result<Vec<ProfileDto>, Error> {
    let mut connection = get_connection()?;

    let profile = profile::table
        .select(Profile::as_select())
        .get_results(&mut connection)
        .expect("Error loading profile");

    let result = profile
        .iter()
        .map(|profile| ProfileDto {
            profile: profile.clone(),
        })
        .collect();

    Ok(result)
}

#[tauri::command]
pub async fn get_layout(profile_id: i32) -> Result<LayoutDto, Error> {
    let mut connection = get_connection()?;

    let layout = layout::table
        .select(Layout::as_select())
        .filter(layout::profile_id.eq(profile_id))
        .get_result(&mut connection)?;

    Ok(LayoutDto {
        layout: layout.clone(),
    })
}

#[tauri::command]
pub async fn set_layout(layout: Layout) -> Result<(), Error> {
    let writer = get_writer()?;
    let mut connection = writer.lock().unwrap();

    insert_into(layout::table)
        .values(&layout)
        .on_conflict(layout::profile_id)
        .do_update()
        .set(&layout)
        .execute(&mut *connection)?;

    Ok(())
}

#[tauri::command]
pub async fn get_style(profile_id: i32) -> Result<StyleDto, Error> {
    let mut connection = get_connection()?;

    let style = style::table
        .select(Style::as_select())
        .filter(style::profile_id.eq(profile_id))
        .get_result(&mut connection)?;

    Ok(StyleDto {
        style: style.clone(),
    })
}

#[tauri::command]
pub async fn set_style(style: Style) -> Result<(), Error> {
    let writer = get_writer()?;
    let mut connection = writer.lock().unwrap();

    insert_into(style::table)
        .values(&style)
        .on_conflict(style::profile_id)
        .do_update()
        .set(&style)
        .execute(&mut *connection)?;

    Ok(())
}

#[tauri::command]
pub async fn get_pages(profile_id: i32) -> Result<Vec<PageDto>, Error> {
    let mut connection = get_connection()?;

    let pages = page::table
        .inner_join(board::table.on(board::id.eq(page::board_id)))
        .select(Page::as_select())
        .filter(board::profile_id.eq(profile_id))
        .load(&mut connection)?;

    let result = pages
        .iter()
        .map(|page| PageDto { page: page.clone() })
        .collect();

    Ok(result)
}

#[tauri::command]
pub async fn get_board(board_id: i32) -> Result<BoardDto, Error> {
    let mut connection = get_connection()?;

    let (board, page) = board::table
        .left_join(page::table)
        .filter(board::id.eq(board_id))
        .select((Board::as_select(), Option::<Page>::as_select()))
        .get_result(&mut connection)?;

    // Fucking rust analyzer can't resolve this correctly
    let actions: Vec<ActionDto> = item::table
        .left_join(title::table)
        .left_join(image::table)
        .left_join(icon::table)
        .left_join(color::table)
        .filter(item::board_id.eq(board_id))
        .select((
            Item::as_select(),
            Option::<Title>::as_select(),
            Option::<Image>::as_select(),
            Option::<Icon>::as_select(),
            Option::<Color>::as_select(),
        ))
        .load::<(
            Item,
            Option<Title>,
            Option<Image>,
            Option<Icon>,
            Option<Color>,
        )>(&mut connection)
        .map(|results| {
            results
                .iter()
                .map(|(item, title, image, icon, color)| ActionDto {
                    item: item.clone(),
                    title: title.clone(),
                    image: image.clone(),
                    icon: icon.clone(),
                    color: color.clone(),
                })
                .collect()
        })?;

    Ok(BoardDto {
        board,
        page,
        actions,
    })
}
