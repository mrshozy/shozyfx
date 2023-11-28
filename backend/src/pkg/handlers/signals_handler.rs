use actix_web::{get, HttpResponse, Responder, web};
use actix_web::web::ServiceConfig;
use crate::pkg::helper::responder::Respond;
use crate::pkg::models::state::State;
use crate::pkg::services::analysis::absolute_average;
use crate::pkg::services::create_charts_data::collect_data;

#[get("/analytics/signal/{date}")]
async fn signals(data: web::Data<State>, date: web::Path<i64>) -> impl Responder {
    let financial = &data.repo.financial;
    match if date.abs() == 1 { financial.get_all_currency_pair_data().await } else { financial.get_all_currency_pair_data_between(date.abs()).await }
    {
        Ok(pairs) => {
            match financial.get_all_currency().await {
                Ok(currency) => {
                    let data = collect_data( &pairs, &currency);
                    HttpResponse::Ok().json(Respond::success(Some(absolute_average(&data)), None))
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

pub fn set_signals_config(config: &mut ServiceConfig) {
    config.service(signals);
}