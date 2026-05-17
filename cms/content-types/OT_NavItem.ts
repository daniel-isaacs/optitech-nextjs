import { contentType } from '@optimizely/cms-sdk'
import { OT_NavSubItem } from './OT_NavSubItem'

export const OT_NavItem = contentType({
  key: 'OT_NavItem',
  displayName: 'Nav Item',
  baseType: '_component',
  properties: {
    label: { type: 'string', displayName: 'Label', group: 'OT_Content', sortOrder: 10 },
    url:   { type: 'url',    displayName: 'URL',   group: 'OT_Content', sortOrder: 20 },
    dropdownItems: {
      type: 'array',
      displayName: 'Dropdown Items (leave empty for no dropdown)',
      group: 'OT_Content',
      sortOrder: 30,
      items: { type: 'component', contentType: OT_NavSubItem },
    },
  },
})
