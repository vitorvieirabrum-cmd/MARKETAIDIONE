import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MarketTicker: React.FC = () => {
  const { quotes, setSelectedSymbol, lastTickSymbol } = useMarket();

  const tickerSymbols = [
    'BTCUSD',
    'ETHUSD',
    'EURUSD_OTC',
    'SOLUSD',
    'PETR4',
    'VALE3',
    'GBPUSD_OTC',
    'SPX',
    'NDX',
    'NVDA',
    'USDBRL_OTC',
  ];
  const tickerQuotes = quotes.filter((q) => tickerSymbols.includes(q.symbol));

  return (
    <div className="h-7 bg-[#07090e] border-b border-slate-800/60 overflow-hidden flex items-center select-none text-[11px] font-mono-numbers shrink-0">
      <div className="flex items-center px-3 bg-[#0d1017] border-r border-amber-500/20 shrink-0 h-full font-bold text-amber-300 text-[10px] tracking-wider uppercase font-mono gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        COLISEU · TRADINGVIEW & QUOTEX
      </div>

      <div className="flex items-center overflow-x-auto no-scrollbar whitespace-nowrap divide-x divide-slate-800/40">
        {tickerQuotes.map((quote) => {
          const isUp = quote.change24h >= 0;
          const isTicking = lastTickSymbol === quote.symbol;

          return (
            <button
              key={quote.symbol}
              onClick={() => setSelectedSymbol(quote.symbol)}
              className={`flex items-center gap-2 px-3 py-1 hover:bg-slate-800/40 transition-colors shrink-0 cursor-pointer ${
                isTicking ? (isUp ? 'flash-up' : 'flash-down') : ''
              }`}
            >
              <span className="font-bold text-slate-200">{quote.symbol}</span>
              <span className="text-slate-300 font-medium">
                {quote.price.toLocaleString('pt-BR', {
                  minimumFractionDigits: quote.price < 5 ? 4 : 2,
                })}
              </span>
              <span
                className={`flex items-center font-semibold text-[10px] ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <ArrowDownRight className="w-2.5 h-2.5 stroke-[3]" />
                )}
                {isUp ? '+' : ''}
                {quote.change24h.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
