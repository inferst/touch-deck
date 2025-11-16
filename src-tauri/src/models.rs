use sqlx::FromRow;

#[derive(Debug, Clone, FromRow)]
pub struct Profile {
    pub id: i64,
    pub name: String,
}

#[derive(Debug, Clone, FromRow)]
pub struct ProfilePage {
    pub id: i64,
    pub name: String,
    pub page_id: i64,
    pub page_name: Option<String>,
    pub page_icon: Option<String>,
}

#[derive(Debug, Clone, FromRow)]
pub struct Page {
    pub id: i64,
    pub profile_id: i64,
    pub name: Option<String>,
    pub icon: Option<String>,
}

#[derive(Debug, Clone, FromRow)]
pub struct Board {
    pub id: i64,
    pub page_id: i64,
    pub rows: i64,
    pub columns: i64,
}

#[derive(Debug, Clone, FromRow)]
pub struct Item {
    pub id: i64,
    pub board_id: i64,
    pub type_uuid: i64,
    pub row: i64,
    pub column: i64,
    pub data: String,
    pub color: Option<String>,
}

#[derive(Debug, Clone, FromRow)]
pub struct Title {
    pub id: i64,
    pub item_id: i64,
    pub font_id: i64,
    pub title: Option<String>,
    pub align: Option<i64>,
    pub color: Option<String>,
    pub size: Option<i64>,
}

#[derive(Debug, Clone, FromRow)]
pub struct Image {
    pub id: i64,
    pub item_id: i64,
    pub file_name: String,
    pub file_type: String,
}

#[derive(Debug, Clone, FromRow)]
pub struct Font {
    pub id: i64,
    pub name: String,
}

#[derive(Debug, Clone, FromRow)]
pub struct Icon {
    pub id: i64,
    pub item_id: i64,
    pub name: String,
    pub color: Option<String>,
}

