import { makeIcs } from './sleep-math';

/** Downloads a one-event .ics. Throws when the browser can't create the file; the page shows the error. */
export function downloadIcs(summary: string, start: Date, fileName: string, details = '') {
  const url = URL.createObjectURL(new Blob([makeIcs(summary, start, 15, new Date(), details)], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: fileName });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
