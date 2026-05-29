import { getPreviewUtils } from '@optimizely/cms-sdk/react/server'
import { getChartStyles } from '@/cms/styling/OT_ChartBlock.styling'
import ChartBlock from '@/components/blocks/ChartBlock'

type Props = {
  content:          any
  displaySettings?: Record<string, string | boolean>
}

export default function OT_ChartBlockAdapter({ content, displaySettings = {} }: Props) {
  const { pa } = getPreviewUtils(content)
  const styleOptions = getChartStyles(displaySettings)

  return (
    <div {...pa(content.__composition)}>
      <ChartBlock
        heading={content.heading ?? ''}
        subtext={content.subtext ?? undefined}
        chartType={content.chartType ?? 'bar'}
        chartData={content.chartData ?? null}
        seriesColors={content.seriesColors ?? 'brand'}
        valuePrefix={content.valuePrefix ?? undefined}
        valueSuffix={content.valueSuffix ?? undefined}
        showLegend={content.showLegend ?? true}
        showGrid={content.showGrid ?? true}
        styleOptions={styleOptions}
      />
    </div>
  )
}
