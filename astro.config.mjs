import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://sleep-calculator.h68zvmzrnc.workers.dev', // demo URL; OWNER TO FILL: the final domain (keep equal to SITE.url in src/site.ts)
  devToolbar: { enabled: false }, // it overlays the bottom of every dev screenshot
  // One family, one latin woff2 (DESIGN-SYSTEM 2.3).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Public Sans',
      cssVariable: '--font-sans',
      weights: ['400 700'], // one variable file
      styles: ['normal'], // no italics in the UI
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['sans-serif'], // generic last, so Astro generates a metric-matched fallback
    },
  ],
});
