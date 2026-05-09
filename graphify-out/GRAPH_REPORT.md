# Graph Report - .  (2026-05-09)

## Corpus Check
- Corpus is ~18,184 words - fits in a single context window. You may not need a graph.

## Summary
- 139 nodes · 151 edges · 22 communities (18 shown, 4 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

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
- [[_COMMUNITY_Test Config|Test Config]]
- [[_COMMUNITY_Project README|Project README]]
- [[_COMMUNITY_Claude Instructions|Claude Instructions]]

## God Nodes (most connected - your core abstractions)
1. `Stay Detail Page ([slug].vue)` - 12 edges
2. `GET /api/stays/[slug] handler` - 10 edges
3. `Listing` - 9 edges
4. `ListingDetail` - 7 edges
5. `Spec-Driven Development Methodology` - 6 edges
6. `SPEC-005 Listing Detail Page` - 6 edges
7. `SPEC-004 Homepage Feature Spec` - 5 edges
8. `SPEC-003 ListingGrid Feature Spec` - 5 edges
9. `SPEC-001 ListingCard Feature Spec` - 5 edges
10. `GET /api/listings handler` - 5 edges

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

## Communities (22 total, 4 thin omitted)

### Community 0 - "Stay Detail Core"
Cohesion: 0.11
Nodes (23): App Root Component, AppHeader component, Homepage (index.vue), Host, ListingDetail, ListingDetailResponse, ListingImage, GET /api/listings handler (+15 more)

### Community 1 - "Listing Card & Grid"
Cohesion: 0.09
Nodes (18): base, globalStubs, listing, NuxtLinkStub, wrapper, hasError, listings, listingBase (+10 more)

### Community 2 - "Slug Routing & API"
Cohesion: 0.12
Nodes (14): config, id, listing, match, RawHost, RawImage, RawListing, row (+6 more)

### Community 3 - "Listing Types & Card UI"
Cohesion: 0.22
Nodes (14): Listing, ListingCardProps, ListingsResponse, ListingCard component tests, ListingCard component, ListingGrid component tests, ListingGrid Component, Spec-Driven Development Methodology (+6 more)

### Community 4 - "Stay Detail UI & Tests"
Cohesion: 0.18
Nodes (8): globalStubs, hero, listing, mockUseFetch, mockUseRoute, thumbnails, totalEl, wrapper

### Community 5 - "Search Bar Components"
Cohesion: 0.22
Nodes (5): btn, emitted, end, start, wrapper

### Community 6 - "Config & Design System"
Cohesion: 0.29
Nodes (7): Wayrest Design Token System, Nuxt Config, Search Types (SearchParams, SearchBarEmits), SearchBar Tests, SearchBar Component, Tailwind Config, useSupabase Composable

### Community 7 - "Project Docs & Design"
Cohesion: 0.4
Nodes (6): Wayrest Project Constitution, Wayrest Design System Documentation, Wayrest Design System HTML Reference, Ember Primary Color System, Listing Detail Page HTML Reference, Pine Secondary Color System

### Community 8 - "Listings API"
Cohesion: 0.4
Nodes (4): config, listings, response, supabase

## Knowledge Gaps
- **63 isolated node(s):** `config`, `supabase`, `listings`, `response`, `mockGetRouterParam` (+58 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Listing` connect `Listing Types & Card UI` to `Stay Detail Core`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `GET /api/stays/[slug] handler` (e.g. with `Slug format: kebab-case-title-{id} for URL-safe, id-extractable routing` and `SPEC-GAP: server routes cannot import from app/composables, so Supabase is initialized directly`) actually correct?**
  _`GET /api/stays/[slug] handler` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `Spec-Driven Development Methodology` (e.g. with `Spec Template` and `SPEC-001 ListingCard Feature Spec`) actually correct?**
  _`Spec-Driven Development Methodology` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `config`, `supabase`, `listings` to the rest of the system?**
  _63 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Stay Detail Core` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Listing Card & Grid` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Slug Routing & API` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._