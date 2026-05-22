import { cache } from 'react'
import { getClient } from '@/lib/optimizely'

export type BlogPageContent = {
  _metadata: {
    key: string
    published: string
    url: { default: string | null }
  }
  headline: string
  subHeadline?: string
  topic?: string
  featuredImage?: { url: { default: string | null } }
  featuredVideo?: { url: { default: string | null } }
  body?: { html: string }
  author?: string
  authorRole?: string
  authorPhoto?: { url: { default: string | null } }
  readTime?: string
}

export type BlogPostSummary = {
  _metadata: { key: string; published: string; url: { default: string | null } }
  headline: string
  topic?: string
  featuredImage?: { url: { default: string | null } }
  author?: string
  readTime?: string
}

const BLOG_PAGE_QUERY = `
  query GetBlogPage($key: String!) {
    OT_BlogPage(where: { _metadata: { key: { eq: $key } } }, limit: 1) {
      items {
        _metadata { key published url { default } }
        headline
        subHeadline
        topic
        featuredImage { url { default } }
        featuredVideo { url { default } }
        body { html }
        author
        authorRole
        authorPhoto { url { default } }
        readTime
      }
    }
  }
`

const LATEST_POSTS_QUERY = `
  query GetLatestBlogPosts {
    OT_BlogPage(limit: 4) {
      items {
        _metadata { key published url { default } }
        headline
        topic
        featuredImage { url { default } }
        author
        readTime
      }
    }
  }
`

export async function getBlogPage(key: string): Promise<BlogPageContent | null> {
  try {
    const data = await getClient().request(BLOG_PAGE_QUERY, { key })
    return (data as any)?.OT_BlogPage?.items?.[0] ?? null
  } catch {
    return null
  }
}

export const getLatestBlogPosts = cache(async function getLatestBlogPosts(
  excludeKey?: string,
): Promise<BlogPostSummary[]> {
  try {
    const data = await getClient().request(LATEST_POSTS_QUERY, {})
    const items: BlogPostSummary[] = (data as any)?.OT_BlogPage?.items ?? []
    return items
      .filter(p => !excludeKey || p._metadata?.key !== excludeKey)
      .slice(0, 3)
  } catch {
    return []
  }
})
