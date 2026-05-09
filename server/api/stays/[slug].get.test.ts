import { describe, it, expect, vi, beforeEach } from 'vitest'

// Provide H3/Nuxt server globals before handler import
const mockGetRouterParam = vi.hoisted(() => {
  const fn = vi.fn(() => 'chalet-test-1')
  ;(globalThis as Record<string, unknown>).defineEventHandler = (h: (e: unknown) => unknown) => h
  ;(globalThis as Record<string, unknown>).getRouterParam = fn
  ;(globalThis as Record<string, unknown>).useRuntimeConfig = () => ({
    supabaseUrl: 'https://test.supabase.co',
    supabaseKey: 'test-key',
  })
  ;(globalThis as Record<string, unknown>).createError = (opts: Record<string, unknown>) =>
    Object.assign(new Error((opts.message as string) ?? 'Error'), opts)
  return fn
})

const mockSingle = vi.hoisted(() => vi.fn())

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ single: mockSingle })),
      })),
    })),
  })),
}))

import handler from './[slug].get'

const mockEvent = {}

const baseRow = {
  id: 1,
  title: 'Chalet test',
  city: 'Montreal',
  country: 'Canada',
  price_per_night: 200,
  image_url: 'https://example.com/img.jpg',
  slug: 'chalet-test-1',
  description: 'A lovely chalet.',
  guests: 6,
  bedrooms: 3,
  beds: 4,
  bathrooms: 2,
  amenities: ['wifi', 'parking'],
  host_id: 10,
  cleaning_fee: 45,
  service_fee_percent: 10,
  listing_images: [
    { id: 1, listing_id: 1, url: 'https://example.com/1.jpg', position: 0 },
    { id: 2, listing_id: 1, url: 'https://example.com/2.jpg', position: 1 },
  ],
  hosts: { id: 10, name: 'Marie Dupont', avatar_url: null },
}

describe('GET /api/stays/[slug]', () => {
  beforeEach(() => {
    mockGetRouterParam.mockReturnValue('chalet-test-1')
    mockSingle.mockReset()
  })

  it('returns 404 when slug has no numeric id', async () => {
    mockGetRouterParam.mockReturnValue('no-id-here')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('returns 404 when listing not found in Supabase', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'not found', code: 'PGRST116' } })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('returns ListingDetail with camelCase fields, sorted images, and host', async () => {
    mockSingle.mockResolvedValue({ data: baseRow, error: null })

    const result = await handler(mockEvent)

    expect(result.listing.title).toBe('Chalet test')
    expect(result.listing.pricePerNight).toBe(200)
    expect(result.listing.slug).toBe('chalet-test-1')
    expect(result.listing.images).toHaveLength(2)
    expect(result.listing.images[0].position).toBe(0)
    expect(result.listing.images[0].listingId).toBe(1)
    expect(result.listing.host).toMatchObject({ id: 10, name: 'Marie Dupont', avatarUrl: null })
  })
})
