import { contentType } from '@optimizely/cms-sdk'

export const OT_BannerBlock = contentType({
  key:         'OT_BannerBlock',
  displayName: 'Banner Block',
  baseType:    '_component',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    heading:           { type: 'string',           displayName: 'Heading',             group: 'OT_Content', sortOrder: 10, isLocalized: true, maxLength: 120 },
    eyebrow:           { type: 'string',           displayName: 'Eyebrow Label',       group: 'OT_Content', sortOrder: 20, isLocalized: true, maxLength: 60  },
    body:              { type: 'richText',          displayName: 'Body Text',           group: 'OT_Content', sortOrder: 30, isLocalized: true                 },
    backgroundImage:   { type: 'contentReference', displayName: 'Background Image',    group: 'OT_Content', sortOrder: 40, allowedTypes: ['_image']           },
    primaryCtaLabel:   { type: 'string',           displayName: 'Primary CTA Label',   group: 'OT_Content', sortOrder: 50, isLocalized: true, maxLength: 60  },
    primaryCtaUrl:     { type: 'url',              displayName: 'Primary CTA URL',     group: 'OT_Content', sortOrder: 60                                    },
    secondaryCtaLabel: { type: 'string',           displayName: 'Secondary CTA Label', group: 'OT_Content', sortOrder: 70, isLocalized: true, maxLength: 60  },
    secondaryCtaUrl:   { type: 'url',              displayName: 'Secondary CTA URL',   group: 'OT_Content', sortOrder: 80                                    },
  },
})
