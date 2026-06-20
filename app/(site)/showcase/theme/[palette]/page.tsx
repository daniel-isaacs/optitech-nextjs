import type { Metadata } from 'next'
import { notFound }       from 'next/navigation'
import { CopyButton }     from './CopyButton'

// ─── Palette definitions ──────────────────────────────────────────────────────

type PaletteField = {
  key:   string
  label: string
  value: string
  cssVar: string
}

type Palette = {
  slug:        string
  name:        string
  codename:    string
  vertical:    string
  description: string
  brandRationale: string
  accentRationale: string
  cornerStyle: string
  displayFont: string
  motionIntensity: string
  colors:      PaletteField[]
}

function makeColors(vals: Record<string, string>): PaletteField[] {
  const MAP: { key: string; label: string; cssVar: string }[] = [
    { key: 'colorBrand',        label: 'Brand',              cssVar: '--ot-brand'           },
    { key: 'colorBrandHover',   label: 'Brand hover',        cssVar: '--ot-brand-hover'     },
    { key: 'colorAccent',       label: 'Accent',             cssVar: '--ot-accent'          },
    { key: 'colorAccentHover',  label: 'Accent hover',       cssVar: '--ot-accent-hover'    },
    { key: 'colorFgOnAccent',   label: 'Fg on accent',       cssVar: '--ot-fg-on-accent'    },
    { key: 'colorCanvas',       label: 'Canvas (dark)',      cssVar: '--ot-canvas'          },
    { key: 'colorSurface',      label: 'Surface (dark)',     cssVar: '--ot-surface'         },
    { key: 'colorCanvasLight',  label: 'Canvas (light)',     cssVar: '--ot-canvas-light'    },
    { key: 'colorSurfaceLight', label: 'Surface (light)',    cssVar: '--ot-surface-light'   },
    { key: 'colorFgOnBrand',    label: 'Fg on brand',        cssVar: '--ot-fg-on-brand'     },
    { key: 'colorFg',           label: 'Fg (dark)',          cssVar: '--ot-fg'              },
    { key: 'colorFgLight',      label: 'Fg (light)',         cssVar: '--ot-fg-light'        },
    { key: 'colorFgMuted',      label: 'Fg muted (dark)',    cssVar: '--ot-fg-muted'        },
    { key: 'colorFgMutedLight', label: 'Fg muted (light)',   cssVar: '--ot-fg-muted-light'  },
  ]
  return MAP.map(m => ({ ...m, value: vals[m.key] ?? '' }))
}

const PALETTES: Palette[] = [
  {
    slug:     'tech',
    name:     'Indigo Stack',
    codename: 'Tech',
    vertical: 'Software & Infrastructure',
    description: 'Deep indigo brand against indigo-tinted dark surfaces. Signal green accent for interactive moments. The combination reads as precise and editorial rather than generic SaaS blue.',
    brandRationale:  'Indigo sits adjacent to blue on the hue wheel but reads as more intentional — closer to violet, further from the default SaaS reflex. At 52% lightness it fills large surfaces without muddying text.',
    accentRationale: 'Signal green (hue 145) provides maximum hue contrast against the indigo brand. At 78% lightness it is bright enough to function as a call-to-action marker without neon energy.',
    cornerStyle:    'soft',
    displayFont:    'spaceGrotesk',
    motionIntensity: 'default',
    colors: makeColors({
      colorBrand:        'oklch(52% 0.20 265)',
      colorBrandHover:   'oklch(38% 0.17 265)',
      colorAccent:       'oklch(78% 0.21 145)',
      colorAccentHover:  'oklch(64% 0.18 145)',
      colorFgOnAccent:   'oklch(11% 0.012 145)',
      colorCanvas:       'oklch(11% 0.018 265)',
      colorSurface:      'oklch(19% 0.026 265)',
      colorCanvasLight:  'oklch(97% 0.004 265)',
      colorSurfaceLight: 'oklch(93% 0.007 265)',
      colorFgOnBrand:    'oklch(97% 0.004 265)',
      colorFg:           'oklch(96% 0.005 265)',
      colorFgLight:      'oklch(11% 0.018 265)',
      colorFgMuted:      'oklch(66% 0.06 265)',
      colorFgMutedLight: 'oklch(38% 0.05 265)',
    }),
  },
  {
    slug:     'healthcare',
    name:     'Garnet Sage',
    codename: 'Healthcare',
    vertical: 'Health Systems & Clinical Care',
    description: 'Deep rose-burgundy brand against near-black surfaces with a rose undertone. Sage green accent — calm and natural, not mint-clinical. Warmth and gravitas without sentimentality.',
    brandRationale:  'Rose-burgundy (hue 355, 45% lightness) reads as serious and human rather than playful pink. It avoids the teal-on-white cliché entirely and communicates care without the sterility of clinical white.',
    accentRationale: 'Sage green (hue 165) is muted enough to feel natural rather than energetic. It echoes healing and nature without defaulting to the over-used mint palette that dominates health tech.',
    cornerStyle:    'rounded',
    displayFont:    'syne',
    motionIntensity: 'calm',
    colors: makeColors({
      colorBrand:        'oklch(45% 0.14 355)',
      colorBrandHover:   'oklch(33% 0.11 355)',
      colorAccent:       'oklch(70% 0.14 165)',
      colorAccentHover:  'oklch(56% 0.12 165)',
      colorFgOnAccent:   'oklch(11% 0.008 165)',
      colorCanvas:       'oklch(11% 0.010 355)',
      colorSurface:      'oklch(19% 0.014 355)',
      colorCanvasLight:  'oklch(98% 0.003 355)',
      colorSurfaceLight: 'oklch(93% 0.005 355)',
      colorFgOnBrand:    'oklch(98% 0.003 355)',
      colorFg:           'oklch(97% 0.003 355)',
      colorFgLight:      'oklch(11% 0.010 355)',
      colorFgMuted:      'oklch(64% 0.05 355)',
      colorFgMutedLight: 'oklch(38% 0.04 355)',
    }),
  },
  {
    slug:     'financial',
    name:     'Forest & Amber',
    codename: 'Financial Services',
    vertical: 'Asset Management & Financial Services',
    description: 'Deep forest green brand against forest-tinted near-black. Warm amber accent — earned warmth rather than ostentatious gold. Authority and measured confidence, not the navy-and-gold cliché.',
    brandRationale:  'Forest green (hue 148, 40% lightness) signals stability and measured authority. It reads as institutional without corporate stiffness and has no associations with the typical navy-and-gold financial palette.',
    accentRationale: 'Warm amber (hue 52) is adjacent to gold but sits closer to cognac — earned warmth rather than metallic opulence. At 73% lightness it is visible on dark surfaces without screaming for attention.',
    cornerStyle:    'sharp',
    displayFont:    'fraunces',
    motionIntensity: 'calm',
    colors: makeColors({
      colorBrand:        'oklch(40% 0.12 148)',
      colorBrandHover:   'oklch(28% 0.10 148)',
      colorAccent:       'oklch(73% 0.15 52)',
      colorAccentHover:  'oklch(59% 0.13 52)',
      colorFgOnAccent:   'oklch(10% 0.008 148)',
      colorCanvas:       'oklch(10% 0.008 148)',
      colorSurface:      'oklch(18% 0.014 148)',
      colorCanvasLight:  'oklch(97% 0.004 148)',
      colorSurfaceLight: 'oklch(92% 0.006 148)',
      colorFgOnBrand:    'oklch(97% 0.004 148)',
      colorFg:           'oklch(97% 0.003 148)',
      colorFgLight:      'oklch(10% 0.008 148)',
      colorFgMuted:      'oklch(65% 0.05 148)',
      colorFgMutedLight: 'oklch(36% 0.04 148)',
    }),
  },
]

const PALETTE_MAP = Object.fromEntries(PALETTES.map(p => [p.slug, p]))

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return PALETTES.map(p => ({ palette: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ palette: string }>
}): Promise<Metadata> {
  const { palette } = await params
  const p = PALETTE_MAP[palette]
  if (!p) return {}
  return { title: `${p.name} — Sample Themes — Showcase — OptiTech` }
}

// ─── Color swatch grid ────────────────────────────────────────────────────────

function SwatchGrid({ colors }: { colors: PaletteField[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-sm">
      {colors.map(c => (
        <div key={c.key} className="space-y-sm">
          <div
            className="w-full border border-fg/10"
            style={{ backgroundColor: c.value, height: '3.5rem' }}
          />
          <p className="text-label font-semibold text-fg leading-none">{c.label}</p>
          <p className="text-label font-mono text-fg-muted leading-none" style={{ fontSize: '0.65rem' }}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Live mini preview ────────────────────────────────────────────────────────

function MiniPreview({ palette: p }: { palette: Palette }) {
  const vars = Object.fromEntries(
    p.colors.map(c => [c.cssVar, c.value])
  ) as React.CSSProperties

  return (
    <div style={vars} className="border border-fg/10 overflow-hidden">
      {/* Hero strip */}
      <div
        className="flex flex-col gap-sm p-xl"
        style={{ backgroundColor: 'var(--ot-brand)', color: 'var(--ot-fg-on-brand)' }}
      >
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.6 }}>
          {p.vertical}
        </span>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.15 }}>
          {p.name} theme preview
        </p>
        <p style={{ opacity: 0.75, fontSize: '0.9rem', maxWidth: '32rem' }}>
          {p.description.split('.')[0]}.
        </p>
        <div className="flex gap-sm mt-sm">
          <span
            className="px-md py-sm text-label font-semibold"
            style={{ backgroundColor: 'var(--ot-accent)', color: 'var(--ot-fg-on-accent)' }}
          >
            Primary CTA
          </span>
          <span
            className="px-md py-sm text-label font-semibold"
            style={{ border: '1px solid var(--ot-fg-on-brand)', color: 'var(--ot-fg-on-brand)', opacity: 0.8 }}
          >
            Secondary
          </span>
        </div>
      </div>

      {/* Cards strip */}
      <div
        className="flex gap-md p-lg"
        style={{ backgroundColor: 'var(--ot-canvas)' }}
      >
        {[
          { heading: 'Core capability',    body: 'The foundational layer of everything we build — precision at every level.' },
          { heading: 'Extended platform',  body: 'Composable modules that adapt to how your teams actually work.' },
          { heading: 'Scale and support',  body: 'Infrastructure that grows without you noticing, supported 24/7.' },
        ].map((card, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col gap-sm p-md"
            style={{ backgroundColor: 'var(--ot-surface)', border: '1px solid color-mix(in oklch, var(--ot-fg) 10%, transparent)' }}
          >
            <p style={{ fontWeight: 700, color: 'var(--ot-fg)', fontSize: '0.95rem' }}>{card.heading}</p>
            <p style={{ color: 'var(--ot-fg-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>{card.body}</p>
            <span
              className="text-label font-semibold mt-auto"
              style={{ color: 'var(--ot-accent)', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              Learn more →
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Copy block ───────────────────────────────────────────────────────────────

function buildCmsFieldString(p: Palette): string {
  const lines = p.colors.map(c => `${c.key.padEnd(20)} ${c.value}`)
  lines.push('')
  lines.push(`cornerStyle          ${p.cornerStyle}`)
  lines.push(`displayFont          ${p.displayFont}`)
  lines.push(`motionIntensity      ${p.motionIntensity}`)
  return lines.join('\n')
}

function buildCssString(p: Palette): string {
  const lines = p.colors.map(c => `  ${c.cssVar.padEnd(24)} ${c.value};`)
  return `/* ${p.name} — ${p.vertical} */\n:root {\n${lines.join('\n')}\n}`
}

function CopyBlock({ palette: p }: { palette: Palette }) {
  const cmsText = buildCmsFieldString(p)
  const cssText = buildCssString(p)

  return (
    <div className="space-y-lg">

      {/* CMS fields */}
      <div className="space-y-sm">
        <div className="flex items-center justify-between">
          <p className="text-label tracking-label uppercase text-fg-muted font-semibold">
            ThemeManager field values
          </p>
          <CopyButton text={cmsText} label="Copy fields" />
        </div>
        <div className="bg-surface p-lg font-mono text-label text-fg-muted overflow-x-auto">
          {p.colors.map(c => (
            <div key={c.key} className="flex gap-xl">
              <span className="text-fg w-[180px] flex-none">{c.key}</span>
              <span>{c.value}</span>
            </div>
          ))}
          <div className="mt-md pt-md border-t border-fg/10 space-y-sm">
            <div className="flex gap-xl">
              <span className="text-fg w-[180px] flex-none">cornerStyle</span>
              <span>{p.cornerStyle}</span>
            </div>
            <div className="flex gap-xl">
              <span className="text-fg w-[180px] flex-none">displayFont</span>
              <span>{p.displayFont}</span>
            </div>
            <div className="flex gap-xl">
              <span className="text-fg w-[180px] flex-none">motionIntensity</span>
              <span>{p.motionIntensity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS variables */}
      <div className="space-y-sm">
        <div className="flex items-center justify-between">
          <p className="text-label tracking-label uppercase text-fg-muted font-semibold">
            Raw CSS custom properties
          </p>
          <CopyButton text={cssText} label="Copy CSS" />
        </div>
        <div className="bg-surface p-lg font-mono text-label text-fg-muted overflow-x-auto">
          <div className="text-fg-muted">{`/* ${p.name} — ${p.vertical} */`}</div>
          <div className="text-fg-muted">{`:root {`}</div>
          {p.colors.map(c => (
            <div key={c.key} className="pl-lg flex gap-xl">
              <span className="text-fg w-[200px] flex-none">{c.cssVar}</span>
              <span>{c.value};</span>
            </div>
          ))}
          <div className="text-fg-muted">{`}`}</div>
        </div>
      </div>

    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PalettePage({
  params,
}: {
  params: Promise<{ palette: string }>
}) {
  const { palette: slug } = await params
  const p = PALETTE_MAP[slug]
  if (!p) notFound()

  return (
    <div className="py-xl px-lg space-y-2xl">

      {/* Header */}
      <div className="max-w-[640px]">
        <p className="text-label tracking-label uppercase text-fg-muted font-semibold mb-sm">
          Sample Themes — {p.vertical}
        </p>
        <h1 className="text-headline font-bold leading-headline tracking-headline text-fg mb-md">
          {p.name}
        </h1>
        <p className="text-body leading-body text-fg-muted">{p.description}</p>
      </div>

      {/* Design rationale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl max-w-[56rem]">
        <div className="space-y-sm">
          <p className="text-label tracking-label uppercase text-fg-muted font-semibold">Brand color</p>
          <p className="text-body leading-body text-fg-muted">{p.brandRationale}</p>
        </div>
        <div className="space-y-sm">
          <p className="text-label tracking-label uppercase text-fg-muted font-semibold">Accent color</p>
          <p className="text-body leading-body text-fg-muted">{p.accentRationale}</p>
        </div>
      </div>

      {/* Swatch grid */}
      <div className="space-y-md">
        <p className="text-label tracking-label uppercase text-fg-muted font-semibold">Color tokens</p>
        <SwatchGrid colors={p.colors} />
      </div>

      {/* Live preview */}
      <div className="space-y-md">
        <p className="text-label tracking-label uppercase text-fg-muted font-semibold">Live preview</p>
        <MiniPreview palette={p} />
      </div>

      {/* Axis recommendations */}
      <div className="space-y-md">
        <p className="text-label tracking-label uppercase text-fg-muted font-semibold">Recommended axes</p>
        <div className="flex flex-wrap gap-md font-mono text-label">
          <div className="bg-surface px-md py-sm border border-fg/10">
            <span className="text-fg-muted">cornerStyle</span>
            <span className="text-fg ml-md">{p.cornerStyle}</span>
          </div>
          <div className="bg-surface px-md py-sm border border-fg/10">
            <span className="text-fg-muted">displayFont</span>
            <span className="text-fg ml-md">{p.displayFont}</span>
          </div>
          <div className="bg-surface px-md py-sm border border-fg/10">
            <span className="text-fg-muted">motionIntensity</span>
            <span className="text-fg ml-md">{p.motionIntensity}</span>
          </div>
        </div>
      </div>

      {/* Copy block */}
      <div className="space-y-md">
        <p className="text-label tracking-label uppercase text-fg-muted font-semibold">Export values</p>
        <CopyBlock palette={p} />
      </div>

    </div>
  )
}
