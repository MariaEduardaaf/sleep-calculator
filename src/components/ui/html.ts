// Escapes a data string (OSM names, recipe titles, ingredients, user input) for HTML text or attributes.
// Client-rendered markup goes through this or textContent, never unescaped innerHTML (DESIGN-SYSTEM 3).
const MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (s: unknown): string => String(s ?? '').replace(/[&<>"']/g, (c) => MAP[c]);
