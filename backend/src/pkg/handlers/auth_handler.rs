use actix_web::{HttpResponse, post, Responder, web};
use actix_web::web::ServiceConfig;
use chrono::Local;
use log::{error, info};
use regex::{Regex};
use crate::libs::email::TEMPLATE;
use crate::pkg::helper::hash::verify_password;
use crate::pkg::helper::responder::Respond;
use crate::pkg::models::state::State;
use crate::pkg::models::users::{NewUser, PasswordResetRequest, User, UserLogin, UserNewPassword, UserResetPassword};


#[post("/auth/login")]
async fn user_login(user_info: web::Json<UserLogin>, data: web::Data<State>) -> impl Responder {
    let state = data.into_inner();
    let login_user = user_info.into_inner();
    if !login_user.is_data_valid() {
        return HttpResponse::BadRequest().json(Respond::<String>::error("Invalid combination".into()));
    }
    match User::from_email(login_user.email, &state.repo.retail).await {
        Ok(user) => {
            if !user.verified {
                return HttpResponse::Unauthorized().json(Respond::<String>::error("Waiting for admin to verify your account.".into()));
            } else if user.blocked {
                return HttpResponse::Unauthorized().json(Respond::<String>::error("This account is blocked"));
            }
            match verify_password(login_user.password.as_str(), user.password.as_str()) {
                Ok(valid) => {
                    if valid {
                        match state.jwt.generate_token(&user) {
                            Ok(token) => HttpResponse::Ok().json(Respond::success(Some(token), Some("Login successful".into()))),
                            Err(e) => {
                                error!("{:?}: {}", e, e.to_string());
                                HttpResponse::InternalServerError().json(Respond::<String>::error("Failed to generate token"))
                            }
                        }
                    } else {
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
                return HttpResponse::BadRequest().json(Respond::<String>::error("Invalid combination"));
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
                Ok(()) => {
                    info!("New Account created: {:?} @ {:?}", user.name, user.email);
                    HttpResponse::Created().json(Respond::<String>::success(None, Some("account created.".into())))
                }
                Err(e) => {
                    let err = e.to_string();
                    match Regex::new(r#"Duplicate\sentry\s'([^']+)'"#) {
                        Ok(regex) => {
                            if let Some(captures) = regex.captures(err.as_str()) {
                                if let Some(email) = captures.get(1) {
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

#[post("/auth/request-reset-password")]
async fn request_reset_password(user_reset_password: web::Json<UserResetPassword>, data: web::Data<State>) -> impl Responder {
    let state = data.into_inner();
    if !user_reset_password.is_valid_email() {
        return HttpResponse::BadRequest().json(Respond::<String>::error("Invalid email address"));
    }
    match User::from_email(user_reset_password.email.clone(), &state.repo.retail).await {
        Ok(user) => {
            let password = PasswordResetRequest::new(user.id);
            let json = serde_json::to_string(&password).unwrap();
            let token = state.encryptor.encrypt(json.as_str()).unwrap();
            match state.sender.send(user.email.as_str(), TEMPLATE::PasswordReset(user.name, token)) {
                Ok(_) => {
                    HttpResponse::Ok().json(Respond::<String>::success(None, Some("An email sent with link to reset.".into())))
                }
                Err(e) => {
                    HttpResponse::InternalServerError().json(Respond::<String>::error(format!("Failed to send email: {}", e).as_str()))
                }
            }
        }
        Err(e) => {
            if e.to_string().contains("no rows") {
                return HttpResponse::Ok().json(Respond::<String>::success(None, Some("An email sent with link to reset.".to_string())));
            }
            error!("{:?}: {}", e, e.to_string());
            HttpResponse::InternalServerError().json(Respond::<String>::error("Unknown error occurred"))
        }
    }
}

#[post("/auth/reset-password/{token}")]
async fn reset_password(user_reset_password: web::Json<UserNewPassword>, data: web::Data<State>, token: web::Path<String>) -> impl Responder {
    let state = data.into_inner();
    if !user_reset_password.is_password_valid() {
        return HttpResponse::BadRequest().json(Respond::<String>::error(user_reset_password.get_error_message().as_str()));
    }
    let json = state.encryptor.decrypt(token.as_str()).unwrap();
    match serde_json::from_str::<PasswordResetRequest>(&json) {
        Ok(reset) => {
            if reset.expiration_time <= Local::now().naive_local() {
                return HttpResponse::BadRequest().json(Respond::<String>::error("Url has expired"));
            }
            match User::update_password(user_reset_password.password.as_str(), reset.user_id.as_str(), &state.repo.retail).await {
                Ok(_) => {
                    HttpResponse::Ok().json(Respond::<String>::success(None, Some("Password reset successful".into())))
                }
                Err(e) => {
                    HttpResponse::InternalServerError().json(Respond::<String>::error(format!("Failed to update password: {}", e).as_str()))
                }
            }
        }
        Err(_) => {
            HttpResponse::BadRequest().json(Respond::<String>::error("Invalid token used"))
        }
    }
}

pub fn set_user_config(config: &mut ServiceConfig) {
    config.service(user_register);
    config.service(user_login);
    config.service(request_reset_password);
    config.service(reset_password);
}