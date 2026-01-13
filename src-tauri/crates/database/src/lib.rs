use diesel::prelude::*;
use diesel::{
    connection::SimpleConnection,
    r2d2::{ConnectionManager, Pool, PooledConnection},
};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tokio::sync::OnceCell;

use crate::error::Error;

pub mod error;
pub mod models;
pub mod schema;
mod seed;

type SqlitePool = Pool<ConnectionManager<SqliteConnection>>;
type SharedConnection = Arc<Mutex<PooledConnection<ConnectionManager<SqliteConnection>>>>;

pub static POOL: OnceCell<SqlitePool> = OnceCell::const_new();
pub static WRITER: OnceCell<SharedConnection> = OnceCell::const_new();

static PRAGMA: &str = r#"
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
"#;

pub fn get_connection() -> Result<PooledConnection<ConnectionManager<SqliteConnection>>, Error> {
    if let Some(pool) = POOL.get() {
        let mut connection = pool.clone().get()?;
        connection.batch_execute(PRAGMA)?;

        Ok(connection)
    } else {
        Err(Error::Connection)
    }
}

pub fn get_writer() -> Result<SharedConnection, Error> {
    if let Some(connection) = WRITER.get() {
        Ok(connection.clone())
    } else {
        Err(Error::Connection)
    }
}

pub async fn setup(data_path: PathBuf) -> Result<(), Error> {
    std::fs::create_dir_all(&data_path).unwrap();

    let db_path = data_path.join("db.sqlite");
    let url = db_path.to_str().expect("empty db path");

    let manager = ConnectionManager::<SqliteConnection>::new(url);
    let pool = Pool::builder().build(manager).unwrap();

    let mut writer = pool.get()?;
    writer.batch_execute(PRAGMA)?;

    let _ = WRITER.set(Arc::new(Mutex::new(writer)));

    POOL.set(pool)?;

    seed::run()?;

    Ok(())
}
