import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';

export const PricingPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user, updatePlan } = useAuth();

  const plans = [
    {
      id: 'FREE' as const,
      name: 'Free Starter',
      price: 'R$ 0',
      period: 'gratuito para sempre',
      description: 'Essencial para investidores iniciantes acompanharem os mercados.',
      features: [
        '1 layout de gráfico salvo',
        'Até 3 indicadores simultâneos',
        '5 alertas de preço ativos',
        'Acesso básico à IA (consultas resumidas)',
        'Cotações com delay padrão',
        'Watchlist básica',
      ],
      highlight: false,
    },
    {
      id: 'PRO' as const,
      name: 'Pro Trader',
      price: 'R$ 99',
      period: 'por mês (modo avaliação)',
      description: 'Para traders ativos que demandam velocidade, indicadores ilimitados e análise de IA.',
      features: [
        'Layouts múltiplos ilimitados',
        'Indicadores simultâneos ilimitados',
        'Até 50 alertas em tempo real',
        'AI Analyst avançado com Gemini 3.8',
        'Screener técnico completo de mercados',
        'Streaming de baixa latência (< 15ms)',
        'Alertas com Linguagem Natural',
      ],
      highlight: true,
      badge: 'MAIS POPULAR',
    },
    {
      id: 'PRO+' as const,
      name: 'Institutional Pro+',
      price: 'R$ 249',
      period: 'por mês (modo avaliação)',
      description: 'Potência máxima institucional para family offices, gestores e quant traders.',
      features: [
        'Todos os recursos do plano Pro',
        'Alertas ilimitados via Webhook & Push',
        'Backtesting quantitativo algorítmico',
        'Prioridade máxima no processador de IA',
        'Exportação de dados OHLC em CSV/JSON',
        'Suporte dedicado prioritário 24/7',
      ],
      highlight: false,
    },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800">
          PLANOS & ACESSO INSTITUCIONAL
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Escolha o nível de potência do seu terminal
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          No Guro do Trading, todas as funcionalidades podem ser avaliadas livremente alternando o plano abaixo.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = user.plan === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                plan.highlight
                  ? 'bg-gradient-to-b from-[#131a29] to-[#0c1017] border-2 border-cyan-500 shadow-xl shadow-cyan-500/10'
                  : 'bg-[#0e121a] border border-slate-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] font-mono tracking-wider shadow">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      SEU PLANO ATUAL
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-4">{plan.description}</p>

                <div className="mb-6 font-mono-numbers">
                  <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 ml-1.5">{plan.period}</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => {
                    updatePlan(plan.id);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : plan.highlight
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-[#141924] hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <span>{isCurrent ? 'Plano Ativo na Sessão' : `Ativar Plano ${plan.id}`}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safe Disclaimer Banner */}
      <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-4 text-xs text-slate-400 text-center">
        <p>
          * Versão demonstrativa técnica: não há cobranças reais de cartão de crédito no momento. A troca de plano altera instantaneamente as permissões do seu perfil.
        </p>
      </div>
    </div>
  );
};
