use serde::{Deserialize, Serialize};
use ts_rs::TS;

use database::models::{
    Board, Color, CreateBoard, CreateColor, CreateIcon, CreateImage, CreateItem, CreateTitle, Icon, Image, Item, Layout, Page, Profile, Style, Title
};

#[derive(TS, Serialize)]
#[ts(export)]
pub struct ProfileDto {
    pub profile: Profile,
}

#[derive(TS, Serialize)]
#[ts(export)]
pub struct LayoutDto {
    pub layout: Layout,
}

#[derive(TS, Serialize)]
#[ts(export)]
pub struct StyleDto {
    pub style: Style,
}

#[derive(TS, Serialize)]
#[ts(export)]
pub struct ActionDto {
    pub item: Item,
    pub title: Option<Title>,
    pub image: Option<Image>,
    pub icon: Option<Icon>,
    pub color: Option<Color>,
}

#[derive(TS, Deserialize, Debug)]
#[ts(export)]
pub struct CreateActionDto {
    pub item: CreateItem,
    pub title: Option<CreateTitle>,
    pub image: Option<CreateImage>,
    pub icon: Option<CreateIcon>,
    pub color: Option<CreateColor>,
}

#[derive(TS, Serialize)]
#[ts(export)]
pub struct BoardDto {
    pub board: Board,
    pub page: Option<Page>,
    pub actions: Vec<ActionDto>,
}

#[derive(TS, Deserialize)]
#[ts(export)]
pub struct CreateBoardDto {
    pub board: CreateBoard,
}

#[derive(TS, Serialize)]
#[ts(export)]
pub struct PageDto {
    pub page: Page,
}

#[derive(Deserialize, Serialize)]
pub struct ManifestAction {
    pub name: String,
    pub uuid: String,
}

#[derive(Deserialize, Serialize)]
pub struct Manifest {
    pub name: String,
    pub uuid: String,
    pub category: String,
    pub description: String,
    pub actions: Vec<ManifestAction>,
}

#[derive(Deserialize, Serialize)]
pub struct Manifests {
    pub plugins: Vec<Manifest>,
}
