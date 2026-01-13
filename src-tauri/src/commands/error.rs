use database::{self};

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error(transparent)]
    Database(#[from] database::error::Error),

    #[error(transparent)]
    Tauri(#[from] tauri::Error),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
