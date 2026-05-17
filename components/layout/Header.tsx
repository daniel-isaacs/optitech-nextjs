import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Button from '@/components/ui/Button'
import MobileMenu from '@/components/layout/MobileMenu'
import { getSiteSettings } from '@/lib/optimizely'

const FALLBACK_NAV = [
  { label: 'Product',  href: '#' },
  { label: 'Pricing',  href: '#' },
  { label: 'About',    href: '#' },
  { label: 'Showcase', href: '/showcase' },
]

export default async function Header() {
  const settings = await getSiteSettings()

  const logoSrc  = settings?.logo?.url?.default ?? '/brand/logo/OT.png'
  const logoAlt  = settings?.logoAlt  ?? 'OptiTech'
  const logoFit  = (settings?.logoFit as string | undefined) ?? 'auto'
  const ctaLabel = settings?.ctaLabel ?? 'Get Started'
  const ctaHref  = settings?.ctaUrl?.default ?? '#'

  const LOGO_IMG_CLASS: Record<string, string> = {
    auto:         'max-h-10 w-auto',
    icon:         'h-10 w-10 object-contain',
    wide:         'max-h-8 w-auto max-w-[200px]',
    'wide-padded': 'max-h-10 w-auto max-w-[200px] py-1',
  }
  const logoImgClass = LOGO_IMG_CLASS[logoFit] ?? LOGO_IMG_CLASS.auto

  const navItems: { label: string; href: string }[] = settings?.navItems?.length
    ? settings.navItems.map((item: any) => ({
        label: item.label ?? '',
        href:  item.url?.default ?? '#',
      }))
    : FALLBACK_NAV

  return (
    <>
      <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-fg/5">
        <div className="flex items-center justify-between px-md py-md lg:px-lg">

          <Link href="/" aria-label={`${logoAlt} — Home`} className="flex items-center h-10">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={200}
              height={40}
              className={logoImgClass}
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-lg" aria-label="Primary navigation">
            {navItems.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-normal text-fg-muted transition-colors duration-150 ease-quick hover:text-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-md">
            <ThemeToggle />
            <Button href={ctaHref} size="sm">{ctaLabel}</Button>
          </div>

          <div className="lg:hidden flex items-center gap-sm">
            <ThemeToggle />
            <MobileMenu navItems={navItems} ctaLabel={ctaLabel} ctaHref={ctaHref} />
          </div>

        </div>
      </header>
    </>
  )
}
