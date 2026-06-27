import React from 'react';
import { Franchise, Agent } from '../../types';

interface AdminOverviewStatsProps {
  franchises: Franchise[];
  agents: Agent[];
  realRevenue: number;
  demoRevenue: number;
}

export const AdminOverviewStats: React.FC<AdminOverviewStatsProps> = ({
  franchises,
  agents,
  realRevenue,
  demoRevenue
}) => {
  return (
    <div className="space-y-6">
      {/* Territory & Agent Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Total Franchises</span>
          <span className="text-2xl font-black text-slate-850 block mt-1 text-slate-800">{franchises.length} Offices</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Total Active Agents</span>
          <span className="text-2xl font-black text-slate-850 block mt-1 text-slate-800">{agents.length} Registered</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Agent Subscriptions</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">
            {agents.reduce((sum, a) => sum + a.achievedRegistrations, 0)} Sold
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Total Commission Accrued</span>
          <span className="text-2xl font-black text-indigo-600 block mt-1">
            ₹{agents.reduce((sum, a) => sum + a.accruedCommission, 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-left">
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-600 font-bold block">Verified Real Revenue</span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">₹{realRevenue.toLocaleString('en-IN')}</span>
          <span className="text-[9px] text-emerald-500 font-medium block mt-1">From real payment checkouts</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">Simulated Demo Volume</span>
          <span className="text-2xl font-black text-slate-700 block mt-1">₹{demoRevenue.toLocaleString('en-IN')}</span>
          <span className="text-[9px] text-slate-400 font-medium block mt-1">Tested using mock wallet credits</span>
        </div>
      </div>
    </div>
  );
};
