diesel::table! {
    profile (id) {
        id -> Integer,
        name -> Text,
    }
}

diesel::table! {
    layout (profile_id) {
        profile_id -> Integer,
        rows -> Nullable<Integer>,
        cols -> Nullable<Integer>,
    }
}

diesel::joinable!(layout -> profile (profile_id));

diesel::table! {
    style (profile_id) {
        profile_id -> Integer,
        spacing -> Nullable<Integer>,
        border_radius -> Nullable<Integer>,
        background_image -> Nullable<Text>,
        background_color -> Nullable<Text>,
    }
}

diesel::joinable!(style -> profile (profile_id));

diesel::table! {
    board (id) {
        id -> Integer,
        profile_id -> Integer,
    }
}

diesel::table! {
    page (board_id) {
        board_id -> Integer,
        position -> Integer,
        name -> Nullable<Text>,
        icon -> Nullable<Text>,
    }
}

diesel::joinable!(page -> board (board_id));

diesel::table! {
    item (id) {
        id -> Integer,
        board_id -> Integer,
        row -> Integer,
        col -> Integer,
        #[sql_name = "type"]
        kind -> Text,
    }
}

diesel::table! {
    title (item_id) {
        item_id -> Integer,
        font -> Nullable<Text>,
        #[sql_name = "title"]
        value -> Nullable<Text>,
        align -> Nullable<Text>,
        color -> Nullable<Text>,
        size -> Nullable<Integer>,
    }
}

diesel::joinable!(title -> item (item_id));

diesel::table! {
    image (item_id) {
        item_id -> Integer,
        file -> Nullable<Text>,
        #[sql_name = "type"]
        image_type -> Nullable<Text>,
    }
}

diesel::joinable!(image -> item (item_id));

diesel::table! {
    icon (item_id) {
        item_id -> Integer,
        name -> Nullable<Text>,
        color -> Nullable<Text>,
    }
}

diesel::joinable!(icon -> item (item_id));

diesel::table! {
    color (item_id) {
        item_id -> Integer,
        #[sql_name = "color"]
        value -> Nullable<Text>,
    }
}

diesel::joinable!(color -> item (item_id));

diesel::table! {
    action_settings (item_id) {
        item_id -> Integer,
        settings -> Nullable<Text>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(item, title, image, icon, color);

diesel::allow_tables_to_appear_in_same_query!(board, page);

diesel::table! {
    plugin_settings (id) {
        id -> Integer,
        uuid -> Text,
        settings -> Nullable<Text>,
    }
}
