# Graph Report - wayrest  (2026-05-09)

## Corpus Check
- 46 files · ~27,012 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 337 nodes · 345 edges · 39 communities (32 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afd6b8a9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Stay Detail Core|Stay Detail Core]]
- [[_COMMUNITY_Listing Card & Grid|Listing Card & Grid]]
- [[_COMMUNITY_Slug Routing & API|Slug Routing & API]]
- [[_COMMUNITY_Listing Types & Card UI|Listing Types & Card UI]]
- [[_COMMUNITY_Stay Detail UI & Tests|Stay Detail UI & Tests]]
- [[_COMMUNITY_Search Bar Components|Search Bar Components]]
- [[_COMMUNITY_Config & Design System|Config & Design System]]
- [[_COMMUNITY_Project Docs & Design|Project Docs & Design]]
- [[_COMMUNITY_Listings API|Listings API]]
- [[_COMMUNITY_Search Types|Search Types]]
- [[_COMMUNITY_Supabase Composable|Supabase Composable]]
- [[_COMMUNITY_Search Bar Logic|Search Bar Logic]]
- [[_COMMUNITY_Nuxt Config|Nuxt Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Vitest Config|Vitest Config]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]
- [[_COMMUNITY_App Header|App Header]]
- [[_COMMUNITY_Homepage|Homepage]]
- [[_COMMUNITY_Test Config|Test Config]]
- [[_COMMUNITY_Project README|Project README]]
- [[_COMMUNITY_Claude Instructions|Claude Instructions]]
- [[_COMMUNITY_SEO Config|SEO Config]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]

## God Nodes (most connected - your core abstractions)
1. `SPEC-006 — Booking System` - 12 edges
2. `Stay Detail Page ([slug].vue)` - 12 edges
3. `GET /api/stays/[slug] handler` - 10 edges
4. `Wayrest Design System` - 9 edges
5. `SPEC-005 — Listing Detail Page` - 9 edges
6. `SPEC-004 — Homepage` - 9 edges
7. `Listing` - 9 edges
8. `SPEC-XXX — Component Name` - 7 edges
9. `Wayrest — Project Constitution` - 7 edges
10. `SPEC-003 — ListingGrid` - 7 edges

## Surprising Connections (you probably didn't know these)
- `RawListing` --semantically_similar_to--> `Listing`  [INFERRED] [semantically similar]
  server/api/stays/[slug].get.ts → app/types/listing.ts
- `Slug format: kebab-case-title-{id} for URL-safe, id-extractable routing` --rationale_for--> `GET /api/stays/[slug] handler`  [INFERRED]
  specs/features/SPEC-005-listing-detail.md → server/api/stays/[slug].get.ts
- `RawImage` --semantically_similar_to--> `ListingImage`  [INFERRED] [semantically similar]
  server/api/stays/[slug].get.ts → app/types/listing.ts
- `RawHost` --semantically_similar_to--> `Host`  [INFERRED] [semantically similar]
  server/api/stays/[slug].get.ts → app/types/listing.ts
- `SPEC-005 Listing Detail Page` --references--> `ListingCard component`  [EXTRACTED]
  specs/features/SPEC-005-listing-detail.md → app/components/ListingCard.vue

## Hyperedges (group relationships)
- **Listing Display Pipeline: API → ListingGrid → ListingCard** — listings_get, listinggrid_vue, listingcard_vue [EXTRACTED 1.00]
- **Search Flow: SearchBar → SearchParams → index.vue handler** — searchbar_vue, search_types, index_vue, searchbar_handlesubmit [EXTRACTED 1.00]
- **Spec-Driven Development Feature Flow** — sdd_principle, spec_template, spec001_listingcard [INFERRED 0.85]
- **Homepage Component Composition** — spec004_homepage, spec002_searchbar, spec003_listinggrid [EXTRACTED 1.00]
- **Slug-based Listing Detail Routing Pipeline** — slugify_slugify, slug_get_handler, slug_vue, listing_listingdetail [INFERRED 0.95]
- **Listing Type System (Listing, ListingDetail, Image, Host, Responses)** — listing_listing, listing_listingdetail, listing_listingimage, listing_host, listing_listingdetailresponse, listing_listingsresponse [EXTRACTED 1.00]
- **Supabase Direct Init Pattern in Server API Handlers** — listings_get_handler, slug_get_handler, spec_gap_supabase_init [INFERRED 0.95]

## Communities (39 total, 7 thin omitted)

### Community 0 - "Stay Detail Core"
Cohesion: 0.08
Nodes (28): baseParams, confirmedBooking, globalStubs, mockNavigateTo, mockUseRoute, store, wrapper, baseBreakdown (+20 more)

### Community 1 - "Listing Card & Grid"
Cohesion: 0.11
Nodes (23): App Root Component, AppHeader component, Homepage (index.vue), Host, ListingDetail, ListingDetailResponse, ListingImage, GET /api/listings handler (+15 more)

### Community 2 - "Slug Routing & API"
Cohesion: 0.09
Nodes (18): base, globalStubs, listing, NuxtLinkStub, wrapper, hasError, listings, listingBase (+10 more)

### Community 3 - "Listing Types & Card UI"
Cohesion: 0.08
Nodes (23): Badge, Border Radius, Button, Card, Colors, Components, Display Scale (Fraunces), Font Families (+15 more)

### Community 4 - "Stay Detail UI & Tests"
Cohesion: 0.15
Nodes (20): Wayrest Project Constitution, Wayrest Design System Documentation, Wayrest Design System HTML Reference, Ember Primary Color System, Listing Detail Page HTML Reference, Listing, ListingCardProps, ListingsResponse (+12 more)

### Community 5 - "Search Bar Components"
Cohesion: 0.12
Nodes (14): config, id, listing, match, RawHost, RawImage, RawListing, row (+6 more)

### Community 6 - "Config & Design System"
Cohesion: 0.12
Nodes (15): code:typescript (// Extend existing Listing interface in app/types/listing.ts), Context, Expected Tests, Header, Left Column, ListingCard — Clickable, Page Layout, Photo Gallery (+7 more)

### Community 7 - "Project Docs & Design"
Cohesion: 0.13
Nodes (9): apiError, breakdown, cardNumber, cvv, email, expiry, fullName, isLoading (+1 more)

### Community 8 - "Listings API"
Cohesion: 0.13
Nodes (14): code:typescript (// app/types/booking.ts), code:typescript (// app/stores/booking.ts), Context, Expected Tests, Luhn Algorithm, Pinia Store, Routes, Server API (+6 more)

### Community 9 - "Search Types"
Cohesion: 0.17
Nodes (10): body, booking, config, REQUIRED_FIELDS, supabase, dbRow, mockEvent, mockReadBody (+2 more)

### Community 10 - "Supabase Composable"
Cohesion: 0.17
Nodes (9): globalStubs, hero, listing, mockNavigateTo, mockUseFetch, mockUseRoute, thumbnails, totalEl (+1 more)

### Community 11 - "Search Bar Logic"
Cohesion: 0.2
Nodes (9): Context, Expected Tests, Header, Hero Section, Layout Structure, ListingCard, ListingGrid Section, SearchBar (+1 more)

### Community 12 - "Nuxt Config"
Cohesion: 0.2
Nodes (9): code:typescript (// API response — GET /api/listings), code:typescript (// server/api/listings.get.ts), Context, Expected Behaviors, Expected Tests, Server API, SPEC-003 — ListingGrid, Technical Constraints (+1 more)

### Community 13 - "Tailwind Config"
Cohesion: 0.22
Nodes (5): btn, emitted, end, start, wrapper

### Community 14 - "Vitest Config"
Cohesion: 0.22
Nodes (8): code:bash (# npm), code:bash (# npm), code:bash (# npm), code:bash (# npm), Development Server, Nuxt Minimal Starter, Production, Setup

### Community 15 - "App Entry Point"
Cohesion: 0.22
Nodes (8): code:typescript (interface ComponentNameProps {), Context, Edge Cases & Errors, Expected Behaviors, Expected Tests, SPEC-XXX — Component Name, Technical Constraints, TypeScript Interface

### Community 16 - "App Header"
Cohesion: 0.22
Nodes (8): code:typescript (interface Listing {), Context, Edge Cases & Errors, Expected Behaviors, Expected Tests, SPEC-001 — ListingCard, Technical Constraints, TypeScript Interface

### Community 17 - "Homepage"
Cohesion: 0.22
Nodes (8): code:typescript (interface SearchParams {), Context, Edge Cases & Errors, Expected Behaviors, Expected Tests, SPEC-002 — SearchBar, Technical Constraints, TypeScript Interface

### Community 18 - "Test Config"
Cohesion: 0.25
Nodes (7): Conventions, Development Method, Feature Roadmap, Mission, Tech Stack, Wayrest — Project Constitution, What the Agent Must Never Do

### Community 19 - "Project README"
Cohesion: 0.29
Nodes (3): breakdown, nights, params

### Community 20 - "Claude Instructions"
Cohesion: 0.29
Nodes (7): Wayrest Design Token System, Nuxt Config, Search Types (SearchParams, SearchBarEmits), SearchBar Tests, SearchBar Component, Tailwind Config, useSupabase Composable

### Community 21 - "SEO Config"
Cohesion: 0.4
Nodes (4): config, listings, response, supabase

## Knowledge Gaps
- **196 isolated node(s):** `config`, `supabase`, `listings`, `response`, `REQUIRED_FIELDS` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Listing` connect `Stay Detail UI & Tests` to `Listing Card & Grid`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `GET /api/stays/[slug] handler` (e.g. with `GET /api/listings handler` and `Slug format: kebab-case-title-{id} for URL-safe, id-extractable routing`) actually correct?**
  _`GET /api/stays/[slug] handler` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `config`, `supabase`, `listings` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Stay Detail Core` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Listing Card & Grid` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Slug Routing & API` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Listing Types & Card UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._