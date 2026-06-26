# Graph Report - .  (2026-06-26)

## Corpus Check
- 34 files · ~3,343,964 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 555 nodes · 917 edges · 33 communities (19 shown, 14 thin omitted)
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
- [[_COMMUNITY_Vite Build Config|Vite Build Config]]
- [[_COMMUNITY_Cinematic Showreel Data|Cinematic Showreel Data]]
- [[_COMMUNITY_Demo Checkout Result|Demo Checkout Result]]
- [[_COMMUNITY_Agent Type|Agent Type]]
- [[_COMMUNITY_Franchise Type|Franchise Type]]
- [[_COMMUNITY_Itinerary Day Type|Itinerary Day Type]]
- [[_COMMUNITY_Plan Data Type|Plan Data Type]]
- [[_COMMUNITY_Trip Category Type|Trip Category Type]]
- [[_COMMUNITY_Credit Validation Result|Credit Validation Result]]
- [[_COMMUNITY_Credit Value Helper|Credit Value Helper]]

## God Nodes (most connected - your core abstractions)
1. `AmbientSoundscapeSynth` - 19 edges
2. `compilerOptions` - 19 edges
3. `MockAuth` - 18 edges
4. `LEGAL_POLICIES` - 11 edges
5. `TourPackage` - 11 edges
6. `ImportantNotice()` - 10 edges
7. `LegalPageLayout()` - 10 edges
8. `LegalSection()` - 10 edges
9. `Reveal()` - 10 edges
10. `CustomTourRequest` - 10 edges

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

## Hyperedges (group relationships)
- **Credit Category Locking End-to-End Flow** — plans_trip_category, plans_credit_ledger_entry, plans_get_available_credits, plans_validate_credit_application, plans_get_category_error_message, plans_demo_wallet_service, plans_tour_booking_form_redemption [EXTRACTED 1.00]
- **Plan Metadata Single Source of Truth Pattern** — plans_all_plans, plans_get_plan_details, plans_subscription_plan, specs_plan_normalization [EXTRACTED 1.00]
- **Cross-Category Credit Blocking Rules** — plans_discount_credit_category_locking, specs_locking_rules, index_discount_credit_faq, index_how_it_works [EXTRACTED 1.00]
- **** — images_darjeeling_tea_review_image, images_kashmir_lake_review_image, images_kerala_houseboat_review_image, images_sundarbans_boat_review_image [INFERRED 0.95]
- **** — images_kashmir_lake_review_shikara_boat, images_kerala_houseboat_review_kettuvallam, images_sundarbans_boat_review_safari_boat [INFERRED 0.85]
- **** — images_passport_journey_eu_passport, images_passport_journey_boarding_pass, images_passport_journey_airline_ticket [EXTRACTED 1.00]

## Communities (33 total, 14 thin omitted)

### Community 0 - "Policy Pages & Legal Content"
Cohesion: 0.06
Nodes (37): AffiliatePageProps, CancellationPageProps, CookiePageProps, LEGAL_CONTACTS, LEGAL_POLICIES, LegalPolicy, PolicySection, GrievancePageProps (+29 more)

### Community 1 - "Tour Data & Site Configuration"
Cohesion: 0.05
Nodes (54): getPlanDetails, AVAILABLE_VOUCHERS, FAQ_ITEMS, FEATURED_DESTINATIONS, TESTIMONIALS, ConfirmationScreen(), ConfirmationScreenProps, formatINR() (+46 more)

### Community 2 - "Custom Tour Builder"
Cohesion: 0.08
Nodes (35): CustomTourDetailPanel(), CustomTourDetailPanelProps, CustomTourEstimator(), CustomTourEstimatorProps, CustomTourForm(), CustomTourFormProps, CustomTourSuccess(), CustomTourSuccessProps (+27 more)

### Community 3 - "Subscription & Demo Wallet"
Cohesion: 0.09
Nodes (32): DemoTransaction, DiscountCreditsSection(), NonWinnerGuarantee(), TravelRewardSystem(), Destinations(), Winners(), AboutUs(), HowItWorks() (+24 more)

### Community 4 - "Navigation & Layout Components"
Cohesion: 0.09
Nodes (30): Footer(), FooterProps, Navbar(), NavbarProps, BEDUINE_BRAND, DESTINATION_TILES, FEATURED_PAID_TOUR_CARDS, findTourIdByQuery() (+22 more)

### Community 5 - "App Router & Page Imports"
Cohesion: 0.07
Nodes (28): openCookiePreferenceModal(), AffiliateAgentPolicyPage, CancellationPolicyPage, CookiePolicyPage, DashboardPage, ErrorPage, GrievanceRedressalPage, LegalCenterPage (+20 more)

### Community 6 - "Package Dependencies"
Cohesion: 0.06
Nodes (32): dependencies, class-variance-authority, clsx, framer-motion, gsap, lucide-react, @radix-ui/react-slot, react (+24 more)

### Community 7 - "Destination Review Images"
Cohesion: 0.11
Nodes (26): Darjeeling Travel Destination, Snow-Capped Himalayan Mountains Backdrop, Darjeeling Tea Garden Review Photo, Darjeeling Tea Plantation Landscape, Tea Plantation Workers Picking Leaves, Dal Lake Srinagar Sunset Scene, Dal Lake Houseboats Background, Kashmir Dal Lake Shikara Review Photo (+18 more)

### Community 8 - "Ambient Soundscape Engine"
Cohesion: 0.17
Nodes (5): AmbientSoundscapeSynth, CHIME_FREQUENCIES, SoundscapeType, SubOverlayType, TimerId

### Community 9 - "Credit System & Plans"
Cohesion: 0.11
Nodes (22): Discount Credit FAQ Entry, How It Works Section (DC Cross-Use Rule), Subscription Plans SEO Section, ALL_PLANS Constant, Credit Helpers Utility Module, CreditLedgerEntry Interface, Dashboard Category-Split Credit Display, demoWalletService Credit Issuance Update (+14 more)

### Community 10 - "TypeScript Configuration"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution (+13 more)

### Community 11 - "Auth Pages (Login/Register)"
Cohesion: 0.14
Nodes (12): LoginPageProps, ALL_PLANS, RegistrationPageProps, Button, ButtonProps, buttonVariants, WelcomeScreen(), WelcomeScreenProps (+4 more)

### Community 13 - "Home Extra Sections"
Cohesion: 0.15
Nodes (3): ExtraProps, StatsCounterSection(), useCountUp()

### Community 14 - "Scattered Showcase Gallery"
Cohesion: 0.15
Nodes (5): CATEGORY_ACCENTS, Destination, RETIRED_POSITIONS, SCATTER_POSITIONS, ScatteredShowcaseProps

### Community 15 - "Legal Center Page"
Cohesion: 0.28
Nodes (5): LegalCenterPageProps, PolicyCard(), PolicyCardProps, PolicySearch(), PolicySearchProps

### Community 16 - "Vercel Deploy Config"
Cohesion: 0.29
Nodes (6): buildCommand, devCommand, framework, installCommand, outputDirectory, rewrites

### Community 17 - "Cookie Consent System"
Cohesion: 0.40
Nodes (4): COOKIE_CATEGORIES, CookieCategory, CookiePreferenceModal(), CookiePreferenceModalProps

### Community 18 - "Credit Category Locking Docs"
Cohesion: 0.67
Nodes (4): Beduine Tour & Travels Main HTML Page, Credit Category Locking Implementation Plan, Credit Category Locking Design Spec, Business Document: BEDUIN_TOUR_AND_TRAVELS_UPDATED_TRC_POLICIES_DC_LOCKING.docx

## Knowledge Gaps
- **175 isolated node(s):** `LoginPage`, `RegistrationPage`, `DashboardPage`, `ErrorPage`, `PaidTourPage` (+170 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `supabase` connect `Auth Pages (Login/Register)` to `Tour Data & Site Configuration`, `Custom Tour Builder`, `Subscription & Demo Wallet`, `App Router & Page Imports`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **Why does `CookieModalTrigger()` connect `Policy Pages & Legal Content` to `App Router & Page Imports`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `MockAuth` connect `Supabase Mock Auth` to `Auth Pages (Login/Register)`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `LoginPage`, `RegistrationPage`, `DashboardPage` to the rest of the system?**
  _178 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Policy Pages & Legal Content` be split into smaller, more focused modules?**
  _Cohesion score 0.05921325051759834 - nodes in this community are weakly interconnected._
- **Should `Tour Data & Site Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.05200341005967604 - nodes in this community are weakly interconnected._
- **Should `Custom Tour Builder` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._