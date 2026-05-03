<script setup lang="ts">
import type { SearchParams } from '~/types/search'

function onSearch(params: SearchParams) {
  console.log('search', params)
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <SearchBar @search="onSearch" />
    <div class="mt-8">
      <ListingGrid />
    </div>
  </div>
</template>
