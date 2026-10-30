// Each collection remains readable when JavaScript is unavailable.
(() => {
  const collection = document.querySelector('[data-collection]');
  if (!collection) return;

  const form = collection.querySelector('[data-collection-filters]');
  if (!form) return;
  const count = collection.querySelector('[data-collection-count]');
  const empty = collection.querySelector('[data-collection-empty]');
  const reset = collection.querySelector('[data-collection-reset]');
  const filterFields = Array.from(form.querySelectorAll('[data-collection-filter]'));
  const parameterNames = [...new Set(['q', 'evidence', 'order', ...filterFields.map((field) => field.name)])];
  const choices = Array.from(collection.querySelectorAll('[data-collection-choice]'));
  const statistics = Array.from(collection.querySelectorAll('[data-collection-stat]'));
  const countries = Array.from(collection.querySelectorAll('[data-collection-country]'));
  const swaps = Array.from(collection.querySelectorAll('[data-collection-swap]'));
  const pagination = collection.querySelector('[data-collection-pagination]');
  const more = collection.querySelector('[data-collection-more]');
  const showAll = collection.querySelector('[data-collection-show-all]');
  const shownCount = collection.querySelector('[data-collection-shown]');
  const evidenceOrder = { found: 0, studied: 1, reported: 2, claimed: 3 };
  const search = window.AIBDSearch;
  const normalize = (text) => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const fieldFor = (name) => form.elements.namedItem(name);
  const valueFor = (name) => fieldFor(name)?.value || '';
  const groups = Array.from(collection.querySelectorAll('[data-collection-results]')).map((list) => {
    const element = list.closest('[data-collection-group]');
    const remaining = element?.querySelector('template[data-collection-remaining]');
    const initialRows = Array.from(list.querySelectorAll('[data-collection-row]'));
    const elements = initialRows.concat(remaining ? Array.from(remaining.content.querySelectorAll('[data-collection-row]')) : []);
    remaining?.remove();
    return {
      list,
      element,
      mounted: initialRows,
      count: element?.querySelector('[data-collection-group-count]'),
      rows: elements.map((row, index) => ({
        element: row,
        index,
        text: normalize(row.dataset.searchText),
        searchFields: search ? [search.field('Text', row.dataset.searchText)] : [],
        filters: JSON.parse(row.dataset.filters || '{}'),
        evidence: row.dataset.evidence || '',
        date: row.dataset.date || '',
        title: row.dataset.title || '',
      })),
    };
  });
  const rows = groups.flatMap((group) => group.rows);
  let previousOrder = null;
  let timer;
  const pageSize = 40;
  let limit = collection.hasAttribute('data-collection-all') ? Infinity : pageSize;
  let printing = false;

  function acceptsValue(name, value) {
    const field = fieldFor(name);
    return Boolean(field && (!field.options || Array.from(field.options).some((option) => option.value === value)));
  }

  function setValue(name, value) {
    const field = fieldFor(name);
    if (field) field.value = acceptsValue(name, value) ? value : '';
  }

  function updateSwaps() {
    swaps.forEach((button) => {
      const origin = button.dataset.originField || 'origin';
      const destination = button.dataset.destinationField || 'destination';
      const originValue = valueFor(origin);
      const destinationValue = valueFor(destination);
      let note = '';
      if (!acceptsValue(origin, destinationValue)) note = `No records list headquarters in ${destinationValue}.`;
      else if (!acceptsValue(destination, originValue)) note = `No records list ${originValue} as a jurisdiction.`;
      button.disabled = Boolean(note);
      button.title = note;
      const explanation = collection.querySelector('[data-collection-swap-note]');
      if (explanation) {
        explanation.textContent = note;
        explanation.hidden = !note;
      }
    });
  }

  function readParameters() {
    const parameters = new URLSearchParams(window.location.search);
    parameterNames.forEach((key) => setValue(key, parameters.get(key) || ''));
  }

  function valuesFor(row, key) {
    const value = key === 'evidence' ? row.evidence : row.filters[key];
    return (Array.isArray(value) ? value : [value]).filter((item) => item !== undefined && item !== null && item !== '');
  }

  function matches(row, state, excludedField = '') {
    return (excludedField === 'evidence' || !state.evidence || row.evidence === state.evidence)
      && (search ? search.match(row.searchFields, state.terms) !== null : state.terms.every((term) => row.text.includes(term)))
      && state.filters.every(([key, value]) => key === excludedField || valuesFor(row, key).includes(value));
  }

  function updateChoices(state) {
    const available = new Map();
    choices.forEach((button) => {
      const key = button.dataset.filter;
      const value = button.dataset.value || '';
      const selected = valueFor(key) === value;
      button.setAttribute('aria-pressed', String(selected));
      const counter = button.querySelector('[data-collection-choice-count]');
      if (!counter) return;
      if (!available.has(key)) available.set(key, rows.filter((row) => matches(row, state, key)));
      const total = available.get(key).filter((row) => !value || valuesFor(row, key).includes(value)).length;
      counter.textContent = String(total);
    });
  }

  function updateStatistics(matchingRows) {
    statistics.forEach((element) => {
      let total = matchingRows.length;
      if (element.dataset.collectionStat === 'distinct') {
        total = new Set(matchingRows.flatMap((row) => valuesFor(row, element.dataset.field))).size;
      } else if (element.dataset.collectionStat === 'matching') {
        total = matchingRows.filter((row) => valuesFor(row, element.dataset.filter).includes(element.dataset.value)).length;
      }
      element.textContent = String(total);
    });
    if (!countries.length) return;
    const origins = new Set(matchingRows.flatMap((row) => valuesFor(row, 'origin')));
    const destinations = new Set(matchingRows.flatMap((row) => valuesFor(row, 'destination')));
    countries.forEach((element) => {
      const name = element.dataset.country;
      element.dataset.originActive = String(origins.has(name));
      element.dataset.destinationActive = String(destinations.has(name));
      element.dataset.countryActive = String(origins.has(name) || destinations.has(name));
    });
  }

  function sortGroups(order) {
    if (order === previousOrder) return;
    groups.forEach((group) => {
      group.ordered = group.rows.slice().sort((first, second) => {
        if (order === 'evidence') {
          return (evidenceOrder[first.evidence] ?? 99) - (evidenceOrder[second.evidence] ?? 99)
            || second.date.localeCompare(first.date) || first.index - second.index;
        }
        if (order === 'newest') return second.date.localeCompare(first.date) || first.index - second.index;
        if (order === 'title') return first.title.localeCompare(second.title, 'en') || first.index - second.index;
        return first.index - second.index;
      });
    });
    previousOrder = order;
  }

  function apply(updateAddress = true) {
    const query = valueFor('q').trim();
    const order = valueFor('order');
    const state = {
      evidence: valueFor('evidence'),
      terms: search ? search.parse(query) : normalize(query).split(/\s+/).filter(Boolean),
      filters: filterFields.filter((field) => field.value).map((field) => [field.name, field.value]),
    };
    const matchingRows = [];
    const activeElement = document.activeElement;
    let hiddenFocus = false;
    let available = printing ? Infinity : limit;
    let mountedCount = 0;
    sortGroups(order);
    groups.forEach((group) => {
      const matching = group.ordered.filter(row => matches(row, state));
      matchingRows.push(...matching);
      const visible = matching.slice(0, available).map(row => row.element);
      available -= visible.length;
      mountedCount += visible.length;
      if (group.mounted.length !== visible.length || group.mounted.some((row, index) => row !== visible[index])) {
        if (group.mounted.some(row => row.contains(activeElement) && !visible.includes(row))) hiddenFocus = true;
        const fragment = document.createDocumentFragment();
        visible.forEach(row => { row.hidden = false; fragment.appendChild(row); });
        group.list.replaceChildren(fragment);
        group.mounted = visible;
        window.aibdBindTips?.(group.list);
      }
      if (group.element) group.element.hidden = visible.length === 0;
      if (group.count) group.count.textContent = `${matching.length} record${matching.length === 1 ? '' : 's'}`;
    });
    updateChoices(state);
    updateStatistics(matchingRows);
    updateSwaps();

    const filtered = Boolean(query || state.evidence || state.filters.length);
    if (count) {
      count.textContent = filtered
        ? `${matchingRows.length} of ${rows.length} records`
        : `${rows.length} record${rows.length === 1 ? '' : 's'}`;
    }
    if (empty) empty.hidden = matchingRows.length > 0;
    if (reset) reset.hidden = !filtered;
    const remaining = matchingRows.length - mountedCount;
    if (pagination) pagination.hidden = printing || remaining === 0;
    if (more) more.textContent = `Show ${Math.min(pageSize, remaining)} more`;
    if (showAll) showAll.textContent = `Show all ${matchingRows.length}`;
    if (shownCount) shownCount.textContent = `${mountedCount} of ${matchingRows.length} shown`;
    window.aibdShelf?.paint();
    if (hiddenFocus) fieldFor('q')?.focus({ preventScroll: true });

    if (updateAddress) {
      const address = new URL(window.location.href);
      parameterNames.forEach((key) => {
        const value = key === 'q' ? query : valueFor(key);
        if (value) address.searchParams.set(key, value);
        else address.searchParams.delete(key);
      });
      window.history.replaceState(null, '', `${address.pathname}${address.search}${address.hash}`);
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.clearTimeout(timer);
    apply();
  });
  form.addEventListener('input', (event) => {
    if (event.target.name !== 'q') return;
    window.clearTimeout(timer);
    timer = window.setTimeout(apply, 100);
  });
  form.addEventListener('change', () => {
    window.clearTimeout(timer);
    apply();
  });
  choices.forEach((button) => button.addEventListener('click', () => {
    window.clearTimeout(timer);
    const key = button.dataset.filter;
    const value = button.dataset.value || '';
    setValue(key, valueFor(key) === value ? '' : value);
    apply();
  }));
  swaps.forEach((button) => button.addEventListener('click', () => {
    window.clearTimeout(timer);
    const origin = button.dataset.originField || 'origin';
    const destination = button.dataset.destinationField || 'destination';
    const originValue = valueFor(origin);
    const destinationValue = valueFor(destination);
    if (!acceptsValue(origin, destinationValue) || !acceptsValue(destination, originValue)) return;
    setValue(origin, destinationValue);
    setValue(destination, originValue);
    apply();
  }));
  reset?.addEventListener('click', () => {
    window.clearTimeout(timer);
    const restoreFocus = document.activeElement === reset;
    ['q', 'evidence', ...filterFields.map((field) => field.name)].forEach((key) => setValue(key, ''));
    apply();
    if (restoreFocus) fieldFor('q')?.focus({ preventScroll: true });
  });
  function expand(all) {
    const previous = new Set(groups.flatMap(group => group.mounted));
    limit = all ? Infinity : limit + pageSize;
    apply(false);
    const added = groups.flatMap(group => group.mounted).find(row => !previous.has(row));
    added?.querySelector('h3 a')?.focus({ preventScroll: true });
  }
  more?.addEventListener('click', () => expand(false));
  showAll?.addEventListener('click', () => expand(true));
  window.addEventListener('beforeprint', () => { printing = true; apply(false); });
  window.addEventListener('afterprint', () => { printing = false; apply(false); });
  function revealHash() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const row = rows.find(row => row.element.id === id);
    if (!row) return;
    limit = Infinity;
    ['q', 'evidence', ...filterFields.map(field => field.name)].forEach(key => setValue(key, ''));
    apply(false);
    window.requestAnimationFrame(() => row.element.scrollIntoView({ block: 'start' }));
  }
  window.addEventListener('hashchange', revealHash);
  window.addEventListener('popstate', () => {
    window.clearTimeout(timer);
    readParameters();
    apply(false);
  });

  readParameters();
  apply(false);
  form.hidden = false;
  collection.querySelectorAll('[data-collection-enhance]').forEach((element) => { element.hidden = false; });
  revealHash();
})();
