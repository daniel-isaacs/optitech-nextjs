'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BarChart3, CalendarDays } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  href:   string
  label:  string
  icon:   LucideIcon
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/opti-admin',                 label: 'Dashboard',       icon: LayoutDashboard, exact: true },
  { href: '/opti-admin/component-usage', label: 'Component Usage', icon: BarChart3        },
  { href: '/opti-admin/calendar',        label: 'Calendar',        icon: CalendarDays     },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-[10px] py-[18px] overflow-y-auto">
      <p className="oa-section-label text-[0.6rem] font-bold uppercase tracking-[0.14em] px-[8px] mb-[8px] select-none">
        Tools
      </p>
      <ul className="flex flex-col gap-[2px]">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                className={`oa-sb-nav-item flex items-center gap-[10px] px-[8px] py-[8px] text-[0.8125rem] select-none ${active ? 'oa-active' : ''}`}
              >
                <Icon
                  size={15}
                  strokeWidth={active ? 2 : 1.5}
                  className="shrink-0"
                  aria-hidden="true"
                />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
