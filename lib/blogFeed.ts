import { cache } from 'react'
import { getClient } from '@/lib/optimizely'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type BlogFeedPost = {
  _metadata: {
    key:       string
    published: string
    url:       { default: string | null; hierarchical?: string | null }
  }
  headline:       string
  topic?:         string
  featuredImage?: { url: { default: string | null } }
  authorRef?:     { name: string } | null
  readTime?:      string
}

export type BlogFeedResult = {
  posts:  BlogFeedPost[]
  /** All unique topic slugs present in the filtered result set. */
  topics: string[]
}

// ─── GraphQL ───────────────────────────────────────────────────────────────────

// Fetch all published blog pages for the requested locale in a single query.
// We over-fetch (100 items) so client-side pagination is instant.
// Content Graph may return multiple locale variants for the same content key;
// we deduplicate below. A parallel OT_Author query avoids a per-post round-trip
// (ContentReference.item resolves as "Data" for _component types in Graph).
const BLOG_FEED_QUERY = `
  query GetBlogFeedPosts($locale: String!) {
    OT_BlogPage(
      limit: 100,
      where: { _metadata: { locale: { eq: $locale } } },
      orderBy: { _metadata: { published: DESC } }
    ) {
      items {
        _metadata {
          key
          published
          url { default hierarchical }
        }
        headline
        topic
        featuredImage { url { default } }
        authorRef { key }
        readTime
      }
    }
    OT_Author(limit: 30) {
      items {
        _metadata { key }
        name
      }
    }
  }
`

// ─── Data access ───────────────────────────────────────────────────────────────

/**
 * Fetches all blog posts for `locale`, optionally scoped to a `articleRootPath`
 * prefix. The result is React-cached so multiple Blog Feed blocks on the same
 * page share a single Graph round-trip.
 *
 * @param locale          BCP-47 locale string (e.g. "en", "fr")
 * @param articleRootPath Hierarchical URL of the article root page (e.g.
 *                        "/blog/"). Posts whose hierarchical URL begins with
 *                        this prefix are included. Pass null to include all.
 */
export const getBlogFeedPosts = cache(async function getBlogFeedPosts(
  locale: string,
  articleRootPath: string | null,
): Promise<BlogFeedResult> {
  try {
    const data = await getClient().request(BLOG_FEED_QUERY, { locale })

    const items: any[]      = (data as any)?.OT_BlogPage?.items ?? []
    const authorItems: any[] = (data as any)?.OT_Author?.items  ?? []

    // Build key → name map from parallel author query
    const authorMap = new Map<string, string>()
    for (const a of authorItems) {
      const ak = a._metadata?.key as string | undefined
      if (ak && a.name) authorMap.set(ak, String(a.name))
    }

    // Deduplicate by content key — Graph returns one row per locale variant;
    // all variants share the same _metadata.key, so we keep only the first
    // occurrence (latest published, guaranteed by orderBy DESC).
    const seen = new Set<string>()
    let posts = items.filter(p => {
      const k = p._metadata?.key as string | undefined
      if (!k || seen.has(k)) return false
      seen.add(k)
      return true
    })

    // Scope to article root when provided.
    // The hierarchical URL looks like "/blog/my-post/" — we filter to items
    // whose path starts with the root's hierarchical URL (normalised to always
    // end with "/").
    if (articleRootPath) {
      const prefix = articleRootPath.replace(/\/?$/, '/')
      posts = posts.filter(p => {
        const h = p._metadata?.url?.hierarchical
        return typeof h === 'string' && h.startsWith(prefix)
      })
    }

    // Collect unique topics in the order they first appear (already sorted DESC
    // by publish date, so this gives "most recently active topic first").
    const topicSet = new Set<string>()
    for (const p of posts) {
      if (p.topic) topicSet.add(String(p.topic))
    }

    // Resolve author names and shape into BlogFeedPost
    const resolved: BlogFeedPost[] = posts.map(p => {
      const authorKey  = p.authorRef?.key as string | undefined
      const authorName = authorKey ? authorMap.get(authorKey) : undefined
      return {
        _metadata: {
          key:       p._metadata.key,
          published: p._metadata.published,
          url: {
            default:      p._metadata?.url?.default      ?? null,
            hierarchical: p._metadata?.url?.hierarchical ?? null,
          },
        },
        headline:      p.headline      ?? '',
        topic:         p.topic         ?? undefined,
        featuredImage: p.featuredImage ?? undefined,
        authorRef:     authorName ? { name: authorName } : null,
        readTime:      p.readTime      ?? undefined,
      }
    })

    return {
      posts:  resolved,
      topics: [...topicSet],
    }
  } catch {
    return { posts: [], topics: [] }
  }
})
