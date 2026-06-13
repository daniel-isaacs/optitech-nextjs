import { cn } from '@/lib/utils'
import type {
  DividerStyleOptions,
  DividerTone,
  DividerOrnament,
  DividerWeight,
} from '@/cms/styling/OT_DividerBlock.styling'

export type DividerBlockProps = {
  label?:        string
  styleOptions?: Partial<DividerStyleOptions>
}

// ─── Spacing → responsive vertical padding ─────────────────────────────────────
// Symmetric padding-block is the gap the divider opens between the sections it
// sits between. clamp() scales the breathing room down on narrow viewports so a
// divider never eats half a phone screen.

const SPACE_PAD: Record<DividerStyleOptions['space'], string> = {
  sm: 'clamp(1.5rem, 3vw, 2rem)',
  md: 'clamp(2.5rem, 5vw, 4rem)',
  lg: 'clamp(4rem, 7vw, 6rem)',
  xl: 'clamp(5.5rem, 9vw, 8rem)',
}

// ─── Tone → token-resolved color ───────────────────────────────────────────────
// Never a literal. Neutral derives a low-alpha line from --ot-fg via relative
// color syntax; brand / accent reference the committed tokens; spectrum and
// aurora blend the two. Everything recalibrates under a CMS theme override.

// Line / hairline fill for the text mark — solid for single tones, a horizontal
// gradient for the blends.
function lineBg(tone: DividerTone): string {
  switch (tone) {
    case 'brand':    return 'var(--ot-brand)'
    case 'accent':   return 'var(--ot-accent)'
    case 'spectrum': return 'linear-gradient(to right, var(--ot-brand), var(--ot-accent))'
    case 'aurora':   return 'linear-gradient(to right, var(--ot-brand), var(--ot-accent), var(--ot-brand))'
    case 'neutral':
    default:         return 'oklch(from var(--ot-fg) l c h / 0.22)'
  }
}

// Horizontal color blend shared by the waterfall bleed and the angled gradient.
function colorBlend(tone: DividerTone): string {
  switch (tone) {
    case 'brand':    return 'linear-gradient(100deg, oklch(from var(--ot-brand) calc(l + 0.08) c h), var(--ot-brand))'
    case 'accent':   return 'linear-gradient(100deg, var(--ot-accent), oklch(from var(--ot-accent) calc(l - 0.08) c h))'
    case 'spectrum': return 'linear-gradient(100deg, var(--ot-brand), var(--ot-accent))'
    case 'aurora':   return 'linear-gradient(100deg, var(--ot-brand) 0%, var(--ot-accent) 50%, var(--ot-brand) 100%)'
    case 'neutral':
    default:         return 'linear-gradient(100deg, oklch(from var(--ot-fg) l c h / 0.12), oklch(from var(--ot-fg) l c h / 0.22))'
  }
}

// Bloom token for the angled gradient's depth glow.
function bloom(tone: DividerTone): string {
  return tone === 'accent' ? 'var(--ot-bloom-accent-faint)' : 'var(--ot-bloom-brand-faint)'
}

const MARK_TEXT: Record<DividerTone, string> = {
  neutral:  'text-fg-muted',
  brand:    'text-brand',
  accent:   'text-accent',
  spectrum: 'text-brand',
  aurora:   'text-accent',
}

const ORNAMENT_GLYPH: Record<Exclude<DividerOrnament, 'none'>, string> = {
  pendant:  '❧',
  asterism: '⁂',
  dot:      '•',
}

const PRISM_HEIGHT: Record<DividerWeight, string> = {
  slim: 'clamp(16px, 2.2vw, 26px)',
  bold: 'clamp(40px, 5vw, 60px)',
}

// Feathered top/bottom edges so each band reads as a defined bar, not a rectangle.
const PRISM_MASK     = 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)'
// Waterfall: full at the top, dissolving to nothing at the very bottom.
const WATERFALL_MASK = 'linear-gradient(to bottom, transparent 0%, black 6%, black 16%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.18) 76%, transparent 100%)'

export default function DividerBlock({ label, styleOptions = {} }: DividerBlockProps) {
  const {
    style    = 'mark',
    space    = 'lg',
    tone     = 'neutral',
    ornament = 'pendant',
    weight   = 'slim',
  } = styleOptions as DividerStyleOptions

  const trimmedLabel = label?.trim() || ''

  let inner: React.ReactNode = null

  // ── Centered text mark ────────────────────────────────────────────────────────
  if (style === 'mark') {
    const hasMark = trimmedLabel !== '' || ornament !== 'none'
    const glyph   = ornament !== 'none' ? ORNAMENT_GLYPH[ornament] : null
    const bg      = lineBg(tone)

    if (!hasMark) {
      // Graceful fallback: a single continuous centered hairline, never a broken gap.
      inner = (
        <span
          className="ot-divider-line block w-full"
          style={{ height: '1px', background: bg, transformOrigin: 'center' }}
        />
      )
    } else {
      inner = (
        <div className="flex items-center gap-md w-full">
          <span className="ot-divider-line flex-1" style={{ height: '1px', background: bg, transformOrigin: 'right' }} />
          <span className={cn('ot-divider-mark flex items-baseline', MARK_TEXT[tone])}>
            {trimmedLabel ? (
              <span className="text-label tracking-label uppercase font-semibold">{trimmedLabel}</span>
            ) : (
              <span aria-hidden className="select-none" style={{ fontSize: '1.5rem', lineHeight: 1, opacity: 0.9 }}>
                {glyph}
              </span>
            )}
          </span>
          <span className="ot-divider-line flex-1" style={{ height: '1px', background: bg, transformOrigin: 'left' }} />
        </div>
      )
    }
  }

  // ── Gradient bleed · waterfall ──────────────────────────────────────────────────
  // A blended color band that pours from the top and dissolves to nothing at the
  // bottom — full width. The horizontal blend carries the tone; the vertical mask
  // does the falling.
  else if (style === 'bleed') {
    inner = (
      <span
        className="ot-divider-bleed block w-full"
        aria-hidden
        style={{
          height: 'clamp(90px, 14vw, 168px)',
          transformOrigin: 'center',
          background: colorBlend(tone),
          WebkitMaskImage: WATERFALL_MASK,
          maskImage: WATERFALL_MASK,
        }}
      />
    )
  }

  // ── Angled gradient · faceted ribbon ────────────────────────────────────────────
  // The footer's move, turned on its side: a blended color bar overlaid with
  // diagonal facets (a light sheen pass + a darker depth pass), feathered at the
  // top and bottom, with a drop-shadow that follows the masked alpha for soft
  // chromatic depth.
  else {
    const facetSheen = 'repeating-linear-gradient(122deg, transparent 0px, oklch(from var(--ot-fg) l c h / 0.13) 7px, transparent 15px, transparent 34px)'
    const facetDepth = 'repeating-linear-gradient(122deg, transparent 0px, oklch(from var(--ot-canvas) l c h / 0.32) 18px, transparent 30px, transparent 52px)'
    inner = (
      <span
        className="ot-divider-line block w-full"
        aria-hidden
        style={{
          height: PRISM_HEIGHT[weight],
          transformOrigin: 'center',
          background: [facetSheen, facetDepth, colorBlend(tone)].join(', '),
          WebkitMaskImage: PRISM_MASK,
          maskImage: PRISM_MASK,
          filter: `drop-shadow(0 2px 16px ${bloom(tone)})`,
        }}
      />
    )
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label={style === 'mark' && trimmedLabel ? trimmedLabel : undefined}
      className="flex w-full items-center justify-center"
      style={{ paddingBlock: SPACE_PAD[space] }}
    >
      {inner}
    </div>
  )
}
