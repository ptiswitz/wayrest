<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

const store = useAuthStore()
const route = useRoute()
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const forgotClicked = ref(false)
const emailError = ref('')
const passwordError = ref('')

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

async function handleSubmit() {
  emailError.value = ''
  passwordError.value = ''
  error.value = ''

  let ok = true
  if (!isValidEmail(email.value)) { emailError.value = 'Please enter a valid email address.'; ok = false }
  if (!password.value) { passwordError.value = 'Password is required.'; ok = false }
  if (!ok) return

  loading.value = true
  try {
    const redirectTo = store.modal.redirectTo ?? route.fullPath
    const result = await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: false,
    })

    if (result?.error) {
      error.value = 'Invalid email or password.'
      return
    }

    store.closeModal()
    await navigateTo(redirectTo)
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="font-display font-medium text-[1.75rem] leading-tight tracking-tight mb-2">
      Welcome <em class="not-italic text-primary-600">back.</em>
    </h2>
    <p class="text-[0.9375rem] text-text-muted mb-6">
      Pick up where you left off. Your saved waypoints are waiting.
    </p>

    <form novalidate @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-2 mb-4">
        <label for="signin-email" class="text-sm font-medium text-neutral-800">Email</label>
        <input
          id="signin-email"
          v-model="email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          class="font-sans text-base px-4 h-12 rounded-md border border-border-strong bg-surface text-text w-full transition-[border-color,box-shadow] duration-base ease-out placeholder:text-neutral-400 hover:border-neutral-500 focus:outline-none focus:border-primary focus:shadow-glow"
          :class="{ 'border-error focus:shadow-glow-error': emailError }"
        />
        <span v-if="emailError" class="flex items-center gap-1 text-[0.8125rem] text-error-700">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ emailError }}
        </span>
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label for="signin-password" class="text-sm font-medium text-neutral-800">Password</label>
        <div class="relative">
          <input
            id="signin-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            autocomplete="current-password"
            class="font-sans text-base px-4 pr-14 h-12 rounded-md border border-border-strong bg-surface text-text w-full transition-[border-color,box-shadow] duration-base ease-out placeholder:text-neutral-400 hover:border-neutral-500 focus:outline-none focus:border-primary focus:shadow-glow"
            :class="{ 'border-error focus:shadow-glow-error': passwordError }"
          />
          <button
            type="button"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-sm grid place-items-center text-text-subtle hover:bg-neutral-100 hover:text-text transition-colors focus-visible:outline-none"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-10-7-10-7a17.4 17.4 0 0 1 4.06-5.16" />
              <path d="M9.9 4.24A10.05 10.05 0 0 1 12 4c7 0 10 7 10 7a17.65 17.65 0 0 1-2.16 3.19" />
              <path d="M14.12 9.88 9.88 14.12" /><line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          </button>
        </div>
        <span v-if="passwordError" class="flex items-center gap-1 text-[0.8125rem] text-error-700">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ passwordError }}
        </span>
      </div>

      <p v-if="error" class="text-[0.8125rem] text-error-700 mb-3">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full h-12 bg-primary text-white rounded-md font-medium text-base cursor-pointer mt-2 hover:bg-primary-600 focus-visible:outline-none focus-visible:shadow-glow transition-colors disabled:opacity-60"
      >
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>

      <div class="text-center mt-4">
        <button
          type="button"
          class="text-sm font-medium text-neutral-900 underline underline-offset-[3px] hover:text-primary-700 px-1 rounded-sm focus-visible:outline-none focus-visible:shadow-glow"
          @click="forgotClicked = true"
        >
          Forgot password?
        </button>
        <p v-if="forgotClicked" class="text-sm text-text-muted mt-1">Password reset coming soon.</p>
      </div>
    </form>

    <div class="flex items-center gap-3 my-6 text-text-subtle text-[0.75rem] uppercase tracking-[0.12em] before:flex-1 before:h-px before:bg-border after:flex-1 after:h-px after:bg-border">
      or
    </div>

    <div class="text-[0.9375rem] flex items-center justify-center gap-1 flex-wrap">
      <span class="text-text-muted">New to Wayrest?</span>
      <button
        type="button"
        class="font-medium text-neutral-900 underline underline-offset-[3px] hover:text-primary-700 px-1 rounded-sm focus-visible:outline-none focus-visible:shadow-glow"
        @click="store.switchMode()"
      >
        Create an account
      </button>
    </div>
  </div>
</template>
