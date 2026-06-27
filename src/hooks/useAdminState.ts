import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { demoWalletService } from '../services/demoWalletService';
import { Franchise, Agent } from '../types';

export function useAdminState() {
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

  const getRevenueStats = () => {
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

    return { realRevenue, demoRevenue };
  };

  return {
    adminUsers,
    setAdminUsers,
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
  };
}
