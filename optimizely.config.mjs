export default {
  components: [
    'cms/content-types/*.ts',
    'cms/display-templates/*.ts',
  ],
  propertyGroups: [
    { key: 'OT_Content', displayName: 'Content', sortOrder: 100 },
    { key: 'OT_Theme',   displayName: 'Theme',   sortOrder: 200 },
  ],
}
