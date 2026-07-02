import { createClient } from '@supabase/supabase-js';
import { isExplicitDemoUser } from '@/services/accessControl';
import { isProductionBackendMode } from '@/config/productionEnv';
import { AppUser, ProfileRecord, SavedPickupProfile, SavedTravelerProfile, SupabaseRawUser } from '@/types';
import { isRealSupabaseConnected, supabase } from '@/utils/supabaseClient';

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

const PROFILE_UID_PATTERN = /^BDU-[0-9]{4}-[A-Z0-9]{6}-[0-9]{4}$/;

function isExplicitDemoModeEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true' && !isProductionBackendMode(import.meta.env);
}

function normalizeDemoSegment(value: string, length: number): string {
  const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return (sanitized + 'DEMO00').slice(0, length);
}

function buildDemoNumericSuffix(value: string): string {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) % 10000;
  }
  return String(hash).padStart(4, '0');
}

function buildDemoUid(supabaseUser: SupabaseRawUser): string {
  const metadataUid = supabaseUser.user_metadata?.uid;
  if (typeof metadataUid === 'string' && PROFILE_UID_PATTERN.test(metadataUid)) {
    return metadataUid;
  }

  const year = new Date().getFullYear();
  const seed = normalizeDemoSegment(supabaseUser.id, 6);
  const suffix = buildDemoNumericSuffix(supabaseUser.id);
  return `BDU-${year}-${seed}-${suffix}`;
}

function buildDemoProfile(supabaseUser: SupabaseRawUser): ProfileRecord {
  const metadata = supabaseUser.user_metadata ?? {};

  return {
    id: supabaseUser.id,
    uid: buildDemoUid(supabaseUser),
    email: supabaseUser.email || '',
    full_name: String(metadata.full_name || metadata.name || supabaseUser.email?.split('@')[0] || 'Member'),
    phone: String(supabaseUser.phone || metadata.phone || ''),
    city: String(metadata.city || ''),
    role: 'customer',
    is_demo_user: true,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadProfileRecord(userId: string, retries = 3, delayMs = 150): Promise<ProfileRecord | null> {
  if (!isRealSupabaseConnected) {
    return null;
  }

  const realSupabase = supabase as ReturnType<typeof createClient>;
  let attempt = 0;

  while (true) {
    const { data, error } = await ((realSupabase
      .from('profiles')
      .select('id, uid, email, full_name, phone, city, role, is_demo_user')
      .eq('id', userId)
      .maybeSingle() as unknown) as Promise<{ data: ProfileRecord | null; error: { message: string } | null }>);

    if (error) {
      throw new Error(`Failed to load customer profile: ${error.message}`);
    }

    if (data || attempt >= retries) {
      return data;
    }

    attempt += 1;
    await sleep(delayMs);
  }
}

export function mapSupabaseUser(supabaseUser: SupabaseRawUser, profile: ProfileRecord | null): AppUser {
  const metadata = supabaseUser.user_metadata ?? {};
  const canUseDemoProfile = isExplicitDemoModeEnabled() && isExplicitDemoUser({ user_metadata: metadata });
  if (!profile && !canUseDemoProfile) {
    throw new Error('Customer profile is not available');
  }

  const resolvedProfile = profile ?? buildDemoProfile(supabaseUser);
  const fullName =
    resolvedProfile.full_name ||
    metadata.full_name ||
    metadata.name ||
    supabaseUser.email?.split('@')[0] ||
    'Member';
  const email = supabaseUser.email || '';
  const mobile = resolvedProfile.phone || supabaseUser.phone || metadata.phone || '';
  const isDemoUser = Boolean(resolvedProfile.is_demo_user ?? isExplicitDemoUser({ user_metadata: metadata }));
  const shouldSeedDemoDefaults = isExplicitDemoModeEnabled() && isDemoUser;

  let dob = metadata.dob || '';
  let preferredLanguage = metadata.preferredLanguage || 'English';
  let dietaryPreferences = metadata.dietaryPreferences || 'None';
  const accessibilityRequirements = metadata.accessibilityRequirements || 'None';
  let savedTravelers = ensureArray<SavedTravelerProfile>(metadata.savedTravelers);
  let savedPickups = ensureArray<SavedPickupProfile>(metadata.savedPickups);

  // Demo seed profile defaults. Authorization is never inferred from email text.
  if (shouldSeedDemoDefaults && email.includes('arunasish')) {
    dob = dob || '1989-05-12';
    preferredLanguage = preferredLanguage || 'Bengali';
    dietaryPreferences = dietaryPreferences || 'Non-Vegetarian';
    if (savedTravelers.length === 0) {
      savedTravelers = [
        { id: 't-aru-1', firstName: 'Ankita', lastName: 'Roychowdhury', email: 'ankita.roy@gmail.com', phone: '+91 94330 54321', ageGroup: 'Adult', relationship: 'Spouse' },
        { id: 't-aru-2', firstName: 'Dilip', lastName: 'Roychowdhury', email: 'dilip.roy@gmail.com', phone: '+91 94330 98765', ageGroup: 'Senior', relationship: 'Father' },
      ];
    }
    if (savedPickups.length === 0) {
      savedPickups = [
        { id: 'p-aru-1', type: 'hotel', hotelName: 'ITC Royal Bengal, Kolkata', customAddress: '', label: 'ITC Royal Bengal (Saved)' },
        { id: 'p-aru-2', type: 'hotel', hotelName: 'Kolkata Airport Arrival Gate', customAddress: '', label: 'Kolkata Airport (Saved)' },
      ];
    }
  } else if (shouldSeedDemoDefaults && email.includes('rahul.sen')) {
    dob = dob || '1994-08-15';
    preferredLanguage = preferredLanguage || 'Bengali';
    dietaryPreferences = dietaryPreferences || 'Vegetarian';
    if (savedTravelers.length === 0) {
      savedTravelers = [
        { id: 't-rah-1', firstName: 'Priya', lastName: 'Sen', email: 'priya.sen@gmail.com', phone: '+91 98765 11111', ageGroup: 'Adult', relationship: 'Spouse' },
        { id: 't-rah-2', firstName: 'Rakesh', lastName: 'Sen', email: 'rakesh.sen@gmail.com', phone: '+91 98765 22222', ageGroup: 'Child', relationship: 'Son' },
      ];
    }
    if (savedPickups.length === 0) {
      savedPickups = [
        { id: 'p-rah-1', type: 'manual', hotelName: '', customAddress: 'Salt Lake Sector V, Block EP & GP, Kolkata', label: 'Salt Lake Office (Saved)' },
        { id: 'p-rah-2', type: 'hotel', hotelName: 'Srinagar Airport Gate 2', customAddress: '', label: 'Srinagar Airport (Saved)' },
      ];
    }
  }

  const record = metadata.subscription_payment_record;
  const hasActiveRecord = Boolean(record && record.transaction_id && record.payment_status === 'success');
  const planName = hasActiveRecord ? (record?.planName ?? null) : (metadata.planName ?? null);
  const planPrice = hasActiveRecord ? (record?.planPrice ?? null) : (metadata.planPrice ?? null);
  const planType = (hasActiveRecord ? (record?.planType ?? null) : (metadata.planType ?? null)) as 'domestic' | 'international' | null;
  const subscriptionStatus = (hasActiveRecord ? 'active' : (metadata.subscriptionStatus ?? 'inactive')) as any;
  const role = resolvedProfile.role;

  let color = 'from-slate-400 via-slate-500 to-slate-700';
  let glow = 'rgba(148, 163, 184, 0.4)';
  if (planName) {
    const pName = String(planName).toLowerCase();
    if (pName.includes('platinum')) {
      color = 'from-amber-400 via-yellow-500 to-amber-600';
      glow = 'rgba(245, 158, 11, 0.4)';
    } else if (pName.includes('gold')) {
      color = 'from-teal-400 via-emerald-500 to-emerald-600';
      glow = 'rgba(16, 185, 129, 0.4)';
    }
  }

  const uid = resolvedProfile.uid;

  return {
    id: supabaseUser.id,
    fullName: String(fullName),
    email,
    mobile: String(mobile),
    city: String(resolvedProfile.city || metadata.city || ''),
    memberId: uid,
    uid,
    planName,
    planPrice,
    planType,
    subscriptionStatus,
    real_wallet_balance: metadata.real_wallet_balance ?? 0,
    demo_wallet_balance: metadata.demo_wallet_balance ?? 0,
    is_demo_user: isDemoUser,
    role,
    ledger: metadata.ledger || [],
    demo_transactions: metadata.demo_transactions || [],
    subscription_payment_record: record || null,
    subscription_source: hasActiveRecord ? record?.subscription_source || metadata.subscription_source || null : null,
    color,
    glow,
    drawToken: `TRC-${Math.floor(100000 + Math.random() * 900000)}`,
    dob: String(dob),
    preferredLanguage: String(preferredLanguage),
    dietaryPreferences: String(dietaryPreferences),
    accessibilityRequirements: String(accessibilityRequirements),
    savedTravelers,
    savedPickups,
    supabaseUser,
  };
}
