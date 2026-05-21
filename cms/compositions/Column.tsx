import type { ReactNode } from 'react'
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server'

type Props = {
  node: any
  index: number
  displaySettings?: Record<string, string | boolean>
  children: ReactNode
}

const gridSpanClasses: Record<string, string> = {
  auto:  'flex-1 min-w-0',
  col1:  'flex-none w-full md:w-[8.333%]',
  col2:  'flex-none w-full md:w-[16.667%]',
  col3:  'flex-none w-full md:w-1/4',
  col4:  'flex-none w-full md:w-1/3',
  col5:  'flex-none w-full md:w-[41.667%]',
  col6:  'flex-none w-full md:w-1/2',
  col7:  'flex-none w-full md:w-[58.333%]',
  col8:  'flex-none w-full md:w-2/3',
  col9:  'flex-none w-full md:w-3/4',
  col10: 'flex-none w-full md:w-[83.333%]',
  col11: 'flex-none w-full md:w-[91.667%]',
  col12: 'flex-none w-full',
}

const contentSpacingClasses: Record<string, string> = {
  none:   'gap-0',
  small:  'gap-sm',
  medium: 'gap-md',
  large:  'gap-lg',
  xl:     'gap-xl',
}

const verticalPaddingClasses: Record<string, string> = {
  none:   'py-0',
  small:  'py-sm',
  medium: 'py-md',
  large:  'py-lg',
  xl:     'py-xl',
}

const horizontalPaddingClasses: Record<string, string> = {
  none:   'px-0',
  small:  'px-sm',
  medium: 'px-md',
  large:  'px-lg',
}

const justifyClasses: Record<string, string> = {
  center: 'justify-center',
  end:    'justify-end',
  start:  'justify-start',
}

const alignClasses: Record<string, string> = {
  center:  'items-center',
  end:     'items-end',
  start:   'items-start',
  stretch: '',
}

export default function Column({ node, displaySettings = {}, children }: Props) {
  const { pa } = getPreviewUtils(node)

  const span    = String(displaySettings.gridSpan          ?? 'auto')
  const spacing = String(displaySettings.contentSpacing    ?? 'medium')
  const justify = String(displaySettings.justifyContent    ?? 'start')
  const align   = String(displaySettings.alignContent      ?? 'stretch')
  const vPad    = String(displaySettings.verticalPadding   ?? 'none')
  const hPad    = String(displaySettings.horizontalPadding ?? 'none')

  const spanClass    = gridSpanClasses[span]              ?? gridSpanClasses.auto
  const spacingClass = contentSpacingClasses[spacing]     ?? contentSpacingClasses.medium
  const justifyClass = justifyClasses[justify]            ?? ''
  const alignClass   = alignClasses[align]                ?? ''
  const vPadClass    = verticalPaddingClasses[vPad]       ?? ''
  const hPadClass    = horizontalPaddingClasses[hPad]     ?? ''

  return (
    <div
      className={`vb:col flex flex-col self-stretch ${spanClass} ${spacingClass} ${vPadClass} ${hPadClass} ${justifyClass} ${alignClass}`}
      {...pa(node)}
    >
      {children}
    </div>
  )
}
