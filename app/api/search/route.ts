import { type NextRequest, NextResponse } from 'next/server'
import { getClient, getSiteSettings } from '@/lib/optimizely'
import type { SearchResult } from '@/lib/search'

// Searches all indexed string properties — headline, subHeadline, body, topic, etc.
const BLOG_QUERY = `
  query SearchBlogs($query: String!, $limit: Int!) {
    OT_BlogPage(
      where: { _fulltext: { match: $query } }
      limit: $limit
    ) {
      items {
        _metadata { key published url { default } }
        headline
        subHeadline
        topic
        featuredImage { url { default } }
        body { html }
      }
    }
  }
`

// Generic pages — filtered to _Page types only (not blogs, not components)
const CONTENT_QUERY = `
  query SearchContent($query: String!, $limit: Int!) {
    _Content(
      where: { _fulltext: { match: $query } }
      limit: $limit
    ) {
      items {
        _metadata { key url { default } types }
        name
      }
    }
  }
`

// Experience pages (BlankExperience and any future _experience types)
const EXPERIENCE_QUERY = `
  query SearchExperiences($query: String!, $limit: Int!) {
    _Experience(
      where: { _fulltext: { match: $query } }
      limit: $limit
    ) {
      items {
        _metadata { key url { default } }
        name
      }
    }
  }
`

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220)
}

const SETTINGS_TYPES = new Set([
  'OT_SiteSettings',
  'OT_ThemeManager',
  'OT_NavigationItem',
  'OT_NavigationSubItem',
  'OT_FooterColumn',
  'OT_FooterLink',
])

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q     = (searchParams.get('q') ?? '').trim()
  const type  = (searchParams.get('type') ?? 'all') as 'all' | 'Blog' | 'Page'
  const limit = 12

  if (q.length < 2) return NextResponse.json([])

  // ── Site scope filtering ─────────────────────────────────────────────────
  // Default is "this site only". Only switch to all-sites when ThemeManager
  // has searchScope === 'allSites'. Uses the request host to identify the site.
  const host     = req.nextUrl.host  // e.g. "localhost:3000" or "mysite.vercel.app"
  const proto    = req.nextUrl.protocol.replace(':', '')  // "http" or "https"
  const baseUrl  = host ? `${proto}://${host}` : null

  let allSites = false
  if (baseUrl) {
    try {
      const settings = await getSiteSettings(host)
      allSites = settings?.searchScope === 'allSites'
    } catch {
      // fall through — default to this-site filtering
    }
  }

  const results: SearchResult[] = []

  // ── Blog results (highest content priority) ──────────────────────────────
  if (type !== 'Page') {
    try {
      const data = await getClient().request(BLOG_QUERY, { query: q, limit })
      const items: any[] = (data as any)?.OT_BlogPage?.items ?? []
      for (const item of items) {
        if (!item._metadata?.url?.default) continue
        const subHead  = (item.subHeadline as string | undefined) || undefined
        const bodyHtml = (item.body?.html as string | undefined) || undefined
        const excerpt  = subHead ?? (bodyHtml ? stripHtml(bodyHtml) : undefined)
        results.push({
          id:        item._metadata.key,
          title:     item.headline ?? 'Untitled',
          url:       item._metadata.url.default,
          type:      'Blog',
          topic:     item.topic || undefined,
          published: item._metadata.published || undefined,
          excerpt,
          imageUrl:  item.featuredImage?.url?.default || undefined,
        })
      }
    } catch (err) {
      console.error('[search] blog query failed:', err)
    }
  }

  // ── Generic page results ─────────────────────────────────────────────────
  if (type !== 'Blog') {
    try {
      const data = await getClient().request(CONTENT_QUERY, { query: q, limit })
      const items: any[] = (data as any)?._Content?.items ?? []
      for (const item of items) {
        const types: string[] = item._metadata?.types ?? []
        // Only navigable page types
        if (!types.includes('_Page')) continue
        // Skip blog pages already captured above
        if (types.includes('OT_BlogPage')) continue
        // Skip settings and nav config types
        if (types.some(t => SETTINGS_TYPES.has(t))) continue
        if (!item._metadata?.url?.default) continue
        results.push({
          id:    item._metadata.key,
          title: item.name ?? 'Untitled',
          url:   item._metadata.url.default,
          type:  'Page',
        })
      }
    } catch {
      // _Content type may not be present in this schema version — skip
    }

    // Experience pages (BlankExperience, etc.) — best-effort
    try {
      const data = await getClient().request(EXPERIENCE_QUERY, { query: q, limit })
      const items: any[] = (data as any)?._Experience?.items ?? []
      for (const item of items) {
        if (!item._metadata?.url?.default) continue
        results.push({
          id:    item._metadata.key,
          title: item.name ?? 'Untitled',
          url:   item._metadata.url.default,
          type:  'Page',
        })
      }
    } catch {
      // _Experience type may not be queryable in this schema version — skip
    }
  }

  // ── Scope filtering ──────────────────────────────────────────────────────
  // When allSites is false (default), only return results whose URL belongs
  // to this site. Compares against the full protocol+host base URL.
  const finalResults = (!allSites && baseUrl)
    ? results.filter(r => r.url.startsWith(baseUrl))
    : results

  return NextResponse.json(finalResults)
}
