import { ArrowUpRight } from 'lucide-react'
import type { PractitionerCardData } from '@/lib/practitioners'
import {
  practitionerInitials,
  practitionerName,
  primaryArea,
  bioPreview,
} from '@/lib/practitionerFormat'
import Headshot from './Headshot'

type Props = {
  practitioner: PractitionerCardData
  /** True when the surrounding section uses the `surface` ground (flips card bg). */
  onSurface?: boolean
  density?: 'comfortable' | 'compact'
}

// Portrait, image-top directory card. The headshot is the dominant visual; the
// whole card links to the profile page when one exists. Used inside the client
// listing — purely presentational, no hooks.

export default function PractitionerCard({ practitioner, onSurface = false, density = 'comfortable' }: Props) {
  const p = practitioner
  const name     = practitionerName(p, true)
  const initials = practitionerInitials(p)
  const primary  = primaryArea(p.practiceAreas)
  const preview  = bioPreview(p.bio, density === 'compact' ? 130 : 200)

  const cardBg = onSurface ? 'bg-canvas' : 'bg-surface'
  const pad    = density === 'compact' ? 'p-sm' : 'p-md'

  const body = (
    <>
      <Headshot
        variant="card"
        src={p.headshotUrl}
        initials={initials}
        alt={name ? `Portrait of ${name}` : 'Practitioner portrait'}
      />

      <div className={`flex flex-1 flex-col ${pad}`}>
        <div className="flex items-start justify-between gap-sm">
          <h3 className="text-title leading-title font-semibold text-fg text-balance min-w-0">
            {name || 'Practitioner'}
          </h3>
          {p.url && (
            <ArrowUpRight
              size={18}
              strokeWidth={2}
              aria-hidden
              className="flex-none mt-0.5 text-fg-muted motion-safe:transition-all duration-200 group-hover:text-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          )}
        </div>

        {p.credentials && (
          <p className="mt-1 text-label uppercase tracking-label font-semibold text-brand">{p.credentials}</p>
        )}

        {p.title && <p className="mt-sm text-body leading-snug text-fg">{p.title}</p>}

        {primary && (
          <p className="mt-1 text-body leading-snug text-fg-muted text-pretty">
            {primary.areaName}
            {primary.facility && <span className="block text-fg-muted/70">{primary.facility}</span>}
          </p>
        )}

        {preview && density !== 'compact' && (
          <p className="mt-sm text-sm leading-snug text-fg-muted/80 text-pretty line-clamp-3">{preview}</p>
        )}
      </div>
    </>
  )

  const className = `group card-hover-lift flex h-full w-full flex-col ${cardBg} border border-fg/10 overflow-hidden focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand`

  return p.url ? (
    <a href={p.url} className={`${className} focus:outline-none`} aria-label={`View profile: ${name}`}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  )
}
