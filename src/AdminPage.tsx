import { ShieldCheck, LogOut, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAdminState } from './hooks/useAdminState';

// Subcomponents
import { AdminOverviewStats } from './components/admin/AdminOverviewStats';
import { FranchiseDirectoryTable } from './components/admin/FranchiseDirectoryTable';
import { AgentNetworkTable } from './components/admin/AgentNetworkTable';
import { AgentOnboardingControl } from './components/admin/AgentOnboardingControl';
import { LedgerModifierPanel } from './components/admin/LedgerModifierPanel';
import { SimulatedSystemLogTable } from './components/admin/SimulatedSystemLogTable';

interface AdminPageProps {
  user: any;
  onBack: () => void;
  onLogout: () => void;
}

export default function AdminPage({ user, onBack, onLogout }: AdminPageProps) {
  const isDemoOrAdminUser = user?.is_demo_user || user?.email?.includes('admin');

  const {
    adminUsers,
    selectedAdminUser,
    setSelectedAdminUser,
    adminCustomAmount,
    setAdminCustomAmount,
    adminFilter,
    setAdminFilter,
    adminSubTab,
    setAdminSubTab,
    franchises,
    agents,
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
    handleReleasePayout,
    handleUpdateAgentTarget,
    handleResetSelectedDemoUser,
    handleResetAllDemoUsers,
    handleAdminAddBalance,
    handleAdminRemoveBalance,
    getAllTransactions,
    getRevenueStats
  } = useAdminState();

  if (!isDemoOrAdminUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black uppercase tracking-wider text-rose-450">Access Denied</h2>
          <p className="text-sm text-slate-400">
            This administrative area is restricted to authorized credentials and testing profiles.
          </p>
          <button
            onClick={onBack}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors border-none cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { realRevenue, demoRevenue } = getRevenueStats();
  const transactionsList = getAllTransactions();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative">
      <div className="noise fixed inset-0 pointer-events-none z-30 opacity-[0.015]" />
      
      {/* Top Navbar */}
      <nav className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 px-6 py-4 sticky top-0 z-40 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-650/10 border border-indigo-500/25">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-black uppercase tracking-wider text-slate-100">Beduine Admin Center</h1>
            <p className="text-[10px] text-indigo-300/80 font-medium">Simulation Dashboard &amp; Territory Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 transition-colors border border-slate-650 cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
          </button>
          
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-white bg-rose-950/20 hover:bg-rose-600/25 transition-colors border border-rose-900/30 cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6 text-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 pb-5">
              <div>
                <h2 className="text-base font-black flex items-center gap-2 text-slate-800 uppercase tracking-wide">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> Admin Control Panel
                </h2>
                <p className="text-xs text-slate-400">Exclusively for admin/testers to manage test users, demo wallets, and analytics</p>
              </div>
              <button
                onClick={handleResetAllDemoUsers}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 transition-colors border-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-red-100"
              >
                Reset All Accounts
              </button>
            </div>

            {/* Admin Sub-Tabs Navigation */}
            <div className="flex border-b border-slate-200 gap-2">
              <button
                onClick={() => setAdminSubTab('directory')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer bg-transparent border-none ${
                  adminSubTab === 'directory'
                    ? 'border-indigo-600 text-indigo-600 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-650'
                }`}
              >
                Users &amp; Wallets
              </button>
              <button
                onClick={() => setAdminSubTab('franchise')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer bg-transparent border-none ${
                  adminSubTab === 'franchise'
                    ? 'border-indigo-600 text-indigo-600 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-650'
                }`}
              >
                Franchise &amp; Agent Network
              </button>
            </div>

            {adminSubTab === 'franchise' && (
              <div className="space-y-6 animate-fadeIn">
                <AdminOverviewStats
                  franchises={franchises}
                  agents={agents}
                  realRevenue={realRevenue}
                  demoRevenue={demoRevenue}
                />
                <FranchiseDirectoryTable franchises={franchises} />
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  <AgentNetworkTable
                    agents={agents}
                    handleToggleEarningModel={handleToggleEarningModel}
                    handleUpdateAgentTarget={handleUpdateAgentTarget}
                    handleReleasePayout={handleReleasePayout}
                  />
                  <AgentOnboardingControl
                    newAgentName={newAgentName}
                    setNewAgentName={setNewAgentName}
                    newAgentEmail={newAgentEmail}
                    setNewAgentEmail={setNewAgentEmail}
                    newAgentPhone={newAgentPhone}
                    setNewAgentPhone={setNewAgentPhone}
                    newAgentFranchiseId={newAgentFranchiseId}
                    setNewAgentFranchiseId={setNewAgentFranchiseId}
                    newAgentEarningModel={newAgentEarningModel}
                    setNewAgentEarningModel={setNewAgentEarningModel}
                    newAgentTarget={newAgentTarget}
                    setNewAgentTarget={setNewAgentTarget}
                    franchises={franchises}
                    handleAddAgent={handleAddAgent}
                  />
                </div>
              </div>
            )}

            {adminSubTab === 'directory' && (
              <>
                <AdminOverviewStats
                  franchises={franchises}
                  agents={agents}
                  realRevenue={realRevenue}
                  demoRevenue={demoRevenue}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Directory Column */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        Users List ({adminUsers.length})
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Filter</span>
                        <select
                          value={adminFilter}
                          onChange={(e) => setAdminFilter(e.target.value as any)}
                          className="text-[11px] px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-655 font-semibold outline-none"
                        >
                          <option value="all">All Profiles</option>
                          <option value="real">Real Subscription</option>
                          <option value="demo">Demo Wallet User</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm max-h-[420px] overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b bg-slate-50 text-slate-450 font-bold uppercase tracking-wider sticky top-0">
                            <th className="p-3">User Email</th>
                            <th className="p-3">Active Plan</th>
                            <th className="p-3">Demo Wallet</th>
                            <th className="p-3 text-right pr-6">Reset</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
                          {adminUsers
                            .filter(u => {
                              if (adminFilter === 'real') return u.user_metadata?.subscription_source === 'real';
                              if (adminFilter === 'demo') return u.user_metadata?.is_demo_user || u.user_metadata?.subscription_source === 'demo';
                              return true;
                            })
                            .map((u) => {
                              const isSel = selectedAdminUser?.id === u.id;
                              return (
                                <tr
                                  key={u.id}
                                  onClick={() => {
                                    setSelectedAdminUser(u);
                                    setAdminCustomAmount('');
                                  }}
                                  className={`cursor-pointer transition-colors ${
                                    isSel ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50/50'
                                  }`}
                                >
                                  <td className="p-3">
                                    <div className={`font-bold ${isSel ? 'text-indigo-650' : 'text-slate-800'}`}>{u.email}</div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{u.id.slice(0, 8)}...</div>
                                  </td>
                                  <td className="p-3">
                                    {u.user_metadata?.planName ? (
                                      <div>
                                        <span className="font-bold text-slate-750">{u.user_metadata.planName}</span>
                                        <span className="text-[9px] uppercase font-mono tracking-wider ml-1 text-slate-400">
                                          ({u.user_metadata.planType})
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-slate-350 italic">None</span>
                                    )}
                                  </td>
                                  <td className="p-3 font-mono font-bold text-slate-800">
                                    ₹{(u.user_metadata?.demo_wallet_balance ?? 0).toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => handleResetSelectedDemoUser(u)}
                                      className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:text-rose-500 hover:bg-rose-50 bg-transparent cursor-pointer transition-colors"
                                      title="Reset Account to Zero"
                                    >
                                      Reset
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <LedgerModifierPanel
                    selectedAdminUser={selectedAdminUser}
                    adminCustomAmount={adminCustomAmount}
                    setAdminCustomAmount={setAdminCustomAmount}
                    handleAdminAddBalance={handleAdminAddBalance}
                    handleAdminRemoveBalance={handleAdminRemoveBalance}
                  />
                </div>

                <SimulatedSystemLogTable transactionsList={transactionsList} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-[10px] text-slate-500 font-medium border-t border-slate-800 mt-12 bg-slate-950/40">
        © 2026 BEDUINE TOUR AND TRAVELS PVT LTD • Administrative Operations Interface • Built for Quality Assurance &amp; Business Testing
      </footer>
    </div>
  );
}
