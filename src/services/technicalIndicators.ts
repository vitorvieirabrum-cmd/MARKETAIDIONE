import { Candle, IndicatorValues } from '../types/market';

/**
 * Calculates Simple Moving Average (SMA) series
 */
export function calculateSMA(data: Candle[], period: number): { time: any; value: number }[] {
  const result: { time: any; value: number }[] = [];
  if (data.length < period) return result;

  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].close;
    if (i >= period) {
      sum -= data[i - period].close;
    }
    if (i >= period - 1) {
      result.push({
        time: data[i].time,
        value: Number((sum / period).toFixed(4)),
      });
    }
  }
  return result;
}

/**
 * Calculates Exponential Moving Average (EMA) series
 */
export function calculateEMA(data: Candle[], period: number): { time: any; value: number }[] {
  const result: { time: any; value: number }[] = [];
  if (data.length < period) return result;

  const multiplier = 2 / (period + 1);

  // Initial SMA for first EMA point
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let currentEma = sum / period;
  result.push({
    time: data[period - 1].time,
    value: Number(currentEma.toFixed(4)),
  });

  for (let i = period; i < data.length; i++) {
    currentEma = (data[i].close - currentEma) * multiplier + currentEma;
    result.push({
      time: data[i].time,
      value: Number(currentEma.toFixed(4)),
    });
  }

  return result;
}

/**
 * Calculates Wilder's Relative Strength Index (RSI 14)
 */
export function calculateRSI(data: Candle[], period: number = 14): { time: any; value: number }[] {
  const result: { time: any; value: number }[] = [];
  if (data.length <= period) return result;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let rsi = 100 - (100 / (1 + rs));

  result.push({
    time: data[period].time,
    value: Number(rsi.toFixed(2)),
  });

  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const currentGain = change >= 0 ? change : 0;
    const currentLoss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi = 100 - (100 / (1 + rs));

    result.push({
      time: data[i].time,
      value: Number(rsi.toFixed(2)),
    });
  }

  return result;
}

/**
 * Calculates Bollinger Bands (20 periods, 2 stdDev)
 */
export function calculateBollingerBands(
  data: Candle[],
  period: number = 20,
  multiplier: number = 2
): {
  upper: { time: any; value: number }[];
  middle: { time: any; value: number }[];
  lower: { time: any; value: number }[];
} {
  const upper: { time: any; value: number }[] = [];
  const middle: { time: any; value: number }[] = [];
  const lower: { time: any; value: number }[] = [];

  if (data.length < period) return { upper, middle, lower };

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += data[j].close;
    }
    const sma = sum / period;

    let varianceSum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      varianceSum += Math.pow(data[j].close - sma, 2);
    }
    const stdDev = Math.sqrt(varianceSum / period);

    const time = data[i].time;
    middle.push({ time, value: Number(sma.toFixed(4)) });
    upper.push({ time, value: Number((sma + stdDev * multiplier).toFixed(4)) });
    lower.push({ time, value: Number((sma - stdDev * multiplier).toFixed(4)) });
  }

  return { upper, middle, lower };
}

/**
 * Calculates VWAP (Volume Weighted Average Price)
 */
export function calculateVWAP(data: Candle[]): { time: any; value: number }[] {
  const result: { time: any; value: number }[] = [];
  let cumulativeTypicalPriceVolume = 0;
  let cumulativeVolume = 0;

  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3;
    cumulativeTypicalPriceVolume += typicalPrice * data[i].volume;
    cumulativeVolume += data[i].volume;

    const vwap = cumulativeVolume === 0 ? typicalPrice : cumulativeTypicalPriceVolume / cumulativeVolume;
    result.push({
      time: data[i].time,
      value: Number(vwap.toFixed(4)),
    });
  }

  return result;
}

/**
 * Extracts latest scalar indicator values for AI and summary badges
 */
export function getLatestIndicatorValues(candles: Candle[]): IndicatorValues {
  if (!candles || candles.length === 0) return {};

  const ema9Series = calculateEMA(candles, 9);
  const ema21Series = calculateEMA(candles, 21);
  const sma200Series = calculateSMA(candles, Math.min(200, candles.length > 50 ? 50 : 20));
  const rsiSeries = calculateRSI(candles, 14);
  const bbSeries = calculateBollingerBands(candles, 20, 2);
  const vwapSeries = calculateVWAP(candles);

  return {
    ema9: ema9Series.length ? ema9Series[ema9Series.length - 1].value : undefined,
    ema21: ema21Series.length ? ema21Series[ema21Series.length - 1].value : undefined,
    sma200: sma200Series.length ? sma200Series[sma200Series.length - 1].value : undefined,
    rsi: rsiSeries.length ? rsiSeries[rsiSeries.length - 1].value : undefined,
    bollingerUpper: bbSeries.upper.length ? bbSeries.upper[bbSeries.upper.length - 1].value : undefined,
    bollingerMiddle: bbSeries.middle.length ? bbSeries.middle[bbSeries.middle.length - 1].value : undefined,
    bollingerLower: bbSeries.lower.length ? bbSeries.lower[bbSeries.lower.length - 1].value : undefined,
    vwap: vwapSeries.length ? vwapSeries[vwapSeries.length - 1].value : undefined,
  };
}
