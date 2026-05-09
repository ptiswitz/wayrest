<template>
  <div class="min-h-screen bg-bg">
    <NuxtPage />
    <AuthModal />
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap'
    }
  ]
})
</script>