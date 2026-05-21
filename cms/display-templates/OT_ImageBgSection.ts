import { displayTemplate } from '@optimizely/cms-sdk'

export const OT_ImageBgSectionTemplate = displayTemplate({
  key:         'OT_ImageBgSection',
  displayName: 'Image Background Section',
  baseType:    '_section',
  isDefault:   false,
  settings: {
    contentWidth: {
      displayName: 'Content width',
      editor:      'select',
      sortOrder:   10,
      choices: {
        full:    { displayName: 'Full bleed',       sortOrder: 10 },
        default: { displayName: 'Default',          sortOrder: 20 },
        wide:    { displayName: 'Wide (max-7xl)',    sortOrder: 30 },
        narrow:  { displayName: 'Narrow (max-4xl)', sortOrder: 40 },
      },
    },
    verticalPadding: {
      displayName: 'Vertical padding',
      editor:      'select',
      sortOrder:   20,
      choices: {
        none:   { displayName: 'None',   sortOrder: 10 },
        small:  { displayName: 'Small',  sortOrder: 20 },
        medium: { displayName: 'Medium', sortOrder: 30 },
        large:  { displayName: 'Large',  sortOrder: 40 },
        xl:     { displayName: 'XL',     sortOrder: 50 },
      },
    },
    minHeight: {
      displayName: 'Minimum height',
      editor:      'select',
      sortOrder:   30,
      choices: {
        none:     { displayName: 'Content height',   sortOrder: 10 },
        screen50: { displayName: '50% viewport',     sortOrder: 20 },
        screen75: { displayName: '75% viewport',     sortOrder: 30 },
        screen:   { displayName: 'Full viewport',    sortOrder: 40 },
      },
    },
    imageOverlay: {
      displayName: 'Image overlay',
      editor:      'select',
      sortOrder:   40,
      choices: {
        none:       { displayName: 'None',             sortOrder: 10 },
        subtleDark: { displayName: 'Subtle dark',      sortOrder: 20 },
        strongDark: { displayName: 'Strong dark',      sortOrder: 30 },
        brand:      { displayName: 'Brand tint',       sortOrder: 40 },
        glass:      { displayName: 'Glass (blur)',      sortOrder: 50 },
      },
    },
    contentAlign: {
      displayName: 'Content vertical alignment',
      editor:      'select',
      sortOrder:   50,
      choices: {
        start:  { displayName: 'Top',    sortOrder: 10 },
        center: { displayName: 'Center', sortOrder: 20 },
        end:    { displayName: 'Bottom', sortOrder: 30 },
      },
    },
  },
})
