import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  ColorType,
  CrosshairMode,
  IChartApi,
} from 'lightweight-charts';
import { useMarket } from '../../context/MarketContext';
import { calculateBollingerBands, calculateEMA, calculateSMA, calculateVWAP, calculateMACD } from '../../services/technicalIndicators';
import { Maximize2, Minimize2, RefreshCw, SlidersHorizontal, Clock, Zap, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { Timeframe } from '../../types/market';

export const TradingChart: React.FC = () => {
  const {
    activeQuote,
    timeframe,
    setTimeframe,
    candles,
    indicators,
    setIndicatorsModalOpen,
  } = useMarket();

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(37);

  // Timeframe buttons list (includes fast Quotex turbo & TradingView classic)
  const timeframes: Timeframe[] = ['5s', '15s', '30s', '1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W'];

  // Quotex Candle Countdown Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 59 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatted countdown string (e.g. 00:37)
  const formattedCountdown = useMemo(() => {
    const m = Math.floor(secondsRemaining / 60);
    const s = secondsRemaining % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, [secondsRemaining]);

  // Sentiment percentages for Quotex / TradingView Crowd Gauge
  const buyerSentiment = activeQuote.buyerSentiment ?? 64;
  const sellerSentiment = 100 - buyerSentiment;

  // Latest candle for default OHLC display
  const latestCandle = candles[candles.length - 1];
  const displayCandle = hoveredCandle || latestCandle || {
    open: activeQuote.openPrice,
    high: activeQuote.high24h,
    low: activeQuote.low24h,
    close: activeQuote.price,
    volume: activeQuote.volume24h,
  };

  const candleChange = displayCandle
    ? displayCandle.close - displayCandle.open
    : activeQuote.changeAbs;
  const candleChangePct = displayCandle && displayCandle.open > 0
    ? (candleChange / displayCandle.open) * 100
    : activeQuote.change24h;
  const isUp = candleChange >= 0;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!chartContainerRef.current) return;
    const wrapper = chartContainerRef.current.parentElement;
    if (!document.fullscreenElement && wrapper) {
      wrapper.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Initialize and update Lightweight Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clear previous
    chartContainerRef.current.innerHTML = '';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#090c12' },
        textColor: '#94a3b8',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.45)' },
        horzLines: { color: 'rgba(30, 41, 59, 0.45)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#38bdf8',
          width: 1,
          style: 3, // dashed
          labelBackgroundColor: '#1e293b',
        },
        horzLine: {
          color: '#38bdf8',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1e293b',
        },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        scaleMargins: {
          top: 0.1,
          bottom: 0.22, // space for volume histogram
        },
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: timeframe === '5s' || timeframe === '15s' || timeframe === '30s',
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // 1. Candlestick Series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // Format candle series data (ensure sorted and unique time)
    const formattedCandles = candles.map((c) => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    candleSeries.setData(formattedCandles);

    // 2. Volume Series
    if (indicators.volume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: '', // overlay inside chart
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.78,
          bottom: 0,
        },
      });

      const volumeData = candles.map((c) => ({
        time: c.time as any,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
      }));
      volumeSeries.setData(volumeData);
    }

    // 3. Technical Indicators
    // EMA 9
    if (indicators.ema9) {
      const ema9Series = chart.addSeries(LineSeries, {
        color: '#38bdf8', // Cyan
        lineWidth: 2,
        title: 'EMA 9',
      });
      ema9Series.setData(calculateEMA(candles, 9));
    }

    // EMA 21
    if (indicators.ema21) {
      const ema21Series = chart.addSeries(LineSeries, {
        color: '#f59e0b', // Amber
        lineWidth: 2,
        title: 'EMA 21',
      });
      ema21Series.setData(calculateEMA(candles, 21));
    }

    // SMA 200
    if (indicators.sma200) {
      const sma200Series = chart.addSeries(LineSeries, {
        color: '#a855f7', // Purple
        lineWidth: 2,
        title: 'SMA 200',
      });
      const period = Math.min(200, candles.length > 50 ? 50 : 20);
      sma200Series.setData(calculateSMA(candles, period));
    }

    // Bollinger Bands
    if (indicators.bollingerBands) {
      const bb = calculateBollingerBands(candles, 20, 2);
      const upperSeries = chart.addSeries(LineSeries, {
        color: 'rgba(6, 182, 212, 0.65)',
        lineWidth: 1,
        title: 'BB Upper',
      });
      const middleSeries = chart.addSeries(LineSeries, {
        color: 'rgba(148, 163, 184, 0.5)',
        lineWidth: 1,
        lineStyle: 2,
        title: 'BB Mid',
      });
      const lowerSeries = chart.addSeries(LineSeries, {
        color: 'rgba(6, 182, 212, 0.65)',
        lineWidth: 1,
        title: 'BB Lower',
      });
      upperSeries.setData(bb.upper);
      middleSeries.setData(bb.middle);
      lowerSeries.setData(bb.lower);
    }

    // VWAP
    if (indicators.vwap) {
      const vwapSeries = chart.addSeries(LineSeries, {
        color: '#ec4899', // Pink
        lineWidth: 2,
        title: 'VWAP',
      });
      vwapSeries.setData(calculateVWAP(candles));
    }

    // MACD overlay (Fast line)
    if (indicators.macd) {
      const macdData = calculateMACD(candles);
      if (macdData.macd.length > 0) {
        const macdSeries = chart.addSeries(LineSeries, {
          color: '#3b82f6',
          lineWidth: 1,
          title: 'MACD',
        });
        macdSeries.setData(macdData.macd);
      }
    }

    // Crosshair move listener for interactive OHLC
    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.y < 0
      ) {
        setHoveredCandle(null);
      } else {
        const candleData = param.seriesData.get(candleSeries) as any;
        if (candleData) {
          const matchedCandle = candles.find((c) => c.time === param.time);
          setHoveredCandle({
            ...candleData,
            volume: matchedCandle?.volume || 0,
          });
        }
      }
    });

    // Fit content
    chart.timeScale().fitContent();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].target) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [candles, indicators, timeframe]);

  // Fit content helper
  const handleResetZoom = () => {
    chartRef.current?.timeScale().fitContent();
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#090c12] border border-slate-800/80 rounded-xl overflow-hidden select-none shadow-2xl">
      {/* Top Chart Toolbar: Timeframes, Reference Engine Badges & Controls */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b border-slate-800/80 bg-[#0c1017] gap-2 overflow-x-auto no-scrollbar">
        {/* Asset Header Info & Engine Reference Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-white tracking-wide text-xs sm:text-sm font-mono-numbers">
                {activeQuote.symbol}
              </span>
              <span className="text-[11px] text-slate-400 font-normal hidden xs:inline">
                {activeQuote.name}
              </span>

              {/* Data Engine Reference Badge: TradingView or Quotex */}
              {activeQuote.dataSource === 'quotex' ? (
                <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 font-mono font-bold border border-cyan-800/60 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  QUOTEX OTC
                  {activeQuote.payout && (
                    <span className="text-emerald-400 font-bold ml-0.5">+{activeQuote.payout}%</span>
                  )}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 font-mono font-bold border border-blue-800/60 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  TRADINGVIEW
                </span>
              )}
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Timeframe selector pills (Quotex Turbo 5s-30s + TradingView 1m-1W) */}
          <div className="flex items-center bg-[#06080d] p-0.5 rounded-lg border border-slate-800/80 overflow-x-auto no-scrollbar">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-[11px] font-mono font-medium rounded-md transition-all shrink-0 cursor-pointer min-h-[30px] flex items-center justify-center ${
                  timeframe === tf
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Right Action Controls: Candle Countdown, Sentiment Bar, Indicators & Zoom */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Candle Expiry Countdown Timer (Quotex style) */}
          <div className="hidden xs:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0e131d] border border-slate-800 text-[11px] font-mono text-slate-300 min-h-[32px]">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[10px]">Expira em:</span>
            <span className="font-bold text-white tracking-wider">{formattedCountdown}</span>
          </div>

          {/* Indicators Modal Trigger */}
          <button
            onClick={() => setIndicatorsModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors min-h-[32px] cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Indicadores</span>
            {indicators.ema9 || indicators.rsi14 || indicators.macd ? (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            ) : null}
          </button>

          <button
            onClick={handleResetZoom}
            title="Ajustar escala (Fit)"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Real-time OHLC & Quotex Crowd Sentiment Bar */}
      <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 text-xs border-b border-slate-800/50 bg-[#080b12] gap-2 overflow-x-auto no-scrollbar">
        {/* Dynamic OHLC Values */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono-numbers text-[10px] sm:text-[11px] shrink-0">
          <span className="text-slate-400">
            A: <strong className="text-slate-200 font-semibold">{displayCandle.open?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </span>
          <span className="text-slate-400">
            MÁX: <strong className="text-slate-200 font-semibold">{displayCandle.high?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </span>
          <span className="text-slate-400">
            MÍN: <strong className="text-slate-200 font-semibold">{displayCandle.low?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </span>
          <span className="text-slate-400">
            F: <strong className="text-slate-200 font-semibold">{displayCandle.close?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </span>
          <span className={`font-semibold flex items-center gap-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>{isUp ? '+' : ''}{candleChange.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span>({isUp ? '+' : ''}{candleChangePct.toFixed(2)}%)</span>
          </span>
          {displayCandle.volume ? (
            <span className="text-slate-400 hidden lg:inline">
              VOL: <strong className="text-slate-300 font-semibold">{displayCandle.volume.toLocaleString('pt-BR')}</strong>
            </span>
          ) : null}
        </div>

        {/* Quotex-Inspired Trader Sentiment Indicator Bar (Bull vs Bear) */}
        <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
          <span className="text-emerald-400 font-bold">{buyerSentiment}%</span>
          <div className="w-16 sm:w-24 h-1.5 bg-rose-500/70 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${buyerSentiment}%` }}
            />
          </div>
          <span className="text-rose-400 font-bold">{sellerSentiment}%</span>

          {/* Active Indicators Badges */}
          <div className="hidden md:flex items-center gap-1.5 ml-2">
            {indicators.ema9 && (
              <span className="text-[#38bdf8] flex items-center gap-1 bg-[#38bdf8]/10 px-1.5 py-0.5 rounded text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                EMA 9
              </span>
            )}
            {indicators.ema21 && (
              <span className="text-[#f59e0b] flex items-center gap-1 bg-[#f59e0b]/10 px-1.5 py-0.5 rounded text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                EMA 21
              </span>
            )}
            {indicators.rsi14 && (
              <span className="text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-1.5 py-0.5 rounded text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                RSI 14
              </span>
            )}
            {indicators.macd && (
              <span className="text-blue-400 flex items-center gap-1 bg-blue-400/10 px-1.5 py-0.5 rounded text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                MACD
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lightweight Candlestick Chart Viewport */}
      <div className="relative flex-1 w-full min-h-[320px]">
        <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};
