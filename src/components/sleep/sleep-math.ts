export type Mode = 'wake' | 'bed';
export interface Option { cycles: number; hours: number; at: Date; recommended: boolean }

const MIN = 60_000;
export const CYCLES = [6, 5, 4, 3];

/** Next occurrence of "HH:MM" strictly after `now` (handles midnight wrap). */
export function nextOccurrence(hhmm: string, now: Date): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  if (d <= now) d.setDate(d.getDate() + 1);
  return d;
}

/**
 * mode 'wake': anchor = wake-up time, returns bedtimes.
 * mode 'bed':  anchor = time you get into bed, returns wake-up times.
 */
export function calc(mode: Mode, anchor: Date, latencyMin: number, cycleMin: number): Option[] {
  return CYCLES.map((cycles) => {
    const span = (cycles * cycleMin + latencyMin) * MIN;
    const at = new Date(anchor.getTime() + (mode === 'wake' ? -span : span));
    return { cycles, hours: (cycles * cycleMin) / 60, at, recommended: cycles >= 5 };
  });
}

export const fmtTime = (d: Date) =>
  d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

/** 450 -> "7 h 30 min", 20 -> "20 min". */
export const fmtDuration = (minutes: number) => {
  const t = Math.round(minutes), h = Math.floor(t / 60), m = t % 60;
  return [h && `${h} h`, m && `${m} min`].filter(Boolean).join(' ') || '0 min';
};

/** UTC as YYYYMMDDTHHMMSSZ, for .ics files and Google Calendar links. */
export const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s: string) => s.replace(/[\;,]/g, '\\$&').replace(/\n/g, '\\n');
/** RFC 5545 3.1: lines over 75 octets continue on the next line after a space. ponytail: counts characters,
 *  which equals octets for today's ASCII copy; count UTF-8 bytes if the event text ever gets non-ASCII. */
const fold = (line: string) => {
  let out = line.slice(0, 75);
  for (let i = 75; i < line.length; i += 74) out += `\r\n ${line.slice(i, i + 74)}`;
  return out;
};

/** One-event .ics with a VALARM firing at the event start. `details` becomes the event's DESCRIPTION. */
export function makeIcs(summary: string, start: Date, durationMin = 15, now = new Date(), details = ''): string {
  const end = new Date(start.getTime() + durationMin * MIN);
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bedtime Calculator//Sleep//EN', 'BEGIN:VEVENT',
    `UID:${start.getTime()}-${Math.random().toString(36).slice(2)}@bedtime-calculator`,
    `DTSTAMP:${stamp(now)}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(summary)}`,
    ...(details ? [`DESCRIPTION:${esc(details)}`] : []),
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(summary)}`, 'TRIGGER:PT0S', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ].map(fold).join('\r\n');
}
