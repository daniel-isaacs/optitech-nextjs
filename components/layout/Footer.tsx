import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/optimizely'

const FALLBACK_LINKS = [
  { label: 'Product', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'About',   href: '#' },
  { label: 'Contact', href: '#' },
]

export default async function Footer() {
  const settings = await getSiteSettings()

  const logoSrc   = settings?.logoSrc  ?? '/brand/logo/OT.png'
  const logoAlt   = settings?.logoAlt  ?? 'OptiTech'
  const copyright = settings?.copyright
    ?? `© ${new Date().getFullYear()} OptiTech. All rights reserved.`

  const navLinks: { label: string; href: string }[] = settings?.navItems?.length
    ? settings.navItems.map((item: any) => ({
        label: item.label ?? '',
        href:  item.url?.default ?? '#',
      }))
    : FALLBACK_LINKS

  return (
    <footer className="bg-canvas border-t border-fg/10">
      <div className="px-md py-xl lg:px-lg">

        <div className="flex flex-col gap-lg lg:flex-row lg:items-start lg:justify-between">

          <Link
            href="/"
            aria-label={`${logoAlt} — Home`}
            className="opacity-100 hover:opacity-80 transition-opacity duration-150 ease-quick"
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={160}
              height={40}
              className="h-9 w-auto"
            />
          </Link>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-md lg:gap-lg">
              {navLinks.map(link => (
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
          </nav>

        </div>

        <div className="mt-xl pt-md border-t border-fg/10">
          <p className="text-label tracking-label uppercase text-fg-muted">
            {copyright}
          </p>
        </div>

      </div>
    </footer>
  )
}
