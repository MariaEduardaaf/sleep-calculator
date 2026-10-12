import assert from 'node:assert/strict';
import { calc, nextOccurrence, makeIcs, fmtTime, fmtDuration } from './sleep-math.ts';
import { sleepRows, napRows, rowsHTML, googleUrl, timeText, whoLine } from './render.ts';

const now = new Date(2026, 9, 12, 23, 0); // Oct 12 23:00 local
// midnight wrap: "06:30" is tomorrow; 6 cycles @90 + 15 latency = 555 min before -> 21:15 same evening
const wake = nextOccurrence('06:30', now);
assert.equal(wake.getDate(), 13);
const beds = calc('wake', wake, 15, 90);
assert.equal(fmtTime(beds[0].at), '9:15 PM');
assert.equal(beds[0].cycles, 6);
assert.equal(beds[1].recommended, true);
assert.equal(beds[2].recommended, false);

// wrap forward past midnight: bed 23:00, 5 cycles @90 + 15 -> 6:45 AM next day
const wakes = calc('bed', now, 15, 90);
assert.equal(fmtTime(wakes[1].at), '6:45 AM');
assert.equal(wakes[1].at.getDate(), 13);

// custom cycle length 100, latency 0, 5 cycles = 500 min
const c = calc('bed', now, 0, 100)[1];
assert.equal(c.at.getTime() - now.getTime(), 500 * 60_000);
assert.equal(Math.round(c.hours * 100), 833);

const ics = makeIcs('Wake up', wake, 15, now);
assert.match(ics, /BEGIN:VALARM/);
assert.match(ics, /DTSTART:\d{8}T\d{6}Z/);
assert.equal(fmtDuration(450), '7 h 30 min');
assert.equal(fmtDuration(540), '9 h');
assert.equal(fmtDuration(20), '20 min');
assert.equal(fmtDuration(c.hours * 60), '8 h 20 min'); // 499.99... rounds cleanly

// render.ts: the default answer, badge rule and order (sleep.md 10), copy and calendar data
const NB = '\u00A0';
const day = new Date(2026, 0, 15, 12);
const rows = sleepRows('wake', nextOccurrence('07:00', day), 15, 90);
assert.deepEqual(rows.map((r) => timeText(r.at!)), [`11:15${NB}PM`, `9:45${NB}PM`, `12:45${NB}AM`, `2:15${NB}AM`]);
assert.deepEqual(rows.map((r) => r.best), [true, false, false, false]);
assert.deepEqual(rows.map((r) => r.featured), [true, true, false, false]);
assert.equal(rows[0].meta, `7${NB}h 30${NB}min of sleep, 5 cycles`);
assert.equal(rows[2].meta, `6${NB}h, 4 cycles`);
assert.equal(rows[0].file, 'bedtime-11-15-pm.ics');
assert.equal(rows[0].title, 'Go to bed');
const r80 = sleepRows('wake', nextOccurrence('07:00', day), 15, 80);
assert.equal(r80[0].cycles, 6); assert.equal(r80[0].best, true); // 8 h comes first
assert.equal(sleepRows('wake', nextOccurrence('07:00', day), 15, 110).filter((r) => r.best).length, 0);
assert.deepEqual(sleepRows('wake', day, 15, 110).map((r) => r.cycles), [6, 5, 4, 3]);
assert.equal(sleepRows('bed', day, 15, 90)[0].file, 'wake-up-7-45-pm.ics');
assert.deepEqual([11, 10, 9, 8.99, 7, 6.99, 6, 5.99].map(whoLine).map((s) => s.split(' ')[0]), ['Longer', 'Good', 'Good', 'Fits', 'Fits', 'A', 'A', 'Less']);
const g = new URL(googleUrl(rows[0] as typeof rows[0] & { at: Date }));
assert.equal(g.searchParams.get('text'), 'Go to bed');
assert.match(g.searchParams.get('dates')!, /^\d{8}T\d{6}Z\/\d{8}T\d{6}Z$/);
const naps = napRows(new Date(2026, 0, 15, 14, 10), 10);
assert.deepEqual(naps.map((r) => timeText(r.at!)), [`2:40${NB}PM`, `3:50${NB}PM`]);
assert.equal(naps[1].file, 'nap-wake-up-3-50-pm.ics');
assert.doesNotMatch(rowsHTML(napRows(null, 10), false), /\d:\d\d/); // no placeholder time without "now"
assert.doesNotMatch(rowsHTML(rows, false), /href=/); // server rows carry no event links
assert.match(makeIcs('Go to bed', wake, 15, now, 'Planned, with care'), /DESCRIPTION:Planned\\, with care\r\n/);
// RFC 5545 folding: no line over 75 octets, and unfolding gives back the full description
const long = makeIcs('Go to bed', wake, 15, now, rows[0].details);
assert.ok(long.split('\r\n').every((l) => l.length <= 75));
assert.match(long.replace(/\r\n /g, ''), /DESCRIPTION:Planned with the .+ sleep calculator: 5 cycles\\, 7 h 30 min of sleep\.\r\n/);
console.log('sleep-math check: ok');
