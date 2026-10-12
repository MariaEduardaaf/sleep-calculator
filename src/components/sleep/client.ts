// Browser wiring shared by the sleep and nap pages: Fine-tune fields, saved settings, URL state, the results
// crossfade, the status line and the calendar actions (sleep.md 9 and 10, nap.md 9 and 10). Markup: render.ts.
import { downloadIcs } from './download';
import { rowsHTML, emptyHTML, type Row } from './render';

export const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

/** An integer in range, else null (saved values and URL parameters are untrusted). */
export const int = (v: unknown, min: number, max: number) => (Number.isInteger(v) && (v as number) >= min && (v as number) <= max ? (v as number) : null);

/** Saved Fine-tune values. Storage failures are silent (DESIGN-SYSTEM 4.7). */
export function loadTune(key: string): Record<string, unknown> {
  try { return JSON.parse(localStorage.getItem(key) ?? '{}') ?? {}; } catch { return {}; }
}
export function saveTune(key: string, value: Record<string, number>) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode or blocked storage */ }
}

/** The URL's `t` when it is a valid HH:MM, else null. */
export function urlTime(): string | null {
  const t = new URLSearchParams(location.search).get('t');
  return t && /^([01]\d|2[0-3]):[0-5]\d$/.test(t) ? t : null;
}

let urlTimer = 0;
/** Shareable state goes in the URL with replaceState, 500ms after the last change (DESIGN-SYSTEM 4.7). */
export function writeUrl(params: Record<string, string>) {
  clearTimeout(urlTimer);
  urlTimer = window.setTimeout(() => {
    const u = new URL(location.href);
    for (const [k, v] of Object.entries(params)) {
      if (v) u.searchParams.set(k, v);
      else u.searchParams.delete(k);
    }
    u.search = u.search.replace(/%3A/gi, ':'); // a shared link reads ?t=23:00, not ?t=23%3A00
    history.replaceState(history.state, '', u);
  }, 500);
}

export interface TuneField { value: () => number; set: (n: number) => void }

/**
 * A Fine-tune NumberField (DESIGN-SYSTEM 3.5). Results use the last valid value while typing; on blur an out of
 * range or empty value is clamped, kept and explained, with aria-invalid until the next valid edit.
 */
export function tuneField(id: string, initial: number, message: (used: number) => string, onChange: () => void): TuneField {
  const input = $<HTMLInputElement>(id), error = $(`${id}-error`);
  const min = Number(input.min), max = Number(input.max);
  let value = initial;
  const read = () => (input.value.trim() === '' ? NaN : Math.round(Number(input.value)));
  const valid = (v: number) => Number.isFinite(v) && v >= min && v <= max;
  const showError = (text: string) => {
    error.querySelector('span')!.textContent = text;
    error.hidden = !text;
    if (text) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  };
  const commit = (v: number) => { if (v !== value) { value = v; onChange(); } };
  // The kit's steppers sync their bounds on input and change events; on load nothing has fired yet.
  const bounds = () => input.parentElement!.querySelectorAll<HTMLElement>('[data-step]').forEach((b) =>
    b.setAttribute('aria-disabled', String(Number(b.dataset.step) < 0 ? value <= min : value >= max)));

  input.value = String(value);
  bounds();
  input.addEventListener('input', () => {
    const v = read();
    if (valid(v)) { showError(''); commit(v); }
  });
  input.addEventListener('blur', () => {
    const v = read();
    if (valid(v)) { input.value = String(v); return; }
    const used = Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : value;
    input.value = String(used);
    showError(message(used));
    commit(used);
    bounds();
  });
  return {
    value: () => value,
    set: (v) => { input.value = String(v); showError(''); commit(v); bounds(); },
  };
}

const ICS_ERROR = 'Your browser couldn’t create the calendar file. Use Google Calendar, or set an alarm.';

export interface Band { render: (rows: Row[] | null, announce: boolean) => void }

/**
 * The night band's results. Null rows (an empty time field) show the empty state at the height the results had.
 * Re-renders after an input crossfade (DESIGN-SYSTEM 2.5); the status line speaks 600ms after the last input.
 */
export function band(emptyTitle: () => string, statusText: (rows: Row[]) => string): Band {
  const out = $('band-out'), status = $('band-status'), note = $('band-note'), error = $('band-error');
  let rows: Row[] = [], first = true, timer = 0;

  out.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-ics]');
    const r = b ? rows[Number(b.dataset.ics)] : undefined;
    if (!r?.at) return;
    try {
      downloadIcs(r.title, r.at, r.file, r.details);
      error.hidden = true;
      note.hidden = false;
    } catch {
      // The error takes the note's place: it says the same thing as the note's advice, for this case.
      error.hidden = false;
      note.hidden = true;
      clearTimeout(timer); // a pending results announcement must not talk over the error
      status.textContent = ICS_ERROR;
    }
  });

  return {
    render(next, announce) {
      if (next) {
        out.style.minHeight = '';
        out.innerHTML = rowsHTML(next);
      } else {
        if (rows.length) out.style.minHeight = `${out.offsetHeight}px`;
        out.innerHTML = emptyHTML(emptyTitle());
      }
      rows = next ?? [];
      if (!first) {
        out.classList.add('is-updating');
        void out.offsetWidth; // commit the dimmed frame, so removing the class runs the crossfade
        out.classList.remove('is-updating');
      }
      first = false;
      clearTimeout(timer);
      if (announce && next) timer = window.setTimeout(() => { status.textContent = statusText(next); }, 600);
    },
  };
}
