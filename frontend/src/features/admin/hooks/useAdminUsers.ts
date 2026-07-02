import { useEffect, useState } from 'react';
import { AppUser, SupabaseRawUser } from '@/types';
import { demoWalletService } from '@/services/demoWalletService';
import { auditLogService } from '@/services/auditLogService';
import { confirmAction, notify } from '@/services/uiFeedback';
import { getMockAuthAdmin } from './adminAuthAdapter';
import { beduineBackend, type BeduineBackendAdapter } from '@/services/backend';

export type AdminFilter = 'all' | 'real' | 'demo';

export function useAdminUsers(
  user: AppUser | null,
  backend: Pick<BeduineBackendAdapter, 'listAdminUsers'> = beduineBackend,
  mode: 'demo' | 'production' = import.meta.env.VITE_BACKEND_MODE === 'production' ? 'production' : 'demo',
) {
  const [adminUsers, setAdminUsers] = useState<SupabaseRawUser[]>([]);
  const [selectedAdminUser, setSelectedAdminUser] = useState<SupabaseRawUser | null>(null);
  const [adminFilter, setAdminFilter] = useState<AdminFilter>('all');

  const loadUsersList = async () => {
    if (mode === 'production') {
      try {
        setAdminUsers(await backend.listAdminUsers());
      } catch (error) {
        notify.error(error instanceof Error ? error.message : 'Unable to load users.');
      }
      return;
    }
    const auth = getMockAuthAdmin();
    if (auth?.getUsersList) {
      setAdminUsers(auth.getUsersList());
    }
  };

  useEffect(() => {
    void loadUsersList();
  }, [backend, mode]);

  const handleResetSelectedDemoUser = async (userToReset: SupabaseRawUser) => {
    if (mode === 'production') return;
    const res = await demoWalletService.resetDemoAccount(userToReset.id, user);
    if (res.success) {
      const auth = getMockAuthAdmin();
      const updatedList = auth.getUsersList?.() || [];
      setAdminUsers(updatedList);
      if (selectedAdminUser && selectedAdminUser.id === userToReset.id) {
        setSelectedAdminUser(updatedList.find((u) => u.id === userToReset.id) || null);
      }
      notify.info(`Demo user ${userToReset.email} reset successfully.`);
      return;
    }
    notify.info(res.message);
  };

  const handleResetAllDemoUsers = async () => {
    if (mode === 'production') return;
    const confirmed = await confirmAction({
      title: 'Reset all accounts?',
      message: 'This will reset all user accounts to a zero-state.',
      confirmLabel: 'Reset all',
      danger: true,
    });
    if (!confirmed) return;
    const auth = getMockAuthAdmin();
    auth.resetAllAccounts?.();
    auditLogService.logAdminAction({
      action: 'ADMIN_RESET_ALL_ACCOUNTS',
      actor: user,
      reason: 'Reset all accounts to zero-state from admin panel',
    });
    const updatedList = auth.getUsersList?.() || [];
    setAdminUsers(updatedList);
    setSelectedAdminUser(null);
    notify.info('All user accounts have been reset to ₹0 balance, null plans, and zero-credits successfully.');
  };

  return {
    adminUsers,
    setAdminUsers,
    selectedAdminUser,
    setSelectedAdminUser,
    adminFilter,
    setAdminFilter,
    loadUsersList,
    handleResetSelectedDemoUser,
    handleResetAllDemoUsers,
  };
}
