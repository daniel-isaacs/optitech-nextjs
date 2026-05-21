import { getPreviewUtils, OptimizelyGridSection } from '@optimizely/cms-sdk/react/server'

type Props = {
  content:          any
  displaySettings?: Record<string, string | boolean>
}

const widthClasses: Record<string, string> = {
  full:    'w-full',
  narrow:  'max-w-4xl w-full mx-auto px-lg',
  wide:    'max-w-7xl w-full mx-auto px-lg',
  default: 'container mx-auto px-lg w-full',
}

const verticalPaddingClasses: Record<string, string> = {
  none:   'py-0',
  small:  'py-md',
  medium: 'py-lg',
  large:  'py-xl',
  xl:     'py-2xl',
}

const minHeightClasses: Record<string, string> = {
  none:     '',
  screen50: 'min-h-[50vh]',
  screen75: 'min-h-[75vh]',
  screen:   'min-h-screen',
}

const overlayClasses: Record<string, string> = {
  none:       '',
  subtleDark: 'bg-canvas/40',
  strongDark: 'bg-canvas/70',
  brand:      'bg-brand/50',
  glass:      'backdrop-blur-md bg-canvas/20',
}

const alignClasses: Record<string, string> = {
  start:  'justify-start',
  center: 'justify-center',
  end:    'justify-end',
}

export default function ImageBgSection({ content, displaySettings = {} }: Props) {
  const { pa, src } = getPreviewUtils(content)

  const bgSrc = src(content.backgroundImage)

  const width     = String(displaySettings.contentWidth    ?? 'default')
  const vPadding  = String(displaySettings.verticalPadding ?? 'large')
  const minHeight = String(displaySettings.minHeight       ?? 'none')
  const overlay   = String(displaySettings.imageOverlay    ?? 'none')
  const align     = String(displaySettings.contentAlign    ?? 'start')

  const widthClass     = widthClasses[width]              ?? widthClasses.default
  const vPaddingClass  = verticalPaddingClasses[vPadding] ?? verticalPaddingClasses.large
  const minHeightClass = minHeightClasses[minHeight]      ?? ''
  const overlayClass   = overlayClasses[overlay]          ?? ''
  const alignClass     = alignClasses[align]              ?? ''

  const hasOverlay = overlayClass.length > 0

  return (
    <section
      className={`vb:section relative isolate flex flex-col w-full ${minHeightClass}`}
      style={bgSrc ? { backgroundImage: `url(${bgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      data-surface="dark"
      {...pa(content)}
    >
      {hasOverlay && (
        <div className={`absolute inset-0 -z-10 ${overlayClass}`} aria-hidden="true" />
      )}
      <div className={`relative z-10 flex flex-col flex-1 ${widthClass} ${vPaddingClass} ${alignClass}`}>
        <OptimizelyGridSection nodes={content.nodes ?? []} />
      </div>
    </section>
  )
}
