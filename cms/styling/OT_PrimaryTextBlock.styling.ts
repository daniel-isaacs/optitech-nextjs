import type { PrimaryTextStyleOptions } from '@/components/blocks/PrimaryTextBlock'

export function getPrimaryTextStyles(s: Record<string, string | boolean>): PrimaryTextStyleOptions {
  return {
    alignment: (s.alignment   ?? 'left')     as PrimaryTextStyleOptions['alignment'],
    color:     (s.color       ?? 'canvas')   as PrimaryTextStyleOptions['color'],
    size:      (s.size        ?? 'headline') as PrimaryTextStyleOptions['size'],
    effect:    (s.headerEffect ?? 'none')    as PrimaryTextStyleOptions['effect'],
  }
}
