<script setup lang="ts">
import { ref } from 'vue'
import type { ListingCardProps } from '../types/listing'

defineProps<ListingCardProps>()

const hasError = ref(false)

function onImageError() {
  hasError.value = true
}
</script>

<template>
  <div class="rounded-lg overflow-hidden bg-surface shadow-md cursor-pointer transition-all duration-base ease-out hover:-translate-y-0.5 hover:shadow-lg">
    <div class="aspect-[4/3] bg-neutral-100">
      <img
        v-if="listing.imageUrl && !hasError"
        :src="listing.imageUrl"
        :alt="listing.title"
        class="w-full h-full object-cover"
        @error="onImageError"
      />
      <!-- SPEC-GAP: placeholder visual design (colors, icon size) not specified → neutral gray with centered icon -->
      <div
        v-else
        data-testid="placeholder"
        class="w-full h-full flex items-center justify-center bg-neutral-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-12 h-12 text-neutral-400"
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
    </div>
    <!-- SPEC-GAP: card padding and text sizing not specified → p-3 / text-sm -->
    <div class="p-5 flex flex-col gap-2">
      <h2 data-testid="title" class="font-display font-medium text-lg tracking-tighter line-clamp-2">
        {{ listing.title }}
      </h2>
      <p class="text-sm text-text-muted">{{ listing.city }}, {{ listing.country }}</p>
      <p class="text-sm text-text-muted">{{ listing.pricePerNight }} $ / night</p>
    </div>
  </div>
</template>
