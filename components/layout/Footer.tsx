import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings, getRequestDomain, getRequestLocale } from '@/lib/optimizely'

export default async function Footer() {
  const settings = await getSiteSettings(await getRequestDomain(), await getRequestLocale())

  const themeLogoSrc    = settings?.logo?.url?.default ?? '/brand/logo/optitech-icon.svg'
  const logoAlt         = settings?.logoAlt ?? 'OptiTech'
  const themeLogoInvert = settings?.logoInvertDark === true

  const footerRef          = (settings?.footerRef?.item ?? settings?.footerRef) as any | undefined
  const footerLogoOverride = footerRef?.footerLogo?.url?.default as string | undefined
  const footerLogoSrc      = footerLogoOverride ?? themeLogoSrc
  const footerLogoInvert   = footerLogoOverride !== undefined
                               ? footerRef?.footerLogoInvertDark === true
                               : themeLogoInvert
  const footerLogoSize     = (footerRef?.footerLogoSize as string | undefined) ?? 'md'

  const FOOTER_LOGO_SIZE: Record<string, string> = {
    sm: 'max-h-10 w-auto',
    md: 'max-h-14 w-auto',
    lg: 'max-h-20 w-auto',
    xl: 'max-h-28 w-auto',
  }
  const logoSizeClass = FOOTER_LOGO_SIZE[footerLogoSize] ?? FOOTER_LOGO_SIZE.md

  const descriptionHtml = (footerRef?.description?.html as string | undefined) ?? null

  type FooterLink = { label: string; href: string }
  const links: FooterLink[] = Array.isArray(footerRef?.links)
    ? (footerRef.links as any[])
        .map(l => ({ label: (l.label as string) ?? '', href: (l.url?.default as string) ?? '#' }))
        .filter(l => l.label)
        .slice(0, 5)
    : []

  const year = new Date().getFullYear()

  return (
    // data-theme="dark" forces dark tokens in both light and dark page modes.
    // The [data-theme="dark"] rules in tokens.css re-assert dark canvas/fg values.
    <footer className="relative overflow-hidden isolate" data-theme="dark">

      {/* Top gradient bar: brand → accent */}
      <div
        aria-hidden
        className="h-0.5"
        style={{
          background: 'linear-gradient(to right, transparent, var(--ot-brand) 20%, var(--ot-accent) 80%, transparent)',
        }}
      />

      {/* ── Background layers (absolute, stacked) ─────────────────────────────
       * z-0  brand-hover fills everything (right column base, WCAG-safe for white text)
       * z-1  canvas left panel with diagonal clip-path + drop-shadow depth (desktop)
       * z-2  45° line texture over canvas side (desktop)
       * z-3  accent rim strip at the diagonal boundary (desktop)
       * z-4  ambient brand bloom on the right side
       * ─────────────────────────────────────────────────────────────────────── */}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{ zIndex: 0, background: 'var(--ot-brand-hover)' }}
      />

      {/* Canvas panel — diagonal right edge; drop-shadow casts depth onto brand side */}
      <div
        aria-hidden
        className="hidden lg:block absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'var(--ot-canvas)',
          clipPath: 'polygon(0 0, 57% 0, calc(57% - 5rem) 100%, 0 100%)',
          filter: 'drop-shadow(8px 0 36px oklch(4% 0.005 195 / 0.65))',
        }}
      />

      {/* Diagonal line texture over canvas side */}
      <div
        aria-hidden
        className="hidden lg:block absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          clipPath: 'polygon(0 0, 57% 0, calc(57% - 5rem) 100%, 0 100%)',
          backgroundImage:
            'repeating-linear-gradient(45deg, oklch(from var(--ot-brand) l c h / 0.04) 0px, oklch(from var(--ot-brand) l c h / 0.04) 1px, transparent 1px, transparent 52px)',
        }}
      />

      {/* Accent rim — thin parallelogram strip at the diagonal edge */}
      <div
        aria-hidden
        className="hidden lg:block absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background:
            'linear-gradient(to bottom, oklch(from var(--ot-accent) l c h / 0.88) 0%, oklch(from var(--ot-accent) l c h / 0.40) 100%)',
          clipPath:
            'polygon(calc(57% - 2px) 0, calc(57% + 2px) 0, calc(57% - 5rem + 2px) 100%, calc(57% - 5rem - 3px) 100%)',
        }}
      />

      {/* Ambient bloom: soft halo on the brand side */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          backgroundImage:
            'radial-gradient(ellipse 55% 75% at 92% 110%, var(--ot-bloom-brand-faint) 0%, transparent 65%)',
        }}
      />

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      {/*
       * Each column carries its own background color for mobile (stacked layout).
       * On desktop (lg:), the columns are transparent — the absolute panels above
       * provide the correct background through the diagonal clip-path system.
       * lg:bg-transparent overrides the mobile background at the lg breakpoint.
       */}
      <div className="relative flex flex-col lg:flex-row" style={{ zIndex: 10, minHeight: '300px' }}>

        {/* ── Left: canvas — logo + description ──────────────────────────────── */}
        <div className="bg-canvas lg:bg-transparent lg:w-[57%] flex flex-col justify-center px-md py-xl lg:px-lg lg:py-2xl lg:pr-28">

          <Link
            href="/"
            aria-label={`${logoAlt} — Home`}
            className="inline-flex items-center hover:opacity-80 transition-opacity duration-200 ease-quick"
            style={{ filter: 'drop-shadow(0 4px 20px var(--ot-bloom-brand-faint))' }}
          >
            <Image
              src={footerLogoSrc}
              alt={logoAlt}
              width={444}
              height={90}
              className={logoSizeClass}
              style={footerLogoInvert ? { filter: 'brightness(0) invert(1)' } : undefined}
            />
          </Link>

          {descriptionHtml && (
            <div
              className="mt-lg max-w-[44ch] text-[0.9375rem] leading-relaxed text-fg-muted [&_p]:m-0 [&_p+p]:mt-[0.75em] [&_strong]:font-semibold [&_strong]:text-fg [&_em]:not-italic [&_em]:text-accent [&_a]:text-fg-muted [&_a]:underline [&_a]:decoration-fg/20 [&_a:hover]:text-fg [&_a:hover]:decoration-fg/50 transition-colors duration-150"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}

        </div>

        {/* ── Right: brand — nav links + copyright ───────────────────────────── */}
        {/*
         * brand-hover background provides sufficient contrast for white text (WCAG AA).
         * On desktop the bg is transparent and the brand-hover absolute panel shows through.
         * border-t separates sections on mobile; hidden on desktop (diagonal takes over).
         */}
        <div
          className="bg-brand-hover lg:bg-transparent lg:w-[43%] flex flex-col justify-between px-md py-xl lg:px-lg lg:py-2xl border-t border-accent/20 lg:border-t-0"
        >

          {links.length > 0 && (
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-y-4">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.9375rem] font-medium text-fg-on-brand underline-offset-2 hover:underline decoration-fg-on-brand/40 hover:opacity-80 transition-all duration-200 ease-quick"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <p className="text-label tracking-label uppercase text-fg-on-brand mt-xl lg:mt-0">
            © {year}
          </p>

        </div>

      </div>

    </footer>
  )
}
