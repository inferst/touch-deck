diesel::table! {
    profile (id) {
        id -> Integer,
        name -> Text,
    }
}

diesel::table! {
    board (id) {
        id -> Integer,
        profile_id -> Integer,
        rows -> Integer,
        cols -> Integer,
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

diesel::table! {
    item (id) {
        id -> Integer,
        board_id -> Integer,
        row -> Integer,
        col -> Integer,
    }
}

diesel::table! {
    title (item_id) {
        item_id -> Integer,
        font_id -> Integer,
        #[sql_name = "title"]
        value -> Nullable<Text>,
        align -> Nullable<Integer>,
        color -> Nullable<Text>,
        size -> Nullable<Integer>,
    }
}

diesel::joinable!(title -> item (item_id));

diesel::table! {
    image (item_id) {
        item_id -> Integer,
        file_name -> Nullable<Text>,
        file_type -> Nullable<Text>,
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
    plugin_action (item_id) {
        item_id -> Integer,
        uuid -> Text,
        settings -> Nullable<Text>,
    }
}

diesel::joinable!(plugin_action -> item (item_id));

diesel::allow_tables_to_appear_in_same_query!(item, title, image, icon, color, plugin_action);

diesel::table! {
    plugin (id) {
        id -> Integer,
        uuid -> Text,
        settings -> Nullable<Text>,
    }
}

diesel::table! {
    font (id) {
        id -> Integer,
        name -> Text,
    }
}
