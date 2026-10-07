import React, { useMemo } from 'react';
import { useMarket } from '../../context/MarketContext';
import { calculateRSI } from '../../services/technicalIndicators';

export const RSIOscillator: React.FC = () => {
  const { candles, indicators } = useMarket();

  if (!indicators.rsi14) return null;

  const rsiSeries = useMemo(() => calculateRSI(candles, 14), [candles]);
  const currentRsi = rsiSeries.length > 0 ? rsiSeries[rsiSeries.length - 1].value : 50;

  // Recent 40 points for the SVG mini oscillator line
  const recentPoints = useMemo(() => rsiSeries.slice(-45), [rsiSeries]);

  const minVal = 0;
  const maxVal = 100;
  const height = 48;
  const width = 360;

  const pointsString = useMemo(() => {
    if (recentPoints.length === 0) return '';
    const stepX = width / (recentPoints.length - 1 || 1);
    return recentPoints
      .map((p, i) => {
        const x = i * stepX;
        const y = height - (p.value / 100) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [recentPoints]);

  let statusColor = 'text-slate-300';
  let badgeText = 'Neutro';
  if (currentRsi >= 70) {
    statusColor = 'text-rose-400 font-semibold';
    badgeText = 'Sobrecomprado (>70)';
  } else if (currentRsi <= 30) {
    statusColor = 'text-emerald-400 font-semibold';
    badgeText = 'Sobrevendido (<30)';
  }

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-[#0b0e15] border-t border-slate-800/80 text-xs">
      <div className="flex items-center gap-2 font-mono-numbers">
        <span className="font-semibold text-emerald-400 text-[11px]">RSI (14):</span>
        <span className={`text-[12px] font-bold ${statusColor}`}>{currentRsi.toFixed(1)}</span>
        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/80">
          {badgeText}
        </span>
      </div>

      {/* Mini SVG Oscillator line */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="relative w-44 h-8 bg-slate-900/60 rounded border border-slate-800/60 overflow-hidden flex items-center">
          {/* Overbought line 70% */}
          <div className="absolute top-[30%] left-0 right-0 h-[1px] bg-rose-500/30 border-b border-dashed border-rose-500/40" />
          {/* Neutral line 50% */}
          <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-slate-700/40" />
          {/* Oversold line 30% */}
          <div className="absolute bottom-[30%] left-0 right-0 h-[1px] bg-emerald-500/30 border-b border-dashed border-emerald-500/40" />

          {pointsString && (
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                points={pointsString}
              />
            </svg>
          )}
        </div>

        <div className="text-[10px] text-slate-400 font-mono flex flex-col items-end leading-tight">
          <span>70 OB</span>
          <span>30 OS</span>
        </div>
      </div>
    </div>
  );
};
