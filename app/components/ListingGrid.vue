<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '#app'
import ListingCard from './ListingCard.vue'
import type { ListingsResponse } from '~/types/listing'

const { data, status, error } = useFetch<ListingsResponse>('/api/listings')

const isLoading = computed(() => status.value === 'pending')
const hasError = computed(() => status.value === 'error')
const listings = computed(() => data.value?.listings ?? [])
const isEmpty = computed(() => !isLoading.value && !hasError.value && listings.value.length === 0)
</script>

<template>
  <div class="@container" data-testid="listing-grid">
    <div
      v-if="isLoading"
      class="grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-3 @[1280px]:grid-cols-4 gap-4"
      data-testid="skeleton-grid"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="rounded-xl overflow-hidden animate-pulse"
        data-testid="skeleton-card"
      >
        <div class="aspect-[4/3] bg-gray-200" />
        <div class="p-3 space-y-2">
          <div class="h-3 bg-gray-200 rounded w-3/4" />
          <div class="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
    <p
      v-else-if="hasError"
      data-testid="error-message"
    >
      An error occurred. Please try again later.
    </p>
    <p
      v-else-if="isEmpty"
      data-testid="empty-message"
    >
      No listings found.
    </p>
    <div
      v-else
      class="grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-3 @[1280px]:grid-cols-4 gap-4"
      data-testid="listing-cards-grid"
    >
      <ListingCard
        v-for="listing in listings"
        :key="listing.id"
        :listing="listing"
      />
    </div>
  </div>
</template>
