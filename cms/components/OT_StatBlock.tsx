import { getPreviewUtils }        from '@optimizely/cms-sdk/react/server'
import { getStatBlockStyles }     from '@/cms/styling/OT_StatBlock.styling'
import StatBlock, { type StatItem } from '@/components/blocks/StatBlock'

type Props = {
  content:          any
  displaySettings?: Record<string, string | boolean>
}

/**
 * Build a StatItem[] from the content object.
 *
 * Supports three formats:
 *   1. CMS array:  content.stats[]  — each item has value/label/context/icon (new format)
 *   2. Items array: content.items[] — used in showcase page and testing
 *   3. Flat props:  content.stat1Value … stat4Value — legacy fallback
 */
function buildStats(content: any): StatItem[] {
  // Format 1: CMS array property (OT_StatItem components)
  if (Array.isArray(content.stats)) {
    return (content.stats as any[])
      .filter(item => item?.value && item?.label)
      .map(item => ({
        value:   String(item.value),
        label:   String(item.label),
        context: item.context ? String(item.context) : undefined,
        icon:    item.icon    ? String(item.icon)    : undefined,
      }))
  }

  // Format 2: items array (showcase / test)
  if (Array.isArray(content.items)) {
    return (content.items as any[])
      .filter(item => item?.value && item?.label)
      .map(item => ({
        value:   String(item.value),
        label:   String(item.label),
        context: item.context ? String(item.context) : undefined,
        icon:    item.icon    ? String(item.icon)    : undefined,
      }))
  }

  // Format 3: flat CMS properties (legacy — stat1Value … stat4Value)
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
