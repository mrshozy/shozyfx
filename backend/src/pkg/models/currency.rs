use serde::Serialize;
use sqlx::FromRow;

#[derive(Debug, FromRow, Clone, Serialize)]
pub struct Currency {
    pub id: i32,
    pub code: String,
}

#[derive(FromRow, Serialize, Clone, Debug)]
pub struct CurrencyPair {
    pub id: String,
    pub base: String,
    pub quote: String,
    pub pair: String,
    pub price: f32,
    pub pcp: f32,
    pub timestamp: i64,
}

#[derive(Serialize, Clone, Debug)]
pub struct CurrencyStrength {
    pub currency: String,
    pub absolute_value: f32,
    pub average: f32,
    pub strength: f32
}

impl CurrencyStrength {
    pub fn new(tuple: (String, f32, f32, f32)) -> Self {
        let (currency, absolute_value, average, strength) = tuple;
        Self {
            currency,
            absolute_value,
            average,
            strength
        }
    }
}