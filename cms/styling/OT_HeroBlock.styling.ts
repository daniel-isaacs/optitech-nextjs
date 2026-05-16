import type { HeroStyleOptions } from '@/components/blocks/HeroBlock'

export function getHeroStyles(s: Record<string, string | boolean>): HeroStyleOptions {
  return {
    layout:    (s.layout    ?? 'imageRight') as HeroStyleOptions['layout'],
    color:     (s.color     ?? 'brand')      as HeroStyleOptions['color'],
    animation: (s.animation ?? 'none')       as HeroStyleOptions['animation'],
  }
}
