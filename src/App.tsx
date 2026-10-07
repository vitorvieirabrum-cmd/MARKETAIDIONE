import React, { useState } from 'react';
import { MarketProvider } from './context/MarketContext';
import { AuthProvider } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './pages/DashboardPage';
import { ChartPage } from './pages/ChartPage';
import { MarketsPage } from './pages/MarketsPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { ScreenerPage } from './pages/ScreenerPage';
import { AlertsPage } from './pages/AlertsPage';
import { AIAnalystPage } from './pages/AIAnalystPage';
import { StrategiesPage } from './pages/StrategiesPage';
import { CalendarPage } from './pages/CalendarPage';
import { PricingPage } from './pages/PricingPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'chart':
        return <ChartPage />;
      case 'markets':
        return <MarketsPage onNavigate={setCurrentPage} />;
      case 'watchlist':
        return <WatchlistPage onNavigate={setCurrentPage} />;
      case 'screener':
        return <ScreenerPage onNavigate={setCurrentPage} />;
      case 'alerts':
        return <AlertsPage onNavigate={setCurrentPage} />;
      case 'ai':
        return <AIAnalystPage onNavigate={setCurrentPage} />;
      case 'strategies':
        return <StrategiesPage onNavigate={setCurrentPage} />;
      case 'calendar':
        return <CalendarPage />;
      case 'pricing':
        return <PricingPage onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <MarketProvider>
        <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
          {renderPage()}
        </AppShell>
      </MarketProvider>
    </AuthProvider>
  );
}
