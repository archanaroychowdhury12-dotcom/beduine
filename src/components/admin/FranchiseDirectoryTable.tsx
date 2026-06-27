import React from 'react';
import { Route } from 'lucide-react';
import { Franchise } from '../../types';

interface FranchiseDirectoryTableProps {
  franchises: Franchise[];
}

export const FranchiseDirectoryTable: React.FC<FranchiseDirectoryTableProps> = ({ franchises }) => {
  return (
    <div className="lg:col-span-12 space-y-4 text-left">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Route className="w-4 h-4 text-slate-450" /> State-Wise Franchise Allocation ({franchises.length})
        </h3>
      </div>
      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-450 font-bold uppercase tracking-wider">
              <th className="p-3">Franchise ID / Office</th>
              <th className="p-3">Tier</th>
              <th className="p-3">State / City</th>
              <th className="p-3">Investment Capital</th>
              <th className="p-3">Comm. Rate</th>
              <th className="p-3">Total Volume</th>
              <th className="p-3 text-right pr-6">Agents Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
            {franchises.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 font-bold text-slate-800">
                  {f.name} <span className="text-slate-400 font-mono text-[10px] font-bold">({f.id})</span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    f.type === 'Master' ? 'bg-amber-50 text-amber-655 border border-amber-150' :
                    f.type === 'Standard' ? 'bg-indigo-50 text-indigo-655 border border-indigo-150' :
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {f.type} Franchise
                  </span>
                </td>
                <td className="p-3">{f.state} / {f.city}</td>
                <td className="p-3 font-mono">₹{f.investment.toLocaleString('en-IN')}</td>
                <td className="p-3 font-bold text-slate-700">{f.commissionRate}%</td>
                <td className="p-3 font-mono font-bold text-slate-850">₹{f.totalRevenue.toLocaleString('en-IN')}</td>
                <td className="p-3 font-bold text-slate-900 text-right pr-6">{f.agentCount} Agents</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
