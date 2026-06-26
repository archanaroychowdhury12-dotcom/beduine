# Graph Report - .  (2026-06-26)

## Corpus Check
- 8 files · ~3,326,035 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 525 nodes · 975 edges · 22 communities (16 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Legal Policies & Disclaimers|Legal Policies & Disclaimers]]
- [[_COMMUNITY_Subscription Landing & Wallet Data|Subscription Landing & Wallet Data]]
- [[_COMMUNITY_Custom Tour Planning & Estimates|Custom Tour Planning & Estimates]]
- [[_COMMUNITY_Tour Booking Flow & Calculations|Tour Booking Flow & Calculations]]
- [[_COMMUNITY_Main Website & Page Shells|Main Website & Page Shells]]
- [[_COMMUNITY_App Routing & Core Views|App Routing & Core Views]]
- [[_COMMUNITY_Project Configuration & Dependencies|Project Configuration & Dependencies]]
- [[_COMMUNITY_Ambient Audio Engine|Ambient Audio Engine]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 21|Community 21]]

## God Nodes (most connected - your core abstractions)
1. `AmbientSoundscapeSynth` - 19 edges
2. `compilerOptions` - 19 edges
3. `MockAuth` - 18 edges
4. `TourPackage` - 12 edges
5. `LEGAL_POLICIES` - 11 edges
6. `Reveal()` - 11 edges
7. `CustomTourRequest` - 11 edges
8. `ImportantNotice()` - 10 edges
9. `LegalPageLayout()` - 10 edges
10. `LegalSection()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Credit Category Locking Concept` --rationale_for--> `CreditLedgerEntry`  [INFERRED]
  docs/superpowers/specs/2026-06-25-credit-category-locking-design.md → src/types.ts
- `Credit Category Locking Concept` --rationale_for--> `demoWalletService`  [INFERRED]
  docs/superpowers/specs/2026-06-25-credit-category-locking-design.md → src/services/demoWalletService.ts
- `Credit Category Locking Implementation Plan` --conceptually_related_to--> `demoWalletService`  [EXTRACTED]
  docs/superpowers/plans/2026-06-25-credit-category-locking.md → src/services/demoWalletService.ts
- `Credit Category Locking Implementation Plan` --conceptually_related_to--> `DashboardPage()`  [EXTRACTED]
  docs/superpowers/plans/2026-06-25-credit-category-locking.md → src/DashboardPage.tsx
- `ConfirmationScreenProps` --references--> `BookingConfirmation`  [EXTRACTED]
  src/pages/main-website-tour-page/BookingConfirmation.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (22 total, 6 thin omitted)

### Community 0 - "Legal Policies & Disclaimers"
Cohesion: 0.05
Nodes (40): AffiliatePageProps, CancellationPageProps, CookiePageProps, LEGAL_CONTACTS, LEGAL_POLICIES, LegalPolicy, PolicySection, GrievancePageProps (+32 more)

### Community 1 - "Subscription Landing & Wallet Data"
Cohesion: 0.06
Nodes (50): ALL_PLANS, AUDIT_REPORTS, DESKTOP_NAV, DESTINATIONS, getPlanDetails(), getPlanName(), getPlanPrice(), HERO_SLIDES (+42 more)

### Community 2 - "Custom Tour Planning & Estimates"
Cohesion: 0.09
Nodes (39): CustomTourDetailPanelProps, CustomTourEstimator(), CustomTourEstimatorProps, CustomTourForm(), CustomTourFormProps, CustomTourSuccess(), CustomTourSuccessProps, DemoAdminControls() (+31 more)

### Community 3 - "Tour Booking Flow & Calculations"
Cohesion: 0.07
Nodes (39): ConfirmationScreen(), ConfirmationScreenProps, formatINR(), PaymentSection(), PaymentSectionProps, ADD_ONS, AddOn, formatINR() (+31 more)

### Community 4 - "Main Website & Page Shells"
Cohesion: 0.09
Nodes (30): Footer(), FooterProps, Navbar(), NavbarProps, BEDUINE_BRAND, DESTINATION_TILES, FEATURED_PAID_TOUR_CARDS, findTourIdByQuery() (+22 more)

### Community 5 - "App Routing & Core Views"
Cohesion: 0.06
Nodes (31): COOKIE_CATEGORIES, CookieCategory, NAV, CookieConsentBanner(), CookieModalTrigger(), openCookiePreferenceModal(), CookiePreferenceModal(), CookiePreferenceModalProps (+23 more)

### Community 6 - "Project Configuration & Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, class-variance-authority, clsx, framer-motion, gsap, lucide-react, @radix-ui/react-slot, react (+21 more)

### Community 7 - "Ambient Audio Engine"
Cohesion: 0.17
Nodes (5): AmbientSoundscapeSynth, CHIME_FREQUENCIES, SoundscapeType, SubOverlayType, TimerId

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (12): LoginPageProps, ALL_PLANS, RegistrationPageProps, Button, ButtonProps, buttonVariants, WelcomeScreen(), WelcomeScreenProps (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (13): CustomTourDetailPanel(), getPlanCredits(), getPlanCreditValue(), Credit Category Locking Implementation Plan, demoWalletService, Credit Category Locking Concept, Beduin Credit Category Locking Design, DashboardPage() (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (3): ExtraProps, StatsCounterSection(), useCountUp()

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (5): CATEGORY_ACCENTS, Destination, RETIRED_POSITIONS, SCATTER_POSITIONS, ScatteredShowcaseProps

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (9): AVAILABLE_VOUCHERS, formatINR(), VoucherSection(), VoucherSectionProps, VOUCHER_PACKS, VoucherPack, VoucherPackModal(), VoucherPackModalProps (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (6): buildCommand, devCommand, framework, installCommand, outputDirectory, rewrites

## Knowledge Gaps
- **147 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+142 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `supabase` connect `Community 9` to `Community 11`, `Subscription Landing & Wallet Data`, `Tour Booking Flow & Calculations`, `App Routing & Core Views`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `MockAuth` connect `Community 10` to `Community 9`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `CookieModalTrigger()` connect `App Routing & Core Views` to `Legal Policies & Disclaimers`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _147 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Legal Policies & Disclaimers` be split into smaller, more focused modules?**
  _Cohesion score 0.052982456140350874 - nodes in this community are weakly interconnected._
- **Should `Subscription Landing & Wallet Data` be split into smaller, more focused modules?**
  _Cohesion score 0.058385093167701865 - nodes in this community are weakly interconnected._
- **Should `Custom Tour Planning & Estimates` be split into smaller, more focused modules?**
  _Cohesion score 0.08853410740203194 - nodes in this community are weakly interconnected._