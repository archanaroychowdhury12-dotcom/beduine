import { useState } from 'react';
import { AppUser, DemoTransactionRecord, SupabaseRawUser } from '@/types';
import { demoWalletService } from '@/services/demoWalletService';
import { auditLogService } from '@/services/auditLogService';
import { notify } from '@/services/uiFeedback';
import { getMockAuthAdmin } from './adminAuthAdapter';

type UseAdminWalletActionsParams = {
  user: AppUser | null;
  selectedAdminUser: SupabaseRawUser | null;
  setSelectedAdminUser: (user: SupabaseRawUser | null) => void;
  setAdminUsers: (users: SupabaseRawUser[]) => void;
};

export function useAdminWalletActions({ user, selectedAdminUser, setSelectedAdminUser, setAdminUsers }: UseAdminWalletActionsParams) {
  const [adminCustomAmount, setAdminCustomAmount] = useState<string>('');

  const handleAdminAddBalance = async () => {
    if (!selectedAdminUser) return;
    const amt = parseFloat(adminCustomAmount);
    if (isNaN(amt) || amt <= 0) {
      notify.info('Please enter a valid amount.');
      return;
    }
    const res = await demoWalletService.addDemoBalance(selectedAdminUser.id, amt, user);
    const auth = getMockAuthAdmin();
    if (res.success) {
      const updatedList = auth.getUsersList?.() || [];
      setAdminUsers(updatedList);
      setSelectedAdminUser(updatedList.find((u) => u.id === selectedAdminUser.id) || null);
      setAdminCustomAmount('');
    }
    notify.info(res.message);
  };

  const handleAdminRemoveBalance = async () => {
    if (!selectedAdminUser) return;
    const auth = getMockAuthAdmin();
    const users = auth.getUsersList?.() || [];
    const idx = users.findIndex((u) => u.id === selectedAdminUser.id);
    if (idx === -1) return;

    const userToModify = users[idx];
    const currentBalance = userToModify.user_metadata?.demo_wallet_balance ?? 0;
    const amt = parseFloat(adminCustomAmount);
    let newBalance = 0;
    let reason = 'Removed demo balance by admin';

    if (!isNaN(amt) && amt > 0) {
      newBalance = Math.max(0, currentBalance - amt);
      reason = `Deducted test balance: -₹${amt} by admin`;
    }

    const newTxn: DemoTransactionRecord = {
      id: `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: selectedAdminUser.id,
      amount: newBalance - currentBalance,
      transaction_type: 'debit',
      wallet_type: 'demo',
      payment_type: 'demo_wallet',
      reason,
      status: 'success',
      created_at: new Date().toISOString(),
    };

    const demoTransactions: DemoTransactionRecord[] = userToModify.user_metadata?.demo_transactions || [];
    demoTransactions.unshift(newTxn);
    userToModify.user_metadata = {
      ...userToModify.user_metadata,
      demo_wallet_balance: newBalance,
      demo_transactions: demoTransactions,
    };

    users[idx] = userToModify;
    auth.saveUsersList?.(users);
    setAdminUsers(users);
    setSelectedAdminUser(userToModify);
    setAdminCustomAmount('');
    auditLogService.logAdminAction({
      action: 'ADMIN_DEDUCT_DEMO_BALANCE',
      actor: user,
      targetId: userToModify.id,
      targetEmail: userToModify.email,
      amount: currentBalance - newBalance,
      reason,
      metadata: { balanceBefore: currentBalance, balanceAfter: newBalance, transactionId: newTxn.id },
    });
    notify.info(`Demo balance updated to ₹${newBalance} for ${userToModify.email}.`);
  };

  return {
    adminCustomAmount,
    setAdminCustomAmount,
    handleAdminAddBalance,
    handleAdminRemoveBalance,
  };
}
