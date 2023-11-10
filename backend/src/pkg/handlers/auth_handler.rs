use actix_web::{HttpResponse, post, Responder, web};
use actix_web::web::ServiceConfig;
use log::{error, info};
use regex::{Regex};
use crate::pkg::helper::hash::verify_password;
use crate::pkg::helper::responder::Respond;
use crate::pkg::models::state::State;
use crate::pkg::models::users::{NewUser, User, UserLogin};


#[post("/auth/login")]
async fn user_login(user_info: web::Json<UserLogin>, data: web::Data<State>) -> impl Responder {
    let state = data.into_inner();
    let login_user = user_info.into_inner();
    if !login_user.is_data_valid(){
        return HttpResponse::BadRequest().json(Respond::<String>::error("Invalid combination".into()))
    }
    match User::from_email(login_user.email, &state.repo.retail).await {
        Ok(user) => {
            if !user.verified {
                return HttpResponse::Unauthorized().json(Respond::<String>::error("Waiting for admin to verify your account.".into()))
            }else if user.blocked {
                return HttpResponse::Unauthorized().json(Respond::<String>::error("This account is blocked"))
            }
            match verify_password(login_user.password.as_str(), user.password.as_str()) {
                Ok(valid) => {
                    if valid {
                        match state.jwt.generate_token(&user) {
                            Ok(token) => HttpResponse::Ok().json(Respond::success(Some(token), Some("Login successful".into()))),
                            Err(e) =>  {
                                error!("{:?}: {}", e, e.to_string());
                                HttpResponse::InternalServerError().json(Respond::<String>::error("Failed to generate token"))
                            }
                        }
                    }else{
                        HttpResponse::BadRequest().json(Respond::<String>::error("Invalid combination"))
                    }
                }
                Err(e) => {
                    error!("{:?}: {}", e, e.to_string());
                    HttpResponse::InternalServerError().json(Respond::<String>::error("Unknown error occurred"))
                }
            }
        }
        Err(e) => {
            if e.to_string().contains("no rows") {
                return  HttpResponse::BadRequest().json(Respond::<String>::error("Invalid combination"))
            }
            error!("{:?}: {}", e, e.to_string());
            HttpResponse::InternalServerError().json(Respond::<String>::error("Unknown error occurred"))
        }
    }
}

#[post("/auth/register")]
async fn user_register(user_info: web::Json<NewUser>, data: web::Data<State>) -> impl Responder {
    let state = data.into_inner();
    let new_user = user_info.into_inner();
    let error = new_user.validate();
    if error.len() > 0 {
        return HttpResponse::BadRequest().json(Respond::<String>::error(error.as_str()));
    }
    match User::new(new_user) {
        Ok(user) => {
            match user.save(&state.repo.retail).await {
                Ok(()) =>{
                    info!("New Account created: {:?} @ {:?}", user.name, user.email);
                    HttpResponse::Created().json(Respond::<String>::success(None, Some("account created.".into())))
                },
                Err(e) => {
                    let err = e.to_string();
                    match Regex::new(r#"Duplicate\sentry\s'([^']+)'"#){
                        Ok(regex) => {
                            if let Some(captures) = regex.captures(err.as_str()){
                                if let Some(email) = captures.get(1){
                                    let error = format!("Email already registered on the system: {}", email.as_str());
                                    return HttpResponse::BadRequest().json(Respond::<String>::error(error.as_str()));
                                }
                            }
                            error!("{:?}: {}", e, e.to_string());
                            HttpResponse::InternalServerError().json(Respond::<String>::error("Unknown error occurred"))
                        }
                        Err(e) => {
                            error!("{:?}: {}", e, e.to_string());
                            HttpResponse::InternalServerError().json(Respond::<String>::error("Failed to create an account"))
                        }
                    }
                }
            }
        }
        Err(e) => {
            error!("{:?}: {}", e, e.to_string());
            HttpResponse::InternalServerError().body("Unknown error occurred")
        }
    }
}



pub fn set_user_config(config: &mut ServiceConfig){
    config.service(user_register);
    config.service(user_login);
}