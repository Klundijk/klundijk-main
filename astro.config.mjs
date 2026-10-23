import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domein is nog niet vastgesteld (open punt in Notion). Pas `site` aan zodra het domein bekend is.
export default defineConfig({
  site: 'https://example.invalid',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (p) => !p.includes('/spike') })],
});
