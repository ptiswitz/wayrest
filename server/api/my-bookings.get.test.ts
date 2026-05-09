import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.hoisted(() => vi.fn())
const mockOrder = vi.hoisted(() => vi.fn())

vi.hoisted(() => {
  ;(globalThis as Record<string, unknown>).defineEventHandler = (h: (e: unknown) => unknown) => h
  ;(globalThis as Record<string, unknown>).useRuntimeConfig = () => ({
    supabaseUrl: 'https://test.supabase.co',
    supabaseKey: 'test-key',
  })
  ;(globalThis as Record<string, unknown>).createError = (opts: Record<string, unknown>) =>
    Object.assign(new Error((opts.message as string) ?? 'Error'), opts)
})

vi.mock('#auth', () => ({
  getServerSession: mockGetServerSession,
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: mockOrder,
        })),
      })),
    })),
  })),
}))

import handler from './my-bookings.get'

const mockEvent = {}

const mockBookings = [
  {
    id: 42,
    listing_id: 1,
    start_date: '2026-06-10',
    end_date: '2026-06-15',
    guests: 2,
    total: 1057,
    reference: 'WR-00000042',
    created_at: '2026-05-09T12:00:00Z',
    listings: { title: 'Lanternkeep Cabin', image_url: 'https://example.com/img.jpg' },
  },
]

describe('GET /api/my-bookings', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockOrder.mockReset()
  })

  it('returns 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns bookings for authenticated user', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-123' } })
    mockOrder.mockResolvedValue({ data: mockBookings, error: null })

    const result = await handler(mockEvent)

    expect(result.bookings).toHaveLength(1)
    expect(result.bookings[0].reference).toBe('WR-00000042')
  })
})
