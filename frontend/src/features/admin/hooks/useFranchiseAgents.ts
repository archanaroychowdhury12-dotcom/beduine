import { useState } from 'react';
import type { FormEvent } from 'react';
import { Agent, AppUser, DemoTransactionRecord, Franchise, SupabaseRawUser } from '@/types';
import { INITIAL_FRANCHISES } from '@/features/admin/data/initialFranchises';
import { INITIAL_AGENTS } from '@/features/admin/data/initialAgents';
import { auditLogService } from '@/services/auditLogService';
import { confirmAction, notify } from '@/services/uiFeedback';
import { getMockAuthAdmin } from './adminAuthAdapter';

type UseFranchiseAgentsParams = {
  user: AppUser | null;
  setAdminUsers: (users: SupabaseRawUser[]) => void;
};

export function useFranchiseAgents({ user, setAdminUsers }: UseFranchiseAgentsParams) {
  const [franchises, setFranchises] = useState<Franchise[]>(INITIAL_FRANCHISES);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentFranchiseId, setNewAgentFranchiseId] = useState('FR-WB-01');
  const [newAgentEarningModel, setNewAgentEarningModel] = useState<'salary' | 'commission'>('salary');
  const [newAgentTarget, setNewAgentTarget] = useState('50');

  const handleAddAgent = (e: FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentEmail || !newAgentPhone) {
      notify.info('Please fill all fields');
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
    auditLogService.logAdminAction({
      action: 'ADMIN_CREATE_AGENT',
      actor: user,
      targetId: newAgent.id,
      targetEmail: newAgent.email,
      reason: `Registered agent ${newAgent.name}`,
      metadata: { franchiseId: newAgent.franchiseId, earningModel: newAgent.earningModel },
    });
    setFranchises(prev => prev.map(f => f.id === newAgentFranchiseId ? { ...f, agentCount: f.agentCount + 1 } : f));
    setNewAgentName('');
    setNewAgentEmail('');
    setNewAgentPhone('');
    notify.info('Agent registered successfully!');
  };

  const handleToggleEarningModel = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== agentId) return a;
      const nextModel = a.earningModel === 'salary' ? 'commission' : 'salary';
      auditLogService.logAdminAction({
        action: 'ADMIN_TOGGLE_AGENT_EARNING_MODEL',
        actor: user,
        targetId: a.id,
        targetEmail: a.email,
        reason: `Changed ${a.name} earning model to ${nextModel}`,
        metadata: { previousModel: a.earningModel, nextModel },
      });
      return {
        ...a,
        earningModel: nextModel,
        salary: nextModel === 'salary' ? 12000 : 0,
        accruedCommission: nextModel === 'commission' ? 1500 : 0,
      };
    }));
  };

  const handleReleasePayout = async (agent: Agent) => {
    const amountToPay = agent.earningModel === 'salary' ? agent.salary : agent.accruedCommission;
    if (amountToPay <= 0) {
      notify.info('No pending payout balance for this agent.');
      return;
    }

    const confirmRelease = await confirmAction({
      title: 'Release payout?',
      message: `Release ₹${amountToPay.toLocaleString('en-IN')} payout to Agent ${agent.name}?`,
      confirmLabel: 'Release payout',
    });
    if (!confirmRelease) return;

    const auth = getMockAuthAdmin();
    const users = auth.getUsersList?.() || [];
    let targetUser = users.find((u) => u.email === agent.email);
    if (!targetUser && users.length > 0) targetUser = users[0];

    if (targetUser) {
      const idx = users.findIndex((u) => u.id === targetUser?.id);
      if (idx !== -1) {
        const userToModify = users[idx];
        const newTxn: DemoTransactionRecord = {
          id: `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: targetUser.id,
          amount: -amountToPay,
          transaction_type: 'debit',
          wallet_type: 'demo',
          payment_type: 'demo_wallet',
          reason: `Agent Payout Released: ${agent.name} (${agent.earningModel === 'salary' ? 'Monthly Salary' : 'Accrued Commissions'})`,
          status: 'success',
          created_at: new Date().toISOString(),
        };
        const demoTransactions: DemoTransactionRecord[] = userToModify.user_metadata?.demo_transactions || [];
        demoTransactions.unshift(newTxn);
        userToModify.user_metadata = {
          ...userToModify.user_metadata,
          demo_transactions: demoTransactions,
          demo_wallet_balance: Math.max(0, (userToModify.user_metadata?.demo_wallet_balance ?? 0) - amountToPay),
        };
        users[idx] = userToModify;
        auth.saveUsersList?.(users);
        setAdminUsers(users);
      }
    }

    auditLogService.logAdminAction({
      action: 'ADMIN_RELEASE_AGENT_PAYOUT',
      actor: user,
      targetId: agent.id,
      targetEmail: agent.email,
      amount: amountToPay,
      reason: `Released ${agent.earningModel} payout to ${agent.name}`,
      metadata: { earningModel: agent.earningModel },
    });

    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, accruedCommission: 0, achievedRegistrations: 0 } : a));
    notify.info(`Payout of ₹${amountToPay.toLocaleString('en-IN')} successfully released to Agent ${agent.name}!`);
  };

  const handleUpdateAgentTarget = (agentId: string, newTargetVal: string) => {
    const num = parseInt(newTargetVal, 10);
    if (isNaN(num) || num <= 0) return;
    setAgents(prev => prev.map(a => {
      if (a.id !== agentId) return a;
      auditLogService.logAdminAction({
        action: 'ADMIN_UPDATE_AGENT_TARGET',
        actor: user,
        targetId: a.id,
        targetEmail: a.email,
        reason: `Updated target registrations for ${a.name} to ${num}`,
        metadata: { previousTarget: a.targetRegistrations, nextTarget: num },
      });
      return { ...a, targetRegistrations: num };
    }));
  };

  return {
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
  };
}
