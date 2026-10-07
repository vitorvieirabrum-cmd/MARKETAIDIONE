import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { aiService } from '../../services/aiService';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  ShieldAlert,
  TrendingUp,
  Target,
  Activity,
  Layers,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  source?: string;
}

export const AIAnalystPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { activeQuote, timeframe, candles, indicatorValues } = useMarket();

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Olá! Sou o **Guro Trading Copilot**, analista quantitativo alimentado por Gemini.

Estou monitorando **${activeQuote.symbol}** (${activeQuote.name}) no timeframe **${timeframe}**.
Preço atual: **${activeQuote.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** (${activeQuote.change24h >= 0 ? '+' : ''}${activeQuote.change24h}%).

Como posso auxiliar na sua análise técnica hoje?`,
      timestamp: Date.now(),
      source: 'Guro Trading Engine',
    },
  ]);

  const quickPrompts = [
    `Resuma o comportamento atual do ${activeQuote.symbol}`,
    'Quais indicadores estão mais relevantes?',
    'Explique o RSI atual e momentum',
    'Identifique suportes e resistências chave',
    'Resuma a tendência observável no gráfico',
  ];

  const handleSend = async (questionToSend?: string) => {
    const query = questionToSend || inputQuestion.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionToSend) setInputQuestion('');
    setLoading(true);

    try {
      const response = await aiService.requestTechnicalAnalysis({
        symbol: activeQuote.symbol,
        assetName: activeQuote.name,
        timeframe,
        currentPrice: activeQuote.price,
        change24h: activeQuote.change24h,
        candles,
        indicators: indicatorValues,
        userQuestion: query,
      });

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: response.analysis,
        timestamp: Date.now(),
        source: response.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'ai',
        text: 'Não foi possível gerar a resposta no momento. Por favor tente novamente.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] border-l border-slate-800/80 w-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-[#0f141f]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white text-xs tracking-wider uppercase">
                AI Analyst
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-mono">
                GEMINI 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Analisando {activeQuote.symbol} ({timeframe})
            </p>
          </div>
        </div>

        {/* Live Indicator Badges in Header */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono-numbers">
          <div className="bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60 text-slate-300">
            RSI: <span className="text-emerald-400 font-semibold">{indicatorValues.rsi ? indicatorValues.rsi.toFixed(1) : '56.4'}</span>
          </div>
          <div className="bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60 text-slate-300">
            EMA9: <span className="text-cyan-400 font-semibold">{indicatorValues.ema9 ? indicatorValues.ema9.toFixed(2) : '--'}</span>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800/60 bg-[#0c1018] overflow-x-auto text-[11px]">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            disabled={loading}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 hover:text-white transition-colors disabled:opacity-50 text-[11px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center shrink-0 mt-0.5 text-white">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-[#121722] border border-slate-800/80 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs">
                {msg.text}
              </div>

              {msg.source && (
                <div className="mt-2 pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Engine: {msg.source}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 bg-[#121722] p-3 rounded-lg border border-slate-800/80 w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processando dados estatísticos e calculando confluências com Gemini...</span>
          </div>
        )}
      </div>

      {/* Regulatory Risk Notice */}
      <div className="px-3 py-1.5 bg-[#090c12] border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] text-slate-400">
        <ShieldAlert className="w-3 h-3 text-amber-500/80 shrink-0" />
        <span className="truncate">
          Análises geradas por IA são informativas e não constituem recomendação de investimento.
        </span>
      </div>

      {/* Chat Input Bar */}
      <div className="p-2.5 sm:p-3 border-t border-slate-800/80 bg-[#0f141f]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-[#080b12] rounded-xl border border-slate-800 px-3 py-1.5 focus-within:border-cyan-500/60 transition-colors min-h-[44px]"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={loading}
            placeholder={`Pergunte sobre ${activeQuote.symbol}...`}
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            aria-label="Enviar mensagem"
            className="p-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-40 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
