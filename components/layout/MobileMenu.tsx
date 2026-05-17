'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

type NavItem = { label: string; href: string }

type Props = {
  navItems: NavItem[]
  ctaLabel: string
  ctaHref:  string
}

export default function MobileMenu({ navItems, ctaLabel, ctaHref }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="lg:hidden flex flex-col justify-center gap-1.5 p-sm"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span className={`block w-5 h-px bg-fg origin-center transition-transform duration-200 ease-quick ${open ? 'translate-y-0.75 rotate-45' : ''}`} />
        <span className={`block w-5 h-px bg-fg transition-opacity duration-150 ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-px bg-fg origin-center transition-transform duration-200 ease-quick ${open ? '-translate-y-0.75 -rotate-45' : ''}`} />
      </button>

      <div
        aria-hidden={!open}
        className={`lg:hidden fixed inset-0 z-40 bg-canvas flex flex-col pt-20 px-md transition-opacity duration-200 ease-quick ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <nav aria-label="Mobile navigation">
          {navItems.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-headline font-bold text-fg py-md border-b border-fg/10 hover:text-fg-muted transition-colors duration-150 ease-quick"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-lg">
          <Button href={ctaHref} onClick={() => setOpen(false)}>{ctaLabel}</Button>
        </div>
      </div>
    </>
  )
}
