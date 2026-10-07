import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Bell,
  Sliders,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const TopBar: React.FC<{ onNavigate: (page: string) => void; currentPage: string }> = ({
  onNavigate,
}) => {
  const { setSearchOpen, setAlertModalOpen, alerts } = useMarket();
  const { user, signOut, setLoginModalOpen, updatePlan } = useAuth();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;
  const triggeredAlerts = alerts.filter((a) => a.status === 'triggered');

  return (
    <header className="h-14 sm:h-13 bg-[#07090e]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-5 flex items-center justify-between z-30 select-none shrink-0 pt-safe">
      {/* Left: Brand Logo & Global Search */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 group text-left shrink-0 min-h-[44px] cursor-pointer"
        >
          {/* Guro Emblem: geometric apex / bull mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs font-mono shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            GT
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm tracking-wider text-white font-display uppercase whitespace-nowrap">
                GURO DO <span className="text-cyan-400">TRADING</span>
              </span>
              <span className="hidden lg:inline-block text-[9px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 font-mono font-bold rounded border border-cyan-800/50">
                PRO TERMINAL
              </span>
            </div>
          </div>
        </button>

        {/* Global Search Bar (Trigger) */}
        <div className="relative ml-1 sm:ml-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#0e121a] hover:bg-[#131824] border border-slate-800/90 text-slate-400 text-xs transition-colors w-28 xs:w-40 sm:w-64 md:w-72 justify-between min-h-[38px]"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">Buscar ativo...</span>
            </div>
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Terminal Connection Status (Hidden on small mobile) */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0b0e15] border border-slate-800/80 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">B3 & GLOBAL FEED</span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-400 font-semibold">&lt; 12ms</span>
        </div>

        {/* Quick Alert Creator (Tablet & Desktop) */}
        <button
          onClick={() => setAlertModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition-colors min-h-[38px]"
        >
          <Bell className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-medium">Novo Alerta</span>
        </button>

        {/* Notifications / Trigger Alerts Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setAlertsDropdownOpen(!alertsDropdownOpen);
              setUserDropdownOpen(false);
            }}
            aria-label="Alertas e Notificações"
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {triggeredAlerts.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          {alertsDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0e121a] border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-semibold text-white">Central de Alertas</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeAlertsCount} ativos
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1.5">
                {alerts.length === 0 ? (
                  <p className="text-slate-400 py-3 text-center">Nenhum alerta configurado.</p>
                ) : (
                  alerts.slice(0, 5).map((a) => (
                    <div
                      key={a.id}
                      className="p-2 rounded-lg bg-[#131722] border border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white font-mono">{a.symbol}</span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            {a.condition.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Alvo: {a.targetPrice.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${
                          a.status === 'triggered'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setAlertsDropdownOpen(false);
                  onNavigate('alerts');
                }}
                className="w-full mt-2.5 py-2 text-center text-xs text-cyan-400 hover:text-cyan-300 font-medium bg-slate-800/50 rounded-lg min-h-[38px] flex items-center justify-center"
              >
                Gerenciar Todos os Alertas
              </button>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setAlertsDropdownOpen(false);
            }}
            aria-label="Perfil de Usuário"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/60 transition-colors min-h-[44px] cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs border border-cyan-500/40">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-white truncate max-w-[110px]">{user.name}</span>
              <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-wider">
                {user.plan} PLAN
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0e121a] border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs animate-in fade-in duration-100">
              <div className="flex items-center gap-3 pb-3 mb-2 border-b border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm border border-cyan-500/40 shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono font-bold border border-cyan-800">
                      {user.plan}
                    </span>
                    <button
                      onClick={() => onNavigate('pricing')}
                      className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      Alterar plano
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Plan Switch for Demo Evaluation */}
              <div className="mb-2 p-2 bg-[#121622] rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-400 font-mono mb-1 uppercase tracking-wider">
                  Testar Nível Demo:
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(['FREE', 'PRO', 'PRO+'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => updatePlan(p)}
                      className={`py-1 text-[10px] font-mono font-bold rounded transition-colors cursor-pointer ${
                        user.plan === p
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('settings');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-left transition-colors min-h-[38px] cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Configurações & Disclaimer</span>
                </button>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('pricing');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-left transition-colors min-h-[38px] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Planos & Assinatura</span>
                </button>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-left transition-colors min-h-[38px] cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trocar de Conta / Login</span>
                </button>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-left transition-colors min-h-[38px] cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair da Sessão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
