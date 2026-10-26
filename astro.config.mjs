import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domein is nog niet vastgesteld (open punt in Notion). Zet bij livegang SITE_URL (bijv. https://klundijk.com)
// en PUBLIC_INDEXABLE=1 als omgevingsvariabelen; tot die tijd is de site noindex en blokkeert robots.txt alles.
export default defineConfig({
  site: process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://example.invalid'),
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (p) => !p.includes('/spike') })],
});
