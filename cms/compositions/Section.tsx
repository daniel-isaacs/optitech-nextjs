import { getPreviewUtils, OptimizelyGridSection } from '@optimizely/cms-sdk/react/server'

type Props = {
  content: any
  displaySettings?: Record<string, string | boolean>
}

const widthClasses: Record<string, string> = {
  full:     'w-full',
  narrow:   'max-w-4xl w-full mx-auto px-8',
  wide:     'max-w-7xl w-full mx-auto px-8',
  default:  'container mx-auto px-8 w-full',
}

const verticalSpacingClasses: Record<string, string> = {
  small:   'py-8',
  large:   'py-24',
  default: 'py-16',
}

export default function BlankSection({ content, displaySettings = {} }: Props) {
  const { pa } = getPreviewUtils(content)

  const width   = String(displaySettings.gridWidth       ?? 'default')
  const vSpace  = String(displaySettings.verticalSpacing ?? 'default')

  const widthClass  = widthClasses[width]   ?? widthClasses.default
  const vSpaceClass = verticalSpacingClasses[vSpace] ?? verticalSpacingClasses.default

  return (
    <section
      className={`vb:section flex flex-col ${widthClass} ${vSpaceClass}`}
      {...pa(content)}
    >
      <OptimizelyGridSection nodes={content.nodes ?? []} />
    </section>
  )
}
