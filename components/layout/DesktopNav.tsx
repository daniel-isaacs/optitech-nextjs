'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

export type NavSubItem = { label: string; href: string; description?: string }
export type NavItem    = { label: string; href: string; children?: NavSubItem[] }

type Props = { navItems: NavItem[] }

export default function DesktopNav({ navItems }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)

  const close = useCallback(() => setOpenIndex(null), [])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [close])

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [close])

  return (
    <nav ref={navRef} className="hidden lg:flex items-center gap-lg" aria-label="Primary navigation">
      {navItems.map((item, i) => {
        const hasChildren = !!item.children?.length
        const isOpen      = openIndex === i

        if (!hasChildren) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-normal text-fg-muted transition-colors duration-150 ease-quick hover:text-fg"
            >
              {item.label}
            </Link>
          )
        }

        return (
          <div key={item.label} className="relative">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex items-center gap-xs text-sm font-normal text-fg-muted transition-colors duration-150 ease-quick hover:text-fg"
            >
              {item.label}
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`shrink-0 transition-transform duration-150 ease-quick ${isOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isOpen && (
              <div
                role="menu"
                className="absolute top-full left-1/2 -translate-x-1/2 mt-sm z-50
                           bg-surface border border-fg/10 shadow-xl
                           min-w-[220px] max-w-[320px] w-max"
              >
                {item.children!.map(sub => (
                  <Link
                    key={sub.label}
                    href={sub.href}
                    role="menuitem"
                    onClick={close}
                    className="block px-md py-sm hover:bg-fg/5 transition-colors duration-100 ease-quick group"
                  >
                    <span className="block text-sm font-normal text-fg group-hover:text-brand transition-colors duration-100">
                      {sub.label}
                    </span>
                    {sub.description && (
                      <span className="block text-label text-fg-muted mt-xs leading-snug">
                        {sub.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
