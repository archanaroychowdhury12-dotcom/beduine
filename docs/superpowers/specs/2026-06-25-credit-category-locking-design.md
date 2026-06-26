# Beduin Credit Category Locking Design

## Context

The business document `BEDUIN_TOUR_AND_TRAVELS_UPDATED_TRC_POLICIES_DC_LOCKING.docx` introduces a strict **Discount Credit (DC) category-locking** rule:

- **Domestic Discount Credits** can only be used for Domestic bookings.
- **International Discount Credits** can only be used for International bookings.
- A user must not be able to mix or misuse categories.

The current web app already has subscription plans, a demo wallet, a user dashboard, an admin panel, and a tour booking flow, but it does **not** tag credits by category, does **not** enforce category locking at checkout, and has inconsistent credit counts/values for international plans.

## Goal

Implement the credit category-locking logic end-to-end so that:

1. Subscription checkout issues the correct number and value of Discount Credits per plan category.
2. Domestic and International Discount Credits are stored, displayed, and redeemed separately.
3. The booking/checkout flow blocks cross-category credit usage with clear error messages.
4. The dashboard and admin panel show category-split balances.
5. The immutable credit ledger records the category of every credit transaction.

## Scope

### In scope

- `src/types.ts` — add category-aware types for plans, credits, and ledger entries.
- `src/data/siteData.ts` — normalize plan definitions; fix international credit counts to match the business doc.
- `src/services/demoWalletService.ts` — issue category-tagged credits; derive plan metadata from `siteData.ts`.
- `src/DashboardPage.tsx` — split credit display and admin controls by Domestic / International.
- `src/pages/main-website-tour-page/TourBookingForm.tsx` — redeem credits only when category matches the selected tour.
- `src/pages/main-website-tour-page/TourSelection.tsx` — use explicit category instead of destination-string heuristic.
- `src/data/tours.ts` — add `category` to tour packages.
- Add unit tests covering issuance, redemption blocking, and balance calculation.

### Out of scope

- Lucky draw execution logic (TRC usage is unchanged).
- Real payment gateway integration (demo wallet remains the test path).
- Franchise / agent portal (large enough for a separate project).
- Referral program (separate project).
- UI redesign — changes will be functional, minimal visual updates only where required by the new data.

## Business rules (verbatim from the source document)

### Domestic plans

| Plan   | Price | Discount Credits | Value per Credit | Total Discount Value |
| ------ | ----- | ---------------- | ---------------- | -------------------- |
| Silver | ₹499  | 1                | ₹500             | ₹500                 |
| Gold   | ₹799  | 2                | ₹500             | ₹1,000               |
| Platinum | ₹1,499 | 4             | ₹500             | ₹2,000               |

### International plans

| Plan   | Price   | Discount Credits | Value per Credit | Total Discount Value |
| ------ | ------- | ---------------- | ---------------- | -------------------- |
| Silver | ₹4,999  | 1                | ₹5,000           | ₹5,000               |
| Gold   | ₹7,999  | 2                | ₹5,000           | ₹10,000              |
| Platinum | ₹14,999 | 4              | ₹5,000           | ₹20,000              |

### Locking rules

- Domestic Discount Credits: `credit_category = "domestic"`, `credit_value = 500`, `usable_for = "domestic_only"`.
- International Discount Credits: `credit_category = "international"`, `credit_value = 5000`, `usable_for = "international_only"`.
- A user must not be able to apply International DC on Domestic checkout.
- A user must not be able to apply Domestic DC on International checkout.
- Error messages:
  - International DC on Domestic: "International Discount Credits can only be used for International bookings."
  - Domestic DC on International: "Domestic Discount Credits can only be used for Domestic bookings."
- Maximum one Discount Credit can be used per person per tour booking.
- Multiple Discount Credits cannot be combined for a single person's tour cost.

## Design

### 1. Types

Add to `src/types.ts`:

```ts
export type TripCategory = 'domestic' | 'international';

export interface SubscriptionPlan {
  name: string;
  price: number;
  tripCategory: TripCategory;
  tourValue: number;
  duration: string;
  discountCredits: number;
  discountValue: number;
  paidDiscount: string;
  destinations: string[];
  features: string[];
}

export interface CreditLedgerEntry {
  id: string;
  date: string;
  type: 'issued' | 'reserved' | 'redeemed' | 'reversed' | 'expired' | 'admin_adjustment';
  creditType: 'travel_reward' | 'domestic_discount' | 'international_discount';
  category: TripCategory;
  amount: number;        // count of credits
  valuePerCredit: number;
  totalValue: number;
  reason: string;
  bookingRef?: string;
  adminRef?: string;
}
```

Update `TourPackage` to include:

```ts
export interface TourPackage {
  ...existing fields...
  category: TripCategory;
}
```

Update `PriceCalculation`:

```ts
export interface PriceCalculation {
  ...existing fields...
  appliedDomesticCredits?: number;
  appliedInternationalCredits?: number;
  domesticCreditsTotal?: number;
  internationalCreditsTotal?: number;
}
```

### 2. Plan normalization

- Convert `PLANS` and `INTL_PLANS` in `src/data/siteData.ts` to `SubscriptionPlan[]`.
- Export a single `ALL_PLANS: SubscriptionPlan[] = [...PLANS, ...INTL_PLANS]`.
- Export `getPlanDetails(name, tripCategory): SubscriptionPlan | undefined`.
- Remove duplicated `PLAN_CREDITS`, `PLAN_PRICES`, and `PLAN_TYPES` maps from `demoWalletService.ts` and `DashboardPage.tsx`; derive them from `ALL_PLANS`.
- Fix international credit counts to 1 / 2 / 4.

### 3. Credit issuance

`demoWalletService.checkoutSubscription()` will:

1. Resolve the plan from `ALL_PLANS` by name + category.
2. Issue exactly 1 Travel Reward Credit (`creditType: 'travel_reward'`, no category).
3. Issue `plan.discountCredits` Discount Credits with:
   - `creditType`: `'domestic_discount'` or `'international_discount'`
   - `category`: `'domestic'` or `'international'`
   - `valuePerCredit`: `500` or `5000`
   - `totalValue`: `amount * valuePerCredit`
4. Store the ledger entries in `user_metadata.ledger`.
5. Update `user_metadata` balances:
   - `discount_credits_domestic`
   - `discount_credits_international`
   - Or compute balances from ledger on read (preferred to avoid drift).

### 4. Credit redemption

In `TourBookingForm.tsx`:

1. Determine the selected tour's `category` from `TourPackage.category`.
2. Show a control to apply Discount Credits only if the user has credits matching that category.
3. Validate `appliedCredits <= availableCategoryCredits`.
4. Validate `appliedCredits <= travelers.length` (one credit per person maximum).
5. Block cross-category application and show the exact error message from the business rules.
6. On successful booking, append `redeemed` ledger entries with the correct category and decrement the computed balance.

### 5. Dashboard

- Split the **My Credits** tab into two blocks:
  - Domestic Discount Credits: available count, value per credit (₹500), total value, usable only for Domestic bookings.
  - International Discount Credits: available count, value per credit (₹5,000), total value, usable only for International bookings.
- Update the ledger table to show a `Category` column.
- Update the admin panel to show category-split balances and allow per-category adjustments.

### 6. Tour data

- Add `category` to every entry in `src/data/tours.ts`.
- Update `TourSelection.tsx` to use `tour.category` instead of string-matching destinations.

## Testing strategy

Add unit tests (Vitest or Jest, whichever the project uses; if none, add Vitest) covering:

1. `getPlanDetails()` returns the correct domestic and international plan.
2. `checkoutSubscription()` issues the right number and category of credits for each plan.
3. Redemption logic blocks domestic credits on international tours and vice versa.
4. Redemption logic enforces one credit per person.
5. Ledger balances remain correct after issuance and redemption.

## Risks

- **Data migration:** Existing mock users may have undifferentiated `discount_credits`. On first load, treat legacy balance as Domestic Discount Credits to avoid breaking existing users, or reset demo data.
- **UI complexity:** Splitting credits into two wallets adds dashboard UI work.
- **Scope creep:** The business doc includes franchise, agent, and referral models; this design intentionally defers them.

## Success criteria

- All business rules in Section M of the source document are implemented.
- Cross-category credit application is blocked with the exact required error messages.
- Dashboard and admin panel display Domestic / International credits separately.
- Tests pass for issuance, redemption, and balance calculation.
