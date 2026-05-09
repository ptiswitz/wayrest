# SPEC-006 — Booking System

## Context
Three-page booking flow triggered by the "Reserve" button on the
listing detail page. Pages are dedicated routes, not modals.
Payment is mocked — no real transaction. Booking is saved to
Supabase anonymously (no auth required).
Visual reference: specs/booking.html

## TypeScript Interfaces

```typescript
// app/types/booking.ts
interface BookingParams {
  listingId: number
  slug: string
  startDate: Date
  endDate: Date
  guests: number
}

interface PriceBreakdown {
  nights: number
  pricePerNight: number
  cleaningFee: number
  serviceFee: number
  total: number
}

interface BookingFormData {
  fullName: string
  email: string
  cardNumber: string
  expiry: string
  cvv: string
}

interface Booking {
  id: number
  listingId: number
  startDate: string
  endDate: string
  guests: number
  fullName: string
  email: string
  nights: number
  pricePerNight: number
  cleaningFee: number
  serviceFee: number
  total: number
  reference: string
  createdAt: string
}

// API request — POST /api/bookings
interface CreateBookingRequest {
  listingId: number
  startDate: string
  endDate: string
  guests: number
  fullName: string
  email: string
  nights: number
  pricePerNight: number
  cleaningFee: number
  serviceFee: number
  total: number
}

// API response — POST /api/bookings
interface CreateBookingResponse {
  booking: Booking
}
```

## Pinia Store

```typescript
// app/stores/booking.ts
interface BookingState {
  params: BookingParams | null
  breakdown: PriceBreakdown | null
  form: BookingFormData | null
  confirmedBooking: Booking | null
}
```

Actions:
- `setParams(params: BookingParams)` — called from detail page
- `setBreakdown(breakdown: PriceBreakdown)` — computed on summary page
- `setForm(form: BookingFormData)` — saved on payment page
- `setConfirmedBooking(booking: Booking)` — saved after API success
- `reset()` — clears all state

## Routes

- `/booking/[slug]/summary` — Step 1
- `/booking/[slug]/payment` — Step 2
- `/booking/[slug]/confirmation` — Step 3

Query params (backup for direct URL access):
- `startDate` (ISO string)
- `endDate` (ISO string)
- `guests` (number)

If Pinia store is empty on page load, read from query params.
If both are empty → redirect to `/stays/[slug]`.

## Step 1 — Summary Page
File: `app/pages/booking/[slug]/summary.vue`

Layout:
- AppHeader
- Two columns on desktop (lg:grid-cols-3), single on mobile
- Left (lg:col-span-2): booking details
- Right (lg:col-span-1): price breakdown card

Left column:
- Listing thumbnail (imageUrl, aspect-video, rounded-lg)
- Title (font-display text-2xl)
- Location (city, country — text-text-muted)
- Dates: "Check-in: {date} → Check-out: {date}"
- Guests: "{n} guest(s)"

Right column — Price breakdown card:
- bg-surface rounded-xl shadow-lg p-6 border border-border
- Line items:
  - "{nights} nights × {pricePerNight} $"
  - "Cleaning fee: {cleaningFee} $"
  - "Service fee: {serviceFee} $" (10% of nights × price)
  - Divider
  - "Total: {total} $" — font-semibold text-lg
- "Confirm reservation" button → navigates to /booking/[slug]/payment
  bg-primary text-white w-full py-3 rounded-md
- "← Back" link → navigates back to /stays/[slug]

Price computation (client-side):
- nights = diff in days between endDate and startDate
- subtotal = nights × pricePerNight
- serviceFee = Math.round(subtotal × serviceFeePct / 100)
- total = subtotal + cleaningFee + serviceFee

## Step 2 — Payment Page
File: `app/pages/booking/[slug]/payment.vue`

Layout:
- AppHeader
- Centered form, max-w-lg mx-auto

Form fields:
- Full name (text, required)
- Email (email, required, valid email format)
- Card number (text, required, Luhn algorithm validation,
  auto-format with spaces every 4 digits)
- Expiry (text, required, format MM/YY, future date)
- CVV (text, required, 3-4 digits)

Validation: on submit only — no real-time validation.
Each invalid field shows an inline error below it.

Submit button:
- Label: "Pay {total} $"
- bg-primary text-white w-full py-3 rounded-md
- On valid form → POST /api/bookings → navigate to confirmation

Security note below button:
- Lock icon + "Your payment info is protected"
- text-sm text-text-muted

Test card numbers (pass Luhn):
- 4242 4242 4242 4242 (Visa)
- 5555 5555 5555 4444 (Mastercard)

## Step 3 — Confirmation Page
File: `app/pages/booking/[slug]/confirmation.vue`

Layout:
- AppHeader
- Centered content, max-w-lg mx-auto, text-center

Content:
- Success icon (checkmark in circle, text-success-500, w-16 h-16)
- "Booking confirmed!" — font-display text-3xl font-semibold
- Reference: "Booking reference: {reference}"
  bg-surface-sunken rounded-md px-4 py-2 font-mono text-lg
- Summary card (bg-surface border border-border rounded-xl p-6):
  - Listing title
  - Check-in / Check-out dates
  - Guests
  - Total paid
- "Back to home" button → navigates to /
  bg-primary text-white px-8 py-3 rounded-md

On mount: if no confirmedBooking in store → redirect to /

## Server API

File: `server/api/bookings.post.ts`
Method: POST /api/bookings
Body: CreateBookingRequest
Response: CreateBookingResponse

Steps:
1. Validate required fields — return 400 if missing
2. Insert into Supabase `bookings` table
3. Return the created booking including generated `reference`

## Luhn Algorithm

File: `server/utils/luhn.ts` (also importable client-side)
Export: `function isValidLuhn(cardNumber: string): boolean`
- Strip spaces before processing
- Standard Luhn checksum algorithm

## Technical Constraints

- Composition API — `<script setup lang="ts">`
- Tailwind CSS only — no inline styles
- Pinia store: `app/stores/booking.ts`
- No auth required — anonymous booking
- Redirect guards on each page (Pinia empty + no query params → back)
- AppHeader reused on all three pages

## Expected Tests

- [ ] luhn: valid card numbers pass (4242424242424242)
- [ ] luhn: invalid card numbers fail
- [ ] API: returns 400 when required fields missing
- [ ] API: creates booking and returns reference
- [ ] summary: redirects to /stays/[slug] when no booking params
- [ ] summary: displays correct price breakdown
- [ ] payment: shows errors for empty fields on submit
- [ ] payment: shows error for invalid card number
- [ ] payment: valid form calls POST /api/bookings
- [ ] confirmation: redirects to / when no confirmed booking
- [ ] confirmation: displays booking reference