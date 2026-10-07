import React, { useState, useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import {
  Scan,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Activity,
  CheckCircle2,
  RefreshCw,
  BarChart2,
} from 'lucide-react';
import { MarketCategory } from '../types/market';

export const ScreenerPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { quotes, setSelectedSymbol } = useMarket();

  // Filters State
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [rsiFilter, setRsiFilter] = useState<'all' | 'oversold' | 'overbought' | 'neutral'>('all');
  const [trendFilter, setTrendFilter] = useState<string>('all');
  const [minChange, setMinChange] = useState<string>('');
  const [maxChange, setMaxChange] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate enriched screener data dynamically from quotes
  const screenerData = useMemo(() => {
    return quotes.map((q) => {
      // Calculate realistic technical proxies based on recent price structure
      const isUp = q.change24h >= 0;
      let rsi = 50 + q.change24h * 3.5;
      if (rsi > 88) rsi = 88.5;
      if (rsi < 18) rsi = 18.2;

      const ema20 = q.price * (1 - (q.change24h * 0.003));
      const sma200 = q.price * 0.94;
      const aboveSma200 = q.price > sma200;

      let trend: 'Forte Alta' | 'Alta' | 'Neutro' | 'Baixa' | 'Forte Baixa' = 'Neutro';
      if (q.change24h > 2.0 && aboveSma200) trend = 'Forte Alta';
      else if (q.change24h > 0.5) trend = 'Alta';
      else if (q.change24h < -2.0) trend = 'Forte Baixa';
      else if (q.change24h < -0.5) trend = 'Baixa';

      return {
        ...q,
        rsi: Number(rsi.toFixed(1)),
        ema20: Number(ema20.toFixed(2)),
        sma200: Number(sma200.toFixed(2)),
        aboveSma200,
        trend,
      };
    });
  }, [quotes]);

  // Apply filters
  const filteredData = useMemo(() => {
    return screenerData.filter((item) => {
      // Market filter
      if (selectedMarket !== 'all' && item.category !== selectedMarket) return false;

      // Search
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        if (!item.symbol.toLowerCase().includes(s) && !item.name.toLowerCase().includes(s)) {
          return false;
        }
      }

      // RSI filter
      if (rsiFilter === 'oversold' && item.rsi >= 30) return false;
      if (rsiFilter === 'overbought' && item.rsi <= 70) return false;
      if (rsiFilter === 'neutral' && (item.rsi < 30 || item.rsi > 70)) return false;

      // Trend filter
      if (trendFilter !== 'all' && item.trend !== trendFilter) return false;

      // Min/Max change
      if (minChange !== '' && item.change24h < parseFloat(minChange)) return false;
      if (maxChange !== '' && item.change24h > parseFloat(maxChange)) return false;

      return true;
    });
  }, [screenerData, selectedMarket, rsiFilter, trendFilter, minChange, maxChange, searchQuery]);

  const resetFilters = () => {
    setSelectedMarket('all');
    setRsiFilter('all');
    setTrendFilter('all');
    setMinChange('');
    setMaxChange('');
    setSearchQuery('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Screener de Mercado Quantitativo
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
              SCANNER ATIVO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Filtre ativos por confluências técnicas, extremos de RSI, médias móveis e momentum.
          </p>
        </div>

        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#121722] hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-xl text-xs transition-colors min-h-[44px] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Redefinir Filtros</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-[#0e121a] border border-slate-800/80 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filtros do Scanner</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Market */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Mercado</label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full bg-[#121722] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">Todos os Mercados</option>
              <option value="crypto">Criptomoedas</option>
              <option value="stocks">Ações EUA</option>
              <option value="b3">Brasil (B3)</option>
              <option value="indices">Índices</option>
              <option value="forex">Forex</option>
            </select>
          </div>

          {/* RSI Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Filtro de RSI (14)</label>
            <select
              value={rsiFilter}
              onChange={(e) => setRsiFilter(e.target.value as any)}
              className="w-full bg-[#121722] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">Qualquer RSI</option>
              <option value="oversold">Sobrevendido (&lt; 30) - Alvo Reversão</option>
              <option value="overbought">Sobrecomprado (&gt; 70) - Extremo</option>
              <option value="neutral">Neutro (30 a 70)</option>
            </select>
          </div>

          {/* Trend Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Tendência Técnica</label>
            <select
              value={trendFilter}
              onChange={(e) => setTrendFilter(e.target.value)}
              className="w-full bg-[#121722] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">Todas as Tendências</option>
              <option value="Forte Alta">Forte Alta</option>
              <option value="Alta">Alta</option>
              <option value="Neutro">Neutro</option>
              <option value="Baixa">Baixa</option>
              <option value="Forte Baixa">Forte Baixa</option>
            </select>
          </div>

          {/* Min Change */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Variação Mínima (%)</label>
            <input
              type="number"
              value={minChange}
              onChange={(e) => setMinChange(e.target.value)}
              placeholder="Ex: 1.0"
              className="w-full bg-[#121722] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Buscar Símbolo</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-[#121722] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-[#0e121a] border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121722] text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Símbolo</th>
                <th className="py-3 px-3">Nome / Mercado</th>
                <th className="py-3 px-3 text-right">Preço</th>
                <th className="py-3 px-3 text-right">Variação 24h</th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">RSI 14</th>
                <th className="py-3 px-3 text-right hidden md:table-cell">EMA 20</th>
                <th className="py-3 px-3 text-right hidden lg:table-cell">SMA 200</th>
                <th className="py-3 px-3 text-center">Tendência</th>
                <th className="py-3 px-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-mono-numbers">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Nenhum ativo corresponde aos critérios dos filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const isUp = item.change24h >= 0;

                  return (
                    <tr
                      key={item.symbol}
                      onClick={() => {
                        setSelectedSymbol(item.symbol);
                        onNavigate('chart');
                      }}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-white text-xs">{item.symbol}</td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-300 truncate max-w-[120px]">{item.name}</span>
                          <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                            {item.category}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-semibold text-slate-100">
                        {item.currency === 'USD' ? '$' : item.currency === 'BRL' ? 'R$' : ''}{' '}
                        {item.price.toLocaleString('pt-BR', { minimumFractionDigits: item.price < 5 ? 4 : 2 })}
                      </td>

                      <td className={`py-3 px-3 text-right font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span className="inline-flex items-center gap-0.5 justify-end">
                          {isUp ? <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" /> : <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                          {isUp ? '+' : ''}{item.change24h.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right hidden sm:table-cell">
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                            item.rsi >= 70
                              ? 'bg-rose-500/20 text-rose-300'
                              : item.rsi <= 30
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.rsi}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right text-slate-400 hidden md:table-cell font-mono">
                        {item.ema20.toLocaleString('pt-BR')}
                      </td>

                      <td className="py-3 px-3 text-right text-slate-400 hidden lg:table-cell font-mono">
                        <span className={item.aboveSma200 ? 'text-emerald-400' : 'text-rose-400'}>
                          {item.aboveSma200 ? '▲ Acima' : '▼ Abaixo'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                            item.trend.includes('Alta')
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.trend.includes('Baixa')
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.trend}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSymbol(item.symbol);
                            onNavigate('chart');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-cyan-400 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 rounded transition-colors"
                        >
                          Abrir Gráfico
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#090c12] border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>{filteredData.length} ativos filtrados</span>
          <span className="font-mono">Filtros executados em tempo real na memória</span>
        </div>
      </div>
    </div>
  );
};
