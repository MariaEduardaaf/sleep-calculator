// Site-wide facts (site-pages 10). Fields marked OWNER TO FILL are facts only the owner can give.
// While one is empty, a PrototypeNotice shows in its place; it is never replaced by a made-up value.

export interface Site {
  name: string;
  tagline: string;
  url: string;
  owner: string;
  ownerLocation: string;
  contactEmail: string;
  /** Where people get in touch when there is no public email: the project's GitHub issues. */
  contactUrl: string;
  host: string;
  editor: string;
  ads: boolean;
  prototypeNotices: boolean;
}

export const SITE: Site = {
  name: 'Bedtime Calculator',
  tagline: 'Bedtimes and wake-up times that end a full sleep cycle. Free, no account.', // OWNER TO FILL: placeholder product name (also the wordmark)
  url: 'https://sleep-calculator.h68zvmzrnc.workers.dev', // demo on Cloudflare; OWNER TO FILL: the final domain, also `site` in astro.config.mjs
  owner: 'Maria Eduarda', // person who runs the site (About)
  ownerLocation: 'Alicante, Spain', // (About)
  contactEmail: '', // no public email by choice; contact goes to GitHub issues
  contactUrl: 'https://github.com/MariaEduardaaf/sleep-calculator/issues/new',
  host: 'Cloudflare', // hosting provider (Privacy, "Server logs")
  editor: '', // OWNER TO FILL (optional): a real reviewer's name for bylines, or leave empty
  ads: false, // OWNER TO FILL: true only after AdSense approval
  prototypeNotices: false, // the build fails while an owner field is empty
};

// SP-04: with the notices off, an empty owner field must stop the build, naming the field.
if (!SITE.prototypeNotices) {
  for (const field of ['owner', 'ownerLocation', 'host'] as const) {
    if (!SITE[field]) throw new Error(`SITE.${field} is empty. Fill it in src/site.ts, or keep SITE.prototypeNotices true.`);
  }
  if (!SITE.contactEmail && !SITE.contactUrl) throw new Error('Set SITE.contactEmail or SITE.contactUrl in src/site.ts.');
}

// <meta name="theme-color">: the light and dark --bg values from src/styles/tokens.css.
export const THEME_COLOR = { light: '#FFFFFF', dark: '#0E131B' } as const;

/** The sibling projects by the same author, linked in the footer and "More free tools". OWNER TO FILL: their live
 *  URLs once deployed; an entry with an empty url is hidden, so nothing links to a site that doesn't exist yet. */
export interface Sibling { icon: 'moon' | 'wifi' | 'utensils'; title: string; line: string; href: string }
const ALL_SIBLINGS: Sibling[] = [
  { icon: 'wifi', title: 'Free WiFi Finder', line: 'Find places that offer WiFi to the public.', href: 'https://free-wifi-finder.h68zvmzrnc.workers.dev/' },
  { icon: 'utensils', title: 'Pantry Recipe Finder', line: 'See what you can cook with what’s in your kitchen.', href: 'https://recipe-finder.h68zvmzrnc.workers.dev/' },
];
export const SIBLINGS = ALL_SIBLINGS.filter((s) => s.href);

/** The wordmark in two weights, as approved with the logo: the strong part, then the light part. */
export const WORDMARK: [string, string] = ['Bedtime', 'Calculator'];
