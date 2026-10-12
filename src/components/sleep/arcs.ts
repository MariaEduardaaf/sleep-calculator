/** Decorative inline SVG: one dip per sleep cycle. `depth` (0..1) makes the dips shallower, e.g. for a power nap. */
export function cycleArcs(count: number, depth = 1): string {
  const r = 7, ry = r * depth;
  const d = 'M1 1' + ` a${r} ${ry} 0 0 0 ${r * 2} 0`.repeat(count);
  return `<svg class="arcs" width="${count * r * 2 + 2}" height="${ry + 3}" viewBox="0 0 ${count * r * 2 + 2} ${ry + 3}" aria-hidden="true" focusable="false">` +
    `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" vector-effect="non-scaling-stroke" /></svg>`;
}
