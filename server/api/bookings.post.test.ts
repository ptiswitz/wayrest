import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSingle = vi.hoisted(() => vi.fn())

vi.hoisted(() => {
  ;(globalThis as Record<string, unknown>).defineEventHandler = (h: (e: unknown) => unknown) => h
  ;(globalThis as Record<string, unknown>).readBody = vi.fn()
  ;(globalThis as Record<string, unknown>).useRuntimeConfig = () => ({
    supabaseUrl: 'https://test.supabase.co',
    supabaseKey: 'test-key',
  })
  ;(globalThis as Record<string, unknown>).createError = (opts: Record<string, unknown>) =>
    Object.assign(new Error((opts.message as string) ?? 'Error'), opts)
})

const mockReadBody = vi.hoisted(() => vi.fn())
;(globalThis as Record<string, unknown>).readBody = mockReadBody

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({ single: mockSingle })),
      })),
    })),
  })),
}))

import handler from './bookings.post'

const mockEvent = {}

const validBody = {
  listingId: 1,
  startDate: '2026-05-16',
  endDate: '2026-05-21',
  guests: 2,
  fullName: 'Émilie Tremblay',
  email: 'emilie@example.ca',
  nights: 5,
  pricePerNight: 184,
  cleaningFee: 45,
  serviceFee: 92,
  total: 1057,
}

const dbRow = {
  id: 42,
  listing_id: 1,
  start_date: '2026-05-16',
  end_date: '2026-05-21',
  guests: 2,
  full_name: 'Émilie Tremblay',
  email: 'emilie@example.ca',
  nights: 5,
  price_per_night: 184,
  cleaning_fee: 45,
  service_fee: 92,
  total: 1057,
  reference: 'WR-00000042',
  created_at: '2026-05-09T12:00:00Z',
}

describe('POST /api/bookings', () => {
  beforeEach(() => {
    mockReadBody.mockResolvedValue(validBody)
    mockSingle.mockReset()
  })

  it('returns 400 when a required field is missing', async () => {
    mockReadBody.mockResolvedValue({ ...validBody, fullName: '' })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('returns 400 when listingId is missing', async () => {
    const { listingId: _omit, ...rest } = validBody
    mockReadBody.mockResolvedValue(rest)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('creates a booking and returns it with a reference', async () => {
    mockSingle.mockResolvedValue({ data: dbRow, error: null })

    const result = await handler(mockEvent)

    expect(result.booking.id).toBe(42)
    expect(result.booking.reference).toBe('WR-00000042')
    expect(result.booking.fullName).toBe('Émilie Tremblay')
    expect(result.booking.total).toBe(1057)
    expect(result.booking.listingId).toBe(1)
  })

  it('returns 500 when Supabase insert fails', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'db error' } })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 500 })
  })
})
