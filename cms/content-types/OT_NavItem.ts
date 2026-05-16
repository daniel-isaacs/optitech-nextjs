import { contentType } from '@optimizely/cms-sdk'

export const OT_NavItem = contentType({
  key: 'OT_NavItem',
  displayName: 'Nav Item',
  baseType: '_component',
  properties: {
    label:       { type: 'string',  displayName: 'Label',       group: 'OT_Content', sortOrder: 10 },
    url:         { type: 'url',     displayName: 'URL',         group: 'OT_Content', sortOrder: 20 },
    hasDropdown: { type: 'boolean', displayName: 'Has Dropdown', group: 'OT_Content', sortOrder: 30 },
  },
})
