// site-pages 11. /kit/ is a QA page (noindex, deleted at launch).
import type { APIRoute } from 'astro';
import { SITE } from '../site';

export const GET: APIRoute = () => new Response(
  `User-agent: *\nDisallow: /kit/\n\nSitemap: ${new URL('/sitemap.xml', SITE.url).href}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
