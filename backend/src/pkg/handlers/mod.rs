use actix_web::web;
use crate::pkg::handlers::analytics_handler::set_analytics_config;
use crate::pkg::handlers::auth_handler::set_user_config;
use crate::pkg::handlers::ping_handler::set_ping_config;
use crate::pkg::handlers::signals_handler::set_signals_config;
use crate::pkg::http::config::Config;
use crate::pkg::models::state::State;

mod events_handler;
mod auth_handler;
mod account_handler;
mod charts_handler;
mod ping_handler;
mod analytics_handler;
mod signals_handler;

pub struct Handler;

impl Handler{
    pub fn init_handlers(config: &mut Config, state:State){
        config.push_route(move |service| {
            service.service( web::scope("/api").configure(|c| {
                c.app_data(web::Data::new(state.clone()));
                set_ping_config(c);
                set_user_config(c);
                set_analytics_config(c);
                set_signals_config(c)
            }));
        });
    }
}