import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

vi.hoisted(() => {
  ;(globalThis as Record<string, unknown>).useAuth = vi.fn(() => ({
    data: { value: null },
    status: { value: 'unauthenticated' },
    signIn: vi.fn(),
    signOut: vi.fn(),
  }))
})

vi.mock('#app', () => ({
  navigateTo: vi.fn(),
  useRoute: vi.fn(() => ({ fullPath: '/' })),
}))

import AuthModal from './AuthModal.vue'

const globalStubs = {
  Teleport: { template: '<div><slot /></div>' },
  SignInForm: { template: '<div data-testid="sign-in-form"></div>' },
  RegisterForm: { template: '<div data-testid="register-form"></div>' },
}

describe('AuthModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders SignInForm by default when open', async () => {
    const wrapper = mount(AuthModal, { global: { stubs: globalStubs } })
    const store = useAuthStore()
    store.openSignIn()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="sign-in-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="register-form"]').exists()).toBe(false)
  })

  it('switches to RegisterForm when mode is register', async () => {
    const wrapper = mount(AuthModal, { global: { stubs: globalStubs } })
    const store = useAuthStore()
    store.openSignIn()
    await wrapper.vm.$nextTick()

    store.switchMode()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="register-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="sign-in-form"]').exists()).toBe(false)
  })
})
