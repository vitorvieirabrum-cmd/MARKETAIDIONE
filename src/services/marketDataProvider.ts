import { Asset, Candle, MarketQuote, Timeframe, DataSourceReference } from '../types/market';

export interface MarketDataProvider {
  getAssets(source?: DataSourceReference | 'all'): Asset[];
  getQuote(symbol: string): MarketQuote | undefined;
  getAllQuotes(source?: DataSourceReference | 'all'): MarketQuote[];
  getCandles(symbol: string, timeframe: Timeframe): Candle[];
  searchAssets(query: string, source?: DataSourceReference | 'all'): Asset[];
  subscribeToQuotes(callback: (updatedQuotes: MarketQuote[]) => void): () => void;
  updateLiveTick(): { symbol: string; quote: MarketQuote; newCandlePoint?: Candle } | null;
}

// Initial Catalog of assets with dual references: TradingView & Quotex
export const INITIAL_ASSETS: Asset[] = [
  // --- TRADINGVIEW INSTITUTIONAL ASSETS ---
  // Crypto (TradingView / Binance / Coinbase)
  { symbol: 'BTCUSD', name: 'Bitcoin Spot', category: 'crypto', currency: 'USD', decimals: 2, sector: 'Digital Store of Value', dataSource: 'tradingview' },
  { symbol: 'ETHUSD', name: 'Ethereum Spot', category: 'crypto', currency: 'USD', decimals: 2, sector: 'Smart Contracts Platform', dataSource: 'tradingview' },
  { symbol: 'SOLUSD', name: 'Solana Spot', category: 'crypto', currency: 'USD', decimals: 2, sector: 'Layer 1 Blockchain', dataSource: 'tradingview' },
  // US Equities (TradingView / NASDAQ & NYSE)
  { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'stocks', currency: 'USD', decimals: 2, sector: 'Semiconductors & AI Hardware', dataSource: 'tradingview' },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stocks', currency: 'USD', decimals: 2, sector: 'Consumer Electronics', dataSource: 'tradingview' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stocks', currency: 'USD', decimals: 2, sector: 'Electric Vehicles & Clean Tech', dataSource: 'tradingview' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'stocks', currency: 'USD', decimals: 2, sector: 'Cloud & Enterprise Software', dataSource: 'tradingview' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'stocks', currency: 'USD', decimals: 2, sector: 'Search & Cloud Computing', dataSource: 'tradingview' },
  // Indices (TradingView Benchmarks)
  { symbol: 'SPX', name: 'S&P 500 Index', category: 'indices', currency: 'USD', decimals: 2, sector: 'US Equities Large Cap', dataSource: 'tradingview' },
  { symbol: 'NDX', name: 'Nasdaq 100 Index', category: 'indices', currency: 'USD', decimals: 2, sector: 'US Technology Benchmark', dataSource: 'tradingview' },
  // Forex Spot (TradingView / OANDA & FXCM)
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'forex', currency: 'USD', decimals: 4, sector: 'Major FX Pair', dataSource: 'tradingview' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'forex', currency: 'USD', decimals: 4, sector: 'Major FX Pair', dataSource: 'tradingview' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'forex', currency: 'JPY', decimals: 2, sector: 'Major FX Pair', dataSource: 'tradingview' },
  { symbol: 'USDBRL', name: 'Dólar Comercial / Real', category: 'forex', currency: 'BRL', decimals: 4, sector: 'Emerging Markets FX', dataSource: 'tradingview' },
  // Brasil (TradingView / B3 BM&F)
  { symbol: 'PETR4', name: 'Petrobras PN', category: 'b3', currency: 'BRL', decimals: 2, sector: 'Petróleo e Biocombustíveis', dataSource: 'tradingview' },
  { symbol: 'VALE3', name: 'Vale ON', category: 'b3', currency: 'BRL', decimals: 2, sector: 'Mineração e Metais', dataSource: 'tradingview' },
  { symbol: 'ITUB4', name: 'Itaú Unibanco PN', category: 'b3', currency: 'BRL', decimals: 2, sector: 'Serviços Financeiros / Bancos', dataSource: 'tradingview' },
  { symbol: 'BBAS3', name: 'Banco do Brasil ON', category: 'b3', currency: 'BRL', decimals: 2, sector: 'Serviços Financeiros / Bancos', dataSource: 'tradingview' },
  { symbol: 'WEGE3', name: 'WEG ON', category: 'b3', currency: 'BRL', decimals: 2, sector: 'Motores e Automação', dataSource: 'tradingview' },

  // --- QUOTEX OTC & 24/7 FAST MARKETS ---
  { symbol: 'EURUSD_OTC', name: 'EUR/USD (Quotex OTC)', category: 'otc', currency: 'USD', decimals: 4, sector: 'Quotex 24/7 OTC Currency', dataSource: 'quotex', otc: true, payout: 93 },
  { symbol: 'GBPUSD_OTC', name: 'GBP/USD (Quotex OTC)', category: 'otc', currency: 'USD', decimals: 4, sector: 'Quotex 24/7 OTC Currency', dataSource: 'quotex', otc: true, payout: 91 },
  { symbol: 'USDBRL_OTC', name: 'USD/BRL (Quotex OTC)', category: 'otc', currency: 'BRL', decimals: 4, sector: 'Quotex OTC Brasil 24/7', dataSource: 'quotex', otc: true, payout: 89 },
  { symbol: 'USDJPY_OTC', name: 'USD/JPY (Quotex OTC)', category: 'otc', currency: 'JPY', decimals: 2, sector: 'Quotex 24/7 OTC Currency', dataSource: 'quotex', otc: true, payout: 90 },
  { symbol: 'NZDUSD_OTC', name: 'NZD/USD (Quotex OTC)', category: 'otc', currency: 'USD', decimals: 4, sector: 'Quotex 24/7 OTC Currency', dataSource: 'quotex', otc: true, payout: 87 },
  { symbol: 'AUDCAD_OTC', name: 'AUD/CAD (Quotex OTC)', category: 'otc', currency: 'USD', decimals: 4, sector: 'Quotex 24/7 OTC Currency', dataSource: 'quotex', otc: true, payout: 88 },
  { symbol: 'BTC_QUOTEX', name: 'Bitcoin (Quotex 24/7)', category: 'otc', currency: 'USD', decimals: 2, sector: 'Quotex Fast Crypto', dataSource: 'quotex', otc: true, payout: 91 },
  { symbol: 'ETH_QUOTEX', name: 'Ethereum (Quotex 24/7)', category: 'otc', currency: 'USD', decimals: 2, sector: 'Quotex Fast Crypto', dataSource: 'quotex', otc: true, payout: 90 },
];

// Base initial prices and stats
const BASE_MARKET_DATA: Record<string, { price: number; change24h: number; high: number; low: number; volume: number; marketCap?: number; week52High: number; week52Low: number; payout?: number; sentiment?: number }> = {
  // TradingView Spot
  BTCUSD: { price: 67284.20, change24h: 2.84, high: 68150.00, low: 65410.00, volume: 28490000000, marketCap: 1324000000000, week52High: 73750.00, week52Low: 25100.00, sentiment: 68 },
  ETHUSD: { price: 3842.10, change24h: 1.53, high: 3890.00, low: 3760.00, volume: 15200000000, marketCap: 462000000000, week52High: 4090.00, week52Low: 1520.00, sentiment: 62 },
  SOLUSD: { price: 168.20, change24h: 3.12, high: 172.50, low: 161.80, volume: 4800000000, marketCap: 78500000000, week52High: 209.00, week52Low: 21.00, sentiment: 71 },
  NVDA: { price: 185.30, change24h: 1.42, high: 187.80, low: 182.40, volume: 32000000000, marketCap: 4500000000000, week52High: 195.00, week52Low: 45.00, sentiment: 65 },
  AAPL: { price: 232.40, change24h: 0.65, high: 234.10, low: 230.90, volume: 12000000000, marketCap: 3520000000000, week52High: 237.20, week52Low: 164.00, sentiment: 58 },
  TSLA: { price: 248.90, change24h: -1.25, high: 256.00, low: 244.50, volume: 18400000000, marketCap: 790000000000, week52High: 271.00, week52Low: 138.80, sentiment: 48 },
  MSFT: { price: 442.15, change24h: 0.48, high: 445.60, low: 440.00, volume: 9500000000, marketCap: 3280000000000, week52High: 468.35, week52Low: 312.00, sentiment: 55 },
  GOOGL: { price: 182.75, change24h: -0.32, high: 185.10, low: 181.50, volume: 7800000000, marketCap: 2260000000000, week52High: 191.75, week52Low: 125.00, sentiment: 52 },
  SPX: { price: 5821.42, change24h: 0.42, high: 5845.10, low: 5798.50, volume: 45000000000, week52High: 5878.00, week52Low: 4103.00, sentiment: 60 },
  NDX: { price: 18791.20, change24h: 0.81, high: 18880.00, low: 18640.00, volume: 28000000000, week52High: 19150.00, week52Low: 14058.00, sentiment: 64 },
  EURUSD: { price: 1.0865, change24h: -0.15, high: 1.0895, low: 1.0842, volume: 85000000000, week52High: 1.1210, week52Low: 1.0450, sentiment: 46 },
  GBPUSD: { price: 1.3024, change24h: 0.22, high: 1.3055, low: 1.2990, volume: 54000000000, week52High: 1.3430, week52Low: 1.2030, sentiment: 54 },
  USDJPY: { price: 152.45, change24h: 0.38, high: 153.10, low: 151.80, volume: 68000000000, week52High: 161.95, week52Low: 139.50, sentiment: 57 },
  USDBRL: { price: 5.4820, change24h: -0.45, high: 5.5210, low: 5.4650, volume: 18000000000, week52High: 5.8600, week52Low: 4.8500, sentiment: 44 },
  PETR4: { price: 39.21, change24h: 1.18, high: 39.85, low: 38.60, volume: 1450000000, marketCap: 512000000000, week52High: 42.90, week52Low: 29.40, sentiment: 67 },
  VALE3: { price: 62.81, change24h: -0.52, high: 63.90, low: 62.20, volume: 2100000000, marketCap: 284000000000, week52High: 76.50, week52Low: 52.80, sentiment: 49 },
  ITUB4: { price: 36.45, change24h: 0.85, high: 36.80, low: 36.10, volume: 980000000, marketCap: 356000000000, week52High: 37.90, week52Low: 26.50, sentiment: 61 },
  BBAS3: { price: 27.60, change24h: 1.45, high: 27.95, low: 27.15, volume: 620000000, marketCap: 158000000000, week52High: 29.80, week52Low: 21.20, sentiment: 63 },
  WEGE3: { price: 54.30, change24h: 2.10, high: 54.90, low: 53.10, volume: 740000000, marketCap: 228000000000, week52High: 56.40, week52Low: 32.10, sentiment: 69 },

  // Quotex OTC Markets
  EURUSD_OTC: { price: 1.0872, change24h: 0.42, high: 1.0910, low: 1.0825, volume: 450000000, week52High: 1.1210, week52Low: 1.0450, payout: 93, sentiment: 65 },
  GBPUSD_OTC: { price: 1.3038, change24h: 0.78, high: 1.3080, low: 1.2985, volume: 380000000, week52High: 1.3430, week52Low: 1.2030, payout: 91, sentiment: 72 },
  USDBRL_OTC: { price: 5.4890, change24h: 0.35, high: 5.5350, low: 5.4600, volume: 290000000, week52High: 5.8600, week52Low: 4.8500, payout: 89, sentiment: 58 },
  USDJPY_OTC: { price: 152.60, change24h: -0.22, high: 153.20, low: 151.90, volume: 410000000, week52High: 161.95, week52Low: 139.50, payout: 90, sentiment: 42 },
  NZDUSD_OTC: { price: 0.6085, change24h: 0.55, high: 0.6120, low: 0.6040, volume: 210000000, week52High: 0.6400, week52Low: 0.5850, payout: 87, sentiment: 61 },
  AUDCAD_OTC: { price: 0.9080, change24h: -0.30, high: 0.9125, low: 0.9040, volume: 195000000, week52High: 0.9350, week52Low: 0.8750, payout: 88, sentiment: 45 },
  BTC_QUOTEX: { price: 67310.00, change24h: 2.95, high: 68250.00, low: 65380.00, volume: 1800000000, week52High: 73750.00, week52Low: 25100.00, payout: 91, sentiment: 74 },
  ETH_QUOTEX: { price: 3848.50, change24h: 1.62, high: 3905.00, low: 3755.00, volume: 920000000, week52High: 4090.00, week52Low: 1520.00, payout: 90, sentiment: 68 },
};

// Generate realistic synthetic historical candles based on timeframe
function generateRealisticCandles(basePrice: number, count: number = 180, timeframe: Timeframe): Candle[] {
  const candles: Candle[] = [];
  const now = Math.floor(Date.now() / 1000);

  let stepSeconds = 86400; // 1D default
  switch (timeframe) {
    case '5s': stepSeconds = 5; break;
    case '15s': stepSeconds = 15; break;
    case '30s': stepSeconds = 30; break;
    case '1m': stepSeconds = 60; break;
    case '5m': stepSeconds = 300; break;
    case '15m': stepSeconds = 900; break;
    case '30m': stepSeconds = 1800; break;
    case '1h': stepSeconds = 3600; break;
    case '4h': stepSeconds = 14400; break;
    case '1D': stepSeconds = 86400; break;
    case '1W': stepSeconds = 604800; break;
    case '1M': stepSeconds = 2592000; break;
  }

  // Volatility scale per timeframe
  const tfVolatility: Record<Timeframe, number> = {
    '5s': 0.0004,
    '15s': 0.0008,
    '30s': 0.0012,
    '1m': 0.0018,
    '5m': 0.0035,
    '15m': 0.0055,
    '30m': 0.0075,
    '1h': 0.010,
    '4h': 0.018,
    '1D': 0.025,
    '1W': 0.050,
    '1M': 0.080,
  };

  const volatility = tfVolatility[timeframe] || 0.02;
  let currentClose = basePrice * (1 - (count * 0.0006));
  const startTime = now - count * stepSeconds;

  for (let i = 0; i < count; i++) {
    const time = startTime + i * stepSeconds;
    const open = currentClose;

    const randomShock = (Math.random() - 0.488) * 2;
    const changePercent = randomShock * volatility;
    let close = open * (1 + changePercent);

    const maxOC = Math.max(open, close);
    const minOC = Math.min(open, close);
    const high = maxOC + Math.random() * (open * volatility * 0.7);
    const low = Math.max(0.0001, minOC - Math.random() * (open * volatility * 0.7));

    const baseVol = basePrice > 1000 ? 500 : 25000;
    const volume = Math.floor(baseVol * (0.6 + Math.random() * 0.8 + Math.abs(changePercent) * 20));

    candles.push({
      time,
      open: Number(open.toFixed(basePrice < 5 ? 4 : 2)),
      high: Number(high.toFixed(basePrice < 5 ? 4 : 2)),
      low: Number(low.toFixed(basePrice < 5 ? 4 : 2)),
      close: Number(close.toFixed(basePrice < 5 ? 4 : 2)),
      volume,
    });

    currentClose = close;
  }

  // Adjust final candle to match basePrice closely
  const lastIndex = candles.length - 1;
  if (lastIndex >= 0) {
    candles[lastIndex].close = basePrice;
    candles[lastIndex].high = Math.max(candles[lastIndex].high, basePrice);
    candles[lastIndex].low = Math.min(candles[lastIndex].low, basePrice);
  }

  return candles;
}

export class MockMarketDataProvider implements MarketDataProvider {
  private assets: Asset[] = INITIAL_ASSETS;
  private quotes: Map<string, MarketQuote> = new Map();
  private candleCache: Map<string, Candle[]> = new Map();
  private subscribers: Set<(updatedQuotes: MarketQuote[]) => void> = new Set();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    this.assets.forEach((asset) => {
      const base = BASE_MARKET_DATA[asset.symbol] || {
        price: 100,
        change24h: 1.0,
        high: 105,
        low: 95,
        volume: 1000000,
        week52High: 120,
        week52Low: 80,
        sentiment: 55,
      };

      const changeAbs = Number(((base.price * base.change24h) / 100).toFixed(asset.decimals));
      const prevClose = Number((base.price - changeAbs).toFixed(asset.decimals));

      // 15 points sparkline
      const sparkline: number[] = [];
      let p = prevClose;
      for (let s = 0; s < 15; s++) {
        p += (Math.random() - 0.48) * (base.price * 0.004);
        sparkline.push(Number(p.toFixed(asset.decimals)));
      }
      sparkline[sparkline.length - 1] = base.price;

      const quote: MarketQuote = {
        symbol: asset.symbol,
        name: asset.name,
        category: asset.category,
        currency: asset.currency,
        price: base.price,
        change24h: base.change24h,
        changeAbs,
        high24h: base.high,
        low24h: base.low,
        openPrice: prevClose,
        prevClose,
        volume24h: base.volume,
        marketCap: base.marketCap,
        week52High: base.week52High,
        week52Low: base.week52Low,
        sparkline,
        lastUpdate: Date.now(),
        dataSource: asset.dataSource,
        otc: asset.otc,
        payout: asset.payout || base.payout,
        buyerSentiment: base.sentiment || 55,
      };

      this.quotes.set(asset.symbol, quote);
    });
  }

  getAssets(source?: DataSourceReference | 'all'): Asset[] {
    if (!source || source === 'all') return this.assets;
    return this.assets.filter((a) => a.dataSource === source);
  }

  getQuote(symbol: string): MarketQuote | undefined {
    return this.quotes.get(symbol.toUpperCase());
  }

  getAllQuotes(source?: DataSourceReference | 'all'): MarketQuote[] {
    const all = Array.from(this.quotes.values());
    if (!source || source === 'all') return all;
    return all.filter((q) => q.dataSource === source);
  }

  getCandles(symbol: string, timeframe: Timeframe): Candle[] {
    const key = `${symbol.toUpperCase()}_${timeframe}`;
    if (!this.candleCache.has(key)) {
      const quote = this.getQuote(symbol);
      const basePrice = quote ? quote.price : 100;
      const count = timeframe === '1D' || timeframe === '4h' ? 140 : 100;
      const candles = generateRealisticCandles(basePrice, count, timeframe);
      this.candleCache.set(key, candles);
    }
    return this.candleCache.get(key)!;
  }

  searchAssets(query: string, source?: DataSourceReference | 'all'): Asset[] {
    let pool = this.assets;
    if (source && source !== 'all') {
      pool = pool.filter((a) => a.dataSource === source);
    }
    if (!query || !query.trim()) return pool;
    const q = query.toLowerCase().trim();
    return pool.filter(
      (a) =>
        a.symbol.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.dataSource.toLowerCase().includes(q) ||
        (a.sector && a.sector.toLowerCase().includes(q))
    );
  }

  subscribeToQuotes(callback: (updatedQuotes: MarketQuote[]) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Simulates real-time tick fluctuation on active assets
   */
  updateLiveTick(): { symbol: string; quote: MarketQuote; newCandlePoint?: Candle } | null {
    // Pick randomly across TradingView and Quotex OTC assets
    const activeSymbols = [
      'BTCUSD', 'ETHUSD', 'NVDA', 'PETR4', 'VALE3', 'SPX',
      'EURUSD_OTC', 'GBPUSD_OTC', 'USDBRL_OTC', 'BTC_QUOTEX'
    ];
    const chosenSymbol = activeSymbols[Math.floor(Math.random() * activeSymbols.length)];
    const quote = this.quotes.get(chosenSymbol);
    if (!quote) return null;

    // Fast tick variation: slightly faster for Quotex OTC
    const isQuotex = quote.dataSource === 'quotex';
    const tickFactor = 1 + (Math.random() - 0.495) * (isQuotex ? 0.0035 : 0.0022);
    const decimals = quote.currency === 'USD' && quote.price < 5 ? 4 : (quote.currency === 'BRL' && quote.price < 10 ? 4 : 2);
    const newPrice = Number((quote.price * tickFactor).toFixed(decimals));

    const changeAbs = Number((newPrice - quote.prevClose).toFixed(decimals));
    const change24h = Number(((changeAbs / quote.prevClose) * 100).toFixed(2));
    const high24h = Math.max(quote.high24h, newPrice);
    const low24h = Math.min(quote.low24h, newPrice);

    // Subtle drift in buyer sentiment (Call vs Put)
    const sentimentDrift = (Math.random() - 0.5) * 2;
    const updatedSentiment = Math.max(20, Math.min(85, Math.round((quote.buyerSentiment || 55) + sentimentDrift)));

    const updatedSparkline = [...quote.sparkline.slice(1), newPrice];

    const updatedQuote: MarketQuote = {
      ...quote,
      price: newPrice,
      change24h,
      changeAbs,
      high24h,
      low24h,
      sparkline: updatedSparkline,
      lastUpdate: Date.now(),
      buyerSentiment: updatedSentiment,
    };

    this.quotes.set(chosenSymbol, updatedQuote);

    // Update latest candle in cached series
    let latestCandle: Candle | undefined;
    const defaultTimeframeKey = `${chosenSymbol}_1m`;
    const cached = this.candleCache.get(defaultTimeframeKey);
    if (cached && cached.length > 0) {
      const lastCandle = cached[cached.length - 1];
      lastCandle.close = newPrice;
      lastCandle.high = Math.max(lastCandle.high, newPrice);
      lastCandle.low = Math.min(lastCandle.low, newPrice);
      lastCandle.volume += Math.floor(Math.random() * 5 + 1);
      latestCandle = { ...lastCandle };
    }

    const allQuotes = this.getAllQuotes();
    this.subscribers.forEach((cb) => cb(allQuotes));

    return {
      symbol: chosenSymbol,
      quote: updatedQuote,
      newCandlePoint: latestCandle,
    };
  }
}

export const marketDataService = new MockMarketDataProvider();
