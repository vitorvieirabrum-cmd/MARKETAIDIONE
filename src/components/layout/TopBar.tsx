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
  const [feedDropdownOpen, setFeedDropdownOpen] = useState(false);

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
          {/* Coliseu Emblem Logo */}
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-amber-500/40 bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
            <img
              src="/src/assets/images/coliseu_trading_emblem_1791394837853.jpg"
              alt="Coliseu Trading Emblem"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to stylized initials if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-cinzel font-black text-xs text-slate-950 pointer-events-none -z-0">
              CT
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-base tracking-wider text-white font-cinzel whitespace-nowrap">
                COLISEU <span className="text-amber-400">TRADING</span>
              </span>
              <span className="hidden lg:inline-block text-[9px] px-1.5 py-0.5 bg-amber-950/70 text-amber-300 font-mono font-bold rounded border border-amber-700/50">
                ARENA TERMINAL
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block tracking-widest font-mono">
              TRADINGVIEW · QUOTEX FEEDS
            </span>
          </div>
        </button>

        {/* Global Search Bar (Trigger) */}
        <div className="relative ml-1 sm:ml-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#0e121a] hover:bg-[#131824] border border-amber-500/20 hover:border-amber-500/40 text-slate-400 text-xs transition-colors w-28 xs:w-40 sm:w-64 md:w-72 justify-between min-h-[38px]"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">Buscar ativo (TV ou Quotex)...</span>
            </div>
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-amber-300/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Terminal Connection Status (TradingView & Quotex Feed Hub) */}
        <div className="relative">
          <button
            onClick={() => {
              setFeedDropdownOpen(!feedDropdownOpen);
              setUserDropdownOpen(false);
              setAlertsDropdownOpen(false);
            }}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0b0e15] hover:bg-[#111622] border border-amber-500/30 text-[11px] font-mono transition-colors cursor-pointer shadow-sm shadow-amber-500/5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-amber-200 font-semibold tracking-wide">TRADINGVIEW & QUOTEX</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-bold">&lt; 8ms</span>
          </button>

          {feedDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0e121a] border border-amber-500/30 rounded-xl shadow-2xl p-3.5 z-50 text-xs animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
                <span className="font-bold text-amber-300 text-xs font-cinzel">Motores de Dados • Coliseu</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">100% ONLINE</span>
              </div>

              <div className="space-y-2.5">
                {/* TradingView Stream */}
                <div className="p-2.5 rounded-lg bg-[#121622] border border-blue-900/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      TradingView Pro Feed
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">11ms</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cripto spot, ações B3 (BM&F), Wall Street e índices globais com candles institucionais.
                  </p>
                </div>

                {/* Quotex Turbo Stream */}
                <div className="p-2.5 rounded-lg bg-[#121622] border border-amber-900/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Quotex Turbo OTC Engine
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">6ms</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Pares de moedas OTC 24/7, candles ultra-rápidos de 5s a 1m e payout dinâmico de até 95%.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Alert Creator (Tablet & Desktop) */}
        <button
          onClick={() => setAlertModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-xs text-amber-200 transition-colors min-h-[38px]"
        >
          <Bell className="w-3.5 h-3.5 text-amber-400" />
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
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-500/50 bg-slate-900 shadow-sm shadow-amber-500/20 shrink-0">
              <img
                src="/src/assets/images/coliseu_gladiator_trader_1791394860313.jpg"
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-amber-300 text-xs font-cinzel -z-0">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-white truncate max-w-[110px]">{user.name}</span>
              <span className="text-[9px] text-amber-400 font-mono font-bold tracking-wider">
                {user.plan} GLADIADOR
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0e121a] border border-amber-500/30 rounded-xl shadow-2xl p-3 z-50 text-xs animate-in fade-in duration-100">
              <div className="flex items-center gap-3 pb-3 mb-2 border-b border-slate-800">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-500/50 bg-slate-900 shrink-0">
                  <img
                    src="/src/assets/images/coliseu_gladiator_trader_1791394860313.jpg"
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-amber-300 text-sm font-cinzel -z-0">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="truncate">
                  <div className="font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 font-mono font-bold border border-amber-800">
                      {user.plan}
                    </span>
                    <button
                      onClick={() => onNavigate('pricing')}
                      className="text-[10px] text-amber-400 hover:underline cursor-pointer"
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
                          ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
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
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Configurações & Disclaimer</span>
                </button>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('pricing');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-left transition-colors min-h-[38px] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Planos da Arena Coliseu</span>
                </button>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-left transition-colors min-h-[38px] cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
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
