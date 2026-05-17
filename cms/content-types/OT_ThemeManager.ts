import { contentType } from '@optimizely/cms-sdk'
import { OT_NavItem } from './OT_NavItem'
import { OT_FooterLink } from './OT_FooterLink'
import { OT_FooterColumn } from './OT_FooterColumn'

export const OT_ThemeManager = contentType({
  key: 'OT_ThemeManager',
  displayName: 'Theme Manager',
  baseType: '_component',
  properties: {
    // Identity — which front-end domain loads this theme
    frontEndDomain: { type: 'string', displayName: 'Front-End Domain (e.g. mysite.vercel.app)', group: 'OT_Content', sortOrder: 1 },

    // Logo
    logo:           { type: 'contentReference', allowedTypes: ['_image'], displayName: 'Logo',                                          group: 'OT_Content', sortOrder: 5   },
    logoAlt:        { type: 'string',                                     displayName: 'Logo Alt Text',                                   group: 'OT_Content', sortOrder: 10  },
    logoFit:        { type: 'string',                                     displayName: 'Logo Fit (full | icon | compact)',                 group: 'OT_Content', sortOrder: 15  },
    logoInvertDark: { type: 'boolean',                                    displayName: 'Invert Logo in Dark Mode (turns dark logos white)', group: 'OT_Content', sortOrder: 18  },

    // Header CTA
    ctaLabel: { type: 'string', displayName: 'CTA Label', group: 'OT_Content', sortOrder: 20 },
    ctaUrl:   { type: 'url',    displayName: 'CTA URL',   group: 'OT_Content', sortOrder: 30 },

    // Navigation
    navItems: {
      type: 'array',
      displayName: 'Nav Items',
      group: 'OT_Content',
      sortOrder: 40,
      items: { type: 'component', contentType: OT_NavItem },
    },

    // Footer
    copyright:    { type: 'string', displayName: 'Copyright',      group: 'OT_Content', sortOrder: 50 },
    footerTagline: { type: 'string', displayName: 'Footer Tagline', group: 'OT_Content', sortOrder: 60 },
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

    // Theme color overrides — CSS values (hex, oklch, hsl, etc.)
    // All optional; if empty the defaults in styles/tokens.css apply.
    colorBrand:        { type: 'string', displayName: 'Brand Color — primary fill (hex: #00bcd4 or oklch: oklch(55% 0.18 195))', group: 'OT_Theme', sortOrder: 100 },
    colorBrandHover:   { type: 'string', displayName: 'Brand Hover — depth state (hex or oklch)',                               group: 'OT_Theme', sortOrder: 110 },
    colorAccent:       { type: 'string', displayName: 'Accent Color — highlights / badges (hex or oklch)',                      group: 'OT_Theme', sortOrder: 120 },
    colorCanvas:       { type: 'string', displayName: 'Canvas Dark — page background in dark mode (hex or oklch)',              group: 'OT_Theme', sortOrder: 130 },
    colorSurface:      { type: 'string', displayName: 'Surface Dark — component panels in dark mode (hex or oklch)',            group: 'OT_Theme', sortOrder: 140 },
    colorCanvasLight:  { type: 'string', displayName: 'Canvas Light — page background in light mode (hex or oklch)',            group: 'OT_Theme', sortOrder: 150 },
    colorSurfaceLight: { type: 'string', displayName: 'Surface Light — component panels in light mode (hex or oklch)',          group: 'OT_Theme', sortOrder: 160 },
  },
})
