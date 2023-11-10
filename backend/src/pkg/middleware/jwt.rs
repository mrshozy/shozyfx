use std::ops::Add;
use chrono::{Duration, Local};
use jsonwebtoken::{decode, encode, Header, Validation, EncodingKey, DecodingKey};
use crate::pkg::models::users::{User, UserClaims};

#[derive(Clone)]
pub struct JWT {
    pub secret: String,
}

impl JWT {
    pub fn init(secret: String) -> Self {
        Self { secret }
    }
    pub fn generate_token(&self, user: &User) -> Result<String, Box<dyn std::error::Error>> {
        let token = encode(
            &Header::default(),
            &UserClaims {
                id: user.id.clone(),
                name: user.name.clone(),
                surname: user.surname.clone(),
                email: user.email.clone(),
                exp: Local::now().add(Duration::hours(72)).naive_local(),
            },
            &EncodingKey::from_secret(self.secret.as_ref()),
        )?;
        Ok(token)
    }

    pub fn verify_token(&self, token: String) -> Result<UserClaims, Box<dyn std::error::Error>> {
        let token_data = decode::<UserClaims>(&token, &DecodingKey::from_secret(self.secret.as_ref()), &Validation::default())?;
        Ok(token_data.claims)
    }
}
