<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useBookingStore } from '~/stores/booking'
import { isValidLuhn } from '../../../../server/utils/luhn'
import type { BookingFormData } from '~/types/booking'

const route = useRoute()
const slug = route.params.slug as string
const store = useBookingStore()

onMounted(() => {
  if (!store.params) {
    navigateTo(`/stays/${slug}`)
  }
})

const params = computed(() => store.params)
const breakdown = computed(() => store.breakdown)

// Form fields
const fullName = ref('')
const email = ref('')
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')

// Errors (shown on submit only)
const errors = ref<Partial<Record<keyof BookingFormData, string>>>({})

const isLoading = ref(false)
const apiError = ref('')

function formatCardNumber(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value.replace(/\D/g, '').slice(0, 16)
  cardNumber.value = raw.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value.replace(/\D/g, '').slice(0, 4)
  expiry.value = raw.length > 2 ? `${raw.slice(0, 2)} / ${raw.slice(2)}` : raw
}

function formatCvv(e: Event) {
  const input = e.target as HTMLInputElement
  cvv.value = input.value.replace(/\D/g, '').slice(0, 4)
}

function validateExpiry(value: string): boolean {
  const match = value.replace(/\s/g, '').match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  const month = parseInt(match[1], 10)
  const year = 2000 + parseInt(match[2], 10)
  if (month < 1 || month > 12) return false
  const now = new Date()
  const expDate = new Date(year, month - 1, 1)
  const firstOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return expDate >= firstOfCurrentMonth
}

function validate(): boolean {
  const errs: Partial<Record<keyof BookingFormData, string>> = {}

  if (!fullName.value.trim()) errs.fullName = 'Full name is required.'
  if (!email.value.trim()) {
    errs.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errs.email = 'Please enter a valid email address.'
  }
  if (!cardNumber.value.trim()) {
    errs.cardNumber = 'Card number is required.'
  } else if (!isValidLuhn(cardNumber.value)) {
    errs.cardNumber = 'Invalid card number.'
  }
  if (!expiry.value.trim()) {
    errs.expiry = 'Expiry date is required.'
  } else if (!validateExpiry(expiry.value)) {
    errs.expiry = 'Please enter a valid expiry date (MM / YY).'
  }
  if (!cvv.value.trim()) {
    errs.cvv = 'CVV is required.'
  } else if (!/^\d{3,4}$/.test(cvv.value)) {
    errs.cvv = 'CVV must be 3 or 4 digits.'
  }

  errors.value = errs
  return Object.keys(errs).length === 0
}

async function submit() {
  if (!validate() || !params.value || !breakdown.value) return

  isLoading.value = true
  apiError.value = ''

  const formData: BookingFormData = {
    fullName: fullName.value.trim(),
    email: email.value.trim(),
    cardNumber: cardNumber.value,
    expiry: expiry.value,
    cvv: cvv.value,
  }

  try {
    const response = await $fetch('/api/bookings', {
      method: 'POST',
      body: {
        listingId: params.value.listingId,
        startDate: params.value.startDate.toISOString().split('T')[0],
        endDate: params.value.endDate.toISOString().split('T')[0],
        guests: params.value.guests,
        fullName: formData.fullName,
        email: formData.email,
        nights: breakdown.value.nights,
        pricePerNight: breakdown.value.pricePerNight,
        cleaningFee: breakdown.value.cleaningFee,
        serviceFee: breakdown.value.serviceFee,
        total: breakdown.value.total,
      },
    }) as { booking: import('~/types/booking').Booking }

    store.setForm(formData)
    store.setConfirmedBooking(response.booking)
    navigateTo(`/booking/${slug}/confirmation`)
  } catch {
    apiError.value = 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function formatAmount(n: number): string {
  return `${Math.round(n).toLocaleString('en-CA')} $`
}
</script>

<template>
  <AppHeader :secure-mode="true" />
  <BookingStepper :current-step="2" :slug="slug" />

  <main v-if="params && breakdown" class="max-w-5xl mx-auto px-6 py-12 pb-20">
    <button
      type="button"
      class="inline-flex items-center gap-2 px-2 py-2 -ml-2 rounded-md text-sm font-medium text-text hover:bg-neutral-100 transition-colors"
      @click="navigateTo(`/booking/${slug}/summary`)"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      Back to review
    </button>

    <h1 class="font-display text-3xl font-semibold mt-4 mb-8">Pay with confidence</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">

      <!-- Left column — form -->
      <div class="lg:col-span-2">

        <!-- Secure note -->
        <div class="flex items-start gap-3 bg-secondary-100 border border-secondary-200 rounded-md p-4 mb-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary-700 flex-shrink-0 mt-0.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <div>
            <p class="text-sm font-medium text-secondary-700 mb-0.5">Your payment info is protected</p>
            <p class="text-xs text-secondary-700 opacity-85">Encrypted in transit · Never stored on Wayrest servers · This is a demo, no real charges occur.</p>
          </div>
        </div>

        <form novalidate @submit.prevent="submit">
          <div class="bg-surface border border-border rounded-lg p-6">

            <h3 class="font-display text-lg font-medium mb-5">Contact details</h3>

            <!-- Full name -->
            <div class="flex flex-col gap-2 mb-5">
              <label for="full-name" class="text-sm font-medium text-neutral-800">Full name</label>
              <input
                id="full-name"
                v-model="fullName"
                type="text"
                placeholder="Émilie Tremblay"
                autocomplete="name"
                class="h-12 px-4 rounded-md border bg-surface text-text text-base transition-colors"
                :class="errors.fullName ? 'border-error focus:border-error focus:shadow-glow-error' : 'border-border-strong hover:border-neutral-500 focus:border-primary focus:shadow-glow'"
                data-testid="input-full-name"
              />
              <p v-if="errors.fullName" class="text-xs text-error" data-testid="error-full-name">{{ errors.fullName }}</p>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2 mb-5">
              <label for="email" class="text-sm font-medium text-neutral-800">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="emilie@example.ca"
                autocomplete="email"
                class="h-12 px-4 rounded-md border bg-surface text-text text-base transition-colors"
                :class="errors.email ? 'border-error focus:border-error focus:shadow-glow-error' : 'border-border-strong hover:border-neutral-500 focus:border-primary focus:shadow-glow'"
                data-testid="input-email"
              />
              <p v-if="errors.email" class="text-xs text-error" data-testid="error-email">{{ errors.email }}</p>
            </div>

            <h3 class="font-display text-lg font-medium mt-8 mb-5">Card details</h3>

            <!-- Card number -->
            <div class="flex flex-col gap-2 mb-5">
              <label for="card-number" class="text-sm font-medium text-neutral-800">Card number</label>
              <div class="relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none">
                  <rect x="2" y="6" width="20" height="13" rx="2"/>
                  <line x1="2" y1="11" x2="22" y2="11"/>
                </svg>
                <input
                  id="card-number"
                  :value="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  inputmode="numeric"
                  maxlength="19"
                  autocomplete="cc-number"
                  class="h-12 pl-12 pr-4 w-full rounded-md border bg-surface text-text text-base transition-colors"
                  :class="errors.cardNumber ? 'border-error focus:border-error focus:shadow-glow-error' : 'border-border-strong hover:border-neutral-500 focus:border-primary focus:shadow-glow'"
                  data-testid="input-card-number"
                  @input="formatCardNumber"
                />
              </div>
              <p v-if="errors.cardNumber" class="text-xs text-error" data-testid="error-card-number">{{ errors.cardNumber }}</p>
            </div>

            <!-- Expiry + CVV -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2 mb-5">
                <label for="expiry" class="text-sm font-medium text-neutral-800">Expiry</label>
                <input
                  id="expiry"
                  :value="expiry"
                  type="text"
                  placeholder="MM / YY"
                  inputmode="numeric"
                  maxlength="7"
                  autocomplete="cc-exp"
                  class="h-12 px-4 rounded-md border bg-surface text-text text-base transition-colors"
                  :class="errors.expiry ? 'border-error focus:border-error focus:shadow-glow-error' : 'border-border-strong hover:border-neutral-500 focus:border-primary focus:shadow-glow'"
                  data-testid="input-expiry"
                  @input="formatExpiry"
                />
                <p v-if="errors.expiry" class="text-xs text-error" data-testid="error-expiry">{{ errors.expiry }}</p>
              </div>

              <div class="flex flex-col gap-2 mb-5">
                <label for="cvv" class="text-sm font-medium text-neutral-800">CVV</label>
                <input
                  id="cvv"
                  :value="cvv"
                  type="text"
                  placeholder="•••"
                  inputmode="numeric"
                  maxlength="4"
                  autocomplete="cc-csc"
                  class="h-12 px-4 rounded-md border bg-surface text-text text-base transition-colors"
                  :class="errors.cvv ? 'border-error focus:border-error focus:shadow-glow-error' : 'border-border-strong hover:border-neutral-500 focus:border-primary focus:shadow-glow'"
                  data-testid="input-cvv"
                  @input="formatCvv"
                />
                <p v-if="errors.cvv" class="text-xs text-error" data-testid="error-cvv">{{ errors.cvv }}</p>
              </div>
            </div>
          </div>

          <!-- Terms -->
          <p class="text-xs text-text-muted leading-relaxed my-6">
            By selecting <strong class="text-text font-medium">Pay now</strong>, you agree to Wayrest's
            House Rules, Refund Policy, and Terms of Service.
            You also agree to a hold on your payment method for the trip total.
          </p>

          <!-- API error -->
          <p v-if="apiError" class="text-sm text-error mb-4">{{ apiError }}</p>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary text-white py-3 rounded-md font-medium text-base hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid="pay-btn"
          >
            <svg v-if="isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" class="animate-spin">
              <path d="M21 12a9 9 0 1 1-6.2-8.55"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {{ isLoading ? 'Processing…' : `Pay ${formatAmount(breakdown.total)} now` }}
          </button>
        </form>
      </div>

      <!-- Right column — price summary -->
      <div class="lg:col-span-1">
        <div class="sticky bg-surface border border-border rounded-xl shadow-sm p-6" style="top: calc(72px + 1.5rem)">

          <div class="flex gap-4 pb-5 border-b border-border mb-4">
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

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span>{{ params.pricePerNight }} $ × {{ breakdown.nights }} night{{ breakdown.nights !== 1 ? 's' : '' }}</span>
              <span>{{ formatAmount(breakdown.pricePerNight * breakdown.nights) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Cleaning fee</span>
              <span>{{ formatAmount(breakdown.cleaningFee) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Service fee ({{ params.serviceFeePct }}%)</span>
              <span>{{ formatAmount(breakdown.serviceFee) }}</span>
            </div>
          </div>

          <div class="flex justify-between font-semibold text-base pt-4 border-t border-border">
            <span>Total</span>
            <span>{{ formatAmount(breakdown.total) }}</span>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>
