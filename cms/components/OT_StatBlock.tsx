import { getPreviewUtils }        from '@optimizely/cms-sdk/react/server'
import { getStatBlockStyles }     from '@/cms/styling/OT_StatBlock.styling'
import StatBlock, { type StatItem } from '@/components/blocks/StatBlock'

type Props = {
  content:         any
  displaySettings?: Record<string, string | boolean>
}

/**
 * Build a StatItem[] from the content object.
 *
 * Supports two formats:
 *   1. Flat CMS properties: stat1Value / stat1Label / stat1Context / stat1Icon … stat4*
 *   2. Direct items array (used in showcase page and testing)
 */
function buildStats(content: any): StatItem[] {
  // Format 2: items array (showcase / test)
  if (Array.isArray(content.items)) {
    return (content.items as any[])
      .filter(item => item?.value && item?.label)
      .map(item => ({
        value:   String(item.value),
        label:   String(item.label),
        context: item.context  ? String(item.context)  : undefined,
        icon:    item.icon     ? String(item.icon)     : undefined,
      }))
  }

  // Format 1: flat CMS properties
  const stats: StatItem[] = []
  for (let n = 1; n <= 4; n++) {
    const v = content[`stat${n}Value`]
    const l = content[`stat${n}Label`]
    if (v && l) {
      stats.push({
        value:   String(v),
        label:   String(l),
        context: content[`stat${n}Context`] ? String(content[`stat${n}Context`]) : undefined,
        icon:    content[`stat${n}Icon`]    ? String(content[`stat${n}Icon`])    : undefined,
      })
    }
  }
  return stats
}

export default function OT_StatBlockAdapter({ content, displaySettings = {} }: Props) {
  const { pa }       = getPreviewUtils(content)
  const styleOptions = getStatBlockStyles(displaySettings)
  const stats        = buildStats(content)

  return (
    <div {...pa(content.__composition)} className="w-full">
      <StatBlock
        stats={stats}
        styleOptions={styleOptions}
      />
    </div>
  )
}
