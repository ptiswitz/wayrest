<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const store = useAuthStore()

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) store.closeModal()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && store.modal.isOpen) store.closeModal()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="store.modal.isOpen"
        class="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4"
        style="background: rgba(24, 20, 15, 0.55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)"
        role="dialog"
        aria-modal="true"
        @click="handleOverlayClick"
      >
        <Transition name="modal-card" appear>
          <div
            v-if="store.modal.isOpen"
            class="bg-surface rounded-xl shadow-xl w-full max-w-[460px] overflow-hidden my-auto"
          >
            <div class="relative flex items-center justify-center border-b border-border px-6 py-5">
              <p class="font-display font-medium text-base tracking-tight">
                {{ store.modal.mode === 'signin' ? 'Sign in or create account' : 'Sign up' }}
              </p>
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full grid place-items-center text-text hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:shadow-glow"
                aria-label="Close"
                @click="store.closeModal()"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="px-6 pt-8 pb-6">
              <SignInForm v-if="store.modal.mode === 'signin'" />
              <RegisterForm v-else />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 320ms cubic-bezier(0.2, 0.7, 0.2, 1);
}
.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

.modal-card-enter-active,
.modal-card-leave-active {
  transition:
    opacity 320ms cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 320ms cubic-bezier(0.2, 0.7, 0.2, 1);
}
.modal-card-enter-from,
.modal-card-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
