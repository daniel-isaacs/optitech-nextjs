import type { Metadata } from "next";
import { SectionLabel } from "../components";
import BlogPage from "@/components/pages/BlogPage";

export const metadata: Metadata = {
  title: "Page Types — Design System — OptiTech",
};

// ─── Mock author ──────────────────────────────────────────────────────────────

const MOCK_AUTHOR = {
  name:     'Nadia Okafor',
  role:     'Staff Infrastructure Engineer',
  photo:    {
    url: {
      default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&fit=crop&crop=faces',
    },
  },
  bio: {
    html: '<p>Nadia leads infrastructure reliability at OptiTech, specialising in distributed evaluation systems and edge-state propagation. Before joining, she built low-latency data pipelines at two YC-backed startups and co-authored an open-source benchmark suite for feature flag SDKs. She speaks at QCon and writes about systems design on her personal blog.</p>',
  },
  linkedIn: 'https://linkedin.com',
  twitter:  'https://x.com',
}

// ─── Shared mock content ──────────────────────────────────────────────────────

const MOCK_CONTENT_BASE = {
  _metadata: {
    key:       'showcase-blog-article',
    published: '2026-05-15T09:00:00Z',
    url:       { default: '/blog/architecture-sub-millisecond-delivery' },
  },
  headline:    'How OptiTech Builds for Speed: Architecture Behind Sub-Millisecond Feature Delivery',
  subHeadline: 'A look inside the evaluation hot path, edge-distributed state, and the targeting rule compiler that makes it possible.',
  topic:       'engineering',
  authorRef:   MOCK_AUTHOR,
  readTime:    '8 min read',
  featuredImage: {
    url: { default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&fit=crop' },
  },
  body: {
    html: `
      <p>At OptiTech, we have spent the last three years obsessing over a single question: what does it take to deliver feature evaluations at sub-millisecond latency, at global scale, without sacrificing correctness?</p>
      <p>The answer is not a single clever trick. It is a systems-level commitment to speed at every layer — from how we store flag state to how we propagate changes across regions.</p>
      <h2>The evaluation hot path</h2>
      <p>Every feature flag evaluation follows the same path. A request comes in, we look up the flag configuration, evaluate the targeting rules against the user context, and return a variation. Simple in description, brutal in practice when you are doing it 50,000 times per second per customer.</p>
      <p>The key insight that unlocked our current performance is that flag configuration changes far less frequently than it is read. A flag might change once a day; it is evaluated millions of times. This asymmetry is the foundation of everything else.</p>
      <h2>In-memory state, edge-distributed</h2>
      <p>We keep the entire flag state in memory — no database round-trips on the hot path. Changes are pushed to evaluation nodes within 200 milliseconds of a save in the CMS. The push system uses WebSocket connections with a polling fallback for resilience.</p>
      <p>This means evaluation nodes are occasionally stale by up to 200ms. For most feature flags, that is an acceptable trade. For kill switches, we support an opt-in strong-consistency mode that adds one round-trip but guarantees freshness.</p>
      <h2>Targeting rule compilation</h2>
      <p>Targeting rules are pre-compiled into a decision tree on flag save, not at evaluation time. The compiler produces a compact bytecode representation that the evaluation engine walks in a single pass. No regex evaluation, no dynamic attribute lookup — just direct bytecode interpretation against a pre-indexed user context.</p>
    `,
  },
}

const MOCK_LATEST_POSTS = [
  {
    _metadata: {
      key:       'showcase-blog-post-1',
      published: '2026-05-10T08:00:00Z',
      url:       { default: '/blog/future-of-personalization' },
    },
    headline:      'The Future of Personalization: How AI Is Reshaping User Experiences',
    topic:         'innovation',
    featuredImage: {
      url: { default: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&fit=crop' },
    },
    authorRef: { name: 'Marcus Webb' },
    readTime:  '5 min read',
  },
  {
    _metadata: {
      key:       'showcase-blog-post-2',
      published: '2026-05-06T10:30:00Z',
      url:       { default: '/blog/zero-downtime-deployments' },
    },
    headline:      'Why Feature Flags Are the Foundation of Modern Product Development',
    topic:         'product',
    featuredImage: {
      url: { default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fit=crop' },
    },
    authorRef: { name: 'Priya Nair' },
    readTime:  '6 min read',
  },
  {
    _metadata: {
      key:       'showcase-blog-post-3',
      published: '2026-04-28T14:00:00Z',
      url:       { default: '/blog/observability-trends-2026' },
    },
    headline:      'Observability in 2026: Five Trends Redefining How Teams Monitor Production',
    topic:         'trends',
    featuredImage: undefined,
    authorRef:     { name: 'James Okonkwo' },
    readTime:      '4 min read',
  },
]

export default function ShowcasePagesPage() {
  return (
    <>

      {/* ════════════════════════════════════════════════════════════════
          IMPACT — display type with 3D extrusion and poster energy
          ════════════════════════════════════════════════════════════════ */}
      <section id="blog-impact" className="pt-xl">
        <div className="px-md lg:px-lg pb-lg">
          <SectionLabel index="01 · Blog" title="Impact" />
          <p className="text-body text-fg-muted mt-sm max-w-[60ch]">
            <code className="font-mono text-accent">blogStyle: impact</code> — poster-format header at display scale with a 3D extruded text-shadow. The topic ordinal decorates the background. Suited to announcements and flagship engineering posts.
          </p>
        </div>

        <BlogPage
          content={{ ...MOCK_CONTENT_BASE, blogStyle: 'impact' }}
          latestPosts={[]}
        />

        <div className="pb-xl" />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          ATMOSPHERIC — cinematic image header with glass content panel
          ════════════════════════════════════════════════════════════════ */}
      <section id="blog-atmospheric" className="pt-xl">
        <div className="px-md lg:px-lg pb-lg">
          <SectionLabel index="02 · Blog" title="Atmospheric" />
          <p className="text-body text-fg-muted mt-sm max-w-[60ch]">
            <code className="font-mono text-accent">blogStyle: atmospheric</code> — featured image bleeds full-height into the header; a glass panel anchors the article metadata over the blurred backdrop. The image is not repeated below.
          </p>
        </div>

        <BlogPage
          content={{ ...MOCK_CONTENT_BASE, blogStyle: 'atmospheric' }}
          latestPosts={[]}
        />

        <div className="pb-xl" />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          EDITORIAL — split-column header, magazine layout
          ════════════════════════════════════════════════════════════════ */}
      <section id="blog-editorial" className="pt-xl">
        <div className="px-md lg:px-lg pb-lg">
          <SectionLabel index="03 · Blog" title="Editorial" />
          <p className="text-body text-fg-muted mt-sm max-w-[60ch]">
            <code className="font-mono text-accent">blogStyle: editorial</code> — asymmetric two-column header: headline occupies the wide left column, topic mark and author stack in the right sidebar. Surface background, brand accent bar at top. Best for analysis and long-form pieces.
          </p>
        </div>

        <BlogPage
          content={{ ...MOCK_CONTENT_BASE, blogStyle: 'editorial' }}
          latestPosts={MOCK_LATEST_POSTS}
        />

        <div className="pb-xl" />
      </section>

    </>
  );
}
