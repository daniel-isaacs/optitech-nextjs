import { contentType } from '@optimizely/cms-sdk'

export const OT_PrimaryTextBlock = contentType({
  key: 'OT_PrimaryTextBlock',
  displayName: 'Primary Text Block',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    eyebrow:  { type: 'string', maxLength: 60,  displayName: 'Eyebrow',  group: 'OT_Content', sortOrder: 10 },
    headline: { type: 'string', maxLength: 120, displayName: 'Headline', group: 'OT_Content', sortOrder: 20 },
  },
})
