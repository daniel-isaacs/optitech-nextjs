import { contentType } from '@optimizely/cms-sdk'

export const OT_BlogPage = contentType({
  key: 'OT_BlogPage',
  displayName: 'Blog Article',
  baseType: '_page',
  properties: {
    blogStyle: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Blog Style',
      group: 'OT_Style',
      sortOrder: 5,
      enum: [
        { value: 'editorial',   displayName: 'Editorial (Split Layout)' },
        { value: 'atmospheric', displayName: 'Atmospheric (Glass)' },
        { value: 'impact',      displayName: 'Impact (Display Type)' },
      ],
    },
    headline:     { type: 'string', displayName: 'Headline',      group: 'OT_Content', sortOrder: 10 },
    subHeadline:  { type: 'string', displayName: 'Sub-headline',  group: 'OT_Content', sortOrder: 20 },
    topic: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Topic',
      group: 'OT_Content',
      sortOrder: 30,
      enum: [
        { value: 'innovation', displayName: 'Innovation' },
        { value: 'engineering', displayName: 'Engineering' },
        { value: 'product',    displayName: 'Product' },
        { value: 'trends',     displayName: 'Trends' },
        { value: 'community',  displayName: 'Community' },
      ],
    },
    featuredImage: { type: 'contentReference', allowedTypes: ['_image'], displayName: 'Featured Image', group: 'OT_Content', sortOrder: 40 },
    featuredVideo: { type: 'contentReference', allowedTypes: ['_video'], displayName: 'Featured Video', group: 'OT_Content', sortOrder: 50 },
    body:          { type: 'richText',         displayName: 'Body',          group: 'OT_Content', sortOrder: 60 },
    author:        { type: 'string',           displayName: 'Author',        group: 'OT_Content', sortOrder: 70 },
    authorRole:    { type: 'string',           displayName: 'Author Role',   group: 'OT_Content', sortOrder: 80 },
    authorPhoto:   { type: 'contentReference', allowedTypes: ['_image'],     displayName: 'Author Photo', group: 'OT_Content', sortOrder: 90 },
    readTime:      { type: 'string',           displayName: 'Read Time',     group: 'OT_Content', sortOrder: 100 },
  },
})
