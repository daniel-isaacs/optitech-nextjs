import { contentType } from '@optimizely/cms-sdk'
import { OT_NavItem } from './OT_NavItem'
import { OT_FooterLink } from './OT_FooterLink'
import { OT_FooterColumn } from './OT_FooterColumn'

export const OT_SiteSettings = contentType({
  key: 'OT_SiteSettings',
  displayName: 'Site Settings',
  baseType: '_page',
  mayContainTypes: [],
  properties: {
    logoAlt:        { type: 'string', displayName: 'Logo Alt Text',   group: 'OT_Content', sortOrder: 10 },
    ctaLabel:       { type: 'string', displayName: 'CTA Label',       group: 'OT_Content', sortOrder: 20 },
    ctaUrl:         { type: 'url',    displayName: 'CTA URL',         group: 'OT_Content', sortOrder: 30 },
    copyright:      { type: 'string', displayName: 'Copyright',       group: 'OT_Content', sortOrder: 40 },
    navItems: {
      type: 'array',
      displayName: 'Nav Items',
      group: 'OT_Content',
      sortOrder: 50,
      items: { type: 'component', contentType: OT_NavItem },
    },
    footerTagline:  { type: 'string', displayName: 'Footer Tagline',  group: 'OT_Content', sortOrder: 60 },
    footerColumns: {
      type: 'array',
      displayName: 'Footer Columns',
      group: 'OT_Content',
      sortOrder: 70,
      items: { type: 'component', contentType: OT_FooterColumn },
    },
    legalLinks: {
      type: 'array',
      displayName: 'Legal Links',
      group: 'OT_Content',
      sortOrder: 80,
      items: { type: 'component', contentType: OT_FooterLink },
    },
  },
})
