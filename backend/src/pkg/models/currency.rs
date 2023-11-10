use serde::Serialize;
use sqlx::FromRow;

#[derive(Debug, FromRow, Clone, Serialize)]
pub struct Currency {
    pub id: i32,
    pub code: String,
}

#[derive(sqlx::FromRow, Serialize, Clone, Debug)]
pub struct CurrencyPair {
    pub id: String,
    pub base: String,
    pub quote: String,
    pub pair: String,
    pub price: f32,
    pub pcp: f32,
    pub timestamp: i64,
}