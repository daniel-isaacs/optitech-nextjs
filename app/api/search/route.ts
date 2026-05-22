import { type NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/optimizely'
import type { SearchResult } from '@/lib/search'

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220)
}

// Lightweight scope query — isolated from the shared theme query so a
// new/unindexed ThemeManager field can never break theme loading.
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

// Build a blog query with optional Graph-level domain scoping.
// When withDomain=true, _metadata.url.base is compared against $domain so the
// CMS itself enforces site isolation — not a post-filter on relative paths.
// Adds fuzzy matching and synonym expansion for more forgiving keyword search.
function buildBlogQuery(withDomain: boolean, semantic: boolean): string {
  const domainVar    = withDomain ? ', $domain: String' : ''
  const domainFilter = withDomain ? '_metadata: { url: { base: { eq: $domain } } }' : ''
  const ranking      = semantic
    ? 'orderBy: { _ranking: SEMANTIC, _semanticWeight: 0.3 }'
    : 'orderBy: { _ranking: RELEVANCE }'
  return `
    query SearchBlogs($query: String!, $limit: Int!${domainVar}) {
      OT_BlogPage(
        ${ranking}
        where: {
          _fulltext: { match: $query, fuzzy: true, synonyms: ONE }
          ${domainFilter}
        }
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
}

function buildContentQuery(withDomain: boolean): string {
  const domainVar    = withDomain ? ', $domain: String' : ''
  const domainFilter = withDomain ? '_metadata: { url: { base: { eq: $domain } } }' : ''
  return `
    query SearchContent($query: String!, $limit: Int!${domainVar}) {
      _Content(
        where: {
          _fulltext: { match: $query, fuzzy: true, synonyms: ONE }
          ${domainFilter}
        }
        limit: $limit
      ) {
        items {
          _metadata { key url { default } types }
          name
        }
      }
    }
  `
}

function buildExperienceQuery(withDomain: boolean): string {
  const domainVar    = withDomain ? ', $domain: String' : ''
  const domainFilter = withDomain ? '_metadata: { url: { base: { eq: $domain } } }' : ''
  return `
    query SearchExperiences($query: String!, $limit: Int!${domainVar}) {
      _Experience(
        where: {
          _fulltext: { match: $query, fuzzy: true, synonyms: ONE }
          ${domainFilter}
        }
        limit: $limit
      ) {
        items {
          _metadata { key url { default } }
          name
        }
      }
    }
  `
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
  const q        = (searchParams.get('q') ?? '').trim()
  const type     = (searchParams.get('type') ?? 'all') as 'all' | 'Blog' | 'Page'
  const semantic = searchParams.get('semantic') === 'true'
  const limit    = 16

  if (q.length < 2) return NextResponse.json([])

  // ── Site scope resolution ────────────────────────────────────────────────
  // filterBase is built from ThemeManager's canonical frontEndDomain, NOT the
  // request host — so localhost dev still resolves the correct production domain
  // that was stored as url.base in Content Graph when content was published.
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
    // scope unavailable — proceed without domain restriction
  }

  // Domain filter is applied in the GraphQL WHERE clause (not post-filtered)
  // so Content Graph handles site isolation natively.
  const withDomain = !allSites && filterBase !== null
  const domainVars = withDomain ? { domain: filterBase } : {}

  const results: SearchResult[] = []

  // ── Blog results ─────────────────────────────────────────────────────────
  if (type !== 'Page') {
    try {
      const blogQuery = buildBlogQuery(withDomain, semantic)
      const data = await getClient().request(blogQuery, { query: q, limit, ...domainVars })
      const items: any[] = (data as any)?.OT_BlogPage?.items ?? []
      for (const item of items) {
        if (!item._metadata?.url?.default) continue
        const subHead  = (item.subHeadline as string | undefined) || undefined
        const bodyHtml = (item.body?.html  as string | undefined) || undefined
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

  // ── Generic page results ──────────────────────────────────────────────────
  if (type !== 'Blog') {
    try {
      const contentQuery = buildContentQuery(withDomain)
      const data = await getClient().request(contentQuery, { query: q, limit, ...domainVars })
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
      // _Content may not be present in this schema version
    }

    try {
      const expQuery = buildExperienceQuery(withDomain)
      const data = await getClient().request(expQuery, { query: q, limit, ...domainVars })
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
      // _Experience may not be queryable in this schema version
    }
  }

  return NextResponse.json(results)
}
