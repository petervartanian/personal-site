// Each collection remains readable when JavaScript is unavailable.
(() => {
  const collection = document.querySelector('[data-collection]');
  if (!collection) return;

  const form = collection.querySelector('[data-collection-filters]');
  const list = collection.querySelector('[data-collection-results]');
  const count = collection.querySelector('[data-collection-count]');
  const empty = collection.querySelector('[data-collection-empty]');
  const reset = collection.querySelector('[data-collection-reset]');
  const filterFields = Array.from(form.querySelectorAll('[data-collection-filter]'));
  const parameterNames = ['q', 'evidence', 'order', ...filterFields.map((field) => field.name)];
  const evidenceOrder = { found: 0, studied: 1, reported: 2, claimed: 3 };
  const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const rows = Array.from(list.querySelectorAll('[data-collection-row]')).map((element, index) => ({
    element,
    index,
    text: normalize(element.dataset.searchText),
    filters: JSON.parse(element.dataset.filters || '{}'),
    evidence: element.dataset.evidence,
    date: element.dataset.date,
    title: element.dataset.title,
  }));
  let previousOrder = '';
  let timer;

  function readParameters() {
    const parameters = new URLSearchParams(window.location.search);
    parameterNames.forEach((key) => {
      const field = form.elements.namedItem(key);
      if (field) field.value = parameters.get(key) || '';
    });
  }

  function apply(updateAddress = true) {
    const query = form.elements.namedItem('q').value.trim();
    const evidenceField = form.elements.namedItem('evidence');
    const evidence = evidenceField ? evidenceField.value : '';
    const order = form.elements.namedItem('order').value;
    const activeFilters = filterFields.filter((field) => field.value);
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    let shown = 0;

    rows.forEach((row) => {
      const matches = (!evidence || row.evidence === evidence)
        && terms.every((term) => row.text.includes(term))
        && activeFilters.every((field) => {
          const value = row.filters[field.name];
          return Array.isArray(value) ? value.includes(field.value) : value === field.value;
        });
      row.element.hidden = !matches;
      if (matches) shown += 1;
    });

    if (order !== previousOrder) {
      const ordered = rows.slice().sort((first, second) => {
        if (order === 'evidence') {
          return evidenceOrder[first.evidence] - evidenceOrder[second.evidence]
            || second.date.localeCompare(first.date) || first.index - second.index;
        }
        if (order === 'newest') return second.date.localeCompare(first.date) || first.index - second.index;
        if (order === 'title') return first.title.localeCompare(second.title, 'en') || first.index - second.index;
        return first.index - second.index;
      });
      const fragment = document.createDocumentFragment();
      ordered.forEach((row) => fragment.appendChild(row.element));
      list.appendChild(fragment);
      previousOrder = order;
    }

    const filtered = Boolean(query || evidence || activeFilters.length);
    count.textContent = filtered
      ? `${shown} of ${rows.length} cases`
      : `${rows.length} case${rows.length === 1 ? '' : 's'}`;
    empty.hidden = shown > 0;
    reset.hidden = !filtered;

    if (updateAddress) {
      const address = new URL(window.location.href);
      const values = [['q', query], ['evidence', evidence], ['order', order],
        ...filterFields.map((field) => [field.name, field.value])];
      values.forEach(([key, value]) => {
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
  reset.addEventListener('click', () => {
    window.clearTimeout(timer);
    form.elements.namedItem('q').value = '';
    const evidenceField = form.elements.namedItem('evidence');
    if (evidenceField) evidenceField.value = '';
    filterFields.forEach((field) => { field.value = ''; });
    apply();
  });
  window.addEventListener('popstate', () => {
    window.clearTimeout(timer);
    readParameters();
    apply(false);
  });

  readParameters();
  apply(false);
  form.hidden = false;
})();
