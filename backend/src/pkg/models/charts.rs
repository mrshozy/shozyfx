use serde::Serialize;
#[derive(Clone, Serialize)]
pub struct LineChartStrength{
    pub(crate) time: i64,
    pub(crate) strength: f32,
    pub(crate) average: f32
}

#[derive(Clone, Serialize)]
pub struct AreaChart{
    pub(crate) time: i64,
    pub(crate) price: f32,
    pub(crate) percentage: f32
}