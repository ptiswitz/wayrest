# SPEC-003 — ListingGrid

## Context
Fetches listings from a Nuxt server API and displays them in a
responsive grid using the ListingCard component.
Handles loading (skeleton), empty, and error states.
Does NOT handle search filtering — that is a future spec.
Used on the index page below the SearchBar.

## TypeScript Interface

```typescript
// API response — GET /api/listings
interface ListingsResponse {
  listings: Listing[]
}

// Component has no props — fetches data autonomously
// Listing interface imported from ~/types/listing
```

## Expected Behaviors

1. On mount, fetches listings from `GET /api/listings` using Nuxt's
   `useFetch` composable
2. While fetching, displays a grid of 8 skeleton cards animated with
   a pulse effect
3. When listings are loaded, displays them in a responsive grid using
   container queries:
   - Narrow container (< 640px): 1 column
   - Medium container (≥ 640px): 2 columns
   - Large container (≥ 1024px): 3 columns
   - Extra large container (≥ 1280px): 4 columns
4. When the API returns an empty array, displays the message:
   "No listings found."
5. When the API call fails, displays the message:
   "An error occurred. Please try again later."
6. Each listing is rendered using the existing ListingCard component

## Server API

```typescript
// server/api/listings.get.ts
// GET /api/listings
// Returns: ListingsResponse
// Fetches all listings from Supabase table `listings`
// Table columns match the Listing interface:
//   id, title, city, country, price_per_night, image_url
// Maps snake_case columns to camelCase for the response
```

## Technical Constraints

- Use Tailwind CSS for all styling — no inline styles
- Composition API — `<script setup lang="ts">`
- Use container queries — no media queries (@container, @tailwindcss/container-queries)
- Use Nuxt `useFetch` for data fetching — no raw fetch or axios
- Supabase client initialized via a Nuxt plugin or composable
- Component file: `app/components/ListingGrid.vue`
- API file: `server/api/listings.get.ts`
- Supabase credentials read from runtime config (nuxt.config.ts)
  via environment variables:
  SUPABASE_URL and SUPABASE_KEY
- No external dependencies beyond the constitution's stack

## Expected Tests

- [ ] loading: renders 8 skeleton cards while fetching
- [ ] happy path: renders ListingCard for each listing returned
- [ ] empty state: displays "No listings found." when array is empty
- [ ] error state: displays error message when API call fails
- [ ] grid: applies container query classes to the grid wrapper