import { displayTemplate } from '@optimizely/cms-sdk'

export const OT_PrimaryTextDefault = displayTemplate({
  key: 'OT_PrimaryTextDefault',
  displayName: 'Primary Text Default',
  contentType: 'OT_PrimaryTextBlock',
  isDefault: true,
  settings: {
    alignment: {
      displayName: 'Alignment',
      editor: 'select',
      sortOrder: 10,
      choices: {
        left:   { displayName: 'Left (Default)', sortOrder: 10 },
        center: { displayName: 'Centered',        sortOrder: 20 },
      },
    },
    color: {
      displayName: 'Background color',
      editor: 'select',
      sortOrder: 20,
      choices: {
        none:    { displayName: 'Transparent (inherit row/section)', sortOrder: 5  },
        canvas:  { displayName: 'Canvas (Default)',                  sortOrder: 10 },
        brand:   { displayName: 'Brand',                             sortOrder: 20 },
        surface: { displayName: 'Surface',                           sortOrder: 30 },
      },
    },
    size: {
      displayName: 'Heading scale',
      editor: 'select',
      sortOrder: 30,
      choices: {
        headline: { displayName: 'Headline (Default)',  sortOrder: 10 },
        display:  { displayName: 'Display — Largest',  sortOrder: 20 },
        title:    { displayName: 'Title',              sortOrder: 30 },
        label:    { displayName: 'Label',              sortOrder: 40 },
      },
    },
    gradient: {
      displayName: 'Heading gradient — Display scale only',
      editor: 'select',
      sortOrder: 40,
      choices: {
        none:     { displayName: 'None (Default)',                sortOrder: 10 },
        brand:    { displayName: 'Brand — Primary',               sortOrder: 20 },
        warm:     { displayName: 'Brand — Extended',              sortOrder: 30 },
        luminous: { displayName: 'Luminous — Carved from Light',  sortOrder: 40 },
        ember:    { displayName: 'Accent — Ember',                sortOrder: 50 },
        extrude:  { displayName: 'Brand — Isometric Extrude',     sortOrder: 60 },
        mono:     { displayName: 'Mono — Silver & Fog',           sortOrder: 70 },
      },
    },
    depth: {
      displayName: 'Heading depth effect — works at any scale, best at headline+',
      editor: 'select',
      sortOrder: 50,
      choices: {
        none:    { displayName: 'None (Default)',                        sortOrder: 10 },
        extrude: { displayName: 'Comic Extrude — hard shadow stack',     sortOrder: 20 },
        emboss:  { displayName: 'Mineral Emboss — carved into surface',  sortOrder: 30 },
        outline: { displayName: 'Chromatic Outline — hollow wire',       sortOrder: 40 },
        liquid:  { displayName: 'Liquid Fill — animated gradient sweep', sortOrder: 50 },
      },
    },
    entranceAnimation: {
      displayName: 'Entrance animation',
      editor:      'select',
      sortOrder:   60,
      choices: {
        none:     { displayName: 'None (Default)', sortOrder: 10 },
        fade:     { displayName: 'Fade in',        sortOrder: 20 },
        slide:    { displayName: 'Slide up',       sortOrder: 30 },
        parallax: { displayName: 'Parallax',       sortOrder: 40 },
      },
    },
  },
})
