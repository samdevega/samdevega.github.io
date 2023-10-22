import { defineConfig } from 'astro/config';

export default defineConfig({
  markdown: {
    shikiConfig: { theme: 'material-theme' },
  },
  site: 'https://samdevega.github.io',
});