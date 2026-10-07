import React, { useState } from 'react';
import {
  LayoutDashboard,
  CandlestickChart,
  Globe2,
  ListOrdered,
  Scan,
  BellRing,
  Sparkles,
  GitBranch,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
}) => {
  const { alerts } = useMarket();
  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chart', label: 'Gráficos', icon: CandlestickChart, badge: 'PRO' },
    { id: 'markets', label: 'Mercados', icon: Globe2 },
    { id: 'watchlist', label: 'Watchlist', icon: ListOrdered },
    { id: 'screener', label: 'Screener', icon: Scan },
    { id: 'alerts', label: 'Alertas', icon: BellRing, count: activeAlertsCount },
    { id: 'ai', label: 'IA Analyst', icon: Sparkles, highlight: true },
    { id: 'strategies', label: 'Estratégias', icon: GitBranch },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside
      className={`bg-[#0a0d14] border-r border-slate-800/80 flex flex-col justify-between transition-all duration-200 select-none z-20 shrink-0 ${
        collapsed ? 'w-14' : 'w-56'
      }`}
    >
      {/* Navigation Links */}
      <div className="py-2.5 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`p-1 rounded shrink-0 transition-colors ${
                  item.highlight
                    ? 'text-cyan-400 group-hover:text-cyan-300'
                    : isActive
                    ? 'text-cyan-400'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate text-left">
                  <span className="truncate">{item.label}</span>

                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono font-bold border border-cyan-800/50">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono font-bold">
                      {item.count}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[11px] rounded shadow-md border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Controls */}
      <div className="p-2 border-t border-slate-800/80 bg-[#090c12]/80 space-y-1">
        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center justify-between w-full text-xs px-1">
              <span className="text-[11px] text-slate-400">Recolher</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
