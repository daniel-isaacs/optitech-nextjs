export type DividerStyle    = 'mark' | 'bleed' | 'prism'
export type DividerSpace    = 'sm' | 'md' | 'lg' | 'xl'
export type DividerTone     = 'neutral' | 'brand' | 'accent' | 'spectrum' | 'aurora'
export type DividerOrnament = 'none' | 'pendant' | 'asterism' | 'dot'
export type DividerWeight   = 'slim' | 'bold'
export type DividerReveal   = 'static' | 'draw'

export type DividerStyleOptions = {
  style:    DividerStyle
  space:    DividerSpace
  tone:     DividerTone
  ornament: DividerOrnament
  weight:   DividerWeight
  reveal:   DividerReveal
}

export function getDividerStyles(s: Record<string, string | boolean>): DividerStyleOptions {
  return {
    style:    (s.style    ?? 'mark')    as DividerStyle,
    space:    (s.space    ?? 'lg')      as DividerSpace,
    tone:     (s.tone     ?? 'neutral') as DividerTone,
    ornament: (s.ornament ?? 'pendant') as DividerOrnament,
    weight:   (s.weight   ?? 'slim')    as DividerWeight,
    reveal:   (s.reveal   ?? 'static')  as DividerReveal,
  }
}
