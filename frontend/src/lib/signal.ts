import { timestampToDate } from './date.ts';

interface CurrencyData {
  time: number;
  strength: number;
  average: number;
}

interface CurrencyMap {
  [currency: string]: CurrencyData[];
}

function calculateAverageStrength(currencyData: CurrencyData[]): number {
  const totalStrength = currencyData.slice(0, 6).reduce((sum, data) => sum + data.strength, 0);
  return totalStrength / currencyData.length;
}

export function findMostAndLeastPerformingCurrencies(currencyMap: CurrencyMap): void {
  let mostPerformingCurrency: string | null = null;
  let leastPerformingCurrency: string | null = null;
  let maxAverageStrength = Number.NEGATIVE_INFINITY;
  let minAverageStrength = Number.POSITIVE_INFINITY;

  for (const currency in currencyMap) {
    const averageStrength = calculateAverageStrength(currencyMap[currency]);
    if (averageStrength > maxAverageStrength) {
      maxAverageStrength = averageStrength;
      mostPerformingCurrency = currency;
    }

    if (averageStrength < minAverageStrength) {
      minAverageStrength = averageStrength;
      leastPerformingCurrency = currency;
    }
  }

  console.log(`Most Performing Currency: ${mostPerformingCurrency}`);
  console.log(`Least Performing Currency: ${leastPerformingCurrency}`);
}


export function findCurrencyChange(currencyRates: CurrencyMap, n: number) {
  let mostIncreasingCurrency: string | null = null;
  let mostDecreasingCurrency: string | null = null;
  let maxIncreasePercentage = Number.MIN_SAFE_INTEGER;
  let maxDecreasePercentage = Number.MAX_SAFE_INTEGER;
  for (const currency in currencyRates) {
    const data = currencyRates[currency];
    const initialStrength = data[data.length - n - 6].strength;
    const finalStrength = data[data.length - n - 1].strength;
    console.log(timestampToDate(data[data.length - n - 6].time), false);
    console.log(timestampToDate(data[data.length - n - 1].time), false);
    const percentageChange = ((finalStrength - initialStrength) / Math.abs(initialStrength)) * 100;

    if (percentageChange > maxIncreasePercentage) {
      mostIncreasingCurrency = currency;
      maxIncreasePercentage = percentageChange;
    }

    if (percentageChange < maxDecreasePercentage) {
      mostDecreasingCurrency = currency;
      maxDecreasePercentage = percentageChange;
    }
  }

  return {
    currencyMost: mostIncreasingCurrency!,
    currencyLeast: mostDecreasingCurrency!,
    increasePercentage: maxIncreasePercentage,
    decreasePercentage: maxDecreasePercentage,
  };
}

export function findCurrencyStrength(currencyRates: CurrencyMap, n: number) {
  let highestStrengthCurrency: string | null = null;
  let lowestStrengthCurrency: string | null = null;
  let highestStrength = Number.MIN_SAFE_INTEGER;
  let lowestStrength = Number.MAX_SAFE_INTEGER;

  for (const currency in currencyRates) {
    const data = currencyRates[currency];
    const strengths = data.slice(data.length - n - 6, data.length - n - 1).map((entry) => entry.strength);
    const averageStrength = strengths.reduce((sum, strength) => sum + strength, 0) / strengths.length;

    if (averageStrength > highestStrength) {
      highestStrengthCurrency = currency;
      highestStrength = averageStrength;
    }

    if (averageStrength < lowestStrength) {
      lowestStrengthCurrency = currency;
      lowestStrength = averageStrength;
    }
  }

  return {
    currencyMost: highestStrengthCurrency!,
    currencyLeast: lowestStrengthCurrency!,
    highestStrength,
    lowestStrength,
  };
}

export function makeTradeDecision(currencyRates: CurrencyMap, n: number) {
  const percentageAnalysis = findCurrencyChange(currencyRates, n);
  const strengthAnalysis = findCurrencyStrength(currencyRates, n);
  return {
    least: [strengthAnalysis.currencyLeast, percentageAnalysis.currencyLeast],
    most: [strengthAnalysis.currencyMost, percentageAnalysis.currencyMost],
  };
}



function calculateAbsoluteAverage(currencyData: CurrencyData[]): number {
  const absoluteAverages = currencyData.map((data) => Math.abs(data.average));
  const totalAbsoluteAverage = absoluteAverages.reduce((acc, curr) => acc + curr, 0);
  return totalAbsoluteAverage / absoluteAverages.length;
}

export function sortByAbsoluteAverage(currencies: CurrencyMap) {
  let averages: {currency:string, day_average: number}[] = []
  for (const currency in currencies) {
    const data = currencies[currency];
    const day_average = calculateAbsoluteAverage(data)
    averages.push({currency, day_average})
  }
  averages.sort((a,b) => a.day_average-b.day_average)
  return averages
}