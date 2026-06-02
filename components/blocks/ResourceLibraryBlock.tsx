import {
  File,
  FileText,
  Image as LucideImage,
  Video,
  Archive,
  ArrowDownToLine,
  FolderOpen,
  AlertCircle,
  LucideIcon,
} from 'lucide-react'
import { cva } from 'class-variance-authority'
import type { ResourceAsset } from '@/lib/resourceLibrary'

// ─── Style option types ───────────────────────────────────────────────────────

export type ResourceLibraryStyleOptions = {
  layout:       'list' | 'grid'
  color:        'canvas' | 'surface'
  showFileSize: boolean
  filterType:   'all' | 'documents' | 'images' | 'video'
}

// ─── CVA variant configs ──────────────────────────────────────────────────────

const sectionCva = cva('px-md lg:px-lg py-lg', {
  variants: {
    color: {
      canvas:  'bg-canvas',
      surface: 'bg-surface',
    },
  },
  defaultVariants: { color: 'canvas' },
})

const cardCva = cva(
  'flex flex-col overflow-hidden border border-fg/8 motion-safe:transition-shadow motion-safe:duration-200',
  {
    variants: {
      color: {
        canvas:  'bg-surface',
        surface: 'bg-canvas/50',
      },
    },
    defaultVariants: { color: 'canvas' },
  },
)

// ─── File type → icon + label mapping ────────────────────────────────────────

type FileKind = {
  icon:  LucideIcon
  label: string
}

function resolveFileKind(extension: string | null): FileKind {
  const ext = (extension ?? '').toLowerCase().replace(/^\./, '')
  if (['pdf'].includes(ext))
    return { icon: FileText, label: 'PDF' }
  if (['doc', 'docx', 'odt', 'rtf'].includes(ext))
    return { icon: FileText, label: ext.toUpperCase() }
  if (['ppt', 'pptx', 'odp', 'key'].includes(ext))
    return { icon: File, label: ext.toUpperCase() }
  if (['xls', 'xlsx', 'ods', 'csv'].includes(ext))
    return { icon: File, label: ext.toUpperCase() }
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'bmp', 'tiff'].includes(ext))
    return { icon: LucideImage, label: ext.toUpperCase() }
  if (['mp4', 'mov', 'avi', 'webm', 'mkv', 'wmv'].includes(ext))
    return { icon: Video, label: ext.toUpperCase() }
  if (['zip', 'rar', 'tar', 'gz', '7z', 'bz2'].includes(ext))
    return { icon: Archive, label: ext.toUpperCase() }
  return { icon: File, label: ext ? ext.toUpperCase() : 'FILE' }
}

// ─── File size formatter ──────────────────────────────────────────────────────

function formatFileSize(bytes: number | null): string | null {
  if (bytes === null || bytes <= 0) return null
  if (bytes < 1024)             return `${bytes} B`
  if (bytes < 1024 * 1024)      return `${Math.round(bytes / 1024)} KB`
  if (bytes < 1024 ** 3)        return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

// ─── Download filename helper ─────────────────────────────────────────────────

function downloadFilename(asset: ResourceAsset): string {
  const ext = asset.extension ? `.${asset.extension.replace(/^\./, '')}` : ''
  return `${asset.title}${ext}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IconChip({
  icon: Icon,
  size = 'md',
}: {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeCls = {
    sm: 'w-8 h-8 [&>svg]:w-4 [&>svg]:h-4',
    md: 'w-10 h-10 [&>svg]:w-5 [&>svg]:h-5',
    lg: 'w-12 h-12 [&>svg]:w-6 [&>svg]:h-6',
  }[size]

  return (
    <div
      className={`shrink-0 flex items-center justify-center bg-brand/10 text-brand ${sizeCls}`}
      aria-hidden="true"
    >
      <Icon />
    </div>
  )
}

function ExtBadge({ label }: { label: string }) {
  return (
    <span className="text-label tracking-label uppercase font-semibold text-fg-muted border border-fg/10 px-[6px] py-px">
      {label}
    </span>
  )
}

// ─── List row ─────────────────────────────────────────────────────────────────

function ListRow({ asset, showFileSize }: { asset: ResourceAsset; showFileSize: boolean }) {
  const { icon, label } = resolveFileKind(asset.extension)
  const size = formatFileSize(asset.fileSize)
  const filename = downloadFilename(asset)

  return (
    <a
      href={asset.url}
      download={filename}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-md px-md py-[14px] border-t border-fg/5 hover:bg-fg/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-0 motion-safe:transition-colors motion-safe:duration-150"
      aria-label={`Download ${asset.title} (${label}${size ? `, ${size}` : ''})`}
    >
      {/* Icon chip */}
      <IconChip icon={icon} size="md" />

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium text-fg leading-tight truncate">{asset.title}</p>
        {asset.description && (
          <p className="text-label text-fg-muted mt-[2px] truncate">{asset.description}</p>
        )}
      </div>

      {/* Meta: badge + size */}
      <div className="hidden sm:flex items-center gap-sm shrink-0">
        <ExtBadge label={label} />
        {showFileSize && size && (
          <span className="text-label text-fg-muted font-semibold tracking-label tabular-nums">
            {size}
          </span>
        )}
      </div>

      {/* Download arrow */}
      <div
        className="shrink-0 ml-sm text-brand opacity-60 group-hover:opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-150 group-hover:translate-x-1"
        aria-hidden="true"
      >
        <ArrowDownToLine className="w-5 h-5" />
      </div>
    </a>
  )
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function GridCard({
  asset,
  color,
  showFileSize,
}: {
  asset: ResourceAsset
  color: 'canvas' | 'surface'
  showFileSize: boolean
}) {
  const { icon, label } = resolveFileKind(asset.extension)
  const size = formatFileSize(asset.fileSize)
  const filename = downloadFilename(asset)

  return (
    <div className={cardCva({ color })}>
      {/* Brand header band with icon */}
      <div className="bg-brand flex items-center justify-center h-20 shrink-0">
        <div className="text-fg-on-brand opacity-80" aria-hidden="true">
          {(() => { const Icon = icon; return <Icon className="w-9 h-9" /> })()}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-sm px-md pt-md pb-md flex-1">
        <p className="text-title font-semibold text-fg leading-snug line-clamp-2">{asset.title}</p>
        <div className="flex items-center gap-sm">
          <ExtBadge label={label} />
          {showFileSize && size && (
            <span className="text-label text-fg-muted font-semibold tracking-label tabular-nums">
              {size}
            </span>
          )}
        </div>
        {asset.description && (
          <p className="text-label text-fg-muted line-clamp-2">{asset.description}</p>
        )}
      </div>

      {/* Download CTA */}
      <a
        href={asset.url}
        download={filename}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-sm px-md py-sm border-t border-fg/8 text-label font-semibold tracking-label uppercase text-fg-muted hover:text-fg hover:bg-fg/5 motion-safe:transition-colors motion-safe:duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
        aria-label={`Download ${asset.title} (${label}${size ? `, ${size}` : ''})`}
      >
        <ArrowDownToLine className="w-4 h-4" aria-hidden="true" />
        Download
      </a>
    </div>
  )
}

// ─── Empty + error states ─────────────────────────────────────────────────────

function EmptyState({
  message,
  sub,
}: {
  message: string
  sub?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-xl gap-md text-center">
      <FolderOpen className="w-10 h-10 text-fg-muted opacity-40" aria-hidden="true" />
      <div>
        <p className="text-title font-semibold text-fg-muted">{message}</p>
        {sub && <p className="text-label text-fg-muted/60 mt-xs">{sub}</p>}
      </div>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="flex items-center justify-center gap-sm py-xl text-fg-muted">
      <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <p className="text-label font-semibold uppercase tracking-label">
        Files could not be loaded at this time
      </p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export type ResourceLibraryBlockProps = {
  eyebrow?:     string
  title?:       string
  assets:       ResourceAsset[] | null
  styleOptions?: Partial<ResourceLibraryStyleOptions>
  pa?:          (prop: string) => { 'data-epi-property-name'?: string }
}

export default function ResourceLibraryBlock({
  eyebrow,
  title,
  assets,
  styleOptions = {},
  pa = () => ({}),
}: ResourceLibraryBlockProps) {
  const {
    layout       = 'list',
    color        = 'canvas',
    showFileSize = false,
  } = styleOptions

  // assets === null means the anchor asset was not configured
  const unconfigured = assets === null
  const empty = !unconfigured && assets.length === 0

  return (
    <section className={sectionCva({ color })}>
      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-sm mb-md">
        <div>
          {eyebrow && (
            <p
              className="text-label tracking-label uppercase font-semibold text-fg-muted mb-xs"
              {...pa('eyebrow')}
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              className="text-title font-semibold text-fg leading-tight"
              {...pa('title')}
            >
              {title}
            </h2>
          )}
        </div>

        {/* File count badge — only shown when assets are loaded */}
        {!unconfigured && !empty && (
          <span className="text-label tracking-label uppercase font-semibold text-fg-muted border border-fg/10 px-sm py-xs">
            {assets!.length} {assets!.length === 1 ? 'file' : 'files'}
          </span>
        )}
      </div>

      {/* ── Content ── */}
      {unconfigured ? (
        <EmptyState
          message="No collection selected"
          sub="Browse DAM and pick an anchor asset to populate this library."
        />
      ) : empty ? (
        <EmptyState
          message="No files available"
          sub="This collection is empty or no files match the current filter."
        />
      ) : layout === 'list' ? (
        /* Dense list */
        <div className="border border-fg/8" role="list" aria-label={title ?? 'Resource library'}>
          {assets!.map((asset, i) => (
            <div key={`${asset.url}-${i}`} role="listitem">
              <ListRow asset={asset} showFileSize={showFileSize} />
            </div>
          ))}
        </div>
      ) : (
        /* Card grid */
        <div
          className="grid gap-md"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
          role="list"
          aria-label={title ?? 'Resource library'}
        >
          {assets!.map((asset, i) => (
            <div key={`${asset.url}-${i}`} role="listitem">
              <GridCard asset={asset} color={color} showFileSize={showFileSize} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ErrorState is exported so the adapter can render it on Graph failures
export { ErrorState }
