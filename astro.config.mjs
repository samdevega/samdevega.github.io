import { defineConfig } from 'astro/config'
import verdandi from '/src/styles/verdandi.json'
import verdandiAlter from '/src/styles/verdandi-alter.json'

export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: verdandi,
        dark: verdandiAlter
      }
    }
  },
  site: 'https://samdevega.github.io',
})