import { AppUser, ProfileRecord, SavedPickupProfile, SavedTravelerProfile, SubscriptionStatus, SupabaseRawUser } from '@/types';
import { supabase } from '@/utils/supabaseClient';

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadProfileRecord(userId: string, retries = 3, delayMs = 150): Promise<ProfileRecord | null> {
  let attempt = 0;

  while (true) {
    const { data, error } = await ((supabase
      .from('profiles')
      .select('id, uid, email, full_name, phone, city, role')
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

export interface SubscriptionRecord {
  plan_id: string;
  plan_name: string;
  plan_type: string;
  status: string;
}

export async function loadSubscriptionRecord(userId: string): Promise<SubscriptionRecord | null> {
  try {
    const { data, error } = await ((supabase
      .from('subscriptions')
      .select('plan_id, plan_name, plan_type, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle() as unknown) as Promise<{ data: SubscriptionRecord | null; error: { message: string } | null }>);

    if (error) {
      console.error('Failed to load subscription record:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Failed to load subscription record:', err);
    return null;
  }
}

export function mapSupabaseUser(
  supabaseUser: SupabaseRawUser,
  profile: ProfileRecord | null,
  subscription?: SubscriptionRecord | null
): AppUser {
  const metadata = supabaseUser.user_metadata ?? {};
  if (!profile) {
    throw new Error('Customer profile is not available');
  }

  const resolvedProfile = profile;
  const fullName =
    resolvedProfile.full_name ||
    metadata.full_name ||
    metadata.name ||
    supabaseUser.email?.split('@')[0] ||
    'Member';
  const email = supabaseUser.email || '';
  const mobile = resolvedProfile.phone || supabaseUser.phone || metadata.phone || '';
  let dob = metadata.dob || '';
  let preferredLanguage = metadata.preferredLanguage || 'English';
  let dietaryPreferences = metadata.dietaryPreferences || 'None';
  const accessibilityRequirements = metadata.accessibilityRequirements || 'None';
  let savedTravelers = ensureArray<SavedTravelerProfile>(metadata.savedTravelers);
  let savedPickups = ensureArray<SavedPickupProfile>(metadata.savedPickups);

  const record = metadata.subscription_payment_record;
  const hasActiveRecord = Boolean(record && record.transaction_id && record.payment_status === 'success');
  const planName = subscription ? subscription.plan_name : (hasActiveRecord ? (record?.planName ?? null) : (metadata.planName ?? null));
  const planPrice = subscription ? (subscription.plan_id.includes('gold') ? '₹799' : subscription.plan_id.includes('platinum') ? '₹1499' : '₹499') : (hasActiveRecord ? (record?.planPrice ?? null) : (metadata.planPrice ?? null));
  const planType = subscription ? (subscription.plan_type as 'domestic' | 'international') : ((hasActiveRecord ? (record?.planType ?? null) : (metadata.planType ?? null)) as 'domestic' | 'international' | null);
  const subscriptionStatus = (subscription ? subscription.status : (hasActiveRecord ? 'active' : (metadata.subscriptionStatus ?? 'inactive'))) as SubscriptionStatus;
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
    role,
    ledger: metadata.ledger || [],
    subscription_payment_record: record || null,
    subscription_source: hasActiveRecord ? record?.subscription_source || metadata.subscription_source || null : null,
    color,
    glow,
    drawToken: 'TRC-' + String(Math.floor(100000 + Math.random() * 900000)),
    dob: String(dob),
    preferredLanguage: String(preferredLanguage),
    dietaryPreferences: String(dietaryPreferences),
    accessibilityRequirements: String(accessibilityRequirements),
    savedTravelers,
    savedPickups,
    supabaseUser,
  };
}
