import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings, getRequestDomain, getRequestLocale } from '@/lib/optimizely'

/**
 * Footer — driven by OT_FooterBlock via ThemeManager.footerRef.
 *
 * Layout (redesigned with isometric depth system):
 *   [2px gradient bar]
 *   [diagonal isometric texture — 45° lines match extrude shadow direction]
 *   [editorial wordmark — "OptiTech" in display-extrude at full size]
 *   [content grid — description left, nav right, separated by border-t]
 *   [bottom strip — logo + year]
 */
export default async function Footer() {
  const settings = await getSiteSettings(await getRequestDomain(), await getRequestLocale())

  // ── Logo ──────────────────────────────────────────────────────────────────
  const logoSrc        = settings?.logo?.url?.default ?? '/brand/logo/OT.png'
  const logoAlt        = settings?.logoAlt ?? 'OptiTech'
  const logoFit        = (settings?.logoFit as string | undefined) ?? 'full'
  const logoInvertDark = settings?.logoInvertDark === true

  const LOGO_IMG_CLASS: Record<string, string> = {
    full:    'max-h-8 w-auto',
    icon:    'h-8 w-8 object-contain',
    compact: 'max-h-6 w-auto max-w-[110px]',
  }
  const logoImgClass = [
    LOGO_IMG_CLASS[logoFit] ?? LOGO_IMG_CLASS.full,
    logoInvertDark ? 'logo-invert-dark' : '',
  ].filter(Boolean).join(' ')

  // ── Footer block data ─────────────────────────────────────────────────────
  const footerRef       = (settings?.footerRef?.item ?? settings?.footerRef) as any | undefined
  const descriptionHtml = (footerRef?.description?.html as string | undefined) ?? null

  type FooterLink = { label: string; href: string }
  const links: FooterLink[] = Array.isArray(footerRef?.links)
    ? (footerRef.links as any[])
        .map(l => ({ label: (l.label as string) ?? '', href: (l.url?.default as string) ?? '#' }))
        .filter(l => l.label)
        .slice(0, 10)
    : []

  const hasContent     = !!descriptionHtml || links.length > 0
  const twoColumnLinks = links.length > 5
  const year           = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden isolate bg-canvas">

      {/* ── 2px gradient horizon — brand → accent ──────────────────────────── */}
      <div
        aria-hidden
        className="h-0.5"
        style={{
          background: 'linear-gradient(to right, transparent, var(--ot-brand) 20%, var(--ot-accent) 80%, transparent)',
        }}
      />

      {/* ── Isometric diagonal texture — 45° lines match the extrude shadow ──
           One-pixel lines every 48px. Uses CSS relative color so it follows
           CMS theme overrides automatically. ─────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(45deg, oklch(from var(--ot-brand) l c h / 0.055) 0px, oklch(from var(--ot-brand) l c h / 0.055) 1px, transparent 1px, transparent 48px)',
        }}
      />

      {/* ── Bottom-right ambient bloom — soft glow anchors the depth ─────── */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage:
            'radial-gradient(ellipse 55% 70% at 92% 105%, var(--ot-bloom-brand-faint) 0%, transparent 65%)',
        }}
      />

      {/* ── Editorial wordmark — isometric extrude at display scale ──────────
           The primary visual statement of the footer. Clips naturally at the
           overflow-hidden boundary on narrow viewports — the bleed is intentional.
           aria-hidden because the page already identifies the brand via the logo. */}
      <div
        aria-hidden
        className="relative select-none pointer-events-none overflow-hidden px-md pt-xl pb-sm lg:px-lg"
        style={{ zIndex: 1 }}
      >
        <p
          className="display-extrude font-extrabold leading-none"
          style={{
            fontSize: 'clamp(4rem, 13vw, 13rem)',
            letterSpacing: '-0.04em',
          }}
        >
          OptiTech
        </p>
      </div>

      {/* ── Content zone ─────────────────────────────────────────────────────
           Only renders when footer block data is present. ───────────────── */}
      {hasContent && (
        <div className="relative px-md lg:px-lg" style={{ zIndex: 1 }}>
          <div className="border-t border-fg/10 pt-xl pb-lg flex flex-col gap-xl sm:flex-row sm:items-start sm:gap-2xl">

            {/* Description — flexible width */}
            {descriptionHtml && (
              <div
                className="
                  flex-1 min-w-0
                  text-[1.0625rem] font-medium leading-[1.65] text-fg
                  [&_p]:m-0
                  [&_p+p]:mt-[0.75em]
                  [&_strong]:font-semibold
                  [&_em]:not-italic [&_em]:text-accent
                  [&_a]:text-fg-muted [&_a]:underline [&_a]:decoration-fg/20
                  [&_a:hover]:text-fg [&_a:hover]:decoration-fg/50
                "
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            )}

            {/* Navigation links — pinned right */}
            {links.length > 0 && (
              <nav aria-label="Footer navigation" className="shrink-0">
                <ul
                  className={`
                    grid grid-cols-1 gap-x-xl gap-y-xs
                    ${twoColumnLinks ? 'sm:grid-cols-2' : ''}
                  `}
                >
                  {links.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="
                          text-label tracking-label uppercase
                          text-fg-muted hover:text-fg
                          transition-colors duration-150 ease-quick
                        "
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

          </div>
        </div>
      )}

      {/* ── Bottom strip — logo + year ────────────────────────────────────────
           Sits on the deepest ground. Logo is at reduced opacity at rest,
           brightens on hover. Year mark in brand/40 — quiet but present. ── */}
      <div
        className="relative border-t border-fg/8 px-md lg:px-lg py-md flex items-center justify-between gap-lg"
        style={{ zIndex: 1 }}
      >
        <Link
          href="/"
          aria-label={`${logoAlt} — Home`}
          className="inline-flex items-center opacity-55 hover:opacity-90 transition-opacity duration-200 ease-quick"
        >
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={130}
            height={32}
            className={logoImgClass}
          />
        </Link>

        <p className="text-label text-brand/40 tracking-label uppercase">
          {year}
        </p>
      </div>

    </footer>
  )
}
