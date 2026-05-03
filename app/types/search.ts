export interface SearchParams {
  destination: string
  startDate: Date
  endDate: Date
  guests: number
}

export interface SearchBarEmits {
  (e: 'search', params: SearchParams): void
}
