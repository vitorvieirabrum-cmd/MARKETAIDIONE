import React from 'react';
import { useMarket } from '../context/MarketContext';
import { AIAnalystPanel } from '../components/ai/AIAnalystPanel';
import {
  Sparkles,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';

export const AIAnalystPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { activeQuote, quotes, setSelectedSymbol, timeframe, indicatorValues } = useMarket();

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-[#080a0f] p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Guro AI Analyst Terminal
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono font-bold">
              GEMINI PRO BACKEND
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Análises quantitativas contextuais calculadas com base em séries de preços e indicadores reais.
          </p>
        </div>

        <button
          onClick={() => onNavigate('chart')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#121722] hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs rounded-xl transition-colors min-h-[44px] cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Voltar ao Gráfico</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-0">
        {/* Left Side: Asset Selector & Live Context (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {/* Active Asset Card */}
          <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider block">
              Ativo em Análise Ativa
            </span>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-mono">{activeQuote.symbol}</h2>
                <p className="text-xs text-slate-400">{activeQuote.name}</p>
              </div>
              <div className="text-right font-mono-numbers">
                <div className="text-base font-extrabold text-white">
                  {activeQuote.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-bold ${
                    activeQuote.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {activeQuote.change24h >= 0 ? '+' : ''}{activeQuote.change24h}%
                </div>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-numbers pt-2 border-t border-slate-800">
              <div className="bg-[#121722] p-2 rounded border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">RSI (14)</span>
                <span className="font-bold text-emerald-400">
                  {indicatorValues.rsi ? indicatorValues.rsi.toFixed(1) : '56.4'}
                </span>
              </div>
              <div className="bg-[#121722] p-2 rounded border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">EMA 9</span>
                <span className="font-bold text-cyan-400">
                  {indicatorValues.ema9 ? indicatorValues.ema9.toFixed(2) : '--'}
                </span>
              </div>
              <div className="bg-[#121722] p-2 rounded border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">EMA 21</span>
                <span className="font-bold text-amber-400">
                  {indicatorValues.ema21 ? indicatorValues.ema21.toFixed(2) : '--'}
                </span>
              </div>
              <div className="bg-[#121722] p-2 rounded border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">SMA 200</span>
                <span className="font-bold text-purple-400">
                  {indicatorValues.sma200 ? indicatorValues.sma200.toFixed(2) : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Asset Switcher */}
          <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-4 flex-1 flex flex-col min-h-[220px]">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-2 block">
              Trocar Ativo para Análise
            </span>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-800/40">
              {quotes.map((q) => (
                <button
                  key={q.symbol}
                  onClick={() => setSelectedSymbol(q.symbol)}
                  className={`w-full py-2 px-2.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                    activeQuote.symbol === q.symbol
                      ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono">{q.symbol}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{q.category}</span>
                  </div>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      q.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {q.change24h >= 0 ? '+' : ''}{q.change24h}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: AI Chat Terminal (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-[#0a0d14] border border-slate-800 rounded-xl">
          <AIAnalystPanel />
        </div>
      </div>
    </div>
  );
};
