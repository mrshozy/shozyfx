use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
pub struct Respond<T> where T: Serialize {
    pub(crate) success: bool,
    pub(crate) message: Option<String>,
    pub(crate) body: Option<T>,
}

impl < T: Serialize + Into<T>> Respond<T>{
    pub fn error(message: &str) -> Respond<T>{
        Respond{
            success: false,
            message: Some(message.into()),
            body: None
        }
    }
    pub fn success(body: Option<T>, message: Option<String>) -> Respond<T>{
        Respond{
            success: true,
            message,
            body
        }
    }
}