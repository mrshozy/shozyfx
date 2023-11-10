use actix_web::{get, web::ServiceConfig, HttpResponse, Responder};
use crate::pkg::helper::responder::Respond;

#[get("/ping")]
async fn ping() -> impl Responder {
    HttpResponse::Ok().json(Respond::<String>::success(None, Some("pong".into())))
}
pub fn set_ping_config(config: &mut ServiceConfig) {
    config.service(ping);
}