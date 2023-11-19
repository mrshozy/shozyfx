use std::collections::HashMap;
use crate::pkg::models::currency::{Currency, CurrencyPair};

pub fn map_currencies<'a>(currencies: &Vec<Currency>, pairs: &'a Vec<CurrencyPair>, take: usize) -> HashMap<String, Vec<&'a CurrencyPair>> {
    let mut map: HashMap<String, Vec<&'a CurrencyPair>> = HashMap::new();
    for currency in currencies {
        let mut common = pairs.iter()
            .filter(|pair| pair.pair.contains(&currency.code))
            .collect::<Vec<_>>();
        common.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        let size = take * (currencies.len()-1);
        let last = common.into_iter().take(size).collect::<Vec<_>>();
        map.insert(currency.code.clone(), last);
    }
    map
}

