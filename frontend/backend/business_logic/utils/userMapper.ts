import { AppUser, SavedPickupProfile, SavedTravelerProfile, SupabaseRawUser } from '../types';
import { getUserRole, isExplicitDemoUser } from '../services/accessControl';

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function mapSupabaseUser(supabaseUser: SupabaseRawUser): AppUser {
  const metadata = supabaseUser.user_metadata ?? {};
  const fullName =
    metadata.full_name ||
    metadata.name ||
    supabaseUser.email?.split('@')[0] ||
    'Traveler User';
  const email = supabaseUser.email || '';
  const mobile = supabaseUser.phone || metadata.phone || '';

  let dob = metadata.dob || '';
  let preferredLanguage = metadata.preferredLanguage || 'English';
  let dietaryPreferences = metadata.dietaryPreferences || 'None';
  const accessibilityRequirements = metadata.accessibilityRequirements || 'None';
  let savedTravelers = ensureArray<SavedTravelerProfile>(metadata.savedTravelers);
  let savedPickups = ensureArray<SavedPickupProfile>(metadata.savedPickups);

  // Demo seed profile defaults. Authorization is never inferred from email text.
  if (email.includes('arunasish')) {
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
  } else if (email.includes('rahul.sen')) {
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
  const planName = hasActiveRecord ? record?.planName ?? null : null;
  const planPrice = hasActiveRecord ? record?.planPrice ?? null : null;
  const planType = hasActiveRecord ? record?.planType ?? null : null;
  const subscriptionStatus = hasActiveRecord ? 'active' : 'inactive';
  const isDemoUser = isExplicitDemoUser({ user_metadata: metadata });
  const role = getUserRole({ user_metadata: metadata });

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

  const uid = String(metadata.uid || `BDU-${supabaseUser.id.slice(0, 8).toUpperCase()}`);

  return {
    id: supabaseUser.id,
    fullName: String(fullName),
    email,
    mobile: String(mobile),
    city: metadata.city || '',
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
