<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

defineProps<{ secureMode?: boolean }>()

const { data: session, status, signOut } = useAuth()
const authStore = useAuthStore()
const dropdownOpen = ref(false)

function initials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || name[0].toUpperCase()
}

async function handleSignOut() {
  dropdownOpen.value = false
  await signOut({ redirect: false })
}

function onClickOutside(e: MouseEvent) {
  const wrap = (e.target as Element).closest('[data-dropdown-wrap]')
  if (!wrap) dropdownOpen.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <header class="bg-surface shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

      <a href="/" class="flex items-center gap-2">
        <span class="w-9 h-9 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2 L19 9 L12 22 L5 9 Z" />
            <circle cx="12" cy="9" r="2.5" fill="white" stroke="none" />
          </svg>
        </span>
        <span class="font-display text-xl font-semibold text-neutral-900">Wayrest</span>
      </a>

      <span v-if="secureMode" class="inline-flex items-center gap-2 text-sm text-text-muted">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secure checkout
      </span>

      <nav v-else class="flex items-center gap-2">
        <button type="button" class="text-neutral-800 hover:text-text px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-100 transition-colors">
          List your place
        </button>

        <!-- Unauthenticated -->
        <button
          v-if="status !== 'authenticated'"
          type="button"
          class="h-10 px-5 bg-primary text-white rounded-md font-medium text-sm hover:bg-primary-600 transition-colors focus-visible:outline-none focus-visible:shadow-glow"
          @click="authStore.openSignIn()"
        >
          Sign in
        </button>

        <!-- Authenticated: avatar + dropdown -->
        <div v-else class="relative" data-dropdown-wrap>
          <button
            type="button"
            class="flex items-center gap-2 h-11 pl-3 pr-1 border border-border-strong rounded-full bg-surface hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:shadow-glow"
            :aria-expanded="dropdownOpen"
            aria-haspopup="menu"
            @click.stop="dropdownOpen = !dropdownOpen"
          >
            <span class="text-text grid place-items-center w-4 h-4" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </span>
            <span
              class="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary-700 text-white grid place-items-center font-semibold text-xs tracking-wide flex-shrink-0"
              aria-hidden="true"
            >
              {{ initials(session?.user?.fullName ?? session?.user?.name) }}
            </span>
          </button>

          <div
            v-if="dropdownOpen"
            class="absolute top-[calc(100%+8px)] right-0 min-w-[240px] bg-surface border border-border rounded-md shadow-lg py-2 z-40"
            role="menu"
          >
            <!-- Name + email header row -->
            <div class="px-3 pt-3 pb-4 flex gap-3 items-center border-b border-border mb-2">
              <span class="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary-700 text-white grid place-items-center font-semibold flex-shrink-0">
                {{ initials(session?.user?.fullName ?? session?.user?.name) }}
              </span>
              <div class="min-w-0">
                <p class="font-semibold text-[0.9375rem] truncate">{{ session?.user?.fullName ?? session?.user?.name }}</p>
                <p class="text-[0.8125rem] text-text-muted mt-0.5 truncate">{{ session?.user?.email }}</p>
              </div>
            </div>

            <button
              type="button"
              class="flex items-center gap-3 w-full px-3 py-3 text-[0.9375rem] text-text hover:bg-neutral-100 transition-colors rounded-sm text-left"
              role="menuitem"
              @click="navigateTo('/my-bookings'); dropdownOpen = false"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted flex-shrink-0">
                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l7-4 7 4z" />
              </svg>
              My bookings
            </button>

            <div class="h-px bg-border my-2" />

            <button
              type="button"
              class="flex items-center gap-3 w-full px-3 py-3 text-[0.9375rem] text-error-700 hover:bg-error-50 transition-colors rounded-sm text-left"
              role="menuitem"
              @click="handleSignOut"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-error flex-shrink-0">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </nav>

    </div>
  </header>
</template>
