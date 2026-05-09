<script setup lang="ts">
// SPEC-GAP: server/utils/validatePassword cannot be imported client-side in Nuxt builds;
// password rules are replicated inline here (same logic, same regex).
import { ref, computed } from 'vue'
import { navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

const store = useAuthStore()
const { signIn } = useAuth()

const fullName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')

const fullNameError = ref('')
const emailError = ref('')
const passwordErrors = ref<string[]>([])
const confirmError = ref('')

// Password strength meter — mirrors auth.html reference
function pwScore(pw: string): number {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 4)
}

const strengthScore = computed(() => pwScore(password.value))
const strengthLabels = [
  'Use 8+ characters with letters and numbers.',
  'Weak — add more characters.',
  'Fair — add a number or symbol.',
  'Strong.',
  'Very strong.',
]
const strengthLabel = computed(() => strengthLabels[strengthScore.value])
const strengthColors = ['', 'bg-error', 'bg-warning', 'bg-success', 'bg-success']

const passwordsMatch = computed(() => {
  if (!passwordConfirm.value) return null
  return password.value === passwordConfirm.value
})

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function validatePasswordRules(pw: string): string[] {
  const errs: string[] = []
  if (pw.length < 8) errs.push('At least 8 characters required')
  if (!/[A-Z]/.test(pw)) errs.push('At least 1 uppercase letter required')
  if (!/[0-9]/.test(pw)) errs.push('At least 1 number required')
  if (!/[^A-Za-z0-9]/.test(pw)) errs.push('At least 1 special character required')
  return errs
}

async function handleSubmit() {
  fullNameError.value = ''
  emailError.value = ''
  passwordErrors.value = []
  confirmError.value = ''
  error.value = ''

  let ok = true
  if (!fullName.value.trim()) { fullNameError.value = 'Please enter your name.'; ok = false }
  if (!isValidEmail(email.value)) { emailError.value = 'Please enter a valid email address.'; ok = false }
  const pwErrs = validatePasswordRules(password.value)
  if (pwErrs.length) { passwordErrors.value = pwErrs; ok = false }
  if (password.value !== passwordConfirm.value) { confirmError.value = "Passwords don't match."; ok = false }
  if (!ok) return

  loading.value = true
  try {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { fullName: fullName.value, email: email.value, password: password.value },
    })

    if (!res) throw new Error('Registration failed')

    const result = await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: false,
    })

    if (result?.error) {
      error.value = 'Account created but sign-in failed. Please sign in manually.'
      store.switchMode()
      return
    }

    store.closeModal()
    await navigateTo(store.modal.redirectTo ?? '/')
  } catch (err: unknown) {
    const status = (err as { statusCode?: number })?.statusCode
    if (status === 409) {
      emailError.value = 'This email is already registered.'
    } else {
      error.value = 'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="font-display font-medium text-[1.75rem] leading-tight tracking-tight mb-2">
      Join <em class="not-italic text-primary-600">Wayrest.</em>
    </h2>
    <p class="text-[0.9375rem] text-text-muted mb-6">
      Save places, message hosts, and book your next waypoint in seconds.
    </p>

    <form novalidate @submit.prevent="handleSubmit">
      <!-- Full name -->
      <div class="flex flex-col gap-2 mb-4">
        <label for="reg-name" class="text-sm font-medium text-neutral-800">Full name</label>
        <input
          id="reg-name"
          v-model="fullName"
          type="text"
          placeholder="Émilie Tremblay"
          autocomplete="name"
          class="font-sans text-base px-4 h-12 rounded-md border border-border-strong bg-surface text-text w-full transition-[border-color,box-shadow] duration-base ease-out placeholder:text-neutral-400 hover:border-neutral-500 focus:outline-none focus:border-primary focus:shadow-glow"
          :class="{ 'border-error focus:shadow-glow-error': fullNameError }"
        />
        <span v-if="fullNameError" class="flex items-center gap-1 text-[0.8125rem] text-error-700">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ fullNameError }}
        </span>
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-2 mb-4">
        <label for="reg-email" class="text-sm font-medium text-neutral-800">Email</label>
        <input
          id="reg-email"
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

      <!-- Password + strength meter -->
      <div class="flex flex-col gap-2 mb-4">
        <label for="reg-password" class="text-sm font-medium text-neutral-800">Password</label>
        <div class="relative">
          <input
            id="reg-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="At least 8 characters"
            autocomplete="new-password"
            class="font-sans text-base px-4 pr-14 h-12 rounded-md border border-border-strong bg-surface text-text w-full transition-[border-color,box-shadow] duration-base ease-out placeholder:text-neutral-400 hover:border-neutral-500 focus:outline-none focus:border-primary focus:shadow-glow"
            :class="{ 'border-error focus:shadow-glow-error': passwordErrors.length }"
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

        <!-- Strength bar -->
        <div class="flex gap-1 mt-1" aria-hidden="true">
          <span
            v-for="i in 4"
            :key="i"
            class="flex-1 h-1 rounded-sm transition-colors duration-base"
            :class="i <= strengthScore ? strengthColors[strengthScore] : 'bg-neutral-200'"
          />
        </div>
        <p class="text-[0.75rem] text-text-subtle mt-1">{{ strengthLabel }}</p>

        <span v-if="passwordErrors.length" class="flex items-center gap-1 text-[0.8125rem] text-error-700">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ passwordErrors[0] }}
        </span>
      </div>

      <!-- Confirm password -->
      <div class="flex flex-col gap-2 mb-4">
        <label for="reg-confirm" class="text-sm font-medium text-neutral-800">Confirm password</label>
        <div class="relative">
          <input
            id="reg-confirm"
            v-model="passwordConfirm"
            :type="showConfirm ? 'text' : 'password'"
            placeholder="Re-enter your password"
            class="font-sans text-base px-4 pr-14 h-12 rounded-md border border-border-strong bg-surface text-text w-full transition-[border-color,box-shadow] duration-base ease-out placeholder:text-neutral-400 hover:border-neutral-500 focus:outline-none focus:border-primary focus:shadow-glow"
            :class="{ 'border-error focus:shadow-glow-error': confirmError }"
          />
          <button
            type="button"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-sm grid place-items-center text-text-subtle hover:bg-neutral-100 hover:text-text transition-colors focus-visible:outline-none"
            :aria-label="showConfirm ? 'Hide password' : 'Show password'"
            @click="showConfirm = !showConfirm"
          >
            <svg v-if="!showConfirm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-10-7-10-7a17.4 17.4 0 0 1 4.06-5.16" />
              <path d="M9.9 4.24A10.05 10.05 0 0 1 12 4c7 0 10 7 10 7a17.65 17.65 0 0 1-2.16 3.19" />
              <path d="M14.12 9.88 9.88 14.12" /><line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          </button>
        </div>
        <p
          v-if="passwordsMatch !== null"
          class="text-[0.75rem] mt-1"
          :class="passwordsMatch ? 'text-success' : 'text-error-700'"
        >
          {{ passwordsMatch ? '✓ Passwords match.' : "Passwords don't match." }}
        </p>
        <span v-if="confirmError" class="text-[0.8125rem] text-error-700">{{ confirmError }}</span>
      </div>

      <p v-if="error" class="text-[0.8125rem] text-error-700 mb-3">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full h-12 bg-primary text-white rounded-md font-medium text-base cursor-pointer mt-2 hover:bg-primary-600 focus-visible:outline-none focus-visible:shadow-glow transition-colors disabled:opacity-60"
      >
        {{ loading ? 'Creating account…' : 'Create account' }}
      </button>

      <p class="text-[0.75rem] text-text-subtle mt-4 text-center leading-relaxed">
        By creating an account, you agree to Wayrest's
        <a href="#" class="text-neutral-900 underline underline-offset-[3px]">Terms</a>
        and
        <a href="#" class="text-neutral-900 underline underline-offset-[3px]">Privacy Policy</a>.
      </p>
    </form>

    <div class="flex items-center gap-3 my-6 text-text-subtle text-[0.75rem] uppercase tracking-[0.12em] before:flex-1 before:h-px before:bg-border after:flex-1 after:h-px after:bg-border">
      or
    </div>

    <div class="text-[0.9375rem] flex items-center justify-center gap-1 flex-wrap">
      <span class="text-text-muted">Already have an account?</span>
      <button
        type="button"
        class="font-medium text-neutral-900 underline underline-offset-[3px] hover:text-primary-700 px-1 rounded-sm focus-visible:outline-none focus-visible:shadow-glow"
        @click="store.switchMode()"
      >
        Sign in
      </button>
    </div>
  </div>
</template>
