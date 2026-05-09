import { createClient } from '@supabase/supabase-js'
import { slugify } from '../../../server/utils/slugify'
import type { ListingDetail, ListingDetailResponse } from '~/types/listing'

interface RawImage {
  id: number
  listing_id: number
  url: string
  position: number
}

interface RawHost {
  id: number
  name: string
  avatar_url: string | null
}

interface RawListing {
  id: number
  title: string
  city: string
  country: string
  price_per_night: number
  image_url: string | null
  slug: string | null
  description: string | null
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[] | null
  host_id: number | null
  listing_images: RawImage[]
  hosts: RawHost | null
}

export default defineEventHandler(async (event): Promise<ListingDetailResponse> => {
  const slug = getRouterParam(event, 'slug') ?? ''

  const match = slug.match(/-(\d+)$/)
  if (!match) throw createError({ statusCode: 404, message: 'Listing not found' })

  const id = parseInt(match[1], 10)
  const config = useRuntimeConfig(event)
  const supabase = createClient(config.supabaseUrl as string, config.supabaseKey as string)

  const { data, error } = await supabase
    .from('listings')
    .select(
      'id, title, city, country, price_per_night, image_url, slug, description, guests, bedrooms, beds, bathrooms, amenities, host_id, listing_images (id, listing_id, url, position), hosts (id, name, avatar_url)',
    )
    .eq('id', id)
    .single()

  if (error || !data) throw createError({ statusCode: 404, message: 'Listing not found' })

  const row = data as RawListing

  const listing: ListingDetail = {
    id: row.id,
    title: row.title,
    city: row.city,
    country: row.country,
    pricePerNight: row.price_per_night,
    imageUrl: row.image_url,
    slug: row.slug ?? slugify(row.title, row.id),
    description: row.description,
    guests: row.guests,
    bedrooms: row.bedrooms,
    beds: row.beds,
    bathrooms: row.bathrooms,
    amenities: row.amenities ?? [],
    hostId: row.host_id,
    images: (row.listing_images ?? [])
      .sort((a, b) => a.position - b.position)
      .map((img) => ({
        id: img.id,
        listingId: img.listing_id,
        url: img.url,
        position: img.position,
      })),
    host: row.hosts
      ? { id: row.hosts.id, name: row.hosts.name, avatarUrl: row.hosts.avatar_url }
      : null,
  }

  return { listing }
})
