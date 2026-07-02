# Beduine Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved Beduine customer and admin journeys with correct redirects, Supabase-backed production data, Razorpay verification, atomic draw and credit workflows, real bookings, cancellations, support tickets, and isolated demo mode.

**Architecture:** Keep the React 19/Vite frontend and Supabase backend. Extend the existing backend adapter, Postgres migrations, and Edge Functions, replacing production dummy/local data one vertical flow at a time. Razorpay Orders API is server-only; subscriptions and bookings are fulfilled only by an idempotent, signature-verified webhook transaction.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Vitest 4, Playwright 1.61, Supabase Auth/Postgres/RLS/Edge Functions, Deno Web APIs, Razorpay Standard Checkout.

## Global Constraints

- Production source of truth is `frontend/backend`.
- Allowed roles are exactly `admin` and `customer`.
- Canonical UID format is `BDU-YYYY-XXXXXX-NNNN`.
- New users receive `customer` on the server; browser metadata never grants admin access.
- Tour browsing and `/paid-tour#customize` are public; booking mutations and payments require login.
- `Join Now` and `BEDUINE CLUB` route through `/login?next=/landing`.
- Production mode does not import or execute dummy customers, mock payments, demo wallet data, local winner state, or local custom-tour storage.
- Razorpay amounts are integer currency subunits; server totals are authoritative.
- Fulfillment requires a captured, signature-verified, amount/currency-matched provider event.
- Duplicate webhooks, participation, draw finalization, reveal, and credit issuance are idempotent.
- Provider secrets remain in Supabase secrets.

## File Map

- `frontend/src/utils/appRoutes.ts`: route constants and safe redirect policy.
- `frontend/src/services/backend/backendContracts.ts`: typed frontend/backend contract.
- `frontend/src/services/backend/supabaseBackendAdapter.ts`: Edge Function client.
- `frontend/backend/supabase/migrations/006_identity_catalog_booking.sql`: identity, catalog, and booking schema.
- `frontend/backend/supabase/migrations/007_atomic_customer_workflows.sql`: payment, participation, credit, and booking RPCs.
- `frontend/backend/supabase/migrations/008_admin_support_refund_workflows.sql`: admin, support, cancellation, and refund RPCs.
- `frontend/backend/supabase/functions/_shared`: shared authentication, HTTP, and Razorpay helpers.
- `frontend/backend/supabase/functions/*`: thin authenticated transport wrappers over database workflows.

## Canonical Interfaces

```ts
export type AppRole = 'admin' | 'customer';
export type TripCategory = 'domestic' | 'international';
export type PlanTier = 'silver' | 'gold' | 'platinum';
export type DrawRoundKey = `${TripCategory}_${PlanTier}`;

export interface CustomerProfileSummary {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: 'customer';
}

export interface CustomerSubscriptionSummary {
  id: string;
  planId: string;
  planName: string;
  category: TripCategory;
  tier: PlanTier;
  status: 'inactive' | 'active' | 'refunded' | 'chargeback';
  activatedAt?: string;
  expiresAt?: string;
}

export interface DiscountCreditUnit {
  id: string;
  category: TripCategory;
  value: number;
  status: 'available' | 'reserved' | 'redeemed' | 'expired';
  expiresAt?: string;
}

export interface CustomerDrawEntry {
  cycleId: string;
  ticketId: string;
  roundKey: DrawRoundKey;
  status: 'active' | 'frozen' | 'winner' | 'non_winner' | 'not_eligible';
}

export interface CustomerWinnerBenefit {
  id: string;
  cycleId: string;
  coupon: string;
  value: number;
  destination?: string;
  batch?: string;
  status: 'issued' | 'assigned' | 'used' | 'cancelled';
}

export interface CustomerBookingSummary {
  id: string;
  tourName: string;
  category: TripCategory;
  departureAt: string;
  finalTotal: number;
  amountPaid: number;
  status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled';
}

export interface CustomerPaymentSummary {
  id: string;
  purpose: 'subscription' | 'tour_booking' | 'installment';
  amount: number;
  status: 'created' | 'pending' | 'verified' | 'failed' | 'refunded';
  createdAt: string;
}

export interface CustomerSupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'waiting_customer' | 'closed';
  updatedAt: string;
}

export interface PaymentOrderResponse {
  sessionId: string;
  keyId: string;
  orderId: string;
  amountPaise: number;
  currency: 'INR';
  description: string;
}

export interface PaymentStatusResponse {
  sessionId: string;
  status: 'pending' | 'verified' | 'failed' | 'refunded' | 'chargeback';
  subscriptionId?: string;
  bookingId?: string;
}

export interface ParticipationResponse {
  cycleId: string;
  ticketId: string;
  roundKey: DrawRoundKey;
  freezeAtIso: string;
}

export interface CreditIssuanceResponse {
  cycleId: string;
  issuedUsers: number;
  issuedUnits: number;
  duplicate: boolean;
}

export interface BookingTravelerInput {
  travelerKey: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
}

export interface BookingPickupInput {
  location: string;
  address: string;
  contactName: string;
  contactPhone: string;
}

export interface TourBookingDraftResponse {
  bookingId: string;
  grossTourTotal: number;
  totalDiscount: number;
  finalTourTotal: number;
  instantBookingCharge: number;
  amountDueNow: number;
  installments: Array<{
    sequence: number;
    percentage: number;
    amount: number;
    dueAt?: string;
    status: 'pay_now' | 'upcoming' | 'paid';
  }>;
  reservedCreditUnitIds: string[];
}
```

---

### Task 1: Canonical Routes And Redirect Guards

**Files:**
- Create: `frontend/src/utils/appRoutes.ts`
- Modify: `frontend/src/utils/routeAccess.ts`
- Modify: `frontend/src/App.tsx`
- Create: `frontend/src/pages/PublicWinnersPage.tsx`
- Modify: `frontend/Beduine_Landing-Page/index.html`
- Modify: `frontend/tests/utils/routeAccess.test.ts`
- Modify: `frontend/tests/landingStaticLinks.test.ts`
- Modify: `frontend/e2e/app-smoke.spec.ts`

**Interfaces:**
- Produces: `APP_ROUTES`, `normalizeNextPath()`, `buildLoginRedirect()`.
- Consumes: existing `AppView` values and Supabase auth-ready state.

- [ ] **Step 1: Write failing route tests**

```ts
import { describe, expect, it } from 'vitest';
import {
  buildLoginRedirect,
  getPostAuthView,
  getProtectedRouteRedirect,
} from '@/utils/appRoutes';

describe('production route policy', () => {
  it('protects club, registration, dashboard, and checkout', () => {
    for (const view of [
      'landing',
      'register',
      'dashboard',
      'checkout/subscription',
      'checkout/tour',
    ]) {
      expect(getProtectedRouteRedirect(view, false)).toEqual({
        view: 'login',
        nextPath: `/${view}`,
      });
    }
  });

  it('rejects external and protocol-relative next paths', () => {
    expect(getPostAuthView('/landing')).toBe('landing');
    expect(getPostAuthView('/paid-tour?tour=digha')).toBe('paid-tour');
    expect(getPostAuthView('https://evil.example')).toBe('dashboard');
    expect(getPostAuthView('//evil.example')).toBe('dashboard');
  });

  it('encodes the login destination', () => {
    expect(buildLoginRedirect('/paid-tour?tour=digha')).toBe(
      '/login?next=%2Fpaid-tour%3Ftour%3Ddigha',
    );
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- tests/utils/routeAccess.test.ts tests/landingStaticLinks.test.ts`

Working directory: `frontend`

Expected: FAIL because `appRoutes.ts` and complete protected-view policy do not exist.

- [ ] **Step 3: Implement the route policy**

```ts
export const APP_ROUTES = {
  home: '/',
  club: '/landing',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  paidTour: '/paid-tour',
  adminLogin: '/admin-login',
  admin: '/admin',
  subscriptionCheckout: '/checkout/subscription',
  tourCheckout: '/checkout/tour',
} as const;

const allowedNextPaths = new Set([
  APP_ROUTES.club,
  APP_ROUTES.register,
  APP_ROUTES.dashboard,
  APP_ROUTES.paidTour,
  APP_ROUTES.subscriptionCheckout,
  APP_ROUTES.tourCheckout,
]);

export function normalizeNextPath(value: string | null): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  const pathname = value.split(/[?#]/)[0];
  return allowedNextPaths.has(pathname as never) ? value : null;
}

export function buildLoginRedirect(nextPath: string): string {
  const safe = normalizeNextPath(nextPath) || APP_ROUTES.dashboard;
  return `${APP_ROUTES.login}?next=${encodeURIComponent(safe)}`;
}
```

`App.tsx` must protect `/landing`, `/register`, `/dashboard`, and both checkout routes.
Only `normalizeNextPath()` output may be consumed after login.
It must also recognize `/winners` as a public route and render
`PublicWinnersPage` with a loading state and an empty published-results state.

- [ ] **Step 4: Update landing navigation and CTA links**

```html
<a href="#home">Home</a>
<a href="/paid-tour">Tours</a>
<a href="/paid-tour#destinations">Destinations</a>
<a href="/winners">Winners</a>
<a href="/login?next=/landing">BEDUINE CLUB</a>
<a href="#location">Contact</a>
```

Every Join CTA uses `/login?next=/landing`; every Customize CTA uses
`/paid-tour#customize`.

- [ ] **Step 5: Fix and extend Playwright routes**

```ts
test('login fields appear after the welcome choice', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Log In to Your Account' }).click();
  await expect(page.locator('#loginEmail')).toBeVisible();
  await expect(page.locator('#loginPassword')).toBeVisible();
});

test('club is protected and paid tours are public', async ({ page }) => {
  await page.goto('/landing');
  await expect(page).toHaveURL(/\/login\?next=%2Flanding$/);
  await page.goto('/paid-tour#customize');
  await expect(page).toHaveURL(/\/paid-tour#customize$/);
});
```

- [ ] **Step 6: Verify and commit**

Run: `npm test -- tests/utils/routeAccess.test.ts tests/landingStaticLinks.test.ts`

Expected: PASS.

Run: `npm run e2e -- --grep "login fields|club is protected|paid tours"`

Expected: PASS.

```bash
git add frontend/src/utils/appRoutes.ts frontend/src/utils/routeAccess.ts frontend/src/App.tsx frontend/Beduine_Landing-Page/index.html frontend/tests/utils/routeAccess.test.ts frontend/tests/landingStaticLinks.test.ts frontend/e2e/app-smoke.spec.ts
git commit -m "fix: enforce Beduine route and redirect policy"
```

### Task 2: Server-Owned Profiles, Roles, And UID

**Files:**
- Create: `frontend/backend/supabase/migrations/006_identity_catalog_booking.sql`
- Modify: `frontend/src/LoginPage.tsx`
- Modify: `frontend/src/RegistrationPage.tsx`
- Modify: `frontend/src/utils/userMapper.ts`
- Create: `frontend/tests/utils/userMapper.test.ts`
- Modify: `frontend/tests/services/accessControl.test.ts`

**Interfaces:**
- Produces: immutable profile UID and `mapSupabaseUser(user, profile)`.
- Consumes: Supabase Auth user and `public.profiles`.

- [ ] **Step 1: Write failing identity tests**

```ts
it('uses server UID and server role', () => {
  const result = mapSupabaseUser(
    { id: 'auth-1', email: 'rahul@example.com', user_metadata: { role: 'admin' } },
    { uid: 'BDU-2026-RHLSEN-4821', role: 'customer', full_name: 'Rahul Sen' },
  );
  expect(result.uid).toBe('BDU-2026-RHLSEN-4821');
  expect(result.role).toBe('customer');
});

it('does not manufacture a production UID', () => {
  expect(() => mapSupabaseUser(
    { id: 'auth-1', email: 'rahul@example.com', user_metadata: {} },
    null,
  )).toThrow('Customer profile is not available');
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/utils/userMapper.test.ts tests/services/accessControl.test.ts`

Expected: FAIL because the current mapper trusts metadata and creates fallback UIDs.

- [ ] **Step 3: Add server UID/profile creation**

```sql
create or replace function public.generate_beduine_uid()
returns text
language plpgsql
as $$
declare
  v_year text := to_char(now() at time zone 'Asia/Kolkata', 'YYYY');
begin
  return 'BDU-' || v_year || '-' ||
    upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 6)) || '-' ||
    lpad((floor(random() * 10000))::int::text, 4, '0');
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, uid, email, full_name, phone, city, role)
  values (
    new.id,
    public.generate_beduine_uid(),
    new.email,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'city', ''),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
```

Add `profiles_uid_format` with
`uid ~ '^BDU-[0-9]{4}-[A-Z0-9]{6}-[0-9]{4}$'`. Customers may update profile fields but
not `uid` or `role`.

- [ ] **Step 4: Remove client identity generation**

Delete the `BDN-*` receipt ID and hardcoded `beduine123` fallback. Account creation in
`LoginPage.tsx` collects name, email, mobile, password, and city. `RegistrationPage.tsx`
only completes profile and plan intent.

```ts
export function mapSupabaseUser(
  user: SupabaseRawUser,
  profile: ProfileRecord | null,
): AppUser {
  if (!profile && isProductionBackendMode(import.meta.env)) {
    throw new Error('Customer profile is not available');
  }
  const resolved = profile ?? buildDemoProfile(user);
  return {
    id: user.id,
    email: user.email || '',
    fullName: resolved.full_name || user.email?.split('@')[0] || 'Member',
    mobile: resolved.phone || '',
    city: resolved.city || '',
    uid: resolved.uid,
    memberId: resolved.uid,
    role: resolved.role,
    supabaseUser: user,
  };
}
```

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/utils/userMapper.test.ts tests/services/accessControl.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

```bash
git add frontend/backend/supabase/migrations/006_identity_catalog_booking.sql frontend/src/LoginPage.tsx frontend/src/RegistrationPage.tsx frontend/src/utils/userMapper.ts frontend/tests/utils/userMapper.test.ts frontend/tests/services/accessControl.test.ts
git commit -m "feat: make profiles roles and UIDs server owned"
```

### Task 3: Customer Dashboard Backend Contract

**Files:**
- Create: `frontend/backend/supabase/functions/_shared/auth.ts`
- Create: `frontend/backend/supabase/functions/_shared/http.ts`
- Create: `frontend/backend/supabase/functions/customer-dashboard/index.ts`
- Modify: `frontend/src/services/backend/backendContracts.ts`
- Modify: `frontend/src/services/backend/backendAdapter.ts`
- Modify: `frontend/src/services/backend/supabaseBackendAdapter.ts`
- Modify: `frontend/src/services/backend/demoBackendAdapter.ts`
- Create: `frontend/src/features/dashboard/hooks/useCustomerDashboard.ts`
- Create: `frontend/tests/services/customerDashboardContract.test.ts`

**Interfaces:**
- Produces: `CustomerDashboardResponse` and `getCustomerDashboard()`.
- Consumes: authenticated access token and customer-owned database rows.

- [ ] **Step 1: Add failing contract test**

```ts
const model: CustomerDashboardResponse = {
  profile: { uid: 'BDU-2026-RHLSEN-4821', fullName: 'Rahul Sen', role: 'customer' },
  subscription: null,
  trc: { available: 0, locked: 0, history: [] },
  discountCredits: { availableUnits: [], history: [] },
  drawEntries: [],
  winnerBenefits: [],
  bookings: [],
  payments: [],
  supportTickets: [],
};

expect(model.profile.role).toBe('customer');
expect(model.bookings).toEqual([]);
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/services/customerDashboardContract.test.ts`

Expected: FAIL because the response and adapter method are absent.

- [ ] **Step 3: Define the typed response**

```ts
export interface CustomerDashboardResponse {
  profile: CustomerProfileSummary;
  subscription: CustomerSubscriptionSummary | null;
  trc: { available: number; locked: number; history: CreditLedgerEntry[] };
  discountCredits: { availableUnits: DiscountCreditUnit[]; history: CreditLedgerEntry[] };
  drawEntries: CustomerDrawEntry[];
  winnerBenefits: CustomerWinnerBenefit[];
  bookings: CustomerBookingSummary[];
  payments: CustomerPaymentSummary[];
  supportTickets: CustomerSupportTicket[];
}
```

Add `getCustomerDashboard(): Promise<CustomerDashboardResponse>` to both adapters.

- [ ] **Step 4: Implement server authentication**

```ts
export async function requireUser(req: Request, admin: SupabaseClient) {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new HttpError(401, 'AUTH_REQUIRED');
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, 'AUTH_INVALID');
  const { data: profile } = await admin
    .from('profiles')
    .select('id,uid,email,full_name,phone,city,role')
    .eq('id', data.user.id)
    .single();
  if (!profile) throw new HttpError(403, 'PROFILE_REQUIRED');
  return { user: data.user, profile };
}
```

`customer-dashboard` returns only authenticated customer rows and empty arrays for new
accounts.

- [ ] **Step 5: Implement the frontend hook**

```ts
export function useCustomerDashboard(enabled: boolean) {
  const [state, setState] = useState<DashboardState>({ loading: enabled });
  const refresh = useCallback(async () => {
    if (!enabled) return;
    setState({ loading: true });
    try {
      setState({ loading: false, data: await beduineBackend.getCustomerDashboard() });
    } catch (error) {
      setState({ loading: false, error: toError(error) });
    }
  }, [enabled]);
  useEffect(() => { void refresh(); }, [refresh]);
  return { ...state, refresh };
}
```

- [ ] **Step 6: Verify and commit**

Run: `npm test -- tests/services/customerDashboardContract.test.ts tests/services/backendContracts.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

```bash
git add frontend/backend/supabase/functions/_shared frontend/backend/supabase/functions/customer-dashboard frontend/src/services/backend frontend/src/features/dashboard/hooks/useCustomerDashboard.ts frontend/tests/services/customerDashboardContract.test.ts
git commit -m "feat: add customer dashboard production contract"
```

### Task 4: Server-Side Razorpay Orders

**Files:**
- Create: `frontend/backend/business_logic/payment/razorpayOrder.service.ts`
- Create: `frontend/backend/tests/razorpayOrder.test.ts`
- Create: `frontend/backend/supabase/functions/_shared/razorpay.ts`
- Create: `frontend/backend/supabase/functions/create-payment-order/index.ts`
- Modify: `frontend/src/services/backend/backendContracts.ts`
- Modify: `frontend/src/services/backend/backendAdapter.ts`
- Modify: `frontend/src/services/backend/supabaseBackendAdapter.ts`

**Interfaces:**
- Produces: `PaymentOrderResponse` and `createPaymentOrder(input)`.
- Consumes: server plan/booking totals and Razorpay server secrets.

- [ ] **Step 1: Write failing order tests**

```ts
it('converts authoritative INR to paise and ignores client amount', () => {
  expect(buildRazorpayOrder({
    purpose: 'subscription',
    referenceId: 'gold',
    authoritativeAmountRupees: 799,
    clientAmountRupees: 1,
  })).toMatchObject({ amount: 79900, currency: 'INR' });
});

it('limits the receipt to 40 characters', () => {
  expect(buildRazorpayOrder({
    purpose: 'tour_booking',
    referenceId: 'BOOKING-ID-WITH-A-LONG-SUFFIX-1234567890',
    authoritativeAmountRupees: 4750,
  }).receipt.length).toBeLessThanOrEqual(40);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- razorpayOrder.test.ts`

Working directory: `frontend/backend`

Expected: FAIL because `buildRazorpayOrder()` is absent.

- [ ] **Step 3: Implement order construction**

```ts
export function buildRazorpayOrder(input: RazorpayOrderInput): RazorpayOrderRequest {
  if (!Number.isSafeInteger(input.authoritativeAmountRupees) ||
      input.authoritativeAmountRupees <= 0) {
    throw new Error('Authoritative amount must be a positive integer INR value.');
  }
  return {
    amount: input.authoritativeAmountRupees * 100,
    currency: 'INR',
    receipt: `${input.purpose}-${input.referenceId}`.slice(0, 40),
    notes: { purpose: input.purpose, referenceId: input.referenceId },
  };
}
```

- [ ] **Step 4: Implement server-only provider call**

```ts
export async function createRazorpayOrder(request: RazorpayOrderRequest) {
  const keyId = requireEnv('RAZORPAY_KEY_ID');
  const keySecret = requireEnv('RAZORPAY_KEY_SECRET');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new HttpError(502, 'PAYMENT_PROVIDER_ORDER_FAILED');
  return response.json() as Promise<RazorpayOrder>;
}
```

The Edge Function authenticates the customer, resolves the plan/booking amount, inserts a
pending payment session, creates the order, then stores the provider order ID.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- razorpayOrder.test.ts providerCredentialReadiness.test.ts`

Working directory: `frontend/backend`

Expected: PASS.

```bash
git add frontend/backend/business_logic/payment/razorpayOrder.service.ts frontend/backend/tests/razorpayOrder.test.ts frontend/backend/supabase/functions/_shared/razorpay.ts frontend/backend/supabase/functions/create-payment-order frontend/src/services/backend
git commit -m "feat: create authoritative Razorpay orders"
```

### Task 5: Razorpay Checkout And Subscription Fulfillment

**Files:**
- Create: `frontend/src/services/payment/razorpayCheckout.ts`
- Create: `frontend/tests/services/razorpayCheckout.test.ts`
- Modify: `frontend/backend/supabase/functions/payment-webhook/index.ts`
- Create: `frontend/backend/supabase/functions/payment-status/index.ts`
- Modify: `frontend/src/services/payment/paymentGateway.ts`
- Modify: `frontend/src/features/dashboard/hooks/useDashboardSubscription.ts`

**Interfaces:**
- Produces: `openRazorpayCheckout()` and `getPaymentStatus(sessionId)`.
- Consumes: Task 4 order and existing atomic payment RPC.

- [ ] **Step 1: Add failing checkout test**

```ts
it('opens checkout with server order values', async () => {
  const open = vi.fn();
  window.Razorpay = vi.fn(() => ({ open })) as never;
  await openRazorpayCheckout({
    keyId: 'rzp_test_public',
    orderId: 'order_123',
    sessionId: 'session_123',
    amountPaise: 79900,
    currency: 'INR',
    description: 'Gold Domestic',
  }, {
    name: 'Rahul Sen',
    email: 'rahul@example.com',
    contact: '+919876543210',
  });
  expect(open).toHaveBeenCalledOnce();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/services/razorpayCheckout.test.ts`

Expected: FAIL because production checkout is absent.

- [ ] **Step 3: Implement checkout without client fulfillment**

```ts
export async function openRazorpayCheckout(
  order: PaymentOrderResponse,
  customer: CheckoutCustomer,
): Promise<{ sessionId: string }> {
  await loadScriptOnce('https://checkout.razorpay.com/v1/checkout.js');
  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amountPaise,
      currency: order.currency,
      name: 'Beduine Tour and Travels',
      description: order.description,
      prefill: customer,
      handler: () => resolve({ sessionId: order.sessionId }),
      modal: { ondismiss: () => reject(new Error('PAYMENT_CANCELLED')) },
    });
    checkout.open();
  });
}
```

- [ ] **Step 4: Harden webhook and polling**

The webhook verifies the unparsed body with `X-Razorpay-Signature`, maps only captured
payments to verified, and calls `process_verified_subscription_payment_v1`. A duplicate
event returns HTTP 200 with the prior result. `payment-status` returns pending, verified,
failed, refunded, or chargeback for the authenticated owner.

Production `paymentGateway.ts` selects Razorpay; demo selects mock:

```ts
export function getPaymentGateway(): PaymentGatewayAdapter {
  return import.meta.env.VITE_BACKEND_MODE === 'demo'
    ? mockPaymentGateway
    : razorpayPaymentGateway;
}
```

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/services/razorpayCheckout.test.ts tests/config/productionEnv.test.ts`

Expected: PASS.

Run: `npm test`

Working directory: `frontend/backend`

Expected: all tests PASS.

```bash
git add frontend/src/services/payment frontend/src/features/dashboard/hooks/useDashboardSubscription.ts frontend/tests/services/razorpayCheckout.test.ts frontend/backend/supabase/functions/payment-webhook frontend/backend/supabase/functions/payment-status
git commit -m "feat: fulfill subscriptions through Razorpay webhooks"
```

### Task 6: Atomic TRC Participation

**Files:**
- Create: `frontend/backend/business_logic/weeklyDraw/participation.service.ts`
- Create: `frontend/backend/tests/participation.test.ts`
- Create: `frontend/backend/supabase/migrations/007_atomic_customer_workflows.sql`
- Create: `frontend/backend/supabase/functions/participate-weekly-draw/index.ts`
- Modify: `frontend/src/services/backend/backendContracts.ts`
- Modify: `frontend/src/services/backend/backendAdapter.ts`
- Modify: `frontend/src/services/backend/supabaseBackendAdapter.ts`
- Modify: `frontend/src/features/dashboard/modern/pages/LuckyDraw.tsx`

**Interfaces:**
- Produces: `participateInWeeklyDraw(): Promise<ParticipationResponse>`.
- Consumes: active subscription, available TRC, and open Sunday cycle.

- [ ] **Step 1: Write failing participation tests**

```ts
it('locks one TRC and creates one ticket', async () => {
  const result = await participate(repository, {
    userId: 'user-1',
    now: new Date('2026-07-05T11:00:00.000Z'),
  });
  expect(result.ticketId).toMatch(/^TRC-SUN-[0-9]{5}$/);
  expect(repository.lockedTrcIds).toHaveLength(1);
  expect(repository.entries).toHaveLength(1);
});

it('rejects duplicate participation in one cycle', async () => {
  await participate(repository, input);
  await expect(participate(repository, input)).rejects.toThrow(
    'ALREADY_PARTICIPATING',
  );
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- participation.test.ts`

Working directory: `frontend/backend`

Expected: FAIL because participation service is absent.

- [ ] **Step 3: Implement the atomic RPC**

`participate_weekly_draw_v1(p_user_id uuid, p_now timestamptz)`:

```sql
create unique index if not exists weekly_draw_entries_user_cycle_unique
  on public.weekly_draw_entries(cycle_id, user_id);

-- The function runs as SECURITY DEFINER with search_path = public.
-- It resolves the current IST cycle, locks an available TRC row FOR UPDATE,
-- verifies the active subscription, inserts one entry, marks the TRC locked,
-- writes an audit event, and returns cycle_id plus ticket_id.
```

The RPC must use a sequence-backed ticket suffix, not `random()`, so concurrent requests
cannot collide.

- [ ] **Step 4: Add Edge Function and dashboard action**

The function ignores any body user ID:

```ts
const { user } = await requireUser(req, admin);
const { data, error } = await admin.rpc('participate_weekly_draw_v1', {
  p_user_id: user.id,
  p_now: new Date().toISOString(),
});
if (error) throw mapPostgresError(error);
return json(data);
```

The dashboard button displays loading, ticket success, already-participating, no-TRC,
and subscription-inactive states.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- participation.test.ts weeklyDrawSchedule.test.ts`

Working directory: `frontend/backend`

Expected: PASS.

Run: `npm test -- tests/services/backendContracts.test.ts`

Working directory: `frontend`

Expected: PASS.

```bash
git add frontend/backend/business_logic/weeklyDraw/participation.service.ts frontend/backend/tests/participation.test.ts frontend/backend/supabase/migrations/007_atomic_customer_workflows.sql frontend/backend/supabase/functions/participate-weekly-draw frontend/src/services/backend frontend/src/features/dashboard/modern/pages/LuckyDraw.tsx
git commit -m "feat: add atomic Sunday draw participation"
```

### Task 7: Plan-Round Draw, Reveal, And Non-Winner Credits

**Files:**
- Modify: `frontend/backend/supabase/migrations/005_weekly_draw_plan_rounds.sql`
- Modify: `frontend/backend/supabase/functions/run-weekly-draw/index.ts`
- Modify: `frontend/backend/supabase/functions/weekly-draw-status/index.ts`
- Modify: `frontend/backend/supabase/functions/reveal-next-winner/index.ts`
- Create: `frontend/backend/supabase/functions/issue-non-winner-credits/index.ts`
- Create: `frontend/backend/supabase/functions/public-winners/index.ts`
- Modify: `frontend/backend/tests/weeklyDraw.test.ts`
- Modify: `frontend/backend/tests/winnerReveal.test.ts`
- Modify: `frontend/backend/tests/nonWinnerCreditService.test.ts`
- Modify: `frontend/src/features/admin/AdminPage.tsx`
- Modify: `frontend/src/pages/PublicWinnersPage.tsx`
- Create: `frontend/tests/pages/publicWinners.test.tsx`

**Interfaces:**
- Produces: canonical underscore round keys and idempotent non-winner issuance.
- Consumes: frozen verified draw entries and server-verified admin.

- [ ] **Step 1: Add failing consistency and issuance tests**

```ts
it('uses underscore round keys', () => {
  expect(normalizeDrawRound('Domestic Gold')).toBe('domestic_gold');
  expect(normalizeDrawRound('International Platinum'))
    .toBe('international_platinum');
});

it('issues Gold non-winner credits once', async () => {
  expect((await issueNonWinnerCredits(repository, cycleInput)).issuedUnits).toBe(2);
  expect((await issueNonWinnerCredits(repository, cycleInput)).issuedUnits).toBe(0);
});

it('returns only published winner fields', async () => {
  const result = await listPublicWinners(repository);
  expect(result[0]).toEqual({
    name: 'Rahul Sen',
    uid: 'BDU-2026-RHLSEN-4821',
    ticketId: 'TRC-SUN-00091',
    roundKey: 'domestic_gold',
    coupon: 'BEDWIN-2026-4821',
  });
  expect(result[0]).not.toHaveProperty('email');
  expect(result[0]).not.toHaveProperty('phone');
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- weeklyDraw.test.ts winnerReveal.test.ts nonWinnerCreditService.test.ts`

Working directory: `frontend/backend`

Expected: FAIL on current colon/underscore mismatch or absent persistent issuance.

- [ ] **Step 3: Normalize database round keys**

```sql
create or replace function public.beduine_draw_round_key(
  p_plan text,
  p_category text default null,
  p_tier text default null
)
returns text
language sql
immutable
as $$
  select public.beduine_draw_plan_category(p_plan, p_category) || '_' ||
         public.beduine_draw_plan_tier(p_plan, p_tier);
$$;
```

Backfill draft/frozen entries, then constrain the key to the six approved values.

- [ ] **Step 4: Add idempotent non-winner issuance**

Add unique `(cycle_id, user_id, sequence_no)` Discount Credit units. The RPC rejects
winners, derives unit count/value from category and tier, inserts ledger/audit rows, and
sets `non_winner_credits_issued_at` only after all units are inserted.

Add `winner_benefits` and `winner_tour_batches`. Finalization creates one winner benefit
per winning entry. Admin assignment records the quarterly batch, destination, benefit
value, and travel status. A unique `(cycle_id, user_id)` constraint blocks duplicate
winner benefits.

- [ ] **Step 5: Replace local admin draw operations**

Admin calls:

```ts
getWeeklyDrawStatus(): Promise<WeeklyDrawStatusResponse>;
revealNextWinner(cycleId: string): Promise<RevealedWinnerResponse>;
issueNonWinnerCredits(cycleId: string): Promise<CreditIssuanceResponse>;
```

Production UI removes local participant generation, winner randomization, and
localStorage result persistence.

`public-winners` requires no login and selects only published name, UID, ticket, round,
coupon, benefit summary, and result date. `PublicWinnersPage` renders that response and
never receives email, phone, address, or payment data.

- [ ] **Step 6: Verify and commit**

Run: `npm test`

Working directory: `frontend/backend`

Expected: all tests PASS.

Run: `npm test -- tests/features_dashboard/planWiseDraw.test.ts tests/services/backendContracts.test.ts tests/pages/publicWinners.test.tsx`

Working directory: `frontend`

Expected: PASS.

```bash
git add frontend/backend/supabase/migrations/005_weekly_draw_plan_rounds.sql frontend/backend/supabase/functions/run-weekly-draw frontend/backend/supabase/functions/weekly-draw-status frontend/backend/supabase/functions/reveal-next-winner frontend/backend/supabase/functions/issue-non-winner-credits frontend/backend/supabase/functions/public-winners frontend/backend/tests frontend/src/features/admin/AdminPage.tsx frontend/src/pages/PublicWinnersPage.tsx frontend/tests/pages/publicWinners.test.tsx
git commit -m "feat: complete plan-wise draw and non-winner credits"
```

### Task 8: Replace Dashboard Dummy Data

**Files:**
- Modify: `frontend/src/features/dashboard/DashboardPage.tsx`
- Modify: `frontend/src/features/dashboard/modern/ModernDashboardApp.tsx`
- Modify: `frontend/src/features/dashboard/modern/pages/*.tsx`
- Modify: `frontend/src/features/dashboard/modern/components/*.tsx`
- Create: `frontend/tests/features_dashboard/customerDashboardPages.test.tsx`
- Create: `frontend/tests/config/productionImportIsolation.test.ts`

**Interfaces:**
- Consumes: `CustomerDashboardResponse` from Task 3.
- Produces: authenticated empty-state-safe dashboard pages.

- [ ] **Step 1: Add failing dashboard test**

```tsx
it('renders server UID and an empty bookings state', async () => {
  render(<ModernDashboardApp model={emptyDashboard} onLogout={vi.fn()} />);
  expect(screen.getByText('BDU-2026-RHLSEN-4821')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('link', { name: /my bookings/i }));
  expect(screen.getByText(/no bookings/i)).toBeInTheDocument();
  expect(screen.queryByText('Demo Rahul')).not.toBeInTheDocument();
});
```

Add a source scan:

```ts
it('keeps production dashboard files free of dummy data imports', () => {
  for (const file of dashboardProductionFiles()) {
    expect(readFileSync(file, 'utf8')).not.toContain('modern/data/dummyData');
  }
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/features_dashboard/customerDashboardPages.test.tsx tests/config/productionImportIsolation.test.ts`

Expected: FAIL because dashboard pages import `dummyData`.

- [ ] **Step 3: Pass the server model through the dashboard**

```tsx
export default function DashboardPage({ user, onLogout, onBookPaidTour }: DashboardPageProps) {
  const state = useCustomerDashboard(Boolean(user));
  if (state.loading) return <DashboardSkeleton />;
  if (state.error || !state.data) {
    return <DashboardError onRetry={state.refresh} />;
  }
  return (
    <ModernDashboardApp
      model={state.data}
      onLogout={onLogout}
      onBookPaidTour={onBookPaidTour}
    />
  );
}
```

Each page receives typed slices from `model`. New accounts show zero/empty states; no
seeded UID, plan, booking, payment, support, or winner values remain.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/features_dashboard/customerDashboardPages.test.tsx tests/config/productionImportIsolation.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

```bash
git add frontend/src/features/dashboard frontend/tests/features_dashboard/customerDashboardPages.test.tsx frontend/tests/config/productionImportIsolation.test.ts
git commit -m "feat: render customer dashboard from Supabase data"
```

### Task 9: Booking Schema, Pricing, And Credit Reservation

**Files:**
- Extend: `frontend/backend/supabase/migrations/006_identity_catalog_booking.sql`
- Extend: `frontend/backend/supabase/migrations/007_atomic_customer_workflows.sql`
- Create: `frontend/backend/business_logic/booking/bookingWorkflow.service.ts`
- Create: `frontend/backend/tests/bookingWorkflow.test.ts`
- Create: `frontend/backend/supabase/functions/create-tour-booking/index.ts`
- Modify: `frontend/src/services/backend/backendContracts.ts`
- Modify: `frontend/src/services/backend/backendAdapter.ts`
- Modify: `frontend/src/services/backend/supabaseBackendAdapter.ts`

**Interfaces:**
- Produces: `createTourBookingDraft(input)` with authoritative totals.
- Consumes: tour/departure, travelers, pickup, and credit unit assignments.

- [ ] **Step 1: Add failing booking tests**

```ts
it('reserves one matching credit per traveler', async () => {
  const result = await createBookingDraft(repository, twoTravelerInput);
  expect(result.reservedCreditUnits).toHaveLength(2);
  expect(result.totalDiscount).toBe(1000);
  expect(new Set(result.reservedCreditUnits.map((unit) => unit.travelerKey)).size)
    .toBe(2);
});

it('calculates fixed departure amount due now after discount', async () => {
  const result = await createBookingDraft(repository, {
    ...twoTravelerInput,
    grossTourTotal: 20000,
  });
  expect(result.finalTourTotal).toBe(19000);
  expect(result.amountDueNow).toBe(4750);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- bookingWorkflow.test.ts discountCreditReservation.test.ts`

Working directory: `frontend/backend`

Expected: FAIL because persistent booking workflow is absent.

- [ ] **Step 3: Add normalized booking tables**

Add `tours`, `tour_departures`, `bookings`, `booking_travelers`, `booking_pickups`, and
`booking_installments`. Customers read their rows; direct customer writes to totals and
statuses are denied.

- [ ] **Step 4: Add atomic booking draft workflow**

```ts
export interface CreateTourBookingInput {
  tourId: string;
  departureId: string;
  bookingType: 'fixed_departure' | 'customized_tailor_made';
  travelers: BookingTravelerInput[];
  pickup: BookingPickupInput;
  creditAssignments: Array<{ creditUnitId: string; travelerKey: string }>;
  instantBookingRequired: boolean;
}
```

The RPC locks departure inventory and credits, validates one credit per traveler and
category, recalculates total/installments, creates a pending booking, and returns
`amountDueNow`.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- bookingWorkflow.test.ts discountCreditReservation.test.ts advancePaymentSchedule.test.ts`

Working directory: `frontend/backend`

Expected: PASS.

```bash
git add frontend/backend/supabase/migrations/006_identity_catalog_booking.sql frontend/backend/supabase/migrations/007_atomic_customer_workflows.sql frontend/backend/business_logic/booking/bookingWorkflow.service.ts frontend/backend/tests/bookingWorkflow.test.ts frontend/backend/supabase/functions/create-tour-booking frontend/src/services/backend
git commit -m "feat: create authoritative tour booking drafts"
```

### Task 10: Verified Booking Payment And Installments

**Files:**
- Extend: `frontend/backend/supabase/migrations/007_atomic_customer_workflows.sql`
- Modify: `frontend/backend/supabase/functions/payment-webhook/index.ts`
- Modify: `frontend/src/features/booking/hooks/useBookingPayment.ts`
- Modify: `frontend/src/features/booking/TourBookingForm.tsx`
- Create: `frontend/tests/features_booking/verifiedBookingPayment.test.tsx`

**Interfaces:**
- Consumes: pending booking from Task 9 and Razorpay flow from Tasks 4-5.
- Produces: confirmed booking and redeemed credits after webhook.

- [ ] **Step 1: Add failing payment test**

```tsx
it('does not confirm from the client callback', async () => {
  paymentApi.createOrder.mockResolvedValue(order);
  paymentApi.openCheckout.mockResolvedValue({ sessionId: order.sessionId });
  paymentApi.getStatus
    .mockResolvedValueOnce({ status: 'pending' })
    .mockResolvedValueOnce({ status: 'verified', bookingId: 'BDU-BKG-1001' });

  await userEvent.click(screen.getByRole('button', { name: /pay now/i }));

  expect(screen.queryByText(/booking confirmed/i)).not.toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText(/BDU-BKG-1001/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/features_booking/verifiedBookingPayment.test.tsx`

Expected: FAIL because the current hook confirms via timer.

- [ ] **Step 3: Add booking fulfillment transaction**

For a captured booking event the database transaction:

1. records the event idempotently;
2. marks the current installment paid;
3. confirms the booking;
4. redeems reserved credits;
5. decrements departure capacity;
6. writes audit events.

Failed or expired payments release reservations and do not confirm the booking.

- [ ] **Step 4: Replace timer simulation**

The hook runs:

```ts
const draft = await beduineBackend.createTourBookingDraft(input);
const order = await beduineBackend.createPaymentOrder({
  purpose: 'tour_booking',
  referenceId: draft.bookingId,
});
await openRazorpayCheckout(order, customer);
const verified = await pollPaymentStatus(order.sessionId);
if (verified.status !== 'verified') throw new Error('PAYMENT_NOT_VERIFIED');
return verified.booking;
```

Delete the `setInterval` path that manufactures transaction IDs and mutates the user
ledger in auth metadata.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/features_booking/verifiedBookingPayment.test.tsx tests/features_booking_advancePaymentSchedule.test.ts tests/features_booking_pricing.test.ts`

Expected: PASS.

```bash
git add frontend/backend/supabase/migrations/007_atomic_customer_workflows.sql frontend/backend/supabase/functions/payment-webhook frontend/src/features/booking frontend/tests/features_booking/verifiedBookingPayment.test.tsx
git commit -m "feat: confirm bookings after verified payment"
```

### Task 11: Customized Tour Requests

**Files:**
- Extend: `frontend/backend/supabase/migrations/006_identity_catalog_booking.sql`
- Create: `frontend/backend/supabase/functions/custom-tour-request/index.ts`
- Modify: `frontend/src/services/customTourService.ts`
- Modify: `frontend/src/pages/main-website-tour-page/CustomizeTourPage.tsx`
- Modify: `frontend/src/pages/main-website-tour-page/custom-tour/*.tsx`
- Create: `frontend/tests/services/customTourProduction.test.ts`

**Interfaces:**
- Produces: authenticated request creation, customer history, admin quotation transitions.
- Consumes: public custom-tour draft and authenticated session.

- [ ] **Step 1: Add failing persistence test**

```ts
it('uses the backend and never localStorage in production', async () => {
  const storageSpy = vi.spyOn(Storage.prototype, 'setItem');
  await createCustomTourRequest(validRequest, productionAdapter);
  expect(productionAdapter.createCustomTourRequest)
    .toHaveBeenCalledWith(validRequest);
  expect(storageSpy).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/services/customTourProduction.test.ts`

Expected: FAIL because the current service uses localStorage and mock requests.

- [ ] **Step 3: Add schema and RLS**

Add `custom_tour_requests`, `custom_tour_quotations`, and
`custom_tour_revisions`. Customers create/read their own requests. Admin quotation and
state transitions use admin-only functions. Allowed transitions are enforced by a
database trigger.

- [ ] **Step 4: Implement mode-specific service**

```ts
export function createCustomTourService(mode: 'demo' | 'production') {
  return mode === 'production'
    ? createSupabaseCustomTourService(beduineBackend)
    : createDemoCustomTourService();
}
```

The public form may be viewed anonymously. Submit redirects to
`/login?next=/paid-tour#customize`; the non-sensitive draft is restored after login.
`DemoAdminControls` never renders in production.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/services/customTourProduction.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

```bash
git add frontend/backend/supabase/migrations/006_identity_catalog_booking.sql frontend/backend/supabase/functions/custom-tour-request frontend/src/services/customTourService.ts frontend/src/pages/main-website-tour-page frontend/tests/services/customTourProduction.test.ts
git commit -m "feat: persist customized tour requests"
```

### Task 12: Cancellation, Refund, And Credit Adjustment

**Files:**
- Create: `frontend/backend/supabase/migrations/008_admin_support_refund_workflows.sql`
- Modify: `frontend/backend/supabase/functions/request-cancellation/index.ts`
- Create: `frontend/backend/supabase/functions/admin-operations/index.ts`
- Modify: `frontend/src/services/backend/backendContracts.ts`
- Modify: `frontend/src/services/backend/backendAdapter.ts`
- Modify: `frontend/src/services/backend/supabaseBackendAdapter.ts`
- Modify: `frontend/src/features/admin/components/AdminPanel.tsx`
- Create: `frontend/tests/features_admin/cancellationOperations.test.tsx`

**Interfaces:**
- Produces: customer cancellation and admin review/payout methods.
- Consumes: real owned booking and tested cancellation calculator.

- [ ] **Step 1: Add failing admin cancellation test**

```tsx
it('shows server refund preview before approval', async () => {
  adminApi.reviewCancellation.mockResolvedValue({
    requestId: 'CAN-1',
    status: 'admin_review',
    estimatedRefund: 14500,
    supplierCharges: 500,
  });
  render(<CancellationAdminPage api={adminApi} requests={[request]} />);
  await userEvent.click(screen.getByRole('button', { name: /review/i }));
  expect(await screen.findByText('INR 14,500')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/features_admin/cancellationOperations.test.tsx`

Expected: FAIL because admin cancellation operations are absent.

- [ ] **Step 3: Add transactional admin functions**

Create:

```sql
admin_review_cancellation_v1(
  p_request_id text,
  p_actor_id uuid,
  p_approve boolean,
  p_refund_mode text,
  p_supplier_charges numeric,
  p_supplier_proof_url text,
  p_admin_note text
)

admin_process_cancellation_payout_v1(
  p_request_id text,
  p_actor_id uuid
)

admin_mark_refund_result_v1(
  p_request_id text,
  p_actor_id uuid,
  p_status text,
  p_provider_ref text
)
```

Each function verifies the admin profile, locks the request, validates current state,
persists the transition, and writes an audit event. Credit adjustment expiry is
`now() + interval '12 months'`.

For `cash_refund`, `admin-operations` resolves the captured Razorpay payment ID and calls
`POST /v1/payments/:payment_id/refund` with the approved refund in paise, a unique receipt,
and `{ requestId, bookingId }` notes. It stores Razorpay refund ID/status before returning.
Refund webhooks map `pending`, `processed`, and `failed` to `refund_processing`,
`refunded`, and `refund_failed` idempotently.

- [ ] **Step 4: Add adapter and admin UI**

```ts
listCancellationRequests(): Promise<CancellationAdminSummary[]>;
reviewCancellation(input: ReviewCancellationInput): Promise<CancellationReviewResponse>;
processCancellationPayout(requestId: string): Promise<CancellationPayoutResponse>;
```

UI supports supplier amount/proof, preview, approve/reject, cash refund, credit
adjustment, and payout status.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- cancellation.test.ts`

Working directory: `frontend/backend`

Expected: PASS.

Run: `npm test -- tests/features_admin/cancellationOperations.test.tsx`

Working directory: `frontend`

Expected: PASS.

```bash
git add frontend/backend/supabase/migrations/008_admin_support_refund_workflows.sql frontend/backend/supabase/functions/request-cancellation frontend/backend/supabase/functions/admin-operations frontend/src/services/backend frontend/src/features/admin frontend/tests/features_admin/cancellationOperations.test.tsx
git commit -m "feat: connect cancellation refund and credit operations"
```

### Task 13: Support Tickets And Production Admin Data

**Files:**
- Extend: `frontend/backend/supabase/migrations/008_admin_support_refund_workflows.sql`
- Create: `frontend/backend/supabase/functions/support-tickets/index.ts`
- Extend: `frontend/backend/supabase/functions/admin-operations/index.ts`
- Modify: `frontend/src/features/dashboard/modern/pages/SupportTickets.tsx`
- Modify: `frontend/src/features/admin/hooks/useAdminUsers.ts`
- Modify: `frontend/src/features/admin/hooks/useAdminAuditLogs.ts`
- Modify: `frontend/src/features/admin/AdminPage.tsx`
- Create: `frontend/tests/features_dashboard/supportTickets.test.tsx`
- Create: `frontend/tests/features_admin/productionAdminData.test.tsx`

**Interfaces:**
- Produces: customer ticket operations and admin user/audit/support lists.
- Consumes: server profile role and audit log.

- [ ] **Step 1: Add failing support/admin tests**

```tsx
it('creates a support ticket through the backend', async () => {
  render(<SupportTickets tickets={[]} createTicket={createTicket} />);
  await userEvent.click(screen.getByRole('button', { name: /create ticket/i }));
  await userEvent.type(screen.getByLabelText(/subject/i), 'Payment not updated');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(createTicket).toHaveBeenCalledWith(expect.objectContaining({
    subject: 'Payment not updated',
  }));
});

it('loads admin users from the API', async () => {
  render(<AdminUsersPage api={adminApi} />);
  await waitFor(() => expect(adminApi.listUsers).toHaveBeenCalled());
  expect(mockAuth.getUsersList).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- tests/features_dashboard/supportTickets.test.tsx tests/features_admin/productionAdminData.test.tsx`

Expected: FAIL because both areas use dummy/local data.

- [ ] **Step 3: Add support schema and API**

Add `support_tickets` and `support_ticket_messages`. Customer RLS permits create/read of
owned tickets. Admin list/assign/respond/status mutations use `admin-operations` and
write an audit event.

- [ ] **Step 4: Replace admin mock hooks**

Production hooks call:

```ts
listAdminUsers(): Promise<AdminUserSummary[]>;
listAuditLogs(cursor?: string): Promise<AuditLogPage>;
listSupportTickets(): Promise<AdminSupportTicket[]>;
updateSupportTicket(input: AdminSupportUpdateInput): Promise<AdminSupportTicket>;
```

Demo wallet/reset and seeded franchise/agent operations render only in demo mode. No
authentication-level agent role is introduced.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/features_dashboard/supportTickets.test.tsx tests/features_admin/productionAdminData.test.tsx`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

```bash
git add frontend/backend/supabase/migrations/008_admin_support_refund_workflows.sql frontend/backend/supabase/functions/support-tickets frontend/backend/supabase/functions/admin-operations frontend/src/features/dashboard/modern/pages/SupportTickets.tsx frontend/src/features/admin frontend/tests/features_dashboard/supportTickets.test.tsx frontend/tests/features_admin/productionAdminData.test.tsx
git commit -m "feat: connect support and admin production data"
```

### Task 14: Demo Isolation And Release Verification

**Files:**
- Modify: `frontend/src/config/runtime.ts`
- Modify: `frontend/src/services/backend/index.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/AdminLoginPage.tsx`
- Modify: `frontend/tests/config/productionImportIsolation.test.ts`
- Modify: `frontend/e2e/app-smoke.spec.ts`
- Create: `frontend/e2e/production-user-flow.spec.ts`
- Modify: `frontend/backend/README.md`
- Modify: `frontend/.env.production.example`
- Modify: `frontend/backend/.env.supabase.example`

**Interfaces:**
- Produces: fail-closed production runtime and staging/go-live checklist.
- Consumes: every previous task.

- [ ] **Step 1: Complete the production import guard**

```ts
it('keeps production modules free of demo imports', () => {
  const forbidden = [
    'dummyData',
    'demoWalletService',
    'mockPaymentGateway',
    'generateMockParticipants',
    'getInitialMockRequests',
  ];
  for (const file of productionSourceFiles()) {
    const source = readFileSync(file, 'utf8');
    for (const token of forbidden) {
      expect(source, `${file} contains ${token}`).not.toContain(token);
    }
  }
});
```

- [ ] **Step 2: Run and verify remaining failures**

Run: `npm test -- tests/config/productionImportIsolation.test.ts`

Expected: FAIL with every remaining production demo import listed.

- [ ] **Step 3: Remove remaining production demo surfaces**

Remove visible demo credentials from `AdminLoginPage`. Hide demo banner and controls in
production. Ensure the production adapter cannot fall back to demo. Missing production
environment must throw before app rendering.

- [ ] **Step 4: Add complete Playwright flows**

```ts
test('public CTAs preserve intended destinations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /join now|join beduine club/i }).first().click();
  await expect(page).toHaveURL(/\/login\?next=%2Flanding$/);

  await page.goto('/');
  await page.getByRole('link', { name: /customize tour/i }).first().click();
  await expect(page).toHaveURL(/\/paid-tour#customize$/);
});

test('customer cannot render admin data', async ({ page }) => {
  await loginAsCustomer(page);
  await page.goto('/admin');
  await expect(page.getByText(/admin login required|access denied/i)).toBeVisible();
  await expect(page.getByText(/user directory/i)).not.toBeVisible();
});
```

Credential-backed Razorpay tests run only when
`E2E_RAZORPAY_TEST_CREDENTIALS_AVAILABLE=true`. Without credentials, provider-backed
staging checks are explicitly skipped, not reported as passed.

- [ ] **Step 5: Run the complete release gate**

Run: `npm test`

Working directory: `frontend/backend`

Expected: all tests PASS.

Run: `npm test`

Working directory: `frontend`

Expected: all tests PASS.

Run: `npm run typecheck`

Working directory: `frontend/backend`

Expected: PASS.

Run: `npm run typecheck`

Working directory: `frontend`

Expected: PASS.

Run: `npm run build`

Working directory: `frontend`

Expected: PASS.

Run: `npm run e2e`

Working directory: `frontend`

Expected: all non-credential Playwright tests PASS.

- [ ] **Step 6: Document deployment order**

1. Link a Supabase staging project.
2. Set Supabase and Razorpay test secrets.
3. Apply migrations 001 through 008.
4. Deploy every Edge Function.
5. Configure Razorpay test webhook URL and captured/refund events.
6. Create one server-authorized admin profile.
7. Set frontend production environment.
8. Run subscription, duplicate-webhook, draw, booking, cancellation, and support tests.
9. Replace test credentials with live credentials only after staging passes.
10. Retain rollback SQL and the previous frontend deployment.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/config/runtime.ts frontend/src/services/backend/index.ts frontend/src/App.tsx frontend/src/AdminLoginPage.tsx frontend/tests/config/productionImportIsolation.test.ts frontend/e2e frontend/backend/README.md frontend/.env.production.example frontend/backend/.env.supabase.example
git commit -m "chore: complete Beduine production release gates"
```

## Checkpoints

### Checkpoint A: Tasks 1-3

- Redirects are correct and open redirects are blocked.
- Dashboard, club, registration, and checkout require authentication.
- Server profile role and UID are canonical.
- Customer dashboard has a real read contract.

### Checkpoint B: Tasks 4-8

- Razorpay order creation is server-side.
- Webhook fulfillment is idempotent.
- Verified subscription grants exactly one TRC.
- Participation, plan-round draw, reveal, and non-winner credit issuance work.
- Dashboard no longer renders dummy customer data in production.

### Checkpoint C: Tasks 9-13

- Booking totals/installments are server-authoritative.
- Booking confirmation waits for verified payment.
- Discount Credits reserve/redeem once per traveler.
- Custom tours, cancellations, refunds, support, and admin data persist in Supabase.

### Checkpoint D: Task 14

- Demo and production paths are isolated.
- Frontend/backend tests, typechecks, build, and Playwright pass.
- Credential-backed staging checks and deployment documentation are ready.

## Official Razorpay References

- Orders API: https://razorpay.com/docs/api/orders/create/
- Standard Checkout: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
- Webhook validation: https://razorpay.com/docs/webhooks/validate-test/
- Refunds API: https://razorpay.com/docs/api/refunds/
