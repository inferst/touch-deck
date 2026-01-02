use diesel::r2d2::{ConnectionManager, Pool, PooledConnection};
use tauri::{AppHandle, Manager};
use tokio::sync::OnceCell;

use self::error::Error;

use diesel::prelude::*;

mod error;
pub mod models;
pub mod schema;
mod seed;

type SqlitePool = Pool<ConnectionManager<SqliteConnection>>;

pub static DB_CONNECTION: OnceCell<SqlitePool> = OnceCell::const_new();

pub fn get_db_connection() -> Result<PooledConnection<ConnectionManager<SqliteConnection>>, Error> {
    if let Some(pool) = DB_CONNECTION.get() {
        Ok(pool.clone().get()?)
    } else {
        Err(Error::Connection)
    }
}

pub async fn setup_db(app: &AppHandle) -> Result<(), Error> {
    let mut path = app.path().app_data_dir()?;

    match std::fs::create_dir_all(path.clone()) {
        Ok(_) => {}
        Err(err) => {
            panic!("error creating directory {}", err);
        }
    };

    path.push("db.sqlite");

    let url = path.to_str().expect("empty path");

    let manager = ConnectionManager::<SqliteConnection>::new(url);
    let pool = Pool::builder().build(manager).unwrap();

    DB_CONNECTION.set(pool)?;

    seed::seed();

    Ok(())
}
