import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { Search, X, Star, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { MarketCategory } from '../../types/market';

export const SymbolSearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, setSelectedSymbol, quotes, assets } = useMarket();
  const { isInWatchlist, toggleWatchlist } = useAuth();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  // Filtered assets list joined with real quote data
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    return assets
      .filter((asset) => {
        const matchesCategory = activeTab === 'all' || asset.category === activeTab;
        if (!matchesCategory) return false;
        if (!q) return true;
        return (
          asset.symbol.toLowerCase().includes(q) ||
          asset.name.toLowerCase().includes(q) ||
          (asset.sector && asset.sector.toLowerCase().includes(q))
        );
      })
      .map((asset) => {
        const quote = quotes.find((quo) => quo.symbol === asset.symbol);
        return {
          ...asset,
          price: quote ? quote.price : 0,
          change24h: quote ? quote.change24h : 0,
          volume: quote ? quote.volume24h : 0,
        };
      });
  }, [assets, quotes, query, activeTab]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 p-2 sm:p-4 bg-black/85 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#0e121a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-3 sm:px-4 py-3 border-b border-slate-800 bg-[#121722] gap-2.5">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ativo ou símbolo... (BTC, PETR4, NVDA)"
            className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              aria-label="Limpar busca"
              className="p-1.5 text-slate-400 hover:text-slate-200 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}

          {/* Close button for touch */}
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Fechar busca"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/80 bg-[#0b0e14] overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: 'Todos os Mercados' },
            { id: 'crypto', label: 'Cripto' },
            { id: 'stocks', label: 'Ações EUA' },
            { id: 'b3', label: 'Brasil (B3)' },
            { id: 'indices', label: 'Índices' },
            { id: 'forex', label: 'Forex' },
            { id: 'otc', label: 'Quotex OTC (24/7)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-medium">Nenhum ativo encontrado para "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Tente buscar por ticker (BTC, PETR4, NVDA) ou nome da empresa.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isUp = item.change24h >= 0;
              const inWatchlist = isInWatchlist(item.symbol);

              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    setSelectedSymbol(item.symbol);
                    setSearchOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(item.symbol);
                      }}
                      className={`p-1 rounded hover:bg-slate-700/60 transition-colors ${
                        inWatchlist ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${inWatchlist ? 'fill-amber-400' : ''}`} />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-mono-numbers">
                          {item.symbol}
                        </span>
                        {item.dataSource === 'quotex' ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800/60">
                            Quotex OTC {item.payout ? `+${item.payout}%` : ''}
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono uppercase">
                            {item.category}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          {item.name}
                        </span>
                      </div>
                      {item.sector && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.sector}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-mono-numbers">
                    <div className="text-sm font-semibold text-slate-100">
                      {item.currency === 'USD' ? '$' : item.currency === 'BRL' ? 'R$' : ''}{' '}
                      {item.price.toLocaleString('pt-BR', {
                        minimumFractionDigits: item.price < 5 ? 4 : 2,
                      })}
                    </div>
                    <div
                      className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? (
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                      <span>
                        {isUp ? '+' : ''}
                        {item.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 bg-[#090c12] text-[11px] text-slate-400">
          <span>{filteredItems.length} ativos disponíveis no catálogo</span>
          <div className="flex items-center gap-3">
            <span>Selecione para abrir o gráfico</span>
          </div>
        </div>
      </div>
    </div>
  );
};
