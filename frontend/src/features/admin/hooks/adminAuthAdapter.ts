import { supabase } from '@/utils/supabaseClient';
import { SupabaseRawUser } from '@/types';

export type MockAuthAdmin = typeof supabase.auth & {
  getUsersList?: () => SupabaseRawUser[];
  saveUsersList?: (users: SupabaseRawUser[]) => void;
  resetAllAccounts?: () => void;
};

export function getMockAuthAdmin(): MockAuthAdmin {
  return supabase.auth as MockAuthAdmin;
}
