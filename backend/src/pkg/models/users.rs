use std::collections::HashMap;
use bcrypt::BcryptError;
use chrono::{Duration, Local, NaiveDateTime, Utc};
use regex::Regex;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use crate::pkg::helper::hash::hash_password;
use crate::pkg::repositories::retail::Retail;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: String,
    pub name: String,
    pub surname: String,
    pub email: String,
    pub password: String,
    pub verified: bool,
    pub blocked: bool,
    pub active: bool,
    pub created_on: NaiveDateTime,
    pub updated_on: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserLogin{
    pub email: String,
    pub password: String,
}



#[derive(Debug, Serialize, Deserialize)]
pub struct NewUser{
    pub name: String,
    pub surname: String,
    pub email: String,
    pub password: String,
}
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserRole {
    pub role_id: i32,
    pub role_name: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserRoleMapping {
    pub user_id: String,
    pub role_id: i32,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserProfile {
    pub user_id: String,
    pub profile_picture: Option<String>,
    pub address: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct PasswordResetRequest {
    pub user_id: String,
    pub request_time: NaiveDateTime,
    pub expiration_time: NaiveDateTime,
}


#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserClaims{
    pub id: String,
    pub name: String,
    pub surname: String,
    pub email: String,
    pub exp: NaiveDateTime,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct UserResetPassword{
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserNewPassword{
    pub password: String,
}


impl User {
    pub fn new(new_user: NewUser) -> Result<Self, BcryptError> {
        let now = Local::now().naive_local();
        let password = hash_password(new_user.password.as_str())?;
        let user = Self {
            id: Uuid::new_v4().to_string(),
            name: new_user.name,
            surname: new_user.surname,
            email: new_user.email,
            password,
            verified: false,
            blocked: false,
            active: true,
            created_on: now,
            updated_on: now,
        };
        Ok(user)
    }
    pub async fn save(&self, retail: &Retail) -> Result<(), Box<dyn std::error::Error>> {
        let query = format!("INSERT INTO users (id, name, surname, email, password, active, blocked, verified) VALUES ('{}', '{}', '{}', '{}', '{}', {}, {}, {});",
                            self.id.to_string(), self.name, self.surname,self.email, self.password, self.active, self.blocked, self.verified);
        sqlx::query(query.as_str()).execute(&(retail.sqlx)).await?;
        Ok(())
    }
    pub async fn from_email(email:String, retail: &Retail) -> Result<Self, sqlx::Error>{
        let query = format!("SELECT * FROM users WHERE email = '{}'", email);
        let user_row = sqlx::query(&query).fetch_one(&(retail.sqlx)).await?;
        User::from_row(&user_row)
    }
    pub async fn update_password(password:&str, id:&str, retail: &Retail) -> Result<bool, sqlx::Error>{
        let password = hash_password(password).unwrap();
        let query = format!("UPDATE users SET password = ? WHERE id = ?");
        let query = sqlx::query(&query)
            .bind(password)
            .bind(id)
            .execute(&(retail.sqlx)).await?;
        Ok(query.rows_affected() != 0)
    }
}
impl UserRole {
    pub fn new(role_name: String, description: Option<String>) -> Self {
        UserRole {
            role_id: 0,
            role_name,
            description,
        }
    }
}

impl UserRoleMapping {
    pub fn new(user_id: String, role_id: i32) -> Self {
        UserRoleMapping { user_id, role_id }
    }
}

impl UserProfile {
    pub fn new(user_id: String, profile_picture: Option<String>, address: Option<String>) -> Self {
        UserProfile {
            user_id,
            profile_picture,
            address,
        }
    }
}

impl PasswordResetRequest {
    pub fn new(user_id: String) -> Self {
        let now = Local::now().naive_local();
        let expiration_time = now + Duration::hours(1);
        PasswordResetRequest {
            user_id,
            expiration_time,
            request_time: now,
        }
    }
}

impl NewUser{
    pub fn validate(&self) -> String {
        let mut errors = HashMap::new();
        if self.surname.len() < 3{
            errors.insert("name".to_string(), "Name cannot be less then 3 characters.".to_string());
        }
        if self.surname.len() < 3 {
            errors.insert("surname".to_string(), "Surname cannot be less then 3 characters.".to_string());
        }
        if !self.is_valid_email() {
            errors.insert("email".to_string(), "Invalid email address.".to_string());
        }
        if !self.password_strength() {
            errors.insert(
                "password".to_string(),
                "Password is weak, must contain at least one uppercase, lowercase and digit with length of 8.".to_string(),
            );
        }
        if self.password.chars().any(|c|  c.is_ascii_punctuation()){
            errors.insert(
                "password".to_string(),
                "Password must not contain special characters".to_string(),
            );
        }
        if self.name.chars().any(|c|  c.is_ascii_punctuation()){
            errors.insert(
                "name".to_string(),
                "Name must not contain special characters".to_string(),
            );
        }
        if self.surname.chars().any(|c|  c.is_ascii_punctuation()){
            errors.insert(
                "surname".to_string(),
                "Surname must not contain special characters".to_string(),
            );
        }
        errors.iter().map(|(_, value)| format!(" {}\n", value)).collect::<String>()
    }
    fn is_valid_email(&self) -> bool {
        let re = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
        re.is_match(self.email.as_str())
    }
    pub fn password_strength(&self) -> bool {
        let mut upper = 0;
        let mut lower = 0;
        let mut digit = 0;
        for c in self.password.chars() {
            match c {
                'a'..='z' => lower += 1,
                'A'..='Z' => upper += 1,
                '0'..='9' => digit += 1,
                _ => {}
            }
        }
        upper >= 1 && lower >= 1 && digit > 1 && self.password.len() >= 8
    }
}

impl UserResetPassword{
   pub fn is_valid_email(&self) -> bool{
       let re = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
       re.is_match(self.email.as_str())
    }
}

impl UserLogin{

    pub fn is_data_valid(&self) -> bool{
        self.is_valid_email() && self.is_password_valid()
    }
    fn is_valid_email(&self) -> bool {
        let re = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
        re.is_match(self.email.as_str())
    }
    fn is_password_valid(&self) -> bool{
        !self.password.chars().any(|c|  c.is_ascii_punctuation())
    }
}
impl UserNewPassword{
    pub fn is_password_valid(&self) -> bool{
        !self.password.chars().any(|c|  c.is_ascii_punctuation()) && self.password.len() >= 8
    }
    pub fn get_error_message(&self) ->String{
        "Password is weak, must contain at least one uppercase, lowercase and digit with length of 8.".into()
    }
}