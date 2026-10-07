import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import {
  Settings,
  Shield,
  Sliders,
  Bell,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  ExternalLink,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { timeframe, setTimeframe } = useMarket();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streamUpdates, setStreamUpdates] = useState(true);
  const [backendStatus, setBackendStatus] = useState<string>('Verificando...');
  const [geminiStatus, setGeminiStatus] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data.status === 'ok' ? 'Operacional' : 'Com erro');
        setGeminiStatus(data.geminiEnabled);
      })
      .catch(() => {
        setBackendStatus('Offline / Modo Local Fallback');
        setGeminiStatus(false);
      });
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1200px] mx-auto w-full">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Configurações do Terminal
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
            SISTEMA
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Ajustes de interface, dados de mercado, integrações de IA e parâmetros regulatórios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User & Preferences */}
        <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Preferências de Negociação & Gráfico</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div>
                <span className="font-semibold text-white block">Timeframe Padrão de Abertura</span>
                <span className="text-slate-400 text-[11px]">Intervalo temporal aplicado ao abrir ativos</span>
              </div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="bg-[#121722] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
              >
                <option value="1m">1 minuto</option>
                <option value="5m">5 minutos</option>
                <option value="15m">15 minutos</option>
                <option value="1h">1 hora</option>
                <option value="4h">4 horas</option>
                <option value="1D">1 Dia (Diário)</option>
                <option value="1W">1 Semana</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div>
                <span className="font-semibold text-white block">Sons de Alertas & Execução</span>
                <span className="text-slate-400 text-[11px]">Notificação sonoras ao disparar alertas</span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="accent-cyan-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div>
                <span className="font-semibold text-white block">Atualizações em Streaming</span>
                <span className="text-slate-400 text-[11px]">Ticks contínuos no book e watchlist</span>
              </div>
              <input
                type="checkbox"
                checked={streamUpdates}
                onChange={(e) => setStreamUpdates(e.target.checked)}
                className="accent-cyan-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Backend & Architecture Status */}
        <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Status da Infraestrutura & IA</span>
          </div>

          <div className="space-y-3 text-xs font-mono-numbers">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#121722] border border-slate-800">
              <span className="text-slate-300">Servidor Node.js Full Stack:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {backendStatus}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#121722] border border-slate-800">
              <span className="text-slate-300">Motor Gemini 3.8:</span>
              <span className="text-cyan-400 font-bold">
                {geminiStatus ? 'Ativo (Server-Side)' : 'Ativo (Local Fallback Ready)'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#121722] border border-slate-800">
              <span className="text-slate-300">Data Provider:</span>
              <span className="text-slate-200 font-bold">MockMarketDataProvider (Extensível para APIs)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Regulatory Disclaimer */}
      <div className="p-5 rounded-xl bg-[#0e121a] border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Aviso Legal & Termo de Isenção de Responsabilidade (Disclaimer)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          "<strong>Guro do Trading</strong> fornece ferramentas de análise e informação. O conteúdo apresentado não constitui recomendação, consultoria ou oferta de investimento. Mercados financeiros envolvem risco substancial de perda de capital e oscilações abruptas de preço. O desempenho passado verificado em dados históricos ou simulações estatísticas não garante resultados futuros. Sempre consulte um profissional certificado de investimentos antes de tomar decisões financeiras."
        </p>
      </div>
    </div>
  );
};
