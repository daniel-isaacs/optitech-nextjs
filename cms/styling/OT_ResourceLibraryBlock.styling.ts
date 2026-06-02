import type { ResourceLibraryStyleOptions } from '@/components/blocks/ResourceLibraryBlock'

export function getResourceLibraryStyles(
  s: Record<string, string | boolean>,
): ResourceLibraryStyleOptions {
  return {
    layout:       (s.layout       ?? 'list') as ResourceLibraryStyleOptions['layout'],
    color:        (s.color        ?? 'canvas') as ResourceLibraryStyleOptions['color'],
    showFileSize: s.showFileSize === 'show' || s.showFileSize === true,
    filterType:   (s.filterType   ?? 'all') as ResourceLibraryStyleOptions['filterType'],
  }
}
