import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import {
  Globe2,
  Search,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import { MarketCategory } from '../types/market';

export const MarketsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { quotes, setSelectedSymbol, lastTickSymbol, setAlertModalOpen } = useMarket();
  const { isInWatchlist, toggleWatchlist } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortField, setSortField] = useState<'symbol' | 'price' | 'change24h' | 'volume24h'>('change24h');
  const [sortAsc, setSortAsc] = useState(false);

  const tabs: { id: string; label: string }[] = [
    { id: 'all', label: 'Todos os Mercados' },
    { id: 'crypto', label: 'Criptomoedas' },
    { id: 'stocks', label: 'Ações EUA' },
    { id: 'b3', label: 'Brasil (B3)' },
    { id: 'indices', label: 'Índices Globais' },
    { id: 'forex', label: 'Forex & Câmbio' },
  ];

  // Filtering
  const filtered = quotes.filter((q) => {
    const matchesTab = activeTab === 'all' || q.category === activeTab;
    if (!matchesTab) return false;
    if (!searchFilter.trim()) return true;
    const s = searchFilter.toLowerCase();
    return q.symbol.toLowerCase().includes(s) || q.name.toLowerCase().includes(s);
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let res = 0;
    if (sortField === 'symbol') res = a.symbol.localeCompare(b.symbol);
    else if (sortField === 'price') res = a.price - b.price;
    else if (sortField === 'change24h') res = a.change24h - b.change24h;
    else if (sortField === 'volume24h') res = a.volume24h - b.volume24h;
    return sortAsc ? res : -res;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Mercados Globais & Ativos
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
              STREAMING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor de cotações em tempo real Guro do Trading, liquidez 24h e variações intradiárias.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrar por ticker ou empresa..."
            className="w-full bg-[#0e121a] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 min-h-[42px]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0b0e14] border border-slate-800/80 rounded-xl overflow-x-auto no-scrollbar text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors min-h-[38px] cursor-pointer flex items-center justify-center ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-[#0e121a] border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121722] text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800 select-none">
              <tr>
                <th className="py-3 px-4 w-10"></th>
                <th
                  onClick={() => handleSort('symbol')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  Ativo {sortField === 'symbol' && (sortAsc ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  Último Preço {sortField === 'price' && (sortAsc ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('change24h')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  Variação % {sortField === 'change24h' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">Var. Absoluta</th>
                <th className="py-3 px-3 text-right hidden md:table-cell">Máxima 24h</th>
                <th className="py-3 px-3 text-right hidden md:table-cell">Mínima 24h</th>
                <th
                  onClick={() => handleSort('volume24h')}
                  className="py-3 px-3 text-right hidden lg:table-cell cursor-pointer hover:text-white"
                >
                  Volume 24h {sortField === 'volume24h' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-center w-28">Tendência</th>
                <th className="py-3 px-4 text-center w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-mono-numbers">
              {sorted.map((q) => {
                const isUp = q.change24h >= 0;
                const inWatchlist = isInWatchlist(q.symbol);
                const isTicking = lastTickSymbol === q.symbol;

                return (
                  <tr
                    key={q.symbol}
                    onClick={() => {
                      setSelectedSymbol(q.symbol);
                      onNavigate('chart');
                    }}
                    className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      isTicking ? (isUp ? 'flash-up' : 'flash-down') : ''
                    }`}
                  >
                    {/* Star */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(q.symbol);
                        }}
                        className={`p-1 rounded hover:bg-slate-700/60 ${
                          inWatchlist ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Symbol & Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{q.symbol}</span>
                        <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-400 font-mono uppercase">
                          {q.category}
                        </span>
                        <span className="text-slate-400 truncate max-w-[140px] hidden sm:inline">
                          {q.name}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-semibold text-slate-100">
                      {q.currency === 'USD' ? 'US$' : q.currency === 'BRL' ? 'R$' : ''}{' '}
                      {q.price.toLocaleString('pt-BR', { minimumFractionDigits: q.price < 5 ? 4 : 2 })}
                    </td>

                    {/* % Change */}
                    <td
                      className={`py-3 px-3 text-right font-bold ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      <span className="inline-flex items-center gap-0.5 justify-end">
                        {isUp ? <ArrowUpRight className="w-3 h-3 stroke-[2.5]" /> : <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />}
                        {isUp ? '+' : ''}
                        {q.change24h.toFixed(2)}%
                      </span>
                    </td>

                    {/* Abs Change */}
                    <td
                      className={`py-3 px-3 text-right font-medium hidden sm:table-cell ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {q.changeAbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    {/* High */}
                    <td className="py-3 px-3 text-right text-slate-400 hidden md:table-cell">
                      {q.high24h.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Low */}
                    <td className="py-3 px-3 text-right text-slate-400 hidden md:table-cell">
                      {q.low24h.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right text-slate-300 hidden lg:table-cell font-mono">
                      {(q.volume24h / 1e6).toFixed(1)}M
                    </td>

                    {/* Sparkline mini */}
                    <td className="py-3 px-4 text-center">
                      <div className="w-20 h-5 mx-auto">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                          <path
                            d={`M 0 10 ${q.sparkline
                              .map((val, idx) => {
                                const min = Math.min(...q.sparkline);
                                const max = Math.max(...q.sparkline);
                                const range = max - min || 1;
                                const x = (idx / (q.sparkline.length - 1)) * 100;
                                const y = 18 - ((val - min) / range) * 16;
                                return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                              })
                              .join(' ')}`}
                            fill="none"
                            stroke={isUp ? '#10b981' : '#ef4444'}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSymbol(q.symbol);
                          onNavigate('chart');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-cyan-400 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 rounded transition-colors"
                      >
                        Gráfico
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="p-3 bg-[#090c12] border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>{sorted.length} ativos listados</span>
          <span className="font-mono">Fonte: MarketData Mock Engine (Extensível para APIs Reais)</span>
        </div>
      </div>
    </div>
  );
};
