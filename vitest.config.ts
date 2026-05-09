import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
      '@': resolve(__dirname, './app'),
      '#app': 'nuxt/app',
      '#auth': resolve(__dirname, 'node_modules/@sidebase/nuxt-auth/dist/runtime/server/services/index.js'),
    },
  },
})
