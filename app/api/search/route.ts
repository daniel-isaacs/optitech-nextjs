import { type NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/optimizely'
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

// Lightweight query — only the two fields needed for search scope resolution.
// Kept separate from the heavy THEME_QUERY so a new/unindexed field on
// ThemeManager can never break theme loading.
const SCOPE_QUERY = `
  query GetSearchScope {
    OT_ThemeManager(limit: 20) {
      items {
        frontEndDomain
        searchScope
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

  // ── Site scope resolution ────────────────────────────────────────────────
  // Compare the request host against each ThemeManager's frontEndDomain to
  // find the matching site. Fall back to the first ThemeManager if none match
  // (handles localhost vs. production URL mismatch in development).
  //
  // filterBase is built from the ThemeManager's canonical domain, NOT the
  // request host — so dev on localhost:3000 still sees the correct site content
  // whose URLs were stored with the production domain.
  const host = req.nextUrl.host

  let allSites   = false
  let filterBase: string | null = null

  try {
    const scopeData  = await getClient().request(SCOPE_QUERY, {})
    const themeItems: any[] = (scopeData as any)?.OT_ThemeManager?.items ?? []
    const matched = themeItems.find((i: any) => i.frontEndDomain === host) ?? themeItems[0] ?? null
    if (matched) {
      allSites = matched.searchScope === 'allSites'
      const domain = (matched.frontEndDomain as string | undefined) ?? ''
      if (domain) {
        const proto = domain.startsWith('localhost') ? 'http' : 'https'
        filterBase = `${proto}://${domain}`
      }
    }
  } catch {
    // scope unavailable — fall through, show all results
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
        if (!types.includes('_Page')) continue
        if (types.includes('OT_BlogPage')) continue
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
  // Graph may store URLs as relative paths (/slug/) or absolute URLs.
  // Relative paths are always "this site" content — only filter absolute URLs.
  const finalResults = (!allSites && filterBase)
    ? results.filter(r => !r.url.startsWith('http') || r.url.startsWith(filterBase!))
    : results

  return NextResponse.json(finalResults)
}
