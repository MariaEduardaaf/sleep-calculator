// Results markup for the sleep and nap night band (DESIGN-SYSTEM 3.23), one template for the server default and
// the client, so both render the same rows. Times are formatted here rather than with toLocaleTimeString:
// runtimes disagree on the space before AM/PM, and CRAFT-06 wants a no-break space.
import { calc, fmtDuration, stamp, type Mode } from './sleep-math.ts';
import { icon } from '../ui/icons.ts';
import { esc } from '../ui/html.ts';
import { SITE } from '../../site.ts';

const NB = ' ';
const MIN = 60_000;
const pad = (n: number) => String(n).padStart(2, '0');

/** "HH:MM", the value of <input type="time"> and of the URL's `t`. */
export const hhmm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
/** 23:15 -> ["11:15", "PM"] */
export const clock = (d: Date): [string, string] => [`${d.getHours() % 12 || 12}:${pad(d.getMinutes())}`, d.getHours() < 12 ? 'AM' : 'PM'];
/** "11:15 PM" with a no-break space. */
export const timeText = (d: Date) => clock(d).join(NB);
/** 450 -> "7 h 30 min" with no-break spaces. */
export const duration = (min: number) => fmtDuration(min).replace(/ (h|min)\b/g, `${NB}$1`);

export interface Row {
  /** null on the nap page's server render: "now" is only known in the browser, so the time is a skeleton. */
  at: Date | null;
  featured: boolean;
  best: boolean;
  cycles?: number;
  meta: string;
  who: string;
  /** "go to bed at" or "wake up at", for the hidden context and the status line. */
  verb: string;
  /** Calendar event title, details and .ics file name. */
  title: string;
  details: string;
  file: string;
}

/** sleep.md section 8 thresholds, by hours of sleep. */
export function whoLine(h: number): string {
  if (h > 10) return 'Longer than most people need.';
  if (h >= 9) return 'Good for teens and anyone catching up on sleep.';
  if (h >= 7) return 'Fits the 7 or more hours adults need.';
  if (h >= 6) return 'A short night. Fine once in a while.';
  return 'Less than adults need. Plan a nap if you can.';
}

const fileTime = (d: Date) => clock(d).join('-').replace(':', '-').toLowerCase(); // "11-15-pm"

/**
 * The four sleep options in display order (sleep.md 10): the "Best for most adults" row first (the featured
 * row with 7 to 9 hours, closest to 8; none if neither qualifies), then the other featured row, then 4 and 3.
 */
export function sleepRows(mode: Mode, anchor: Date, lat: number, cyc: number): Row[] {
  const opts = calc(mode, anchor, lat, cyc);
  const best = opts
    .filter((o) => o.recommended && o.hours >= 7 && o.hours <= 9)
    .sort((a, b) => Math.abs(a.hours - 8) - Math.abs(b.hours - 8))[0];
  const ordered = best ? [best, ...opts.filter((o) => o !== best)] : opts;
  const wake = mode === 'wake';
  return ordered.map((o) => ({
    at: o.at,
    featured: o.recommended,
    best: o === best,
    cycles: o.cycles,
    meta: o.recommended ? `${duration(o.hours * 60)} of sleep, ${o.cycles} cycles` : `${duration(o.hours * 60)}, ${o.cycles} cycles`,
    who: whoLine(o.hours),
    verb: wake ? 'go to bed at' : 'wake up at',
    title: wake ? 'Go to bed' : 'Wake up',
    details: `Planned with the ${SITE.name} sleep calculator: ${o.cycles} cycles, ${fmtDuration(o.hours * 60)} of sleep.`,
    file: `${wake ? 'bedtime' : 'wake-up'}-${fileTime(o.at)}.ics`,
  }));
}

const NAPS = [
  { min: 20, meta: `Power nap, 20${NB}min of sleep`, who: 'A quick reset. You stay in light sleep, so it’s easier to get up.' },
  { min: 90, meta: `Full-cycle nap, 1${NB}h 30${NB}min of sleep`, who: 'After a short night. One complete cycle, so you wake between cycles.' },
];

/** Power nap, then full cycle (nap.md 10): wake = start + minutes to fall asleep + 20 or 90. */
export function napRows(start: Date | null, lat: number): Row[] {
  return NAPS.map((n) => {
    const at = start && new Date(start.getTime() + (lat + n.min) * MIN);
    return {
      at,
      featured: true,
      best: false,
      meta: n.meta,
      who: n.who,
      verb: 'wake up at',
      title: 'Wake up from your nap',
      details: `Planned with the ${SITE.name} nap calculator.`,
      file: at ? `nap-wake-up-${fileTime(at)}.ics` : '',
    };
  });
}

/** The screen reader status line after a change (sleep.md 8, nap.md 8). */
export const sleepStatus = ([r]: Row[]) => `${r.best ? 'Best for most adults' : 'First option'}: ${r.verb} ${timeText(r.at!)}, ${r.cycles} cycles.`;
export const napStatus = ([power, full]: Row[]) =>
  `Power nap: wake up at ${timeText(power.at!)}. Full-cycle nap: wake up at ${timeText(full.at!)}.`;

/** Google Calendar template link (DESIGN-SYSTEM 4.6): a 15-minute event, times in UTC. */
export function googleUrl(r: Row & { at: Date }): string {
  const end = new Date(r.at.getTime() + 15 * MIN);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(r.title)}` +
    `&dates=${stamp(r.at)}/${stamp(end)}&details=${encodeURIComponent(r.details)}`;
}

function rowHTML(r: Row, i: number, links: boolean): string {
  const [t, ap] = r.at ? clock(r.at) : ['', ''];
  const when = r.at ? `${t}${NB}${ap}` : '';
  const time = !r.at
    ? '<p class="result__time"><span class="skeleton skeleton--night sleep-skeleton js-only" aria-hidden="true"></span></p>'
    : r.featured
      ? `<p class="result__time num">${t}<span class="result__ap">${ap}</span></p>`
      : `<p class="result__time num">${when}</p>`;
  const href = links && r.at ? ` href="${esc(googleUrl(r as Row & { at: Date }))}"` : '';
  const file = `<button class="btn ${r.featured ? 'btn--secondary' : 'btn--quiet'} btn--sm" type="button" data-ics="${i}">` +
    `${r.featured ? icon('calendar-plus') : ''}<span>Add to calendar</span>` +
    `${when && `<span class="sr-only">: ${r.verb} ${when}, downloads a calendar file</span>`}</button>`;
  const google = `<a class="btn btn--quiet btn--sm"${href} target="_blank" rel="noopener"><span>Google Calendar</span>` +
    `${when && `<span class="sr-only"> event for ${when}, opens in a new tab</span>`}${icon('external-link', 16)}</a>`;
  return `<li class="result result--${r.featured ? 'featured' : 'compact'}">` +
    `${r.best ? '<span class="badge badge--highlight">Best for most adults</span>' : ''}${time}` +
    `<p class="result__meta">${r.meta}</p><p class="result__who">${r.who}</p>` +
    `<div class="result__actions js-only">${file}${google}</div></li>`;
}

/** The results list. `links: false` for the server render, whose Google links get their href in the browser. */
export const rowsHTML = (rows: Row[], links = true) => `<ol class="results">${rows.map((r, i) => rowHTML(r, i, links)).join('')}</ol>`;

/** EmptyState (3.24) for a cleared time field, in the band's token scope. */
export const emptyHTML = (title: string) =>
  `<div class="empty"><span class="tile tile--md tile--neutral" aria-hidden="true">${icon('clock', 24)}</span>` +
  `<h3 class="empty__title">${esc(title)}</h3><p class="empty__body">Times appear here as soon as the field has a time.</p></div>`;
