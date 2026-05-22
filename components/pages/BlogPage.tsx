import type { BlogPageContent, BlogPostSummary } from '@/lib/blog'

// ─── Types ────────────────────────────────────────────────────────────────────

type BlogStyle = 'impact' | 'atmospheric' | 'editorial'

// ─── Config ───────────────────────────────────────────────────────────────────

const TOPIC_LABELS: Record<string, string> = {
  innovation: 'Innovation',
  engineering: 'Engineering',
  product:     'Product',
  trends:      'Trends',
  community:   'Community',
}

// Ordinal position per topic — used as the ghost decoration in Impact style
const TOPIC_INDEX: Record<string, string> = {
  innovation: '01',
  engineering: '02',
  product:    '03',
  trends:     '04',
  community:  '05',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    }).format(new Date(iso))
  } catch { return '' }
}

function authorInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

// ─── TopicMark — horizontal rule + label (headers) ───────────────────────────

function TopicMark({ topic, onBrand = false }: { topic: string; onBrand?: boolean }) {
  const label = TOPIC_LABELS[topic] ?? topic
  return (
    <div className="inline-flex items-center gap-sm">
      <span
        className={`block w-6 h-px flex-none ${onBrand ? 'bg-fg-on-brand/40' : 'bg-accent'}`}
        aria-hidden
      />
      <span className={`text-label uppercase tracking-label font-semibold ${onBrand ? 'text-fg-on-brand/70' : 'text-accent'}`}>
        {label}
      </span>
    </div>
  )
}

// ─── TopicTag — small dot + label (post cards) ────────────────────────────────

function TopicTag({ topic }: { topic: string }) {
  const label = TOPIC_LABELS[topic] ?? topic
  return (
    <div className="inline-flex items-center gap-xs">
      <span className="block w-1.5 h-1.5 bg-accent flex-none" aria-hidden />
      <span className="text-label uppercase tracking-label text-accent font-semibold">{label}</span>
    </div>
  )
}

// ─── TopicBand — full-width accent banner (Impact header only) ────────────────

function TopicBand({ topic }: { topic: string }) {
  const label = TOPIC_LABELS[topic] ?? topic
  return (
    <div className="bg-accent">
      <div className="mx-auto max-w-6xl px-md lg:px-xl py-sm">
        <span className="text-label uppercase tracking-label text-fg-on-accent font-semibold">
          {label}
        </span>
      </div>
    </div>
  )
}

// ─── BlogCard ─────────────────────────────────────────────────────────────────

function BlogCard({ post }: { post: BlogPostSummary }) {
  const imageUrl  = post.featuredImage?.url?.default
  const postUrl   = post._metadata?.url?.default ?? '#'
  const published = post._metadata?.published
  const topic     = post.topic

  return (
    <a href={postUrl} className="group block card-hover-lift bg-canvas border border-fg/[0.08]">
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
      <div className="px-md pt-md pb-lg">
        {topic && (
          <div className="mb-sm">
            <TopicTag topic={topic} />
          </div>
        )}
        <h3 className="text-title leading-title font-semibold text-fg [text-wrap:balance] line-clamp-3">
          {post.headline}
        </h3>
        <div className="mt-sm flex flex-wrap items-center gap-x-sm gap-y-xs text-label text-fg-muted">
          {post.author && <span>{post.author}</span>}
          {post.author && published && <span aria-hidden>·</span>}
          {published && <time dateTime={published}>{formatDate(published)}</time>}
          {post.readTime && <><span aria-hidden>·</span><span>{post.readTime}</span></>}
        </div>
      </div>
    </a>
  )
}

// ─── Shared header props ──────────────────────────────────────────────────────

type HeaderProps = {
  headline:       string
  subHeadline?:   string
  topic?:         string
  author?:        string
  authorRole?:    string
  authorPhotoUrl?: string | null
  published?:     string
  readTime?:      string
  initials:       string
  imageUrl?:      string | null
}

// ─── Impact Header ────────────────────────────────────────────────────────────
// Poster aesthetic: display-scale type with 3D extrusion shadow, full-width
// brand background, ghost ordinal index decoration, full-bleed topic band.

function ImpactHeader({
  headline, subHeadline, topic,
  author, authorRole, authorPhotoUrl, published, readTime, initials,
}: HeaderProps) {
  const topicIndex = topic ? (TOPIC_INDEX[topic] ?? '—') : null

  return (
    <header className="bg-brand overflow-hidden">
      {topic && <TopicBand topic={topic} />}

      <div className="relative">
        {/* Ghost ordinal — decorative watermark, contributes poster energy */}
        {topicIndex && (
          <span
            aria-hidden
            className="blog-impact-index select-none pointer-events-none absolute -right-4 top-0 text-fg-on-brand font-extrabold"
          >
            {topicIndex}
          </span>
        )}

        <div className="relative z-10 mx-auto max-w-6xl px-md lg:px-xl pt-2xl pb-xl">
          <h1 className="text-display leading-display tracking-display text-fg-on-brand [text-wrap:balance] max-w-[14ch] blog-impact-3d-text">
            {headline}
          </h1>

          {subHeadline && (
            <p className="mt-lg text-title leading-title text-fg-on-brand/70 max-w-[56ch] [text-wrap:pretty]">
              {subHeadline}
            </p>
          )}

          {(author || published || readTime) && (
            <div className="mt-xl pt-lg border-t border-fg-on-brand/[0.12]">
              <div className="flex items-center gap-md flex-wrap">
                {author && (
                  <div className="flex-none w-9 h-9 overflow-hidden bg-brand-hover flex items-center justify-center">
                    {authorPhotoUrl ? (
                      <img src={authorPhotoUrl} alt={author} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-label font-semibold text-fg-on-brand">{initials}</span>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-x-sm gap-y-xs text-label text-fg-on-brand/70">
                  {author && <span className="text-fg-on-brand font-semibold">{author}</span>}
                  {author && authorRole && <><span aria-hidden>·</span><span>{authorRole}</span></>}
                  {published && <><span aria-hidden>·</span><time dateTime={published}>{formatDate(published)}</time></>}
                  {readTime && <><span aria-hidden>·</span><span>{readTime}</span></>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// ─── Atmospheric Header ───────────────────────────────────────────────────────
// Cinematic: featured image fills the header, gradient overlay, glass content
// panel anchored to the bottom of the frame. No separate media zone below.

function AtmosphericHeader({
  headline, subHeadline, topic,
  author, authorRole, authorPhotoUrl, published, readTime, initials,
  imageUrl,
}: HeaderProps) {
  return (
    <header
      className="relative bg-canvas overflow-hidden flex flex-col justify-end min-h-[68vh]"
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="blog-atmospheric-overlay absolute inset-0" />
        </>
      ) : (
        <div className="absolute inset-0 bg-brand" />
      )}

      {/* Glass content panel — earns its blur over the image behind it */}
      <div className="relative z-10 px-md lg:px-xl pb-xl">
        <div className="mx-auto max-w-4xl">
          <div className="bg-glass px-lg py-lg lg:px-xl lg:py-xl">
            {topic && (
              <div className="mb-md">
                <TopicMark topic={topic} />
              </div>
            )}

            <h1 className="text-headline leading-headline tracking-headline text-fg [text-wrap:balance]">
              {headline}
            </h1>

            {subHeadline && (
              <p className="mt-sm text-title leading-title text-fg-muted [text-wrap:pretty] max-w-[52ch]">
                {subHeadline}
              </p>
            )}

            {(author || published || readTime) && (
              <div className="mt-lg pt-lg border-t border-fg/[0.08] flex items-center gap-md flex-wrap">
                {author && (
                  <div className="flex-none w-8 h-8 overflow-hidden bg-surface flex items-center justify-center">
                    {authorPhotoUrl ? (
                      <img src={authorPhotoUrl} alt={author} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-label font-semibold text-fg-muted">{initials}</span>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-x-sm gap-y-xs text-label text-fg-muted">
                  {author && <span className="text-fg font-semibold">{author}</span>}
                  {author && authorRole && <><span aria-hidden>·</span><span>{authorRole}</span></>}
                  {published && <><span aria-hidden>·</span><time dateTime={published}>{formatDate(published)}</time></>}
                  {readTime && <><span aria-hidden>·</span><span>{readTime}</span></>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── Editorial Header ─────────────────────────────────────────────────────────
// Split layout: headline fills a wide left column, topic mark and author
// occupy a narrow sidebar. Surface background distinguishes it from the canvas
// body below. A 3px brand bar at top acts as an editorial edition marker.

function EditorialHeader({
  headline, subHeadline, topic,
  author, authorRole, authorPhotoUrl, published, readTime, initials,
}: HeaderProps) {
  return (
    <header className="bg-surface">
      <div className="h-[3px] bg-brand" />

      <div className="mx-auto max-w-6xl px-md lg:px-xl pt-xl pb-xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-xl items-start">

          {/* Headline column */}
          <div>
            <h1 className="text-headline leading-headline tracking-headline text-fg [text-wrap:balance]">
              {headline}
            </h1>
            {subHeadline && (
              <p className="mt-md text-title leading-title text-fg-muted [text-wrap:pretty]">
                {subHeadline}
              </p>
            )}
          </div>

          {/* Sidebar: topic + author stacked */}
          <div className="flex flex-col gap-lg lg:border-l lg:border-fg/[0.08] lg:pl-xl">
            {topic && <TopicMark topic={topic} />}

            {(author || published || readTime) && (
              <div className="flex flex-col gap-sm">
                {author && (
                  <div className="flex items-center gap-sm">
                    <div className="flex-none w-8 h-8 bg-canvas overflow-hidden flex items-center justify-center">
                      {authorPhotoUrl ? (
                        <img src={authorPhotoUrl} alt={author} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-label font-semibold text-fg-muted">{initials}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-label font-semibold text-fg leading-tight">{author}</p>
                      {authorRole && <p className="text-label text-fg-muted">{authorRole}</p>}
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-xs text-label text-fg-muted">
                  {published && <time dateTime={published}>{formatDate(published)}</time>}
                  {readTime && <span>{readTime}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── Page component ───────────────────────────────────────────────────────────

type Props = {
  content:     BlogPageContent
  latestPosts: BlogPostSummary[]
}

const VALID_STYLES: BlogStyle[] = ['impact', 'atmospheric', 'editorial']

export default function BlogPage({ content, latestPosts }: Props) {
  const {
    headline, subHeadline, topic,
    author, authorRole, authorPhoto, readTime,
    body, featuredImage, featuredVideo, _metadata,
  } = content

  const blogStyle: BlogStyle = VALID_STYLES.includes(content.blogStyle as BlogStyle)
    ? (content.blogStyle as BlogStyle)
    : 'editorial'

  const published      = _metadata?.published
  const videoUrl       = featuredVideo?.url?.default
  const imageUrl       = featuredImage?.url?.default
  const mediaType      = videoUrl ? 'video' : imageUrl ? 'image' : null
  const authorPhotoUrl = authorPhoto?.url?.default
  const initials       = author ? authorInitials(author) : ''

  const headerProps: HeaderProps = {
    headline, subHeadline, topic,
    author, authorRole, authorPhotoUrl, published, readTime,
    initials, imageUrl,
  }

  // Atmospheric embeds the featured image in the header — skip the media zone below
  const showMedia  = mediaType !== null && blogStyle !== 'atmospheric'
  const bodyTopPad = showMedia ? 'pt-xl' : 'pt-2xl'

  return (
    <article>
      {blogStyle === 'impact'      && <ImpactHeader      {...headerProps} />}
      {blogStyle === 'atmospheric' && <AtmosphericHeader  {...headerProps} />}
      {blogStyle === 'editorial'   && <EditorialHeader    {...headerProps} />}

      {/* ── Featured media ───────────────────────────────────────────────── */}
      {showMedia && (
        <div className="bg-canvas pt-xl pb-0">
          <div className="mx-auto max-w-4xl px-md">
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

      {/* ── Article body ─────────────────────────────────────────────────── */}
      <section className={`bg-canvas ${bodyTopPad} pb-2xl`}>
        <div
          data-rich-text=""
          data-color="canvas"
          data-scale={blogStyle === 'editorial' ? 'large' : undefined}
          className="mx-auto max-w-[68ch] px-md"
          // CMS-managed rich text — not user input
          dangerouslySetInnerHTML={{ __html: body?.html ?? '' }}
        />
      </section>

      {/* ── Latest posts ─────────────────────────────────────────────────── */}
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
