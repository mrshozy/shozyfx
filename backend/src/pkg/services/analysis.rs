use std::collections::HashMap;

use crate::pkg::models::charts::LineChartStrength;
use crate::pkg::models::currency::CurrencyStrength;

fn calculate_absolute_average(currency_data: &Vec<LineChartStrength>) -> (f32, f32) {
    let absolute_averages: Vec<f32> = currency_data.iter().map(|data| data.average.abs()).collect();
    let average: Vec<f32> = currency_data.iter().map(|data| data.average).collect();
    let total_absolute_average: f32 = absolute_averages.iter().sum();
    let total_average: f32 = average.iter().sum();
    (total_absolute_average / absolute_averages.len() as f32,
     total_average / average.len() as f32)
}

pub fn absolute_average(data: &HashMap<String, Vec<LineChartStrength>>) -> Vec<CurrencyStrength> {
    let mut array: Vec<CurrencyStrength> = vec![];
    for (key, value) in data {
        let (absolute, average) = calculate_absolute_average(&value);
        array.push(CurrencyStrength::new((key.clone(), absolute, average, value.last().map_or_else(
            || 0.0, |s| s.strength))));
    }
    array.sort_by(|a, b| a.absolute_value.partial_cmp(&b.absolute_value).unwrap());
    return array;
}