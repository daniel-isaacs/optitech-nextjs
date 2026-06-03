import type { ResourceLibraryStyleOptions } from '@/components/blocks/ResourceLibraryBlock'

export function getResourceLibraryStyles(
  s: Record<string, string | boolean>,
): ResourceLibraryStyleOptions {
  const rawPageSize = parseInt(String(s.pageSize ?? '12'), 10)
  return {
    layout:       (s.layout       ?? 'list') as ResourceLibraryStyleOptions['layout'],
    color:        (s.color        ?? 'canvas') as ResourceLibraryStyleOptions['color'],
    showFileSize: s.showFileSize === 'show' || s.showFileSize === true,
    filterType:   (s.filterType   ?? 'all') as ResourceLibraryStyleOptions['filterType'],
    pageSize:     [6, 9, 12, 24].includes(rawPageSize) ? rawPageSize : 12,
  }
}
