'use client'

/**
 * LaserSignature
 *
 * Renders the attribution name as a large thin-pen SVG signature that appears
 * to be signed by a laser — the beam writes each letterform in real time as you
 * scroll to the block.
 *
 * Font: Caveat 400 — thin handwriting strokes, non-calligraphic, reads as a
 * genuine personal signature rather than decorative script.
 *
 * Animation sequence (fires when 40% of the wrapper enters the viewport):
 *
 *   0ms    Separator rule scores left→right (180ms scaleX, ease-out)
 *   180ms  Laser begins signing:
 *            • stroke-dashoffset draws the letterforms (2.4s kinetic ease)
 *            • White-hot tip circle traverses via Web Animations API (same curve)
 *   2580ms Glow layers fade as beam shuts off (0.9s + 1.1s)
 *   2580ms Incision fill rises via @property --ls-fill-a (0.9s)
 *
 * Layer stack (SVG, bottom → top):
 *   ls-bloom  very wide blurred stroke — diffuse energy halo
 *   ls-glow   medium stroke + 5-stop drop-shadow chain — the beam
 *   ls-line   thin crisp stroke — the permanent etched mark
 *   ls-tip    circle driven by Web Animations API — the white-hot cut point
 *
 * Caveat 400 has naturally thin strokes; the laser glow-to-line contrast is
 * dramatic because the etched groove is delicate and the bloom is wide.
 *
 * prefers-reduced-motion: data-static reveals everything instantly, no beam.
 */

import { useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  name:      string
  color:     'none' | 'brand' | 'canvas' | 'surface'
  epiProps?: { 'data-epi-property-name'?: string }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LaserSignature({ name, color, epiProps }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<SVGTextElement>(null)
  const tipRef  = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const line = lineRef.current
    const tip  = tipRef.current
    if (!wrap || !line || !tip) return

    // Reduced-motion: no animation, reveal everything statically
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrap.dataset.static = 'true'
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()

        // Measure text BEFORE activating CSS. getBBox() needs the element
        // to be rendered with the actual font loaded — Caveat uses display:swap
        // so we defer by one rAF to ensure the font has applied.
        requestAnimationFrame(() => {
          const bbox = line.getBBox()

          // Guard against degenerate bbox (font not yet loaded)
          if (bbox.width < 10) {
            wrap.dataset.static = 'true'
            return
          }

          const tipY = bbox.y + bbox.height * 0.44  // near cap-height

          // Position tip at the very start of the letterforms
          tip.setAttribute('cx', String(bbox.x))
          tip.setAttribute('cy', String(tipY))
          tip.setAttribute('r',  String(Math.max(2.5, bbox.height * 0.10)))

          // Animate tip across the signature width, synchronized with the
          // stroke-dashoffset draw (same easing + duration + delay)
          tip.animate(
            [
              { transform: 'translateX(0px)',              opacity: '0.9' },
              { transform: `translateX(${bbox.width * 0.78}px)`, opacity: '0.9', offset: 0.78 },
              { transform: `translateX(${bbox.width}px)`,  opacity: '0' },
            ],
            {
              duration: 2400,
              delay:    180,     // matches CSS animation-delay on ls-* layers
              easing:   'cubic-bezier(0.16, 1, 0.3, 1)',
              fill:     'forwards',
            }
          )

          // Trigger the CSS rule draw + stroke animations
          wrap.dataset.active = 'true'
        })
      },
      { threshold: 0.4 }
    )
    io.observe(wrap)
    return () => io.disconnect()
  }, [])

  const isBrand = color === 'brand'

  return (
    <span
      ref={wrapRef}
      className={`ls-wrap${isBrand ? ' ls-wrap--brand' : ''}`}
      role="text"
      aria-label={name}
      {...epiProps}
    >
      {/* Separator rule: laser scores this line before signing begins */}
      <span className="ls-rule" aria-hidden="true" />

      {/* Signature SVG */}
      <svg
        aria-hidden="true"
        className={`ls-svg${isBrand ? ' ls-svg--brand' : ''}`}
        style={{ display: 'block', width: '100%', overflow: 'visible' }}
      >
        {/* Bloom: wide halo stroke, CSS blur — outer energy field */}
        <text className="ls-bloom" x="0" y="1em">{name}</text>
        {/* Glow: the laser beam — 5-stop drop-shadow chain */}
        <text className="ls-glow"  x="0" y="1em">{name}</text>
        {/* Etch: crisp thin line that remains after beam shuts off */}
        <text ref={lineRef} className="ls-line" x="0" y="1em">{name}</text>
        {/* Hot tip: positioned + animated by JS via Web Animations API */}
        <circle ref={tipRef} className="ls-tip" cx="-60" cy="-60" r="3" />
      </svg>
    </span>
  )
}
