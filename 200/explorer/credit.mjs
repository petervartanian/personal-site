// Keep mouse activation on the visible triangle while allowing a larger touch target.
export function setupCredit() {
  const header = document.querySelector('.site-header');
  const button = document.getElementById('credit-trigger');
  const triangle = button.querySelector('.credit-triangle');
  const credit = document.getElementById('site-credit');
  let hover = false;
  let pinned = false;
  let keyboardFocus = false;
  let dismissed = false;
  function show() {
    const open = !dismissed && (hover || pinned || keyboardFocus);
    credit.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  }
  function close() { pinned = false; hover = false; dismissed = true; show(); }
  header.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const t = triangle.getBoundingClientRect();
    const fraction = (event.clientY - t.top) / t.height;
    const within = fraction >= 0 && fraction < 1 && Math.abs(event.clientX - (t.left + t.right) / 2) <= (t.width / 2) * (1 - fraction);
    const c = credit.getBoundingClientRect();
    const bridge = hover && event.clientX >= Math.min(t.left, c.left) && event.clientX <= Math.max(t.right, c.right) && event.clientY >= t.top && event.clientY <= c.bottom;
    hover = within || bridge;
    if (within) dismissed = false;
    show();
  });
  header.addEventListener('pointerleave', () => { hover = false; show(); });
  button.addEventListener('focus', () => {
    keyboardFocus = button.matches(':focus-visible');
    dismissed = false;
    show();
  });
  button.addEventListener('blur', () => { keyboardFocus = false; pinned = false; show(); });
  button.addEventListener('click', () => {
    if (pinned) close();
    else { pinned = true; dismissed = false; show(); }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  document.addEventListener('pointerdown', event => {
    if (!button.contains(event.target) && !credit.contains(event.target)) close();
  });
}
