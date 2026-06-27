import React from 'react';
import { User } from 'lucide-react';
import { Agent } from '../../types';

interface AgentNetworkTableProps {
  agents: Agent[];
  handleToggleEarningModel: (agentId: string) => void;
  handleUpdateAgentTarget: (agentId: string, newTargetVal: string) => void;
  handleReleasePayout: (agent: Agent) => void;
}

export const AgentNetworkTable: React.FC<AgentNetworkTableProps> = ({
  agents,
  handleToggleEarningModel,
  handleUpdateAgentTarget,
  handleReleasePayout,
}) => {
  return (
    <div className="lg:col-span-8 space-y-4 text-left">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
        <User className="w-4 h-4 text-slate-450" /> Agent Network Directory ({agents.length})
      </h3>
      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-450 font-bold uppercase tracking-wider">
              <th className="p-3">Agent Profile</th>
              <th className="p-3">Mapped Franchise</th>
              <th className="p-3">Earning Model</th>
              <th className="p-3">Target Subscriptions</th>
              <th className="p-3">Pending Payout</th>
              <th className="p-3 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
            {agents.map((a) => {
              const progressPercent = Math.min(100, Math.round((a.achievedRegistrations / a.targetRegistrations) * 100));
              const isTargetMet = a.achievedRegistrations >= a.targetRegistrations;
              const payout = a.earningModel === 'salary' ? a.salary : a.accruedCommission;
              
              return (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-850 text-slate-800">
                      {a.name} <span className="text-[10px] font-mono text-slate-400 font-bold">({a.id})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{a.phone}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{a.email}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-700">{a.franchiseName}</div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleEarningModel(a.id)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer border transition-all ${
                        a.earningModel === 'salary'
                          ? 'bg-indigo-50 text-indigo-650 border-indigo-150 hover:bg-indigo-100'
                          : 'bg-amber-50 text-amber-655 border-amber-150 hover:bg-amber-100'
                      }`}
                      title="Click to toggle earning model"
                    >
                      {a.earningModel === 'salary' ? 'Salary-Based' : 'Commission-Based'}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1.5 max-w-[120px]">
                      <div className="flex justify-between text-[9px] font-black text-slate-500">
                        <span>{a.achievedRegistrations} / {a.targetRegistrations}</span>
                        <span className={isTargetMet ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isTargetMet ? 'bg-emerald-500' : 'bg-[#FF6B6B]'}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="number"
                          placeholder="Target"
                          defaultValue={a.targetRegistrations}
                          onBlur={(e) => handleUpdateAgentTarget(a.id, e.target.value)}
                          className="w-12 px-1 py-0.5 rounded border border-slate-200 text-[10px] text-center font-mono outline-none"
                        />
                        <span className="text-[8px] text-slate-400">Set</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-800">
                    <div>₹{payout.toLocaleString('en-IN')}</div>
                    <span className="text-[8px] text-slate-400 block font-normal font-sans uppercase">
                      {a.earningModel === 'salary' ? 'Fixed Monthly' : 'Accrued Comm.'}
                    </span>
                  </td>
                  <td className="p-3 text-right pr-6">
                    <button
                      onClick={() => handleReleasePayout(a)}
                      disabled={payout <= 0}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-none transition-all cursor-pointer ${
                        payout > 0
                          ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-100'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Release Payout
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
