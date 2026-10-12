// Structured data built from the same arrays the page renders (DESIGN-SYSTEM 3.13, 3.20).
import { SITE } from '../../site';

/** Optional link on words of the answer: `text` must appear in it (the first occurrence is linked). */
export interface FaqLink { text: string; href: string }
export type FaqItem = [question: string, answer: string, link?: FaqLink];
export interface Crumb { label: string; href?: string }

export const faqJsonLd = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

/** Only where the crumbs are visible. The current page (no href) is listed without a URL, as Google allows. */
export const breadcrumbJsonLd = (items: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    ...(c.href ? { item: new URL(c.href, SITE.url).href } : {}),
  })),
});
