import { createClient } from '@supabase/supabase-js'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const config = useRuntimeConfig(event)
  const supabase = createClient(config.supabaseUrl as string, config.supabaseKey as string)

  const { data, error } = await supabase
    .from('bookings')
    .select('id, listing_id, start_date, end_date, guests, total, reference, created_at, listings(title, image_url)')
    .eq('user_id', session.user.id)
    .order('start_date', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch bookings' })
  }

  return { bookings: data ?? [] }
})
