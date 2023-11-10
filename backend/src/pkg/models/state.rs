use crate::pkg::middleware::jwt::JWT;
use crate::pkg::repositories::Repo;

#[derive(Clone)]
pub struct State{
    pub repo: Repo,
    pub jwt: JWT
}