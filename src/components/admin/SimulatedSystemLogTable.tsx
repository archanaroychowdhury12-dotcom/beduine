import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface SimulatedSystemLogTableProps {
  transactionsList: any[];
}

export const SimulatedSystemLogTable: React.FC<SimulatedSystemLogTableProps> = ({ transactionsList }) => {
  return (
    <div className="space-y-3 pt-3 border-t border-slate-150 text-left">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
        <ShieldCheck className="w-4 h-4 text-indigo-500" /> Master Simulated System Log ({transactionsList.length} Transactions)
      </h3>
      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm max-h-[300px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-450 font-bold uppercase tracking-wider sticky top-0">
              <th className="p-3">Txn Code</th>
              <th className="p-3">Tester Profile</th>
              <th className="p-3">Description</th>
              <th className="p-3">Wallet Type</th>
              <th className="p-3">Amount Difference</th>
              <th className="p-3 text-right pr-6">Time Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
            {transactionsList.map((txn: any) => {
              const isDebit = txn.amount < 0;
              return (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-800">{txn.id}</td>
                  <td className="p-3 font-semibold text-slate-755 text-slate-700">{txn.email}</td>
                  <td className="p-3 text-slate-600 font-semibold">{txn.reason}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      txn.wallet_type === 'real'
                        ? 'bg-emerald-50 text-emerald-655 border border-emerald-150'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {txn.wallet_type} Wallet
                    </span>
                  </td>
                  <td className={`p-3 font-mono font-bold ${isDebit ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {isDebit ? '-' : '+'}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right text-slate-400 font-mono pr-6">
                    {new Date(txn.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              );
            })}
            {transactionsList.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-450 italic">No simulated wallet transactions recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
