// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@sidebase/nuxt-auth', '@pinia/nuxt'],
  auth: {
    provider: {
      type: 'authjs',
    },
    isEnabled: true,
  },
  css: ['@vuepic/vue-datepicker/dist/main.css', '~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL ?? '',
    supabaseKey: process.env.SUPABASE_KEY ?? '',
  },
})
