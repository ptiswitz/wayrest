import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import StayPage from './[slug].vue'
import type { ListingDetail } from '~/types/listing'

const mockUseFetch = vi.hoisted(() => vi.fn())
const mockUseRoute = vi.hoisted(() => vi.fn(() => ({ params: { slug: 'chalet-test-1' } })))

vi.mock('#app', () => ({
  useFetch: mockUseFetch,
  useRoute: mockUseRoute,
}))

const listing: ListingDetail = {
  id: 1,
  title: 'Chalet rustique',
  city: 'Mont-Tremblant',
  country: 'Canada',
  pricePerNight: 200,
  imageUrl: 'https://example.com/main.jpg',
  slug: 'chalet-rustique-1',
  description: 'A lovely chalet in the mountains.',
  guests: 6,
  bedrooms: 3,
  beds: 4,
  bathrooms: 2,
  amenities: ['wifi', 'parking'],
  hostId: 10,
  images: [
    { id: 1, listingId: 1, url: 'https://example.com/1.jpg', position: 0 },
    { id: 2, listingId: 1, url: 'https://example.com/2.jpg', position: 1 },
    { id: 3, listingId: 1, url: 'https://example.com/3.jpg', position: 2 },
  ],
  host: { id: 10, name: 'Marie Dupont', avatarUrl: null },
}

function stubFetch(options: { listing?: ListingDetail } = {}) {
  mockUseFetch.mockReturnValue({
    data: ref(options.listing !== undefined ? { listing: options.listing } : null),
  })
}

const globalStubs = {
  AppHeader: true,
  VueDatePicker: true,
  NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
}

describe('[slug].vue', () => {
  beforeEach(() => {
    mockUseFetch.mockReset()
  })

  it('page: renders listing title and location', async () => {
    stubFetch({ listing })
    const wrapper = mount(StayPage, { global: { stubs: globalStubs } })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Chalet rustique')
    expect(wrapper.text()).toContain('Mont-Tremblant')
  })

  it('page: renders photo gallery with first image active', async () => {
    stubFetch({ listing })
    const wrapper = mount(StayPage, { global: { stubs: globalStubs } })
    await wrapper.vm.$nextTick()

    const hero = wrapper.find('[data-testid="hero-image"]')
    expect(hero.exists()).toBe(true)
    expect(hero.attributes('src')).toBe(listing.images[0].url)
  })

  it('gallery: clicking thumbnail updates active image', async () => {
    stubFetch({ listing })
    const wrapper = mount(StayPage, { global: { stubs: globalStubs } })
    await wrapper.vm.$nextTick()

    const thumbnails = wrapper.findAll('[data-testid="thumbnail"]')
    await thumbnails[1].trigger('click')

    expect(wrapper.find('[data-testid="hero-image"]').attributes('src')).toBe(listing.images[1].url)
  })

  it('gallery: next arrow advances image, prev arrow goes back', async () => {
    stubFetch({ listing })
    const wrapper = mount(StayPage, { global: { stubs: globalStubs } })
    await wrapper.vm.$nextTick()

    await wrapper.find('[data-testid="next-arrow"]').trigger('click')
    expect(wrapper.find('[data-testid="hero-image"]').attributes('src')).toBe(listing.images[1].url)

    await wrapper.find('[data-testid="prev-arrow"]').trigger('click')
    expect(wrapper.find('[data-testid="hero-image"]').attributes('src')).toBe(listing.images[0].url)
  })

  it('booking card: total price hidden when no dates', async () => {
    stubFetch({ listing })
    const wrapper = mount(StayPage, { global: { stubs: globalStubs } })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="total-price"]').exists()).toBe(false)
  })

  it('booking card: total price shown when dates selected', async () => {
    stubFetch({ listing })
    const wrapper = mount(StayPage, { global: { stubs: globalStubs } })
    await wrapper.vm.$nextTick()

    // 3 nights: June 1–4, pricePerNight = 200
    ;(wrapper.vm as unknown as { dateRange: Date[] | null }).dateRange = [
      new Date('2026-06-01'),
      new Date('2026-06-04'),
    ]
    await wrapper.vm.$nextTick()

    const totalEl = wrapper.find('[data-testid="total-price"]')
    expect(totalEl.exists()).toBe(true)
    expect(totalEl.text()).toContain('3 nights')
    expect(totalEl.text()).toContain('600 $')
  })
})
