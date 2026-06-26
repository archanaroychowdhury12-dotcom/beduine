# Credit Category Locking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement domestic/international Discount Credit category locking across subscriptions, checkout, dashboard, and admin panel per the business document `BEDUIN_TOUR_AND_TRAVELS_UPDATED_TRC_POLICIES_DC_LOCKING.docx`.

**Architecture:** Add explicit `TripCategory` to plans, tours, and credit ledger entries; centralize plan metadata in `siteData.ts`; derive credit issuance from plan data; split dashboard balances by category; enforce category matching at tour checkout.

**Tech Stack:** React 19, Vite 7, TypeScript 5.9, Tailwind CSS 4, Vitest (new), jsdom, React Testing Library.

## Global Constraints

- Domestic Discount Credit value must always be ₹500.
- International Discount Credit value must always be ₹5,000.
- Domestic credits can only be used for Domestic bookings/plans.
- International credits can only be used for International bookings/plans.
- Error messages must be exact:
  - International DC on Domestic: `"International Discount Credits can only be used for International bookings."`
  - Domestic DC on International: `"Domestic Discount Credits can only be used for Domestic bookings."`
- Maximum one Discount Credit can be used per person per tour booking.
- Multiple Discount Credits cannot be combined for a single person's tour cost.
- International plans issue 1/2/4 Discount Credits worth ₹5,000 each (Silver/Gold/Platinum).
- Domestic plans issue 1/2/4 Discount Credits worth ₹500 each (Silver/Gold/Platinum).
- All plan/credit metadata must derive from `src/data/siteData.ts`; no duplicated `PLAN_CREDITS` maps.

---

## File Structure

| File | Responsibility |
| ---- | -------------- |
| `src/types.ts` | Central types: `TripCategory`, `SubscriptionPlan`, `CreditLedgerEntry`, updates to `TourPackage` and `PriceCalculation`. |
| `src/data/siteData.ts` | Single source of truth for `PLANS`, `INTL_PLANS`, `ALL_PLANS`, and `getPlanDetails()`. |
| `src/data/tours.ts` | Adds `category` to each `TourPackage`. |
| `src/services/demoWalletService.ts` | Issues category-tagged credits from plan metadata; removes duplicated plan maps. |
| `src/DashboardPage.tsx` | Split credit display/admin by Domestic/International; update subscription checkout to use new helpers. |
| `src/pages/main-website-tour-page/TourSelection.tsx` | Uses `tour.category` instead of destination-string heuristic. |
| `src/pages/main-website-tour-page/TourBookingForm.tsx` | Category-locked credit redemption with per-person limit. |
| `src/utils/creditHelpers.ts` | New shared helpers for ledger balance calculation and validation. |
| `tests/utils/creditHelpers.test.ts` | Tests for balance and validation helpers. |
| `tests/services/demoWalletService.test.ts` | Tests for credit issuance. |
| `tests/data/siteData.test.ts` | Tests for plan metadata. |

---

### Task 1: Add category-aware types

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Produces: `TripCategory`, `SubscriptionPlan`, updated `TourPackage`, updated `PriceCalculation`, updated `CreditLedgerEntry`.

- [ ] **Step 1: Add new types**

Add after `FAQItem` interface:

```ts
export type TripCategory = 'domestic' | 'international';

export interface SubscriptionPlan {
  name: string;
  price: number;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glow: string;
  featured?: boolean;
  tourValue: number;
  duration: string;
  discountCredits: number;
  discountValue: number;
  paidDiscount: string;
  nameChange: string;
  insurance?: string;
  image: string;
  imageLabel: string;
  destinations: string[];
  benefits: string[];
  tripCategory: TripCategory;
}
```

Add `category` to `TourPackage`:

```ts
export interface TourPackage {
  // ... existing fields ...
  category: TripCategory;
}
```

Update `PriceCalculation`:

```ts
export interface PriceCalculation {
  // ... existing fields ...
  appliedDiscountCredits?: number;
  discountCreditsTotal?: number;
  appliedDomesticCredits?: number;
  appliedInternationalCredits?: number;
  domesticCreditsTotal?: number;
  internationalCreditsTotal?: number;
}
```

Add `CreditLedgerEntry`:

```ts
export interface CreditLedgerEntry {
  id: string;
  date: string;
  type: 'issued' | 'reserved' | 'redeemed' | 'reversed' | 'expired' | 'admin_adjustment';
  creditType: 'travel_reward' | 'domestic_discount' | 'international_discount';
  category: TripCategory | 'none';
  amount: number;
  valuePerCredit: number;
  totalValue: number;
  reason: string;
  source?: 'real' | 'demo';
  bookingRef?: string;
  adminRef?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat(types): add TripCategory, SubscriptionPlan, and category-aware CreditLedgerEntry"
```

---

### Task 2: Normalize plan definitions in siteData.ts

**Files:**
- Modify: `src/data/siteData.ts`

**Interfaces:**
- Consumes: `SubscriptionPlan`, `TripCategory` from `src/types.ts`.
- Produces: `PLANS`, `INTL_PLANS`, `ALL_PLANS`, `getPlanDetails(name, tripCategory?)`.

- [ ] **Step 1: Update domestic plans**

Add `tripCategory: 'domestic'` to each `PLANS` entry. Existing fields remain.

```ts
export const PLANS: SubscriptionPlan[] = [
  {
    name: 'Silver', price: 499, tagline: 'Smart Starter', icon: Star,
    color: 'from-slate-500 to-slate-700', glow: 'slate',
    tourValue: 3000, duration: '2N / 3D', discountCredits: 1, discountValue: 500,
    paidDiscount: 'Up to 5% off', nameChange: 'No Option',
    image: '/images/sundarbans_mangrove_1779521789593.png',
    imageLabel: 'Sundarbans - Boat Safari',
    destinations: ['Sundarban', 'Digha', 'Mousuni Island', 'Purulia'],
    benefits: ['1 Weekly Promotional Draw entry', 'Eligible for promotional winner benefits', '₹500 discount credit if not selected', 'Up to 5% off on paid domestic tours', '12-month subscription validity', '18+ Membership Only'],
    tripCategory: 'domestic',
  },
  // ... Gold and Platinum same pattern ...
];
```

- [ ] **Step 2: Update international plans**

Change `discountCredits` to 1/2/4 and `discountValue` to 5000/10000/20000. Add `tripCategory: 'international'`.

```ts
export const INTL_PLANS: SubscriptionPlan[] = [
  {
    name: 'Silver', price: 4999, tagline: 'International Starter', icon: Globe,
    color: 'from-sky-400 to-blue-600', glow: 'blue',
    tourValue: 25000, duration: '3N / 4D', discountCredits: 1, discountValue: 5000,
    paidDiscount: 'Up to 5% off', insurance: '50% off', nameChange: 'One time',
    image: '/images/nepal.png',
    imageLabel: 'Nepal - Valley & Peaks',
    destinations: ['Nepal', 'Bhutan'],
    benefits: ['1 Weekly Promotional Draw entry', 'Winner tour value up to ₹25,000 (3N/4D)', '₹5,000 discount credit if not selected', 'Up to 5% off on paid international tours', 'One-time family name change allowed', '18+ Membership Only'],
    tripCategory: 'international',
  },
  {
    name: 'Gold', price: 7999, tagline: 'Premium Explorer', icon: Plane,
    color: 'from-emerald-400 to-teal-600', glow: 'teal',
    featured: true, tourValue: 50000, duration: '4N / 5D', discountCredits: 2, discountValue: 10000,
    paidDiscount: 'Up to 7% off', insurance: 'Included free', nameChange: 'Two times',
    image: '/images/thailand.png',
    imageLabel: 'Thailand - Temples & Beaches',
    destinations: ['Thailand', 'Bali (Indonesia)'],
    benefits: ['1 Weekly Promotional Draw entry', 'Winner tour value up to ₹50,000 (4N/5D)', '₹10,000 discount credits if not selected', 'Up to 7% off on paid international tours', 'Two family name changes allowed', '18+ Membership Only'],
    tripCategory: 'international',
  },
  {
    name: 'Platinum', price: 14999, tagline: 'Ultimate World Pass', icon: Rocket,
    color: 'from-cyan via-cyan-bright to-cyan-deep', glow: 'cyan',
    tourValue: 100000, duration: '5N / 6D', discountCredits: 4, discountValue: 20000,
    paidDiscount: 'Up to 10% off', insurance: 'Included free', nameChange: 'Unlimited',
    image: '/images/vietnam.png',
    imageLabel: 'Vietnam - Bays & Cities',
    destinations: ['Dubai', 'Vietnam'],
    benefits: ['1 Weekly Promotional Draw entry', 'Winner tour value up to ₹1,00,000 (5N/6D)', '₹20,000 discount credits if not selected', 'Up to 10% off on paid international tours', 'Unlimited name changes allowed', '18+ Membership Only'],
    tripCategory: 'international',
  },
];
```

- [ ] **Step 3: Add ALL_PLANS and update getPlanDetails**

After `INTL_PLANS`:

```ts
export const ALL_PLANS: SubscriptionPlan[] = [...PLANS, ...INTL_PLANS];
```

Replace `getPlanDetails` with:

```ts
export function getPlanDetails(
  planName: string,
  tripCategory: TripCategory = 'domestic'
): SubscriptionPlan | undefined {
  if (!planName) return undefined;
  const name = planName.toLowerCase().trim();
  return ALL_PLANS.find(
    (p) =>
      p.name.toLowerCase() === name &&
      p.tripCategory === tripCategory
  );
}
```

- [ ] **Step 4: Write failing test**

Create `tests/data/siteData.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { PLANS, INTL_PLANS, ALL_PLANS, getPlanDetails } from '../../src/data/siteData';

describe('siteData plan metadata', () => {
  it('domestic Silver has 1 discount credit worth 500', () => {
    const plan = getPlanDetails('Silver', 'domestic');
    expect(plan).toBeDefined();
    expect(plan?.discountCredits).toBe(1);
    expect(plan?.discountValue).toBe(500);
    expect(plan?.tripCategory).toBe('domestic');
  });

  it('international Silver has 1 discount credit worth 5000', () => {
    const plan = getPlanDetails('Silver', 'international');
    expect(plan).toBeDefined();
    expect(plan?.discountCredits).toBe(1);
    expect(plan?.discountValue).toBe(5000);
    expect(plan?.tripCategory).toBe('international');
  });

  it('international Platinum has 4 discount credits worth 20000 total', () => {
    const plan = getPlanDetails('Platinum', 'international');
    expect(plan?.discountCredits).toBe(4);
    expect(plan?.discountValue).toBe(20000);
  });

  it('ALL_PLANS contains 6 plans', () => {
    expect(ALL_PLANS).toHaveLength(6);
  });
});
```

- [ ] **Step 5: Run test — expect FAIL (types not yet used, but test compiles once siteData imports types)**

Add test script to `package.json`:

```json
"test": "vitest run"
```

Run:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
npx vitest run tests/data/siteData.test.ts
```

Expected: PASS after Task 1 types are imported.

- [ ] **Step 6: Commit**

```bash
git add src/data/siteData.ts tests/data/siteData.test.ts package.json package-lock.json
git commit -m "feat(plans): normalize SubscriptionPlan metadata and fix international credit counts"
```

---

### Task 3: Add category to tour packages

**Files:**
- Modify: `src/data/tours.ts`

**Interfaces:**
- Consumes: `TourPackage` now requires `category`.

- [ ] **Step 1: Add category to each tour**

| Tour ID | Category |
| ------- | -------- |
| sundarbans-mangrove-safari | domestic |
| darjeeling-hills-tea | domestic |
| puri-konark-sea-temple | domestic |
| kashmir-valley-houseboat | domestic |
| dubai-city-desert | international |
| thailand-bangkok-pattaya | international |

Example:

```ts
{
  id: 'sundarbans-mangrove-safari',
  // ...
  category: 'domestic',
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/tours.ts
git commit -m "feat(tours): add domestic/international category to TourPackage data"
```

---

### Task 4: Create shared credit helpers

**Files:**
- Create: `src/utils/creditHelpers.ts`
- Create: `tests/utils/creditHelpers.test.ts`

**Interfaces:**
- Consumes: `CreditLedgerEntry`, `TripCategory` from `src/types.ts`.
- Produces: `getAvailableCredits(ledger, category)`, `validateCreditApplication(...)`, `CREDIT_VALUE_DOMESTIC`, `CREDIT_VALUE_INTERNATIONAL`.

- [ ] **Step 1: Create helpers**

```ts
import { CreditLedgerEntry, TripCategory } from '../types';

export const CREDIT_VALUE_DOMESTIC = 500;
export const CREDIT_VALUE_INTERNATIONAL = 5000;

export function getCreditValue(category: TripCategory): number {
  return category === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;
}

export function getAvailableCredits(
  ledger: CreditLedgerEntry[],
  category: TripCategory
): number {
  return ledger.reduce((sum, entry) => {
    if (entry.category !== category) return sum;
    if (entry.type === 'issued' || entry.type === 'admin_adjustment') return sum + entry.amount;
    if (entry.type === 'redeemed' || entry.type === 'expired') return sum - entry.amount;
    return sum;
  }, 0);
}

export interface CreditValidationResult {
  valid: boolean;
  error?: string;
}

export function validateCreditApplication({
  requestedCredits,
  tourCategory,
  availableDomesticCredits,
  availableInternationalCredits,
  travelerCount,
}: {
  requestedCredits: number;
  tourCategory: TripCategory;
  availableDomesticCredits: number;
  availableInternationalCredits: number;
  travelerCount: number;
}): CreditValidationResult {
  if (requestedCredits <= 0) return { valid: true };

  if (tourCategory === 'domestic') {
    if (requestedCredits > availableDomesticCredits) {
      return { valid: false, error: 'You do not have enough Domestic Discount Credits.' };
    }
  } else {
    if (requestedCredits > availableInternationalCredits) {
      return { valid: false, error: 'You do not have enough International Discount Credits.' };
    }
  }

  if (requestedCredits > travelerCount) {
    return { valid: false, error: 'Only one Discount Credit can be applied per traveler.' };
  }

  return { valid: true };
}

export function getCategoryErrorMessage(
  creditCategory: TripCategory,
  checkoutCategory: TripCategory
): string | undefined {
  if (creditCategory === 'international' && checkoutCategory === 'domestic') {
    return 'International Discount Credits can only be used for International bookings.';
  }
  if (creditCategory === 'domestic' && checkoutCategory === 'international') {
    return 'Domestic Discount Credits can only be used for Domestic bookings.';
  }
  return undefined;
}
```

- [ ] **Step 2: Write tests**

Create `tests/utils/creditHelpers.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  getCreditValue,
  getAvailableCredits,
  validateCreditApplication,
  getCategoryErrorMessage,
} from '../../src/utils/creditHelpers';
import { CreditLedgerEntry } from '../../src/types';

function makeEntry(overrides: Partial<CreditLedgerEntry>): CreditLedgerEntry {
  return {
    id: 'x',
    date: '2026-06-25',
    type: 'issued',
    creditType: 'domestic_discount',
    category: 'domestic',
    amount: 1,
    valuePerCredit: 500,
    totalValue: 500,
    reason: 'test',
    ...overrides,
  };
}

describe('creditHelpers', () => {
  it('returns correct credit values', () => {
    expect(getCreditValue('domestic')).toBe(500);
    expect(getCreditValue('international')).toBe(5000);
  });

  it('calculates available domestic credits', () => {
    const ledger = [
      makeEntry({ category: 'domestic', type: 'issued', amount: 4 }),
      makeEntry({ category: 'domestic', type: 'redeemed', amount: 1 }),
      makeEntry({ category: 'international', type: 'issued', amount: 2 }),
    ];
    expect(getAvailableCredits(ledger, 'domestic')).toBe(3);
    expect(getAvailableCredits(ledger, 'international')).toBe(2);
  });

  it('blocks applying more credits than available', () => {
    const result = validateCreditApplication({
      requestedCredits: 3,
      tourCategory: 'domestic',
      availableDomesticCredits: 1,
      availableInternationalCredits: 5,
      travelerCount: 4,
    });
    expect(result.valid).toBe(false);
  });

  it('blocks more than one credit per traveler', () => {
    const result = validateCreditApplication({
      requestedCredits: 3,
      tourCategory: 'domestic',
      availableDomesticCredits: 5,
      availableInternationalCredits: 0,
      travelerCount: 2,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Only one Discount Credit');
  });

  it('returns exact cross-category error messages', () => {
    expect(getCategoryErrorMessage('international', 'domestic')).toBe(
      'International Discount Credits can only be used for International bookings.'
    );
    expect(getCategoryErrorMessage('domestic', 'international')).toBe(
      'Domestic Discount Credits can only be used for Domestic bookings.'
    );
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run tests/utils/creditHelpers.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/utils/creditHelpers.ts tests/utils/creditHelpers.test.ts
git commit -m "feat(credits): add category-aware credit helpers with tests"
```

---

### Task 5: Update demoWalletService to issue category-tagged credits

**Files:**
- Modify: `src/services/demoWalletService.ts`
- Create: `tests/services/demoWalletService.test.ts`

**Interfaces:**
- Consumes: `SubscriptionPlan`, `TripCategory`, `CreditLedgerEntry` from `src/types.ts`; `ALL_PLANS`, `getPlanDetails` from `src/data/siteData.ts`; `getCreditValue` from `src/utils/creditHelpers.ts`.
- Produces: `checkoutSubscription()` now issues `domestic_discount` or `international_discount` ledger entries; removes `PLAN_CREDITS`, `PLAN_PRICES`, `PLAN_TYPES` maps.

- [ ] **Step 1: Replace plan maps with helpers**

At top of file:

```ts
import { ALL_PLANS, getPlanDetails } from '../data/siteData';
import { getCreditValue } from '../utils/creditHelpers';
import { CreditLedgerEntry, SubscriptionPlan } from '../types';
```

Remove `PLAN_CREDITS`, `PLAN_PRICES`, `PLAN_NAMES`, `PLAN_TYPES`.

Add helper:

```ts
function getPlanId(plan: SubscriptionPlan): string {
  return `${plan.name}_${plan.tripCategory}`;
}

function getDisplayPlanName(plan: SubscriptionPlan): string {
  return `${plan.name} ${plan.tripCategory === 'international' ? 'International' : 'Domestic'}`;
}
```

- [ ] **Step 2: Update checkoutSubscription signature and logic**

Change signature to accept `planName` and `tripCategory`:

```ts
async checkoutSubscription(
  userId: string,
  planName: string,
  tripCategory: TripCategory,
  paymentMethod: 'real_payment' | 'demo_wallet'
): Promise<CheckoutResult>
```

Resolve plan:

```ts
const plan = getPlanDetails(planName, tripCategory);
if (!plan) {
  return { success: false, message: 'Invalid plan selected' };
}
const planPrice = plan.price;
const planDisplayName = getDisplayPlanName(plan);
const creditsToIssue = plan.discountCredits;
const creditValue = getCreditValue(tripCategory);
```

Build ledger entries:

```ts
const discountCreditType: CreditLedgerEntry['creditType'] =
  tripCategory === 'international' ? 'international_discount' : 'domestic_discount';

const newLedgerEntries: CreditLedgerEntry[] = [
  {
    id: `TXN-TRC-${Math.floor(100000 + Math.random() * 900000)}`,
    date: dateStr,
    type: 'issued',
    creditType: 'travel_reward',
    category: 'none',
    amount: 1,
    valuePerCredit: 0,
    totalValue: 0,
    reason: 'Subscription activation entitlement token',
    source: paymentMethod === 'demo_wallet' ? 'demo' : 'real',
  },
  {
    id: `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`,
    date: dateStr,
    type: 'issued',
    creditType: discountCreditType,
    category: tripCategory,
    amount: creditsToIssue,
    valuePerCredit: creditValue,
    totalValue: creditsToIssue * creditValue,
    reason: `Subscription signup reward - ${creditsToIssue} ${tripCategory} Discount Credit(s) issued`,
    source: paymentMethod === 'demo_wallet' ? 'demo' : 'real',
  },
];
```

Update user metadata:

```ts
user.user_metadata = {
  ...user.user_metadata,
  planName: planDisplayName,
  planPrice: `₹${planPrice}`,
  planType: tripCategory,
  subscriptionStatus: 'active',
  subscription_source: paymentMethod === 'demo_wallet' ? 'demo' : 'real',
  payment_type: paymentMethod,
  demo_wallet_balance: newDemoBalance,
  demo_transactions: demoTransactions,
  ledger: updatedLedger,
  // Legacy field kept for compatibility; prefer ledger reads
  discount_credits: (user.user_metadata?.discount_credits ?? 0) + creditsToIssue,
  weekly_eligible_entry_count: 1,
  selected_member_benefit_status: 'none',
};
```

- [ ] **Step 3: Update resetDemoAccount**

Keep `ledger: []` and `discount_credits: 0`.

- [ ] **Step 4: Write tests**

Create `tests/services/demoWalletService.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { demoWalletService } from '../../src/services/demoWalletService';
import { supabase } from '../../src/utils/supabaseClient';

vi.stubEnv('VITE_ENABLE_DEMO_WALLET', 'true');

describe('demoWalletService.checkoutSubscription', () => {
  beforeEach(async () => {
    await demoWalletService.resetDemoAccount('demo-user');
    await demoWalletService.addDemoBalance('demo-user', 20000);
  });

  it('issues domestic credits for domestic Silver', async () => {
    const result = await demoWalletService.checkoutSubscription('demo-user', 'Silver', 'domestic', 'demo_wallet');
    expect(result.success).toBe(true);
    const user = result.user;
    const ledger = user.user_metadata.ledger;
    const dc = ledger.find((e: any) => e.creditType === 'domestic_discount');
    expect(dc.amount).toBe(1);
    expect(dc.valuePerCredit).toBe(500);
    expect(dc.category).toBe('domestic');
  });

  it('issues international credits for international Platinum', async () => {
    const result = await demoWalletService.checkoutSubscription('demo-user', 'Platinum', 'international', 'demo_wallet');
    expect(result.success).toBe(true);
    const dc = result.user.user_metadata.ledger.find((e: any) => e.creditType === 'international_discount');
    expect(dc.amount).toBe(4);
    expect(dc.valuePerCredit).toBe(5000);
    expect(dc.totalValue).toBe(20000);
  });

  it('fails for invalid plan', async () => {
    const result = await demoWalletService.checkoutSubscription('demo-user', 'Diamond', 'domestic', 'demo_wallet');
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run tests/services/demoWalletService.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/services/demoWalletService.ts tests/services/demoWalletService.test.ts
git commit -m "feat(wallet): issue category-tagged discount credits from plan metadata"
```

---

### Task 6: Update DashboardPage for category-split credits

**Files:**
- Modify: `src/DashboardPage.tsx`

**Interfaces:**
- Consumes: `getAvailableCredits`, `getCreditValue`, `CREDIT_VALUE_*` from `src/utils/creditHelpers.ts`; `ALL_PLANS`, `getPlanDetails` from `src/data/siteData.ts`; `TripCategory`, `CreditLedgerEntry` from `src/types.ts`.
- Produces: Domestic/International credit display and admin controls; updated checkout to pass `tripCategory`.

- [ ] **Step 1: Replace local CreditLedgerEntry with imported type**

Remove the local `CreditLedgerEntry` interface in `DashboardPage.tsx` and import from `src/types.ts`.

- [ ] **Step 2: Replace duplicated plan maps**

Remove the local `PLAN_CREDITS`, `PLAN_PRICES`, `PLAN_TYPES` maps (~line 3718). Use helpers:

```ts
import { ALL_PLANS, getPlanDetails } from '../data/siteData';
import { getAvailableCredits, getCreditValue } from '../utils/creditHelpers';

function getPlanSelectOptions(): { id: string; label: string; price: number }[] {
  return ALL_PLANS.map((p) => ({
    id: `${p.name}_${p.tripCategory}`,
    label: `${p.name} ${p.tripCategory === 'international' ? 'International' : 'Domestic'}`,
    price: p.price,
  }));
}
```

- [ ] **Step 3: Parse selected plan in checkout**

Where `selectedPlanId` is used, split into `planName` and `tripCategory`:

```ts
const [selectedPlanName, selectedPlanCategory] = selectedPlanId.includes('_')
  ? selectedPlanId.split('_')
  : [selectedPlanId, 'domestic'];
const selectedPlan = getPlanDetails(selectedPlanName, selectedPlanCategory as TripCategory);
```

Pass both to `demoWalletService.checkoutSubscription(user.id, selectedPlanName, selectedPlanCategory, paymentMethod)`.

- [ ] **Step 4: Split credit balances in My Credits tab**

Replace single `availableDiscountCredits` / `discountCreditBalance` with:

```ts
const availableDomesticCredits = getAvailableCredits(ledger, 'domestic');
const availableInternationalCredits = getAvailableCredits(ledger, 'international');
const domesticCreditBalance = availableDomesticCredits * CREDIT_VALUE_DOMESTIC;
const internationalCreditBalance = availableInternationalCredits * CREDIT_VALUE_INTERNATIONAL;
```

Render two wallet cards instead of one.

- [ ] **Step 5: Update admin add-credit flow**

Change the admin "Add Credits" UI to require selecting Domestic or International, then append a ledger entry:

```ts
const newEntry: CreditLedgerEntry = {
  id: `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`,
  date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  type: 'admin_adjustment',
  creditType: creditCategory === 'international' ? 'international_discount' : 'domestic_discount',
  category: creditCategory,
  amount: Number(creditAmount),
  valuePerCredit: getCreditValue(creditCategory),
  totalValue: Number(creditAmount) * getCreditValue(creditCategory),
  reason: `Admin adjustment: ${reason}`,
  adminRef: `ADMIN-${Date.now()}`,
};
```

- [ ] **Step 6: Update ledger table columns**

Add a `Category` column and render `entry.category`.

- [ ] **Step 7: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/DashboardPage.tsx
git commit -m "feat(dashboard): split domestic/international credits and admin controls"
```

---

### Task 7: Update TourSelection to use explicit category

**Files:**
- Modify: `src/pages/main-website-tour-page/TourSelection.tsx`

**Interfaces:**
- Consumes: `TourPackage.category`.

- [ ] **Step 1: Replace heuristic**

Replace:

```ts
const isIntl = !tour.destination.toLowerCase().includes('india') && 
               !tour.destination.toLowerCase().includes('west bengal') && 
               !tour.destination.toLowerCase().includes('odisha');
```

With:

```ts
const isIntl = tour.category === 'international';
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/main-website-tour-page/TourSelection.tsx
git commit -m "feat(tour-selection): use explicit tour category instead of destination heuristic"
```

---

### Task 8: Update TourBookingForm for category-locked redemption

**Files:**
- Modify: `src/pages/main-website-tour-page/TourBookingForm.tsx`

**Interfaces:**
- Consumes: `getAvailableCredits`, `validateCreditApplication`, `getCategoryErrorMessage`, `CREDIT_VALUE_*` from `src/utils/creditHelpers.ts`; `TripCategory` from `src/types.ts`.

- [ ] **Step 1: Read ledger from user metadata**

Access current user ledger:

```ts
const ledger = currentUser?.user_metadata?.ledger || [];
const availableDomesticCredits = getAvailableCredits(ledger, 'domestic');
const availableInternationalCredits = getAvailableCredits(ledger, 'international');
const tourCategory = selectedTour.category;
```

- [ ] **Step 2: Add credit application UI**

Add a step/control that lets the user choose how many discount credits to apply (0 up to min(availableMatchingCredits, travelerCount)). Show the matching wallet value:

```ts
const matchingCreditValue = tourCategory === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;
const maxApplicable = Math.min(
  tourCategory === 'international' ? availableInternationalCredits : availableDomesticCredits,
  travelers.length
);
```

- [ ] **Step 3: Validate and compute price**

On change or before payment:

```ts
const validation = validateCreditApplication({
  requestedCredits: appliedDiscountCredits,
  tourCategory,
  availableDomesticCredits,
  availableInternationalCredits,
  travelerCount: travelers.length,
});

if (!validation.valid) {
  alert(validation.error);
  setAppliedDiscountCredits(0);
}
```

Compute:

```ts
const discountCreditsTotal = appliedDiscountCredits * matchingCreditValue;
```

Populate `PriceCalculation`:

```ts
appliedDiscountCredits,
discountCreditsTotal,
appliedDomesticCredits: tourCategory === 'domestic' ? appliedDiscountCredits : 0,
appliedInternationalCredits: tourCategory === 'international' ? appliedDiscountCredits : 0,
domesticCreditsTotal: tourCategory === 'domestic' ? discountCreditsTotal : 0,
internationalCreditsTotal: tourCategory === 'international' ? discountCreditsTotal : 0,
```

- [ ] **Step 4: Create redeemed ledger entry on booking confirm**

When booking succeeds, append:

```ts
const redeemedEntry: CreditLedgerEntry = {
  id: `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`,
  date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  type: 'redeemed',
  creditType: tourCategory === 'international' ? 'international_discount' : 'domestic_discount',
  category: tourCategory,
  amount: appliedDiscountCredits,
  valuePerCredit: matchingCreditValue,
  totalValue: discountCreditsTotal,
  reason: `Redeemed for booking ${bookingId}`,
  bookingRef: bookingId,
};
```

Save back to `currentUser.user_metadata.ledger`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/main-website-tour-page/TourBookingForm.tsx
git commit -m "feat(booking): category-locked discount credit redemption"
```

---

### Task 9: Final integration and full test run

**Files:**
- Modify: `vite.config.ts` (add test config)
- Modify: `package.json` (add test script already added in Task 2)

- [ ] **Step 1: Configure Vitest**

Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

- [ ] **Step 2: Run all tests and typecheck**

```bash
npm run typecheck
npx vitest run
```

Expected: all tests pass, typecheck clean.

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts package.json package-lock.json
git commit -m "chore(tests): configure vitest and wire test scripts"
```

---

## Spec Coverage Checklist

| Spec Requirement | Task |
| ---------------- | ---- |
| Domestic DC value ₹500 | Task 2, Task 4 |
| International DC value ₹5,000 | Task 2, Task 4 |
| Domestic plans issue 1/2/4 DC | Task 2 |
| International plans issue 1/2/4 DC | Task 2 |
| International DC blocked on Domestic checkout | Task 4, Task 8 |
| Domestic DC blocked on International checkout | Task 4, Task 8 |
| Exact error messages | Task 4 |
| One credit per person per booking | Task 4, Task 8 |
| Dashboard splits Domestic/International | Task 6 |
| Admin panel shows category | Task 6 |
| Ledger records category | Task 5, Task 6 |
| Demo Wallet follows same rules | Task 5 |

## Placeholder Scan

- No TBD/TODO in task steps.
- Exact values copied from business document.
- No vague "handle edge cases" directives; validation logic is explicit.
