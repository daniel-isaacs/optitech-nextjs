import { contentType } from '@optimizely/cms-sdk'

export const OT_FooterLink = contentType({
  key: 'OT_FooterLink',
  displayName: 'Footer Link',
  baseType: '_component',
  properties: {
    label: { type: 'string', displayName: 'Label', group: 'OT_Content', sortOrder: 10 },
    url:   { type: 'url',    displayName: 'URL',   group: 'OT_Content', sortOrder: 20 },
  },
})
