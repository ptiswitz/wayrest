<script setup lang="ts">
import type { SearchParams } from '~/types/search'

function onSearch(params: SearchParams) {
  console.log('search', params)
}
</script>

<template>
  <AppHeader />

  <!-- Hero -->
  <section class="bg-surface-sunken py-12 px-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="font-display font-normal text-6xl text-text text-center mb-8">
        Find your next <em class="text-primary">waypoint</em>.
      </h1>
      <p class="text-lg text-text-muted text-center mb-8">
        Cabins, coastal hideaways, and city stopovers — chosen for the journey, not just the destination.
      </p>
    </div>
    <SearchBar @search="onSearch" class="max-w-5xl mx-auto" />
  </section>

  <!-- Listings -->
  <section class="py-12 px-6">
    <div class="max-w-7xl mx-auto">
      <ListingGrid />
    </div>
  </section>
</template>
