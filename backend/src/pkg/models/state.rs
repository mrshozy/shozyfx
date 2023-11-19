use crate::libs::email::EmailSender;
use crate::libs::encryptor::Encryptor;
use crate::pkg::middleware::jwt::JWT;
use crate::pkg::repositories::Repo;

#[derive(Clone)]
pub struct State{
    pub repo: Repo,
    pub jwt: JWT,
    pub sender: EmailSender,
    pub encryptor: Encryptor
}