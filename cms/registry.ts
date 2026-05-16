import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server'
import OT_HeroBlock from '@/cms/components/OT_HeroBlock'
import OT_CardBlock from '@/cms/components/OT_CardBlock'
import OT_PrimaryTextBlock from '@/cms/components/OT_PrimaryTextBlock'
import OT_QuoteBlock from '@/cms/components/OT_QuoteBlock'
import OT_RichTextBlock from '@/cms/components/OT_RichTextBlock'
import OT_ImageBlock from '@/cms/components/OT_ImageBlock'
import OT_VideoBlock from '@/cms/components/OT_VideoBlock'

initReactComponentRegistry({
  resolver: {
    OT_HeroBlock,
    OT_CardBlock,
    OT_PrimaryTextBlock,
    OT_QuoteBlock,
    OT_RichTextBlock,
    OT_ImageBlock,
    OT_VideoBlock,
  },
})
