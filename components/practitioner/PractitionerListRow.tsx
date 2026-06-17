import { Phone, Mail, ArrowRight } from 'lucide-react'
import type { PractitionerCardData } from '@/lib/practitioners'
import {
  practitionerInitials,
  practitionerName,
  primaryArea,
} from '@/lib/practitionerFormat'
import Headshot from './Headshot'

type Props = {
  practitioner: PractitionerCardData
  onSurface?: boolean
  density?: 'comfortable' | 'compact'
}

// Compact directory row. Smaller thumbnail, name + credentials on one line,
// title + primary area on the next, inline contact, and a clear link
// affordance to the profile page. Used inside the client listing.

export default function PractitionerListRow({ practitioner, onSurface = false, density = 'comfortable' }: Props) {
  const p = practitioner
  const name     = practitionerName(p, false)
  const initials = practitionerInitials(p)
  const primary  = primaryArea(p.practiceAreas)

  const rowBg = onSurface ? 'bg-canvas' : 'bg-surface'
  const pad   = density === 'compact' ? 'p-sm gap-sm' : 'p-md gap-md'

  const body = (
    <>
      <Headshot
        variant="row"
        src={p.headshotUrl}
        initials={initials}
        alt={name ? `Portrait of ${name}` : 'Practitioner portrait'}
      />

      <div className="flex-1 min-w-0">
        {/* Name + credentials — one line */}
        <p className="flex flex-wrap items-baseline gap-x-sm">
          <span className="text-title leading-tight font-semibold text-fg">{name || 'Practitioner'}</span>
          {p.credentials && (
            <span className="text-label uppercase tracking-label font-semibold text-brand">{p.credentials}</span>
          )}
        </p>

        {/* Title + primary area — next line */}
        {(p.title || primary) && (
          <p className="mt-0.5 text-body leading-snug text-fg-muted text-pretty">
            {p.title}
            {p.title && primary && <span className="mx-xs text-fg-muted/40" aria-hidden>·</span>}
            {primary && <span className="text-fg-muted">{primary.areaName}</span>}
          </p>
        )}

        {/* Inline contact */}
        {(p.phone || p.email) && (
          <p className="mt-xs flex flex-wrap gap-x-md gap-y-1 font-mono text-xs text-fg-muted/80">
            {p.phone && (
              <span className="inline-flex items-center gap-xs">
                <Phone size={12} strokeWidth={1.75} className="text-brand" aria-hidden />
                {p.phone}
              </span>
            )}
            {p.email && (
              <span className="inline-flex items-center gap-xs min-w-0">
                <Mail size={12} strokeWidth={1.75} className="flex-none text-brand" aria-hidden />
                <span className="truncate">{p.email}</span>
              </span>
            )}
          </p>
        )}
      </div>

      {p.url && (
        <ArrowRight
          size={18}
          strokeWidth={2}
          aria-hidden
          className="flex-none self-center text-fg-muted motion-safe:transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand"
        />
      )}
    </>
  )

  const className = `group card-hover-glow flex items-center ${pad} ${rowBg} border border-fg/10`

  return p.url ? (
    <a
      href={p.url}
      className={`${className} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
      aria-label={`View profile: ${name}`}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  )
}
