import { contentType } from '@optimizely/cms-sdk'
import { BlankExperience } from './BlankExperience'

// ─── OT_BlogFeedBlock ─────────────────────────────────────────────────────────
// A paginated, filterable listing of OT_BlogPage items.
//
// heading       — per-language section title rendered above the feed.
// articleRoot   — content reference to the page/experience that acts as the
//                 folder root for blog posts. Posts are filtered client-side by
//                 the hierarchical URL prefix of the chosen root; leave empty to
//                 show all published posts across the site.
// pageSize      — how many cards/rows appear per paginated page (default 9).
//
// View-mode toggle (grid / list) and topic filter chips are rendered by the
// client component and require no CMS property — they are purely interactive.

export const OT_BlogFeedBlock = contentType({
  key:         'OT_BlogFeedBlock',
  displayName: 'Blog Feed',
  baseType:    '_component',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    heading: {
      type:        'string',
      isLocalized: true,
      maxLength:   120,
      displayName: 'Feed Heading',
      description: 'Optional heading displayed above the blog grid. Localised so each language can carry a distinct label.',
      group:       'OT_Content',
      sortOrder:   10,
    },
    articleRoot: {
      type:         'contentReference',
      allowedTypes: ['_page', BlankExperience],
      displayName:  'Article Root',
      description:  'The page or Blank Experience that blog posts live under. Leave empty to show posts from anywhere on the site.',
      group:        'OT_Content',
      sortOrder:    20,
    },
    pageSize: {
      type:        'integer',
      displayName: 'Posts Per Page',
      description: 'Number of posts shown per paginated page. Defaults to 9 when not set. Min 1, max 24.',
      group:       'OT_Content',
      sortOrder:   30,
    },
  },
})
