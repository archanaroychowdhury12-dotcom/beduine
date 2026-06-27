import React from 'react';
import { UserPlus } from 'lucide-react';
import { Franchise } from '../../types';

interface AgentOnboardingControlProps {
  newAgentName: string;
  setNewAgentName: (v: string) => void;
  newAgentEmail: string;
  setNewAgentEmail: (v: string) => void;
  newAgentPhone: string;
  setNewAgentPhone: (v: string) => void;
  newAgentFranchiseId: string;
  setNewAgentFranchiseId: (v: string) => void;
  newAgentEarningModel: 'salary' | 'commission';
  setNewAgentEarningModel: (v: 'salary' | 'commission') => void;
  newAgentTarget: string;
  setNewAgentTarget: (v: string) => void;
  franchises: Franchise[];
  handleAddAgent: (e: React.FormEvent) => void;
}

export const AgentOnboardingControl: React.FC<AgentOnboardingControlProps> = ({
  newAgentName,
  setNewAgentName,
  newAgentEmail,
  setNewAgentEmail,
  newAgentPhone,
  setNewAgentPhone,
  newAgentFranchiseId,
  setNewAgentFranchiseId,
  newAgentEarningModel,
  setNewAgentEarningModel,
  newAgentTarget,
  setNewAgentTarget,
  franchises,
  handleAddAgent
}) => {
  return (
    <div className="lg:col-span-4 space-y-4 text-left">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
        <UserPlus className="w-4 h-4 text-slate-400" /> Agent Onboarding Control
      </h3>
      <form onSubmit={handleAddAgent} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-slate-400 uppercase">Agent Full Name</label>
          <input
            type="text"
            value={newAgentName}
            onChange={(e) => setNewAgentName(e.target.value)}
            placeholder="e.g. Subrata Dey"
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
          <input
            type="email"
            value={newAgentEmail}
            onChange={(e) => setNewAgentEmail(e.target.value)}
            placeholder="e.g. subrata@gmail.com"
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-slate-400 uppercase">Mobile Number</label>
          <input
            type="text"
            value={newAgentPhone}
            onChange={(e) => setNewAgentPhone(e.target.value)}
            placeholder="e.g. +91 98765 43210"
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-slate-400 uppercase">Map to Franchise</label>
          <select
            value={newAgentFranchiseId}
            onChange={(e) => setNewAgentFranchiseId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-850 font-semibold outline-none focus:border-indigo-500 transition-colors"
          >
            {franchises.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.city})</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-slate-400 uppercase">Earning Model Type</label>
          <select
            value={newAgentEarningModel}
            onChange={(e) => setNewAgentEarningModel(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-855 font-semibold outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="salary">Salary-Based (Fixed ₹12,000)</option>
            <option value="commission">Commission-Based (Target Rates)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[9px] font-bold text-slate-400 uppercase">Monthly Registration Target</label>
          <input
            type="number"
            value={newAgentTarget}
            onChange={(e) => setNewAgentTarget(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border-none cursor-pointer flex items-center justify-center gap-1 shadow-sm mt-2"
        >
          <UserPlus className="w-4 h-4" /> Register &amp; Map Agent
        </button>
      </form>
    </div>
  );
};
