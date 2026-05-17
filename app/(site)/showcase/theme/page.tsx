import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteSettings, getRequestDomain } from '@/lib/optimizely'
import { SectionLabel } from '../components'

export const metadata: Metadata = {
  title: 'Theme Preview — Design System — OptiTech',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const LOGO_IMG_CLASS: Record<string, string> = {
  full:    'max-h-10 w-auto',
  icon:    'h-10 w-10 object-contain',
  compact: 'max-h-7 w-auto max-w-[160px]',
}

const LOGO_IMG_CLASS_SM: Record<string, string> = {
  full:    'max-h-9 w-auto',
  icon:    'h-9 w-9 object-contain',
  compact: 'max-h-6 w-auto max-w-[140px]',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ThemePreviewPage() {
  const settings   = await getSiteSettings(await getRequestDomain())
  const logoSrc    = settings?.logo?.url?.default ?? '/brand/logo/OT.png'
  const logoAlt    = settings?.logoAlt ?? 'OptiTech'
  const logoFit    = (settings?.logoFit as string | undefined) ?? 'full'
  const invertDark = settings?.logoInvertDark === true
  const ctaLabel   = settings?.ctaLabel ?? 'Get Started'
  const copyright  = settings?.copyright ?? `© ${new Date().getFullYear()} OptiTech. All rights reserved.`

  const invertClass = invertDark ? 'logo-invert-dark' : ''

  const navItems: { label: string; href: string }[] = settings?.navItems?.length
    ? settings.navItems.map((i: any) => ({ label: i.label ?? '', href: i.url?.default ?? '#' }))
    : [{ label: 'Product', href: '#' }, { label: 'Pricing', href: '#' }, { label: 'About', href: '#' }]

  type ColorField = { key: string; label: string; mode: 'dark' | 'light' | 'both' }
  const COLOR_FIELDS: ColorField[] = [
    { key: 'colorBrand',        label: 'Brand',         mode: 'both'  },
    { key: 'colorBrandHover',   label: 'Brand Hover',   mode: 'both'  },
    { key: 'colorAccent',       label: 'Accent',        mode: 'both'  },
    { key: 'colorCanvas',       label: 'Canvas (dark)', mode: 'dark'  },
    { key: 'colorSurface',      label: 'Surface (dark)', mode: 'dark'  },
    { key: 'colorCanvasLight',  label: 'Canvas (light)', mode: 'light' },
    { key: 'colorSurfaceLight', label: 'Surface (light)', mode: 'light' },
  ]

  const hasAnyColor = COLOR_FIELDS.some(f => !!settings?.[f.key])

  return (
    <>
      {/* ── 01 Logo Rendering ── */}
      <section id="logo" className="px-md py-xl lg:px-lg">
        <SectionLabel index="01 · Theme" title="Logo Rendering" />

        <div className="space-y-lg">
          <div>
            <p className="text-label tracking-label uppercase text-fg-muted mb-md font-semibold">
              Header size — <code className="font-mono text-fg">logoFit: {logoFit}</code>
            </p>
            {/* Simulated header bar */}
            <div className="bg-canvas/80 border border-fg/10 px-md py-md flex items-center justify-between">
              <div className="flex items-center h-10">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={200}
                  height={40}
                  className={[LOGO_IMG_CLASS[logoFit] ?? LOGO_IMG_CLASS.full, invertClass].filter(Boolean).join(' ')}
                />
              </div>
              <div className="hidden sm:flex items-center gap-lg">
                {navItems.slice(0, 3).map(n => (
                  <span key={n.label} className="text-sm font-normal text-fg-muted">{n.label}</span>
                ))}
              </div>
              <div className="flex items-center gap-md">
                <span className="bg-brand text-fg-on-brand text-label font-semibold tracking-label uppercase px-7 py-3">
                  {ctaLabel}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-label tracking-label uppercase text-fg-muted mb-md font-semibold">
              Footer size
            </p>
            {/* Simulated footer bar */}
            <div className="bg-canvas border border-fg/10 px-md py-lg flex items-start justify-between gap-lg">
              <div className="flex items-center h-9">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={200}
                  height={40}
                  className={[LOGO_IMG_CLASS_SM[logoFit] ?? LOGO_IMG_CLASS_SM.full, invertClass].filter(Boolean).join(' ')}
                />
              </div>
              <p className="text-label tracking-label uppercase text-fg-muted self-end">{copyright}</p>
            </div>
          </div>

          {/* All three fit options for comparison */}
          <div>
            <p className="text-label tracking-label uppercase text-fg-muted mb-md font-semibold">
              All logo fit options — same image
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
              {(['full', 'icon', 'compact'] as const).map(fit => (
                <div key={fit} className="bg-surface border border-fg/10 p-md">
                  <p className="text-label tracking-label uppercase font-semibold text-brand mb-md">
                    {fit}{fit === logoFit ? ' · active' : ''}
                  </p>
                  <div className="flex items-center h-10 mb-sm">
                    <Image
                      src={logoSrc}
                      alt={logoAlt}
                      width={200}
                      height={40}
                      className={[LOGO_IMG_CLASS[fit], invertClass].filter(Boolean).join(' ')}
                    />
                  </div>
                  <p className="font-mono text-label text-fg-muted/60">{LOGO_IMG_CLASS[fit]}</p>
                </div>
              ))}
            </div>
          </div>

          {invertDark && (
            <div>
              <p className="text-label tracking-label uppercase text-fg-muted mb-md font-semibold">
                Dark-mode invert — active
              </p>
              <div className="grid grid-cols-2 gap-md">
                <div className="p-md flex flex-col gap-md" style={{ background: 'oklch(12% 0.012 195)' }}>
                  <p className="text-label tracking-label uppercase font-semibold" style={{ color: 'oklch(68% 0.06 195)' }}>Dark mode — filter applied</p>
                  <Image src={logoSrc} alt={logoAlt} width={200} height={40}
                    className={[LOGO_IMG_CLASS[logoFit] ?? LOGO_IMG_CLASS.full, 'logo-invert-dark'].filter(Boolean).join(' ')} />
                </div>
                <div className="p-md flex flex-col gap-md" data-theme="light" style={{ background: 'oklch(97% 0.005 195)' }}>
                  <p className="text-label tracking-label uppercase font-semibold" style={{ color: 'oklch(38% 0.05 195)' }}>Light mode — no filter</p>
                  <Image src={logoSrc} alt={logoAlt} width={200} height={40}
                    className={[LOGO_IMG_CLASS[logoFit] ?? LOGO_IMG_CLASS.full, 'logo-invert-dark'].filter(Boolean).join(' ')} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 02 Color Theme ── */}
      <section id="colors" className="px-md py-xl lg:px-lg">
        <SectionLabel index="02 · Theme" title="Color Theme" />

        {!hasAnyColor ? (
          <div className="bg-surface border border-fg/10 px-md py-lg">
            <p className="text-body text-fg-muted">
              No color overrides are set in the Theme Manager. The site is using the default OptiTech design tokens.
              Set color values in the CMS to preview them here.
            </p>
            <p className="text-label text-fg-muted/60 mt-sm font-mono">
              Tokens defined in: styles/tokens.css
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-lg">
            {COLOR_FIELDS.map(f => {
              const value = settings?.[f.key] as string | undefined
              if (!value) return null
              return (
                <div key={f.key}>
                  <div
                    className="h-16 w-full border border-fg/10"
                    style={{ background: value }}
                  />
                  <div className="mt-sm space-y-xs">
                    <div className="flex items-center gap-sm flex-wrap">
                      <p className="text-title font-semibold leading-title text-fg">{f.label}</p>
                      <span className="text-label tracking-label uppercase font-semibold text-fg-muted/50">
                        {f.mode}
                      </span>
                    </div>
                    <p className="font-mono text-label text-fg-muted">{value}</p>
                    <p className="font-mono text-label text-fg-muted/50">{f.key}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Live theme surface samples */}
        <div className="mt-xl space-y-md">
          <p className="text-label tracking-label uppercase text-fg-muted font-semibold mb-md">
            Live token surfaces — active mode
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
            {[
              { label: 'Canvas',  bg: 'bg-canvas',  border: true  },
              { label: 'Surface', bg: 'bg-surface',  border: false },
              { label: 'Brand',   bg: 'bg-brand',    border: false },
              { label: 'Accent',  bg: 'bg-accent',   border: false },
            ].map(s => (
              <div key={s.label}>
                <div className={`h-12 w-full ${s.bg} ${s.border ? 'border border-fg/15' : ''}`} />
                <p className="text-label text-fg-muted mt-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 Navigation Preview ── */}
      <section id="nav" className="px-md py-xl lg:px-lg">
        <SectionLabel index="03 · Theme" title="Navigation" />

        <div className="space-y-lg">
          <div>
            <p className="text-label tracking-label uppercase text-fg-muted mb-md font-semibold">
              Header nav items ({navItems.length})
            </p>
            <div className="bg-canvas/80 border border-fg/10 px-md py-sm flex flex-wrap items-center gap-lg">
              {navItems.map(n => (
                <span key={n.label} className="text-sm font-normal text-fg-muted">{n.label}</span>
              ))}
            </div>
          </div>

          {settings?.footerColumns?.length > 0 && (
            <div>
              <p className="text-label tracking-label uppercase text-fg-muted mb-md font-semibold">
                Footer columns ({settings.footerColumns.length})
              </p>
              <div className="bg-canvas border border-fg/10 px-md py-lg grid gap-lg"
                style={{ gridTemplateColumns: `repeat(${Math.min(settings.footerColumns.length, 4)}, minmax(0, 1fr))` }}>
                {settings.footerColumns.map((col: any, i: number) => (
                  <div key={i}>
                    {col.title && (
                      <p className="text-label tracking-label uppercase font-semibold text-fg mb-sm">{col.title}</p>
                    )}
                    <ul className="flex flex-col gap-xs">
                      {(col.links ?? []).map((l: any, j: number) => (
                        <li key={j} className="text-sm text-fg-muted">{l.label}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 04 CTA Button ── */}
      <section id="cta" className="px-md py-xl lg:px-lg">
        <SectionLabel index="04 · Theme" title="CTA Button" />
        <div className="flex flex-wrap items-center gap-lg">
          <div className="flex flex-col gap-sm items-start">
            <span
              className="bg-brand hover:bg-brand-hover text-fg-on-brand text-label font-semibold tracking-label uppercase
                         px-12 py-4 transition-colors duration-150 ease-quick"
            >
              {ctaLabel}
            </span>
            <p className="text-label text-fg-muted">Primary · Canvas surface</p>
          </div>
          <div className="bg-brand p-lg flex flex-col gap-sm items-start">
            <span
              className="bg-brand-hover text-fg-on-brand text-label font-semibold tracking-label uppercase
                         px-12 py-4 transition-colors duration-150 ease-quick"
            >
              {ctaLabel}
            </span>
            <p className="text-label text-fg-on-brand/60">Primary · Brand surface</p>
          </div>
        </div>
      </section>

      {/* ── Link to CMS ── */}
      <section className="px-md py-xl lg:px-lg">
        <div className="bg-surface border border-fg/10 px-md py-lg flex flex-col gap-sm">
          <p className="text-label tracking-label uppercase text-fg-muted font-semibold">
            Edit these settings
          </p>
          <p className="text-sm text-fg-muted leading-body">
            Open the Optimizely CMS and navigate to Shared Content → Theme Manager.
            Changes publish instantly; refresh this page to see updates.
          </p>
        </div>
      </section>
    </>
  )
}
