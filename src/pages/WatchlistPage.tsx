import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

export const WatchlistPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { quotes, setSelectedSymbol, setSearchOpen, lastTickSymbol } = useMarket();
  const { user, toggleWatchlist } = useAuth();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const watchlistQuotes = quotes.filter((q) => {
    const inList = user.watchlist.includes(q.symbol);
    if (!inList) return false;
    if (activeCategory === 'all') return true;
    return q.category === activeCategory;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto w-full">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Minhas Watchlists
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
              {watchlistQuotes.length} ATIVOS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ativos favoritados com acompanhamento de cotações em streaming contínuo.
          </p>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all min-h-[44px] cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Ativos à Watchlist</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {['all', 'crypto', 'stocks', 'b3', 'indices', 'forex'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'Todos os Favoritos' : cat === 'b3' ? 'Brasil (B3)' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Watchlist Cards */}
      {watchlistQuotes.length === 0 ? (
        <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-12 text-center text-slate-400 space-y-3">
          <Star className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-medium text-slate-300">Nenhum ativo nesta categoria da watchlist.</p>
          <button
            onClick={() => setSearchOpen(true)}
            className="mt-2 px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-cyan-400 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Ativos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {watchlistQuotes.map((q) => {
            const isUp = q.change24h >= 0;
            const isTicking = lastTickSymbol === q.symbol;

            return (
              <div
                key={q.symbol}
                onClick={() => {
                  setSelectedSymbol(q.symbol);
                  onNavigate('chart');
                }}
                className={`p-4 rounded-xl bg-[#0e121a] border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-cyan-950/20 group relative ${
                  isTicking ? (isUp ? 'flash-up' : 'flash-down') : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-white font-mono">{q.symbol}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5 max-w-[160px]">{q.name}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(q.symbol);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-end justify-between font-mono-numbers">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">ÚLTIMO PREÇO</span>
                    <span className="text-base font-extrabold text-white">
                      {q.currency === 'USD' ? 'US$' : q.currency === 'BRL' ? 'R$' : ''}{' '}
                      {q.price.toLocaleString('pt-BR', { minimumFractionDigits: q.price < 5 ? 4 : 2 })}
                    </span>
                  </div>

                  <div className={`text-xs font-bold flex items-center gap-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" /> : <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{isUp ? '+' : ''}{q.change24h.toFixed(2)}%</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/40">
                  <span>Vol: {(q.volume24h / 1e6).toFixed(1)}M</span>
                  <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                    Abrir gráfico <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
