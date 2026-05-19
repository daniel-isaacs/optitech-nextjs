import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings, getRequestDomain } from '@/lib/optimizely'

const FALLBACK_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Pricing',  href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',   href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
]

const FALLBACK_LEGAL = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
]

export default async function Footer() {
  const settings = await getSiteSettings(await getRequestDomain())

  const logoSrc        = settings?.logo?.url?.default ?? '/brand/logo/OT.png'
  const logoAlt        = settings?.logoAlt  ?? 'OptiTech'
  const logoFit        = (settings?.logoFit as string | undefined) ?? 'full'
  const logoInvertDark = settings?.logoInvertDark === true
  const footerTagline  = settings?.footerTagline as string | undefined
  const copyright      = settings?.copyright
    ?? `© ${new Date().getFullYear()} OptiTech. All rights reserved.`

  const LOGO_IMG_CLASS: Record<string, string> = {
    full:    'max-h-12 w-auto',
    icon:    'h-12 w-12 object-contain',
    compact: 'max-h-8 w-auto max-w-[140px]',
  }
  const logoImgClass = [
    LOGO_IMG_CLASS[logoFit] ?? LOGO_IMG_CLASS.full,
    logoInvertDark ? 'logo-invert-dark' : '',
  ].filter(Boolean).join(' ')

  type FooterLink   = { label: string; href: string }
  type FooterColumn = { title?: string; links: FooterLink[] }

  const footerColumns: FooterColumn[] = settings?.footerColumns?.length
    ? settings.footerColumns.map((col: any) => ({
        title: col.title ?? undefined,
        links: (col.linkItems ?? []).map((l: any) => ({
          label: l.label ?? '',
          href:  l.url?.default ?? '#',
        })),
      }))
    : FALLBACK_COLUMNS

  const legalLinks: FooterLink[] = settings?.legalLinks?.length
    ? settings.legalLinks.map((l: any) => ({
        label: l.label ?? '',
        href:  l.url?.default ?? '#',
      }))
    : FALLBACK_LEGAL

  return (
    <footer className="bg-canvas border-t border-fg/10">
      <div className="px-md py-xl lg:px-lg">

        {/* Top area: brand + columns */}
        <div className="grid grid-cols-1 gap-xl lg:grid-cols-[auto_1fr] lg:gap-2xl">

          {/* Brand column */}
          <div className="flex flex-col gap-md max-w-[240px]">
            <Link
              href="/"
              aria-label={`${logoAlt} — Home`}
              className="flex items-center h-12 opacity-100 hover:opacity-80 transition-opacity duration-150 ease-quick"
            >
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={200}
                height={40}
                className={logoImgClass}
              />
            </Link>
            {footerTagline && (
              <p className="text-label text-fg-muted leading-body">{footerTagline}</p>
            )}
          </div>

          {/* Link columns */}
          <div
            className="grid grid-cols-2 gap-lg sm:gap-xl"
            style={{ gridTemplateColumns: `repeat(${Math.min(footerColumns.length, 4)}, minmax(0, 1fr))` }}
          >
            {footerColumns.map((col, i) => (
              <div key={col.title ?? i}>
                {col.title && (
                  <p className="text-label tracking-label uppercase font-semibold text-fg mb-md">
                    {col.title}
                  </p>
                )}
                <ul className="flex flex-col gap-sm">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-normal text-fg-muted hover:text-fg transition-colors duration-150 ease-quick"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar: copyright + legal links */}
        <div className="mt-xl pt-md border-t border-fg/10 flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-label tracking-label uppercase text-fg-muted">
            {copyright}
          </p>
          {legalLinks.length > 0 && (
            <nav aria-label="Legal navigation">
              <ul className="flex flex-wrap gap-md">
                {legalLinks.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-label text-fg-muted hover:text-fg transition-colors duration-150 ease-quick"
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
    </footer>
  )
}
