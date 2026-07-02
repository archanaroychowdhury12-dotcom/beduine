import { useState } from 'react';
import { ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { canAccessAdmin } from '@/services/accessControl';
import { loadProfileRecord, mapSupabaseUser } from '@/utils/userMapper';
import { notify } from '@/services/uiFeedback';
import { SupabaseRawUser } from '@/types';

interface AdminLoginPageProps {
  onBack: () => void;
  onAdminLoginSuccess: (user: SupabaseRawUser) => void;
}

export default function AdminLoginPage({ onBack, onAdminLoginSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        notify.error(error?.message || 'Admin login failed.');
        return;
      }

      const profile = await loadProfileRecord(data.user.id);
      const mapped = mapSupabaseUser(data.user, profile);
      if (!canAccessAdmin(mapped)) {
        await supabase.auth.signOut();
        notify.error('This account is not authorized for the admin panel.');
        return;
      }
      onAdminLoginSuccess(data.user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.12),transparent_38%)]" />
      <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-700 rounded-[32px] p-7 shadow-2xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to site
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-wide">Admin Login</h1>
            <p className="text-xs text-slate-400 font-semibold">Separate restricted page. Customers cannot enter.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="adminEmail">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="adminEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-400"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="adminPassword">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-400"
                placeholder="Enter admin password"
                minLength={6}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest border-none cursor-pointer transition-colors"
          >
            {loading ? 'Checking...' : 'Enter Admin Panel'}
          </button>
        </form>
      </div>
    </section>
  );
}
