import { contentType } from '@optimizely/cms-sdk'

/**
 * OT_StatItem — a single metric callout within OT_StatBlock.
 * Not a standalone block; only appears as an array item inside OT_StatBlock.
 */
export const OT_StatItem = contentType({
  key:         'OT_StatItem',
  displayName: 'Stat Item',
  baseType:    '_component',
  properties: {
    value: {
      type:        'string',
      displayName: 'Value',
      description: 'The metric value — prefix + number + suffix. e.g. "40%", "2M+", "$4.2B", "99.99%"',
      group:       'OT_Content',
      sortOrder:   10,
    },
    label: {
      type:        'string',
      displayName: 'Label',
      description: 'Short descriptor shown below the value. e.g. "Faster deployment"',
      group:       'OT_Content',
      sortOrder:   20,
    },
    context: {
      type:        'string',
      displayName: 'Context',
      description: 'Optional supporting line. e.g. "vs. industry average"',
      group:       'OT_Content',
      sortOrder:   30,
    },
    icon: {
      type:        'string',
      displayName: 'Icon',
      description: 'Choose an icon to display alongside this stat. Choices: Zap | Shield | Users | Trending Up | Clock | Award | Bar Chart | Globe | Sparkles | Check Circle',
      group:       'OT_Content',
      sortOrder:   40,
    },
  },
})
