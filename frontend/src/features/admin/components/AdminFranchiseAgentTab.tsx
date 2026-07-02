import { Route, User, UserPlus } from 'lucide-react';

type AdminFranchiseAgentTabProps = {
  ctx: any;
};

export function AdminFranchiseAgentTab({ ctx }: AdminFranchiseAgentTabProps) {
  const franchises = ctx.franchises as any[];
  const agents = ctx.agents as any[];
  const {
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
    handleAddAgent,
    handleToggleEarningModel,
    handleUpdateAgentTarget,
    handleReleasePayout,
  } = ctx;

  return (
      <div className="space-y-6 animate-fadeIn text-slate-800">
        {/* Territory & Agent Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Total Franchises</span>
            <span className="text-2xl font-black text-slate-850 block mt-1">{franchises.length} Offices</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Total Active Agents</span>
            <span className="text-2xl font-black text-slate-850 block mt-1">{agents.length} Registered</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Agent Subscriptions</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">
              {agents.reduce((sum, a) => sum + a.achievedRegistrations, 0)} Sold
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Total Commission Accrued</span>
            <span className="text-2xl font-black text-indigo-600 block mt-1">
              ₹{agents.reduce((sum, a) => sum + a.accruedCommission, 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Franchises Directory */}
          <div className="lg:col-span-12 space-y-4">
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
                    <th className="p-3 text-right">Agents Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                  {franchises.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-bold text-slate-800">{f.name} <span className="text-slate-400 font-mono text-[10px] font-bold">({f.id})</span></td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          f.type === 'Master' ? 'bg-amber-50 text-amber-650 border border-amber-150' :
                          f.type === 'Standard' ? 'bg-indigo-50 text-indigo-650 border border-indigo-150' :
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
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Mapped Agents Registry */}
          <div className="lg:col-span-8 space-y-4">
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
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                  {agents.map((a) => {
                    const progressPercent = Math.min(100, Math.round((a.achievedRegistrations / a.targetRegistrations) * 100));
                    const isTargetMet = a.achievedRegistrations >= a.targetRegistrations;
                    const payout = a.earningModel === 'salary' ? a.salary : a.accruedCommission;

                    return (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-850">{a.name} <span className="text-[10px] font-mono text-slate-400 font-bold">({a.id})</span></div>
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
                                ? 'bg-indigo-50 text-indigo-655 border-indigo-150 hover:bg-indigo-100'
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
                        <td className="p-3 text-right">
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

          {/* New Agent Onboarding panel */}
          <div className="lg:col-span-4 space-y-4">
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
        </div>
      </div>
  );
}
