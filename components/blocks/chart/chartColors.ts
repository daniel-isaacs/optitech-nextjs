import type { ChartStyleOptions } from '@/cms/styling/OT_ChartBlock.styling'

export const CHART_PALETTES: Record<string, string[]> = {
  brand:     ['var(--ot-brand)', '#2dd4bf', '#0d9488', '#134e4a'],
  warm:      ['#f59e0b', '#ef4444', '#f97316', '#dc2626'],
  cool:      ['#3b82f6', '#6366f1', '#0ea5e9', '#8b5cf6'],
  diverging: ['var(--ot-brand)', '#2dd4bf', '#f59e0b', '#ef4444'],
  mono: [
    'rgba(255,255,255,0.95)',
    'rgba(255,255,255,0.65)',
    'rgba(255,255,255,0.40)',
    'rgba(255,255,255,0.20)',
  ],
}

export type ChartTheme = {
  gridColor:     string
  axisColor:     string
  tickColor:     string
  tooltipBg:     string
  tooltipBorder: string
  tooltipText:   string
  legendColor:   string
  cursorFill:    string
}

export function getChartTheme(color: ChartStyleOptions['color']): ChartTheme {
  switch (color) {
    case 'surface':
      return {
        gridColor:     'rgba(255,255,255,0.06)',
        axisColor:     'transparent',
        tickColor:     'var(--ot-fg-muted)',
        tooltipBg:     'var(--ot-canvas)',
        tooltipBorder: 'rgba(255,255,255,0.10)',
        tooltipText:   'var(--ot-fg)',
        legendColor:   'var(--ot-fg-muted)',
        cursorFill:    'rgba(255,255,255,0.04)',
      }
    case 'brand':
      return {
        gridColor:     'rgba(255,255,255,0.10)',
        axisColor:     'transparent',
        tickColor:     'rgba(255,255,255,0.60)',
        tooltipBg:     'rgba(0,0,0,0.70)',
        tooltipBorder: 'rgba(255,255,255,0.15)',
        tooltipText:   'rgba(255,255,255,0.95)',
        legendColor:   'rgba(255,255,255,0.70)',
        cursorFill:    'rgba(255,255,255,0.06)',
      }
    case 'glass':
      // glass assumes a dark background context
      return {
        gridColor:     'rgba(255,255,255,0.10)',
        axisColor:     'transparent',
        tickColor:     'rgba(255,255,255,0.60)',
        tooltipBg:     'rgba(0,0,0,0.70)',
        tooltipBorder: 'rgba(255,255,255,0.15)',
        tooltipText:   'rgba(255,255,255,0.95)',
        legendColor:   'rgba(255,255,255,0.70)',
        cursorFill:    'rgba(255,255,255,0.06)',
      }
    case 'canvas':
    default:
      return {
        gridColor:     'rgba(255,255,255,0.06)',
        axisColor:     'transparent',
        tickColor:     'var(--ot-fg-muted)',
        tooltipBg:     'var(--ot-surface)',
        tooltipBorder: 'rgba(255,255,255,0.10)',
        tooltipText:   'var(--ot-fg)',
        legendColor:   'var(--ot-fg-muted)',
        cursorFill:    'rgba(255,255,255,0.04)',
      }
  }
}
