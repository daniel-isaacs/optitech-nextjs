import { contentType } from '@optimizely/cms-sdk'

export const OT_HeroBlock = contentType({
  key: 'OT_HeroBlock',
  displayName: 'Hero Block',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    eyebrow:            { type: 'string', displayName: 'Eyebrow',             group: 'OT_Content', sortOrder: 10 },
    headline:           { type: 'string', displayName: 'Headline',            group: 'OT_Content', sortOrder: 20 },
    body:               { type: 'string', displayName: 'Body',                group: 'OT_Content', sortOrder: 30 },
    primaryCtaLabel:    { type: 'string', displayName: 'Primary CTA Label',   group: 'OT_Content', sortOrder: 40 },
    primaryCtaUrl:      { type: 'url',    displayName: 'Primary CTA URL',     group: 'OT_Content', sortOrder: 50 },
    secondaryCtaLabel:  { type: 'string', displayName: 'Secondary CTA Label', group: 'OT_Content', sortOrder: 60 },
    secondaryCtaUrl:    { type: 'url',    displayName: 'Secondary CTA URL',   group: 'OT_Content', sortOrder: 70 },
    visual:             { type: 'contentReference', allowedTypes: ['_image'], displayName: 'Visual Image',    group: 'OT_Content', sortOrder: 80 },
    visualAlt:          { type: 'string',                                      displayName: 'Visual Alt Text', group: 'OT_Content', sortOrder: 90 },
  },
})
