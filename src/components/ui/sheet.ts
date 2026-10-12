// Sheet (DESIGN-SYSTEM 3.16): native <dialog> with showModal(). Focus goes to the title on open and back to
// the opener on close. Closing plays the slide-out unless reduced motion is on.
const openers = new WeakMap<HTMLDialogElement, HTMLElement | null>();

export function openSheet(dialog: HTMLDialogElement, opener?: HTMLElement | null): void {
  if (dialog.open) return;
  openers.set(dialog, opener ?? (document.activeElement as HTMLElement | null));
  dialog.classList.remove('is-closing');
  dialog.showModal();
  dialog.querySelector<HTMLElement>('.sheet__title')?.focus();
}

export function closeSheet(dialog: HTMLDialogElement): void {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  let timer = 0;
  const done = () => {
    clearTimeout(timer);
    dialog.removeEventListener('animationend', onEnd);
    dialog.classList.remove('is-closing');
    dialog.close();
    const opener = openers.get(dialog);
    if (opener?.isConnected) opener.focus();
  };
  const onEnd = (e: AnimationEvent) => { if (e.target === dialog) done(); };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return done();
  dialog.classList.add('is-closing');
  dialog.addEventListener('animationend', onEnd);
  timer = window.setTimeout(done, 400); // in case the animation never runs
}

/** Wires [data-close] buttons, Escape and backdrop taps for every sheet on the page (Sheet.astro calls it). */
export function initSheets(root: ParentNode = document): void {
  root.querySelectorAll<HTMLDialogElement>('dialog.sheet:not([data-ready])').forEach((d) => {
    d.dataset.ready = '';
    d.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(d); });
    d.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-close]')) return closeSheet(d);
      if (t !== d) return;
      const r = d.getBoundingClientRect(); // a click on the dialog box itself, outside its content, is the backdrop
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeSheet(d);
    });
  });
}
