'use client'

/**
 * LaserSignature
 *
 * Renders the attribution name as two stacked SVG <text> layers:
 *
 *   ls-glow — wider stroke + triple drop-shadow filter (the laser beam)
 *               animates laserDraw then fades after the etch completes
 *   ls-line — 0.7px crisp stroke (the incised groove)
 *               animates laserDraw then fills to a ghost tint via @property
 *
 * Trigger: IntersectionObserver at threshold 0.5 → sets data-active.
 * Prefers-reduced-motion: sets data-static immediately, CSS shows static text.
 *
 * stroke-dasharray is fixed at 5000 — enough for any attribution name.
 */

import { useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  name:      string
  color:     'none' | 'brand' | 'canvas' | 'surface'
  /** Optimizely edit-mode attrs forwarded from the parent pa() call */
  epiProps?: { 'data-epi-property-name'?: string }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LaserSignature({ name, color, epiProps }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // Reduced-motion path: reveal statically, no beam draw
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      svg.dataset.static = 'true'
      return
    }

    // Kinetic path: watch for viewport entry, then fire the laser
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          svg.dataset.active = 'true'
          io.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    io.observe(svg)
    return () => io.disconnect()
  }, [])

  return (
    <span
      className="block"
      role="text"
      aria-label={name}
      {...epiProps}
    >
      <svg
        ref={svgRef}
        aria-hidden="true"
        className={`laser-sig${color === 'brand' ? ' laser-sig--brand' : ''}`}
        style={{ display: 'block', width: '100%', height: '1.4em', overflow: 'visible' }}
      >
        {/* Glow layer — drawn alongside the line, then fades out */}
        <text className="ls-glow" x="0" y="1em">{name}</text>
        {/* Etched line — persists; fill-opacity rises on completion */}
        <text className="ls-line" x="0" y="1em">{name}</text>
      </svg>
    </span>
  )
}
