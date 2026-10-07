import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { aiService } from '../../services/aiService';
import { Bell, Sparkles, X, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { AlertCondition } from '../../types/market';

export const AlertCreatorModal: React.FC = () => {
  const { alertModalOpen, setAlertModalOpen, selectedSymbol, activeQuote, createAlert, assets } = useMarket();

  const [mode, setMode] = useState<'manual' | 'ai'>('manual');

  // Manual Form States
  const [symbol, setSymbol] = useState(selectedSymbol);
  const [condition, setCondition] = useState<AlertCondition>('greater_than');
  const [targetPrice, setTargetPrice] = useState<string>(activeQuote.price ? String(activeQuote.price) : '70000');
  const [note, setNote] = useState('');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('Me avise quando Bitcoin ultrapassar 70 mil dólares');
  const [aiLoading, setAiLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!alertModalOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    createAlert({
      symbol,
      condition,
      targetPrice: priceNum,
      note: note || `Alerta ${symbol} ${condition} ${priceNum}`,
    });

    setSuccessNotice(`Alerta criado com sucesso para ${symbol}!`);
    setTimeout(() => {
      setSuccessNotice(null);
      setAlertModalOpen(false);
    }, 1200);
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiLoading) return;

    setAiLoading(true);
    try {
      const parsed = await aiService.parseNaturalLanguageAlert(aiPrompt);
      createAlert({
        symbol: parsed.symbol,
        condition: parsed.condition,
        targetPrice: parsed.targetPrice,
        note: parsed.note || aiPrompt,
      });

      setSuccessNotice(`Alerta interpretado por IA e criado: ${parsed.symbol} a ${parsed.targetPrice}!`);
      setTimeout(() => {
        setSuccessNotice(null);
        setAlertModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#121722]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Criar Novo Alerta de Preço</h3>
              <p className="text-xs text-slate-400">Monitore níveis de preço em tempo real</p>
            </div>
          </div>
          <button
            onClick={() => setAlertModalOpen(false)}
            aria-label="Fechar modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Manual vs AI */}
        <div className="flex p-1 bg-[#090c12] border-b border-slate-800 m-3 rounded-lg">
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'manual'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Formulário Técnico
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ${
              mode === 'ai'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Criar com IA (Linguagem Natural)</span>
          </button>
        </div>

        {/* Success message banner */}
        {successNotice && (
          <div className="mx-4 mb-2 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Manual Form */}
        {mode === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Ativo / Ticker
                </label>
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-[#121722] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-500 font-mono"
                >
                  {assets.map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} - {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Condição
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as AlertCondition)}
                  className="w-full bg-[#121722] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="greater_than">Maior que (&gt;=)</option>
                  <option value="less_than">Menor que (&lt;=)</option>
                  <option value="cross_up">Cruza para cima</option>
                  <option value="cross_down">Cruza para baixo</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-400">
                  Preço Alvo
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Atual: {activeQuote.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <input
                type="number"
                step="any"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-[#121722] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-hidden focus:border-cyan-500"
                placeholder="Ex: 70000"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nota Opcional
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[#121722] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-500"
                placeholder="Ex: Rompimento de resistência ou realização de lucro"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAlertModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
              >
                Salvar Alerta
              </button>
            </div>
          </form>
        ) : (
          /* Natural Language AI Form */
          <form onSubmit={handleAiSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Descreva sua regra em português claro:
              </label>
              <textarea
                rows={3}
                required
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Me avise quando Bitcoin ultrapassar 70 mil dólares ou Se PETR4 cair abaixo de 37 reais."
                className="w-full bg-[#121722] border border-slate-700/80 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 leading-relaxed"
              />
            </div>

            <div className="bg-[#090c12] p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Exemplos suportados:
              </p>
              <p>• "Alerte quando o Bitcoin cruzar para cima dos 69.500 dólares"</p>
              <p>• "Me avise se a Vale cair abaixo de 60 reais"</p>
              <p>• "Avise quando NVDA atingir 190 dólares"</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAlertModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg transition-all disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Interpretando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Criar com IA</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
