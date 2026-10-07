import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { X, Check, Activity, BarChart2, TrendingUp, Layers } from 'lucide-react';
import { TechnicalIndicatorsState } from '../../types/market';

interface IndicatorItem {
  id: keyof TechnicalIndicatorsState;
  name: string;
  category: 'Médias Móveis' | 'Osciladores' | 'Volatilidade' | 'Volume';
  color: string;
  description: string;
  formula: string;
}

const INDICATORS_LIST: IndicatorItem[] = [
  {
    id: 'ema9',
    name: 'EMA 9 (Média Móvel Exponencial)',
    category: 'Médias Móveis',
    color: '#38bdf8',
    description: 'Média de curtíssimo prazo sensível às variações recentes de preço.',
    formula: 'α = 2/(9+1), ponderação exponencial',
  },
  {
    id: 'ema21',
    name: 'EMA 21 (Média Móvel Exponencial)',
    category: 'Médias Móveis',
    color: '#f59e0b',
    description: 'Média de tendência intermediária e guia de pullback clássico.',
    formula: 'α = 2/(21+1), ponderação exponencial',
  },
  {
    id: 'sma200',
    name: 'SMA 200 (Média Móvel Simples)',
    category: 'Médias Móveis',
    color: '#a855f7',
    description: 'Divisor institucional de tendência primária de alta/baixa secular.',
    formula: 'Média aritmética dos últimos 200 períodos',
  },
  {
    id: 'rsi14',
    name: 'RSI 14 (Índice de Força Relativa)',
    category: 'Osciladores',
    color: '#10b981',
    description: 'Mede a velocidade e a magnitude dos movimentos direcionais de preço.',
    formula: '100 - (100 / (1 + RS)) de Wilder',
  },
  {
    id: 'bollingerBands',
    name: 'Bandas de Bollinger (20, 2)',
    category: 'Volatilidade',
    color: '#06b6d4',
    description: 'Envelopamento estatístico baseado em desvios-padrão ao redor da SMA 20.',
    formula: 'SMA(20) ± 2 * Desvio Padrão',
  },
  {
    id: 'vwap',
    name: 'VWAP (Volume Weighted Average Price)',
    category: 'Volume',
    color: '#ec4899',
    description: 'Preço médio ponderado pelo volume institucional.',
    formula: '∑(Preço Típico * Vol) / ∑(Vol)',
  },
  {
    id: 'macd',
    name: 'MACD (12, 26, 9)',
    category: 'Osciladores',
    color: '#3b82f6',
    description: 'Convergência e Divergência de Médias Móveis para identificar reversões de momentum.',
    formula: 'EMA(12) - EMA(26) com linha de Sinal EMA(9)',
  },
  {
    id: 'volume',
    name: 'Volume Financeiro Histograma',
    category: 'Volume',
    color: '#64748b',
    description: 'Histograma colorido inferior indicando fluxo de liquidez por candle.',
    formula: 'Volume de contratos/ações negociados',
  },
];

export const IndicatorModal: React.FC = () => {
  const { indicatorsModalOpen, setIndicatorsModalOpen, indicators, toggleIndicator } = useMarket();

  if (!indicatorsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#121722]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Indicadores Técnicos</h3>
              <p className="text-xs text-slate-400">Ative ou personalize indicadores matemáticos no gráfico</p>
            </div>
          </div>
          <button
            onClick={() => setIndicatorsModalOpen(false)}
            aria-label="Fechar"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-2">
          {INDICATORS_LIST.map((item) => {
            const isEnabled = indicators[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleIndicator(item.id)}
                className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  isEnabled
                    ? 'bg-slate-800/60 border-cyan-500/40 text-white'
                    : 'bg-[#090c12] border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-slate-100">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      Fórmula: {item.formula}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ml-3 transition-colors ${
                    isEnabled
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'border border-slate-700 bg-slate-800/50'
                  }`}
                >
                  {isEnabled ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-[#121722]/80 text-xs text-slate-400">
          <span>{Object.values(indicators).filter(Boolean).length} indicadores ativos</span>
          <button
            onClick={() => setIndicatorsModalOpen(false)}
            className="px-4 py-1.5 font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors font-mono"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};
