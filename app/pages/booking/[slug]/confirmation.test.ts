import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useBookingStore } from '../../../stores/booking'
import type { Booking, BookingParams } from '../../../types/booking'

const mockNavigateTo = vi.hoisted(() => vi.fn())
const mockUseRoute = vi.hoisted(() => vi.fn(() => ({ params: { slug: 'cabin-test-1' } })))

vi.mock('#app', () => ({
  useRoute: mockUseRoute,
  navigateTo: mockNavigateTo,
}))

import ConfirmationPage from './confirmation.vue'

const globalStubs = {
  AppHeader: true,
  BookingStepper: true,
}

const confirmedBooking: Booking = {
  id: 42,
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
  reference: 'WR-00000042',
  createdAt: '2026-05-09T12:00:00Z',
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

describe('confirmation.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockNavigateTo.mockReset()
  })

  it('redirects to / when no confirmed booking in store', async () => {
    mount(ConfirmationPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))
    expect(mockNavigateTo).toHaveBeenCalledWith('/')
  })

  it('displays the booking reference', async () => {
    const store = useBookingStore()
    store.setParams(baseParams)
    store.setConfirmedBooking(confirmedBooking)

    const wrapper = mount(ConfirmationPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))

    expect(wrapper.find('[data-testid="reference-code"]').text()).toBe('WR-00000042')
  })

  it('displays the booking summary details', async () => {
    const store = useBookingStore()
    store.setParams(baseParams)
    store.setConfirmedBooking(confirmedBooking)

    const wrapper = mount(ConfirmationPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))

    expect(wrapper.text()).toContain('Lanternkeep Cabin')
    expect(wrapper.text()).toContain('1,057 $')
  })
})
