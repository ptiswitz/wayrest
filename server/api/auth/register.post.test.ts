import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSingle = vi.hoisted(() => vi.fn())
const mockMaybeSingle = vi.hoisted(() => vi.fn())
const mockReadBody = vi.hoisted(() => vi.fn())
const mockValidatePassword = vi.hoisted(() => vi.fn())

vi.hoisted(() => {
  ;(globalThis as Record<string, unknown>).defineEventHandler = (h: (e: unknown) => unknown) => h
  ;(globalThis as Record<string, unknown>).readBody = mockReadBody
  ;(globalThis as Record<string, unknown>).useRuntimeConfig = () => ({
    supabaseUrl: 'https://test.supabase.co',
    supabaseKey: 'test-key',
  })
  ;(globalThis as Record<string, unknown>).createError = (opts: Record<string, unknown>) =>
    Object.assign(new Error((opts.message as string) ?? 'Error'), opts)
  ;(globalThis as Record<string, unknown>).setResponseStatus = vi.fn()
  ;(globalThis as Record<string, unknown>).validatePassword = mockValidatePassword
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: mockMaybeSingle,
          single: mockSingle,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({ single: mockSingle })),
      })),
    })),
  })),
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(async () => '$2b$12$hashedpassword'),
    compare: vi.fn(async () => true),
  },
}))

import handler from './register.post'

const mockEvent = {}

const validBody = {
  fullName: 'Émilie Tremblay',
  email: 'emilie@example.ca',
  password: 'Secure1!',
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    mockReadBody.mockResolvedValue(validBody)
    mockValidatePassword.mockReturnValue({ valid: true, errors: [] })
    mockMaybeSingle.mockReset()
    mockSingle.mockReset()
  })

  it('returns 400 when required fields are missing', async () => {
    mockReadBody.mockResolvedValue({ email: 'test@test.com' })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('returns 409 when email is already taken', async () => {
    mockMaybeSingle.mockResolvedValue({ data: { id: 'existing-id' }, error: null })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 409 })
  })

  it('returns 201 and hashes the password on success', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null })
    mockSingle.mockResolvedValue({
      data: { id: 'new-uuid', email: 'emilie@example.ca', full_name: 'Émilie Tremblay' },
      error: null,
    })

    const result = await handler(mockEvent)

    expect(result.user.email).toBe('emilie@example.ca')
    expect(result.user.fullName).toBe('Émilie Tremblay')
    expect(result.user.id).toBeDefined()
  })
})
