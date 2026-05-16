import type { QuoteStyleOptions } from '@/components/blocks/QuoteBlock'

export function getQuoteStyles(s: Record<string, string | boolean>): QuoteStyleOptions {
  return {
    color:     (s.color     ?? 'canvas') as QuoteStyleOptions['color'],
    alignment: (s.alignment ?? 'left')   as QuoteStyleOptions['alignment'],
    size:      (s.size      ?? 'large')  as QuoteStyleOptions['size'],
  }
}
