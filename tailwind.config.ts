import type { Config } from 'tailwindcss'

/**
 * Wayrest — Tailwind v4 configuration
 * ----------------------------------------------------------------
 * Tailwind v4 prefers CSS-first config via `@theme` blocks (see
 * `assets/css/tailwind.css` in this project). This file is provided
 * for tooling that still expects a JS/TS config (IDE plugins,
 * legacy integrations, content-scanning fallbacks).
 *
 * All tokens map 1:1 to DESIGN.md.
 */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './nuxt.config.{js,ts}',
  ],

  theme: {
    extend: {
      // ─── COLORS ────────────────────────────────────────────────
      colors: {
        // Primary — Ember (lantern glow)
        primary: {
          50:  '#FBF1EC',
          100: '#F6DDD0',
          200: '#EFBCA3',
          300: '#E69875',
          400: '#D9764E',
          500: '#C25A33', // base
          600: '#A24727',
          700: '#813820',
          800: '#5F2A19',
          900: '#3F1D12',
          DEFAULT: '#C25A33',
        },

        // Secondary — Pine (trail at dusk)
        secondary: {
          50:  '#EEF2EF',
          100: '#D6E0D8',
          200: '#ADC2B2',
          300: '#80A089',
          400: '#547F61',
          500: '#335E42', // base
          600: '#284C35',
          700: '#1F3B2A',
          800: '#162A1E',
          900: '#0E1B14',
          DEFAULT: '#335E42',
        },

        // Neutral — Parchment (warm-tinted, never gray)
        neutral: {
          0:   '#FFFFFF',
          50:  '#FAF7F2',
          100: '#F2EDE4',
          200: '#E5DDD0',
          300: '#CFC4B2',
          400: '#A89B85',
          500: '#80735E',
          600: '#5C5142',
          700: '#40392E',
          800: '#2A251D',
          900: '#18140F',
        },

        // Status — Moss / Clay / Honey
        success: {
          50:  '#ECF4ED',
          500: '#3C8C50',
          700: '#28653A',
          DEFAULT: '#3C8C50',
        },
        error: {
          50:  '#FAEDEA',
          500: '#C44536',
          700: '#8E2B1F',
          DEFAULT: '#C44536',
        },
        warning: {
          50:  '#FBF3E1',
          500: '#C9912B',
          700: '#8E6418',
          DEFAULT: '#C9912B',
        },

        // Semantic aliases (use as `bg-bg`, `text-text-muted`, etc.)
        bg: '#FAF7F2',
        surface: '#FFFFFF',
        'surface-sunken': '#F2EDE4',
        border: '#E5DDD0',
        'border-strong': '#CFC4B2',
        text: '#18140F',
        'text-muted': '#5C5142',
        'text-subtle': '#80735E',
      },

      // ─── TYPOGRAPHY ────────────────────────────────────────────
      fontFamily: {
        display: [
          'Fraunces',
          'Georgia',
          '"Times New Roman"',
          'serif',
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          '"SF Mono"',
          'Menlo',
          'monospace',
        ],
      },

      fontSize: {
        // UI scale (Inter)
        xs:   ['0.75rem',  { lineHeight: '1.4',  fontWeight: '500' }], // 12
        sm:   ['0.875rem', { lineHeight: '1.45', fontWeight: '500' }], // 14
        base: ['1rem',     { lineHeight: '1.5'                      }], // 16
        lg:   ['1.125rem', { lineHeight: '1.5'                      }], // 18
        xl:   ['1.375rem', { lineHeight: '1.45'                     }], // 22

        // Display scale (Fraunces) — use with `font-display`
        '2xl': ['1.75rem', { lineHeight: '1.2',  letterSpacing: '-0.01em' }], // 28
        '3xl': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }], // 36
        '4xl': ['3rem',    { lineHeight: '1.1',  letterSpacing: '-0.02em' }], // 48
        '5xl': ['4rem',    { lineHeight: '1.05', letterSpacing: '-0.02em' }], // 64
      },

      lineHeight: {
        tight:   '1.15',
        snug:    '1.30',
        normal:  '1.50',
        relaxed: '1.70',
      },

      letterSpacing: {
        tightest: '-0.02em',
        tighter:  '-0.01em',
        tight:    '-0.005em',
        normal:   '0',
        wide:     '0.08em',
        wider:    '0.10em',
      },

      // ─── SPACING (4px base) ────────────────────────────────────
      spacing: {
        0:  '0',
        1:  '0.25rem', // 4
        2:  '0.5rem',  // 8
        3:  '0.75rem', // 12
        4:  '1rem',    // 16
        5:  '1.25rem', // 20
        6:  '1.5rem',  // 24
        8:  '2rem',    // 32
        10: '2.5rem',  // 40
        12: '3rem',    // 48
        16: '4rem',    // 64
        20: '5rem',    // 80
        24: '6rem',    // 96
      },

      // ─── BORDER RADIUS ─────────────────────────────────────────
      borderRadius: {
        none: '0',
        xs:   '4px',
        sm:   '6px',
        md:   '10px',  // default — buttons, inputs
        lg:   '16px',  // cards
        xl:   '24px',  // hero, modals
        full: '9999px',
      },

      // ─── SHADOWS (warm-tinted) ─────────────────────────────────
      boxShadow: {
        xs:   '0 1px 2px rgba(64, 57, 46, 0.06)',
        sm:   '0 1px 2px rgba(64, 57, 46, 0.06), 0 2px 4px rgba(64, 57, 46, 0.04)',
        md:   '0 2px 4px rgba(64, 57, 46, 0.06), 0 6px 12px rgba(64, 57, 46, 0.06)',
        lg:   '0 4px 8px rgba(64, 57, 46, 0.06), 0 12px 24px rgba(64, 57, 46, 0.08)',
        xl:   '0 8px 16px rgba(64, 57, 46, 0.06), 0 24px 48px rgba(64, 57, 46, 0.12)',
        glow: '0 0 0 4px rgba(194, 90, 51, 0.18)',  // Ember focus ring
        'glow-error': '0 0 0 4px rgba(196, 69, 54, 0.18)',
        none: 'none',
      },

      // ─── MOTION ────────────────────────────────────────────────
      transitionTimingFunction: {
        out: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
        slow: '320ms',
      },
    },
  },

  plugins: [],
} satisfies Config
