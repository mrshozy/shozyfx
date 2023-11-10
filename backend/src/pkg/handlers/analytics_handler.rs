use actix_web::{get, web::ServiceConfig, HttpResponse, Responder, web};
use crate::pkg::helper::responder::Respond;
use crate::pkg::models::currency::CurrencyPair;
use crate::pkg::models::state::State;
use crate::pkg::services::create_charts_data::collect_data;

#[get("/analytics/charts/pairs/{pair}")]
async fn charts_pair(data: web::Data<State>, pair:  web::Path<String>) -> impl Responder {
    let financial = &data.repo.financial;
    match financial.get_currency_pair_data(pair.as_str()).await {
        Ok(pairs) => {
            HttpResponse::Ok().json(Respond::<Vec<CurrencyPair>>::success(Some(pairs), None))
        }
        Err(e) => {
            HttpResponse::Ok().json(Respond::<String>::error(format!("Failed to get data: {}", e).as_str()))
        }
    }
}

#[get("/analytics/charts/strength/{date}")]
async fn charts_analytics(data: web::Data<State>, date: web::Path<i64>) -> impl Responder {
    let financial = &data.repo.financial;
    match if date.abs() == 1 { financial.get_all_currency_pair_data().await }
        else { financial.get_all_currency_pair_data_between(date.abs()).await }
    {
        Ok(pairs) => {
            match financial.get_all_currency().await {
                Ok(currency) => {
                    let data = collect_data(&pairs, &currency);
                    HttpResponse::Ok().json(Respond::<_>::success(Some(data), None))
                }
                Err(e) => {
                    HttpResponse::Ok().json(Respond::<String>::error(format!("Failed to get data, {}", e).as_str()))
                }
            }
        }
        Err(e) => {
            HttpResponse::Ok().json(Respond::<String>::error(format!("Failed to get data, {}", e).as_str()))
        }
    }
}
pub fn set_analytics_config(config: &mut ServiceConfig) {
    config.service(charts_pair);
    config.service(charts_analytics);
}