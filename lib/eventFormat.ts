/**
 * lib/eventFormat.ts
 *
 * Pure, dependency-free formatting helpers for events. Deliberately contains NO
 * server imports (no getClient, no @optimizely/cms-sdk) so it is safe to import
 * from both the server page component (components/pages/EventPage.tsx) and the
 * client listing block (components/blocks/EventListingBlock.client.tsx) without
 * pulling server-only code into the client bundle.
 *
 * This is the single source of truth for event date logic — do not duplicate it.
 */

// ── Type / credit / location vocabularies ──────────────────────────────────────

export const EVENT_TYPE_LABELS: Record<string, string> = {
  webinar:    'Webinar',
  conference: 'Conference',
  workshop:   'Workshop',
  seminar:    'Seminar',
  community:  'Community Event',
  screening:  'Health Screening',
  training:   'Training',
}

export function eventTypeLabel(type?: string | null): string {
  if (!type) return ''
  return EVENT_TYPE_LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
}

export const LOCATION_TYPE_LABELS: Record<string, string> = {
  inPerson: 'In Person',
  virtual:  'Virtual',
  hybrid:   'Hybrid',
}

export function locationTypeLabel(type?: string | null): string {
  if (!type) return ''
  return LOCATION_TYPE_LABELS[type] ?? type
}

/**
 * Human-readable location line: prefers "Venue · City" for in-person/hybrid,
 * falls back to the venue or the location-type label. Returns '' when nothing
 * meaningful is set.
 */
export function formatEventLocation(opts: {
  locationType?: string | null
  venueName?:    string | null
  city?:         string | null
}): string {
  const { locationType, venueName, city } = opts
  if (locationType === 'virtual') return venueName || 'Virtual'
  const parts = [venueName, city].filter(Boolean) as string[]
  if (parts.length) return parts.join(' · ')
  return locationTypeLabel(locationType)
}

// ── Date helpers ────────────────────────────────────────────────────────────────

function toDate(iso?: string | null): Date | null {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

/** Midnight (local) of the given date — used for day-granular comparisons. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/**
 * True when the event's start (or end, for multi-day events) is today or later.
 * Day-granular: an event earlier today still counts as upcoming until midnight.
 */
export function isUpcoming(startIso?: string | null, endIso?: string | null, now: Date = new Date()): boolean {
  const ref   = startOfDay(now)
  const end   = toDate(endIso)
  const start = toDate(startIso)
  const compare = end ?? start
  if (!compare) return false
  return startOfDay(compare).getTime() >= ref.getTime()
}

/**
 * Full date for a single event. Honours an end date on the same day (time range)
 * or a different day (date range).
 *
 *   formatEventDate('2026-07-14T16:00:00Z')                              → "July 14, 2026"
 *   formatEventDate('2026-07-14T16:00:00Z', '2026-07-14T17:30:00Z')      → "July 14, 2026 · 4:00 – 5:30 PM"  (when withTime)
 *   formatEventDate('2026-07-14T16:00:00Z', '2026-07-16T16:00:00Z')      → "July 14 – 16, 2026"
 */
export function formatEventDate(
  startIso?: string | null,
  endIso?: string | null,
  opts: { withTime?: boolean; locale?: string } = {},
): string {
  const { withTime = false, locale } = opts
  const start = toDate(startIso)
  if (!start) return ''
  const end = toDate(endIso)

  const dateFmt = (d: Date, withYear: boolean) =>
    new Intl.DateTimeFormat(locale, {
      month: 'long', day: 'numeric', ...(withYear ? { year: 'numeric' } : {}),
    }).format(d)

  const timeFmt = (d: Date) =>
    new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(d)

  // Multi-day range
  if (end && startOfDay(end).getTime() !== startOfDay(start).getTime()) {
    const sameYear = start.getFullYear() === end.getFullYear()
    return `${dateFmt(start, !sameYear)} – ${dateFmt(end, true)}`
  }

  const base = dateFmt(start, true)
  if (!withTime) return base

  // Same-day with a time (and optional end time)
  if (end) return `${base} · ${timeFmt(start)} – ${timeFmt(end)}`
  return `${base} · ${timeFmt(start)}`
}

/** Time-only label, e.g. "4:00 PM". Empty string when no start time. */
export function formatEventTime(startIso?: string | null, endIso?: string | null, locale?: string): string {
  const start = toDate(startIso)
  if (!start) return ''
  const timeFmt = (d: Date) =>
    new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(d)
  const end = toDate(endIso)
  return end ? `${timeFmt(start)} – ${timeFmt(end)}` : timeFmt(start)
}

/** Parts for a calendar-style date block: { month: "JUL", day: "14", weekday: "TUE" }. */
export function eventDateBlock(startIso?: string | null, locale?: string): { month: string; day: string; weekday: string } | null {
  const start = toDate(startIso)
  if (!start) return null
  return {
    month:   new Intl.DateTimeFormat(locale, { month: 'short' }).format(start).toUpperCase(),
    day:     new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(start),
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(start).toUpperCase(),
  }
}

/** Credit label, e.g. "1.5 CLE". Empty when no credit. */
export function formatCredit(creditType?: string | null, creditHours?: number | null): string {
  if (!creditType || creditType === 'none') return ''
  const hrs = typeof creditHours === 'number' && creditHours > 0
    ? `${Number.isInteger(creditHours) ? creditHours : creditHours.toFixed(1)} `
    : ''
  return `${hrs}${creditType}`
}
