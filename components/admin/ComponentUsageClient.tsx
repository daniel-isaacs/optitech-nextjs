'use client'

import { useState, useCallback } from 'react'
import { Search, ExternalLink, Globe, FileBox, ChevronDown } from 'lucide-react'
import { ADMIN_BLOCK_TYPES } from '@/lib/admin/contentTypes'
import type { ComponentUsageResult, PageUsage } from '@/lib/admin/graph'

// ─── Sub-components ───────────────────────────────────────────────────────────

function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-[6px] bg-brand/[0.09] text-brand text-[0.6875rem] font-semibold tabular-nums">
      {count}
    </span>
  )
}

function StatusChip({ status }: { status: string | null }) {
  const s = (status ?? '').toLowerCase()
  const cls =
    s === 'published' ? 'text-accent bg-accent/[0.10]' :
    s === 'scheduled' ? 'text-brand bg-brand/[0.10]'  :
    s === 'previous'  ? 'text-fg-muted bg-fg/[0.06]'  :
                        'text-fg-muted/60 bg-fg/[0.04]'
  return (
    <span className={`text-[0.65rem] font-semibold uppercase tracking-[0.05em] px-[5px] py-[2px] ${cls}`}>
      {status ?? '—'}
    </span>
  )
}

function PageRow({ page }: { page: PageUsage }) {
  const displayUrl = page.url
    ? page.url.replace(/^https?:\/\/[^/]+/, '') || '/'
    : null

  // Show the site host if there are results from multiple sites
  const host = page.baseUrl
    ? page.baseUrl.replace(/^https?:\/\//, '')
    : null

  return (
    <li className="border-b border-fg/[0.06] last:border-none">
      <div className="flex items-center gap-md px-lg py-[10px] hover:bg-fg/[0.025] transition-colors duration-100">
        {/* Title + URL */}
        <div className="flex-1 min-w-0">
          <p className="text-[0.875rem] font-medium text-fg truncate">
            {page.displayName || displayUrl || page.pageKey}
          </p>
          <div className="flex items-center gap-xs mt-[2px] flex-wrap">
            {displayUrl && (
              <span className="text-[0.75rem] text-fg-muted truncate">{displayUrl}</span>
            )}
            {host && (
              <span className="text-[0.65rem] text-fg-muted/40 font-mono">{host}</span>
            )}
          </div>
        </div>

        {/* Locale */}
        <span className="text-[0.75rem] text-fg-muted/60 font-medium w-10 text-center shrink-0 hidden sm:block">
          {page.locale ?? '—'}
        </span>

        {/* Status */}
        <div className="shrink-0 hidden md:flex">
          <StatusChip status={page.status} />
        </div>

        {/* Count */}
        <div className="shrink-0 w-14 flex justify-end">
          <CountBadge count={page.count} />
        </div>

        {/* External link */}
        {page.url && (
          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${page.displayName} in new tab`}
            className="shrink-0 text-fg-muted/40 hover:text-brand transition-colors duration-100"
          >
            <ExternalLink size={13} strokeWidth={1.75} />
          </a>
        )}
      </div>
    </li>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ComponentUsageClient({ initialType }: { initialType?: string }) {
  const [selectedType, setSelectedType] = useState(initialType ?? ADMIN_BLOCK_TYPES[0].key)
  const [loading,      setLoading]      = useState(false)
  const [result,       setResult]       = useState<ComponentUsageResult | null>(null)
  const [error,        setError]        = useState<string | null>(null)

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res  = await fetch(`/api/opti-admin/component-usage?type=${encodeURIComponent(selectedType)}`)
      const data = await res.json() as ComponentUsageResult & { error?: string }
      if (!res.ok) { setError(data.error ?? 'Search failed.'); return }
      setResult(data)
    } catch {
      setError('Could not reach the server.')
    } finally {
      setLoading(false)
    }
  }, [selectedType])

  const typeName = ADMIN_BLOCK_TYPES.find(t => t.key === selectedType)?.displayName ?? selectedType

  const inputCls = [
    'w-full appearance-none border border-fg/[0.12] bg-canvas px-md pr-[36px] py-[9px]',
    'text-[0.875rem] font-medium text-fg',
    'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
    'transition-[border-color,box-shadow] duration-150 rounded-input',
  ].join(' ')

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="flex items-end gap-sm flex-wrap">
        <div className="flex flex-col gap-xs flex-1 min-w-[200px]">
          <label
            htmlFor="component-type-select"
            className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-fg-muted"
          >
            Component type
          </label>
          <div className="relative">
            <select
              id="component-type-select"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className={inputCls}
            >
              {(['content', 'data', 'media', 'layout'] as const).map(cat => (
                <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                  {ADMIN_BLOCK_TYPES.filter(t => t.category === cat).map(t => (
                    <option key={t.key} value={t.key}>{t.displayName}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown
              size={14} strokeWidth={1.75}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-fg-muted/50 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className={[
            'flex items-center gap-sm px-lg py-[9px]',
            'bg-brand text-fg-on-brand text-[0.8125rem] font-semibold uppercase tracking-[0.06em]',
            'hover:bg-brand-hover transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ].join(' ')}
        >
          <Search size={14} strokeWidth={2} aria-hidden="true" />
          {loading ? 'Scanning…' : 'Search'}
        </button>
      </div>

      {/* Note for block types */}
      <p className="mt-sm text-[0.75rem] text-fg-muted/60">
        Block types are found by scanning Visual Builder experience compositions.
      </p>

      {/* ── Error ── */}
      {error && (
        <p role="alert" className="mt-lg text-[0.875rem] text-fg border border-fg/[0.08] px-md py-sm">
          {error}
        </p>
      )}

      {/* ── Results ── */}
      {result && (
        <div className="mt-xl">
          {/* Summary */}
          <p className="text-[0.875rem] text-fg-muted mb-md">
            <strong className="text-fg font-semibold">{result.pages.length}</strong>
            {' '}page{result.pages.length !== 1 ? 's' : ''} using{' '}
            <strong className="text-fg font-semibold">{typeName}</strong>
            {result.total !== result.pages.length && (
              <>&nbsp;·&nbsp;
                <strong className="text-fg font-semibold">{result.total}</strong>
                {' '}total instance{result.total !== 1 ? 's' : ''}
              </>
            )}
          </p>

          {/* Table */}
          <div className="border border-fg/[0.08]">
            {/* Header */}
            <div className="flex items-center gap-md px-lg py-[8px] bg-fg/[0.02] border-b border-fg/[0.06]">
              <p className="flex-1 text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-fg-muted/70">Page</p>
              <p className="w-10 text-center shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-fg-muted/70 hidden sm:block">Locale</p>
              <p className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-fg-muted/70 hidden md:block">Status</p>
              <p className="w-14 text-right shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-fg-muted/70">Uses</p>
              <div className="w-5 shrink-0" />
            </div>

            {/* Rows */}
            <ul>
              {result.pages.length === 0 ? (
                <li className="flex flex-col items-center gap-sm py-xl px-lg text-center">
                  <Globe size={24} strokeWidth={1.25} className="text-fg-muted/30" aria-hidden="true" />
                  <p className="text-[0.875rem] text-fg-muted">
                    No pages found using <strong>{typeName}</strong>.
                  </p>
                  <p className="text-[0.75rem] text-fg-muted/60">
                    This type may not be placed in any published experiences yet.
                  </p>
                </li>
              ) : (
                result.pages.map(page => <PageRow key={page.pageKey} page={page} />)
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ── Pre-search empty state ── */}
      {!result && !loading && !error && (
        <div className="mt-2xl flex flex-col items-center gap-md text-center">
          <FileBox size={32} strokeWidth={1} className="text-fg-muted/20" aria-hidden="true" />
          <div>
            <p className="text-[0.9375rem] font-medium text-fg-muted">Select a component type and click Search</p>
            <p className="text-[0.8125rem] text-fg-muted/60 mt-xs">
              The scanner traverses all Visual Builder experiences to find where each block type is used.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
