import { displayTemplate } from '@optimizely/cms-sdk'

export const OT_StatBlockDefault = displayTemplate({
  key:         'OT_StatBlockDefault',
  displayName: 'Stat Block',
  contentType: 'OT_StatBlock',
  isDefault:   true,
  settings: {
    color: {
      displayName: 'Background',
      editor:      'select',
      sortOrder:   10,
      choices: {
        brand:   { displayName: 'Brand (Default)', sortOrder: 10 },
        canvas:  { displayName: 'Canvas',          sortOrder: 20 },
        surface: { displayName: 'Surface',         sortOrder: 30 },
      },
    },
    columns: {
      displayName: 'Columns',
      editor:      'select',
      sortOrder:   20,
      choices: {
        col2: { displayName: '2 columns — heroic scale',   sortOrder: 10 },
        col3: { displayName: '3 columns — standard',       sortOrder: 20 },
        col4: { displayName: '4 columns — compact',        sortOrder: 30 },
      },
    },
    showIcons: {
      displayName: 'Show icons',
      editor:      'select',
      sortOrder:   30,
      choices: {
        false: { displayName: 'Off (Default)', sortOrder: 10 },
        true:  { displayName: 'On',            sortOrder: 20 },
      },
    },
    animate: {
      displayName: 'Animate count-up on scroll',
      editor:      'select',
      sortOrder:   40,
      choices: {
        true:  { displayName: 'On (Default)', sortOrder: 10 },
        false: { displayName: 'Off',          sortOrder: 20 },
      },
    },
  },
})
