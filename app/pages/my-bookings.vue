<script setup lang="ts">
import { useFetch, navigateTo } from '#app'

const { data, pending } = useFetch<{
  bookings: Array<{
    id: number
    listing_id: number
    start_date: string
    end_date: string
    guests: number
    total: number
    reference: string
    created_at: string
    listings: { title: string; image_url: string | null } | null
  }>
}>('/api/my-bookings')

const bookings = computed(() => data.value?.bookings ?? [])

function isUpcoming(startDate: string): boolean {
  return new Date(startDate) >= new Date()
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-bg">
    <AppHeader />

    <main class="max-w-3xl mx-auto px-6 py-12">
      <h1 class="font-display font-medium text-3xl tracking-tight text-text mb-8">My bookings</h1>

      <div v-if="pending" class="text-text-muted text-sm">Loading…</div>

      <div v-else-if="bookings.length === 0" class="text-center py-16">
        <p class="text-text-muted mb-4">No bookings yet.</p>
        <button
          type="button"
          class="text-primary underline underline-offset-[3px] font-medium"
          @click="navigateTo('/')"
        >
          Explore stays
        </button>
      </div>

      <ul v-else class="flex flex-col gap-4">
        <li
          v-for="booking in bookings"
          :key="booking.id"
          class="bg-surface border border-border rounded-lg p-4 flex gap-4 items-start"
        >
          <!-- Thumbnail -->
          <img
            v-if="booking.listings?.image_url"
            :src="booking.listings.image_url"
            :alt="booking.listings?.title"
            class="w-24 h-24 rounded-lg object-cover flex-shrink-0"
          />
          <div
            v-else
            class="w-24 h-24 rounded-lg bg-neutral-100 flex-shrink-0"
            aria-hidden="true"
          />

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1">
              <p class="font-medium text-text truncate">{{ booking.listings?.title ?? 'Unknown listing' }}</p>
              <span
                class="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                :class="isUpcoming(booking.start_date)
                  ? 'bg-success-50 text-success-700'
                  : 'bg-neutral-100 text-neutral-500'"
              >
                {{ isUpcoming(booking.start_date) ? 'Upcoming' : 'Past' }}
              </span>
            </div>

            <p class="text-sm text-text-muted mb-1">
              {{ formatDate(booking.start_date) }} → {{ formatDate(booking.end_date) }}
            </p>
            <p class="text-sm text-text-muted mb-2">{{ booking.guests }} guest{{ booking.guests !== 1 ? 's' : '' }}</p>

            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="font-mono text-sm text-text-muted">{{ booking.reference }}</span>
              <span class="font-semibold text-text">{{ booking.total }} $</span>
            </div>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>
