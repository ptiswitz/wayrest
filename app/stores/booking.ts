import { defineStore } from 'pinia'
import type { BookingParams, PriceBreakdown, BookingFormData, Booking } from '~/types/booking'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    params: null as BookingParams | null,
    breakdown: null as PriceBreakdown | null,
    form: null as BookingFormData | null,
    confirmedBooking: null as Booking | null,
  }),
  actions: {
    setParams(params: BookingParams) {
      this.params = params
    },
    setBreakdown(breakdown: PriceBreakdown) {
      this.breakdown = breakdown
    },
    setForm(form: BookingFormData) {
      this.form = form
    },
    setConfirmedBooking(booking: Booking) {
      this.confirmedBooking = booking
    },
    reset() {
      this.params = null
      this.breakdown = null
      this.form = null
      this.confirmedBooking = null
    },
  },
})
