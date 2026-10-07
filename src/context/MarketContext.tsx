import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Asset,
  Candle,
  MarketAlert,
  MarketQuote,
  TechnicalIndicatorsState,
  Timeframe,
  IndicatorValues,
} from '../types/market';
import { marketDataService } from '../services/marketDataProvider';
import { alertService } from '../services/alertService';
import { getLatestIndicatorValues } from '../services/technicalIndicators';

interface MarketContextType {
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  activeQuote: MarketQuote;
  quotes: MarketQuote[];
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  candles: Candle[];
  indicators: TechnicalIndicatorsState;
  toggleIndicator: (key: keyof TechnicalIndicatorsState) => void;
  indicatorValues: IndicatorValues;
  alerts: MarketAlert[];
  createAlert: (data: { symbol: string; condition: any; targetPrice: number; note?: string }) => MarketAlert;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  recentTrigger: { alert: MarketAlert; quote: MarketQuote } | null;
  dismissTrigger: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  alertModalOpen: boolean;
  setAlertModalOpen: (open: boolean) => void;
  indicatorsModalOpen: boolean;
  setIndicatorsModalOpen: (open: boolean) => void;
  lastTickSymbol: string | null;
  assets: Asset[];
}

const defaultIndicators: TechnicalIndicatorsState = {
  ema9: true,
  ema21: true,
  sma200: false,
  rsi14: true,
  bollingerBands: false,
  vwap: false,
  macd: false,
  volume: true,
};

const MarketContext = createContext<MarketContextType | null>(null);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSymbol, setSelectedSymbolState] = useState<string>('BTCUSD');
  const [quotes, setQuotes] = useState<MarketQuote[]>(() => marketDataService.getAllQuotes());
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [candles, setCandles] = useState<Candle[]>(() => marketDataService.getCandles('BTCUSD', '1D'));
  const [indicators, setIndicators] = useState<TechnicalIndicatorsState>(defaultIndicators);
  const [alerts, setAlerts] = useState<MarketAlert[]>(() => alertService.getAlerts());
  const [recentTrigger, setRecentTrigger] = useState<{ alert: MarketAlert; quote: MarketQuote } | null>(null);
  const [lastTickSymbol, setLastTickSymbol] = useState<string | null>(null);

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [indicatorsModalOpen, setIndicatorsModalOpen] = useState(false);

  // Active quote
  const activeQuote = useMemo(() => {
    return quotes.find((q) => q.symbol === selectedSymbol) || quotes[0];
  }, [quotes, selectedSymbol]);

  // Set selected symbol with candle refresh
  const setSelectedSymbol = useCallback((symbol: string) => {
    const upper = symbol.toUpperCase();
    setSelectedSymbolState(upper);
    const newCandles = marketDataService.getCandles(upper, timeframe);
    setCandles(newCandles);
  }, [timeframe]);

  // Handle timeframe change
  const handleTimeframeChange = useCallback((newTf: Timeframe) => {
    setTimeframe(newTf);
    const newCandles = marketDataService.getCandles(selectedSymbol, newTf);
    setCandles(newCandles);
  }, [selectedSymbol]);

  // Subscribe to market quotes and alerts
  useEffect(() => {
    const unsubQuotes = marketDataService.subscribeToQuotes((updated) => {
      setQuotes([...updated]);
    });

    const unsubAlerts = alertService.subscribe((updatedAlerts) => {
      setAlerts(updatedAlerts);
    });

    const unsubTriggers = alertService.onTrigger((alert, quote) => {
      setRecentTrigger({ alert, quote });
    });

    return () => {
      unsubQuotes();
      unsubAlerts();
      unsubTriggers();
    };
  }, []);

  // Live simulation tick interval (every 1800ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const tick = marketDataService.updateLiveTick();
      if (tick) {
        setLastTickSymbol(tick.symbol);
        alertService.evaluateQuote(tick.quote);

        // If the tick affected the currently viewed symbol, refresh candles
        if (tick.symbol === selectedSymbol) {
          const currentCandles = marketDataService.getCandles(selectedSymbol, timeframe);
          setCandles([...currentCandles]);
        }
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [selectedSymbol, timeframe]);

  // Calculate current indicator numbers
  const indicatorValues = useMemo(() => {
    return getLatestIndicatorValues(candles);
  }, [candles]);

  const toggleIndicator = useCallback((key: keyof TechnicalIndicatorsState) => {
    setIndicators((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const createAlert = useCallback((data: { symbol: string; condition: any; targetPrice: number; note?: string }) => {
    return alertService.createAlert(data);
  }, []);

  const toggleAlert = useCallback((id: string) => {
    alertService.toggleAlertStatus(id);
  }, []);

  const deleteAlert = useCallback((id: string) => {
    alertService.deleteAlert(id);
  }, []);

  const dismissTrigger = useCallback(() => {
    setRecentTrigger(null);
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setAlertModalOpen(false);
        setIndicatorsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const assets = useMemo(() => marketDataService.getAssets(), []);

  return (
    <MarketContext.Provider
      value={{
        selectedSymbol,
        setSelectedSymbol,
        activeQuote,
        quotes,
        timeframe,
        setTimeframe: handleTimeframeChange,
        candles,
        indicators,
        toggleIndicator,
        indicatorValues,
        alerts,
        createAlert,
        toggleAlert,
        deleteAlert,
        recentTrigger,
        dismissTrigger,
        searchOpen,
        setSearchOpen,
        alertModalOpen,
        setAlertModalOpen,
        indicatorsModalOpen,
        setIndicatorsModalOpen,
        lastTickSymbol,
        assets,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
