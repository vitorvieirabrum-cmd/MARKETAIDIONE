import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, signInWithEmail, signInWithGoogle, signInDemo } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!loginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#0e121a] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#121722]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs font-mono shadow-md">
              GT
            </div>
            <div>
              <h3 className="font-semibold text-white text-base font-display">Guro do Trading</h3>
              <p className="text-xs text-slate-400">Terminal institucional e acesso demo</p>
            </div>
          </div>
          <button
            onClick={() => setLoginModalOpen(false)}
            aria-label="Fechar"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-[#090c12] border-b border-slate-800 mx-5 mt-4 rounded-lg">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              tab === 'login' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              tab === 'register' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Quick Demo Access Bar (Instant 1-click preview) */}
          <div className="p-3 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-800/60 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Acesso Rápido Demo:
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Instantâneo</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => signInDemo('PRO')}
                className="py-1.5 px-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Entrar como PRO
              </button>
              <button
                type="button"
                onClick={() => signInDemo('PRO+')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                Entrar como PRO+
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-800"></div>
            <span className="shrink mx-3 text-[11px] text-slate-500 uppercase font-mono">ou com e-mail</span>
            <div className="grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-[#121722] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121722] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition-colors border border-slate-700"
            >
              {tab === 'login' ? 'Acessar Terminal' : 'Criar Nova Conta'}
            </button>
          </form>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full py-2 bg-[#121722] hover:bg-[#161c28] border border-slate-700 text-slate-200 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#090c12] text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Autenticação protegida por criptografia de ponta a ponta</span>
        </div>
      </div>
    </div>
  );
};
