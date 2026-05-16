import { contentType } from '@optimizely/cms-sdk'

export const OT_LandingExperience = contentType({
  key: 'OT_LandingExperience',
  displayName: 'Landing Experience',
  baseType: '_experience',
  mayContainTypes: [
    'OT_HeroBlock',
    'OT_CardBlock',
    'OT_PrimaryTextBlock',
    'OT_QuoteBlock',
    'OT_RichTextBlock',
    'OT_ImageBlock',
    'OT_VideoBlock',
  ],
})
