import type { BlogPageContent } from '@/lib/blog'

// ─── CMP preview payload → BlogPageContent mapping ──────────────────────────────
//
// Optimizely CMP (Welcome) delivers structured content in a deeply-nested,
// locale-and-version-aware shape. The actual field values live at:
//
//   data.assets.structured_contents[0]
//     .content_body.fields_version.fields[<fieldKey>][n].field_values[0]
//
// where each field is an array of per-locale entries, and each entry has a
// field_values array whose item shape depends on the field type:
//   text-field     → { text_value }
//   choice         → { choice_key }
//   rich-text      → { rich_text_value }   (HTML string)
//   library-asset  → { asset_guid, asset_type, links: { self } }
//
// This module flattens that into the flat BlogPageContent our <BlogPage>
// component already consumes, so the CMP preview renders through the exact same
// UI as a CMS-backed blog page.

type AnyRec = Record<string, any>

// Picks the field_values[0] object for a field, preferring the entry matching
// the content's primary locale and falling back to the first entry.
function fieldValue(fields: AnyRec, key: string, locale?: string): AnyRec | undefined {
  const entries = fields?.[key]
  if (!Array.isArray(entries) || entries.length === 0) return undefined
  const entry = (locale && entries.find((e: AnyRec) => e?.locale === locale)) || entries[0]
  return entry?.field_values?.[0]
}

export type MappedCmpBlog = {
  content: BlogPageContent
  /** Identifiers needed to acknowledge / complete the preview back to CMP (phase 3). */
  previewId?: string
  contentId?: string
  versionId?: string
  contentHash?: string
  /** CMP asset-urls endpoint for the featured image — needs CMP API auth to resolve. */
  featuredImageAssetUrl?: string | null
  links?: { acknowledge?: string; complete?: string }
}

// Maps a captured `content_preview_requested` payload to BlogPageContent.
// Returns null if the payload contains no structured content. `blogStyle` lets
// the caller pick a header treatment (CMP's content type has no such field).
export function mapCmpPreviewToBlog(
  rawPayload: unknown,
  opts?: { blogStyle?: string },
): MappedCmpBlog | null {
  const payload = rawPayload as AnyRec
  const sc = payload?.data?.assets?.structured_contents?.[0]
  if (!sc) return null

  const body = sc.content_body ?? {}
  const fieldsVersion = body.fields_version ?? {}
  const fields = fieldsVersion.fields ?? {}
  const locale: string | undefined = body.primary_locale

  const text   = (k: string) => fieldValue(fields, k, locale)?.text_value as string | undefined
  const rich   = (k: string) => fieldValue(fields, k, locale)?.rich_text_value as string | undefined
  const choice = (k: string) => fieldValue(fields, k, locale)?.choice_key as string | undefined

  const headline    = text('headline') ?? sc.title ?? 'Untitled'
  const subHeadline = text('subHeadline')
  const readTime    = text('readTime')
  const bodyHtml    = rich('body') ?? ''
  // BlogPage's TOPIC_LABELS are keyed lowercase; CMP choice keys are TitleCase.
  const topicRaw    = choice('topic')
  const topic       = topicRaw ? topicRaw.toLowerCase() : undefined
  const published   = body.updated_at ?? body.created_at ?? ''

  const featuredImageAssetUrl = fieldValue(fields, 'featuredImage', locale)?.links?.self ?? null

  const content: BlogPageContent = {
    _metadata: {
      key: body.content_guid ?? sc.id ?? 'cmp-preview',
      published,
      url: { default: null },
    },
    headline,
    subHeadline,
    topic,
    blogStyle: opts?.blogStyle ?? 'editorial',
    body: { html: bodyHtml },
    readTime,
    // CMP's blog content type has no author field, and the featured image is a
    // CMP-hosted asset that needs API auth to resolve — both omitted for now.
    authorRef: null,
  }

  return {
    content,
    previewId: payload?.data?.preview_id,
    contentId: sc.id,
    versionId: sc.version_id,
    contentHash: fieldsVersion.content_hash,
    featuredImageAssetUrl,
    links: {
      acknowledge: payload?.data?.links?.acknowledge,
      complete: payload?.data?.links?.complete,
    },
  }
}
