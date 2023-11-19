use std::fs::File;
use std::io::{Read, Write};
use chrono::Local;
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};

const EMAIL_SENDER_NAME: &str = "makart.ciphershift@gmail.com";
const EMAIL_PASSWORD: &str = "ziusujjghljmhitj";

#[derive(Clone)]
pub struct EmailSender {
    smtp: SmtpTransport,
}

pub enum TEMPLATE {
    PasswordReset(String, String)
}

impl EmailSender {
    pub fn init() -> Result<Self, Box<dyn std::error::Error>> {
        let creds = Credentials::new(
            EMAIL_SENDER_NAME.to_owned(),
            EMAIL_PASSWORD.to_owned(),
        );
        let smtp = SmtpTransport::relay("smtp.gmail.com")?.credentials(creds).build();
        Ok(Self { smtp })
    }
    pub fn send(&self, to: &str, template: TEMPLATE) -> Result<(), Box<dyn std::error::Error>> {
        let (subject, content) = match template {
            TEMPLATE::PasswordReset(name, token) => {
                let mut file = File::open("./templates/reset-password.html").unwrap();
                let mut data = vec![];
                file.read_to_end(&mut data).unwrap();
                let mut content = String::from_utf8(data).unwrap();
                content = content.replace("{name}", &name).replace("{token}", &token);
                let mut file = match File::create("example.html") {
                    Ok(file) => file,
                    Err(e) => panic!("Error creating file: {}", e),
                };
                match file.write_all(content.as_bytes()) {
                    Ok(_) => println!("Data written successfully"),
                    Err(e) => panic!("Error writing to file: {}", e),
                }
                (format!("Password Reset Request@{}", Local::now().naive_local().format("%Y-%m-%dT%H:%M:%SZ")), content)
            }
        };
        let email = Message::builder()
            .from(EMAIL_SENDER_NAME.parse().unwrap())
            .reply_to(EMAIL_SENDER_NAME.parse().unwrap())
            .to(to.parse().unwrap())
            .subject(subject)
            .header(ContentType::TEXT_HTML)
            .body(content)
            .unwrap();
        self.smtp.send(&email)?;
        Ok(())
    }
}