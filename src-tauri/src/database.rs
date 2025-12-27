use std::env;

use dotenvy::dotenv;
use sqlx::SqlitePool;
use tokio::sync::OnceCell;

pub static DB_POOL: OnceCell<SqlitePool> = OnceCell::const_new();

pub async fn init_db() {
    dotenv().ok();

    let url = env::var("DATABASE_URL").unwrap();
    let pool = SqlitePool::connect(&url).await.unwrap();

    DB_POOL.set(pool).unwrap();
}

pub async fn run_migrations() {
    let pool = DB_POOL.get().unwrap();

    sqlx::migrate!()
        .run(pool)
        .await
        .expect("Migrations went wrong :(");
}
