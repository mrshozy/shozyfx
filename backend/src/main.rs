mod pkg;
mod libs;

use std::env;
use std::error::Error;
use log::error;
use crate::libs::email::EmailSender;
use crate::libs::encryptor::Encryptor;
use crate::pkg::handlers::Handler;
use crate::pkg::http::config::Config;
use crate::pkg::middleware::jwt::JWT;
use crate::pkg::models::state::State;
use crate::pkg::repositories::Repo;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    env_logger::builder().filter_level(log::LevelFilter::Info).init();
    let retail = env::var("RETAIL_URL").expect("Failed to get retail database");
    let financial = env::var("FINANCIAL_DATA_URL").expect("Failed to get financial database");
    let secret = env::var("SECRET_KEY").expect("Failed to get secret key");
    let sender = EmailSender::init().unwrap();
    let mut config = Config::new();
    match Repo::init(retail.as_str(), financial.as_str()).await {
        Ok(repo) => {
            let jwt = JWT(secret.clone());
            let encryptor = Encryptor(secret);
            Handler::init_handlers(&mut config, State{repo, jwt, sender, encryptor });
            config.run_server("0.0.0.0", 8080).await.expect("Failed to run server");
            Ok(())
        }
        Err(e) => {
            error!("{:?}", e);
            Err(e)
        }
    }
}