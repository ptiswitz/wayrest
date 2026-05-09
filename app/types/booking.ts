export interface BookingParams {
  listingId: number
  slug: string
  startDate: Date
  endDate: Date
  guests: number
  pricePerNight: number
  cleaningFee: number
  serviceFeePct: number
  imageUrl: string | null
  title: string
  city: string
  country: string
}

export interface PriceBreakdown {
  nights: number
  pricePerNight: number
  cleaningFee: number
  serviceFee: number
  total: number
}

export interface BookingFormData {
  fullName: string
  email: string
  cardNumber: string
  expiry: string
  cvv: string
}

export interface Booking {
  id: number
  listingId: number
  startDate: string
  endDate: string
  guests: number
  fullName: string
  email: string
  nights: number
  pricePerNight: number
  cleaningFee: number
  serviceFee: number
  total: number
  reference: string
  createdAt: string
}

export interface CreateBookingRequest {
  listingId: number
  startDate: string
  endDate: string
  guests: number
  fullName: string
  email: string
  nights: number
  pricePerNight: number
  cleaningFee: number
  serviceFee: number
  total: number
}

export interface CreateBookingResponse {
  booking: Booking
}
