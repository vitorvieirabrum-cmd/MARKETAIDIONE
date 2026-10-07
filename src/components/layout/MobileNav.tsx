import React, { useState } from 'react';
import {
  LayoutDashboard,
  CandlestickChart,
  Globe2,
  ListOrdered,
  Sparkles,
  Menu,
  X,
  Scan,
  BellRing,
  GitBranch,
  Calendar,
  Settings,
  CreditCard,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  const { alerts, setAlertModalOpen } = useMarket();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const primaryTabs = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'chart', label: 'Gráfico', icon: CandlestickChart },
    { id: 'markets', label: 'Mercados', icon: Globe2 },
    { id: 'watchlist', label: 'Watchlist', icon: ListOrdered },
    { id: 'ai', label: 'IA Analyst', icon: Sparkles, highlight: true },
  ];

  const secondaryMenu = [
    { id: 'screener', label: 'Screener de Ativos', icon: Scan, desc: 'Filtros quantitativos e RSI' },
    { id: 'alerts', label: 'Alertas de Preço', icon: BellRing, count: activeAlertsCount, desc: 'Gatilhos em tempo real' },
    { id: 'strategies', label: 'Estratégias & Setups', icon: GitBranch, desc: 'Golden cross, reversões e VWAP' },
    { id: 'calendar', label: 'Calendário Econômico', icon: Calendar, desc: 'FOMC, Copom, Payroll e CPI' },
    { id: 'pricing', label: 'Planos & Assinatura', icon: CreditCard, badge: user.plan, desc: 'Acesso Pro e Pro+' },
    { id: 'settings', label: 'Configurações & Termos', icon: Settings, desc: 'Ajustes, disclaimer e infraestrutura' },
  ];

  const handleSelectPage = (pageId: string) => {
    onNavigate(pageId);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Fixed Bottom Tab Bar for iPhone & Mobile Viewports */}
      <nav
        aria-label="Navegação Principal Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070a10]/95 backdrop-blur-xl border-t border-slate-800/80 pb-safe select-none"
      >
        <div className="grid grid-cols-6 items-center h-14">
          {primaryTabs.map((tab) => {
            const isActive = currentPage === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleSelectPage(tab.id)}
                className={`min-h-[44px] flex flex-col items-center justify-center relative transition-colors ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-amber-400 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                <span className="text-[10px] font-medium tracking-tight mt-0.5">
                  {tab.label}
                </span>

                {isActive && (
                  <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                )}
              </button>
            );
          })}

          {/* More menu trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              drawerOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Mais</span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Bottom Drawer Sheet for Secondary Features on iPhone */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b0e15] border-t border-slate-800 rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden pb-safe shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto my-3" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-amber-500/40 bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center shadow-md">
                  <img
                    src="/src/assets/images/coliseu_trading_emblem_1791394837853.jpg"
                    alt="Coliseu Trading"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm font-cinzel tracking-wider">
                    COLISEU TRADING
                  </h3>
                  <span className="text-[10px] text-amber-400 font-mono">TradingView & Quotex Arena</span>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Items List */}
            <div className="p-4 overflow-y-auto space-y-2">
              {secondaryMenu.map((item) => {
                const Icon = item.icon;
                const isSelected = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPage(item.id)}
                    className={`w-full min-h-[52px] p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-white'
                        : 'bg-[#10141f] border border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-white">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono font-bold border border-cyan-800">
                              {item.badge}
                            </span>
                          )}
                          {item.count !== undefined && item.count > 0 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                              {item.count}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                );
              })}
            </div>

            {/* Fast Quick Actions inside Drawer */}
            <div className="p-4 pt-2 border-t border-slate-800/80 bg-[#080b12] flex items-center justify-between gap-3 text-xs">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setAlertModalOpen(true);
                }}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-center transition-colors min-h-[44px]"
              >
                + Criar Alerta
              </button>
              <button
                onClick={() => handleSelectPage('pricing')}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-center border border-slate-700 transition-colors min-h-[44px]"
              >
                Ver Planos Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
