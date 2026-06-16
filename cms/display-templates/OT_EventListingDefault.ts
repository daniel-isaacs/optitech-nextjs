import { displayTemplate } from '@optimizely/cms-sdk'

export const OT_EventListingDefault = displayTemplate({
  key:         'OT_EventListingDefault',
  displayName: 'Event Listing',
  contentType: 'OT_EventListingBlock',
  isDefault:   true,
  settings: {
    defaultView: {
      displayName: 'Default View',
      editor:      'select',
      sortOrder:   10,
      choices: {
        card:     { displayName: 'Card Grid', sortOrder: 10 },
        list:     { displayName: 'List',      sortOrder: 20 },
        calendar: { displayName: 'Calendar',  sortOrder: 30 },
      },
    },
    color: {
      displayName: 'Color',
      editor:      'select',
      sortOrder:   20,
      choices: {
        canvas:  { displayName: 'Canvas',  sortOrder: 10 },
        surface: { displayName: 'Surface', sortOrder: 20 },
      },
    },
    showViewToggle: {
      displayName: 'Show View Toggle',
      editor:      'select',
      sortOrder:   30,
      choices: {
        'true':  { displayName: 'Yes — user can switch views', sortOrder: 10 },
        'false': { displayName: 'No — lock to default view',    sortOrder: 20 },
      },
    },
    showTypeFilter: {
      displayName: 'Show Type Filter',
      editor:      'select',
      sortOrder:   40,
      choices: {
        'true':  { displayName: 'Yes', sortOrder: 10 },
        'false': { displayName: 'No',  sortOrder: 20 },
      },
    },
    showPastEvents: {
      displayName: 'Past Events',
      editor:      'select',
      sortOrder:   50,
      choices: {
        hide:   { displayName: 'Hide past events',           sortOrder: 10 },
        show:   { displayName: 'Show all events',            sortOrder: 20 },
        toggle: { displayName: 'Hide by default, show toggle', sortOrder: 30 },
      },
    },
  },
})
