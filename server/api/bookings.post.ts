import { createClient } from '@supabase/supabase-js'
import { getServerSession } from '#auth'
import type { CreateBookingRequest, CreateBookingResponse, Booking } from '~/types/booking'

const REQUIRED_FIELDS = [
  'listingId', 'startDate', 'endDate', 'guests',
  'fullName', 'email', 'nights', 'pricePerNight',
  'cleaningFee', 'serviceFee', 'total',
] as const

export default defineEventHandler(async (event): Promise<CreateBookingResponse> => {
  const session = await getServerSession(event)
  const body = await readBody<CreateBookingRequest>(event)

  for (const field of REQUIRED_FIELDS) {
    const value = body?.[field]
    if (value === undefined || value === null || value === '') {
      throw createError({ statusCode: 400, message: `Missing required field: ${field}` })
    }
  }

  const config = useRuntimeConfig(event)
  const supabase = createClient(config.supabaseUrl as string, config.supabaseKey as string)

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: session?.user?.id ?? null,
      listing_id: body.listingId,
      start_date: body.startDate,
      end_date: body.endDate,
      guests: body.guests,
      full_name: body.fullName,
      email: body.email,
      nights: body.nights,
      price_per_night: body.pricePerNight,
      cleaning_fee: body.cleaningFee,
      service_fee: body.serviceFee,
      total: body.total,
    })
    .select('id, listing_id, start_date, end_date, guests, full_name, email, nights, price_per_night, cleaning_fee, service_fee, total, reference, created_at')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 500, message: 'Failed to create booking' })
  }

  const booking: Booking = {
    id: data.id,
    listingId: data.listing_id,
    startDate: data.start_date,
    endDate: data.end_date,
    guests: data.guests,
    fullName: data.full_name,
    email: data.email,
    nights: data.nights,
    pricePerNight: data.price_per_night,
    cleaningFee: data.cleaning_fee,
    serviceFee: data.service_fee,
    total: data.total,
    reference: data.reference,
    createdAt: data.created_at,
  }

  return { booking }
})
