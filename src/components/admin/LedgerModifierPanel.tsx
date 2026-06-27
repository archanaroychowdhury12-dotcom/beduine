import React from 'react';
import { TrendingUp, Wallet, Plus, Minus } from 'lucide-react';

interface LedgerModifierPanelProps {
  selectedAdminUser: any;
  adminCustomAmount: string;
  setAdminCustomAmount: (v: string) => void;
  handleAdminAddBalance: () => void;
  handleAdminRemoveBalance: () => void;
}

export const LedgerModifierPanel: React.FC<LedgerModifierPanelProps> = ({
  selectedAdminUser,
  adminCustomAmount,
  setAdminCustomAmount,
  handleAdminAddBalance,
  handleAdminRemoveBalance,
}) => {
  return (
    <div className="lg:col-span-5 space-y-4 w-full text-left">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
        <TrendingUp className="w-4 h-4 text-slate-450" /> Ledger Controls &amp; Modifier
      </h3>

      {selectedAdminUser ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs animate-fadeIn">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-slate-850 truncate max-w-[200px] text-slate-800">{selectedAdminUser.email}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {selectedAdminUser.id}</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-750 text-[9px] font-bold uppercase tracking-wider">
              Selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-150">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-mono block">Demo Wallet</span>
              <span className="text-base font-black text-slate-800 block mt-0.5">
                ₹{(selectedAdminUser.user_metadata?.demo_wallet_balance ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-mono block">Discount Credits</span>
              <span className="text-base font-black text-indigo-600 block mt-0.5">
                {selectedAdminUser.user_metadata?.discount_credits ?? 0} Credits
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[9.5px] font-bold text-slate-500 uppercase">Modify Demo Balance</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  placeholder="Amount (e.g. 5000)"
                  value={adminCustomAmount}
                  onChange={(e) => setAdminCustomAmount(e.target.value)}
                  className="w-full pl-6 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-850 font-mono outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <button
                onClick={handleAdminAddBalance}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1 transition-colors border-none cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Balance
              </button>
              <button
                onClick={handleAdminRemoveBalance}
                className="py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 transition-colors border-none cursor-pointer"
              >
                <Minus className="w-4 h-4" /> Deduct Balance
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Ledger Entries ({selectedAdminUser.user_metadata?.ledger?.length || 0})</div>
            <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
              {(selectedAdminUser.user_metadata?.ledger || []).map((entry: any) => (
                <div key={entry.id} className="p-2 rounded bg-white border border-slate-100 flex justify-between items-center text-[11px]">
                  <div>
                    <div className="font-bold text-slate-750 text-slate-700">{entry.reason}</div>
                    <div className="text-[9px] text-slate-400">{entry.date} • {entry.id}</div>
                  </div>
                  <div className="font-mono font-bold text-indigo-650">+{entry.amount} Cr</div>
                </div>
              ))}
              {(!selectedAdminUser.user_metadata?.ledger || selectedAdminUser.user_metadata.ledger.length === 0) && (
                <div className="text-center py-4 text-slate-450 italic">No credit ledger entries yet.</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-450 italic flex flex-col justify-center items-center h-[260px]">
          <Wallet className="w-10 h-10 text-slate-350 mb-2 animate-pulse" />
          <span>Select a user from the directory grid to modify their demo wallet balance and view transaction ledger history.</span>
        </div>
      )}
    </div>
  );
};
