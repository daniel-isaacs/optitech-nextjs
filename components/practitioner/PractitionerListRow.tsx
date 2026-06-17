import { Phone, Mail, ChevronRight } from 'lucide-react'
import type { PractitionerCardData } from '@/lib/practitioners'
import {
  practitionerInitials,
  practitionerName,
  primaryArea,
} from '@/lib/practitionerFormat'
import PractitionerPortrait from './PractitionerPortrait'

type Props = {
  practitioner: PractitionerCardData
  onSurface?: boolean
  density?: 'comfortable' | 'compact'
}

// Compact directory row. A circular portrait thumbnail with a chromatic brand
// ring anchors the left; name + credentials read as one typographic unit, with
// title · primary-area beneath and optional inline contact. The whole row links
// to the profile page. On hover the full border goes brand and a faint brand
// wash fills the row, with the chevron sliding right — a strong left-to-right
// reading anchor without a decorative side-stripe (banned by DESIGN.md).

export default function PractitionerListRow({ practitioner, onSurface = false, density = 'comfortable' }: Props) {
  const p        = practitioner
  const name     = practitionerName(p, false)
  const initials = practitionerInitials(p)
  const primary  = primaryArea(p.practiceAreas)

  const rowBg = onSurface ? 'bg-canvas' : 'bg-surface'
  const pad   = density === 'compact' ? 'gap-sm p-sm' : 'gap-md p-md'

  const body = (
    <>
      <div
        className="flex-none rounded-full"
        // Chromatic brand ring around the circular thumbnail (box-shadow, not a
        // border, so it never affects layout); derived from --ot-brand.
        style={{ boxShadow: '0 0 0 2px oklch(from var(--ot-brand) l c h / 0.35)' }}
      >
        <PractitionerPortrait
          shape="circle"
          src={p.headshotUrl}
          initials={initials}
          alt={name ? `Portrait of ${name}` : 'Practitioner portrait'}
          className="h-14 w-14"
        />
      </div>

      <div className="min-w-0 flex-1">
        {/* Name + credentials — one typographic unit */}
        <p className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-base font-bold leading-tight text-fg">{name || 'Practitioner'}</span>
          {p.credentials && (
            <span className="text-sm font-medium text-fg-muted">{p.credentials}</span>
          )}
        </p>

        {/* Title — emphasized role statement */}
        {p.title && (
          <p className="mt-0.5 text-pretty text-sm font-semibold leading-snug text-fg">{p.title}</p>
        )}

        {/* Primary area · facility — secondary */}
        {primary?.areaName && (
          <p className="mt-0.5 text-sm leading-snug text-fg-muted">
            {primary.areaName}
            {primary.facility && (
              <>
                <span className="mx-1.5 text-fg-muted/40" aria-hidden>·</span>
                {primary.facility}
              </>
            )}
          </p>
        )}

        {/* Inline contact */}
        {(p.phone || p.email) && (
          <p className="mt-xs flex flex-wrap gap-x-md gap-y-1 text-xs text-fg-muted/80">
            {p.phone && (
              <span className="inline-flex items-center gap-xs">
                <Phone size={10} strokeWidth={2} className="text-brand" aria-hidden />
                {p.phone}
              </span>
            )}
            {p.email && (
              <span className="inline-flex min-w-0 items-center gap-xs">
                <Mail size={10} strokeWidth={2} className="flex-none text-brand" aria-hidden />
                <span className="truncate">{p.email}</span>
              </span>
            )}
          </p>
        )}
      </div>

      {p.url && (
        <ChevronRight
          size={16}
          strokeWidth={2}
          aria-hidden
          className="flex-none self-center text-fg-muted motion-safe:transition-transform motion-safe:duration-150 group-hover:translate-x-1 group-hover:text-brand"
        />
      )}
    </>
  )

  // Full border (not a side-stripe) shifts to brand on hover, with a faint brand
  // wash. 150ms quick ease. Compliant left-edge reading anchor.
  const className =
    `group flex items-center ${pad} ${rowBg} border border-fg/10 ` +
    'transition-[background-color,border-color] duration-150 ease-[var(--ot-ease-quick)] ' +
    'hover:border-brand/60 hover:bg-brand/[0.04]'

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
