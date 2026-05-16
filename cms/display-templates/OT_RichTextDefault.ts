import { displayTemplate } from '@optimizely/cms-sdk'

export const OT_RichTextDefault = displayTemplate({
  key: 'OT_RichTextDefault',
  displayName: 'Rich Text Default',
  contentType: 'OT_RichTextBlock',
  isDefault: true,
  settings: {
    color: {
      displayName: 'Background color',
      editor: 'select',
      sortOrder: 10,
      choices: {
        canvas:  { displayName: 'Canvas (Default)', sortOrder: 10 },
        brand:   { displayName: 'Brand',            sortOrder: 20 },
        surface: { displayName: 'Surface',                 sortOrder: 30 },
      },
    },
    alignment: {
      displayName: 'Alignment',
      editor: 'select',
      sortOrder: 20,
      choices: {
        left:   { displayName: 'Left (Default)', sortOrder: 10 },
        center: { displayName: 'Centered',        sortOrder: 20 },
      },
    },
    size: {
      displayName: 'Type scale',
      editor: 'select',
      sortOrder: 30,
      choices: {
        editorial: { displayName: 'Editorial (Default)', sortOrder: 10 },
        compact:   { displayName: 'Compact',             sortOrder: 20 },
      },
    },
    treatment: {
      displayName: 'First paragraph',
      editor: 'select',
      sortOrder: 40,
      choices: {
        standard: { displayName: 'Standard (Default)',     sortOrder: 10 },
        lead:     { displayName: 'Lead — Deck size',       sortOrder: 20 },
        dropcap:  { displayName: 'Drop Cap',               sortOrder: 30 },
      },
    },
    ruledHeadings: {
      displayName: 'Ruled headings',
      editor: 'select',
      sortOrder: 50,
      choices: {
        false: { displayName: 'Off (Default)',              sortOrder: 10 },
        true:  { displayName: 'On',                         sortOrder: 20 },
      },
    },
  },
})
