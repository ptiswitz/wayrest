# SPEC-004 — Homepage

## Context
The main entry point of Wayrest. Displays the search bar and 
the listing grid. Visual reference is specs/design-system.html.
All styling must use Tailwind classes mapped to tailwind.config.ts 
tokens — no inline styles, no vanilla CSS.

## Layout Structure
- app.vue — root wrapper: min-h-screen bg-bg font-sans
- app/pages/index.vue — page layout:
  - Header
  - Hero section with SearchBar
  - ListingGrid section

## Header
- Full width, bg-surface, shadow-sm, sticky top-0 z-50
- Inner container: max-w-7xl mx-auto px-6 h-16 
  flex items-center justify-between
- Left: logo "Wayrest" in font-display text-2xl 
  font-semibold text-primary
- Right: two buttons
  - "Sign in" — ghost variant: text-text-muted 
    hover:text-text px-4 py-2 rounded-md
  - "List your place" — outline variant: border 
    border-border text-text px-4 py-2 rounded-md 
    hover:border-border-strong

## Hero Section
- bg-surface-sunken, py-12 px-6
- Inner container: max-w-3xl mx-auto
- Title: "Find your next waypoint" — font-display text-4xl 
  font-semibold text-text text-center mb-8
- SearchBar centered below the title

## SearchBar
- bg-surface rounded-xl shadow-lg p-4
- Layout: flex flex-col lg:flex-row gap-3
- Each field:
  - Label: text-xs font-medium text-neutral-800 mb-1
  - Input: w-full border border-strong rounded-md px-3 py-2 
    text-base text-text bg-surface 
    focus:outline-none focus:ring-2 focus:ring-primary-200
- Guests field: flex items-center gap-2
  - Minus/Plus buttons: w-8 h-8 rounded-full border 
    border-border flex items-center justify-center
    hover:border-border-strong disabled:opacity-40
- Search button: w-full lg:w-auto bg-primary text-white 
  px-6 py-2.5 rounded-md font-medium 
  hover:bg-primary-600 transition-colors

## ListingGrid Section
- py-12 px-6
- Inner container: max-w-7xl mx-auto
- Section title: "Places to stay" — font-display text-2xl 
  font-semibold text-text mb-6
- Grid: @container, grid gap-6
  - 1 col default
  - @sm: grid-cols-2
  - @lg: grid-cols-3
  - @xl: grid-cols-4

## ListingCard
- bg-surface rounded-lg overflow-hidden
- shadow-sm hover:shadow-lg hover:-translate-y-0.5 
  transition-all duration-200
- No border
- Image: w-full aspect-[4/3] object-cover
- Placeholder: bg-neutral-100 flex items-center 
  justify-center text-neutral-400
- Body: p-3
  - Title: font-display text-base font-semibold text-text 
    line-clamp-2 mb-1
  - Location: text-sm text-text-muted mb-1
  - Price: text-sm font-medium text-text

## Expected Tests
- No new tests required — styling changes only