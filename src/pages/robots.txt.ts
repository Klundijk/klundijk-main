import type { APIRoute } from 'astro';
import { indexable } from '../data/site';

// Staging/preview: alles blokkeren. Bij livegang (PUBLIC_INDEXABLE=1) alles toestaan en de sitemap noemen.
export const GET: APIRoute = ({ site }) =>
  new Response(
    indexable
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
      : `User-agent: *\nDisallow: /\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
