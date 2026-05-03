import { createClient } from '@supabase/supabase-js'
import type { ListingsResponse, Listing } from '~/types/listing'

export default defineEventHandler(async (event) => {
  // SPEC-GAP: server routes cannot import from app/composables → Supabase initialized directly
  const config = useRuntimeConfig(event)
  const supabase = createClient(
    config.supabaseUrl as string,
    config.supabaseKey as string,
  )

  const { data, error } = await supabase
    .from('listings')
    .select('id, title, city, country, price_per_night, image_url')

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  const listings: Listing[] = (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as number,
    title: row.title as string,
    city: row.city as string,
    country: row.country as string,
    pricePerNight: row.price_per_night as number,
    imageUrl: row.image_url as string | null,
  }))

  const response: ListingsResponse = { listings }
  return response
})
