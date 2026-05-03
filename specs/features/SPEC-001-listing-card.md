# SPEC-001 — ListingCard

## Context
Displays a single accommodation listing as a card.
Used in listing grids and search results pages.
Does NOT handle navigation, reviews, or photo galleries.
Receives all data via props — no internal data fetching.

## TypeScript Interface

```typescript
interface Listing {
  id: number
  title: string
  city: string
  country: string
  pricePerNight: number
  imageUrl: string | null
}

interface ListingCardProps {
  listing: Listing
}
```

## Expected Behaviors

1. When `imageUrl` is provided, display the image filling the card width
2. When `imageUrl` is null or empty, display a neutral placeholder image
3. When title exceeds two lines, truncate it with an ellipsis
4. Display city and country on a single line: "Montreal, Canada"
5. Display price as: "125 $ / night" — currency is always CAD
6. Price is always a positive integer — no decimal display

## Edge Cases & Errors

- When `imageUrl` is null → show a gray placeholder div with a home icon
- When `imageUrl` is a broken URL → show the same placeholder as above
- When title is very long → clamp to 2 lines maximum using CSS line-clamp
- When `pricePerNight` is 0 → display "0 $ / night" without special handling

## Technical Constraints

- Use Tailwind CSS for all styling — no inline styles
- Composition API — `<script setup lang="ts">`
- Props typed with `defineProps<Listing>()`
- Component file: `app/components/ListingCard.vue`
- The `Listing` interface is defined in `app/types/listing.ts` and imported
- No external dependencies beyond the constitution's stack

## Expected Tests

- [ ] happy path: renders image, title, location and price correctly
- [ ] truncation: long title is clamped to 2 lines
- [ ] placeholder: null imageUrl renders placeholder
- [ ] placeholder: broken imageUrl renders placeholder
- [ ] price format: displays "125 $ / night" format
- [ ] location format: displays "Montreal, Canada" format