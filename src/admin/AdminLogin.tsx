import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Lock, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, navigate, settings } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brandSymbol = settings?.brandSymbol || '"';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.adminLogin({ email: email.trim(), password: password.trim() });
      loginAdmin(res.token, res.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col justify-between p-6 sm:p-12">
      {/* Top row */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="text-xs font-mono tracking-widest text-neutral-400 hover:text-white flex items-center gap-2 uppercase transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STORE</span>
        </button>

        <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
          RESTRICTED ATELIER ACCESS
        </div>
      </div>

      {/* Center login box */}
      <div className="max-w-md w-full mx-auto my-12 bg-[#121212] border border-white/10 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-3xl font-serif text-white/30 select-none" aria-hidden="true">
            {brandSymbol}
          </div>
          <h1 className="text-2xl font-display font-bold uppercase tracking-widest">
            QUOTES ATELIER
          </h1>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            OWNER &amp; ADMINISTRATOR PORTAL
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          <div>
            <label className="block text-neutral-400 uppercase mb-1.5">
              Administrator Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tracking-wide placeholder-neutral-600"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase mb-1.5">
              Secure Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tracking-wide placeholder-neutral-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-black font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? 'AUTHENTICATING...' : 'ENTER ATELIER'}</span>
          </button>
        </form>
      </div>

      <div className="text-center text-[11px] font-mono text-neutral-600 uppercase">
        &copy; {new Date().getFullYear()} QUOTES ATELIER &bull; ALL RIGHTS RESERVED
      </div>
    </div>
  );
};
