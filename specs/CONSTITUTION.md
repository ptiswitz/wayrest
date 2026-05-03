# Wayrest — Project Constitution

## Mission
Wayrest is a pedagogical Airbnb clone built to learn Spec-Driven
Development (SDD). Every feature is defined by a spec before being
implemented by an AI coding agent.

## Tech Stack
- **Framework**: Nuxt 3 (SSR, file-based routing)
- **Language**: TypeScript strict — no `any`
- **Styling**: Tailwind CSS
- **Global state**: Pinia
- **Testing**: Vitest + @vue/test-utils
- **Linting**: ESLint + Prettier
- **Date picker**: vue-datepicker

## Conventions
- Composition API only — `<script setup lang="ts">` on every component
- Props typed with `defineProps<T>()`
- Emits typed with `defineEmits<T>()`
- Components: PascalCase (`ListingCard.vue`)
- Composables: camelCase prefixed with `use` (`useListing.ts`)
- Pages in `app/pages/`, components in `app/components/`

## Development Method
This project follows Spec-Driven Development:
1. A spec is written in `specs/features/` before any implementation
2. The spec is submitted to the AI agent, which lists its questions before coding
3. The delivered code is validated against the spec
4. The spec is committed alongside the code — it is the documentation

## Feature Roadmap
- [ ] SPEC-001 — ListingCard: display a single listing
- [ ] SPEC-002 — SearchBar: search form
- [ ] SPEC-003 — ListingGrid: listing grid
- [ ] SPEC-004 — Availability calendar
- [ ] SPEC-005 — Listing detail page
- [ ] SPEC-006 — Booking system
- [ ] SPEC-007 — Authentication

## What the Agent Must Never Do
- Install dependencies not listed in this constitution
- Create files outside the defined structure
- Make architecture decisions not specified in the spec
- Modify a spec without explicit validation