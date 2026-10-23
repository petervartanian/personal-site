/* The full collection is readable without JavaScript. This adds local browsing. */
(() => {
  'use strict';

  const browser = document.querySelector('[data-dividend]');
  if (!browser) return;

  const form = browser.querySelector('[data-dv-filters]');
  const tools = browser.querySelector('[data-dv-tools]');
  const sections = [...browser.querySelectorAll('[data-dv-section]')];
  const links = [...browser.querySelectorAll('[data-dv-view]')];
  const viewSelect = browser.querySelector('[data-dv-view-select]');
  const moreFilters = browser.querySelector('[data-dv-more-filters]');
  const status = browser.querySelector('[data-dv-count]');
  const resetButtons = [...browser.querySelectorAll('[data-dv-reset]')];
  const currencyControls = [...browser.querySelectorAll('input[name="currency"]')];
  const currencyCounts = [...browser.querySelectorAll('[data-dv-currency-count]')];
  const currencyReset = browser.querySelector('[data-dv-currency-reset]');
  const sort = browser.querySelector('[data-dv-sort]');
  if (!form || !tools || !sort || !sections.length) return;

  const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
  const normalize = value => String(value || '').normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const groups = sections.map(section => ({
    section,
    key: section.dataset.dvSection,
    list: section.querySelector('[data-dv-list]'),
    empty: section.querySelector('[data-dv-empty]'),
    rows: [...section.querySelectorAll('[data-dv-row]')].map((element, index) => ({
      element,
      index,
      text: normalize(element.textContent),
      type: element.dataset.type || '',
      status: element.dataset.status || '',
      currencies: (element.dataset.currencies || 'Unstated').split(',').filter(Boolean),
      title: element.dataset.title || '',
      checked: element.dataset.checked || '',
    })),
  }));
  const fields = ['q', 'type', 'status'];
  let view = groups.some(group => group.key === 'published') ? 'published' : groups[0].key;
  let queryTimer;

  function optionExists(select, value) {
    return [...select.options].some(option => option.value === value);
  }

  function selectedCurrencies() {
    return currencyControls.filter(control => control.checked).map(control => control.value);
  }

  function restore() {
    const params = new URLSearchParams(window.location.search);
    fields.forEach(key => {
      const control = form.elements[key];
      const value = params.get(key) || '';
      control.value = control.tagName === 'SELECT' && !optionExists(control, value) ? '' : value;
    });
    const currencies = new Set(params.getAll('currency'));
    currencyControls.forEach(control => { control.checked = currencies.has(control.value); });
    sort.value = optionExists(sort, params.get('sort')) ? params.get('sort') : 'collection';
    view = groups.some(group => group.key === params.get('view')) ? params.get('view') : 'published';
    if (!groups.some(group => group.key === view)) view = groups[0].key;
    if (moreFilters) moreFilters.open = fields.slice(1).some(key => form.elements[key].value)
      || selectedCurrencies().length > 0;
  }

  function writeUrl() {
    const url = new URL(window.location.href);
    [...fields, 'currency', 'view', 'sort'].forEach(key => url.searchParams.delete(key));
    fields.forEach(key => {
      const value = form.elements[key].value.trim();
      if (value) url.searchParams.set(key, value);
    });
    const currencies = selectedCurrencies();
    currencies.forEach(currency => url.searchParams.append('currency', currency));
    if (view !== 'published') url.searchParams.set('view', view);
    if (sort.value !== 'collection') url.searchParams.set('sort', sort.value);
    if (fields.some(key => form.elements[key].value.trim()) || currencies.length) url.hash = '';
    if (url.href !== window.location.href) window.history.replaceState(null, '', url);
  }

  function ordered(rows) {
    return [...rows].sort((a, b) => {
      let comparison = 0;
      if (sort.value === 'case') comparison = collator.compare(a.title, b.title);
      if (sort.value === 'type') comparison = collator.compare(a.type, b.type) || collator.compare(a.title, b.title);
      if (sort.value === 'currency') comparison = collator.compare(a.currencies.join(','), b.currencies.join(',')) || collator.compare(a.title, b.title);
      if (sort.value === 'checked') comparison = b.checked.localeCompare(a.checked) || collator.compare(a.title, b.title);
      return comparison || a.index - b.index;
    });
  }

  function apply(updateUrl = true) {
    const terms = normalize(form.elements.q.value).trim().split(/\s+/).filter(Boolean);
    const values = Object.fromEntries(fields.slice(1).map(key => [key, form.elements[key].value]));
    const currencies = selectedCurrencies();
    const filtered = terms.length > 0 || Object.values(values).some(Boolean) || currencies.length > 0;
    const facets = new Map(currencyControls.map(control => [control.value, 0]));
    let activeCount = 0;
    let activeTotal = 0;

    groups.forEach(group => {
      let shown = 0;
      ordered(group.rows).forEach(row => {
        const baseMatches = terms.every(term => row.text.includes(term))
          && (!values.type || row.type === values.type)
          && (!values.status || row.status === values.status);
        if (baseMatches && group.key === view) {
          new Set(row.currencies).forEach(currency => {
            facets.set(currency, (facets.get(currency) || 0) + 1);
          });
        }
        const matches = baseMatches
          && (!currencies.length || currencies.some(currency => row.currencies.includes(currency)));
        row.element.hidden = !matches;
        if (matches) shown += 1;
        if (group.list) group.list.appendChild(row.element);
      });
      group.section.hidden = group.key !== view;
      if (group.empty) group.empty.hidden = shown !== 0;
      if (group.list) group.list.hidden = shown === 0;
      const link = links.find(item => item.dataset.dvView === group.key);
      if (link) {
        link.setAttribute('aria-current', group.key === view ? 'true' : 'false');
        const count = link.querySelector('[data-dv-view-count]');
        if (count) count.textContent = shown;
      }
      if (group.key === view) {
        activeCount = shown;
        activeTotal = group.rows.length;
      }
    });

    const noun = activeTotal === 1 ? 'claim' : 'claims';
    if (viewSelect) viewSelect.value = view;
    if (status) status.textContent = filtered
      ? `${activeCount} of ${activeTotal} ${noun}`
      : `${activeTotal} ${noun}`;
    resetButtons.forEach(button => { button.hidden = !filtered; });
    currencyCounts.forEach(count => {
      count.textContent = `(${facets.get(count.dataset.dvCurrencyCount) || 0})`;
    });
    if (currencyReset) currencyReset.hidden = currencies.length === 0;
    if (updateUrl) writeUrl();
  }

  function clearFilters(focusSearch = false) {
    fields.forEach(key => { form.elements[key].value = ''; });
    currencyControls.forEach(control => { control.checked = false; });
    apply();
    if (focusSearch) form.elements.q.focus();
  }

  function revealHash() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    const section = target && target.closest('[data-dv-section]');
    if (!section) return;
    view = section.dataset.dvSection;
    const row = target.closest('[data-dv-row]');
    if (row) {
      fields.forEach(key => { form.elements[key].value = ''; });
      currencyControls.forEach(control => { control.checked = false; });
      const evidence = target.closest('details');
      if (evidence) evidence.open = true;
    }
    apply();
    window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }

  restore();
  apply(false);
  tools.hidden = false;
  browser.dataset.enhanced = 'true';

  form.addEventListener('input', event => {
    if (event.target.name !== 'q') return;
    window.clearTimeout(queryTimer);
    queryTimer = window.setTimeout(() => apply(), 100);
  });
  form.addEventListener('change', event => {
    if (event.target === viewSelect) {
      view = viewSelect.value;
      const url = new URL(window.location.href);
      url.hash = '';
      window.history.replaceState(null, '', url);
    }
    apply();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    window.clearTimeout(queryTimer);
    apply();
  });
  sort.addEventListener('change', () => apply());
  resetButtons.forEach(button => button.addEventListener('click', () => clearFilters(true)));
  if (currencyReset) currencyReset.addEventListener('click', () => {
    currencyControls.forEach(control => { control.checked = false; });
    apply();
    if (currencyControls.length) currencyControls[0].focus();
  });

  links.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    view = link.dataset.dvView;
    const url = new URL(window.location.href);
    url.hash = '';
    window.history.replaceState(null, '', url);
    apply();
  }));

  window.addEventListener('popstate', () => {
    restore();
    apply(false);
    revealHash();
  });
  window.addEventListener('hashchange', revealHash);
  if (window.location.hash) revealHash();
})();
