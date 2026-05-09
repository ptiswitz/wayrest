# SPEC-005 — Listing Detail Page

## Context
Displays the full details of a single accommodation.
Accessible via route `/stays/[slug]` where slug is generated
from the listing title + short id (e.g. chalet-rustique-001).
Fetches listing data, images, and host info from Supabase.
The "Reserve" button is a placeholder — booking logic is SPEC-006.
ListingCard must become clickable as part of this spec.

## TypeScript Interfaces

```typescript
// Extend existing Listing interface in app/types/listing.ts
interface Listing {
  id: number
  title: string
  city: string
  country: string
  pricePerNight: number
  imageUrl: string | null
  slug: string
  description: string | null
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[]
  hostId: number | null
}

interface ListingImage {
  id: number
  listingId: number
  url: string
  position: number
}

interface Host {
  id: number
  name: string
  avatarUrl: string | null
}

interface ListingDetail extends Listing {
  images: ListingImage[]
  host: Host | null
}

// API response — GET /api/stays/[slug]
interface ListingDetailResponse {
  listing: ListingDetail
}
```

## Slug Generation

The slug is auto-generated when a listing is fetched if absent.
Format: `{kebab-case-title}-{id}`
Example: "Chalet rustique Mont-Tremblant" + id 1
→ `chalet-rustique-mont-tremblant-1`
A Nuxt server utility `slugify(title, id)` handles generation.
The slug column in Supabase is the source of truth.

## Route & Data Fetching

- Route file: `app/pages/stays/[slug].vue`
- Extract id from the end of the slug: `chalet-rustique-1` → id = 1
- Fetch from `GET /api/stays/[slug]`
- API file: `server/api/stays/[slug].get.ts`
- Query Supabase: listings + listing_images + hosts via join
- Map snake_case to camelCase in the API response
- If listing not found → throw 404 error

## ListingCard — Clickable

- Wrap ListingCard content in a `<NuxtLink :to="'/stays/' + listing.slug"`
- The entire card is clickable
- No visual change to the card — cursor pointer only

## Page Layout

Visual reference: specs/listing-detail.html

### Header
Same header component as homepage (extract to
`app/components/AppHeader.vue` and reuse on both pages)

### Photo Gallery
- Full width hero image (first image, aspect-[16/9])
- Thumbnail strip below: horizontal scroll, 4 thumbnails visible
- Active thumbnail highlighted with primary border
- Left/right arrow buttons centered vertically at 50% height
- Arrows: absolute positioned, top-1/2 -translate-y-1/2
- Placeholder if no images: bg-neutral-100 with home icon

### Two-Column Layout (desktop) / Single Column (mobile)
- `grid grid-cols-1 lg:grid-cols-3 gap-12`
- Left column: `lg:col-span-2`
- Right column: `lg:col-span-1`

### Left Column
1. **Listing Header**
   - Title: font-display text-3xl font-semibold text-text
   - Subtitle: "{guests} guests · {bedrooms} bedrooms · 
     {beds} beds · {bathrooms} bathrooms"
   - text-text-muted text-base

2. **Host Info**
   - Avatar: w-12 h-12 rounded-full object-cover
   - Fallback avatar: bg-neutral-200 with initials
   - "Hosted by {host.name}" — text-base font-medium

3. **Divider**: border-t border-border my-6

4. **Description**
   - font-sans text-base text-text leading-relaxed

5. **Divider**

6. **Amenities Grid**
   - grid grid-cols-2 gap-3
   - Each amenity: icon + label chip
   - bg-surface-sunken rounded-md px-3 py-2 text-sm
   - Icons: inline SVG for wifi, kitchen, parking, 
     fireplace, bbq, washer, dryer, elevator, 
     dock, kayak, heating, tv
   - Unknown amenity: generic checkmark icon

### Right Column (sticky)
- `sticky top-24`
- bg-surface rounded-xl shadow-lg p-6 border border-border

1. **Price**: 
   - `{price} $ / night` — font-display text-2xl font-semibold
   
2. **Date Range Picker**
   - Same VueDatePicker as SearchBar
   - Label: "Check-in → Check-out"

3. **Guests Selector**
   - Same +/- stepper as SearchBar
   - Min: 1, Max: listing.guests

4. **Reserve Button**
   - Placeholder — no action on click for now
   - bg-primary text-white w-full py-3 rounded-md
   - font-medium text-base hover:bg-primary-600

5. **Total Price**
   - Shown only when dates are selected
   - "Total: {nights} nights × {price} $ = {total} $"
   - text-sm text-text-muted

## Technical Constraints

- Composition API — `<script setup lang="ts">`
- Use Nuxt `useFetch` for data fetching
- Use Tailwind CSS only — no inline styles
- Extract header to `app/components/AppHeader.vue`
- Route: `app/pages/stays/[slug].vue`
- API: `server/api/stays/[slug].get.ts`
- Utility: `server/utils/slugify.ts`
- No external dependencies beyond the constitution's stack

## Expected Tests

- [ ] slugify: generates correct slug from title and id
- [ ] API: returns 404 when listing not found
- [ ] API: returns ListingDetail with images and host
- [ ] page: renders listing title and location
- [ ] page: renders photo gallery with first image active
- [ ] gallery: clicking thumbnail updates active image
- [ ] gallery: arrows navigate between images
- [ ] ListingCard: clicking navigates to /stays/{slug}
- [ ] booking card: total price shown when dates selected
- [ ] booking card: total price hidden when no dates