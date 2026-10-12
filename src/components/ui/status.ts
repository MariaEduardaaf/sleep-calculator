// InlineStatus (DESIGN-SYSTEM 3.25): a reserved line next to the control that caused it. No toasts, no timeouts.
import { icon } from './icons';
import { esc } from './html';

/** 'plain': a neutral line with no icon (list summaries such as "Showing 20 of 238."). */
export type StatusTone = 'info' | 'success' | 'error' | 'plain';
export interface StatusAction { label: string; onClick: () => void }

const ICON = { info: 'info', success: 'check', error: 'circle-alert' } as const;

/** Fills (or, with empty text, clears) an InlineStatus line. An action renders as a quiet button. */
export function setStatus(el: HTMLElement, tone: StatusTone, text: string, action?: StatusAction): void {
  el.classList.remove('status--info', 'status--success', 'status--error');
  el.classList.toggle('status--action', Boolean(text && action));
  if (!text) { el.replaceChildren(); return; }
  if (tone !== 'plain') el.classList.add(`status--${tone}`);
  el.innerHTML = `${tone === 'plain' ? '' : icon(ICON[tone], 16)}<span>${esc(text)}</span>`;
  if (action) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn--quiet btn--sm';
    b.textContent = action.label;
    b.addEventListener('click', action.onClick);
    el.append(' ', b);
  }
}
