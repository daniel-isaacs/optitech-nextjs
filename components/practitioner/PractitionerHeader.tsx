import type { ComponentType, ReactNode } from 'react'
import { Phone, Mail, MapPin, Languages } from 'lucide-react'
import type { PractitionerData } from '@/lib/practitioners'
import {
  practitionerInitials,
  practitionerName,
  primaryArea,
  parseLanguages,
} from '@/lib/practitionerFormat'
import Headshot from './Headshot'

type PreviewAttrs = (field: string) => Record<string, unknown>

// lucide-react in this project predates the LinkedIn brand glyph, so inline a
// minimal mark with the same prop shape as a lucide icon.
function LinkedInIcon({ size = 14, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.32 8.06h4.34V24H.32V8.06Zm7.13 0h4.16v2.18h.06c.58-1.1 2-2.26 4.12-2.26 4.4 0 5.22 2.9 5.22 6.67V24h-4.34v-7.06c0-1.68-.03-3.85-2.35-3.85-2.35 0-2.71 1.84-2.71 3.73V24H7.45V8.06Z" />
    </svg>
  )
}

type Props = {
  practitioner: PractitionerData
  /** Page-level contextual badge — "Accepting New Patients", etc. */
  profileLabel?: string
  /** Preview-attribute factory from getPreviewUtils — server context only. */
  pa?: PreviewAttrs
}

// ─── Contact item ───────────────────────────────────────────────────────────────

function ContactItem({
  icon: Icon,
  href,
  children,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  href?: string
  children: ReactNode
}) {
  const inner = (
    <span className="inline-flex items-center gap-xs text-fg-muted">
      <Icon size={14} strokeWidth={1.75} className="flex-none text-brand" aria-hidden />
      <span className="font-mono text-xs tracking-tight">{children}</span>
    </span>
  )
  return href ? (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {inner}
    </a>
  ) : (
    inner
  )
}

// ─── Header ─────────────────────────────────────────────────────────────────────
//
// The locked profile header. Rendered by the slug route OUTSIDE the Visual
// Builder composition, so editors can never move or delete it and it always
// reflects the referenced practitioner record. Editorial split: a brand-filled
// portrait panel anchors the left; the identity statement sits on canvas to the
// right. Stacks on narrow viewports.

export default function PractitionerHeader({ practitioner, profileLabel, pa }: Props) {
  const p = practitioner
  const name      = practitionerName(p, true)
  const initials  = practitionerInitials(p)
  const primary   = primaryArea(p.practiceAreas)
  const languages = parseLanguages(p.languages)

  const hasContact = !!(p.phone || p.email || p.officeLocation || p.linkedIn || languages.length)

  return (
    <header className="bg-canvas border-b border-fg/10">
      <div className="mx-auto max-w-6xl px-md lg:px-xl py-xl lg:py-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-lg lg:gap-xl items-stretch">

          {/* ── Portrait panel — brand-filled ground (committed color) ── */}
          <div className="relative bg-brand flex items-center justify-center p-md sm:p-lg lg:p-xl">
            {/* subtle layered depth: an inner bloom halo behind the portrait */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(120% 90% at 50% 0%, oklch(from var(--ot-brand) calc(l + 0.06) c h / 0.6), transparent 70%)' }}
            />
            <div className="relative w-full max-w-[18rem] lg:max-w-none">
              <Headshot
                variant="header"
                src={p.headshotUrl}
                initials={initials}
                alt={name ? `Portrait of ${name}` : 'Practitioner portrait'}
                fieldAttrs={pa?.('practitionerRef')}
              />
            </div>
          </div>

          {/* ── Identity ── */}
          <div className="flex flex-col justify-center min-w-0">
            {/* Profile label badge — reserves no space when absent */}
            {profileLabel && (
              <span
                className="self-start mb-md inline-flex items-center bg-accent text-fg-on-accent px-sm py-1 text-label uppercase tracking-label font-semibold"
                {...pa?.('profileLabel')}
              >
                {profileLabel}
              </span>
            )}

            {/* Name — the single Syne accent moment per the type system */}
            <h1
              className="text-fg text-balance leading-[0.95] text-[clamp(2.25rem,5vw,3.75rem)]"
              style={{ fontFamily: 'var(--font-syne)', fontWeight: 'var(--font-weight-syne)', letterSpacing: '-0.02em' }}
            >
              {name || 'Practitioner'}
            </h1>

            {/* Credentials */}
            {p.credentials && (
              <p className="mt-sm text-label uppercase tracking-label font-semibold text-brand">
                {p.credentials}
              </p>
            )}

            {/* Title */}
            {p.title && (
              <p className="mt-md text-title leading-title font-semibold text-fg">{p.title}</p>
            )}

            {/* Primary practice area + facility */}
            {primary && (
              <p className="mt-xs text-body text-fg-muted text-pretty">
                <span className="text-fg">{primary.areaName}</span>
                {primary.facility && (
                  <>
                    <span className="mx-xs text-fg-muted/50" aria-hidden>—</span>
                    {primary.facility}
                  </>
                )}
              </p>
            )}

            {/* Contact — present but quiet */}
            {hasContact && (
              <div className="mt-lg pt-md border-t border-fg/10 flex flex-wrap gap-x-lg gap-y-sm">
                {p.phone && (
                  <ContactItem icon={Phone} href={`tel:${p.phone.replace(/[^\d+]/g, '')}`}>
                    {p.phone}
                  </ContactItem>
                )}
                {p.email && (
                  <ContactItem icon={Mail} href={`mailto:${p.email}`}>
                    {p.email}
                  </ContactItem>
                )}
                {p.officeLocation && <ContactItem icon={MapPin}>{p.officeLocation}</ContactItem>}
                {languages.length > 0 && (
                  <ContactItem icon={Languages}>{languages.join(', ')}</ContactItem>
                )}
                {p.linkedIn && (
                  <ContactItem icon={LinkedInIcon} href={p.linkedIn}>
                    LinkedIn
                  </ContactItem>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
