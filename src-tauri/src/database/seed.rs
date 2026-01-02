use crate::database::error::Error;
use crate::database::get_db_connection;
use crate::database::models::{Board, Profile};

use diesel::dsl::insert_into;
use diesel::prelude::*;

const ROWS: i32 = 3;
const COLS: i32 = 5;

pub fn seed() -> Result<(), Error> {
    let mut connection = get_db_connection()?;

    let default_profile: Profile = {
        use crate::database::schema::profile::dsl::*;

        insert_into(profile)
            .values((id.eq(1), name.eq("Default".to_string())))
            .on_conflict_do_nothing()
            .get_result(&mut connection)?
    };

    let default_board: Board = {
        use crate::database::schema::board::dsl::*;

        insert_into(board)
            .values((
                id.eq(1),
                profile_id.eq(default_profile.id),
                rows.eq(ROWS),
                cols.eq(COLS),
            ))
            .on_conflict_do_nothing()
            .get_result(&mut connection)?
    };

    {
        use crate::database::schema::page::dsl::*;

        insert_into(page)
            .values((board_id.eq(default_board.id), position.eq(1)))
            .on_conflict_do_nothing()
            .execute(&mut connection)?;
    }

    {
        use crate::database::schema::item::dsl::*;

        for r in 0..ROWS {
            for c in 0..COLS {
                insert_into(item)
                    .values((board_id.eq(default_board.id), row.eq(r), col.eq(c)))
                    .on_conflict_do_nothing()
                    .execute(&mut connection)?;
            }
        }
    }



    Ok(())
}
