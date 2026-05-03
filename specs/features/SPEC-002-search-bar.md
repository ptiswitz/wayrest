# SPEC-002 — SearchBar

## Context
Displays a search form allowing users to filter accommodations by
destination, dates, and number of guests.
Does NOT handle navigation or data fetching — emits a search event
with the form values.
Used on the index page above the listing grid.

## TypeScript Interface

```typescript
interface SearchParams {
  destination: string
  startDate: Date
  endDate: Date
  guests: number
}

interface SearchBarEmits {
  (e: 'search', params: SearchParams): void
}
```

## Expected Behaviors

1. Renders three fields: destination (text), date range (vue-datepicker),
   and guests (number with +/- buttons)
2. Guests field defaults to 1 on mount
3. Clicking the minus button decreases guests by 1 — minimum is 1,
   the button is disabled at 1
4. Clicking the plus button increases guests by 1 — no maximum
5. When the form is valid, clicking Search emits a `search` event
   with a `SearchParams` object
6. Error messages are displayed inline below each invalid field

## Edge Cases & Errors

- When destination is empty on submit → show "Please enter a destination"
- When dates are not selected on submit → show "Please select your dates"
- When endDate is before or equal to startDate → show "Check-out must
  be after check-in"
- When guests is less than 1 → reset to 1 (should not happen via UI
  but guard it)

## Technical Constraints

- Use Tailwind CSS for all styling — no inline styles
- Composition API — `<script setup lang="ts">`
- Emits typed with `defineEmits<SearchBarEmits>()`
- Use vue-datepicker for the date range picker
- Component file: `app/components/SearchBar.vue`
- The `SearchParams` interface is defined in `app/types/search.ts`
  and imported
- No external dependencies beyond the constitution's stack

## Expected Tests

- [ ] happy path: valid form emits search event with correct SearchParams
- [ ] validation: empty destination shows error message
- [ ] validation: missing dates shows error message
- [ ] validation: endDate before startDate shows error message
- [ ] guests: minus button is disabled when guests equals 1
- [ ] guests: plus button increases guests count
- [ ] guests: minus button decreases guests count