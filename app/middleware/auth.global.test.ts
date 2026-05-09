import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

const mockOpenSignIn = vi.fn()
const mockAuthStatus = ref<'authenticated' | 'unauthenticated' | 'loading'>('unauthenticated')

const mockAbortNavigation = vi.hoisted(() => vi.fn(() => 'abort'))

vi.hoisted(() => {
  ;(globalThis as Record<string, unknown>).defineNuxtRouteMiddleware = (fn: (to: unknown) => unknown) => fn
  ;(globalThis as Record<string, unknown>).abortNavigation = mockAbortNavigation
  ;(globalThis as Record<string, unknown>).useAuth = vi.fn(() => ({ status: mockAuthStatus }))
})

vi.mock('~/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({ openSignIn: mockOpenSignIn })),
}))

import middleware from './auth.global'

const fn = middleware as unknown as (to: { path: string; fullPath: string }) => unknown

describe('auth.global middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockOpenSignIn.mockReset()
    mockAbortNavigation.mockReset()
    mockAuthStatus.value = 'unauthenticated'
  })

  it('opens sign-in modal and aborts navigation for unauthenticated user on protected route', () => {
    fn({ path: '/booking/cabin/summary', fullPath: '/booking/cabin/summary' })

    expect(mockOpenSignIn).toHaveBeenCalledWith('/booking/cabin/summary')
    expect(mockAbortNavigation).toHaveBeenCalled()
  })

  it('allows navigation for authenticated user on protected route', () => {
    mockAuthStatus.value = 'authenticated'

    fn({ path: '/booking/cabin/summary', fullPath: '/booking/cabin/summary' })

    expect(mockOpenSignIn).not.toHaveBeenCalled()
    expect(mockAbortNavigation).not.toHaveBeenCalled()
  })

  it('allows navigation for unauthenticated user on public route', () => {
    fn({ path: '/', fullPath: '/' })

    expect(mockOpenSignIn).not.toHaveBeenCalled()
    expect(mockAbortNavigation).not.toHaveBeenCalled()
  })
})
