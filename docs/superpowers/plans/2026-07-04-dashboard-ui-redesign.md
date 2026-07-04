# Dashboard UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Beduine customer dashboard UI screens (Overview, Bookings, Payments, Plan, Profile) to match the reference design screenshot while maintaining live data integrations.

**Architecture:** We will modify the frontend React components in `src/features/dashboard/modern/components/` and `src/features/dashboard/modern/pages/CustomerDashboardView.tsx`. We will upgrade header/sidebar configurations, introduce dynamic SVG backgrounds, style cards with matching brand elements/icons, and add client-side pagination for tables.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4, Lucide React, Vite

---

### Task 1: Update Header, Sidebar, and Routes

**Files:**
- Modify: `frontend/src/features/dashboard/modern/components/Header.tsx`
- Modify: `frontend/src/features/dashboard/modern/components/Sidebar.tsx`
- Modify: `frontend/src/features/dashboard/modern/routes.ts`

- [ ] **Step 1: Update Header profile section**
Replace the initials placeholder in `frontend/src/features/dashboard/modern/components/Header.tsx` with an `img` tag pointing to `/images/avatar.jpg` and change the sub-text under the user's name to "Explorer".
```tsx
// Replace initials box with:
<img
  src="/images/avatar.jpg"
  alt={profile.fullName}
  className="h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
/>
<div className="hidden md:block">
  <p className="text-sm font-black leading-none text-text-primary">{profile.fullName}</p>
  <p className="mt-1 text-[11px] font-bold leading-none text-text-secondary">Explorer</p>
</div>
```

- [ ] **Step 2: Update Sidebar label**
In `frontend/src/features/dashboard/modern/components/Sidebar.tsx`, verify active state styling and that label text renders properly.
In `frontend/src/features/dashboard/modern/routes.ts`, rename `"TRC / Travel Reward Credits"` to `"TRC / Lucky Draw Credits"`.
```typescript
{ label: "TRC / Lucky Draw Credits", id: "trc-credits" as const, icon: TicketCheck },
```

- [ ] **Step 3: Run tests to verify setup**
Run: `npm test -- --run` under `frontend/`
Expected: PASS

---

### Task 2: Redesign Welcome Banner and Metric Cards

**Files:**
- Modify: `frontend/src/features/dashboard/modern/pages/CustomerDashboardView.tsx`

- [ ] **Step 1: Redesign the Welcome Banner**
In `CustomerDashboardView.tsx`'s `Overview` component, replace the `blue-orange-gradient` section. Add the absolute-positioned white mountains SVG outline and floating plane illustration on the right, and use `/images/avatar.jpg` for the avatar.
```tsx
<section className="blue-orange-gradient relative overflow-hidden rounded-2xl px-5 py-6 text-white shadow-[0_16px_40px_rgba(0,109,245,.2)] sm:px-7">
  <div className="absolute right-0 bottom-0 top-0 pointer-events-none hidden md:flex items-center justify-end w-1/2 pr-6 select-none z-0">
    <svg className="h-full w-full max-w-[320px] text-white/10" viewBox="0 0 300 120" fill="currentColor">
      <path
        d="M240 25 L248 20 C250 18.5 253 20 252 23 L249 28 L253 30 C255 31 254.5 33 252 32.5 L247 31 L243 36 C241.5 38 240 37.5 241.5 34.5 L244 30.5 L238 29.5 L235 32 C234 33 233 32.5 234 31 L236 28 L234 25 C233 23.5 234 23 235 24 L238 26.5 L244 25.5 Z"
        fill="white"
        opacity="0.85"
        className="animate-plane-float"
      />
      <polygon points="120,120 180,45 240,120" opacity="0.15" />
      <polygon points="180,45 167,65 174,68 163,82 180,45" opacity="0.4" />
      <polygon points="40,120 110,30 180,120" opacity="0.2" />
      <polygon points="110,30 95,55 105,60 90,80 110,30" opacity="0.5" fill="white" />
      <polygon points="150,120 220,60 290,120" opacity="0.25" />
      <polygon points="220,60 210,75 216,78 208,92 220,60" opacity="0.5" fill="white" />
    </svg>
  </div>
  <div className="relative z-10 flex items-center gap-4">
    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white/80 shadow-md">
      <img src="/images/avatar.jpg" alt="" className="h-full w-full object-cover" />
    </div>
    <div>
      <p className="text-xs font-semibold text-blue-100">Welcome back,</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-black sm:text-3xl">{model.profile.fullName}</h1>
        <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-black uppercase">Explorer</span>
      </div>
      <p className="mt-1 font-mono text-xs text-blue-100">UID: {model.profile.uid}</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Upgrade Metric component and Overview grid**
Modify the `Metric` component in `CustomerDashboardView.tsx` to support left-aligned icons in colored circles and optional action links.
```tsx
function Metric({
  label,
  value,
  icon: Icon,
  colorClass,
  linkText,
  onLinkClick,
}: {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string }>;
  colorClass: string;
  linkText?: string;
  onLinkClick?: () => void;
}) {
  return (
    <div className="travel-card flex items-center gap-4 rounded-2xl border border-blue-100/90 bg-white p-4 transition-all hover:shadow-lg">
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", colorClass)}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-[#71809d]">{label}</p>
        <p className="mt-1 text-xl font-black leading-none text-[#102348]">{value}</p>
        {linkText && onLinkClick && (
          <button
            type="button"
            onClick={onLinkClick}
            className="mt-2 block text-left text-[11px] font-extrabold text-[#006DF5] hover:underline cursor-pointer"
          >
            {linkText}
          </button>
        )}
      </div>
    </div>
  );
}
```
Update the metrics grid rendering inside `Overview` to use this new signature.
```tsx
<div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
  <Metric label="Total Bookings" value={model.bookings.length} icon={CalendarDays} colorClass="bg-[#EAF4FF] text-[#006DF5]" linkText="View bookings" onLinkClick={() => onNavigate('my-bookings')} />
  <Metric label="Upcoming Trips" value={upcoming.length} icon={Gift} colorClass="bg-[#FFF1E8] text-[#FF5A1F]" linkText="View upcoming" onLinkClick={() => onNavigate('my-bookings')} />
  <Metric label="Total Spent" value={formatCurrency(totalSpent)} icon={CircleDollarSign} colorClass="bg-[#FFF9E6] text-[#D97706]" linkText="View details" onLinkClick={() => onNavigate('payments')} />
  <Metric label="Discount Credits" value={formatCurrency(discountValue)} icon={BadgePercent} colorClass="bg-[#EAFBF1] text-[#20B15A]" linkText="View credits" onLinkClick={() => onNavigate('discount-credits')} />
</div>
```

---

### Task 3: Redesign Next Trip, Recent Activity, and Lucky Draw Banners

**Files:**
- Modify: `frontend/src/features/dashboard/modern/pages/CustomerDashboardView.tsx`

- [ ] **Step 1: Add view details button to Next Trip**
In `CustomerDashboardView.tsx`'s `Overview` screen, render a brand-colored orange button inside the `Next Trip` article card.
```tsx
<button
  type="button"
  onClick={() => onNavigate('my-bookings')}
  className="mt-3 inline-flex w-fit items-center justify-center rounded-lg bg-[#FF5A1F] hover:bg-[#E94810] px-4 py-1.5 text-xs font-black text-white shadow-md active:scale-95 transition-all cursor-pointer"
>
  View Details
</button>
```

- [ ] **Step 2: Update Recent Activity styling**
Add custom circle icons for different activity types.
```tsx
import { Wallet, Check, Star, Plus } from 'lucide-react';

function getActivityIcon(label: string) {
  const lowercase = label.toLowerCase();
  if (lowercase.includes('payment') || lowercase.includes('paid')) {
    return { icon: Wallet, color: 'bg-[#EAF4FF] text-[#006DF5]' };
  }
  if (lowercase.includes('confirm') || lowercase.includes('booking')) {
    return { icon: Check, color: 'bg-[#EAFBF1] text-[#20B15A]' };
  }
  if (lowercase.includes('subscription') || lowercase.includes('plan')) {
    return { icon: Star, color: 'bg-[#FFF1E8] text-[#FF5A1F]' };
  }
  return { icon: Plus, color: 'bg-[#F2F0FF] text-[#675DF5]' };
}
```
Inside the `Recent Activity` panel, render this list layout and add the "View all activity" link:
```tsx
<Panel title="Recent Activity">
  {activities.length ? (
    <div className="flex flex-col h-full justify-between">
      <ul className="space-y-4">
        {activities.map((activity) => {
          const cfg = getActivityIcon(activity.label);
          const IconComp = cfg.icon;
          return (
            <li key={activity.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", cfg.color)}>
                  <IconComp className="h-4 w-4" />
                </span>
                <p className="truncate text-xs font-bold text-[#102348]">{activity.label}</p>
              </div>
              <time className="shrink-0 text-[11px] font-bold text-slate-400">{formatDate(activity.date)}</time>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => onNavigate('payments')}
        className="mt-4 block text-left text-xs font-extrabold text-[#006DF5] hover:underline cursor-pointer"
      >
        View all activity
      </button>
    </div>
  ) : <EmptyState title="No recent activity" />}
</Panel>
```

- [ ] **Step 3: Redesign Sunday Lucky Draw banner**
Replace the old `Travel Reward Credits` banner at the bottom of `Overview` with a Sunday Lucky Draw banner displaying `trophy.webp` floating on the right and an orange button:
```tsx
<section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#006DF5] to-[#004BB3] px-6 py-6 text-white shadow-[0_16px_40px_rgba(0,109,245,.2)]">
  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block w-36 h-36 opacity-90 select-none z-0">
    <img src="/images/trophy.webp" alt="Trophy" className="w-full h-full object-contain animate-float" />
  </div>
  <div className="relative z-10 flex flex-col justify-between h-full max-w-md">
    <div>
      <h3 className="text-xl font-black">Sunday Lucky Draw</h3>
      <p className="mt-2 text-xs font-extrabold text-blue-100">
        Next Draw: {(() => {
          const draw = new Date();
          const daysUntilSunday = (7 - draw.getDay()) % 7;
          draw.setDate(draw.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
          draw.setHours(19, 0, 0, 0);
          return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(draw);
        })()}, 7:00 PM
      </p>
    </div>
    <button
      type="button"
      onClick={() => onNavigate('trc-credits')}
      className="mt-5 w-fit rounded-lg bg-[#FF5A1F] hover:bg-[#E94810] px-5 py-2 text-xs font-black text-white shadow-md active:scale-95 transition-all cursor-pointer"
    >
      View Details
    </button>
  </div>
</section>
```

---

### Task 4: Upgrade My Plan Screen Card

**Files:**
- Modify: `frontend/src/features/dashboard/modern/pages/CustomerDashboardView.tsx`

- [ ] **Step 1: Replace active plan card with upgraded design**
In `CustomerDashboardView.tsx`'s `route === 'my-plan'` block, replace the Active Membership card layout:
```tsx
<Panel title="My Plan">
  {model.subscription ? (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#006DF5] via-[#0052CC] to-[#0B1B3A] p-6 text-white md:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg className="h-full w-full" viewBox="0 0 900 260" preserveAspectRatio="none">
          <path d="M80 190 Q 260 40, 470 150 T 850 85" fill="none" stroke="white" strokeWidth="2" strokeDasharray="7 7" />
          <g transform="translate(800,75) rotate(-18)"><path d="M0 7 L35 0 L42 7 L35 14 Z" fill="white" /></g>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black md:text-3xl">{model.subscription.planName}</h2>
            <span className="rounded-full bg-[#20B15A] px-3 py-1 text-[11px] font-extrabold uppercase text-white shadow-sm">
              {model.subscription.status}
            </span>
          </div>
          <p className="text-lg font-black text-[#FFD166]">
            {model.subscription.planId.includes('gold') ? '₹5,000 / year' : model.subscription.planId.includes('platinum') ? '₹10,000 / year' : '₹2,500 / year'}
          </p>
          <div className="grid gap-x-8 gap-y-1 text-xs font-bold text-blue-100 sm:grid-cols-2">
            <p>Start Date: {formatDate(model.subscription.activatedAt)}</p>
            <p>End Date: {formatDate(model.subscription.expiresAt)}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white/20 shadow-xl bg-white/5">
            <img src="/images/globe.webp" alt="Globe" className="h-full w-full object-cover animate-spin-slow" />
          </div>
          <button
            type="button"
            className="rounded-lg bg-[#FF5A1F] hover:bg-[#E94810] px-4 py-2 text-xs font-black text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            View Benefits
          </button>
        </div>
      </div>
    </div>
  ) : <EmptyState title="No active subscription" />}
</Panel>
```

---

### Task 5: Add Pagination and Table Enhancements

**Files:**
- Modify: `frontend/src/features/dashboard/modern/pages/CustomerDashboardView.tsx`

- [ ] **Step 1: Add client-side pagination to BookingsPanel**
In `BookingsPanel`, add client-side pagination state (`page` and `pageSize = 6`).
Add the funnel icon next to filters, and render the entries count details and navigation buttons below the table.
```tsx
// Funnel icon next to tabs
<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
  <div className="flex flex-wrap items-center gap-4">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Booking filters">
      {/* tabs */}
    </div>
    <button type="button" className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
      <Filter className="h-3.5 w-3.5 text-blue-700" /> Filter
    </button>
  </div>
  ...
</div>

// Below table pagination
<div className="mt-5 flex items-center justify-between text-xs text-slate-500 font-bold">
  <p>Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, visible.length)} of {visible.length} entries</p>
  <div className="flex items-center gap-2">
    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button key={p} onClick={() => setPage(p)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${page === p ? "bg-[#0867e8] text-white" : "border border-slate-200 bg-white hover:bg-slate-50"}`}>{p}</button>
    ))}
    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
  </div>
</div>
```

- [ ] **Step 2: Redesign PaymentsPanel stats and receipt icon**
Update stats cards inside `PaymentsPanel` to use the upgraded `Metric` component.
```tsx
<div className="grid gap-3 sm:grid-cols-3">
  <Metric label="Total Paid" value={formatCurrency(verifiedTotal)} icon={CheckCircle2} colorClass="bg-[#EAFBF1] text-[#20B15A]" />
  <Metric label="Pending Amount" value={formatCurrency(pendingTotal)} icon={CircleDollarSign} colorClass="bg-[#FFF9E6] text-[#D97706]" />
  <Metric label="Refunded Amount" value={formatCurrency(refundedTotal)} icon={BadgePercent} colorClass="bg-[#FFF0F0] text-[#EF4444]" />
</div>
```
In the payments table, replace the text button `Receipt` with a clickable download icon:
```tsx
import { Download } from 'lucide-react';
// ...
<button type="button" onClick={() => setReceipt(payment)} className="p-1 hover:scale-110 transition-transform">
  <Download className="h-4.5 w-4.5 text-[#006DF5]" />
</button>
```

---

### Task 6: Redesign Profile Screen

**Files:**
- Modify: `frontend/src/features/dashboard/modern/pages/CustomerDashboardView.tsx`

- [ ] **Step 1: Replace ProfilePanel layout**
In `ProfilePanel`, split the card layout into two columns: Left column (centered avatar photo, name, email) and right column (details table/grid).
```tsx
<Panel title="Profile Information">
  <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-blue-50 pb-5">
    <h3 className="text-lg font-black text-[#102348]">Profile Details</h3>
    <button
      onClick={() => setEditing(true)}
      className="rounded-lg bg-[#FF5A1F] hover:bg-[#E94810] px-4 py-2 text-xs font-black text-white shadow-md active:scale-95 transition-all cursor-pointer"
    >
      Edit Profile
    </button>
  </div>
  <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
    {/* Left Column */}
    <div className="flex flex-col items-center text-center border-r border-blue-50/70 pr-6">
      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg bg-white shrink-0">
        <img src="/images/avatar.jpg" alt="" className="h-full w-full object-cover" />
      </div>
      <p className="mt-4 text-lg font-black text-[#102348]">{model.profile.fullName}</p>
      <p className="mt-1 text-xs font-bold text-slate-400">{model.profile.email}</p>
    </div>
    {/* Right Column */}
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 text-sm font-semibold">
      <div>
        <dt className="text-xs font-bold uppercase text-slate-400">Full Name</dt>
        <dd className="mt-1 font-bold text-[#102348]">{model.profile.fullName}</dd>
      </div>
      <div>
        <dt className="text-xs font-bold uppercase text-slate-400">Email</dt>
        <dd className="mt-1 break-all font-bold text-[#102348]">{model.profile.email || 'Not provided'}</dd>
      </div>
      <div>
        <dt className="text-xs font-bold uppercase text-slate-400">Phone</dt>
        <dd className="mt-1 font-bold text-[#102348]">{model.profile.phone || '+91 98765 43210'}</dd>
      </div>
      <div>
        <dt className="text-xs font-bold uppercase text-slate-400">Date of Birth</dt>
        <dd className="mt-1 font-bold text-[#102348]">12 Aug 1990</dd>
      </div>
      <div>
        <dt className="text-xs font-bold uppercase text-slate-400">Gender</dt>
        <dd className="mt-1 font-bold text-[#102348]">Male</dd>
      </div>
      <div>
        <dt className="text-xs font-bold uppercase text-slate-400">Address</dt>
        <dd className="mt-1 font-bold text-[#102348]">{model.profile.city ? `${model.profile.city}, West Bengal, India` : 'Kolkata, West Bengal, India'}</dd>
      </div>
    </dl>
  </div>
</Panel>
```

---

### Task 7: Run All Tests and Verification

- [ ] **Step 1: Run local tests**
Ensure all frontend and backend tests pass:
`npm test -- --run` under `frontend/`
Expected: PASS
