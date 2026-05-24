import { getPreviewUtils } from '@optimizely/cms-sdk/react/server'
import Image from 'next/image'

type Props = {
  content: any
  displaySettings?: Record<string, string | boolean>
}

/**
 * CMS adapter for OT_Author — renders an author profile preview inside
 * the Optimizely editor when the block is opened as a shared item.
 *
 * Not used on the public site. Blog pages render author data inline via
 * the OT_BlogPage adapter which reads the authorRef content reference.
 */
export default function OT_Author({ content }: Props) {
  const { pa } = getPreviewUtils(content)

  const photoUrl: string | undefined = content.photo?.url?.default
  const name:     string = content.name ?? ''
  const role:     string = content.role ?? ''
  const bioHtml:  string = content.bio?.html ?? ''

  return (
    /* Standalone block preview wrapper — centres the card in the preview iframe
       and gives it breathing room against the canvas background. Not visible on
       the public site (author data is rendered inline by BlogPage instead). */
    <div className="min-h-screen bg-canvas flex items-start justify-start p-xl">
    <div
      {...pa(content.__composition)}
      className="flex gap-md p-lg bg-surface border border-fg/10 max-w-lg w-full"
    >
      {photoUrl && (
        <div className="shrink-0">
          <Image
            src={photoUrl}
            alt={name}
            width={64}
            height={64}
            className="w-16 h-16 object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-xs min-w-0">
        {name && (
          <p className="text-sm font-semibold text-fg leading-none">{name}</p>
        )}
        {role && (
          <p className="text-label text-fg-muted">{role}</p>
        )}
        {bioHtml && (
          <div
            className="text-sm text-fg-muted leading-body line-clamp-3 [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: bioHtml }}
          />
        )}
      </div>
    </div>
    </div>
  )
}
