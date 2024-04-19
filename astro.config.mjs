import { defineConfig } from 'astro/config'
import ayuMirage from '/src/styles/ayu-mirage.json'

export default defineConfig({
  markdown: {
    shikiConfig: { theme: ayuMirage },
  },
  site: 'https://samdevega.github.io',
})