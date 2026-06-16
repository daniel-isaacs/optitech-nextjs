export type SearchResult = {
  id: string
  title: string
  url: string
  type: 'Blog' | 'Page' | 'Event'
  topic?: string
  published?: string
  excerpt?: string
  imageUrl?: string
  /** Event-only fields — present when type === 'Event'. The date and location
   *  carry as much weight as the title for this content type, so the search UI
   *  surfaces them inline. */
  eventType?: string
  startDate?: string
  endDate?: string
  locationType?: string
  locationLabel?: string
  /** Opaque URL returned by Content Graph for click-through hit tracking. Fire
   *  a GET request to this URL when the user navigates to the result. */
  _track?: string | null
}
