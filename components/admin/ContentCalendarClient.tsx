'use client'

import { useState, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, ExternalLink, CalendarDays } from 'lucide-react'
import type { CalendarItem } from '@/lib/admin/graph'

// ─── Status config ────────────────────────────────────────────────────────────

type StatusKey = 'Published' | 'Scheduled' | 'Previous' | 'Draft'

const STATUS_CONFIG: Record<StatusKey, {
  label:   string
  chipCls: string     // calendar chip
  pillCls: string     // filter pill inactive
  pillActiveCls: string // filter pill active
  dotCls:  string     // legend dot
}> = {
  Published: {
    label:        'Published',
    chipCls:      'bg-emerald-50 text-emerald-700 border-emerald-200',
    pillCls:      'border-fg/[0.10] text-fg-muted hover:border-fg/20 hover:text-fg',
    pillActiveCls:'bg-emerald-50 border-emerald-300 text-emerald-700',
    dotCls:       'bg-emerald-400',
  },
  Scheduled: {
    label:        'Scheduled',
    chipCls:      'bg-brand/[0.09] text-brand border-brand/[0.18]',
    pillCls:      'border-fg/[0.10] text-fg-muted hover:border-fg/20 hover:text-fg',
    pillActiveCls:'bg-brand/[0.08] border-brand/30 text-brand',
    dotCls:       'bg-brand',
  },
  Previous: {
    label:        'Previous',
    chipCls:      'bg-fg/[0.05] text-fg-muted/80 border-fg/[0.08]',
    pillCls:      'border-fg/[0.10] text-fg-muted hover:border-fg/20 hover:text-fg',
    pillActiveCls:'bg-fg/[0.06] border-fg/20 text-fg-muted',
    dotCls:       'bg-fg-muted/40',
  },
  Draft: {
    label:        'Draft',
    chipCls:      'bg-amber-50 text-amber-700 border-amber-200',
    pillCls:      'border-fg/[0.10] text-fg-muted hover:border-fg/20 hover:text-fg',
    pillActiveCls:'bg-amber-50 border-amber-300 text-amber-700',
    dotCls:       'bg-amber-400',
  },
}

const ALL_STATUSES: StatusKey[] = ['Published', 'Scheduled', 'Draft', 'Previous']

function normalizeStatus(s: string | null): StatusKey | null {
  const map: Record<string, StatusKey> = {
    published: 'Published',
    scheduled: 'Scheduled',
    previous:  'Previous',
    draft:     'Draft',
  }
  return map[(s ?? '').toLowerCase()] ?? null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December']

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function calendarGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7
  const cells: (Date | null)[] = [
    ...Array.from({ length: startDow }, () => null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  const rows: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
  return rows
}

function chipCls(status: string | null): string {
  const key = normalizeStatus(status)
  return key ? STATUS_CONFIG[key].chipCls : STATUS_CONFIG.Draft.chipCls
}

function typeLabel(type: string): string {
  return type === 'blog' ? 'Blog Post' : 'Experience'
}

// ─── Calendar chip ────────────────────────────────────────────────────────────

function CalendarChip({ item, onClick }: { item: CalendarItem; onClick: (item: CalendarItem) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      title={item.displayName}
      className={`w-full text-left px-[5px] py-[2px] text-[0.65rem] font-semibold leading-tight truncate border transition-opacity duration-100 hover:opacity-75 ${chipCls(item.status)}`}
    >
      {item.displayName || 'Untitled'}
    </button>
  )
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function DetailPanel({ item, onClose }: { item: CalendarItem; onClose: () => void }) {
  const published = item.published ? new Date(item.published) : null
  const dateStr   = published
    ? published.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown date'
  const key = normalizeStatus(item.status)
  const statusCls = key ? STATUS_CONFIG[key].chipCls : STATUS_CONFIG.Draft.chipCls

  return (
    <div
      className="w-[268px] shrink-0 border-l border-fg/[0.08] bg-surface flex flex-col"
      role="complementary"
      aria-label="Content details"
    >
      <div className="flex items-center justify-between px-md py-[10px] border-b border-fg/[0.08]">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-fg-muted/60">Details</p>
        <button
          type="button"
          aria-label="Close details"
          onClick={onClose}
          className="text-fg-muted/40 hover:text-fg-muted transition-colors duration-100 p-[2px]"
        >
          <X size={13} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-col gap-[18px] px-md py-md flex-1 overflow-y-auto">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg-muted/50 mb-[5px]">Title</p>
          <p className="text-[0.9375rem] font-semibold text-fg leading-snug">
            {item.displayName || 'Untitled'}
          </p>
        </div>

        <div className="flex gap-lg">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg-muted/50 mb-[5px]">Type</p>
            <span className="text-[0.8125rem] font-medium text-fg">{typeLabel(item.type)}</span>
          </div>
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg-muted/50 mb-[5px]">Status</p>
            <span className={`text-[0.7rem] font-semibold px-[6px] py-[3px] border ${statusCls}`}>
              {item.status ?? 'Unknown'}
            </span>
          </div>
        </div>

        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg-muted/50 mb-[5px]">Published</p>
          <p className="text-[0.8125rem] text-fg-muted">{dateStr}</p>
        </div>

        {item.locale && (
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg-muted/50 mb-[5px]">Locale</p>
            <p className="text-[0.8125rem] text-fg-muted font-semibold uppercase">{item.locale}</p>
          </div>
        )}

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-sm text-[0.8125rem] font-semibold text-brand hover:text-brand-hover transition-colors duration-150 mt-auto"
          >
            <ExternalLink size={13} strokeWidth={2} aria-hidden="true" />
            View page
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ContentCalendarClient({ items }: { items: CalendarItem[] }) {
  const today = new Date()
  const [year,          setYear]          = useState(today.getFullYear())
  const [month,         setMonth]         = useState(today.getMonth())
  const [selected,      setSelected]      = useState<CalendarItem | null>(null)
  const [activeStatuses, setActiveStatuses] = useState<Set<StatusKey>>(new Set(ALL_STATUSES))

  const prevMonth = useCallback(() => {
    setSelected(null)
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else              { setMonth(m => m - 1) }
  }, [month])

  const nextMonth = useCallback(() => {
    setSelected(null)
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else               { setMonth(m => m + 1) }
  }, [month])

  function toggleStatus(key: StatusKey) {
    setActiveStatuses(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        // Prevent deselecting the last active filter
        if (next.size === 1) return prev
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const rows    = useMemo(() => calendarGrid(year, month), [year, month])
  const todayMs = new Date().setHours(0, 0, 0, 0)

  // Filter items by active statuses, then build date map
  const filteredItems = useMemo(() =>
    items.filter(item => {
      const key = normalizeStatus(item.status)
      return key ? activeStatuses.has(key) : activeStatuses.has('Draft')
    }),
    [items, activeStatuses],
  )

  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>()
    for (const item of filteredItems) {
      if (!item.published) continue
      const key = isoDate(new Date(item.published))
      const arr = map.get(key) ?? []
      arr.push(item)
      map.set(key, arr)
    }
    return map
  }, [filteredItems])

  // Count items visible in the current month
  const monthItemCount = useMemo(() =>
    [...itemsByDate.entries()]
      .filter(([key]) => {
        const d = new Date(key)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .reduce((sum, [, arr]) => sum + arr.length, 0),
    [itemsByDate, year, month],
  )

  return (
    <div>
      {/* ── Status filters ─── */}
      <div className="flex items-center gap-sm flex-wrap mb-md">
        <span className="text-[0.75rem] font-medium text-fg-muted/60 mr-xs">Filter:</span>
        {ALL_STATUSES.map(key => {
          const cfg    = STATUS_CONFIG[key]
          const active = activeStatuses.has(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleStatus(key)}
              className={[
                'flex items-center gap-[6px] px-sm py-[4px] text-[0.75rem] font-semibold border',
                'transition-[color,background-color,border-color] duration-120',
                active ? cfg.pillActiveCls : cfg.pillCls,
              ].join(' ')}
              aria-pressed={active}
            >
              <span className={`w-[7px] h-[7px] shrink-0 ${cfg.dotCls}`} aria-hidden="true" />
              {cfg.label}
            </button>
          )
        })}
        {activeStatuses.size < ALL_STATUSES.length && (
          <button
            type="button"
            onClick={() => setActiveStatuses(new Set(ALL_STATUSES))}
            className="text-[0.75rem] font-medium text-fg-muted/50 hover:text-fg-muted transition-colors duration-120 ml-xs"
          >
            Show all
          </button>
        )}
      </div>

      {/* ── Month navigation ── */}
      <div className="flex items-center justify-between mb-md">
        <div className="flex items-center gap-sm">
          <h2 className="text-[1.0625rem] font-semibold text-fg">
            {MONTHS[month]} {year}
          </h2>
          {monthItemCount > 0 && (
            <span className="text-[0.8125rem] text-fg-muted">
              — {monthItemCount} item{monthItemCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-xs">
          <button type="button" aria-label="Previous month" onClick={prevMonth}
            className="p-[7px] text-fg-muted hover:text-fg hover:bg-fg/[0.05] transition-colors duration-100">
            <ChevronLeft size={16} strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Next month" onClick={nextMonth}
            className="p-[7px] text-fg-muted hover:text-fg hover:bg-fg/[0.05] transition-colors duration-100">
            <ChevronRight size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* ── Calendar grid + detail panel ── */}
      <div className="flex border border-fg/[0.08]">
        <div className="flex-1 min-w-0">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-fg/[0.08] bg-fg/[0.015]">
            {WEEKDAYS.map(d => (
              <div key={d} className="py-[8px] text-center text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-fg-muted/60">
                {d}
              </div>
            ))}
          </div>

          {/* Date rows */}
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-7 border-b border-fg/[0.06] last:border-none">
              {row.map((cell, ci) => {
                if (!cell) {
                  return (
                    <div key={ci} className="min-h-[88px] p-[5px] border-r border-fg/[0.05] last:border-none bg-fg/[0.012]" />
                  )
                }

                const key      = isoDate(cell)
                const dayItems = itemsByDate.get(key) ?? []
                const isToday  = new Date(cell).setHours(0,0,0,0) === todayMs
                const isPast   = new Date(cell).setHours(0,0,0,0) < todayMs

                return (
                  <div
                    key={key}
                    className={[
                      'min-h-[88px] p-[5px] border-r border-fg/[0.05] last:border-none flex flex-col gap-[3px]',
                      isPast && !isToday ? 'bg-fg/[0.008]' : '',
                    ].join(' ')}
                  >
                    <div className={[
                      'text-[0.75rem] font-semibold mb-[2px] w-[22px] h-[22px] flex items-center justify-center shrink-0',
                      isToday  ? 'bg-brand text-fg-on-brand' :
                      isPast   ? 'text-fg-muted/35' :
                                 'text-fg-muted',
                    ].join(' ')}>
                      {cell.getDate()}
                    </div>

                    {dayItems.slice(0, 3).map(item => (
                      <CalendarChip key={item.key} item={item} onClick={setSelected} />
                    ))}
                    {dayItems.length > 3 && (
                      <p className="text-[0.65rem] text-fg-muted/60 font-medium px-[5px]">
                        +{dayItems.length - 3} more
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {selected && (
          <DetailPanel item={selected} onClose={() => setSelected(null)} />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-md mt-sm flex-wrap">
        {ALL_STATUSES.map(key => (
          <div key={key} className="flex items-center gap-[5px]">
            <span className={`w-[8px] h-[8px] shrink-0 ${STATUS_CONFIG[key].dotCls}`} aria-hidden="true" />
            <span className="text-[0.75rem] text-fg-muted">{STATUS_CONFIG[key].label}</span>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-md py-2xl text-center">
          <CalendarDays size={36} strokeWidth={1} className="text-fg-muted/20" aria-hidden="true" />
          <p className="text-[0.9375rem] text-fg-muted/60">No content found in the CMS.</p>
        </div>
      )}
    </div>
  )
}
