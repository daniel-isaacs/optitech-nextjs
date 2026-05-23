import type { StatBlockStyleOptions } from '@/components/blocks/StatBlock'

export function getStatBlockStyles(s: Record<string, string | boolean>): StatBlockStyleOptions {
  const rawCols = String(s.columns ?? 'col3')
  const cols    = rawCols === 'col2' || rawCols === '2' ? 2
                : rawCols === 'col4' || rawCols === '4' ? 4
                : 3

  return {
    columns:   cols as 2 | 3 | 4,
    color:     (s.color     ?? 'brand')  as StatBlockStyleOptions['color'],
    showIcons:  s.showIcons === true || s.showIcons === 'true',
    animate:    s.animate   !== false  && s.animate   !== 'false',
  }
}
