import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ListingGrid from './ListingGrid.vue'
import type { Listing } from '../types/listing'

const mockUseFetch = vi.hoisted(() => vi.fn())

vi.mock('#app', () => ({
  useFetch: mockUseFetch,
}))

const listingBase = {
  slug: 'apt-1',
  description: null,
  guests: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  amenities: [],
  hostId: null,
}

const listings: Listing[] = [
  { id: 1, title: 'Apt A', city: 'Paris', country: 'France', pricePerNight: 100, imageUrl: null, ...listingBase, slug: 'apt-a-1' },
  { id: 2, title: 'Apt B', city: 'Lyon', country: 'France', pricePerNight: 80, imageUrl: null, ...listingBase, slug: 'apt-b-2' },
]

function stubFetch(options: {
  status: 'pending' | 'success' | 'error'
  listings?: Listing[]
  error?: Error | null
}) {
  mockUseFetch.mockReturnValue({
    data: ref(options.listings !== undefined ? { listings: options.listings } : null),
    status: ref(options.status),
    error: ref(options.error ?? null),
  })
}

describe('ListingGrid', () => {
  beforeEach(() => {
    mockUseFetch.mockReset()
  })

  it('loading: renders 8 skeleton cards while fetching', () => {
    stubFetch({ status: 'pending' })
    const wrapper = mount(ListingGrid, { global: { stubs: { ListingCard: true } } })
    expect(wrapper.findAll('[data-testid="skeleton-card"]')).toHaveLength(8)
  })

  it('happy path: renders ListingCard for each listing returned', () => {
    stubFetch({ status: 'success', listings })
    const wrapper = mount(ListingGrid, { global: { stubs: { ListingCard: true } } })
    expect(wrapper.findAllComponents({ name: 'ListingCard' })).toHaveLength(listings.length)
  })

  it('empty state: displays "No listings found." when array is empty', () => {
    stubFetch({ status: 'success', listings: [] })
    const wrapper = mount(ListingGrid, { global: { stubs: { ListingCard: true } } })
    expect(wrapper.find('[data-testid="empty-message"]').text()).toBe('No listings found.')
  })

  it('error state: displays error message when API call fails', () => {
    stubFetch({ status: 'error', error: new Error('Network error') })
    const wrapper = mount(ListingGrid, { global: { stubs: { ListingCard: true } } })
    expect(wrapper.find('[data-testid="error-message"]').text()).toBe(
      'An error occurred. Please try again later.',
    )
  })

  it('grid: applies @container class to the grid wrapper', () => {
    stubFetch({ status: 'success', listings })
    const wrapper = mount(ListingGrid, { global: { stubs: { ListingCard: true } } })
    expect(wrapper.find('[data-testid="listing-grid"]').classes()).toContain('@container')
  })
})
