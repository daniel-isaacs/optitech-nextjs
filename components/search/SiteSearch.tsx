'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Search, X, Maximize2, Minimize2, FileText, Newspaper } from 'lucide-react'
import { useSearch } from './SearchProvider'
import type { SearchResult } from '@/lib/search'

type DisplayMode = 'immersive' | 'compact'
type TypeFilter  = 'all' | 'Blog' | 'Page'

const DISPLAY_MODE_KEY  = 'ot-search-mode'
const SUGGESTED_QUERIES = ['Platform', 'Engineering', 'AI', 'Product', 'Innovation']

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all',  label: 'All'  },
  { value: 'Blog', label: 'Blog' },
  { value: 'Page', label: 'Page' },
]

function formatDate(iso?: string): string | null {
  if (!iso) return null
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }).format(new Date(iso))
  } catch { return null }
}

export default function SiteSearch() {
  const { isOpen, closeSearch } = useSearch()
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  const [mode,        setMode]        = useState<DisplayMode>('immersive')
  const [query,       setQuery]       = useState('')
  const [results,     setResults]     = useState<SearchResult[]>([])
  const [loading,     setLoading]     = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [typeFilter,  setTypeFilter]  = useState<TypeFilter>('all')
  const [topicFilter, setTopicFilter] = useState<string | null>(null)
  const [focusedIdx,  setFocusedIdx]  = useState(-1)
  const [mounted,     setMounted]     = useState(false)

  const inputRef    = useRef<HTMLInputElement>(null)
  const resultsRef  = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DISPLAY_MODE_KEY)
      if (saved === 'compact' || saved === 'immersive') setMode(saved)
    } catch {}
  }, [])

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(t)
    } else {
      setQuery('')
      setResults([])
      setFocusedIdx(-1)
      setHasSearched(false)
      setTypeFilter('all')
      setTopicFilter(null)
    }
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, closeSearch])

  const runSearch = useCallback(async (q: string, type: TypeFilter) => {
    if (q.trim().length < 2) { setResults([]); setHasSearched(false); return }
    setLoading(true)
    setHasSearched(true)
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&type=${type}`)
      const data: SearchResult[] = await res.json()
      setResults(data)
      setFocusedIdx(-1)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setTopicFilter(null)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(value, typeFilter), 300)
  }

  const handleTypeFilter = (t: TypeFilter) => {
    if (t === typeFilter) return
    setTypeFilter(t)
    setTopicFilter(null)
    if (query.trim().length >= 2) runSearch(query, t)
  }

  const toggleMode = () => {
    setMode(prev => {
      const next: DisplayMode = prev === 'immersive' ? 'compact' : 'immersive'
      try { localStorage.setItem(DISPLAY_MODE_KEY, next) } catch {}
      return next
    })
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    closeSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = resultsRef.current?.querySelectorAll<HTMLElement>('[data-result-item]')
    if (!items?.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(focusedIdx + 1, items.length - 1)
      setFocusedIdx(next)
      items[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (focusedIdx <= 0) {
        setFocusedIdx(-1)
        inputRef.current?.focus()
      } else {
        const prev = focusedIdx - 1
        setFocusedIdx(prev)
        items[prev]?.focus()
      }
    }
  }

  const blogCount     = results.filter(r => r.type === 'Blog').length
  const pageCount     = results.filter(r => r.type === 'Page').length
  const allCount      = results.length

  const availableTopics = Array.from(new Set(
    results.filter(r => r.type === 'Blog' && r.topic).map(r => r.topic!)
  ))
  const showTopics = (typeFilter === 'all' || typeFilter === 'Blog') && availableTopics.length > 0

  const filteredResults = topicFilter
    ? results.filter(r => r.type !== 'Blog' || r.topic === topicFilter)
    : results

  const dur = (ms: number) => prefersReducedMotion ? 0 : ms / 1000

  const panelVariants = {
    hidden:  { y: '-100%' },
    visible: { y: 0,       transition: { duration: dur(380), ease: [0.16, 1, 0.3, 1] as const } },
    exit:    { y: '-100%', transition: { duration: dur(240), ease: [0.4, 0, 0.2, 1]  as const } },
  }

  const overlayVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: dur(200) } },
    exit:    { opacity: 0, transition: { duration: dur(150) } },
  }

  // ─── Metric filter blocks ──────────────────────────────────────────────────
  // Data-forward: the count IS the visual anchor, not the label.
  // Active block: brand tint + brand text. Inactive: subdued, lifts on hover.

  function FilterMetrics({ size }: { size: 'full' | 'compact' }) {
    const countFor = (f: TypeFilter) => {
      if (f === 'all') return allCount
      if (f === 'Blog') return blogCount
      return pageCount
    }

    if (size === 'compact') {
      // Inline tab row for the HUD: type label · count, separated by hairlines
      return (
        <div className="flex items-center gap-0" role="group" aria-label="Content type filter">
          {TYPE_FILTERS.map((f, i) => {
            const isActive = typeFilter === f.value
            const count    = countFor(f.value)
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => handleTypeFilter(f.value)}
                aria-pressed={isActive}
                className={[
                  'flex items-center gap-[5px] px-sm py-[8px] transition-colors duration-150',
                  i > 0 ? 'border-l border-fg/10' : '',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand',
                  isActive
                    ? 'text-brand'
                    : 'text-fg-muted/50 hover:text-fg-muted',
                ].join(' ')}
              >
                <span className="text-[11px] uppercase tracking-[0.09em] font-semibold">{f.label}</span>
                {hasSearched && (
                  <span className={`text-[11px] font-bold tabular-nums ${isActive ? 'text-brand' : 'text-fg-muted/35'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )
    }

    // Full metric blocks for immersive sidebar
    return (
      <div className="flex gap-[6px]" role="group" aria-label="Content type filter">
        {TYPE_FILTERS.map(f => {
          const isActive = typeFilter === f.value
          const count    = countFor(f.value)
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => handleTypeFilter(f.value)}
              aria-pressed={isActive}
              className={[
                'flex-1 flex flex-col items-center py-[14px] px-sm border transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand',
                isActive
                  ? 'border-brand/40 bg-brand/8 text-brand'
                  : 'border-fg/10 text-fg-muted/50 hover:border-fg/20 hover:text-fg-muted',
              ].join(' ')}
            >
              <span
                className="font-syne font-black tabular-nums leading-none"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontVariationSettings: "'wght' 900" }}
              >
                {hasSearched ? count : '—'}
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] font-semibold mt-[5px]">
                {f.label}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  // ─── Topic chips ───────────────────────────────────────────────────────────

  function TopicChips({ compact: isCompact }: { compact: boolean }) {
    if (!showTopics) return null
    return (
      <div className={`flex flex-wrap items-center gap-xs ${isCompact ? '' : 'mt-sm'}`}>
        {!isCompact && (
          <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted/35 mr-[2px]">
            Topic
          </span>
        )}
        {availableTopics.map(topic => {
          const isActive = topicFilter === topic
          return (
            <button
              key={topic}
              type="button"
              onClick={() => setTopicFilter(isActive ? null : topic)}
              aria-pressed={isActive}
              className={[
                isCompact ? 'px-xs py-[4px] text-[10px]' : 'px-sm py-[5px] text-[11px]',
                'uppercase tracking-[0.08em] font-semibold border transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand',
                isActive
                  ? 'border-brand/50 bg-brand/10 text-brand'
                  : 'border-fg/10 text-fg-muted/45 hover:border-fg/25 hover:text-fg-muted',
              ].join(' ')}
            >
              {topic}
            </button>
          )
        })}
        {topicFilter && (
          <button
            type="button"
            onClick={() => setTopicFilter(null)}
            className="text-[10px] text-fg-muted/30 hover:text-fg-muted transition-colors ml-xs focus-visible:outline-none"
          >
            clear
          </button>
        )}
      </div>
    )
  }

  // ─── Suggested queries ─────────────────────────────────────────────────────

  function SuggestedQueries({ compact: isCompact }: { compact: boolean }) {
    return (
      <div className={isCompact ? 'px-md py-md' : ''}>
        {!isCompact && (
          <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted/35 mb-sm">
            Try searching
          </p>
        )}
        <div className="flex flex-wrap gap-xs items-center">
          {isCompact && (
            <span className="text-[11px] uppercase tracking-[0.08em] text-fg-muted/35 mr-xs select-none">
              Try
            </span>
          )}
          {SUGGESTED_QUERIES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => handleQueryChange(s)}
              className={[
                isCompact ? 'px-sm py-[5px] text-[11px]' : 'px-sm py-[6px] text-[12px]',
                'uppercase tracking-[0.08em] font-medium',
                'border border-fg/8 text-fg-muted/45',
                'hover:border-brand/35 hover:text-brand/70',
                'transition-all duration-150 focus-visible:outline-none',
              ].join(' ')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── Loading dots ──────────────────────────────────────────────────────────

  function LoadingDots() {
    return (
      <div className="flex items-center gap-xs py-md px-md lg:px-0" aria-label="Searching">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="block w-[5px] h-[5px] bg-brand/50 motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}
      </div>
    )
  }

  // ─── Result item ───────────────────────────────────────────────────────────
  // Single component used in both views — `compact` controls density.
  // Thumbnail is always shown when available; when not, a type icon fills the space.

  function ResultItem({ result, index, compact: isCompact }: {
    result:  SearchResult
    index:   number
    compact: boolean
  }) {
    const date         = formatDate(result.published)
    const isFocused    = focusedIdx === index
    const hasThumbnail = !!result.imageUrl

    const thumbW = isCompact ? 'w-[52px]' : 'w-[72px]'
    const thumbH = isCompact ? 'h-[52px]' : 'h-[72px]'

    return (
      <li>
        <button
          data-result-item
          tabIndex={isFocused ? 0 : -1}
          type="button"
          onClick={() => handleResultClick(result.url)}
          className={[
            'group w-full text-left flex items-start gap-md',
            isCompact ? 'px-md py-[13px]' : 'py-md',
            'border-b border-fg/8 last:border-0',
            'hover:bg-brand/6 focus-visible:outline-none focus-visible:bg-brand/6',
            'transition-colors duration-100',
            isFocused ? 'bg-brand/6' : '',
          ].join(' ')}
        >
          {/* Thumbnail / type placeholder */}
          <div className={`shrink-0 ${thumbW} ${thumbH} overflow-hidden bg-surface/60 flex items-center justify-center mt-[2px]`}>
            {hasThumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.imageUrl!}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : result.type === 'Blog' ? (
              <Newspaper size={isCompact ? 16 : 20} className="text-fg-muted/25" />
            ) : (
              <FileText size={isCompact ? 16 : 20} className="text-fg-muted/25" />
            )}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            {/* Meta row: type · topic · date */}
            <div className="flex items-center gap-[6px] flex-wrap mb-[4px]">
              <span className={`text-[10px] uppercase tracking-[0.1em] font-bold ${result.type === 'Blog' ? 'text-brand' : 'text-fg-muted/60'}`}>
                {result.type}
              </span>
              {result.topic && (
                <>
                  <span className="text-fg/15 leading-none">·</span>
                  <span className="text-[10px] uppercase tracking-[0.08em] font-semibold text-fg-muted/55">
                    {result.topic}
                  </span>
                </>
              )}
              {date && (
                <>
                  <span className="text-fg/15 leading-none">·</span>
                  <span className="text-[10px] text-fg-muted/40">{date}</span>
                </>
              )}
            </div>

            {/* Title */}
            <p className={[
              'font-semibold text-fg leading-snug line-clamp-2',
              'group-hover:text-brand group-focus-visible:text-brand transition-colors duration-150',
              isCompact ? 'text-[15px]' : 'text-[17px]',
            ].join(' ')}>
              {result.title}
            </p>

            {/* Excerpt */}
            {result.excerpt && (
              <p className={`text-fg-muted leading-relaxed mt-[5px] line-clamp-2 ${isCompact ? 'text-[12px]' : 'text-[13px]'}`}>
                {result.excerpt}
              </p>
            )}
          </div>

          {/* Arrow (immersive only) */}
          {!isCompact && (
            <span
              aria-hidden
              className="shrink-0 self-center text-fg/15 group-hover:text-brand group-focus-visible:text-brand transition-colors duration-150 text-base mt-[1px]"
            >
              →
            </span>
          )}
        </button>
      </li>
    )
  }

  // ─── Immersive panel ───────────────────────────────────────────────────────
  // Full-screen. Desktop: two-column (sidebar + results). Mobile: stacked.
  // Sidebar holds the bold Syne wordmark, large input, and metric filter blocks.

  function ImmersivePanel() {
    return (
      <div className="flex flex-col h-full overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-md lg:px-xl py-[10px] border-b border-fg/8 shrink-0">
          <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-fg-muted/35 select-none">
            OptiTech Search
          </span>
          <div className="flex items-center gap-[2px]">
            <button
              type="button"
              onClick={toggleMode}
              aria-label="Switch to compact mode"
              className="p-[7px] text-fg-muted/40 hover:text-fg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              <Minimize2 size={14} />
            </button>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="p-[7px] text-fg-muted/40 hover:text-fg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body: sidebar | results */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

          {/* ── Left sidebar ─────────────────────────────────────────────── */}
          <div className="flex flex-col w-full lg:w-[380px] xl:w-[420px] shrink-0 lg:border-r lg:border-fg/8 overflow-y-auto lg:overflow-y-auto">

            {/* SEARCH wordmark — bold solid Syne, not hollow */}
            <div className="px-md lg:px-xl pt-lg pb-sm select-none" aria-hidden>
              <span
                className="font-syne font-black text-fg block leading-none"
                style={{
                  fontSize:             'clamp(3.25rem, 8vw, 6.5rem)',
                  letterSpacing:        '-0.04em',
                  fontVariationSettings: "'wght' 900",
                }}
              >
                SEARCH
              </span>
            </div>

            {/* Search input */}
            <div className="px-md lg:px-xl pb-md shrink-0">
              <label htmlFor="search-input-immersive" className="sr-only">Search query</label>
              <div className="relative flex items-center border-b-2 border-fg/15 focus-within:border-brand transition-colors duration-200">
                <Search size={17} className="shrink-0 text-fg-muted/40 mr-sm" aria-hidden />
                <input
                  ref={inputRef}
                  id="search-input-immersive"
                  type="search"
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What are you looking for?"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Search query"
                  aria-controls="search-results"
                  aria-autocomplete="list"
                  className={[
                    'flex-1 bg-transparent text-fg py-sm outline-none',
                    'text-[1.1rem] font-medium placeholder:text-fg-muted/30',
                    '[&::-webkit-search-cancel-button]:hidden',
                  ].join(' ')}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => handleQueryChange('')}
                    aria-label="Clear search"
                    className="shrink-0 p-xs text-fg-muted/40 hover:text-fg transition-colors"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Metric filter blocks */}
            <div className="px-md lg:px-xl pb-md shrink-0">
              {FilterMetrics({ size: 'full' })}
            </div>

            {/* Topic chips */}
            {showTopics && (
              <div className="px-md lg:px-xl pb-md shrink-0">
                {TopicChips({ compact: false })}
              </div>
            )}

            {/* Suggested queries — only shown before any search */}
            {!hasSearched && !query && (
              <div className="px-md lg:px-xl pb-md shrink-0">
                {SuggestedQueries({ compact: false })}
              </div>
            )}

            {/* Result count — shown after searching, bottom of sidebar */}
            {hasSearched && !loading && (
              <div className="px-md lg:px-xl pb-md mt-auto shrink-0 hidden lg:block">
                <p className="text-[11px] uppercase tracking-[0.1em] text-fg-muted/35">
                  {filteredResults.length === 0
                    ? 'No results'
                    : `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            )}
          </div>

          {/* ── Right results pane ───────────────────────────────────────── */}
          <div
            ref={resultsRef}
            id="search-results"
            role="region"
            aria-label="Search results"
            aria-live="polite"
            className="flex-1 overflow-y-auto px-md lg:px-xl pt-md pb-2xl"
          >
            {loading && LoadingDots()}

            {!loading && !hasSearched && (
              // Mobile only: suggest queries here (desktop has them in sidebar)
              <div className="lg:hidden">
                {SuggestedQueries({ compact: false })}
              </div>
            )}

            {!loading && hasSearched && filteredResults.length === 0 && (
              <div className="py-md">
                <p className="text-[1.25rem] font-semibold text-fg/60">
                  No results for{' '}
                  <span className="text-fg">"{query}"</span>
                </p>
                <p className="text-[11px] uppercase tracking-[0.1em] text-fg-muted/35 mt-xs">
                  Try a different keyword or clear your filters
                </p>
              </div>
            )}

            {!loading && filteredResults.length > 0 && (
              <ul>
                {filteredResults.map((result, i) =>
                  ResultItem({ result, index: i, compact: false })
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ─── Compact HUD panel ─────────────────────────────────────────────────────
  // Sits just below the sticky nav. bg-canvas adapts to the active theme —
  // readable on both light and dark configurations without forced color override.

  function CompactPanel() {
    return (
      <div className="flex flex-col overflow-hidden" style={{ maxHeight: '70vh' }}>

        {/* Input row */}
        <div className="flex items-center gap-sm px-md py-[10px] border-b border-fg/10 shrink-0">
          <Search size={15} className="shrink-0 text-fg-muted/50" aria-hidden />
          <label htmlFor="search-input-compact" className="sr-only">Search query</label>
          <input
            ref={inputRef}
            id="search-input-compact"
            type="search"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search OptiTech..."
            autoComplete="off"
            spellCheck={false}
            aria-label="Search query"
            aria-controls="search-results"
            aria-autocomplete="list"
            className={[
              'flex-1 bg-transparent text-fg placeholder:text-fg-muted/40',
              'text-[15px] font-medium outline-none leading-none py-[2px]',
              '[&::-webkit-search-cancel-button]:hidden',
            ].join(' ')}
          />
          <div className="flex items-center gap-[1px] shrink-0">
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                aria-label="Clear"
                className="p-[6px] text-fg-muted/45 hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-brand"
              >
                <X size={12} />
              </button>
            )}
            <button
              type="button"
              onClick={toggleMode}
              aria-label="Switch to full search"
              className="p-[6px] text-fg-muted/45 hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-brand"
            >
              <Maximize2 size={13} />
            </button>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="p-[6px] text-fg-muted/45 hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-brand"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Filter + topic row */}
        <div className="flex items-center flex-wrap gap-0 px-md border-b border-fg/8 shrink-0">
          {FilterMetrics({ size: 'compact' })}
          {showTopics && (
            <>
              <span className="w-px h-4 bg-fg/10 mx-sm self-center" aria-hidden />
              {TopicChips({ compact: true })}
            </>
          )}
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          id="search-results"
          role="region"
          aria-label="Search results"
          aria-live="polite"
          className="overflow-y-auto flex-1"
        >
          {loading && (
            <div className="px-md">
              {LoadingDots()}
            </div>
          )}

          {!loading && !hasSearched && SuggestedQueries({ compact: true })}

          {!loading && hasSearched && filteredResults.length === 0 && (
            <p className="px-md py-md text-[14px] font-medium text-fg-muted/60">
              No results for{' '}
              <span className="text-fg font-semibold">"{query}"</span>
            </p>
          )}

          {!loading && filteredResults.length > 0 && (
            <ul>
              {filteredResults.map((result, i) =>
                ResultItem({ result, index: i, compact: true })
              )}
            </ul>
          )}
        </div>
      </div>
    )
  }

  // ─── Portal output ─────────────────────────────────────────────────────────

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay for compact mode */}
          {mode === 'compact' && (
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-hidden
              onClick={closeSearch}
              className="fixed inset-0 z-[48] bg-canvas/65 backdrop-blur-[2px]"
            />
          )}

          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={
              mode === 'immersive'
                // Full-screen canvas — above nav
                ? 'fixed inset-0 z-[60] bg-canvas flex flex-col'
                // HUD panel below nav — bg-canvas adapts to theme, solid + opaque
                : 'fixed left-0 right-0 top-20 z-[49] flex flex-col bg-canvas border-b border-fg/10 shadow-[0_8px_48px_oklch(0%_0_0_/_0.22)]'
            }
          >
            {mode === 'immersive' ? ImmersivePanel() : CompactPanel()}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
