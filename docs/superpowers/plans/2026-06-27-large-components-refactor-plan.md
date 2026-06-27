# Large Components Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `index.css`, `AdminPage.tsx`, `TourBookingForm.tsx`, and `DashboardPage.tsx` to meet strict line-limit goals by extracting modular styles, subcomponents, hooks, and helpers without modifying logical behavior.

**Architecture:** Separate styling into domain files, encapsulate states/effects/handlers in custom hooks (`useAdminState`, `useTourBookingState`, `useDashboardState`), and extract rendering panels to focused components.

**Tech Stack:** React, Tailwind CSS (V4/import syntax), Vite, Vitest, Supabase Client.

---

### Task 1: CSS Modularization

**Files:**
- Create: `src/styles/theme.css`
- Create: `src/styles/base.css`
- Create: `src/styles/effects.css`
- Create: `src/styles/components.css`
- Modify: `src/index.css`

- [ ] **Step 1: Extract Theme CSS**
  Create `src/styles/theme.css` and move `@theme` directives, keyframe animations (cinematic dust, scratch flashes, wave flows, mesh floats).
- [ ] **Step 2: Extract Base CSS**
  Create `src/styles/base.css` and move base tag rules (`html`, `body`), custom typography, scrollbar styling.
- [ ] **Step 3: Extract Effects CSS**
  Create `src/styles/effects.css` and move custom cursors, film overlays, vignettes, particle bursts, auroras, and floating orbs.
- [ ] **Step 4: Extract Components CSS**
  Create `src/styles/components.css` and move custom layout containers (`.tour-website`), glassmorphism, CTA buttons, Beduine cards, and headers.
- [ ] **Step 5: Simplify index.css**
  Modify `src/index.css` to only contain:
  ```css
  @import "tailwindcss";
  @import "./styles/theme.css";
  @import "./styles/base.css";
  @import "./styles/effects.css";
  @import "./styles/components.css";
  ```
- [ ] **Step 6: Verify build**
  Run: `npm run typecheck`, `npm test`, and `npm run build` to verify styles loaded correctly and compiles.
- [ ] **Step 7: Commit**
  ```bash
  git add src/index.css src/styles
  git commit -m "refactor: modularize index.css into separate files"
  ```

---

### Task 2: Dashboard Utils Extraction

**Files:**
- Create: `src/utils/dashboardUtils.ts`

- [ ] **Step 1: Write helper functions**
  Create `src/utils/dashboardUtils.ts` containing `generateMockParticipants`, `getParticipantVerification`, and `generateRandomToken` from `src/DashboardPage.tsx`.
- [ ] **Step 2: Export functions**
  Ensure all helper functions are exported from `src/utils/dashboardUtils.ts`.
- [ ] **Step 3: Run baseline checks**
  Run: `npm run typecheck`
- [ ] **Step 4: Commit**
  ```bash
  git add src/utils/dashboardUtils.ts
  git commit -m "refactor: extract helper functions to dashboardUtils.ts"
  ```

---

### Task 3: Admin State Hook Extraction

**Files:**
- Create: `src/hooks/useAdminState.ts`

- [ ] **Step 1: Implement useAdminState hook**
  Create `src/hooks/useAdminState.ts` and encapsulate all state variables and action handlers from `src/AdminPage.tsx` (e.g. payout handling, balance modifications, and transactions loading).
- [ ] **Step 2: Run baseline checks**
  Run: `npm run typecheck`
- [ ] **Step 3: Commit**
  ```bash
  git add src/hooks/useAdminState.ts
  git commit -m "refactor: create custom hook useAdminState"
  ```

---

### Task 4: Create Admin Subcomponents

**Files:**
- Create: `src/components/admin/AdminOverviewStats.tsx`
- Create: `src/components/admin/FranchiseDirectoryTable.tsx`
- Create: `src/components/admin/AgentNetworkTable.tsx`
- Create: `src/components/admin/AgentOnboardingControl.tsx`
- Create: `src/components/admin/LedgerModifierPanel.tsx`
- Create: `src/components/admin/SimulatedSystemLogTable.tsx`

- [ ] **Step 1: Extract AdminOverviewStats**
  Create `src/components/admin/AdminOverviewStats.tsx` containing the stat and revenue cards.
- [ ] **Step 2: Extract FranchiseDirectoryTable**
  Create `src/components/admin/FranchiseDirectoryTable.tsx` containing the franchise office directory table.
- [ ] **Step 3: Extract AgentNetworkTable**
  Create `src/components/admin/AgentNetworkTable.tsx` containing the agent list, progress meters, and payout action controls.
- [ ] **Step 4: Extract AgentOnboardingControl**
  Create `src/components/admin/AgentOnboardingControl.tsx` containing the agent registration form.
- [ ] **Step 5: Extract LedgerModifierPanel**
  Create `src/components/admin/LedgerModifierPanel.tsx` containing the detail panel, balance adjustment controls, and individual ledger log.
- [ ] **Step 6: Extract SimulatedSystemLogTable**
  Create `src/components/admin/SimulatedSystemLogTable.tsx` containing the master simulation transaction log.
- [ ] **Step 7: Run baseline checks**
  Run: `npm run typecheck`
- [ ] **Step 8: Commit**
  ```bash
  git add src/components/admin
  git commit -m "refactor: extract admin subcomponents"
  ```

---

### Task 5: Refactor AdminPage.tsx

**Files:**
- Modify: `src/AdminPage.tsx`

- [ ] **Step 1: Simplify AdminPage.tsx**
  Modify `src/AdminPage.tsx` to import `useAdminState` and the subcomponents, keeping only the access check, top navigation header structure, and mounting the subcomponents with props. Ensure it remains under 200 lines.
- [ ] **Step 2: Run verification**
  Run: `npm run typecheck`, `npm test`, and `npm run build`
- [ ] **Step 3: Commit**
  ```bash
  git add src/AdminPage.tsx
  git commit -m "refactor: simplify AdminPage.tsx orchestrator"
  ```

---

### Task 6: Tour Booking Hook Extraction

**Files:**
- Create: `src/hooks/useTourBookingState.ts`

- [ ] **Step 1: Implement useTourBookingState**
  Create `src/hooks/useTourBookingState.ts` capturing traveler roster syncs, pickup locations, pricing calculation memos, payment processing intervals, and ledger adjustments.
- [ ] **Step 2: Run checks**
  Run: `npm run typecheck`
- [ ] **Step 3: Commit**
  ```bash
  git add src/hooks/useTourBookingState.ts
  git commit -m "refactor: create custom hook useTourBookingState"
  ```

---

### Task 7: Refactor TourBookingForm.tsx

**Files:**
- Modify: `src/pages/main-website-tour-page/TourBookingForm.tsx`

- [ ] **Step 1: Simplify TourBookingForm.tsx**
  Modify `src/pages/main-website-tour-page/TourBookingForm.tsx` to integrate `useTourBookingState`. Remove state and pricing logic, keeping only the stepper layout and step Accordions. Ensure it remains under 280 lines.
- [ ] **Step 2: Run verification**
  Run: `npm run typecheck`, `npm test`, and `npm run build`
- [ ] **Step 3: Commit**
  ```bash
  git add src/pages/main-website-tour-page/TourBookingForm.tsx
  git commit -m "refactor: simplify TourBookingForm.tsx orchestrator"
  ```

---

### Task 8: Dashboard Hook Extraction

**Files:**
- Create: `src/hooks/useDashboardState.ts`

- [ ] **Step 1: Implement useDashboardState**
  Create `src/hooks/useDashboardState.ts` consolidating profile forms, demo wallets, custom support query handlers, weekly draws, local storage sync, and auth session sync.
- [ ] **Step 2: Run checks**
  Run: `npm run typecheck`
- [ ] **Step 3: Commit**
  ```bash
  git add src/hooks/useDashboardState.ts
  git commit -m "refactor: create custom hook useDashboardState"
  ```

---

### Task 9: Refactor DashboardPage.tsx

**Files:**
- Modify: `src/DashboardPage.tsx`

- [ ] **Step 1: Simplify DashboardPage.tsx**
  Modify `src/DashboardPage.tsx` to call `useDashboardState`. Clean up state declarations and mock generators, keeping only layout panels and tab routers. Ensure it remains under 250 lines.
- [ ] **Step 2: Run verification**
  Run: `npm run typecheck`, `npm test`, and `npm run build`
- [ ] **Step 3: Commit**
  ```bash
  git add src/DashboardPage.tsx
  git commit -m "refactor: simplify DashboardPage.tsx orchestrator"
  ```
