import { contentType } from '@optimizely/cms-sdk'

export const OT_NavSubItem = contentType({
  key: 'OT_NavSubItem',
  displayName: 'Nav Sub Item',
  baseType: '_component',
  properties: {
    label:       { type: 'string', displayName: 'Label',                                       group: 'OT_Content', sortOrder: 10 },
    url:         { type: 'url',    displayName: 'URL',                                         group: 'OT_Content', sortOrder: 20 },
    description: { type: 'string', displayName: 'Description (optional — shown in dropdown)', group: 'OT_Content', sortOrder: 30 },
  },
})
