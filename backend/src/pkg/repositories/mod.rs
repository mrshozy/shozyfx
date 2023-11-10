use std::error::Error;
use crate::pkg::repositories::financial::Financial;
use crate::pkg::repositories::retail::Retail;

pub mod retail;
pub mod financial;


#[derive(Clone)]
pub struct Repo{
    pub retail: Retail,
    pub financial: Financial
}

impl Repo{
    pub async fn init(retail_str: &str, financial_str: &str) -> Result<Self, Box<dyn  Error>>{
        Ok(
            Self{
                retail: Retail::init(retail_str).await?,
                financial: Financial::init(financial_str).await?
            }
        )
    }
}