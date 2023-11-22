use chrono::{Local, NaiveDateTime};
use log::info;
use sqlx::MySqlPool;
use crate::pkg::models::currency::{Currency, CurrencyPair};

#[derive(Clone, Debug)]
pub struct Financial {
    pub sqlx:MySqlPool
}


impl Financial{
    pub async fn init(financial: &str) -> Result<Self, sqlx::error::Error>{
        info!("Initializing financial database");
        let pool = MySqlPool::connect(financial).await?;
        info!("Connected to financial database");
        Ok(
            Self{
                sqlx: pool
            }
        )
    }
    pub async fn get_currency_pair_data(&self, pair: &str, timestamp: i64) -> Result<Vec<CurrencyPair>, sqlx::error::Error> {
        let start = NaiveDateTime::from_timestamp_opt(timestamp, 0).unwrap().date().and_hms_opt(0,0,0).unwrap().timestamp()-7200;
        let data = sqlx::query_as::<_, CurrencyPair>("SELECT * FROM currency_pair WHERE pair = ? and timestamp >= ? ORDER BY timestamp ASC LIMIT 24")
            .bind(pair)
            .bind(start)
            .fetch_all(&self.sqlx)
            .await?;
        Ok(data)
    }
    pub async fn get_all_currency_pair_data_between(&self, end: i64) -> Result<Vec<CurrencyPair>, sqlx::error::Error> {
        let start = NaiveDateTime::from_timestamp_opt(end, 0).unwrap().date().and_hms_opt(0,0,0).unwrap().timestamp()-7200;
        let data = sqlx::query_as::<_, CurrencyPair>("SELECT * FROM currency_pair WHERE timestamp < ? and timestamp >= ? ORDER BY timestamp DESC")
            .bind(end)
            .bind(start)
            .fetch_all(&self.sqlx)
            .await?;
        Ok(data)
    }

    pub async fn get_all_currency_pair_data(&self) -> Result<Vec<CurrencyPair>, sqlx::error::Error> {
        let midnight = Local::now().date_naive().and_hms_nano_opt(0, 0, 0, 0).unwrap().timestamp() - 7200;
        // let data = sqlx::query_as::<_, CurrencyPair>("SELECT * FROM currency_pair ORDER BY timestamp DESC LIMIT 576")
        let data = sqlx::query_as::<_, CurrencyPair>("SELECT * FROM currency_pair where timestamp >= ? ORDER BY timestamp DESC")
            .bind(midnight)
            .fetch_all(&self.sqlx)
            .await?;
        Ok(data)
    }
    pub async fn get_all_currency(&self) -> Result<Vec<Currency>, sqlx::error::Error> {
        let data = sqlx::query_as::<_, Currency>("SELECT * FROM currency")
            .fetch_all(&self.sqlx)
            .await?;
        Ok(data)
    }
}