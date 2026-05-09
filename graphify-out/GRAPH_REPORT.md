# Graph Report - .  (2026-05-09)

## Corpus Check
- Corpus is ~15,052 words - fits in a single context window. You may not need a graph.

## Summary
- 77 nodes · 77 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.86)
- Token cost: 41,000 input · 16,828 output

## Community Hubs (Navigation)
- [[_COMMUNITY_ListingCard & Grid UI|ListingCard & Grid UI]]
- [[_COMMUNITY_Listing Types & Spec Methodology|Listing Types & Spec Methodology]]
- [[_COMMUNITY_SearchBar Component|SearchBar Component]]
- [[_COMMUNITY_ListingCard Component|ListingCard Component]]
- [[_COMMUNITY_ListingGrid Component|ListingGrid Component]]
- [[_COMMUNITY_Design System Docs|Design System Docs]]
- [[_COMMUNITY_Listings API Handler|Listings API Handler]]
- [[_COMMUNITY_Homepage & App Shell|Homepage & App Shell]]
- [[_COMMUNITY_Search Types|Search Types]]
- [[_COMMUNITY_Vitest Setup|Vitest Setup]]
- [[_COMMUNITY_README|README]]
- [[_COMMUNITY_CLAUDE.md Instructions|CLAUDE.md Instructions]]

## God Nodes (most connected - your core abstractions)
1. `Spec-Driven Development Methodology` - 6 edges
2. `SPEC-001 ListingCard Feature Spec` - 5 edges
3. `SPEC-003 ListingGrid Feature Spec` - 5 edges
4. `SPEC-004 Homepage Feature Spec` - 5 edges
5. `Listings API Handler` - 4 edges
6. `SearchBar Component` - 4 edges
7. `ListingGrid Component` - 4 edges
8. `Homepage Index Page` - 4 edges
9. `Listing Interface` - 4 edges
10. `Wayrest Design System Documentation` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Listings API Handler` --semantically_similar_to--> `useSupabase Composable`  [INFERRED] [semantically similar]
  server/api/listings.get.ts → app/composables/useSupabase.ts
- `SPEC-001 ListingCard Feature Spec` --references--> `ListingCardProps Interface`  [EXTRACTED]
  specs/features/SPEC-001-listing-card.md → app/types/listing.ts
- `SPEC-003 ListingGrid Feature Spec` --references--> `ListingsResponse Interface`  [EXTRACTED]
  specs/features/SPEC-003-listing-grid.md → app/types/listing.ts
- `SearchBar Component` --references--> `Wayrest Design Token System`  [INFERRED]
  app/components/SearchBar.vue → tailwind.config.ts
- `SPEC-001 ListingCard Feature Spec` --references--> `Listing Interface`  [EXTRACTED]
  specs/features/SPEC-001-listing-card.md → app/types/listing.ts

## Hyperedges (group relationships)
- **Search Flow: SearchBar → SearchParams → index.vue handler** — searchbar_vue, search_types, index_vue, searchbar_handlesubmit [EXTRACTED 1.00]
- **Listing Display Pipeline: API → ListingGrid → ListingCard** — listings_get, listinggrid_vue, listingcard_vue [EXTRACTED 1.00]
- **Supabase Initialization Pattern: runtimeConfig → createClient (server route vs composable)** — listings_get, usesupbase_composable, nuxt_config [INFERRED 0.85]
- **Spec-Driven Development Feature Flow** — sdd_principle, spec_template, spec001_listingcard [INFERRED 0.85]
- **Homepage Component Composition** — spec004_homepage, spec002_searchbar, spec003_listinggrid [EXTRACTED 1.00]
- **Listing Type Shared Across Components** — listing_listing, spec001_listingcard, spec003_listinggrid [EXTRACTED 1.00]

## Communities (19 total, 4 thin omitted)

### Community 0 - "ListingCard & Grid UI"
Cohesion: 0.27
Nodes (10): Wayrest Design Token System, ListingCard Tests, ListingCard Component, ListingGrid Tests, ListingGrid Component, Listings API Handler, Nuxt Config, Supabase Server-Only Config Gap (+2 more)

### Community 1 - "Listing Types & Spec Methodology"
Cohesion: 0.36
Nodes (10): Listing Interface, ListingCardProps Interface, ListingsResponse Interface, Spec-Driven Development Methodology, SearchParams Interface, SPEC-001 ListingCard Feature Spec, SPEC-002 SearchBar Feature Spec, SPEC-003 ListingGrid Feature Spec (+2 more)

### Community 2 - "SearchBar Component"
Cohesion: 0.22
Nodes (5): btn, emitted, end, start, wrapper

### Community 3 - "ListingCard Component"
Cohesion: 0.25
Nodes (6): base, listing, wrapper, Listing, ListingCardProps, ListingsResponse

### Community 4 - "ListingGrid Component"
Cohesion: 0.25
Nodes (5): hasError, listings, listings, mockUseFetch, wrapper

### Community 5 - "Design System Docs"
Cohesion: 0.4
Nodes (6): Wayrest Project Constitution, Wayrest Design System Documentation, Wayrest Design System HTML Reference, Ember Primary Color System, Listing Detail Page HTML Reference, Pine Secondary Color System

### Community 6 - "Listings API Handler"
Cohesion: 0.4
Nodes (4): config, listings, response, supabase

### Community 7 - "Homepage & App Shell"
Cohesion: 0.5
Nodes (5): App Root Component, Homepage Index Page, Search Types (SearchParams, SearchBarEmits), SearchBar Tests, SearchBar Component

## Knowledge Gaps
- **30 isolated node(s):** `config`, `supabase`, `listings`, `response`, `wrapper` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Spec-Driven Development Methodology` connect `Listing Types & Spec Methodology` to `Design System Docs`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `ListingGrid Component` connect `ListingCard & Grid UI` to `Homepage & App Shell`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `SPEC-004 Homepage Feature Spec` connect `Listing Types & Spec Methodology` to `Design System Docs`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Spec-Driven Development Methodology` (e.g. with `Spec Template` and `SPEC-001 ListingCard Feature Spec`) actually correct?**
  _`Spec-Driven Development Methodology` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Listings API Handler` (e.g. with `useSupabase Composable` and `ListingGrid Tests`) actually correct?**
  _`Listings API Handler` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `config`, `supabase`, `listings` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._