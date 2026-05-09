export interface Listing {
  id: number
  title: string
  city: string
  country: string
  pricePerNight: number
  imageUrl: string | null
  slug: string
  description: string | null
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[]
  hostId: number | null
}

export interface ListingImage {
  id: number
  listingId: number
  url: string
  position: number
}

export interface Host {
  id: number
  name: string
  avatarUrl: string | null
}

export interface ListingDetail extends Listing {
  images: ListingImage[]
  host: Host | null
}

export interface ListingCardProps {
  listing: Listing
}

export interface ListingsResponse {
  listings: Listing[]
}

export interface ListingDetailResponse {
  listing: ListingDetail
}
