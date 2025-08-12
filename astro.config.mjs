import { defineConfig } from 'astro/config'
import kopiLuwak from '/src/styles/kopi-luwak.json'

export default defineConfig({
  markdown: {
    shikiConfig: { theme: kopiLuwak },
  },
  site: 'https://samdevega.github.io',
})