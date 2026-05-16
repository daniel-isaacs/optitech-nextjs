import { getPreviewUtils } from '@optimizely/cms-sdk/react/server'
import { getVideoStyles } from '@/cms/styling/OT_VideoBlock.styling'
import VideoBlock from '@/components/blocks/VideoBlock'

type Props = {
  content: any
  displaySettings?: Record<string, string | boolean>
}

// VideoBlock is 'use client' — this server shell applies the block-level preview
// attribute on the outer div; field editing is available through the CMS right panel.
export default function OT_VideoBlock({ content, displaySettings = {} }: Props) {
  const { pa } = getPreviewUtils(content)
  const styleOptions = getVideoStyles(displaySettings)

  return (
    <div {...pa(content.__composition)}>
      <VideoBlock
        src={content.src?.default ?? ''}
        title={content.title ?? ''}
        caption={content.caption ?? undefined}
        styleOptions={styleOptions}
      />
    </div>
  )
}
