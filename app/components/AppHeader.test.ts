import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'

const mockSignOut = vi.fn()
const mockAuthData = ref<{ user: { fullName: string; name: string; email: string } } | null>(null)
const mockAuthStatus = ref<'authenticated' | 'unauthenticated' | 'loading'>('unauthenticated')

vi.hoisted(() => {
  ;(globalThis as Record<string, unknown>).useAuth = vi.fn(() => ({
    data: mockAuthData,
    status: mockAuthStatus,
    signOut: mockSignOut,
  }))
})

vi.mock('#app', () => ({
  navigateTo: vi.fn(),
  useRoute: vi.fn(() => ({ fullPath: '/' })),
}))

import AppHeader from './AppHeader.vue'

describe('AppHeader', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockAuthStatus.value = 'unauthenticated'
    mockAuthData.value = null
    mockSignOut.mockReset()
  })

  it('shows Sign in button when unauthenticated', () => {
    const wrapper = mount(AppHeader, {
      global: { stubs: { Transition: true } },
    })

    expect(wrapper.find('button[class*="bg-primary"]').text()).toContain('Sign in')
  })

  it('shows avatar button when authenticated', async () => {
    mockAuthStatus.value = 'authenticated'
    mockAuthData.value = {
      user: { fullName: 'Émilie Tremblay', name: 'Émilie Tremblay', email: 'emilie@example.ca' },
    }

    const wrapper = mount(AppHeader, {
      global: { stubs: { Transition: true } },
    })

    expect(wrapper.find('[aria-haspopup="menu"]').exists()).toBe(true)
    expect(wrapper.find('button[class*="bg-primary"]').exists()).toBe(false)
  })
})
