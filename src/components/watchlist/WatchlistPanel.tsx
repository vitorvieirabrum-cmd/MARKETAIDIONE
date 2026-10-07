import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Search, Star, Sparkles } from 'lucide-react';
import { MarketCategory } from '../../types/market';

export const WatchlistPanel: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const {
    quotes,
    selectedSymbol,
    setSelectedSymbol,
    lastTickSymbol,
    setSearchOpen,
  } = useMarket();

  const { user, toggleWatchlist } = useAuth();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter quotes based on watchlist or category
  const watchlistQuotes = quotes.filter((q) => {
    const inList = user.watchlist.includes(q.symbol);
    if (!inList) return false;
    if (filterCategory === 'all') return true;
    return q.category === filterCategory;
  });

  return (
    <div className="flex flex-col h-full bg-[#0b0e14] border-l border-slate-800/80 w-full select-none">
      {/* Watchlist Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800/80 bg-[#0f141f]">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          <span className="font-semibold text-white text-xs tracking-wider uppercase">
            Minha Watchlist
          </span>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.2 rounded">
            {watchlistQuotes.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            title="Adicionar Ativo"
            className="flex items-center gap-1 px-2 py-0.5 text-xs text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Adicionar</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-800/60 bg-[#0b0e14] overflow-x-auto no-scrollbar text-[11px]">
        {['all', 'crypto', 'stocks', 'b3', 'forex', 'otc'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'Todos' : cat === 'b3' ? 'Brasil' : cat === 'otc' ? 'Quotex OTC' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Symbol List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {watchlistQuotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 h-48">
            <Search className="w-6 h-6 mb-2 opacity-40 text-cyan-400" />
            <p className="text-xs">Nenhum ativo nesta categoria da watchlist.</p>
            <button
              onClick={() => setSearchOpen(true)}
              className="mt-3 text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar ativos
            </button>
          </div>
        ) : (
          watchlistQuotes.map((item) => {
            const isSelected = selectedSymbol === item.symbol;
            const isUp = item.change24h >= 0;
            const isTicking = lastTickSymbol === item.symbol;

            return (
              <div
                key={item.symbol}
                onClick={() => setSelectedSymbol(item.symbol)}
                className={`group flex items-center justify-between px-3 py-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-500/10 border-l-2 border-cyan-400'
                    : 'hover:bg-slate-800/40 border-l-2 border-transparent'
                } ${isTicking ? (isUp ? 'flash-up' : 'flash-down') : ''}`}
              >
                {/* Left: Symbol & Name */}
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white tracking-wide font-mono-numbers">
                      {item.symbol}
                    </span>
                    {item.dataSource === 'quotex' ? (
                      <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 font-mono font-bold">
                        {item.payout ? `${item.payout}%` : 'OTC'}
                      </span>
                    ) : (
                      <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[110px] mt-0.5">
                    {item.name}
                  </p>
                </div>

                {/* Right: Price & % Change */}
                <div className="text-right flex items-center gap-2">
                  <div className="font-mono-numbers">
                    <div className="text-xs font-semibold text-slate-100">
                      {item.currency === 'USD' ? '$' : item.currency === 'BRL' ? 'R$' : ''}{' '}
                      {item.price.toLocaleString('pt-BR', {
                        minimumFractionDigits: item.price < 5 ? 4 : 2,
                      })}
                    </div>
                    <div
                      className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? (
                        <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                      )}
                      <span>
                        {isUp ? '+' : ''}
                        {item.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Remove button (hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(item.symbol);
                    }}
                    title="Remover da watchlist"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Watchlist Quick Tip */}
      <div className="p-2 border-t border-slate-800/80 bg-[#090c12] text-[10px] text-slate-400 flex items-center justify-between">
        <span>Ticks simulados em tempo real</span>
        <span className="flex items-center gap-1 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Conectado
        </span>
      </div>
    </div>
  );
};
