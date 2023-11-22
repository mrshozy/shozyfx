use base64::{
    alphabet,
    engine::{self, general_purpose},
};
use encoding::{DecoderTrap, EncoderTrap, Encoding};
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};


#[derive(Clone)]
pub struct Encryptor(pub String);

impl Encryptor {
    const CUSTOM_ENGINE: engine::GeneralPurpose = engine::GeneralPurpose::new(&alphabet::URL_SAFE, general_purpose::PAD);

    pub fn decrypt(&self, data: &str) -> Result<String, Box<dyn std::error::Error>> {
        let data = urlencoding::decode(data)?.to_string();
        let decoded_data = engine::Engine::decode(&Self::CUSTOM_ENGINE, data)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidInput, e))?;
        let bytes = encoding::all::ISO_8859_1.decode(&decoded_data, DecoderTrap::Strict)?;
        let decrypted_data = Self::rc4(&self.0, &bytes);
        let decoded_decrypted_data = percent_encoding::percent_decode_str(&decrypted_data)
            .decode_utf8()
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidInput, e))?
            .to_string();
        Ok(decoded_decrypted_data)
    }

    pub fn encrypt(&self, data: &str) -> Result<String, Box<dyn std::error::Error>> {
        let encrypted_data = Self::rc4(&self.0, &Self::uri_encode(data));
        let bytes = encoding::all::ISO_8859_1.encode(&encrypted_data, EncoderTrap::Strict)?;
        let encrypted = engine::Engine::encode(&Self::CUSTOM_ENGINE, bytes);
        Ok(urlencoding::encode(&encrypted).to_string())
    }

    fn rc4(key: &str, string: &str) -> String {
        let mut res = String::new();
        let mut s = (0..256).collect::<Vec<_>>();
        let key_len = key.len();
        let mut j = 0;
        for i in 0..256 {
            j = (j + s[i] + key.chars().nth(i % key_len).unwrap() as i32) % 256;
            s.swap(i, j as usize);
        }
        let mut i = 0;
        j = 0;
        for char in string.trim().chars() {
            i = (i + 1) % 256;
            j = (j + s[i]) % 256;
            s.swap(i, j as usize);
            let index = ((s[i] + s[j as usize]) % 256) as usize;
            let position = char as i32 ^ s[index];
            res.push(char::from_u32(position as u32).unwrap());
        }
        res
    }
    fn uri_encode(data: &str) -> String {
        utf8_percent_encode(data, NON_ALPHANUMERIC).to_string()
    }
}