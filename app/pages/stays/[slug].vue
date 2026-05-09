<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useFetch, useRoute } from '#app'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type { ListingDetailResponse } from '~/types/listing'

const route = useRoute()
const slug = route.params.slug as string

// SPEC-GAP: no await — Nuxt SSR awaits all useFetch calls automatically; 404 is thrown by the API handler
const { data } = useFetch<ListingDetailResponse>(`/api/stays/${slug}`)

const listing = computed(() => data.value?.listing ?? null)

// Gallery
const activeIndex = ref(0)
const thumbnailRefs = ref<HTMLElement[]>([])

function prevImage() {
  activeIndex.value = (activeIndex.value - 1 + listing.value.images.length) % listing.value.images.length
}

function nextImage() {
  activeIndex.value = (activeIndex.value + 1) % listing.value.images.length
}

function setActive(index: number) {
  activeIndex.value = index
}

watch(activeIndex, async (idx) => {
  await nextTick()
  thumbnailRefs.value[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
})

// Booking
const dateRange = ref<Date[] | null>(null)
const guests = ref(1)

function decreaseGuests() {
  if (guests.value > 1) guests.value--
}

function increaseGuests() {
  if (guests.value < listing.value.guests) guests.value++
}

const nights = computed(() => {
  if (!dateRange.value?.[0] || !dateRange.value?.[1]) return 0
  const ms = dateRange.value[1].getTime() - dateRange.value[0].getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
})

const totalPrice = computed(() => nights.value * listing.value.pricePerNight)

// Host
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Amenities
function amenityIcon(name: string): string {
  const icons: Record<string, string> = {
    wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r=".5" fill="currentColor" stroke="none"/>',
    kitchen: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="11"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    fireplace: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    bbq: '<path d="M4 11h16"/><path d="M12 11v8"/><path d="M7.5 11L6 16l6-3 6 3-1.5-5"/><path d="M8 7c0-2 1.5-4 4-4s4 2 4 4"/>',
    washer: '<rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M7 6h.01M10 6h.01"/>',
    dryer: '<rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M12 9v4l2 2"/>',
    elevator: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="m9 10 3-3 3 3"/><path d="m9 14 3 3 3-3"/>',
    dock: '<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
    kayak: '<path d="m2 19 10-10M9 4l11 11"/><circle cx="12" cy="12" r="2"/>',
    heating: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
    tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>',
  }
  return icons[name.toLowerCase()] ?? '<polyline points="20 6 9 17 4 12"/>'
}
</script>

<template>
  <AppHeader />

  <main v-if="listing">
    <!-- Photo Gallery -->
    <section class="relative">
      <!-- Hero image -->
      <div class="w-full aspect-[16/9] relative overflow-hidden bg-neutral-100">
        <img
          v-if="listing.images.length"
          :src="listing.images[activeIndex].url"
          :alt="listing.title"
          class="w-full h-full object-cover"
          data-testid="hero-image"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center"
          data-testid="gallery-placeholder"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-16 h-16 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>

        <!-- Arrows -->
        <template v-if="listing.images.length > 1">
          <button
            type="button"
            @click="prevImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface shadow-md flex items-center justify-center hover:bg-neutral-100 transition-colors"
            data-testid="prev-arrow"
            aria-label="Previous image"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            type="button"
            @click="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface shadow-md flex items-center justify-center hover:bg-neutral-100 transition-colors"
            data-testid="next-arrow"
            aria-label="Next image"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </template>
      </div>

      <!-- Thumbnail strip -->
      <div
        v-if="listing.images.length"
        class="flex gap-2 overflow-x-auto py-3 px-4"
      >
        <button
          v-for="(img, i) in listing.images"
          :key="img.id"
          :ref="(el) => { if (el) thumbnailRefs[i] = el as HTMLElement }"
          type="button"
          @click="setActive(i)"
          class="flex-shrink-0 w-24 aspect-[4/3] rounded-md overflow-hidden"
          :class="i === activeIndex ? 'ring-2 ring-primary ring-offset-1' : 'opacity-70 hover:opacity-100'"
          data-testid="thumbnail"
          :aria-label="`Photo ${i + 1}`"
          :aria-pressed="i === activeIndex"
        >
          <img :src="img.url" :alt="`Photo ${i + 1}`" class="w-full h-full object-cover" />
        </button>
      </div>
    </section>

    <!-- Two-column layout -->
    <div class="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">

      <!-- Left column -->
      <div class="lg:col-span-2">

        <!-- Listing header -->
        <h1 class="font-display text-3xl font-semibold text-text">{{ listing.title }}</h1>
        <p class="text-text-muted text-base mt-1">{{ listing.city }}, {{ listing.country }}</p>
        <p class="text-text-muted text-base mt-2">
          {{ listing.guests }} guests · {{ listing.bedrooms }} bedrooms ·
          {{ listing.beds }} beds · {{ listing.bathrooms }} bathrooms
        </p>

        <!-- Host info -->
        <div v-if="listing.host" class="flex items-center gap-3 mt-6">
          <img
            v-if="listing.host.avatarUrl"
            :src="listing.host.avatarUrl"
            :alt="listing.host.name"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div
            v-else
            class="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-text"
          >
            {{ getInitials(listing.host.name) }}
          </div>
          <span class="text-base font-medium">Hosted by {{ listing.host.name }}</span>
        </div>

        <hr class="border-t border-border my-6" />

        <!-- Description -->
        <p class="font-sans text-base text-text leading-relaxed">{{ listing.description }}</p>

        <hr class="border-t border-border my-6" />

        <!-- Amenities -->
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="amenity in listing.amenities"
            :key="amenity"
            class="flex items-center gap-2 bg-surface-sunken rounded-md px-3 py-2 text-sm"
          >
            <svg
              class="w-4 h-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="amenityIcon(amenity)"
            />
            <span class="capitalize">{{ amenity }}</span>
          </div>
        </div>

      </div>

      <!-- Right column — booking card -->
      <div class="lg:col-span-1">
        <div class="sticky top-24 bg-surface rounded-xl shadow-lg p-6 border border-border">

          <!-- Price -->
          <p class="font-display text-2xl font-semibold text-text">
            {{ listing.pricePerNight }} $ / night
          </p>

          <!-- Date range -->
          <div class="mt-4">
            <label class="block text-xs font-medium text-neutral-800 mb-1">
              Check-in → Check-out
            </label>
            <VueDatePicker v-model="dateRange" range :min-date="new Date()" />
          </div>

          <!-- Guests selector -->
          <div class="mt-4">
            <label class="block text-xs font-medium text-neutral-800 mb-1">Guests</label>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="decreaseGuests"
                :disabled="guests === 1"
                class="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-base font-medium text-text disabled:cursor-not-allowed disabled:opacity-40"
                data-testid="guests-decrease"
              >
                -
              </button>
              <span class="w-6 text-center text-sm font-medium text-text" data-testid="guests-value">
                {{ guests }}
              </span>
              <button
                type="button"
                @click="increaseGuests"
                :disabled="guests === listing.guests"
                class="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-base font-medium text-text disabled:cursor-not-allowed disabled:opacity-40"
                data-testid="guests-increase"
              >
                +
              </button>
            </div>
          </div>

          <!-- Reserve (placeholder) -->
          <button
            type="button"
            class="mt-6 bg-primary text-white w-full py-3 rounded-md font-medium text-base hover:bg-primary-600 transition-colors"
          >
            Reserve
          </button>

          <!-- Total price — only when dates selected -->
          <p
            v-if="nights > 0"
            class="mt-3 text-sm text-text-muted"
            data-testid="total-price"
          >
            Total: {{ nights }} nights × {{ listing.pricePerNight }} $ = {{ totalPrice }} $
          </p>

        </div>
      </div>

    </div>
  </main>
</template>
