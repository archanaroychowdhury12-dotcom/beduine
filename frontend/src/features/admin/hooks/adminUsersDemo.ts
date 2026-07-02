import type { AppUser, SupabaseRawUser } from '@/types';
import { demoWalletService } from '@/services/demoWalletService';
import { auditLogService } from '@/services/auditLogService';
import { confirmAction } from '@/services/uiFeedback';
import { getMockAuthAdmin } from './adminAuthAdapter';

export function loadDemoAdminUsers(): SupabaseRawUser[] {
  return getMockAuthAdmin().getUsersList?.() || [];
}

export async function resetSelectedDemoUser(
  target: SupabaseRawUser,
  actor: AppUser | null,
) {
  const result = await demoWalletService.resetDemoAccount(target.id, actor);
  return {
    result,
    users: result.success ? loadDemoAdminUsers() : [],
  };
}

export async function resetAllDemoUsers(actor: AppUser | null) {
  const confirmed = await confirmAction({
    title: 'Reset all accounts?',
    message: 'This will reset all user accounts to a zero-state.',
    confirmLabel: 'Reset all',
    danger: true,
  });
  if (!confirmed) return { confirmed: false, users: [] as SupabaseRawUser[] };

  const auth = getMockAuthAdmin();
  auth.resetAllAccounts?.();
  auditLogService.logAdminAction({
    action: 'ADMIN_RESET_ALL_ACCOUNTS',
    actor,
    reason: 'Reset all accounts to zero-state from admin panel',
  });
  return { confirmed: true, users: auth.getUsersList?.() || [] };
}
