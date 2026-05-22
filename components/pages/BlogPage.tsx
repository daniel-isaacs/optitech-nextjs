import type { BlogPageContent, BlogPostSummary } from '@/lib/blog'

// ─── Topic display labels ─────────────────────────────────────────────────────

const TOPIC_LABELS: Record<string, string> = {
  innovation: 'Innovation',
  engineering: 'Engineering',
  product: 'Product',
  trends: 'Trends',
  community: 'Community',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

function authorInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopicBadge({ topic, inverted = false }: { topic: string; inverted?: boolean }) {
  const label = TOPIC_LABELS[topic] ?? topic
  if (inverted) {
    return (
      <span className="inline-block text-accent text-label uppercase tracking-label">
        {label}
      </span>
    )
  }
  return (
    <span className="inline-block bg-accent text-fg-on-accent text-label uppercase tracking-label px-sm py-[3px]">
      {label}
    </span>
  )
}

function BlogCard({ post }: { post: BlogPostSummary }) {
  const imageUrl  = post.featuredImage?.url?.default
  const postUrl   = post._metadata?.url?.default ?? '#'
  const published = post._metadata?.published
  const topic     = post.topic

  return (
    <a
      href={postUrl}
      className="group block card-hover-lift bg-canvas border border-fg/[0.08]"
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden bg-surface">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.headline}
            className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand/20 to-canvas" />
        )}
      </div>

      {/* Content */}
      <div className="px-md pt-md pb-lg">
        {topic && (
          <div className="mb-sm">
            <TopicBadge topic={topic} inverted />
          </div>
        )}
        <h3 className="text-title leading-title font-semibold text-fg text-wrap-balance line-clamp-3">
          {post.headline}
        </h3>
        <div className="mt-sm flex flex-wrap items-center gap-x-sm gap-y-xs text-label text-fg-muted">
          {post.author && <span>{post.author}</span>}
          {post.author && published && <span aria-hidden>·</span>}
          {published && (
            <time dateTime={published}>{formatDate(published)}</time>
          )}
          {post.readTime && (
            <>
              <span aria-hidden>·</span>
              <span>{post.readTime}</span>
            </>
          )}
        </div>
      </div>
    </a>
  )
}

// ─── Page component ───────────────────────────────────────────────────────────

type Props = {
  content:     BlogPageContent
  latestPosts: BlogPostSummary[]
}

export default function BlogPage({ content, latestPosts }: Props) {
  const {
    headline,
    subHeadline,
    topic,
    author,
    authorRole,
    authorPhoto,
    readTime,
    body,
    featuredImage,
    featuredVideo,
    _metadata,
  } = content

  const published     = _metadata?.published
  const videoUrl      = featuredVideo?.url?.default
  const imageUrl      = featuredImage?.url?.default
  const mediaType     = videoUrl ? 'video' : imageUrl ? 'image' : null
  const authorPhotoUrl = authorPhoto?.url?.default
  const initials      = author ? authorInitials(author) : ''

  return (
    <article>

      {/* ── Article header ─────────────────────────────────────────── */}
      <header className="bg-brand">
        <div className="mx-auto max-w-[68ch] px-md pt-2xl pb-xl">

          {/* Topic badge */}
          {topic && (
            <div className="mb-md">
              <TopicBadge topic={topic} />
            </div>
          )}

          {/* Headline */}
          <h1 className="text-display leading-display tracking-display text-fg-on-brand [text-wrap:balance]">
            {headline}
          </h1>

          {/* Sub-headline */}
          {subHeadline && (
            <p className="mt-sm text-title leading-title text-fg-on-brand/70 [text-wrap:pretty]">
              {subHeadline}
            </p>
          )}

          {/* Author / meta row */}
          {(author || published || readTime) && (
            <div className="mt-lg flex items-center gap-md">
              {/* Avatar */}
              {author && (
                <div className="flex-none w-9 h-9 overflow-hidden bg-brand-hover">
                  {authorPhotoUrl ? (
                    <img
                      src={authorPhotoUrl}
                      alt={author}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-label font-semibold text-fg-on-brand">
                      {initials}
                    </div>
                  )}
                </div>
              )}

              {/* Meta text */}
              <div className="flex flex-wrap items-center gap-x-sm gap-y-xs text-label text-fg-on-brand/70">
                {author && (
                  <span className="text-fg-on-brand font-semibold">{author}</span>
                )}
                {author && authorRole && (
                  <><span aria-hidden>·</span><span>{authorRole}</span></>
                )}
                {published && (
                  <>
                    <span aria-hidden>·</span>
                    <time dateTime={published}>{formatDate(published)}</time>
                  </>
                )}
                {readTime && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{readTime}</span>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </header>

      {/* ── Featured media ─────────────────────────────────────────── */}
      {mediaType && (
        <div className="bg-canvas pt-xl pb-0">
          <div className="mx-auto max-w-3xl px-md">
            {mediaType === 'video' ? (
              <video
                src={videoUrl!}
                controls
                className="w-full aspect-video object-cover shadow-[0_16px_48px_var(--ot-bloom-brand-faint)]"
              />
            ) : (
              <img
                src={imageUrl!}
                alt={headline}
                className="w-full aspect-video object-cover shadow-[0_16px_48px_var(--ot-bloom-brand-faint)]"
              />
            )}
          </div>
        </div>
      )}

      {/* ── Article body ───────────────────────────────────────────── */}
      <section className={`bg-canvas ${mediaType ? 'pt-xl' : 'pt-2xl'} pb-2xl`}>
        <div
          data-rich-text=""
          data-color="canvas"
          data-size="editorial"
          className="mx-auto max-w-[68ch] px-md"
          // CMS-managed rich text — not user input
          dangerouslySetInnerHTML={{ __html: body?.html ?? '' }}
        />
      </section>

      {/* ── Latest posts ───────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <section className="bg-surface pt-xl pb-2xl">
          <div className="mx-auto max-w-5xl px-md">
            <p className="text-label uppercase tracking-label text-fg-muted mb-lg">
              More from the blog
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
              {latestPosts.map(post => (
                <BlogCard key={post._metadata.key} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

    </article>
  )
}
