import { createClient, type SupabaseClient, type User } from 'https://esm.sh/@supabase/supabase-js@2';
import { HttpError } from './http.ts';

export interface AuthenticatedProfile {
  id: string;
  uid: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  role: 'admin' | 'customer';
}

export interface AuthenticatedUserContext {
  user: User;
  profile: AuthenticatedProfile;
}

export function createAdminClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new HttpError(500, 'CONFIG_MISSING');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function requireUser(req: Request, admin: SupabaseClient): Promise<AuthenticatedUserContext> {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!token) throw new HttpError(401, 'AUTH_REQUIRED');

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, 'AUTH_INVALID');

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id,uid,email,full_name,phone,city,role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError) throw new HttpError(500, 'PROFILE_LOOKUP_FAILED');
  if (!profile) throw new HttpError(403, 'PROFILE_REQUIRED');
  if (profile.role !== 'customer') throw new HttpError(403, 'CUSTOMER_ONLY');

  return {
    user: data.user,
    profile: profile as AuthenticatedProfile,
  };
}
