import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Layers,
  BarChart3,
  Globe2,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { MarketQuote } from '../types/market';

export const DashboardPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { quotes, setSelectedSymbol, lastTickSymbol, setAlertModalOpen } = useMarket();
  const [activeMarketTab, setActiveMarketTab] = useState<string>('all');

  // Featured Cards Symbols
  const featuredSymbols = ['BTCUSD', 'ETHUSD', 'SPX', 'NDX', 'PETR4', 'VALE3'];
  const featuredQuotes = quotes.filter((q) => featuredSymbols.includes(q.symbol));

  // Top gainers and losers
  const sortedByChange = [...quotes].sort((a, b) => b.change24h - a.change24h);
  const topGainers = sortedByChange.slice(0, 4);
  const topLosers = sortedByChange.slice(-4).reverse();

  // Tab filtered quotes for overview table
  const filteredQuotes = quotes.filter((q) => {
    if (activeMarketTab === 'all') return true;
    return q.category === activeMarketTab;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Welcome & Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Visão Geral do Mercado
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
              TEMPO REAL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Terminal institucional Guro do Trading: cotações em streaming, osciladores e inteligência preditiva.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('chart')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/10 transition-all min-h-[44px] cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Abrir Gráficos</span>
          </button>
          <button
            onClick={() => onNavigate('ai')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#10141f] hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs rounded-xl transition-all min-h-[44px] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>IA Analyst</span>
          </button>
        </div>
      </div>

      {/* Featured Market Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {featuredQuotes.map((quote) => {
          const isUp = quote.change24h >= 0;
          const isTicking = lastTickSymbol === quote.symbol;

          return (
            <div
              key={quote.symbol}
              onClick={() => {
                setSelectedSymbol(quote.symbol);
                onNavigate('chart');
              }}
              className={`p-3.5 rounded-xl bg-[#0e121a] border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-cyan-950/20 group relative overflow-hidden ${
                isTicking ? (isUp ? 'flash-up' : 'flash-down') : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white font-mono">{quote.symbol}</span>
                <span className="text-[10px] text-slate-400 font-mono uppercase">{quote.category}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mb-2">{quote.name}</p>

              <div className="font-mono-numbers">
                <div className="text-base font-extrabold text-white">
                  {quote.currency === 'USD' ? 'US$' : quote.currency === 'BRL' ? 'R$' : ''}{' '}
                  {quote.price.toLocaleString('pt-BR', { minimumFractionDigits: quote.price < 5 ? 4 : 2 })}
                </div>
                <div
                  className={`text-xs font-bold flex items-center gap-0.5 mt-0.5 ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" /> : <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                  <span>
                    {isUp ? '+' : ''}
                    {quote.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Sparkline mini preview */}
              <div className="mt-3 h-5 w-full flex items-end">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path
                    d={`M 0 10 ${quote.sparkline
                      .map((val, idx) => {
                        const min = Math.min(...quote.sparkline);
                        const max = Math.max(...quote.sparkline);
                        const range = max - min || 1;
                        const x = (idx / (quote.sparkline.length - 1)) * 100;
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
            </div>
          );
        })}
      </div>

      {/* Middle Grid: Market Overview Table & Sentiment / Copilot Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Comprehensive Market Overview Table */}
        <div className="lg:col-span-2 bg-[#0e121a] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-800 bg-[#121722] gap-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <h2 className="font-bold text-white text-sm">Mercados Globais & Brasil (B3)</h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#090c12] p-1 rounded-lg border border-slate-800 text-xs">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'crypto', label: 'Cripto' },
                { id: 'stocks', label: 'Ações EUA' },
                { id: 'b3', label: 'Brasil' },
                { id: 'indices', label: 'Índices' },
                { id: 'forex', label: 'Forex' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMarketTab(tab.id)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeMarketTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#090c12] text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Ativo</th>
                  <th className="py-2.5 px-3 text-right">Último Preço</th>
                  <th className="py-2.5 px-3 text-right">Variação %</th>
                  <th className="py-2.5 px-3 text-right hidden sm:table-cell">Máxima</th>
                  <th className="py-2.5 px-3 text-right hidden sm:table-cell">Mínima</th>
                  <th className="py-2.5 px-3 text-right hidden md:table-cell">Volume</th>
                  <th className="py-2.5 px-4 text-center">Gráfico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono-numbers">
                {filteredQuotes.slice(0, 8).map((q) => {
                  const isUp = q.change24h >= 0;
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
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{q.symbol}</span>
                          <span className="text-slate-400 truncate max-w-[130px] hidden sm:inline">
                            {q.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-semibold text-slate-100">
                        {q.currency === 'USD' ? '$' : q.currency === 'BRL' ? 'R$' : ''}{' '}
                        {q.price.toLocaleString('pt-BR', { minimumFractionDigits: q.price < 5 ? 4 : 2 })}
                      </td>

                      <td className={`py-3 px-3 text-right font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? '+' : ''}{q.change24h.toFixed(2)}%
                      </td>

                      <td className="py-3 px-3 text-right text-slate-400 hidden sm:table-cell">
                        {q.high24h.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-3 text-right text-slate-400 hidden sm:table-cell">
                        {q.low24h.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-3 text-right text-slate-400 hidden md:table-cell font-mono">
                        {(q.volume24h / 1e6).toFixed(1)}M
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSymbol(q.symbol);
                            onNavigate('chart');
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-cyan-400 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 rounded"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-800 bg-[#090c12] flex items-center justify-between text-xs text-slate-400">
            <span>Exibindo ativos principais com ticks em tempo real</span>
            <button
              onClick={() => onNavigate('markets')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Ver todos os 19 mercados</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: AI Market Sentiment & Algorithmic Summary */}
        <div className="space-y-6">
          {/* AI Terminal Bias Card */}
          <div className="bg-[#0e121a] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs tracking-wider uppercase font-display">
                      Guro Trading Bias & Sentimento
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">Índice Técnico Agregado</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  BULLISH (68%)
                </span>
              </div>

              {/* Gauge Meter */}
              <div className="my-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Extremo Medo</span>
                  <span className="text-white font-bold">Ganância Neutra (64/100)</span>
                  <span>Extrema Ganância</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="w-[30%] bg-rose-500 opacity-60" />
                  <div className="w-[20%] bg-amber-500 opacity-60" />
                  <div className="w-[35%] bg-emerald-500" />
                  <div className="w-[15%] bg-cyan-400 opacity-80" />
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#121722] p-3 rounded-lg border border-slate-800/80">
                "O fluxo institucional mantém viés altista sustentado por Bitcoin acima de US$ 67.000 e expansão do setor de semicondutores (NVDA). Ações da B3 (PETR4, ITUB4) recuperam suporte com entrada de capital estrangeiro."
              </p>
            </div>

            <button
              onClick={() => onNavigate('ai')}
              className="mt-4 w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/10 flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Abrir Chat com IA Analyst</span>
            </button>
          </div>

          {/* Gainers & Losers Widget */}
          <div className="bg-[#0e121a] border border-slate-800/80 rounded-xl p-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Destaques do Dia (24h)</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono-numbers">
              {/* Gainers */}
              <div className="space-y-2">
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> MAIORES ALTAS
                </span>
                {topGainers.map((g) => (
                  <div
                    key={g.symbol}
                    onClick={() => {
                      setSelectedSymbol(g.symbol);
                      onNavigate('chart');
                    }}
                    className="p-1.5 rounded bg-[#121722] hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span className="font-bold text-white text-xs">{g.symbol}</span>
                    <span className="text-emerald-400 font-bold text-xs">+{g.change24h.toFixed(2)}%</span>
                  </div>
                ))}
              </div>

              {/* Losers */}
              <div className="space-y-2">
                <span className="text-[10px] text-rose-400 font-mono font-bold flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> MAIORES BAIXAS
                </span>
                {topLosers.map((l) => (
                  <div
                    key={l.symbol}
                    onClick={() => {
                      setSelectedSymbol(l.symbol);
                      onNavigate('chart');
                    }}
                    className="p-1.5 rounded bg-[#121722] hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span className="font-bold text-white text-xs">{l.symbol}</span>
                    <span className="text-rose-400 font-bold text-xs">{l.change24h.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
