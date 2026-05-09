<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useBookingStore } from '~/stores/booking'

const route = useRoute()
const slug = route.params.slug as string
const store = useBookingStore()

onMounted(() => {
  if (!store.confirmedBooking) {
    navigateTo('/')
  }
})

const booking = store.confirmedBooking

const copied = ref(false)

async function copyReference() {
  if (!booking?.reference) return
  try {
    await navigator.clipboard.writeText(booking.reference)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1200)
  } catch {
    // clipboard not available (e.g. in tests) — silent fail
  }
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatAmount(n: number): string {
  return `${Math.round(n).toLocaleString('en-CA')} $`
}
</script>

<template>
  <AppHeader :secure-mode="true" />
  <BookingStepper :current-step="3" :slug="slug" />

  <main v-if="booking" class="max-w-5xl mx-auto px-6 py-12 pb-20">
    <div class="max-w-2xl mx-auto text-center">

      <!-- Lantern illustration -->
      <div class="relative w-40 h-40 mx-auto mb-8" aria-hidden="true">
        <div class="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(194,90,51,0.18)_0%,rgba(194,90,51,0.04)_60%,transparent_100%)] animate-pulse" />
        <div class="absolute inset-0 flex items-center justify-center">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lant-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#D9764E"/>
                <stop offset="100%" stop-color="#813820"/>
              </linearGradient>
            </defs>
            <path d="M48 8 L78 38 L48 88 L18 38 Z" fill="url(#lant-grad)" stroke="#5F2A19" stroke-width="2"/>
            <circle cx="48" cy="38" r="11" fill="#FAF7F2"/>
            <path d="M40 50 l6 6 l12 -14" fill="none" stroke="#3C8C50" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <h1 class="font-display text-4xl font-medium mb-3">
        Your <em class="italic text-primary-600 not-italic" style="font-style: italic;">waypoint</em> is reserved.
      </h1>
      <p class="text-base text-text-muted max-w-[48ch] mx-auto mb-8">
        A confirmation has been sent to your email address.
      </p>

      <!-- Reference pill -->
      <div class="inline-flex items-center gap-3 px-5 py-3 bg-surface border border-border-strong rounded-full mb-10" data-testid="reference-pill">
        <span class="text-sm text-text-muted">Booking reference</span>
        <span class="font-mono font-semibold text-primary-700 tracking-wide text-sm" data-testid="reference-code">{{ booking.reference }}</span>
        <button
          type="button"
          class="w-6 h-6 flex items-center justify-center rounded text-text-subtle hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          aria-label="Copy reference"
          @click="copyReference"
        >
          <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="text-success">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
      </div>

      <!-- Summary card -->
      <div class="text-left bg-surface border border-border rounded-xl overflow-hidden shadow-sm mb-8">
        <!-- Listing header -->
        <div class="flex gap-4 px-6 py-5 border-b border-border">
          <div class="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-neutral-100">
            <img
              v-if="store.params?.imageUrl"
              :src="store.params.imageUrl"
              :alt="store.params.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <p class="font-display text-base font-medium leading-snug">{{ store.params?.title }}</p>
            <p class="text-sm text-text-muted mt-0.5">{{ store.params?.city }}, {{ store.params?.country }}</p>
          </div>
        </div>

        <!-- Date grid -->
        <div class="grid grid-cols-3 gap-4 px-6 py-5">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wide text-text-subtle mb-1">Check in</p>
            <p class="text-sm font-medium">{{ formatDateShort(booking.startDate) }}</p>
          </div>
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wide text-text-subtle mb-1">Check out</p>
            <p class="text-sm font-medium">{{ formatDateShort(booking.endDate) }}</p>
          </div>
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wide text-text-subtle mb-1">Guests</p>
            <p class="text-sm font-medium">{{ booking.guests }} guest{{ booking.guests !== 1 ? 's' : '' }}</p>
          </div>
        </div>

        <!-- Total -->
        <div class="flex justify-between items-baseline px-6 py-5 bg-neutral-50 border-t border-border">
          <span class="text-sm text-text-muted">Total paid</span>
          <span class="font-display text-xl font-medium">{{ formatAmount(booking.total) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-center gap-3 flex-wrap">
        <button
          type="button"
          class="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary-600 transition-colors"
          @click="navigateTo('/')"
        >
          Back to home
        </button>
        <button
          type="button"
          class="bg-surface text-neutral-800 border border-border-strong px-8 py-3 rounded-md font-medium hover:bg-neutral-50 hover:border-neutral-700 transition-colors"
          @click="navigateTo('/')"
        >
          View my trips
        </button>
      </div>

    </div>
  </main>
</template>
