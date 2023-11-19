export interface CurrencyData {
  time: number;
  average: number;
  strength: number;
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

const lineChartsData: LineChartsData = {};

currencies.forEach((currency) => {
  lineChartsData[currency] = [];
});

export { lineChartsData };
