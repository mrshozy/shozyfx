use std::sync::Arc;
use actix_cors::Cors;
use actix_web::{App, dev::Server, HttpServer, web::ServiceConfig};
use actix_web::middleware::Logger;
use actix_web_lab::web::spa;
use log::info;

/// The `Config` struct has methods to initialize the routes, push new routes, and run the server.
#[derive(Clone)]
pub struct Config {
    routes: Vec<Arc<dyn Fn(&mut ServiceConfig) + Send + Sync>>,
}

impl Config {
    /// Creates a new instance of `Config` with an empty vector of routes.
    pub fn new() -> Self {
        Self { routes: vec![] }
    }
    /// Adds a new route to the vector of routes.
    pub fn push_route<T>(&mut self, handler: T) where T: Fn(&mut ServiceConfig) + Send + Sync + 'static {
        self.routes.push(Arc::new(handler));
    }

    /// Initializes the routes by calling each route with the `ServiceConfig` parameter.
    fn init(&self, config: &mut ServiceConfig) {
        for route in self.routes.iter() {
            route(config);
        }
    }

    /// The `run_server` method starts an HTTP server using Actix Web, binds it to the specified address and port,
    pub fn run_server(&mut self, address: &str, port: usize) -> Server {
        let this = self.clone();

        let app = move || {
            let cors = Cors::default().allow_any_origin().allow_any_method().allow_any_header().max_age(3600);
            App::new().wrap(Logger::default()).wrap(cors).configure(|config| {
                this.init(config);
            }).service(
                spa().index_file("./dist/index.html").static_resources_mount("/").static_resources_location("./dist").finish()
            )
        };
        HttpServer::new(app)
            .bind(format!("{}:{}", address, port))
            .and_then(|server| {
                Ok({
                    info!("Running on http://{}:{}", address, port);
                    server
                })
            })
            .expect("Failed to bind to address")
            .run()
    }
}