import React from 'react';
import { Calendar, Clock, AlertTriangle, Globe } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const events = [
    {
      time: '14:30',
      country: 'EUA',
      flag: '🇺🇸',
      title: 'CPI - Índice de Preços ao Consumidor (MoM)',
      impact: 'Alto',
      forecast: '0.2%',
      previous: '0.2%',
      actual: '0.1%',
    },
    {
      time: '15:00',
      country: 'EUA',
      flag: '🇺🇸',
      title: 'Decisão da Taxa de Juros do Federal Reserve (FOMC)',
      impact: 'Alto',
      forecast: '5.00%',
      previous: '5.25%',
      actual: '--',
    },
    {
      time: '18:30',
      country: 'BRA',
      flag: '🇧🇷',
      title: 'Decisão da Taxa Selic - COPOM',
      impact: 'Alto',
      forecast: '10.75%',
      previous: '10.50%',
      actual: '--',
    },
    {
      time: '09:00',
      country: 'BRA',
      flag: '🇧🇷',
      title: 'IPCA - Inflação Oficial Brasil',
      impact: 'Médio',
      forecast: '0.35%',
      previous: '0.38%',
      actual: '0.32%',
    },
    {
      time: '09:30',
      country: 'EUA',
      flag: '🇺🇸',
      title: 'Non-Farm Payrolls (NFP) - Criação de Empregos',
      impact: 'Alto',
      forecast: '165K',
      previous: '142K',
      actual: '--',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto w-full">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Calendário Econômico Institucional
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
            MACRO FEED
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Divulgações de dados macroeconômicos com impacto direto na volatilidade de juros, moedas e bolsas.
        </p>
      </div>

      {/* Events Table */}
      <div className="bg-[#0e121a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121722] text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Horário (BRT)</th>
                <th className="py-3 px-3">País</th>
                <th className="py-3 px-3">Evento Macroeconômico</th>
                <th className="py-3 px-3 text-center">Impacto</th>
                <th className="py-3 px-3 text-right">Projeção</th>
                <th className="py-3 px-3 text-right">Prévio</th>
                <th className="py-3 px-4 text-right">Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-mono-numbers">
              {events.map((evt, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{evt.time}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-mono">
                      <span>{evt.flag}</span>
                      <span className="text-slate-300 font-bold">{evt.country}</span>
                    </span>
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-200">{evt.title}</td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        evt.impact === 'Alto'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {evt.impact}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right text-slate-300">{evt.forecast}</td>
                  <td className="py-3 px-3 text-right text-slate-400">{evt.previous}</td>
                  <td className="py-3 px-4 text-right font-bold text-cyan-400">{evt.actual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
