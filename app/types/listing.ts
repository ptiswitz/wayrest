export interface Listing {
  id: number
  title: string
  city: string
  country: string
  pricePerNight: number
  imageUrl: string | null
}

export interface ListingCardProps {
  listing: Listing
}

export interface ListingsResponse {
  listings: Listing[]
}
