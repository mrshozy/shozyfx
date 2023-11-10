use log::info;
use sqlx::MySqlPool;

#[derive(Clone, Debug)]
pub struct Retail{
    pub sqlx:MySqlPool
}

impl Retail{
    pub async fn init(retail: &str) -> Result<Self, sqlx::error::Error>{
        info!("Initializing retail database");
        let pool = MySqlPool::connect(retail).await?;
        info!("Connected to retail database");
        sqlx::migrate!("./migrations").run(&pool).await?;
        info!("Database migration run successful");
        Ok(
            Self{
                sqlx: pool
            }
        )
    }
}