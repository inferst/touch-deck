use diesel::r2d2;

use crate::database::SqlitePool;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("no database connection")]
    Connection,

    #[error("database initialization: {0}")]
    Initialization(#[from] tokio::sync::SetError<SqlitePool>),

    #[error("tauri: {0}")]
    Tauri(#[from] tauri::Error),

    #[error("diesel: {0}")]
    Pool(#[from] r2d2::PoolError),

    #[error("diesel: {0}")]
    Diesel(#[from] diesel::result::Error),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
