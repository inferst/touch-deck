use self::error::Error;
use diesel::prelude::*;
use diesel::{
    connection::SimpleConnection,
    r2d2::{ConnectionManager, Pool, PooledConnection},
};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager};
use tokio::sync::OnceCell;

pub mod error;
pub mod models;
pub mod schema;
mod seed;

type SqlitePool = Pool<ConnectionManager<SqliteConnection>>;
type SharedConnection = Arc<Mutex<PooledConnection<ConnectionManager<SqliteConnection>>>>;

pub static DB_POOL: OnceCell<SqlitePool> = OnceCell::const_new();
pub static DB_WRITER: OnceCell<SharedConnection> = OnceCell::const_new();

pub fn get_db_connection() -> Result<PooledConnection<ConnectionManager<SqliteConnection>>, Error> {
    if let Some(pool) = DB_POOL.get() {
        let mut connection = pool.clone().get()?;
        connection.batch_execute(
            "
            PRAGMA foreign_keys = ON;
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = NORMAL;
        ",
        )?;

        Ok(connection)
    } else {
        Err(Error::Connection)
    }
}

pub fn get_db_writer() -> Result<SharedConnection, Error> {
    if let Some(connection) = DB_WRITER.get() {
        Ok(connection.clone())
    } else {
        Err(Error::Connection)
    }
}

pub async fn setup_db(app: &AppHandle) -> Result<(), Error> {
    let mut path = app.path().app_data_dir()?;

    std::fs::create_dir_all(path.clone()).unwrap();

    path.push("db.sqlite");

    let url = path.to_str().expect("empty path");

    let manager = ConnectionManager::<SqliteConnection>::new(url);
    let pool = Pool::builder().build(manager).unwrap();

    let mut writer = pool.get()?;

    writer.batch_execute(
        "
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
    ",
    )?;

    let _ = DB_WRITER.set(Arc::new(Mutex::new(writer)));

    DB_POOL.set(pool)?;

    seed::seed()?;

    Ok(())
}
