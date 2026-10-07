import { AlertCondition, MarketAlert, MarketQuote } from '../types/market';

const STORAGE_KEY = 'marketai_alerts_v1';

export class AlertService {
  private alerts: MarketAlert[] = [];
  private listeners: Set<(alerts: MarketAlert[]) => void> = new Set();
  private triggerListeners: Set<(alert: MarketAlert, quote: MarketQuote) => void> = new Set();

  constructor() {
    this.loadAlerts();
  }

  private loadAlerts() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.alerts = JSON.parse(saved);
      } else {
        // Seed initial alerts
        this.alerts = [
          {
            id: 'alt-1',
            symbol: 'BTCUSD',
            condition: 'greater_than',
            targetPrice: 70000,
            status: 'active',
            createdAt: Date.now() - 3600000 * 24,
            note: 'Rompimento da máxima histórica local',
          },
          {
            id: 'alt-2',
            symbol: 'PETR4',
            condition: 'greater_than',
            targetPrice: 40.50,
            status: 'active',
            createdAt: Date.now() - 3600000 * 12,
            note: 'Alvo para realização parcial em R$ 40,50',
          },
          {
            id: 'alt-3',
            symbol: 'ETHUSD',
            condition: 'less_than',
            targetPrice: 3600,
            status: 'active',
            createdAt: Date.now() - 3600000 * 6,
            note: 'Stop de proteção abaixo do suporte',
          },
          {
            id: 'alt-4',
            symbol: 'NVDA',
            condition: 'greater_than',
            targetPrice: 190.00,
            status: 'active',
            createdAt: Date.now() - 3600000 * 2,
            note: 'Acompanhar pré-mercado acima de US$ 190',
          },
        ];
        this.saveAlerts();
      }
    } catch {
      this.alerts = [];
    }
  }

  private saveAlerts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.alerts));
      this.notifyListeners();
    } catch (e) {
      console.warn('Failed to save alerts to localStorage:', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn([...this.alerts]));
  }

  getAlerts(): MarketAlert[] {
    return [...this.alerts];
  }

  subscribe(callback: (alerts: MarketAlert[]) => void): () => void {
    this.listeners.add(callback);
    callback([...this.alerts]);
    return () => {
      this.listeners.delete(callback);
    };
  }

  onTrigger(callback: (alert: MarketAlert, quote: MarketQuote) => void): () => void {
    this.triggerListeners.add(callback);
    return () => {
      this.triggerListeners.delete(callback);
    };
  }

  createAlert(data: {
    symbol: string;
    condition: AlertCondition;
    targetPrice: number;
    note?: string;
  }): MarketAlert {
    const newAlert: MarketAlert = {
      id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      symbol: data.symbol.toUpperCase(),
      condition: data.condition,
      targetPrice: Number(data.targetPrice),
      status: 'active',
      createdAt: Date.now(),
      note: data.note || `Preço ${data.condition} ${data.targetPrice}`,
    };

    this.alerts.unshift(newAlert);
    this.saveAlerts();
    return newAlert;
  }

  toggleAlertStatus(id: string): void {
    const alert = this.alerts.find((a) => a.id === id);
    if (!alert) return;

    if (alert.status === 'active') {
      alert.status = 'paused';
    } else {
      alert.status = 'active';
      alert.triggeredAt = undefined;
    }
    this.saveAlerts();
  }

  deleteAlert(id: string): void {
    this.alerts = this.alerts.filter((a) => a.id !== id);
    this.saveAlerts();
  }

  /**
   * Evaluates active alerts against current market quote
   */
  evaluateQuote(quote: MarketQuote): MarketAlert[] {
    const triggered: MarketAlert[] = [];

    this.alerts.forEach((alert) => {
      if (alert.status !== 'active') return;
      if (alert.symbol !== quote.symbol) return;

      let hasTriggered = false;
      switch (alert.condition) {
        case 'greater_than':
        case 'cross_up':
          if (quote.price >= alert.targetPrice) {
            hasTriggered = true;
          }
          break;
        case 'less_than':
        case 'cross_down':
          if (quote.price <= alert.targetPrice) {
            hasTriggered = true;
          }
          break;
      }

      if (hasTriggered) {
        alert.status = 'triggered';
        alert.triggeredAt = Date.now();
        triggered.push(alert);
        this.triggerListeners.forEach((fn) => fn(alert, quote));
      }
    });

    if (triggered.length > 0) {
      this.saveAlerts();
    }

    return triggered;
  }
}

export const alertService = new AlertService();
