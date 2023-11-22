use actix_web::{get, web::ServiceConfig, HttpResponse, Responder, web};
use chrono::{NaiveDate, NaiveDateTime, NaiveTime};
use crate::pkg::helper::responder::Respond;
use crate::pkg::models::charts::AreaChart;
use crate::pkg::models::state::State;
use crate::pkg::services::create_charts_data::{collect_data, map_area_chart_data};

#[get("/analytics/charts/pairs/{pair}/{data}")]
async fn charts_pair(data: web::Data<State>, params: web::Path<(String, i64)>) -> impl Responder {
    let financial = &data.repo.financial;
    let (pair, date) = params.into_inner();;
    match financial.get_currency_pair_data(pair.as_str(), date).await {
        Ok(pairs) => {
            HttpResponse::Ok().json(Respond::<Vec<AreaChart>>::success(Some(map_area_chart_data(&pairs)), None))
        }
        Err(e) => {
            HttpResponse::Ok().json(Respond::<String>::error(format!("Failed to get data: {}", e).as_str()))
        }
    }
}

#[get("/analytics/charts/strength/{date}")]
async fn charts_analytics(data: web::Data<State>, date: web::Path<i64>) -> impl Responder {
    let financial = &data.repo.financial;
    match if date.abs() == 1 { financial.get_all_currency_pair_data().await } else { financial.get_all_currency_pair_data_between(date.abs()).await }
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