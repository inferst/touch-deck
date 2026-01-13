CREATE TABLE IF NOT EXISTS "profile" (
	"id" INTEGER NOT NULL,
	"name" VARCHAR NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "board" (
	"id" INTEGER NOT NULL,
	"profile_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("profile_id") REFERENCES "profile"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "page" (
	"board_id" INTEGER NOT NULL,
	"position" INTEGER NOT NULL,
	"name" VARCHAR,
	"icon" VARCHAR,
	PRIMARY KEY("board_id", "position"),
	FOREIGN KEY ("board_id") REFERENCES "board"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "item" (
	"id" INTEGER NOT NULL,
	"board_id" INTEGER NOT NULL,
	"row" INTEGER NOT NULL,
	"col" INTEGER NOT NULL,
	"type" VARCHAR NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("board_id") REFERENCES "board"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "item_index_board_row_col"
ON "item" ("board_id", "row", "col");
CREATE TABLE IF NOT EXISTS "title" (
	"item_id" INTEGER NOT NULL,
	"font" VARCHAR,
	"title" VARCHAR,
	"align" VARCHAR,
	"color" VARCHAR,
	"size" INTEGER,
	PRIMARY KEY("item_id"),
	FOREIGN KEY ("item_id") REFERENCES "item"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "image" (
	"item_id" INTEGER NOT NULL,
	"file" VARCHAR NOT NULL,
	"type" VARCHAR NOT NULL,
	PRIMARY KEY("item_id"),
	FOREIGN KEY ("item_id") REFERENCES "item"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "icon" (
	"item_id" INTEGER NOT NULL,
	"name" VARCHAR NOT NULL,
	"color" VARCHAR,
	PRIMARY KEY("item_id"),
	FOREIGN KEY ("item_id") REFERENCES "item"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "color" (
	"item_id" INTEGER NOT NULL,
	"color" VARCHAR,
	PRIMARY KEY("item_id"),
	FOREIGN KEY ("item_id") REFERENCES "item"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "action_settings" (
	"item_id" INTEGER NOT NULL,
	"settings" TEXT,
	PRIMARY KEY("item_id"),
	FOREIGN KEY ("item_id") REFERENCES "item"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "plugin_settings" (
	"id" INTEGER NOT NULL,
	"uuid" VARCHAR NOT NULL UNIQUE,
	"settings" TEXT,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "style" (
	"profile_id" INTEGER NOT NULL,
	"spacing" INTEGER,
	"border_radius" INTEGER,
	"background_image" VARCHAR,
	"background_color" VARCHAR,
	PRIMARY KEY("profile_id"),
	FOREIGN KEY ("profile_id") REFERENCES "profile"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "layout" (
	"profile_id" INTEGER NOT NULL,
	"rows" INTEGER,
	"cols" INTEGER,
	PRIMARY KEY("profile_id"),
	FOREIGN KEY ("profile_id") REFERENCES "profile"("id")
	ON UPDATE NO ACTION ON DELETE CASCADE
);
