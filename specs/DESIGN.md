# Wayrest Design System

> A pedagogical Airbnb clone built with Nuxt 3 + Tailwind CSS.
> Aesthetic: warm, grounded, tactile — the lantern glow at a waypoint, the hush of an inn at dusk.

**Version:** 0.1
**Last updated:** 2026-05-03

---

## Colors

All ramps are designed for OKLCH-adjacent perceptual uniformity. Use 500 as the base brand step, 600 for hover, 100/50 for tinted backgrounds, 700+ for accessible text on light surfaces.

### Primary — Ember
The lantern glow. Used for CTAs, brand marks, selected states, and price emphasis.

| Step | Hex       | Usage |
|------|-----------|-------|
| 50   | `#FBF1EC` | Tinted background, hover surface |
| 100  | `#F6DDD0` | Badge background, soft fill |
| 200  | `#EFBCA3` | Disabled primary, dividers |
| 300  | `#E69875` | Decorative accents |
| 400  | `#D9764E` | Hover on dark surfaces |
| 500  | `#C25A33` | **Base — primary CTA, brand** |
| 600  | `#A24727` | Primary hover |
| 700  | `#813820` | Primary pressed, badge text |
| 800  | `#5F2A19` | Headings on tinted surfaces |
| 900  | `#3F1D12` | Maximum contrast text |

### Secondary — Pine
The trail at dusk. Used for trust signals (Superhost, verified), tertiary CTAs, success-adjacent states.

| Step | Hex       | Usage |
|------|-----------|-------|
| 50   | `#EEF2EF` | Tinted background |
| 100  | `#D6E0D8` | Badge background |
| 200  | `#ADC2B2` | Soft borders |
| 300  | `#80A089` | Decorative |
| 400  | `#547F61` | Hover on dark |
| 500  | `#335E42` | **Base — Pine CTA, host badges** |
| 600  | `#284C35` | Hover |
| 700  | `#1F3B2A` | Pressed, badge text |
| 800  | `#162A1E` | Heading variant |
| 900  | `#0E1B14` | Max contrast |

### Neutral — Parchment
Warm-tinted, never pure gray. Surfaces, text, borders.

| Step | Hex       | Usage |
|------|-----------|-------|
| 0    | `#FFFFFF` | Card surface |
| 50   | `#FAF7F2` | Page background |
| 100  | `#F2EDE4` | Sunken surface, ghost-button hover |
| 200  | `#E5DDD0` | Default border |
| 300  | `#CFC4B2` | Strong border, input border |
| 400  | `#A89B85` | Placeholder text, disabled icons |
| 500  | `#80735E` | Subtle text, timestamps |
| 600  | `#5C5142` | Muted text, secondary copy |
| 700  | `#40392E` | Strong UI text, button labels |
| 800  | `#2A251D` | Headings (UI), foreground |
| 900  | `#18140F` | Maximum contrast text |

### Status

| Token             | Hex       | Use |
|-------------------|-----------|-----|
| `success-50`      | `#ECF4ED` | Confirmed-state background |
| `success-500`     | `#3C8C50` | **Base — success icons, dot** |
| `success-700`     | `#28653A` | Success text on light bg |
| `error-50`        | `#FAEDEA` | Error field background |
| `error-500`       | `#C44536` | **Base — destructive, validation** |
| `error-700`       | `#8E2B1F` | Error text |
| `warning-50`      | `#FBF3E1` | Soft alert background |
| `warning-500`     | `#C9912B` | **Base — limited availability** |
| `warning-700`     | `#8E6418` | Warning text |

### Semantic Aliases

| Alias              | Maps to            |
|--------------------|--------------------|
| `--bg`             | `neutral-50`       |
| `--surface`        | `neutral-0`        |
| `--surface-sunken` | `neutral-100`      |
| `--border`         | `neutral-200`      |
| `--border-strong`  | `neutral-300`      |
| `--text`           | `neutral-900`      |
| `--text-muted`     | `neutral-600`      |
| `--text-subtle`    | `neutral-500`      |

---

## Typography

### Font Families

| Role      | Family            | Fallback                                              | Notes |
|-----------|-------------------|-------------------------------------------------------|-------|
| Display   | **Fraunces**      | `Georgia, "Times New Roman", serif`                   | Variable `opsz` 9–144. Use larger optical sizes for headlines. |
| Interface | **Inter**         | `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | Body, labels, buttons, navigation. |
| Mono      | **JetBrains Mono**| `ui-monospace, "SF Mono", Menlo, monospace`           | Code, tokens, metadata. |

### Display Scale (Fraunces)

| Token         | Size    | px  | Weight | Line height | Optical size | Use |
|---------------|---------|-----|--------|-------------|--------------|-----|
| `display-2xl` | 4rem    | 64  | 400    | 1.05        | 144          | Hero headline |
| `display-xl`  | 3rem    | 48  | 400    | 1.10        | 96           | Page title |
| `display-lg`  | 2.25rem | 36  | 500    | 1.15        | 60           | Section title |
| `display-md`  | 1.75rem | 28  | 500    | 1.20        | 36           | Card title, modal title |
| `display-sm`  | 1.375rem| 22  | 500    | 1.25        | 24           | Listing title |

All display sizes use letter-spacing `-0.01em` to `-0.02em`.

### UI Scale (Inter)

| Token       | Size      | px | Weight   | Line height | Use |
|-------------|-----------|----|----------|-------------|-----|
| `text-xl`   | 1.375rem  | 22 | 400      | 1.45        | Hero lede |
| `text-lg`   | 1.125rem  | 18 | 400      | 1.50        | Subhead, blockquote |
| `text-base` | 1rem      | 16 | 400      | 1.50        | Default body |
| `text-sm`   | 0.875rem  | 14 | 500      | 1.45        | Form labels, metadata |
| `text-xs`   | 0.75rem   | 12 | 500      | 1.40        | Captions, badges, timestamps |

### Weights

| Token        | Value | Use |
|--------------|-------|-----|
| `regular`    | 400   | Body |
| `medium`     | 500   | UI labels, button text, listing titles |
| `semibold`   | 600   | Strong emphasis, prices |
| `bold`       | 700   | Reserved — rarely used |

### Line-height tokens

| Token             | Value |
|-------------------|-------|
| `leading-tight`   | 1.15  |
| `leading-snug`    | 1.30  |
| `leading-normal`  | 1.50  |
| `leading-relaxed` | 1.70  |

---

## Spacing

4 px base grid. Use multiples of 4 for everything — padding, gap, margin.

| Token       | Value     | px |
|-------------|-----------|----|
| `space-0`   | 0         | 0  |
| `space-1`   | 0.25rem   | 4  |
| `space-2`   | 0.5rem    | 8  |
| `space-3`   | 0.75rem   | 12 |
| `space-4`   | 1rem      | 16 |
| `space-5`   | 1.25rem   | 20 |
| `space-6`   | 1.5rem    | 24 |
| `space-8`   | 2rem      | 32 |
| `space-10`  | 2.5rem    | 40 |
| `space-12`  | 3rem      | 48 |
| `space-16`  | 4rem      | 64 |
| `space-20`  | 5rem      | 80 |
| `space-24`  | 6rem      | 96 |

Note: 7, 9, 11, 13, 14, 15 are intentionally skipped — large gaps step in 8 px increments to keep layouts composed.

---

## Border Radius

| Token          | Value    | Use |
|----------------|----------|-----|
| `radius-none`  | `0`      | Sharp edges (rare) |
| `radius-xs`    | `4px`    | Tags, small chips |
| `radius-sm`    | `6px`    | Small buttons, dense UI |
| `radius-md`    | `10px`   | **Default** — buttons, inputs |
| `radius-lg`    | `16px`   | Cards, listing tiles |
| `radius-xl`    | `24px`   | Hero imagery, modals, sheets |
| `radius-full`  | `9999px` | Pills, badges, avatars |

---

## Shadows

All shadows are tinted with warm brown `rgba(64, 57, 46, …)` — never neutral gray.

| Token         | Value |
|---------------|-------|
| `shadow-xs`   | `0 1px 2px rgba(64,57,46,0.06)` |
| `shadow-sm`   | `0 1px 2px rgba(64,57,46,0.06), 0 2px 4px rgba(64,57,46,0.04)` |
| `shadow-md`   | `0 2px 4px rgba(64,57,46,0.06), 0 6px 12px rgba(64,57,46,0.06)` |
| `shadow-lg`   | `0 4px 8px rgba(64,57,46,0.06), 0 12px 24px rgba(64,57,46,0.08)` |
| `shadow-xl`   | `0 8px 16px rgba(64,57,46,0.06), 0 24px 48px rgba(64,57,46,0.12)` |
| `shadow-glow` | `0 0 0 4px rgba(194,90,51,0.18)` — focus ring |

| Level | Token       | Use |
|-------|-------------|-----|
| 1     | `shadow-xs` | Subtle separation, save buttons on imagery |
| 2     | `shadow-sm` | Resting card |
| 3     | `shadow-md` | Hovered card, dropdown |
| 4     | `shadow-lg` | Modal, popover, lifted card |
| 5     | `shadow-xl` | Sheet, dialog over content |

---

## Motion

| Token       | Value                            |
|-------------|----------------------------------|
| `ease-out`  | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| `dur-fast`  | `120ms` — micro-interactions, presses |
| `dur-base`  | `200ms` — hover, focus, color changes |
| `dur-slow`  | `320ms` — entrances, layout shifts |

---

## Components

### Card

**Listing card** is the primary card pattern.

- **Surface:** `--surface` (white) on `--bg` page
- **Border:** `1px solid --border` (`neutral-200`)
- **Radius:** `radius-lg` (16 px)
- **Photo aspect:** `4 / 3`, top-aligned
- **Padding (body):** `space-5` (20 px)
- **Inner gap:** `space-2` (8 px)
- **Hover:** `translateY(-2px)` + `shadow-lg` over `dur-base`
- **Save button:** 36×36 circular, `surface` at 92 % opacity over photo, `shadow-xs`
- **Badge slot:** absolute bottom-left of photo, `space-4` inset
- **Title:** `display-sm` Fraunces 500
- **Meta (location, dates):** `text-sm` `--text-muted`
- **Price:** `text-base` `semibold` for amount + `text-sm` `--text-muted` for "/ night"
- **Rating:** Ember-500 star icon, 14 px, with tabular numerals

### Button

Three primary variants + a Pine accent for hosting flows. Three sizes.

| Variant     | Background          | Text             | Border               | Hover bg           |
|-------------|---------------------|------------------|----------------------|--------------------|
| `primary`   | `primary-500`       | `neutral-0`      | none                 | `primary-600`      |
| `secondary` | `surface`           | `neutral-800`    | `border-strong`      | `neutral-50`       |
| `ghost`     | transparent         | `neutral-800`    | none                 | `neutral-100`      |
| `pine`      | `secondary-500`     | `white`          | none                 | `secondary-600`    |

**Sizing:**

| Size | Height | Padding-x  | Font size  | Radius      |
|------|--------|------------|------------|-------------|
| `sm` | 32 px  | `space-3`  | `text-xs`  | `radius-sm` |
| `md` | 40 px  | `space-5`  | `text-sm`  | `radius-md` |
| `lg` | 52 px  | `space-6`  | `text-base`| `radius-md` |

**Shared:**
- Font: Inter 500, letter-spacing `-0.005em`, line-height 1
- Icon gap: `space-2` (8 px)
- Active: `translateY(1px)` over `dur-fast`
- Focus: outline none, `shadow-glow` (Ember focus ring)
- Disabled (primary): `neutral-200` bg, `neutral-400` text, `cursor: not-allowed`
- Primary subtly inset highlight: `inset 0 1px 0 rgba(255,255,255,0.12)`

### Input

- **Height:** 44 px (default) — fingertip-friendly on mobile
- **Padding-x:** `space-4` (16 px)
- **Radius:** `radius-md` (10 px)
- **Border:** `1px solid border-strong` (`neutral-300`)
- **Background:** `--surface`
- **Font:** Inter 400, `text-base`
- **Placeholder:** `neutral-400`
- **Hover border:** `neutral-500`
- **Focus:** border `primary-500` + `shadow-glow`
- **Error:** border `error-500`; focus ring uses `rgba(196,69,54,0.18)`
- **Field stack:** label (`text-sm`/500/`neutral-800`) + input + hint (`text-xs`/`text-subtle`); gap `space-2`

**Input group** (with leading icon): same chrome, internal padding `0 space-3 0 space-4`, icon at `text-subtle`, transparent inner `<input>`.

### Badge

Pill-shaped, `radius-full`, `text-xs` Inter 500, padding `5px space-2`, line-height 1.

| Variant   | Background          | Text                |
|-----------|---------------------|---------------------|
| `neutral` | `neutral-100`       | `neutral-700`       |
| `primary` | `primary-100`       | `primary-700`       |
| `pine`    | `secondary-100`     | `secondary-700`     |
| `success` | `success-50`        | `success-700`       |
| `error`   | `error-50`          | `error-700`         |
| `warning` | `warning-50`        | `warning-700`       |
| `solid`   | `primary-500`       | `white`             |

Optional 6 px circular **dot** prefix (uses `currentColor`) for status indicators.

**Usage rules:**
- Use `pine` for trust signals (Superhost, Verified)
- Use `solid` sparingly — only for "Featured" / promoted items
- Use `warning` for scarcity ("2 left", "Almost gone")
- Use `success` for confirmation states, never as a brand color

---

## Tailwind Mapping

All tokens map 1:1 into `tailwind.config.js` under `theme.extend`. Color ramps go to `colors.{primary,secondary,neutral,success,error,warning}`, spacing to `spacing`, radii to `borderRadius`, shadows to `boxShadow`, fonts to `fontFamily`, font sizes to `fontSize` with `[size, { lineHeight }]` tuples.
