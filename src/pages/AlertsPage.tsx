import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import {
  Bell,
  Sparkles,
  Plus,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from 'lucide-react';
import { MarketAlert } from '../types/market';

export const AlertsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { alerts, toggleAlert, deleteAlert, setAlertModalOpen, setSelectedSymbol } = useMarket();
  const [filter, setFilter] = useState<'all' | 'active' | 'triggered' | 'paused'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'greater_than': return 'Preço Maior que (>=)';
      case 'less_than': return 'Preço Menor que (<=)';
      case 'cross_up': return 'Cruza para Cima';
      case 'cross_down': return 'Cruza para Baixo';
      default: return condition;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Gerenciador de Alertas
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
              {alerts.length} REGISTRADOS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitore níveis de suporte, rompimentos ou metas de preço com acionamento instantâneo.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setAlertModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-cyan-500/10 transition-all min-h-[44px] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Alerta</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {[
          { id: 'all', label: 'Todos os Alertas' },
          { id: 'active', label: 'Ativos' },
          { id: 'triggered', label: 'Disparados' },
          { id: 'paused', label: 'Pausados' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === tab.id
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-12 text-center text-slate-400 space-y-3">
            <Bell className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-medium text-slate-300">Nenhum alerta nesta categoria.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Crie alertas técnicos manuais ou utilize linguagem natural ("Me avise quando Bitcoin passar de 70k").
            </p>
            <button
              onClick={() => setAlertModalOpen(true)}
              className="mt-2 px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-cyan-400 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Criar Primeiro Alerta
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isTriggered = alert.status === 'triggered';
            const isActive = alert.status === 'active';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                  isTriggered
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                    : isActive
                    ? 'bg-[#0e121a] border-slate-800 hover:border-slate-700'
                    : 'bg-[#090c12] border-slate-800/60 opacity-60'
                }`}
              >
                {/* Left: Info */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                      isTriggered
                        ? 'bg-amber-500/20 text-amber-400'
                        : isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-white font-mono">
                        {alert.symbol}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">
                        {getConditionLabel(alert.condition)}
                      </span>
                      <span className="font-mono text-sm font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                        {alert.targetPrice.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    {alert.note && (
                      <p className="text-xs text-slate-400 mt-1">
                        Nota: {alert.note}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500 font-mono">
                      <span>Criado em: {new Date(alert.createdAt).toLocaleDateString()}</span>
                      {alert.triggeredAt && (
                        <span className="text-amber-400 font-semibold">
                          Disparado em: {new Date(alert.triggeredAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions & Status */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider ${
                      isTriggered
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {alert.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedSymbol(alert.symbol);
                      onNavigate('chart');
                    }}
                    title="Ver no Gráfico"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleAlert(alert.id)}
                    title={isActive ? 'Pausar Alerta' : 'Ativar Alerta'}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => deleteAlert(alert.id)}
                    title="Excluir Alerta"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
