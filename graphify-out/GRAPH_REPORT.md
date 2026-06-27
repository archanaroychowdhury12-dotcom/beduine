# Graph Report - .  (2026-06-27)

## Corpus Check
- 234 files · ~3,038,682 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 593 nodes · 968 edges · 29 communities (18 shown, 11 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Policy Pages & Legal Content|Policy Pages & Legal Content]]
- [[_COMMUNITY_Tour Data & Site Configuration|Tour Data & Site Configuration]]
- [[_COMMUNITY_Custom Tour Builder|Custom Tour Builder]]
- [[_COMMUNITY_Subscription & Demo Wallet|Subscription & Demo Wallet]]
- [[_COMMUNITY_Navigation & Layout Components|Navigation & Layout Components]]
- [[_COMMUNITY_App Router & Page Imports|App Router & Page Imports]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Destination Review Images|Destination Review Images]]
- [[_COMMUNITY_Ambient Soundscape Engine|Ambient Soundscape Engine]]
- [[_COMMUNITY_Credit System & Plans|Credit System & Plans]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Auth Pages (LoginRegister)|Auth Pages (Login/Register)]]
- [[_COMMUNITY_Supabase Mock Auth|Supabase Mock Auth]]
- [[_COMMUNITY_Home Extra Sections|Home Extra Sections]]
- [[_COMMUNITY_Scattered Showcase Gallery|Scattered Showcase Gallery]]
- [[_COMMUNITY_Legal Center Page|Legal Center Page]]
- [[_COMMUNITY_Vercel Deploy Config|Vercel Deploy Config]]
- [[_COMMUNITY_Cookie Consent System|Cookie Consent System]]
- [[_COMMUNITY_Credit Category Locking Docs|Credit Category Locking Docs]]
- [[_COMMUNITY_Error Page|Error Page]]
- [[_COMMUNITY_Booking Policy Section|Booking Policy Section]]
- [[_COMMUNITY_Tour Page Intro|Tour Page Intro]]
- [[_COMMUNITY_Verify Coupon Page|Verify Coupon Page]]
- [[_COMMUNITY_Cinematic Showreel Data|Cinematic Showreel Data]]
- [[_COMMUNITY_Demo Checkout Result|Demo Checkout Result]]
- [[_COMMUNITY_Agent Type|Agent Type]]
- [[_COMMUNITY_Franchise Type|Franchise Type]]
- [[_COMMUNITY_Itinerary Day Type|Itinerary Day Type]]

## God Nodes (most connected - your core abstractions)
1. `AmbientSoundscapeSynth` - 19 edges
2. `compilerOptions` - 19 edges
3. `MockAuth` - 18 edges
4. `LEGAL_POLICIES` - 11 edges
5. `TourPackage` - 11 edges
6. `CustomTourRequest` - 11 edges
7. `ImportantNotice()` - 10 edges
8. `LegalPageLayout()` - 10 edges
9. `LegalSection()` - 10 edges
10. `Reveal()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Beduine Tour & Travels Main HTML Page` --conceptually_related_to--> `Credit Category Locking Implementation Plan`  [INFERRED]
  index.html → docs/superpowers/plans/2026-06-25-credit-category-locking.md
- `Subscription Plans SEO Section` --conceptually_related_to--> `SubscriptionPlan Interface`  [INFERRED]
  index.html → docs/superpowers/plans/2026-06-25-credit-category-locking.md
- `Darjeeling Travel Destination` --semantically_similar_to--> `Kashmir Travel Destination`  [INFERRED] [semantically similar]
  public/images/darjeeling_tea_review.png → public/images/kashmir_lake_review.png
- `Darjeeling Travel Destination` --semantically_similar_to--> `Kerala Travel Destination`  [INFERRED] [semantically similar]
  public/images/darjeeling_tea_review.png → public/images/kerala_houseboat_review.png
- `Darjeeling Travel Destination` --semantically_similar_to--> `Sundarbans Travel Destination`  [INFERRED] [semantically similar]
  public/images/darjeeling_tea_review.png → public/images/sundarbans_boat_review.png

## Import Cycles
- None detected.

## Communities (29 total, 11 thin omitted)

### Community 0 - "Policy Pages & Legal Content"
Cohesion: 0.05
Nodes (40): AffiliatePageProps, CancellationPageProps, CookiePageProps, LEGAL_CONTACTS, LEGAL_POLICIES, LegalPolicy, PolicySection, GrievancePageProps (+32 more)

### Community 1 - "Tour Data & Site Configuration"
Cohesion: 0.05
Nodes (51): CreditsTab(), CreditsTabProps, getPlanDetails, ConfirmationScreen(), ConfirmationScreenProps, formatINR(), PaymentSection(), PaymentSectionProps (+43 more)

### Community 2 - "Custom Tour Builder"
Cohesion: 0.07
Nodes (39): Footer(), FooterProps, Navbar(), NavbarProps, BEDUINE_BRAND, DESTINATION_TILES, FEATURED_PAID_TOUR_CARDS, findTourIdByQuery() (+31 more)

### Community 3 - "Subscription & Demo Wallet"
Cohesion: 0.09
Nodes (32): DemoTransaction, DiscountCreditsSection(), NonWinnerGuarantee(), TravelRewardSystem(), Destinations(), Winners(), AboutUs(), HowItWorks() (+24 more)

### Community 4 - "Navigation & Layout Components"
Cohesion: 0.06
Nodes (34): COOKIE_CATEGORIES, CookieCategory, CookieConsentBanner(), CookieModalTrigger(), openCookiePreferenceModal(), CookiePreferenceModal(), CookiePreferenceModalProps, AdminPage (+26 more)

### Community 5 - "App Router & Page Imports"
Cohesion: 0.10
Nodes (31): CustomTourDetailPanel(), CustomTourDetailPanelProps, CustomTourEstimator(), CustomTourEstimatorProps, CustomTourForm(), CustomTourFormProps, CustomTourSuccess(), CustomTourSuccessProps (+23 more)

### Community 6 - "Package Dependencies"
Cohesion: 0.06
Nodes (29): AdminDrawPanel(), AdminDrawPanelProps, BookingsTab(), BookingsTabProps, CustomToursTab(), CustomToursTabProps, NotificationsTab(), NotificationsTabProps (+21 more)

### Community 7 - "Destination Review Images"
Cohesion: 0.06
Nodes (32): dependencies, class-variance-authority, clsx, framer-motion, gsap, lucide-react, @radix-ui/react-slot, react (+24 more)

### Community 8 - "Ambient Soundscape Engine"
Cohesion: 0.11
Nodes (26): Darjeeling Travel Destination, Snow-Capped Himalayan Mountains Backdrop, Darjeeling Tea Garden Review Photo, Darjeeling Tea Plantation Landscape, Tea Plantation Workers Picking Leaves, Dal Lake Srinagar Sunset Scene, Dal Lake Houseboats Background, Kashmir Dal Lake Shikara Review Photo (+18 more)

### Community 9 - "Credit System & Plans"
Cohesion: 0.17
Nodes (5): AmbientSoundscapeSynth, CHIME_FREQUENCIES, SoundscapeType, SubOverlayType, TimerId

### Community 10 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (22): Discount Credit FAQ Entry, How It Works Section (DC Cross-Use Rule), Subscription Plans SEO Section, ALL_PLANS Constant, Credit Helpers Utility Module, CreditLedgerEntry Interface, Dashboard Category-Split Credit Display, demoWalletService Credit Issuance Update (+14 more)

### Community 11 - "Auth Pages (Login/Register)"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution (+13 more)

### Community 12 - "Supabase Mock Auth"
Cohesion: 0.13
Nodes (11): LoginPageProps, ALL_PLANS, RegistrationPageProps, Button, ButtonProps, buttonVariants, WelcomeScreen(), WelcomeScreenProps (+3 more)

### Community 14 - "Scattered Showcase Gallery"
Cohesion: 0.15
Nodes (3): ExtraProps, StatsCounterSection(), useCountUp()

### Community 15 - "Legal Center Page"
Cohesion: 0.15
Nodes (5): CATEGORY_ACCENTS, Destination, RETIRED_POSITIONS, SCATTER_POSITIONS, ScatteredShowcaseProps

### Community 16 - "Vercel Deploy Config"
Cohesion: 0.29
Nodes (6): buildCommand, devCommand, framework, installCommand, outputDirectory, rewrites

### Community 17 - "Cookie Consent System"
Cohesion: 0.67
Nodes (4): Beduine Tour & Travels Main HTML Page, Credit Category Locking Implementation Plan, Credit Category Locking Design Spec, Business Document: BEDUIN_TOUR_AND_TRAVELS_UPDATED_TRC_POLICIES_DC_LOCKING.docx

## Knowledge Gaps
- **189 isolated node(s):** `ErrorPageProps`, `LoginPageProps`, `Destination`, `ScatteredShowcaseProps`, `SCATTER_POSITIONS` (+184 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `supabase` connect `Package Dependencies` to `Tour Data & Site Configuration`, `Subscription & Demo Wallet`, `Navigation & Layout Components`, `Supabase Mock Auth`?**
  _High betweenness centrality (0.247) - this node is a cross-community bridge._
- **Why does `CookieModalTrigger()` connect `Navigation & Layout Components` to `Policy Pages & Legal Content`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `MockAuth` connect `Home Extra Sections` to `Supabase Mock Auth`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `ErrorPageProps`, `LoginPageProps`, `Destination` to the rest of the system?**
  _192 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Policy Pages & Legal Content` be split into smaller, more focused modules?**
  _Cohesion score 0.052982456140350874 - nodes in this community are weakly interconnected._
- **Should `Tour Data & Site Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.05314685314685315 - nodes in this community are weakly interconnected._
- **Should `Custom Tour Builder` be split into smaller, more focused modules?**
  _Cohesion score 0.06821480406386067 - nodes in this community are weakly interconnected._