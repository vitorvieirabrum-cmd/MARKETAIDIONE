import { UserProfile } from '../types/market';

const USER_STORAGE_KEY = 'marketai_user_profile_v1';

export const DEMO_PRO_USER: UserProfile = {
  id: 'usr_pro_institution_01',
  name: 'Vitor Brum',
  email: 'vitorvieirabrum@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'PRO',
  watchlist: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'NVDA', 'PETR4', 'VALE3', 'SPX'],
  theme: 'dark',
  preferences: {
    defaultTimeframe: '1D',
    soundEnabled: true,
    streamUpdates: true,
  },
};

export class AuthService {
  private currentUser: UserProfile = DEMO_PRO_USER;
  private listeners: Set<(user: UserProfile) => void> = new Set();

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        this.currentUser = JSON.parse(saved);
      } else {
        this.currentUser = DEMO_PRO_USER;
        this.saveUser();
      }
    } catch {
      this.currentUser = DEMO_PRO_USER;
    }
  }

  private saveUser() {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.currentUser));
      this.notify();
    } catch (e) {
      console.warn('Failed to save user profile:', e);
    }
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.currentUser }));
  }

  getUser(): UserProfile {
    return { ...this.currentUser };
  }

  subscribe(callback: (user: UserProfile) => void): () => void {
    this.listeners.add(callback);
    callback({ ...this.currentUser });
    return () => {
      this.listeners.delete(callback);
    };
  }

  async signInWithEmail(email: string, _pass: string): Promise<UserProfile> {
    this.currentUser = {
      ...this.currentUser,
      id: `usr_${Date.now()}`,
      email,
      name: email.split('@')[0],
    };
    this.saveUser();
    return this.currentUser;
  }

  async signInWithGoogle(): Promise<UserProfile> {
    this.currentUser = {
      ...DEMO_PRO_USER,
      id: 'google_oauth_trader',
      name: 'Vitor Brum (Google)',
      email: 'vitorvieirabrum@gmail.com',
    };
    this.saveUser();
    return this.currentUser;
  }

  async signInDemo(plan: 'FREE' | 'PRO' | 'PRO+' = 'PRO'): Promise<UserProfile> {
    this.currentUser = {
      ...DEMO_PRO_USER,
      plan,
      name: plan === 'PRO+' ? 'Institutional Trader Pro+' : 'MarketAI Pro Trader',
    };
    this.saveUser();
    return this.currentUser;
  }

  async signOut(): Promise<void> {
    this.currentUser = {
      ...DEMO_PRO_USER,
      id: 'guest_trader',
      name: 'Visitante Demo',
      email: 'guest@marketai.terminal',
      plan: 'FREE',
    };
    this.saveUser();
  }

  updatePlan(plan: 'FREE' | 'PRO' | 'PRO+'): void {
    this.currentUser.plan = plan;
    this.saveUser();
  }

  toggleWatchlistSymbol(symbol: string): boolean {
    const list = this.currentUser.watchlist;
    const upper = symbol.toUpperCase();
    const index = list.indexOf(upper);
    let added = false;

    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.unshift(upper);
      added = true;
    }

    this.saveUser();
    return added;
  }

  isInWatchlist(symbol: string): boolean {
    return this.currentUser.watchlist.includes(symbol.toUpperCase());
  }
}

export const authService = new AuthService();
