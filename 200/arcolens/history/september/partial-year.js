'use strict';

// URL state also works when a browser isolates storage for local HTML files.
(() => {
  const parameter = 'year2026';
  const storageKey = 'arcolens.includePartial2026';
  const buttons = [...document.querySelectorAll('[data-partial-choice]')];
  const views = [...document.querySelectorAll('[data-year-view]')];
  let enabled = true;

  function preference() {
    const explicit = new URL(window.location.href).searchParams.get(parameter);
    if (explicit === 'on' || explicit === 'off') return explicit === 'on';
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === 'on' || saved === 'off') return saved === 'on';
    } catch (_) { /* Local file storage may be unavailable. */ }
    return true;
  }

  function apply(value) {
    enabled = value;
    buttons.forEach((button) => {
      button.disabled = false;
      button.setAttribute('aria-pressed', String((button.dataset.partialChoice === 'on') === enabled));
    });
    views.forEach((view) => {
      view.hidden = (view.dataset.yearView === 'partial') !== enabled;
    });
    const state = enabled ? 'on' : 'off';
    const current = new URL(window.location.href);
    const directory = current.pathname.slice(0, current.pathname.lastIndexOf('/') + 1);
    document.querySelectorAll('a[href]').forEach((link) => {
      if (link.hasAttribute('download')) return;
      const raw = link.getAttribute('href');
      if (raw.startsWith('#')) return;
      const url = new URL(raw, current);
      if (url.protocol !== current.protocol || url.host !== current.host) return;
      if (!url.pathname.endsWith('.html')) return;
      if (url.pathname.slice(0, url.pathname.lastIndexOf('/') + 1) !== directory) return;
      url.searchParams.set(parameter, state);
      link.setAttribute('href', url.href);
    });
    try { window.localStorage.setItem(storageKey, state); } catch (_) { /* URL fallback. */ }
    current.searchParams.set(parameter, state);
    try { window.history.replaceState(null, '', current.href); } catch (_) { /* Links retain state. */ }
  }

  apply(preference());
  buttons.forEach((button) => button.addEventListener('click', () => apply(button.dataset.partialChoice === 'on')));
  window.addEventListener('popstate', () => apply(preference()));
})();
