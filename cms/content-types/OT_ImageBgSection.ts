import { contentType } from '@optimizely/cms-sdk'

export const OT_ImageBgSection = contentType({
  key: 'OT_ImageBgSection',
  displayName: 'Image Background Section',
  baseType: '_section',
  properties: {
    backgroundImage: {
      type:         'contentReference',
      allowedTypes: ['_image'],
      displayName:  'Background Image',
      group:        'OT_Content',
      sortOrder:    10,
    },
  },
})
