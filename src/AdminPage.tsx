import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  Route, 
  User, 
  UserPlus, 
  LogOut, 
  ArrowLeft, 
  TrendingUp, 
  Wallet, 
  Plus, 
  Minus, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { supabase } from './utils/supabaseClient';
import { demoWalletService } from './services/demoWalletService';
import { Franchise, Agent } from './types';

interface AdminPageProps {
  user: any;
  onBack: () => void;
  onLogout: () => void;
}

export default function AdminPage({ user, onBack, onLogout }: AdminPageProps) {
  const isDemoOrAdminUser = user?.is_demo_user || user?.email?.includes('admin');

  // Admin panel state
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [selectedAdminUser, setSelectedAdminUser] = useState<any | null>(null);
  const [adminCustomAmount, setAdminCustomAmount] = useState<string>('');
  const [adminFilter, setAdminFilter] = useState<'all' | 'real' | 'demo'>('all');
  const [adminSubTab, setAdminSubTab] = useState<'directory' | 'franchise'>('directory');

  const [franchises, setFranchises] = useState<Franchise[]>([
    { id: 'FR-WB-01', name: 'West Bengal Master', type: 'Master', state: 'West Bengal', city: 'Kolkata', investment: 850000, commissionRate: 15, totalRevenue: 1250000, agentCount: 8 },
    { id: 'FR-OD-02', name: 'Odisha Standard', type: 'Standard', state: 'Odisha', city: 'Bhubaneswar', investment: 250000, commissionRate: 10, totalRevenue: 450000, agentCount: 3 },
    { id: 'FR-WB-03', name: 'Siliguri City Hub', type: 'CityHub', state: 'West Bengal', city: 'Siliguri', investment: 60000, commissionRate: 7, totalRevenue: 120000, agentCount: 2 },
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    { id: 'AG-001', name: 'Arindam Das', email: 'arindam@example.com', phone: '+91 98300 12345', franchiseId: 'FR-WB-01', franchiseName: 'West Bengal Master', earningModel: 'salary', targetRegistrations: 50, achievedRegistrations: 38, accruedCommission: 0, salary: 12000, status: 'active' },
    { id: 'AG-002', name: 'Manoj Mishra', email: 'manoj@example.com', phone: '+91 94330 99887', franchiseId: 'FR-OD-02', franchiseName: 'Odisha Standard', earningModel: 'commission', targetRegistrations: 40, achievedRegistrations: 15, accruedCommission: 1750, salary: 0, status: 'active' },
    { id: 'AG-003', name: 'Subho Pal', email: 'subho@example.com', phone: '+91 90022 55443', franchiseId: 'FR-WB-03', franchiseName: 'Siliguri City Hub', earningModel: 'salary', targetRegistrations: 50, achievedRegistrations: 52, accruedCommission: 800, salary: 10000, status: 'active' },
    { id: 'AG-004', name: 'Riya Sen', email: 'riya@example.com', phone: '+91 97775 88221', franchiseId: 'FR-WB-01', franchiseName: 'West Bengal Master', earningModel: 'commission', targetRegistrations: 30, achievedRegistrations: 28, accruedCommission: 4200, salary: 0, status: 'active' },
  ]);

  // Form states for adding new Agent
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentFranchiseId, setNewAgentFranchiseId] = useState('FR-WB-01');
  const [newAgentEarningModel, setNewAgentEarningModel] = useState<'salary' | 'commission'>('salary');
  const [newAgentTarget, setNewAgentTarget] = useState('50');

  // Load and sync users list
  const loadUsersList = () => {
    const auth = (supabase.auth as any);
    if (auth?.getUsersList) {
      setAdminUsers(auth.getUsersList());
    }
  };

  useEffect(() => {
    loadUsersList();
  }, []);

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

  // --- Handlers ---
  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentEmail || !newAgentPhone) {
      alert('Please fill all fields');
      return;
    }
    const franchiseObj = franchises.find(f => f.id === newAgentFranchiseId);
    const newAgent: Agent = {
      id: `AG-${Math.floor(100 + Math.random() * 900)}`,
      name: newAgentName,
      email: newAgentEmail,
      phone: newAgentPhone,
      franchiseId: newAgentFranchiseId,
      franchiseName: franchiseObj?.name || '',
      earningModel: newAgentEarningModel,
      targetRegistrations: parseInt(newAgentTarget, 10) || 50,
      achievedRegistrations: 0,
      accruedCommission: 0,
      salary: newAgentEarningModel === 'salary' ? 12000 : 0,
      status: 'active',
    };
    setAgents(prev => [...prev, newAgent]);
    
    // Increment agent count in franchise
    setFranchises(prev => prev.map(f => {
      if (f.id === newAgentFranchiseId) {
        return { ...f, agentCount: f.agentCount + 1 };
      }
      return f;
    }));

    // Reset fields
    setNewAgentName('');
    setNewAgentEmail('');
    setNewAgentPhone('');
    alert('Agent registered successfully!');
  };

  const handleToggleEarningModel = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const nextModel = a.earningModel === 'salary' ? 'commission' : 'salary';
        return {
          ...a,
          earningModel: nextModel,
          salary: nextModel === 'salary' ? 12000 : 0,
          accruedCommission: nextModel === 'commission' ? 1500 : 0
        };
      }
      return a;
    }));
  };

  const handleReleasePayout = (agent: Agent) => {
    const amountToPay = agent.earningModel === 'salary' ? agent.salary : agent.accruedCommission;
    if (amountToPay <= 0) {
      alert('No pending payout balance for this agent.');
      return;
    }
    
    const confirmRelease = window.confirm(`Release ₹${amountToPay.toLocaleString('en-IN')} payout to Agent ${agent.name}?`);
    if (!confirmRelease) return;

    const auth = (supabase.auth as any);
    const users = auth.getUsersList ? auth.getUsersList() : [];
    
    // Find or create agent user in system directory to associate transaction
    let targetUser = users.find((u: any) => u.email === agent.email);
    if (!targetUser && users.length > 0) {
      targetUser = users[0];
    }
    
    if (targetUser) {
      const idx = users.findIndex((u: any) => u.id === targetUser.id);
      if (idx !== -1) {
        const userToModify = users[idx];
        const newTxn = {
          id: `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: targetUser.id,
          amount: -amountToPay,
          transaction_type: 'debit' as const,
          wallet_type: 'demo' as const,
          payment_type: 'demo_wallet' as const,
          reason: `Agent Payout Released: ${agent.name} (${agent.earningModel === 'salary' ? 'Monthly Salary' : 'Accrued Commissions'})`,
          status: 'success' as const,
          created_at: new Date().toISOString()
        };
        const demoTransactions = userToModify.user_metadata?.demo_transactions || [];
        demoTransactions.unshift(newTxn);
        userToModify.user_metadata = {
          ...userToModify.user_metadata,
          demo_transactions: demoTransactions,
          demo_wallet_balance: Math.max(0, (userToModify.user_metadata?.demo_wallet_balance ?? 0) - amountToPay)
        };
        users[idx] = userToModify;
        auth.saveUsersList(users);
        setAdminUsers(users);
      }
    }

    // Reset accrued commission or mark salary as paid
    setAgents(prev => prev.map(a => {
      if (a.id === agent.id) {
        return {
          ...a,
          accruedCommission: 0,
          achievedRegistrations: 0, // Reset targets for the next cycle
        };
      }
      return a;
    }));

    alert(`Payout of ₹${amountToPay.toLocaleString('en-IN')} successfully released to Agent ${agent.name}!`);
  };

  const handleUpdateAgentTarget = (agentId: string, newTargetVal: string) => {
    const num = parseInt(newTargetVal, 10);
    if (isNaN(num) || num <= 0) return;
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return { ...a, targetRegistrations: num };
      }
      return a;
    }));
  };

  const handleResetSelectedDemoUser = async (userToReset: any) => {
    const res = await demoWalletService.resetDemoAccount(userToReset.id);
    if (res.success) {
      const auth = (supabase.auth as any);
      const updatedList = auth.getUsersList();
      setAdminUsers(updatedList);
      if (selectedAdminUser && selectedAdminUser.id === userToReset.id) {
        setSelectedAdminUser(updatedList.find((u: any) => u.id === userToReset.id) || null);
      }
      alert(`Demo user ${userToReset.email} reset successfully.`);
    } else {
      alert(res.message);
    }
  };

  const handleResetAllDemoUsers = async () => {
    if (!window.confirm("Are you sure you want to reset all user accounts to a zero-state?")) return;
    const auth = (supabase.auth as any);
    auth.resetAllAccounts();
    const updatedList = auth.getUsersList();
    setAdminUsers(updatedList);
    setSelectedAdminUser(null);
    alert("All user accounts have been reset to ₹0 balance, null plans, and zero-credits successfully.");
  };

  const handleAdminAddBalance = async () => {
    if (!selectedAdminUser) return;
    const amt = parseFloat(adminCustomAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    const res = await demoWalletService.addDemoBalance(selectedAdminUser.id, amt);
    if (res.success) {
      const auth = (supabase.auth as any);
      const updatedList = auth.getUsersList();
      setAdminUsers(updatedList);
      setSelectedAdminUser(updatedList.find((u: any) => u.id === selectedAdminUser.id) || null);
      setAdminCustomAmount('');
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  const handleAdminRemoveBalance = async () => {
    if (!selectedAdminUser) return;
    const auth = (supabase.auth as any);
    const users = auth.getUsersList();
    const idx = users.findIndex((u: any) => u.id === selectedAdminUser.id);
    if (idx === -1) return;
    
    const userToModify = users[idx];
    const currentBalance = userToModify.user_metadata?.demo_wallet_balance ?? 0;
    
    const amt = parseFloat(adminCustomAmount);
    let newBalance = 0;
    let reason = "Removed demo balance by admin";
    
    if (!isNaN(amt) && amt > 0) {
      newBalance = Math.max(0, currentBalance - amt);
      reason = `Deducted test balance: -₹${amt} by admin`;
    }
    
    const newTxn = {
      id: `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: selectedAdminUser.id,
      amount: newBalance - currentBalance,
      transaction_type: 'debit' as const,
      wallet_type: 'demo' as const,
      payment_type: 'demo_wallet' as const,
      reason,
      status: 'success' as const,
      created_at: new Date().toISOString()
    };
    
    const demoTransactions = userToModify.user_metadata?.demo_transactions || [];
    demoTransactions.unshift(newTxn);
    
    userToModify.user_metadata = {
      ...userToModify.user_metadata,
      demo_wallet_balance: newBalance,
      demo_transactions: demoTransactions
    };
    
    users[idx] = userToModify;
    auth.saveUsersList(users);
    
    setAdminUsers(users);
    setSelectedAdminUser(userToModify);
    setAdminCustomAmount('');
    alert(`Demo balance updated to ₹${newBalance} for ${userToModify.email}.`);
  };

  const getAllTransactions = () => {
    const list: any[] = [];
    adminUsers.forEach(u => {
      const realTxns = u.user_metadata?.real_transactions || [];
      const demoTxns = u.user_metadata?.demo_transactions || [];
      realTxns.forEach((t: any) => {
        list.push({ ...t, email: u.email, wallet_type: 'real' });
      });
      demoTxns.forEach((t: any) => {
        list.push({ ...t, email: u.email, wallet_type: 'demo' });
      });
    });
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // --- Rendering UI Panels ---

  const renderAdminFranchiseAgentTab = () => {
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
  };

  const renderAdminPanel = () => {
    const allUsersList = adminUsers;
    const transactionsList = getAllTransactions();
    
    // Calculate revenues: real payments vs demo payments
    const realRevenue = adminUsers
      .filter(u => u.user_metadata?.subscriptionStatus === 'active' && u.user_metadata?.subscription_source === 'real')
      .reduce((sum, u) => {
        const priceStr = u.user_metadata?.planPrice || '₹0';
        const priceVal = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
        return sum + priceVal;
      }, 0);

    const demoRevenue = adminUsers
      .filter(u => u.user_metadata?.subscriptionStatus === 'active' && u.user_metadata?.subscription_source === 'demo')
      .reduce((sum, u) => {
        const priceStr = u.user_metadata?.planPrice || '₹0';
        const priceVal = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
        return sum + priceVal;
      }, 0);

    return (
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
            <Trash2 className="w-4 h-4" /> Reset All Accounts
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

        {adminSubTab === 'franchise' && renderAdminFranchiseAgentTab()}

        {adminSubTab === 'directory' && (
          <>
            {/* Analytics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-600 font-bold block">Verified Real Revenue</span>
                <span className="text-2xl font-black text-emerald-700 block mt-1">₹{realRevenue.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-emerald-500 font-medium block mt-1">From real payment checkouts</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">Simulated Demo Volume</span>
                <span className="text-2xl font-black text-slate-700 block mt-1">₹{demoRevenue.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-slate-400 font-medium block mt-1">Tested using mock wallet credits</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Directory Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-4 h-4 text-slate-400" /> Users List ({allUsersList.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Filter</span>
                    <select
                      value={adminFilter}
                      onChange={(e) => setAdminFilter(e.target.value as any)}
                      className="text-[11px] px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-650 font-semibold outline-none"
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
                        <th className="p-3 text-right">Reset</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
                      {allUsersList
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
                              <td className="p-3 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleResetSelectedDemoUser(u)}
                                  className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:text-rose-500 hover:bg-rose-50 bg-transparent cursor-pointer transition-colors"
                                  title="Reset Account to Zero"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detail Operations Panel */}
              <div className="lg:col-span-5 space-y-4 w-full">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-slate-400" /> Ledger Controls &amp; Modifier
                </h3>

                {selectedAdminUser ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs animate-fadeIn">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-850 truncate max-w-[200px]">{selectedAdminUser.email}</div>
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
                          className="py-2.5 bg-rose-50 hover:bg-rose-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 transition-colors border-none cursor-pointer"
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
                              <div className="font-bold text-slate-750">{entry.reason}</div>
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
            </div>

            {/* Master Audit Log Table */}
            <div className="space-y-3 pt-3 border-t border-slate-150">
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
                      <th className="p-3 text-right">Time Log</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
                    {transactionsList.map((txn: any) => {
                      const isDebit = txn.amount < 0;
                      return (
                        <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-800">{txn.id}</td>
                          <td className="p-3 font-semibold text-slate-750">{txn.email}</td>
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
                          <td className="p-3 text-right text-slate-400 font-mono pr-4">
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
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative">
      <div className="noise fixed inset-0 pointer-events-none z-30 opacity-[0.015]" />
      
      {/* Top Navbar */}
      <nav className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 px-6 py-4 sticky top-0 z-40 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-650/10 border border-indigo-500/25">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-slate-100">Beduin Admin Center</h1>
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
          {renderAdminPanel()}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-[10px] text-slate-500 font-medium border-t border-slate-800 mt-12 bg-slate-950/40">
        © 2026 BEDUIN TOUR AND TRAVELS PVT LTD • Administrative Operations Interface • Built for Quality Assurance &amp; Business Testing
      </footer>
    </div>
  );
}
