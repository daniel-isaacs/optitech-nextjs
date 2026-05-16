import type { ReactNode } from 'react'
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server'

type Props = {
  node: any
  index: number
  displaySettings?: Record<string, string | boolean>
  children: ReactNode
}

// Maps gridSpan value (1–12 or "auto") to Tailwind flex-basis
const gridSpanClasses: Record<string, string> = {
  auto: 'flex-1',
  '1':  'md:basis-1/12  flex-1',
  '2':  'md:basis-2/12  flex-1',
  '3':  'md:basis-3/12  flex-1',
  '4':  'md:basis-4/12  flex-1',
  '5':  'md:basis-5/12  flex-1',
  '6':  'md:basis-6/12  flex-1',
  '7':  'md:basis-7/12  flex-1',
  '8':  'md:basis-8/12  flex-1',
  '9':  'md:basis-9/12  flex-1',
  '10': 'md:basis-10/12 flex-1',
  '11': 'md:basis-11/12 flex-1',
  '12': 'md:basis-full  flex-1',
}

const contentSpacingClasses: Record<string, string> = {
  none:   'gap-0',
  small:  'gap-2',
  medium: 'gap-4',
  large:  'gap-8',
}

const justifyClasses: Record<string, string> = {
  center: 'justify-center',
  end:    'justify-end',
  start:  'justify-start',
}

const alignClasses: Record<string, string> = {
  center: 'content-center',
  end:    'content-end',
  start:  'content-start',
}

export default function Column({ node, displaySettings = {}, children }: Props) {
  const { pa } = getPreviewUtils(node)

  const span    = String(displaySettings.gridSpan        ?? 'auto')
  const spacing = String(displaySettings.contentSpacing  ?? 'medium')
  const justify = String(displaySettings.justifyContent  ?? 'start')
  const align   = String(displaySettings.alignContent    ?? 'start')

  const spanClass    = gridSpanClasses[span]    ?? gridSpanClasses.auto
  const spacingClass = contentSpacingClasses[spacing] ?? contentSpacingClasses.medium
  const justifyClass = justifyClasses[justify]  ?? ''
  const alignClass   = alignClasses[align]      ?? ''

  return (
    <div
      className={`vb:col flex flex-col ${spanClass} ${spacingClass} ${justifyClass} ${alignClass}`}
      {...pa(node)}
    >
      {children}
    </div>
  )
}
