<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useBookingStore } from '~/stores/booking'

const route = useRoute()
const slug = route.params.slug as string
const store = useBookingStore()

onMounted(() => {
  if (!store.params) {
    navigateTo(`/stays/${slug}`)
  }
})

const params = computed(() => store.params)

const nights = computed(() => {
  if (!params.value) return 0
  const ms = params.value.endDate.getTime() - params.value.startDate.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
})

const breakdown = computed(() => {
  if (!params.value || nights.value === 0) return null
  const subtotal = nights.value * params.value.pricePerNight
  const serviceFee = Math.round(subtotal * params.value.serviceFeePct / 100)
  return {
    nights: nights.value,
    pricePerNight: params.value.pricePerNight,
    cleaningFee: params.value.cleaningFee,
    serviceFee,
    total: subtotal + params.value.cleaningFee + serviceFee,
  }
})

onMounted(() => {
  if (breakdown.value) {
    store.setBreakdown(breakdown.value)
  }
})

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatAmount(n: number): string {
  return `${Math.round(n).toLocaleString('en-CA')} $`
}

function goToPayment() {
  navigateTo(`/booking/${slug}/payment`)
}
</script>

<template>
  <AppHeader :secure-mode="true" />
  <BookingStepper :current-step="1" :slug="slug" />

  <main v-if="params && breakdown" class="max-w-5xl mx-auto px-6 py-12 pb-20">
    <button
      type="button"
      class="inline-flex items-center gap-2 px-2 py-2 -ml-2 rounded-md text-sm font-medium text-text hover:bg-neutral-100 transition-colors"
      @click="navigateTo(`/stays/${slug}`)"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      Back to listing
    </button>

    <h1 class="font-display text-3xl font-semibold mt-4 mb-8">Confirm your waypoint</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">

      <!-- Left column -->
      <div class="lg:col-span-2 space-y-4">

        <!-- Your trip panel -->
        <div class="bg-surface border border-border rounded-lg p-6">
          <div class="flex justify-between items-start gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-text-subtle mb-1">Your trip</p>
              <p class="font-display text-base font-medium">Dates</p>
              <p class="mt-1 text-sm text-text-muted">
                {{ formatDate(params.startDate) }} → {{ formatDate(params.endDate) }} · {{ nights }} night{{ nights !== 1 ? 's' : '' }}
              </p>
            </div>
            <button type="button" class="text-sm font-medium underline underline-offset-[3px] hover:text-primary-700">Edit</button>
          </div>

          <div class="h-px bg-border my-5" />

          <div class="flex justify-between items-start gap-4">
            <div>
              <p class="font-display text-base font-medium">Guests</p>
              <p class="mt-1 text-sm text-text-muted">{{ params.guests }} guest{{ params.guests !== 1 ? 's' : '' }}</p>
            </div>
            <button type="button" class="text-sm font-medium underline underline-offset-[3px] hover:text-primary-700">Edit</button>
          </div>
        </div>

        <!-- Cancellation policy panel -->
        <div class="bg-surface border border-border rounded-lg p-6">
          <h3 class="font-display text-lg font-medium mb-4">Cancellation policy</h3>
          <p class="text-sm text-text-muted leading-relaxed">
            Free cancellation before check-in. Cancel before your trip for a partial refund.
          </p>
        </div>

        <!-- Ground rules panel -->
        <div class="bg-surface border border-border rounded-lg p-6">
          <h3 class="font-display text-lg font-medium mb-3">Ground rules</h3>
          <p class="text-sm text-text-muted leading-relaxed mb-3">
            We ask every guest to remember a few simple things about what makes a great host.
          </p>
          <ul class="list-disc pl-5 text-sm text-text-muted leading-relaxed space-y-1">
            <li>Follow the house rules</li>
            <li>Treat the home like your own</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-6 mt-8">
          <button
            type="button"
            class="bg-primary text-white px-6 py-3 rounded-md font-medium text-base hover:bg-primary-600 transition-colors"
            data-testid="confirm-btn"
            @click="goToPayment"
          >
            Confirm reservation
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 text-sm font-medium hover:text-primary-700 transition-colors"
            @click="navigateTo(`/stays/${slug}`)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </button>
        </div>
      </div>

      <!-- Right column — price breakdown card -->
      <div class="lg:col-span-1">
        <div class="sticky bg-surface border border-border rounded-xl shadow-sm p-6" style="top: calc(72px + 1.5rem)">

          <!-- Listing thumbnail + meta -->
          <div class="flex gap-4 pb-5 border-b border-border mb-5">
            <div class="flex-shrink-0 w-[92px] h-[92px] rounded-md overflow-hidden bg-neutral-100">
              <img
                v-if="params.imageUrl"
                :src="params.imageUrl"
                :alt="params.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-text-muted mb-1">{{ params.city }}, {{ params.country }}</p>
              <p class="font-display text-base font-medium leading-snug line-clamp-2">{{ params.title }}</p>
            </div>
          </div>

          <!-- Price details -->
          <h3 class="font-display text-lg font-medium mb-4">Price details</h3>

          <div class="space-y-2">
            <div class="flex justify-between text-sm" data-testid="line-nights">
              <span class="underline underline-offset-[3px]">{{ params.pricePerNight }} $ × {{ breakdown.nights }} night{{ breakdown.nights !== 1 ? 's' : '' }}</span>
              <span>{{ formatAmount(breakdown.pricePerNight * breakdown.nights) }}</span>
            </div>
            <div class="flex justify-between text-sm" data-testid="line-cleaning">
              <span class="underline underline-offset-[3px]">Cleaning fee</span>
              <span>{{ formatAmount(breakdown.cleaningFee) }}</span>
            </div>
            <div class="flex justify-between text-sm" data-testid="line-service">
              <span class="underline underline-offset-[3px]">Service fee ({{ params.serviceFeePct }}%)</span>
              <span>{{ formatAmount(breakdown.serviceFee) }}</span>
            </div>
          </div>

          <div class="flex justify-between font-semibold text-base mt-4 pt-4 border-t border-border" data-testid="line-total">
            <span>Total</span>
            <span>{{ formatAmount(breakdown.total) }}</span>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>
