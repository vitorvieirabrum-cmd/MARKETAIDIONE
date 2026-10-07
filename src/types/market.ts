export type MarketCategory = 'crypto' | 'stocks' | 'indices' | 'forex' | 'b3';

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1D' | '1W' | '1M';

export interface Asset {
  symbol: string;
  name: string;
  category: MarketCategory;
  currency: 'USD' | 'BRL' | 'EUR' | 'GBP' | 'JPY';
  decimals: number;
  description?: string;
  sector?: string;
}

export interface Candle {
  time: number | string; // unix timestamp in seconds or YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  category: MarketCategory;
  currency: 'USD' | 'BRL' | 'EUR' | 'GBP' | 'JPY';
  price: number;
  change24h: number;
  changeAbs: number;
  high24h: number;
  low24h: number;
  openPrice: number;
  prevClose: number;
  volume24h: number;
  marketCap?: number;
  week52High: number;
  week52Low: number;
  sparkline: number[];
  lastUpdate: number;
}

export interface TechnicalIndicatorsState {
  ema9: boolean;
  ema21: boolean;
  sma200: boolean;
  rsi14: boolean;
  bollingerBands: boolean;
  vwap: boolean;
  macd: boolean;
  volume: boolean;
}

export interface IndicatorValues {
  ema9?: number;
  ema21?: number;
  sma200?: number;
  rsi?: number;
  bollingerUpper?: number;
  bollingerMiddle?: number;
  bollingerLower?: number;
  vwap?: number;
  macdLine?: number;
  macdSignal?: number;
  macdHist?: number;
}

export type AlertCondition = 'greater_than' | 'less_than' | 'cross_up' | 'cross_down';
export type AlertStatus = 'active' | 'triggered' | 'paused';

export interface MarketAlert {
  id: string;
  symbol: string;
  condition: AlertCondition;
  targetPrice: number;
  status: AlertStatus;
  createdAt: number;
  triggeredAt?: number;
  note?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'FREE' | 'PRO' | 'PRO+';
  watchlist: string[];
  theme: 'dark';
  preferences: {
    defaultTimeframe: Timeframe;
    soundEnabled: boolean;
    streamUpdates: boolean;
  };
}

export interface ScreenerItem extends MarketQuote {
  rsi14: number;
  ema20Dist: number;
  sma200Status: 'above' | 'below';
  trend: 'Forte Alta' | 'Alta' | 'Neutro' | 'Baixa' | 'Forte Baixa';
}

export interface AIAnalysisRequest {
  symbol: string;
  assetName: string;
  timeframe: Timeframe;
  currentPrice: number;
  change24h: number;
  candles: Candle[];
  indicators: IndicatorValues;
  userQuestion?: string;
  mode?: 'overview' | 'indicators' | 'support_resistance' | 'trend' | 'custom';
}

export interface AIAnalysisResponse {
  analysis: string;
  source: string;
  disclaimer: string;
}
