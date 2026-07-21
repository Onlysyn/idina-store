import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './idina-sanity-studio/schema'

export default defineConfig({
  name: 'idina-mobile-planet',
  title: 'Idina Mobile Planet',
  
  projectId: 'kwzovmjy',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
