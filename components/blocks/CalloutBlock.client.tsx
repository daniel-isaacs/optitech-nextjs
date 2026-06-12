'use client'

import { useState, useEffect, useRef } from 'react'
import { cn }           from '@/lib/utils'
import { ICON_REGISTRY } from '@/components/icons/iconRegistry'
import { X, ArrowRight } from 'lucide-react'
import type { CalloutStyleOptions, CalloutIntent } from '@/cms/styling/OT_CalloutBlock.styling'
import type { CalloutBlockProps } from './CalloutBlock'

// ─── Intent token helpers ─────────────────────────────────────────────────────

function iVar(intent: CalloutIntent, suffix: string): string {
  return `var(--ot-intent-${intent}-${suffix})`
}

// ─── ARIA role ────────────────────────────────────────────────────────────────

function ariaRole(intent: CalloutIntent): 'alert' | 'status' | undefined {
  if (intent === 'danger' || intent === 'warning') return 'alert'
  if (intent === 'info'   || intent === 'success') return 'status'
  return undefined
}

// ─── Dismiss phase ────────────────────────────────────────────────────────────

type DismissPhase = 'visible' | 'sweeping' | 'collapsing' | 'gone'

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalloutBlockClient({
  heading,
  body,
  ctaLabel,
  ctaUrl,
  styleOptions = {},
}: CalloutBlockProps) {
  const {
    intent      = 'info',
    variant     = 'filled',
    size        = 'default',
    alignment   = 'left',
    dismissible = false,
    sticky      = false,
    icon        = 'none',
  } = styleOptions as CalloutStyleOptions

  const [phase,         setPhase]         = useState<DismissPhase>('visible')
  const [reducedMotion, setReducedMotion] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => () => { timersRef.current.forEach(clearTimeout) }, [])

  function handleDismiss() {
    if (reducedMotion) { setPhase('gone'); return }
    setPhase('sweeping')
    timersRef.current = [
      setTimeout(() => setPhase('collapsing'), 220),
      setTimeout(() => setPhase('gone'),       510),
    ]
  }

  if (phase === 'gone') return null

  const IconComp = (icon && icon !== 'none') ? ICON_REGISTRY[icon] : null
  const isBrand  = intent === 'brand'
  const isBar    = variant === 'bar'
  const role     = ariaRole(intent)

  const fg     = iVar(intent, 'fg')
  const bg     = iVar(intent, 'bg')
  const border = iVar(intent, 'border')

  // ── Dismiss animation wrappers ────────────────────────────────────────────
  // Two-phase exit: content sweeps right+fades (220ms), then height collapses (280ms).
  const outerWrapStyle: React.CSSProperties = dismissible ? {
    display:          'grid',
    gridTemplateRows: phase === 'collapsing' ? '0fr' : '1fr',
    overflow:         'hidden',
    ...(phase === 'collapsing' && {
      transition: 'grid-template-rows 280ms cubic-bezier(0.25, 1, 0.5, 1)',
    }),
  } : {}

  const sweepStyle: React.CSSProperties = phase === 'sweeping' ? {
    opacity:    0,
    transform:  'translateX(1.5rem)',
    transition: 'opacity 220ms cubic-bezier(0.25, 1, 0.5, 1), transform 220ms cubic-bezier(0.25, 1, 0.5, 1)',
  } : {}

  // ── Root visual styles ────────────────────────────────────────────────────
  let rootStyle: React.CSSProperties = {}
  let rootClass = ''

  if (variant === 'filled') {
    if (isBrand) {
      rootClass = 'bg-brand-fill'
    } else {
      rootStyle = { background: bg, border: `1px solid ${border}` }
    }
  } else if (variant === 'bordered') {
    rootStyle = { background: 'var(--ot-surface)', borderTop: `3px solid ${fg}` }
  } else {
    // bar
    if (isBrand) {
      rootClass = 'bg-brand-fill'
      rootStyle = { borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }
    } else {
      rootStyle = { background: bg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }
    }
  }

  // ── Padding ───────────────────────────────────────────────────────────────
  const padClass = isBar
    ? (size === 'compact' ? 'px-md py-xs' : 'px-md py-sm')
    : (size === 'compact' ? 'px-md py-sm' : 'px-md py-md')

  // ── Text colors ───────────────────────────────────────────────────────────
  const headingClass = isBrand ? 'text-fg-on-brand' : 'text-fg'
  const bodyClass    = isBrand ? 'text-fg-on-brand/80' : 'text-fg-muted'

  // ── Dismiss button ────────────────────────────────────────────────────────
  const dismissBtn = dismissible ? (
    <button
      onClick={handleDismiss}
      aria-label="Dismiss"
      style={{ color: fg, borderColor: border } as React.CSSProperties}
      className={cn(
        'shrink-0 rounded-full border flex items-center justify-center cursor-pointer',
        'transition-colors hover:bg-fg/5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand outline-none',
        isBar ? 'size-6' : 'size-7',
      )}
    >
      <X size={isBar ? 12 : 14} strokeWidth={2} aria-hidden />
    </button>
  ) : null

  // ── CTA ───────────────────────────────────────────────────────────────────
  const ctaEl = ctaLabel && ctaUrl ? (
    <a
      href={ctaUrl}
      style={{ color: fg }}
      className={cn(
        'flex items-center gap-xs text-label font-semibold hover:underline underline-offset-2 shrink-0',
        alignment === 'center' && !isBar ? 'self-center' : 'self-start',
      )}
    >
      {ctaLabel}
      <ArrowRight size={isBar ? 12 : 13} strokeWidth={2} aria-hidden />
    </a>
  ) : null

  // ── Bar variant ───────────────────────────────────────────────────────────
  if (isBar) {
    const barContent = (
      <div
        className={cn(
          'w-full flex items-center gap-sm',
          padClass,
          rootClass,
          sticky && 'fixed top-0 left-0 right-0 z-50',
        )}
        style={rootStyle}
        role={role}
        data-theme={isBrand ? 'dark' : undefined}
      >
        {/* Left: icon + heading */}
        <div className={cn('flex items-center gap-sm flex-1 min-w-0', alignment === 'center' && 'justify-center')}>
          {IconComp && (
            <IconComp size={16} strokeWidth={1.75} aria-hidden style={{ color: fg, flexShrink: 0 }} />
          )}
          <p className={cn('text-label font-semibold', headingClass)}>{heading}</p>
        </div>
        {/* Right: cta + dismiss */}
        {(ctaEl || dismissBtn) && (
          <div className="flex items-center gap-sm shrink-0">
            {ctaEl}
            {dismissBtn}
          </div>
        )}
      </div>
    )

    if (!dismissible) return barContent
    return (
      <div style={outerWrapStyle}>
        <div style={{ minHeight: 0 }}>
          <div style={sweepStyle}>{barContent}</div>
        </div>
      </div>
    )
  }

  // ── Filled / Bordered variants ────────────────────────────────────────────
  const isCompactRow = size === 'compact' && !body

  const innerContent = isCompactRow ? (
    // Single-row compact: [icon] [heading] ·· [cta]
    <div className={cn('flex items-center gap-sm', alignment === 'center' && 'justify-center')}>
      {IconComp && (
        <IconComp size={16} strokeWidth={1.75} aria-hidden style={{ color: fg, flexShrink: 0 }} />
      )}
      <p className={cn('text-body font-semibold leading-snug flex-1', headingClass)}>{heading}</p>
      {ctaEl && <div className="ml-auto pl-sm shrink-0">{ctaEl}</div>}
    </div>
  ) : (
    // Stacked: heading, body, cta
    <div className="flex flex-col gap-xs">
      <div className={cn('flex items-center gap-sm', alignment === 'center' && 'justify-center')}>
        {IconComp && (
          <IconComp size={16} strokeWidth={1.75} aria-hidden style={{ color: fg, flexShrink: 0 }} />
        )}
        <p className={cn('text-body font-semibold leading-snug', headingClass)}>{heading}</p>
      </div>
      {body && (
        <p className={cn('text-body leading-body text-pretty', bodyClass, alignment === 'center' && 'text-center')}>
          {body}
        </p>
      )}
      {ctaEl && (
        <div className={cn('mt-xs', alignment === 'center' && 'flex justify-center')}>
          {ctaEl}
        </div>
      )}
    </div>
  )

  const calloutContent = (
    <div
      className={cn(
        'w-full flex gap-sm',
        padClass,
        rootClass,
        isCompactRow ? 'items-center' : 'items-start',
      )}
      style={rootStyle}
      role={role}
      data-theme={isBrand ? 'dark' : undefined}
    >
      <div className="flex-1 min-w-0">{innerContent}</div>
      {dismissBtn && <div className={cn('shrink-0', !isCompactRow && 'mt-[2px]')}>{dismissBtn}</div>}
    </div>
  )

  if (!dismissible) return calloutContent
  return (
    <div style={outerWrapStyle}>
      <div style={{ minHeight: 0 }}>
        <div style={sweepStyle}>{calloutContent}</div>
      </div>
    </div>
  )
}
