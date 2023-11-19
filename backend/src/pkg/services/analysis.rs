// use std::collections::HashMap;
// use linreg::linear_regression;
// use crate::pkg::models::currency::CurrencyPair;
//
// fn calculate_regression(x: &Vec<f32>, y: &Vec<f32>) -> Result<(f32, f32), linreg::Error> {
//     Ok(linear_regression(x, y)?)
// }
//
// pub fn currencies_regression(map: &HashMap<String, Vec<&CurrencyPair>>) -> HashMap<String, (f32, f32)>{
//     let mut m: HashMap<String, (f32, f32)> = HashMap::new();
//     for (key, pairs) in map.iter(){
//         let mut time = HashMap::new();
//         for pair in pairs {
//             let entry = time.entry(pair.timestamp).or_insert(Vec::new());
//             entry.push(pair);
//         }
//         let mut strengths:Vec<f32> = vec![];
//         let mut avarage:Vec<f32> = vec![];
//         for (t, v) in time.iter(){
//             let mut av = 0.0;
//             let mut st = 0.0;
//             for p in v.iter() {
//                 if p.base == *key {
//                     av += p.pcp;
//                     st += if p.pcp >= 0.0 { 1.0 }else{ -1.0 };
//                 }else{
//                     av -= p.pcp;
//                     st += if p.pcp >= 0.0 { -1.0 }else{ 1.0 };
//                 }
//             }
//             avarage.push(av);
//             strengths.push(st)
//         }
//         let reg = calculate_regression(&avarage, &strengths).unwrap();
//         m.insert(key.clone(), reg);
//     }
//     m
// }

use std::collections::HashMap;
use linreg::linear_regression;
use log::info;
use crate::pkg::models::currency::CurrencyPair;

fn calculate_regression(x: &[f32], y: &[f32]) -> Result<(f32, f32), linreg::Error> {
    Ok(linear_regression(x, y)?)
}
pub fn currencies_regression(map: &HashMap<String, Vec<&CurrencyPair>>) -> HashMap<String, (f32, f32)> {
    let mut regression_results: HashMap<String, (f32, f32)> = HashMap::with_capacity(map.len());
    for (currency_key, currency_pairs) in map.iter() {
        let mut time_grouped_pairs: HashMap<_, Vec<_>> = HashMap::new();
        for pair in currency_pairs {
            time_grouped_pairs
                .entry(&pair.timestamp)
                .or_insert_with(Vec::new)
                .push(pair);
        }
        let (averages, strengths): (Vec<_>, Vec<_>) = time_grouped_pairs
            .iter()
            .map(|(_, pairs)| {
                pairs.iter().fold((0.0, 0.0), |(average, strength), currency_pair| {
                    let factor = if currency_pair.base == *currency_key { 1.0 } else { -1.0 };
                    (
                        average + factor * currency_pair.pcp,
                        strength + factor * if currency_pair.pcp >= 0.0 { 1.0 } else { -1.0 },
                    )
                })
            })
            .unzip();
        info!("{}, {:?} -> {:?}", currency_key,  averages, strengths);
        let regression_result = calculate_regression(&averages, &strengths).unwrap();
        regression_results.insert(currency_key.clone(), regression_result);
    }
    regression_results
}