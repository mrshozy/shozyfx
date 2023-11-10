use std::collections::HashMap;
use log::info;
use crate::pkg::models::charts::LineChartStrength;
use crate::pkg::models::currency::{Currency, CurrencyPair};


fn calculate_strength(pairs: &Vec<&CurrencyPair>, currencies: &Vec<Currency>, map: &mut HashMap<String, Vec<LineChartStrength>>){
    for currency in currencies.iter(){
        let others = pairs.iter().filter(|c| c.pair.contains(&currency.code)).collect::<Vec<_>>();
        let time = others.first().unwrap().timestamp;
        let mut strength = 0.0;
        let mut average = 0.0;
        for other in others.iter(){
            if other.base == currency.code {
                average += other.pcp;
                strength += if other.pcp >= 0.0 { 1.0 }else{ -1.0 };
            }else{
                average -= other.pcp;
                strength += if other.pcp >= 0.0 { -1.0 }else{ 1.0 };
            }
        }
        average /= others.len() as f32;
        strength /= 7.0;
        let charts = LineChartStrength{strength, average, time};
        let entry = map.entry(currency.code.clone()).or_insert(Vec::new());
        entry.push(charts)

    }
}

fn map_currencies(pairs: &Vec<CurrencyPair>) -> HashMap<i64, Vec<&CurrencyPair>> {
    let mut map: HashMap<i64, Vec<&CurrencyPair>> = HashMap::new();
    for pair in pairs {
        let entry = map.entry(pair.timestamp).or_insert(Vec::new());
        entry.push(pair);
    }
    map
}

pub fn collect_data(pairs: &Vec<CurrencyPair>, currencies: &Vec<Currency>) -> HashMap<String, Vec<LineChartStrength>> {
    let mapped_data = map_currencies(pairs);
    let mut currency_data  = HashMap::new();
    for (_, pairs) in mapped_data.iter(){
        calculate_strength(pairs, currencies, &mut currency_data)
    }
    for (_, ref mut charts_data) in currency_data.iter_mut()  {
        charts_data.sort_by(|a, b| a.time.cmp(&b.time))
    }
    currency_data
}