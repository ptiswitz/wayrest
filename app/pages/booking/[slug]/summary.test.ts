import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useBookingStore } from '../../../stores/booking'
import type { BookingParams } from '../../../types/booking'

const mockNavigateTo = vi.hoisted(() => vi.fn())
const mockUseRoute = vi.hoisted(() => vi.fn(() => ({ params: { slug: 'cabin-test-1' } })))

vi.mock('#app', () => ({
  useRoute: mockUseRoute,
  navigateTo: mockNavigateTo,
}))

import SummaryPage from './summary.vue'

const globalStubs = {
  AppHeader: true,
  BookingStepper: true,
}

const baseParams: BookingParams = {
  listingId: 1,
  slug: 'cabin-test-1',
  startDate: new Date('2026-05-16T00:00:00'),
  endDate: new Date('2026-05-21T00:00:00'),
  guests: 2,
  pricePerNight: 184,
  cleaningFee: 45,
  serviceFeePct: 10,
  imageUrl: 'https://example.com/img.jpg',
  title: 'Lanternkeep Cabin',
  city: 'Mont-Tremblant',
  country: 'Canada',
}

describe('summary.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockNavigateTo.mockReset()
  })

  it('redirects to /stays/[slug] when store has no params', async () => {
    mount(SummaryPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))
    expect(mockNavigateTo).toHaveBeenCalledWith('/stays/cabin-test-1')
  })

  it('displays correct price breakdown (5 nights × 184 $)', async () => {
    const store = useBookingStore()
    store.setParams(baseParams)

    const wrapper = mount(SummaryPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))

    // 5 nights × 184 = 920, serviceFee = round(920 × 10 / 100) = 92, total = 920 + 45 + 92 = 1057
    expect(wrapper.find('[data-testid="line-nights"]').text()).toContain('920')
    expect(wrapper.find('[data-testid="line-cleaning"]').text()).toContain('45')
    expect(wrapper.find('[data-testid="line-service"]').text()).toContain('92')
    expect(wrapper.find('[data-testid="line-total"]').text()).toContain('1')
    expect(wrapper.find('[data-testid="line-total"]').text()).toContain('057')
  })

  it('navigates to payment on "Confirm reservation" click', async () => {
    const store = useBookingStore()
    store.setParams(baseParams)

    const wrapper = mount(SummaryPage, { global: { stubs: globalStubs } })
    await new Promise((r) => setTimeout(r, 0))

    await wrapper.find('[data-testid="confirm-btn"]').trigger('click')
    expect(mockNavigateTo).toHaveBeenCalledWith('/booking/cabin-test-1/payment')
  })
})
