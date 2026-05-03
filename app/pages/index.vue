<script setup lang="ts">
import type { Listing } from '~/types/listing'

const listing: Listing = {
  id: 1,
  title: 'Magnifique chalet avec vue sur le Mont-Tremblant et le lac des Sables',
  city: 'Mont-Tremblant',
  country: 'Canada',
  pricePerNight: 125,
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
}
</script>

<template>
  <div class="p-8">
    <ListingCard :listing="listing" />
  </div>
</template>