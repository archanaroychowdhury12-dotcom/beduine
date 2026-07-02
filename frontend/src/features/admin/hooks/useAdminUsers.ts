import { useEffect, useState } from 'react';
import { AppUser, SupabaseRawUser } from '@/types';
import { notify } from '@/services/uiFeedback';
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
    const demo = await import('./adminUsersDemo');
    setAdminUsers(demo.loadDemoAdminUsers());
  };

  useEffect(() => {
    void loadUsersList();
  }, [backend, mode]);

  const handleResetSelectedDemoUser = async (userToReset: SupabaseRawUser) => {
    if (mode === 'production') return;
    const demo = await import('./adminUsersDemo');
    const { result, users: updatedList } = await demo.resetSelectedDemoUser(userToReset, user);
    if (result.success) {
      setAdminUsers(updatedList);
      if (selectedAdminUser && selectedAdminUser.id === userToReset.id) {
        setSelectedAdminUser(updatedList.find((u) => u.id === userToReset.id) || null);
      }
      notify.info(`Demo user ${userToReset.email} reset successfully.`);
      return;
    }
    notify.info(result.message);
  };

  const handleResetAllDemoUsers = async () => {
    if (mode === 'production') return;
    const demo = await import('./adminUsersDemo');
    const { confirmed, users: updatedList } = await demo.resetAllDemoUsers(user);
    if (!confirmed) return;
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
