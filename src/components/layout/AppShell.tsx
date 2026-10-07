import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { MarketTicker } from './MarketTicker';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { SymbolSearchModal } from '../search/SymbolSearchModal';
import { AlertCreatorModal } from '../alerts/AlertCreatorModal';
import { IndicatorModal } from '../chart/IndicatorModal';
import { LoginModal } from '../auth/LoginModal';
import { useMarket } from '../../context/MarketContext';
import { BellRing, X } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, currentPage, onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { recentTrigger, dismissTrigger, setSelectedSymbol } = useMarket();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#06080d] text-slate-100 antialiased font-sans select-none">
      {/* 1. Top Header */}
      <TopBar onNavigate={onNavigate} currentPage={currentPage} />

      {/* 2. Market Ticker Tape */}
      <MarketTicker />

      {/* 3. Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Collapsible Navigation (Desktop & Tablet only) */}
        <div className="hidden md:flex shrink-0">
          <Sidebar
            currentPage={currentPage}
            onNavigate={onNavigate}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Dynamic Page Viewport (with safe bottom padding for iPhone tab bar & home indicator) */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#06080d] relative pb-[calc(4.25rem+env(safe-area-inset-bottom,16px))] md:pb-0">
          {children}
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation (iPhone & Android) */}
      <MobileNav currentPage={currentPage} onNavigate={onNavigate} />

      {/* 5. Live Triggered Alert Toast Notification (Responsive for iPhone) */}
      {recentTrigger && (
        <div className="fixed bottom-20 md:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-50 sm:max-w-sm bg-[#10141f] border-2 border-amber-500/80 rounded-2xl shadow-2xl p-4 text-xs animate-in slide-in-from-bottom-5 duration-200 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono text-sm">
                    {recentTrigger.alert.symbol}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-mono font-bold">
                    DISPARADO!
                  </span>
                </div>
                <p className="text-slate-200 font-medium mt-1">
                  Preço atingiu{' '}
                  <strong className="text-white font-mono">
                    {recentTrigger.quote.price.toLocaleString('pt-BR')}
                  </strong>{' '}
                  (Alvo: {recentTrigger.alert.targetPrice.toLocaleString('pt-BR')})
                </p>
                {recentTrigger.alert.note && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Nota: {recentTrigger.alert.note}
                  </p>
                )}
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedSymbol(recentTrigger.alert.symbol);
                      onNavigate('chart');
                      dismissTrigger();
                    }}
                    className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-cyan-400 transition-colors min-h-[34px]"
                  >
                    Abrir Gráfico
                  </button>
                  <button
                    onClick={dismissTrigger}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 transition-colors min-h-[34px]"
                  >
                    Dispensar
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={dismissTrigger}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <SymbolSearchModal />
      <AlertCreatorModal />
      <IndicatorModal />
      <LoginModal />
    </div>
  );
};
