'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Email atau kata laluan salah.');
        return;
      }
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ralat sambungan. Sila semak .env.local');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0812]">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-bold text-[#d4a853] text-center mb-2">Dunia Herbs</h1>
        <p className="text-stone-500 text-center text-sm mb-8">Admin Dashboard</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-stone-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-700 bg-herb-surface px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:border-herb-gold focus:outline-none"
              placeholder="admin@duniaherbs.com.my"
              required
            />
          </div>
          <div>
            <label className="text-stone-400 text-sm mb-1 block">Kata Laluan</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-stone-700 bg-herb-surface px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:border-herb-gold focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-herb-gold py-3 text-sm font-semibold text-herb-dark transition hover:bg-herb-goldLight disabled:opacity-50"
          >
            {loading ? 'Memasuki...' : 'Log Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
