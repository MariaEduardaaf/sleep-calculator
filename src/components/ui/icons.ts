import { SITE } from '../../site.ts';
// Icons from Lucide (https://lucide.dev), ISC License.
// Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT).
// All other copyright (c) for Lucide are held by Lucide Contributors 2022.
//
// Paths copied from lucide v1.17.0. One drawing language for every glyph (CRAFT-01): 24-unit grid,
// 2-unit round strokes, no fill. The logo mark (CRAFT-02) and the three status shapes (DESIGN-SYSTEM 2.6)
// are filled plates by design; the glyphs inside the shapes keep the stroke language.
// Used by Icon.astro on the server and by client scripts, so both render the same markup.

const PATHS = {
  // Tool pictograms
  moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
  'alarm-clock': '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',
  wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  signpost: '<path d="M12 13v8"/><path d="M12 3v3"/><path d="M2.354 10.354a1.207 1.207 0 0 1 0-1.708l2.06-2.06A2 2 0 0 1 5.828 6h12.344a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H5.828a2 2 0 0 1-1.414-.586z"/>',
  // Interface
  search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  'calendar-plus': '<path d="M16 19h6"/><path d="M16 2v4"/><path d="M19 16v6"/><path d="M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5"/><path d="M3 10h18"/><path d="M8 2v4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'locate-fixed': '<line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/>',
  map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  list: '<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',
  navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  flag: '<path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/>',
  'sliders-horizontal': '<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>',
  ban: '<circle cx="12" cy="12" r="10"/><path d="M4.929 4.929 19.07 19.071"/>',
  'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'circle-alert': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  'refresh-cw': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  'shopping-cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'loader-circle': '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
} as const;

export type IconName = keyof typeof PATHS;
export type IconSize = 16 | 20 | 24 | 28;
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

// Sizes come from the tokens (--icon-sm, -md, -lg, -xl); the attributes only cover the moment before CSS.
const SIZE_CLASS: Record<IconSize, string> = { 16: 'icon--sm', 20: '', 24: 'icon--lg', 28: 'icon--xl' };

const svgOpen = (cls: string, size: IconSize, viewBox: number) =>
  `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" aria-hidden="true" focusable="false"`;

/** A Lucide icon as an inline SVG string. `cls` adds classes after `icon`. */
export function icon(name: IconName, size: IconSize = 20, cls = ''): string {
  const classes = ['icon', SIZE_CLASS[size], cls].filter(Boolean).join(' ');
  return `${svgOpen(classes, size, 24)} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</svg>`;
}

// Status shapes (DESIGN-SYSTEM 2.6, CRAFT-10): one definition each, shared by map markers, the legend,
// badges and the "How we find places" list. Drawn on a 28-unit box: at 28px a 24px plate plus a 2px ring.
// Colors come from CSS custom properties (--shape-plate, --shape-ring, --shape-glyph), so a badge draws the
// shape in its text color and a marker (.shape--marker) in the status fill colors.
export type Status = 'free' | 'customers' | 'unknown';
type ShapeName = Status | 'location';

// The glyph sits in a 16-unit square in the middle of the box, stroked at 3 units of its 24-unit grid,
// which is 2px at the 28px marker size.
const glyph = (name: IconName) =>
  `<svg class="shape__glyph" x="6" y="6" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</svg>`;

const SHAPES: Record<ShapeName, string> = {
  // Free for everyone: circle with a check
  free: `<circle class="shape__plate" cx="14" cy="14" r="13" stroke-width="2"/>${glyph('check')}`,
  // Customers only (guests included): square with 4-unit corners and a cart. Never a padlock or key.
  customers: `<rect class="shape__plate" x="1" y="1" width="26" height="26" rx="4" stroke-width="2"/>${glyph('shopping-cart')}`,
  // Ask staff: a quieter 22px diamond with the question mark from Lucide circle-question-mark
  unknown: `<path class="shape__plate" d="M14 4 24 14 14 24 4 14Z" stroke-width="2" stroke-linejoin="round"/><svg class="shape__glyph" x="6" y="6" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
  // Your location: a 16px dot with a 3px ring
  location: `<circle class="shape__plate" cx="14" cy="14" r="9.5" stroke-width="3"/>`,
};

/** A status shape as an inline SVG string. Add `shape--marker` (via `cls`) for the map fill colors. */
export function statusShape(status: ShapeName, size: IconSize = 16, cls = ''): string {
  const classes = ['shape', `shape--${status}`, SIZE_CLASS[size].replace('icon', 'shape'), cls].filter(Boolean).join(' ');
  return `${svgOpen(classes, size, 28)}>${SHAPES[status]}</svg>`;
}

/** The placeholder logo mark (CRAFT-02): 32-unit plate, radius 8, an "i" from the pictogram geometry. */
export function markSvg(cls = 'logo__mark', size = 32): string {
  // The tool's pictogram, white on the blue tile (the suite's services-sign vernacular, one sign per product).
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect class="mark__plate" width="32" height="32" rx="8"/><g class="mark__stroke" transform="translate(6 6) scale(0.8333)" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${PATHS[SITE.mark]}</g></svg>`;
}
