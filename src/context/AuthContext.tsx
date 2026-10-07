import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile } from '../types/market';
import { authService, DEMO_PRO_USER } from '../services/authService';

interface AuthContextType {
  user: UserProfile;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  signInDemo: (plan?: 'FREE' | 'PRO' | 'PRO+') => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePlan: (plan: 'FREE' | 'PRO' | 'PRO+') => void;
  toggleWatchlist: (symbol: string) => boolean;
  isInWatchlist: (symbol: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => authService.getUser());
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsub = authService.subscribe((u) => {
      setUser({ ...u });
    });
    return unsub;
  }, []);

  const signInDemo = useCallback(async (plan: 'FREE' | 'PRO' | 'PRO+' = 'PRO') => {
    await authService.signInDemo(plan);
    setLoginModalOpen(false);
  }, []);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    await authService.signInWithEmail(email, pass);
    setLoginModalOpen(false);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await authService.signInWithGoogle();
    setLoginModalOpen(false);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
  }, []);

  const updatePlan = useCallback((plan: 'FREE' | 'PRO' | 'PRO+') => {
    authService.updatePlan(plan);
  }, []);

  const toggleWatchlist = useCallback((symbol: string) => {
    const result = authService.toggleWatchlistSymbol(symbol);
    setUser(authService.getUser());
    return result;
  }, []);

  const isInWatchlist = useCallback((symbol: string) => {
    return authService.isInWatchlist(symbol);
  }, [user.watchlist]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loginModalOpen,
        setLoginModalOpen,
        signInDemo,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        updatePlan,
        toggleWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
