import { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Coins, ChevronDown, RotateCcw, X, Plus } from 'lucide-react';
import { demoWalletService } from '../../services/demoWalletService';
import { supabase } from '../../utils/supabaseClient';
import { isDemoModeAllowed } from '@/config/runtime';
import { canUseDemoTools } from '../../services/accessControl';
import { confirmAction } from '@/services/uiFeedback';

export function DemoBanner({ currentUser }: { currentUser: any }) {
  const isDemoWalletEnabled = isDemoModeAllowed();
  const canShowDemoTools = !currentUser || canUseDemoTools(currentUser);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isDemoWalletEnabled || !canShowDemoTools) return null;

  const presets = [499, 799, 1499, 4999, 7999, 14999];

  const handleAddBalance = async (amount: number) => {
    if (!currentUser) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await demoWalletService.addDemoBalance(currentUser.id, amount);
      if (res.success) {
        const txns = await demoWalletService.getDemoTransactions(currentUser.id);
        const updatedMeta = {
          ...currentUser.supabaseUser.user_metadata,
          demo_wallet_balance: res.balance,
          demo_transactions: txns
        };
        await supabase.auth.updateUser({
          data: updatedMeta
        });
        window.dispatchEvent(new CustomEvent('demoBalanceChanged', { detail: { balance: res.balance } }));
        setFeedback({ type: 'success', message: `Added ₹${amount.toLocaleString('en-IN')}` });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!currentUser) return;
    if (!(await confirmAction({ title: 'Reset demo account?', message: 'This will reset your balance to ₹0 and deactivate active plans.', confirmLabel: 'Reset', danger: true }))) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await demoWalletService.resetDemoAccount(currentUser.id);
      if (res.success) {
        const updatedMeta = {
          ...currentUser.supabaseUser.user_metadata,
          planName: null,
          planPrice: null,
          planType: null,
          subscriptionStatus: 'inactive',
          real_wallet_balance: 0,
          demo_wallet_balance: 0,
          discount_credits: 0,
          weekly_eligible_entry_count: 0,
          used_credits: 0,
          pending_credits: 0,
          selected_member_benefit_status: 'none',
          ledger: [],
          demo_transactions: []
        };
        await supabase.auth.updateUser({
          data: updatedMeta
        });
        window.dispatchEvent(new CustomEvent('demoBalanceChanged', { detail: { balance: 0 } }));
        setFeedback({ type: 'success', message: 'Demo wallet reset' });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAdd = () => {
    const amt = parseFloat(customAmount);
    if (isNaN(amt) || amt <= 0) {
      setFeedback({ type: 'error', message: 'Enter a valid amount' });
      return;
    }
    handleAddBalance(amt);
    setCustomAmount('');
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-9 z-[100] bg-slate-950/95 border-b border-white/10 text-white px-4 flex justify-between items-center text-xs shadow-md">
      <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-wider text-[10px]">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span>Demo Environment</span>
      </div>

      {currentUser && canUseDemoTools(currentUser) && (
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => {
              setIsPopoverOpen(!isPopoverOpen);
              setFeedback(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-full transition-all text-[11px] shadow-lg border-none cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>₹{(currentUser.demo_wallet_balance ?? 0).toLocaleString('en-IN')} Demo</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${isPopoverOpen ? 'rotate-180' : ''}`} />
          </button>

          {isPopoverOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-4 text-white z-[110] space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[11px] uppercase font-bold text-slate-450 tracking-wider font-mono">Demo Controls</span>
                <button 
                  onClick={() => setIsPopoverOpen(false)}
                  className="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">Current Balance</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  ₹{(currentUser.demo_wallet_balance ?? 0).toLocaleString('en-IN')}
                </span>
              </div>

              {feedback && (
                <div className={`p-2 rounded-lg text-[10px] text-center font-bold ${
                  feedback.type === 'success' ? 'bg-emerald-550/10 text-emerald-400 border border-emerald-550/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {feedback.message}
                </div>
              )}

              <div className="space-y-2">
                <span className="block text-[9px] uppercase font-bold text-slate-450 tracking-wider font-mono">Add Preset Amount</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {presets.map((amt) => (
                    <button
                      key={amt}
                      disabled={loading}
                      onClick={() => handleAddBalance(amt)}
                      className="py-1 px-1.5 bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-white/10 rounded-lg text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +₹{amt >= 1000 ? `${(amt/1000).toFixed(0)}k` : amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[9px] uppercase font-bold text-slate-450 tracking-wider font-mono">Custom Amount</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    disabled={loading}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                  <button
                    onClick={handleCustomAdd}
                    disabled={loading}
                    className="px-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-700 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer border-none flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-305 font-bold border border-red-500/20 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

