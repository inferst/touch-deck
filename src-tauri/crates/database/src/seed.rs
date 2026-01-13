use crate::error::Error;
use crate::get_writer;
use crate::schema::{board, layout, page, profile, style};

use diesel::dsl::insert_into;
use diesel::prelude::*;

const ROWS: i32 = 3;
const COLS: i32 = 5;

pub fn run() -> Result<(), Error> {
    let writer = get_writer()?;
    let mut connection = writer.lock().unwrap();

    connection.transaction::<(), Error, _>(|connection| {
        insert_into(profile::table)
            .values((profile::id.eq(1), profile::name.eq("Default".to_string())))
            .on_conflict_do_nothing()
            .execute(connection)?;

        let default_profile_id: i32 = profile::table
            .select(profile::id)
            .filter(profile::id.eq(1))
            .get_result(connection)?;

        insert_into(layout::table)
            .values((
                layout::profile_id.eq(default_profile_id),
                layout::rows.eq(ROWS),
                layout::cols.eq(COLS),
            ))
            .on_conflict_do_nothing()
            .execute(connection)?;

        insert_into(style::table)
            .values((
                style::profile_id.eq(default_profile_id),
                style::spacing.eq(0),
                style::border_radius.eq(0),
            ))
            .on_conflict_do_nothing()
            .execute(connection)?;

        insert_into(board::table)
            .values((board::id.eq(1), board::profile_id.eq(default_profile_id)))
            .on_conflict_do_nothing()
            .execute(connection)?;

        let default_board_id: i32 = board::table
            .select(board::id)
            .filter(board::id.eq(1))
            .get_result(connection)?;

        insert_into(page::table)
            .values((page::board_id.eq(default_board_id), page::position.eq(0)))
            .on_conflict_do_nothing()
            .execute(connection)?;

        Ok(())
    })
}
