import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { blogPost } from './schemas/blogPost'

export default defineConfig({
  name: 'atelier-seo',
  title: 'Atelier SEO',
  projectId: '2ll5runk',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [blogPost],
  },
})
