import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useBookingStore } from '../../../stores/booking'
import type { BookingParams, PriceBreakdown } from '../../../types/booking'

const mockNavigateTo = vi.hoisted(() => vi.fn())
const mockUseRoute = vi.hoisted(() => vi.fn(() => ({ params: { slug: 'cabin-test-1' } })))
const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('#app', () => ({
  useRoute: mockUseRoute,
  navigateTo: mockNavigateTo,
}))

vi.stubGlobal('$fetch', mockFetch)

import PaymentPage from './payment.vue'

const globalStubs = {
  AppHeader: true,
  BookingStepper: true,
}

const baseParams: BookingParams = {
  listingId: 1,
  slug: 'cabin-test-1',
  startDate: new Date('2026-05-16'),
  endDate: new Date('2026-05-21'),
  guests: 2,
  pricePerNight: 184,
  cleaningFee: 45,
  serviceFeePct: 10,
  imageUrl: null,
  title: 'Lanternkeep Cabin',
  city: 'Mont-Tremblant',
  country: 'Canada',
}

const baseBreakdown: PriceBreakdown = {
  nights: 5,
  pricePerNight: 184,
  cleaningFee: 45,
  serviceFee: 92,
  total: 1057,
}

describe('payment.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockNavigateTo.mockReset()
    mockFetch.mockReset()
  })

  it('redirects to /stays/[slug] when store has no params', async () => {
    mount(PaymentPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))
    expect(mockNavigateTo).toHaveBeenCalledWith('/stays/cabin-test-1')
  })

  it('shows errors for all empty fields on submit', async () => {
    const store = useBookingStore()
    store.setParams(baseParams)
    store.setBreakdown(baseBreakdown)

    const wrapper = mount(PaymentPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[data-testid="error-full-name"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-email"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-card-number"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-expiry"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-cvv"]').exists()).toBe(true)
  })

  it('shows an error for an invalid card number', async () => {
    const store = useBookingStore()
    store.setParams(baseParams)
    store.setBreakdown(baseBreakdown)

    const wrapper = mount(PaymentPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))

    await wrapper.find('[data-testid="input-full-name"]').setValue('Émilie Tremblay')
    await wrapper.find('[data-testid="input-email"]').setValue('emilie@example.ca')
    await wrapper.find('[data-testid="input-card-number"]').setValue('4242424242424243')
    await wrapper.find('[data-testid="input-expiry"]').setValue('12 / 99')
    await wrapper.find('[data-testid="input-cvv"]').setValue('123')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[data-testid="error-card-number"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-card-number"]').text()).toContain('Invalid')
  })

  it('calls POST /api/bookings and navigates on valid form submission', async () => {
    const store = useBookingStore()
    store.setParams(baseParams)
    store.setBreakdown(baseBreakdown)

    mockFetch.mockResolvedValue({
      booking: {
        id: 1,
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
        reference: 'WR-00000001',
        createdAt: '2026-05-09T12:00:00Z',
      },
    })

    const wrapper = mount(PaymentPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))

    await wrapper.find('[data-testid="input-full-name"]').setValue('Émilie Tremblay')
    await wrapper.find('[data-testid="input-email"]').setValue('emilie@example.ca')
    await wrapper.find('[data-testid="input-card-number"]').setValue('4242 4242 4242 4242')
    await wrapper.find('[data-testid="input-expiry"]').setValue('12 / 99')
    await wrapper.find('[data-testid="input-cvv"]').setValue('123')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(mockFetch).toHaveBeenCalledWith('/api/bookings', expect.objectContaining({ method: 'POST' }))
    expect(mockNavigateTo).toHaveBeenCalledWith('/booking/cabin-test-1/confirmation')
  })
})
