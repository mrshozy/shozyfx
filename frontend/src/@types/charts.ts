export interface CurrencyData {
  time: number;
  average: number;
  strength: number;
}

export interface PairData {
  time: number;
  price: number;
  percentage: number;
}

export enum CURRENCY {
  USD = 'USD',
  AUD = 'AUD',
  NZD = 'NZD',
  CAD = 'CAD',
  JPY = 'JPY',
  CHF = 'CHF',
  EUR = 'EUR',
  GBP = 'GBP',
}

export enum PAIR {
  EURUSD = 'EURUSD',
  EURJPY = 'EURJPY',
  EURGBP = 'EURGBP',
  EURNZD = 'EURNZD',
  EURCHF = 'EURCHF',
  EURAUD = 'EURAUD',
  EURCAD = 'EURCAD',
  USDJPY = 'USDJPY',
  USDCAD = 'USDCAD',
  USDCHF = 'USDCHF',
  CADJPY = 'CADJPY',
  AUDJPY = 'AUDJPY',
  AUDUSD = 'AUDUSD',
  AUDCAD = 'AUDCAD',
  AUDNZD = 'AUDNZD',
  AUDCHF = 'AUDCHF',
  NZDJPY = 'NZDJPY',
  NZDUSD = 'NZDUSD',
  NZDCAD = 'NZDCAD',
  NZDCHF = 'NZDCHF',
  GBPNZD = 'GBPNZD',
  GBPCHF = 'GBPCHF',
  GBPJPY = 'GBPJPY',
  GBPUSD = 'GBPUSD',
  GBPCAD = 'GBPCAD',
  GBPAUD = 'GBPAUD',
  CHFJPY = 'CHFJPY',
  CHFCAD = 'CHFCAD',
}

export interface LineChartsData {
  [key: string]: CurrencyData[];
}

export const currencies: CURRENCY[] = [
  CURRENCY.USD,
  CURRENCY.AUD,
  CURRENCY.NZD,
  CURRENCY.CAD,
  CURRENCY.JPY,
  CURRENCY.CHF,
  CURRENCY.EUR,
  CURRENCY.GBP,
];

export const PAIRS: PAIR[] = Object.values(PAIR);

const lineChartsData: LineChartsData = {};

currencies.forEach((currency) => {
  lineChartsData[currency] = [];
});


export { lineChartsData };
