import React, { useState } from 'react';
import { TradingChart } from '../components/chart/TradingChart';
import { RSIOscillator } from '../components/chart/RSIOscillator';
import { AssetDetailsPanel } from '../components/chart/AssetDetailsPanel';
import { WatchlistPanel } from '../components/watchlist/WatchlistPanel';
import { AIAnalystPanel } from '../components/ai/AIAnalystPanel';
import { useMarket } from '../context/MarketContext';
import {
  ListOrdered,
  Sparkles,
  BarChart3,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const ChartPage: React.FC = () => {
  const { activeQuote } = useMarket();

  // Desktop dock tab
  const [rightTab, setRightTab] = useState<'watchlist' | 'ai'>('watchlist');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Mobile segmented view on iPhone
  const [mobileTab, setMobileTab] = useState<'chart' | 'watchlist' | 'ai'>('chart');

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-[#06080d] relative">
      {/* Top Asset Details Quick Strip */}
      <div className="p-2 sm:p-2.5 bg-[#080b12] border-b border-slate-800/80 shrink-0">
        <AssetDetailsPanel />
      </div>

      {/* Mobile-Only Segmented View Selector (iPhone / Mobile) */}
      <div className="md:hidden flex items-center justify-around bg-[#0c1018] border-b border-slate-800/80 p-1 shrink-0">
        <button
          onClick={() => setMobileTab('chart')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[40px] cursor-pointer ${
            mobileTab === 'chart'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Gráfico</span>
        </button>

        <button
          onClick={() => setMobileTab('watchlist')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[40px] cursor-pointer ${
            mobileTab === 'watchlist'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
          <span>Watchlist</span>
        </button>

        <button
          onClick={() => setMobileTab('ai')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[40px] cursor-pointer ${
            mobileTab === 'ai'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>IA Analyst</span>
        </button>
      </div>

      {/* Mobile Dynamic View Content */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden min-h-0">
        {mobileTab === 'chart' && (
          <div className="flex-1 w-full h-full flex flex-col min-h-0 p-1.5">
            <TradingChart />
            <RSIOscillator />
          </div>
        )}

        {mobileTab === 'watchlist' && (
          <div className="flex-1 w-full h-full overflow-hidden">
            <WatchlistPanel />
          </div>
        )}

        {mobileTab === 'ai' && (
          <div className="flex-1 w-full h-full overflow-hidden">
            <AIAnalystPanel />
          </div>
        )}
      </div>

      {/* Desktop & Tablet Side-by-Side Area (Hidden on Mobile) */}
      <div className="hidden md:flex flex-1 overflow-hidden relative">
        {/* Left: Interactive Trading Chart Viewport */}
        <div className="flex-1 flex flex-col h-full overflow-hidden p-2.5">
          <div className="flex-1 w-full h-full flex flex-col min-h-0">
            <TradingChart />
            <RSIOscillator />
          </div>
        </div>

        {/* Right Collapsible Dock (Watchlist / AI Analyst) */}
        {rightPanelOpen ? (
          <div className="w-80 lg:w-96 flex flex-col bg-[#0a0d14] border-l border-slate-800/80 h-full shrink-0 z-10">
            {/* Dock Switcher Tabs */}
            <div className="flex items-center justify-between p-1.5 bg-[#07090e] border-b border-slate-800/80 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRightTab('watchlist')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    rightTab === 'watchlist'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Watchlist</span>
                </button>

                <button
                  onClick={() => setRightTab('ai')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    rightTab === 'ai'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Analyst</span>
                </button>
              </div>

              <button
                onClick={() => setRightPanelOpen(false)}
                title="Ocultar painel lateral"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dock Tab Content */}
            <div className="flex-1 overflow-hidden">
              {rightTab === 'watchlist' && <WatchlistPanel />}
              {rightTab === 'ai' && <AIAnalystPanel />}
            </div>
          </div>
        ) : (
          /* Floating button to reopen right dock */
          <div className="absolute right-3 top-4 z-20 flex flex-col gap-1.5">
            <button
              onClick={() => {
                setRightTab('watchlist');
                setRightPanelOpen(true);
              }}
              title="Abrir Watchlist"
              className="p-2.5 rounded-xl bg-[#0e121a] hover:bg-slate-800 border border-slate-800 text-cyan-400 shadow-xl transition-colors cursor-pointer"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setRightTab('ai');
                setRightPanelOpen(true);
              }}
              title="Abrir AI Analyst"
              className="p-2.5 rounded-xl bg-[#0e121a] hover:bg-slate-800 border border-slate-800 text-cyan-400 shadow-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
