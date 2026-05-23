import { contentType } from '@optimizely/cms-sdk'

/**
 * OT_StatBlock — up to 4 metric callouts side-by-side.
 *
 * Each slot is a flat set of string properties (value / label / context / icon).
 * Empty slots are omitted by the adapter. Editors fill as many as they need;
 * the display template's "Columns" setting should match the number of populated slots.
 */
export const OT_StatBlock = contentType({
  key:                  'OT_StatBlock',
  displayName:          'Stat Block',
  baseType:             '_component',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    // ── Stat 1 ──────────────────────────────────────────────────────────────
    stat1Value:   { type: 'string', displayName: 'Stat 1 — Value',   description: 'e.g. "40%", "2M+", "$4.2B"', group: 'OT_Content', sortOrder:  10 },
    stat1Label:   { type: 'string', displayName: 'Stat 1 — Label',   description: 'e.g. "Faster deployment"',   group: 'OT_Content', sortOrder:  20 },
    stat1Context: { type: 'string', displayName: 'Stat 1 — Context', description: 'e.g. "vs. industry avg"',    group: 'OT_Content', sortOrder:  30 },
    stat1Icon:    { type: 'string', displayName: 'Stat 1 — Icon',    description: 'zap | shield | users | trending-up | clock | award | bar-chart | globe | sparkles | check-circle', group: 'OT_Content', sortOrder: 40 },
    // ── Stat 2 ──────────────────────────────────────────────────────────────
    stat2Value:   { type: 'string', displayName: 'Stat 2 — Value',   group: 'OT_Content', sortOrder:  50 },
    stat2Label:   { type: 'string', displayName: 'Stat 2 — Label',   group: 'OT_Content', sortOrder:  60 },
    stat2Context: { type: 'string', displayName: 'Stat 2 — Context', group: 'OT_Content', sortOrder:  70 },
    stat2Icon:    { type: 'string', displayName: 'Stat 2 — Icon',    group: 'OT_Content', sortOrder:  80 },
    // ── Stat 3 ──────────────────────────────────────────────────────────────
    stat3Value:   { type: 'string', displayName: 'Stat 3 — Value',   group: 'OT_Content', sortOrder:  90 },
    stat3Label:   { type: 'string', displayName: 'Stat 3 — Label',   group: 'OT_Content', sortOrder: 100 },
    stat3Context: { type: 'string', displayName: 'Stat 3 — Context', group: 'OT_Content', sortOrder: 110 },
    stat3Icon:    { type: 'string', displayName: 'Stat 3 — Icon',    group: 'OT_Content', sortOrder: 120 },
    // ── Stat 4 ──────────────────────────────────────────────────────────────
    stat4Value:   { type: 'string', displayName: 'Stat 4 — Value',   group: 'OT_Content', sortOrder: 130 },
    stat4Label:   { type: 'string', displayName: 'Stat 4 — Label',   group: 'OT_Content', sortOrder: 140 },
    stat4Context: { type: 'string', displayName: 'Stat 4 — Context', group: 'OT_Content', sortOrder: 150 },
    stat4Icon:    { type: 'string', displayName: 'Stat 4 — Icon',    group: 'OT_Content', sortOrder: 160 },
  },
})
