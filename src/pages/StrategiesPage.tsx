import React from 'react';
import { useMarket } from '../context/MarketContext';
import { GitBranch, Play, CheckCircle2, TrendingUp, Sparkles, ExternalLink, BarChart2 } from 'lucide-react';

export const StrategiesPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { setSelectedSymbol } = useMarket();

  const strategies = [
    {
      id: 'strat-1',
      title: 'Golden Cross Exponencial (EMA 9 x EMA 21)',
      type: 'Seguidor de Tendência',
      asset: 'BTCUSD',
      winRate: '68.4%',
      profitFactor: '2.14',
      tradesCount: 142,
      description: 'Entrada na compra quando a média móvel exponencial rápida (9) cruza acima da média intermediária (21), com stop abaixo do fundo anterior.',
      status: 'Ativo',
    },
    {
      id: 'strat-2',
      title: 'Reversão Extrema de RSI 14 (< 30)',
      type: 'Mean Reversion',
      asset: 'PETR4',
      winRate: '72.1%',
      profitFactor: '2.45',
      tradesCount: 98,
      description: 'Identifica exaustão vendedora quando o RSI penetra abaixo de 30 e retoma o nível com candle de rejeição (martelo ou engulfing).',
      status: 'Ativo',
    },
    {
      id: 'strat-3',
      title: 'Rompimento de Volatilidade Bollinger (20, 2)',
      type: 'Breakout de Volatilidade',
      asset: 'NVDA',
      winRate: '64.8%',
      profitFactor: '1.95',
      tradesCount: 110,
      description: 'Opera a expansão de bandas após período de estreitamento (squeeze), buscando continuidade do fluxo institucional.',
      status: 'Ativo',
    },
    {
      id: 'strat-4',
      title: 'Pullback em VWAP Institucional',
      type: 'Fluxo Intradiário',
      asset: 'ETHUSD',
      winRate: '66.0%',
      profitFactor: '1.88',
      tradesCount: 165,
      description: 'Compras apoiadas no preço médio ponderado por volume durante sessões de alta correlação com o mercado futuro.',
      status: 'Em Teste',
    },
    {
      id: 'strat-5',
      title: 'Rejeição de Nível OTC (Quotex Turbo Timing)',
      type: 'Price Action & Payout Alto',
      asset: 'EURUSD_OTC',
      winRate: '74.2%',
      profitFactor: '2.62',
      tradesCount: 210,
      description: 'Gatilho de reversão em velas rápidas (5s / 1m) quando ocorre exaustão e rejeição de pavio em suporte/resistência OTC com payout de 93%.',
      status: 'Ativo',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Estratégias & Setups Quantitativos
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
              ALGO LAB
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Biblioteca de setups técnicos com histórico estatístico de assertividade e gatilhos automatizados.
          </p>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((strat) => (
          <div
            key={strat.id}
            className="p-5 rounded-xl bg-[#0e121a] border border-slate-800/80 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold tracking-wider">
                    {strat.type}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">{strat.title}</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {strat.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{strat.description}</p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-2 bg-[#121722] p-3 rounded-lg border border-slate-800/80 text-xs font-mono-numbers">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">ASSERTIVIDADE</span>
                <span className="font-extrabold text-emerald-400">{strat.winRate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">PROFIT FACTOR</span>
                <span className="font-extrabold text-cyan-400">{strat.profitFactor}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">OPERAÇÕES</span>
                <span className="font-extrabold text-slate-200">{strat.tradesCount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Ativo Base: {strat.asset}</span>
              <button
                onClick={() => {
                  setSelectedSymbol(strat.asset);
                  onNavigate('chart');
                }}
                className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs rounded-lg border border-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Aplicar no Gráfico</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
