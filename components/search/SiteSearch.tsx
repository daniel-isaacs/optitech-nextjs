'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Search, X, Maximize2, Minimize2 } from 'lucide-react'
import { useSearch } from './SearchProvider'
import type { SearchResult } from '@/lib/search'

type DisplayMode = 'immersive' | 'compact'
type TypeFilter  = 'all' | 'Blog' | 'Page'

const DISPLAY_MODE_KEY  = 'ot-search-mode'
const SUGGESTED_QUERIES = ['Product', 'Technology', 'AI', 'Design', 'Platform']

const TYPE_CHIPS: { value: TypeFilter; label: string }[] = [
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
    visible: { y: 0,       transition: { duration: dur(400), ease: [0.16, 1, 0.3, 1] as const } },
    exit:    { y: '-100%', transition: { duration: dur(260), ease: [0.4, 0, 0.2, 1]  as const } },
  }

  const overlayVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: dur(220) } },
    exit:    { opacity: 0, transition: { duration: dur(160) } },
  }

  if (!mounted) return null

  // ─── Segmented type control + floating topic chips ─────────────────────────
  // Called as FilterBar({ ... }) — not as JSX element — to avoid remount on
  // every keystroke.

  function FilterBar({ large }: { large: boolean }) {
    return (
      <div className="flex items-center flex-wrap gap-sm">

        {/* Segmented type control — joined borders collapse at -ml-px */}
        <div role="group" aria-label="Content type filter" className="flex">
          {TYPE_CHIPS.map((chip, i) => {
            const isActive = typeFilter === chip.value
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => handleTypeFilter(chip.value)}
                aria-pressed={isActive}
                className={[
                  large ? 'px-sm py-[3px]' : 'px-xs py-[2px]',
                  'text-label uppercase tracking-label border',
                  'transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0',
                  i > 0 ? '-ml-px' : '',
                  isActive
                    ? 'bg-brand text-fg-on-brand border-brand relative z-[1]'
                    : 'border-fg/20 text-fg-muted hover:text-fg hover:border-fg/40',
                ].join(' ')}
              >
                {chip.label}
              </button>
            )
          })}
        </div>

        {/* Topic chips — appear when blog results have topics */}
        {showTopics && (
          <>
            <span aria-hidden="true" className="w-px h-3.5 bg-fg/15 shrink-0" />
            <div className="flex items-center flex-wrap gap-xs">
              {availableTopics.map(topic => {
                const isActive = topicFilter === topic
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setTopicFilter(isActive ? null : topic)}
                    aria-pressed={isActive}
                    className={[
                      large ? 'px-sm py-[3px]' : 'px-xs py-[2px]',
                      'text-label uppercase tracking-label border',
                      'transition-all duration-150 focus-visible:outline-none',
                      isActive
                        ? 'bg-brand/20 text-brand border-brand/50'
                        : 'border-fg/15 text-fg-muted/60 hover:border-brand/40 hover:text-brand/80',
                    ].join(' ')}
                  >
                    {topic}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    )
  }

  // ─── Loading indicator ─────────────────────────────────────────────────────

  function LoadingDots({ compact: isCompact }: { compact: boolean }) {
    return (
      <div
        className={`flex items-center gap-xs ${isCompact ? 'px-md py-sm' : 'py-md'}`}
        aria-label="Searching"
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="block w-[7px] h-[7px] bg-brand/50 motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    )
  }

  // ─── Suggested query chips ─────────────────────────────────────────────────

  function SuggestedQueries({ compact: isCompact }: { compact: boolean }) {
    return (
      <div className={isCompact ? 'px-md py-sm flex flex-wrap items-center gap-xs' : 'py-md'}>
        {!isCompact && (
          <p className="text-label uppercase tracking-label text-fg-muted/40 mb-sm">Suggested</p>
        )}
        <div className="flex flex-wrap items-center gap-xs">
          {isCompact && (
            <span className="text-label uppercase tracking-label text-fg-muted/40 mr-xs select-none">
              Try
            </span>
          )}
          {SUGGESTED_QUERIES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => handleQueryChange(s)}
              className={[
                isCompact ? 'px-xs py-[2px]' : 'px-sm py-xs',
                'text-label uppercase tracking-label',
                'border border-fg/10 text-fg-muted/50',
                'hover:border-brand/40 hover:text-brand/70',
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

  // ─── Result item — compact ─────────────────────────────────────────────────
  // Spacious card layout: thumbnail left, title + excerpt + metadata right.

  function ResultItemCompact({ result, index }: { result: SearchResult; index: number }) {
    const date      = formatDate(result.published)
    const isFocused = focusedIdx === index
    const hasThumbnail = !!result.imageUrl && result.type === 'Blog'

    return (
      <li key={result.id}>
        <button
          data-result-item
          tabIndex={isFocused ? 0 : -1}
          type="button"
          onClick={() => handleResultClick(result.url)}
          className={[
            'group w-full text-left',
            'px-md py-md border-b border-fg/5 last:border-b-0',
            'flex items-start gap-md',
            'hover:bg-fg/5 focus-visible:outline-none focus-visible:bg-fg/5',
            'transition-colors duration-100',
            isFocused ? 'bg-fg/5' : '',
          ].join(' ')}
        >
          {/* Thumbnail */}
          {hasThumbnail && (
            <div className="shrink-0 w-14 h-14 overflow-hidden bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.imageUrl!}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-md">
              <span className="text-base font-semibold text-fg leading-snug line-clamp-2 group-hover:text-brand transition-colors duration-150">
                {result.title}
              </span>
              <span className="shrink-0 text-label uppercase tracking-label text-fg-muted pt-[2px]">
                {result.type}
              </span>
            </div>

            {result.excerpt && (
              <p className="text-sm text-fg-muted mt-[5px] line-clamp-2 leading-relaxed">
                {result.excerpt}
              </p>
            )}

            {(result.topic || date) && (
              <div className="flex items-center gap-sm mt-[5px]">
                {result.topic && (
                  <span className="text-label uppercase tracking-label text-brand">{result.topic}</span>
                )}
                {date && (
                  <span className="text-label text-fg-muted/55">{date}</span>
                )}
              </div>
            )}
          </div>
        </button>
      </li>
    )
  }

  // ─── Result item — immersive ───────────────────────────────────────────────
  // Editorial layout: arrow + optional thumbnail + title + excerpt + metadata.

  function ResultItemImmersive({ result, index }: { result: SearchResult; index: number }) {
    const date      = formatDate(result.published)
    const isFocused = focusedIdx === index
    const hasThumbnail = !!result.imageUrl && result.type === 'Blog'

    return (
      <li key={result.id}>
        <button
          data-result-item
          tabIndex={isFocused ? 0 : -1}
          type="button"
          onClick={() => handleResultClick(result.url)}
          className={[
            'group w-full text-left py-md',
            'border-t border-fg/10',
            'flex items-start gap-md',
            'hover:bg-fg/5 focus-visible:outline-none focus-visible:bg-fg/5',
            'transition-colors duration-100',
            isFocused ? 'bg-fg/5' : '',
          ].join(' ')}
        >
          {/* Arrow */}
          <span
            aria-hidden="true"
            className="shrink-0 mt-1 text-fg-muted/25 group-hover:text-brand group-focus-visible:text-brand transition-colors duration-150 font-mono text-sm"
          >
            →
          </span>

          {/* Thumbnail */}
          {hasThumbnail && (
            <div className="shrink-0 w-16 h-16 overflow-hidden bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.imageUrl!}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Text */}
          <div className="flex-1 min-w-0">
            <span className="block text-title font-semibold text-fg leading-snug group-hover:text-brand transition-colors duration-150">
              {result.title}
            </span>

            {result.excerpt && (
              <p className="text-sm text-fg-muted mt-[6px] line-clamp-2 leading-relaxed">
                {result.excerpt}
              </p>
            )}

            <div className="flex items-center gap-xs mt-[6px] flex-wrap">
              <span className="text-label uppercase tracking-label text-brand">{result.type}</span>
              {result.topic && (
                <>
                  <span aria-hidden="true" className="text-fg/20 text-label">·</span>
                  <span className="text-label uppercase tracking-label text-fg-muted">{result.topic}</span>
                </>
              )}
              {date && (
                <>
                  <span aria-hidden="true" className="text-fg/20 text-label">—</span>
                  <span className="text-label text-fg-muted/55">{date}</span>
                </>
              )}
            </div>
          </div>
        </button>
      </li>
    )
  }

  // ─── Immersive panel ───────────────────────────────────────────────────────
  // Dark canvas with teal atmospheric glow — brand presence without flooding
  // the surface with bright color, keeping all text readable.

  function ImmersivePanel() {
    return (
      <div className="flex flex-col h-full overflow-hidden">

        {/* Header area: teal radial glow emanates from top-center */}
        <div
          style={{
            background: 'radial-gradient(ellipse 90% 110% at 50% -10%, oklch(55% 0.18 195 / 0.16) 0%, transparent 62%)',
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-md pt-md lg:px-xl shrink-0">
            <span className="text-label uppercase tracking-label text-fg-muted/45 select-none">
              OptiTech
            </span>
            <div className="flex items-center gap-xs">
              <button
                type="button"
                onClick={toggleMode}
                aria-label="Switch to compact mode"
                className="p-sm text-fg-muted/45 hover:text-fg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                <Minimize2 size={15} />
              </button>
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="p-sm text-fg-muted/45 hover:text-fg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* SEARCH hollow wordmark — brand stroke on dark canvas */}
          <div className="px-md lg:px-xl pt-xs pb-0 shrink-0 leading-none select-none" aria-hidden="true">
            <span
              className="font-syne"
              style={{
                fontSize:         'clamp(4rem, 11vw, 9rem)',
                fontWeight:       450,
                lineHeight:       0.88,
                letterSpacing:    '-0.04em',
                WebkitTextStroke: '1.5px var(--ot-brand)',
                color:            'transparent',
                display:          'block',
              }}
            >
              SEARCH
            </span>
          </div>

          {/* Search input */}
          <div className="px-md lg:px-xl pt-md pb-sm shrink-0">
            <div className="relative flex items-center border-b border-fg/15 focus-within:border-brand/80 transition-colors duration-200">
              <Search size={18} className="shrink-0 text-fg-muted/45 mr-sm" aria-hidden="true" />
              <input
                ref={inputRef}
                id="search-input"
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
                  'flex-1 bg-transparent',
                  'text-title font-normal text-fg py-sm outline-none',
                  'placeholder:text-fg-muted/35',
                  '[&::-webkit-search-cancel-button]:hidden',
                ].join(' ')}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleQueryChange('')}
                  aria-label="Clear search"
                  className="shrink-0 p-xs text-fg-muted/45 hover:text-fg transition-colors duration-150"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Filter chips */}
          <div className="px-md lg:px-xl pb-sm shrink-0">
            {FilterBar({ large: true })}
          </div>
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          id="search-results"
          role="region"
          aria-label="Search results"
          aria-live="polite"
          className="flex-1 overflow-y-auto px-md lg:px-xl pb-xl border-t border-fg/8"
        >
          {loading && LoadingDots({ compact: false })}

          {!loading && !hasSearched && SuggestedQueries({ compact: false })}

          {!loading && hasSearched && filteredResults.length === 0 && (
            <div className="py-md">
              <p className="text-title font-semibold text-fg/65">
                No results for <span className="text-fg">"{query}"</span>
              </p>
              <p className="text-label uppercase tracking-label text-fg-muted/40 mt-xs">
                Try different keywords or remove filters
              </p>
            </div>
          )}

          {!loading && filteredResults.length > 0 && (
            <>
              <p className="text-label uppercase tracking-label text-fg-muted/40 py-sm">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
              </p>
              <ul>
                {filteredResults.map((result, i) =>
                  ResultItemImmersive({ result, index: i })
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    )
  }

  // ─── Compact panel ─────────────────────────────────────────────────────────
  // Glass HUD below the nav bar. More spacious than before — py-md per result,
  // text-base titles, excerpt preview, thumbnail for blog posts.

  function CompactPanel() {
    return (
      <div className="flex flex-col overflow-hidden" style={{ maxHeight: '72vh' }}>

        {/* Input row */}
        <div className="flex items-center gap-sm px-md py-sm border-b border-fg/10 shrink-0">
          <Search size={16} className="shrink-0 text-fg-muted/55" aria-hidden="true" />
          <input
            ref={inputRef}
            id="search-input"
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
              'flex-1 bg-transparent text-fg placeholder:text-fg-muted/50',
              'text-base outline-none leading-none py-[3px]',
              '[&::-webkit-search-cancel-button]:hidden',
            ].join(' ')}
          />
          <div className="flex items-center gap-xs shrink-0">
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                aria-label="Clear"
                className="p-xs text-fg-muted/50 hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={toggleMode}
              aria-label="Switch to immersive mode"
              className="p-xs text-fg-muted/50 hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              <Maximize2 size={14} />
            </button>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="p-xs text-fg-muted/50 hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="px-md py-sm border-b border-fg/5 shrink-0">
          {FilterBar({ large: false })}
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
          {loading && LoadingDots({ compact: true })}

          {!loading && !hasSearched && SuggestedQueries({ compact: true })}

          {!loading && hasSearched && filteredResults.length === 0 && (
            <p className="px-md py-md text-base text-fg-muted">
              No results for <span className="text-fg">"{query}"</span>
            </p>
          )}

          {!loading && filteredResults.length > 0 && (
            <ul>
              {filteredResults.map((result, i) =>
                ResultItemCompact({ result, index: i })
              )}
            </ul>
          )}
        </div>
      </div>
    )
  }

  // ─── Portal output ─────────────────────────────────────────────────────────

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Compact backdrop */}
          {mode === 'compact' && (
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-hidden="true"
              onClick={closeSearch}
              className="fixed inset-0 z-[48] bg-canvas/60"
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
                // Full-screen dark canvas — above nav (z-60)
                ? 'fixed inset-0 z-[60] bg-canvas flex flex-col'
                // HUD panel below nav — nav (z-50) covers the curtain animation
                : 'fixed left-0 right-0 top-20 z-[49] bg-glass flex flex-col'
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
