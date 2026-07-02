export type UserRole = 'admin' | 'customer';

export type RoleAwareUser = {
  id?: string;
  email?: string | null;
  role?: UserRole;
  is_demo_user?: boolean;
  user_metadata?: {
    role?: UserRole;
    is_demo_user?: boolean;
    [key: string]: unknown;
  };
  supabaseUser?: {
    user_metadata?: {
      role?: UserRole;
      is_demo_user?: boolean;
      [key: string]: unknown;
    };
  };
};

const VALID_ROLES: UserRole[] = ['admin', 'customer'];

export function normalizeRole(role: unknown): UserRole {
  return VALID_ROLES.includes(role as UserRole) ? (role as UserRole) : 'customer';
}

export function getUserRole(user?: RoleAwareUser | null): UserRole {
  return normalizeRole(user?.role ?? user?.user_metadata?.role ?? user?.supabaseUser?.user_metadata?.role);
}

export function isExplicitDemoUser(user?: RoleAwareUser | null): boolean {
  return Boolean(user?.is_demo_user ?? user?.user_metadata?.is_demo_user ?? user?.supabaseUser?.user_metadata?.is_demo_user);
}

export function canAccessAdmin(user?: RoleAwareUser | null): boolean {
  return getUserRole(user) === 'admin';
}

export function canAccessAgentPortal(user?: RoleAwareUser | null): boolean {
  return canAccessAdmin(user);
}

export function canUseDemoTools(user?: RoleAwareUser | null): boolean {
  return canAccessAdmin(user) || isExplicitDemoUser(user);
}
