import { defineStore } from 'pinia'
import type { AuthModalState } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): { modal: AuthModalState } => ({
    modal: {
      isOpen: false,
      mode: 'signin',
      redirectTo: null,
    },
  }),
  actions: {
    openSignIn(redirectTo?: string) {
      this.modal = { isOpen: true, mode: 'signin', redirectTo: redirectTo ?? null }
    },
    openRegister() {
      this.modal = { isOpen: true, mode: 'register', redirectTo: null }
    },
    closeModal() {
      this.modal = { isOpen: false, mode: 'signin', redirectTo: null }
    },
    switchMode() {
      this.modal.mode = this.modal.mode === 'signin' ? 'register' : 'signin'
    },
  },
})
