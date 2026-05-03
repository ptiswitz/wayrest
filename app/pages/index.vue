<script setup lang="ts">
import type { Listing } from '~/types/listing'
import type { SearchParams } from '~/types/search'

const listing: Listing = {
  id: 1,
  title: 'Magnifique chalet avec vue sur le Mont-Tremblant et le lac des Sables',
  city: 'Mont-Tremblant',
  country: 'Canada',
  pricePerNight: 125,
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
}

function onSearch(params: SearchParams) {
  console.log('search', params)
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <SearchBar @search="onSearch" />
    <div class="mt-8">
      <ListingCard :listing="listing" />
    </div>
  </div>
</template>