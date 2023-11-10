use serde::Serialize;
#[derive(Clone, Serialize)]
pub struct LineChartStrength{
    pub(crate) time: i64,
    pub(crate) strength: f32,
    pub(crate) average: f32
}