import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { Star, TrendingUp, DollarSign, Activity, BarChart2, Shield } from 'lucide-react';

export const AssetDetailsPanel: React.FC = () => {
  const { activeQuote } = useMarket();
  const { isInWatchlist, toggleWatchlist } = useAuth();

  const isUp = activeQuote.change24h >= 0;
  const inWatchlist = isInWatchlist(activeQuote.symbol);

  const formatNumber = (num?: number, decimals: number = 2) => {
    if (num === undefined || num === null) return '--';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const formatLargeNumber = (num?: number) => {
    if (!num) return '--';
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString('pt-BR');
  };

  return (
    <div className="bg-[#0a0d14] border border-slate-800/80 rounded-xl p-2.5 sm:p-3 text-xs select-none shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/70">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => toggleWatchlist(activeQuote.symbol)}
            title={inWatchlist ? 'Remover da watchlist' : 'Adicionar à watchlist'}
            className={`p-2 rounded-lg border transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 cursor-pointer ${
              inWatchlist
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-4 h-4 ${inWatchlist ? 'fill-amber-400' : ''}`} />
          </button>

          <div className="truncate">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-extrabold text-white font-mono tracking-tight">
                {activeQuote.symbol}
              </h2>
              <span className="text-xs text-slate-400 truncate max-w-[120px] sm:max-w-none">
                {activeQuote.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono font-bold uppercase border border-cyan-800/40">
                {activeQuote.category}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
              <span className="hidden xs:inline">Moeda: {activeQuote.currency}</span>
              <span className="hidden xs:inline text-slate-600">•</span>
              <span className="flex items-center gap-1.5 font-mono">
                {activeQuote.dataSource === 'quotex' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-cyan-300 font-semibold">Ref. Motor Quotex OTC</span>
                    {activeQuote.payout && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {activeQuote.payout}% Payout
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-blue-300 font-semibold">Ref. Feed TradingView Pro</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Big Live Price Display */}
        <div className="text-right font-mono-numbers shrink-0">
          <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {activeQuote.currency === 'USD' ? 'US$' : activeQuote.currency === 'BRL' ? 'R$' : ''}{' '}
            {formatNumber(activeQuote.price, activeQuote.price < 5 ? 4 : 2)}
          </div>
          <div className={`text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isUp ? '+' : ''}{formatNumber(activeQuote.changeAbs)} ({isUp ? '+' : ''}{activeQuote.change24h.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Grid of Fundamental & Statistical Metrics (Horizontal scroll on iPhone for clean touch experience) */}
      <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2.5 overflow-x-auto no-scrollbar font-mono-numbers text-[11px]">
        <div className="bg-[#0f1420] p-2 rounded-lg border border-slate-800/60 shrink-0 min-w-[95px] sm:min-w-0">
          <span className="text-slate-500 text-[9px] block uppercase font-mono">MÁXIMA 24H</span>
          <span className="font-semibold text-slate-200">{formatNumber(activeQuote.high24h)}</span>
        </div>

        <div className="bg-[#0f1420] p-2 rounded-lg border border-slate-800/60 shrink-0 min-w-[95px] sm:min-w-0">
          <span className="text-slate-500 text-[9px] block uppercase font-mono">MÍNIMA 24H</span>
          <span className="font-semibold text-slate-200">{formatNumber(activeQuote.low24h)}</span>
        </div>

        <div className="bg-[#0f1420] p-2 rounded-lg border border-slate-800/60 shrink-0 min-w-[95px] sm:min-w-0">
          <span className="text-slate-500 text-[9px] block uppercase font-mono">ABERTURA</span>
          <span className="font-semibold text-slate-200">{formatNumber(activeQuote.openPrice)}</span>
        </div>

        <div className="bg-[#0f1420] p-2 rounded-lg border border-slate-800/60 shrink-0 min-w-[95px] sm:min-w-0">
          <span className="text-slate-500 text-[9px] block uppercase font-mono">FECH. ANT.</span>
          <span className="font-semibold text-slate-200">{formatNumber(activeQuote.prevClose)}</span>
        </div>

        <div className="bg-[#0f1420] p-2 rounded-lg border border-slate-800/60 shrink-0 min-w-[95px] sm:min-w-0">
          <span className="text-slate-500 text-[9px] block uppercase font-mono">VOLUME 24H</span>
          <span className="font-semibold text-cyan-400">{formatLargeNumber(activeQuote.volume24h)}</span>
        </div>

        <div className="bg-[#0f1420] p-2 rounded-lg border border-slate-800/60 shrink-0 min-w-[95px] sm:min-w-0">
          <span className="text-slate-500 text-[9px] block uppercase font-mono">
            {activeQuote.category === 'crypto' ? 'VALOR MERCADO' : 'MARKET CAP'}
          </span>
          <span className="font-semibold text-slate-200">{formatLargeNumber(activeQuote.marketCap)}</span>
        </div>

        <div className="bg-[#0f1420] p-2 rounded-lg border border-slate-800/60 shrink-0 min-w-[95px] sm:min-w-0">
          <span className="text-slate-500 text-[9px] block uppercase font-mono">52W ALTA</span>
          <span className="font-semibold text-emerald-400">{formatNumber(activeQuote.week52High)}</span>
        </div>

        <div className="bg-[#0f1420] p-2 rounded-lg border border-slate-800/60 shrink-0 min-w-[95px] sm:min-w-0">
          <span className="text-slate-500 text-[9px] block uppercase font-mono">52W BAIXA</span>
          <span className="font-semibold text-rose-400">{formatNumber(activeQuote.week52Low)}</span>
        </div>
      </div>
    </div>
  );
};
