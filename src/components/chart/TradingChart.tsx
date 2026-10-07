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
import { calculateBollingerBands, calculateEMA, calculateSMA, calculateVWAP } from '../../services/technicalIndicators';
import { Maximize2, Minimize2, RefreshCw, SlidersHorizontal, Eye } from 'lucide-react';
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

  // Timeframe buttons list
  const timeframes: Timeframe[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W', '1M'];

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
        secondsVisible: false,
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
  }, [candles, indicators]);

  // Fit content helper
  const handleResetZoom = () => {
    chartRef.current?.timeScale().fitContent();
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#090c12] border border-slate-800/80 rounded-lg overflow-hidden select-none">
      {/* Top Chart Toolbar */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b border-slate-800/80 bg-[#0c1017] gap-2 overflow-x-auto no-scrollbar">
        {/* Asset Header Info */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-white tracking-wide text-xs sm:text-sm font-mono-numbers">
                {activeQuote.symbol}
              </span>
              <span className="text-[11px] text-slate-400 font-normal hidden xs:inline">
                {activeQuote.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 font-semibold uppercase tracking-wider">
                {activeQuote.category}
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Timeframe selector pills */}
          <div className="flex items-center bg-[#06080d] p-0.5 rounded-lg border border-slate-800/80 overflow-x-auto no-scrollbar">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-[11px] sm:text-xs font-mono font-medium rounded-md transition-all shrink-0 cursor-pointer min-h-[30px] flex items-center justify-center ${
                  timeframe === tf
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls & Indicators */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIndicatorsModalOpen(true)}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors min-h-[32px] cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">Indicadores</span>
            {indicators.ema9 || indicators.rsi14 ? (
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

      {/* Real-time OHLC & Indicator Bar */}
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

        {/* Active Indicators Pills */}
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono-numbers shrink-0">
          {indicators.ema9 && (
            <span className="text-[#38bdf8] flex items-center gap-1 bg-[#38bdf8]/10 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              EMA 9
            </span>
          )}
          {indicators.ema21 && (
            <span className="text-[#f59e0b] flex items-center gap-1 bg-[#f59e0b]/10 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              EMA 21
            </span>
          )}
          {indicators.sma200 && (
            <span className="text-[#a855f7] flex items-center gap-1 bg-[#a855f7]/10 px-1.5 py-0.5 rounded hidden sm:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
              SMA 200
            </span>
          )}
          {indicators.rsi14 && (
            <span className="text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              RSI 14
            </span>
          )}
        </div>
      </div>

      {/* Lightweight Candlestick Chart Viewport */}
      <div className="relative flex-1 w-full min-h-[360px]">
        <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};
