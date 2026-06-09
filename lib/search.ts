export type SearchResult = {
  id: string
  title: string
  url: string
  type: 'Blog' | 'Page'
  topic?: string
  published?: string
  excerpt?: string
  imageUrl?: string
  /** Opaque URL returned by Content Graph for click-through hit tracking. Fire
   *  a GET request to this URL when the user navigates to the result. */
  _track?: string | null
}
