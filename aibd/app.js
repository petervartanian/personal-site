// Client-side filtering for the records table. Works from URL parameters too.
(function () {
  var table = document.querySelector('[data-records]');
  if (!table) return;
  var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
  var form = document.querySelector('[data-filters]');
  var count = document.querySelector('[data-count]');
  var params = new URLSearchParams(window.location.search);

  function fill() {
    ['q', 'type', 'group', 'depth', 'domain'].forEach(function (key) {
      var el = form.elements[key];
      if (el && params.get(key)) el.value = params.get(key);
    });
    if (form.elements.unexpected && params.get('unexpected') === '1') form.elements.unexpected.checked = true;
  }

  function apply() {
    var q = (form.elements.q.value || '').trim().toLowerCase();
    var type = form.elements.type.value;
    var group = form.elements.group.value;
    var depth = form.elements.depth.value;
    var category = '';
    var domain = form.elements.domain.value;
    var unexpected = form.elements.unexpected.checked;
    var shown = 0;
    rows.forEach(function (row) {
      var d = row.dataset;
      var ok = true;
      if (q && d.text.indexOf(q) === -1) ok = false;
      if (type && d.type !== type) ok = false;
      if (group && (' ' + d.groups + ' ').indexOf(' ' + group + ' ') === -1) ok = false;
      if (depth && d.depth !== depth) ok = false;
      if (category && d.category !== category) ok = false;
      if (domain && d.domain !== domain) ok = false;
      if (unexpected && d.unexpected !== '1') ok = false;
      row.hidden = !ok;
      if (ok) shown += 1;
    });
    if (count) count.textContent = shown + ' of ' + rows.length + ' records' + ((q || type || group || depth || category || domain || unexpected) ? ', filtered' : '');
    form.classList.toggle('filtered', !!(q || type || group || depth || category || domain || unexpected));
    var next = new URLSearchParams(window.location.search);
    ['q', 'type', 'group', 'depth', 'domain', 'unexpected'].forEach(function (k) { next.delete(k); });
    if (q) next.set('q', q);
    if (type) next.set('type', type);
    if (group) next.set('group', group);
    if (depth) next.set('depth', depth);
    if (category) next.set(category);
    if (domain) next.set('domain', domain);
    if (unexpected) next.set('unexpected', '1');
    var qs = next.toString();
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  }

  fill();
  apply();
  form.addEventListener('input', apply);
  form.addEventListener('change', apply);
  form.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
  var reset = form.querySelector('[data-reset]');
  if (reset) reset.addEventListener('click', function () { form.reset(); apply(); });
})();

// The home page search box sends the query to the records page.
(function () {
  var search = document.querySelector('[data-search]');
  if (!search || document.querySelector('[data-explorer]')) return;
  search.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = search.elements.q.value.trim();
    window.location.href = search.dataset.search + (q ? '?q=' + encodeURIComponent(q) : '');
  });
})();

// The benefit legend opens from the information symbol beside its heading.
(function () {
  const button = document.querySelector('[data-legend-trigger]');
  const dialog = document.getElementById('benefit-legend');
  if (!button || !dialog) return;

  let returnTrigger = button;
  function openLegend(trigger) {
    returnTrigger = trigger;
    if (typeof dialog.showModal !== 'function') {
      window.location.href = dialog.querySelector('.benefit-legend-method a').href;
      return;
    }
    if ('showPopover' in HTMLElement.prototype) {
      document.querySelectorAll('.door-place-info:popover-open').forEach(panel => panel.hidePopover());
    }
    dialog.showModal();
    dialog.querySelector('.door-key-body').scrollTop = 0;
  }
  button.addEventListener('click', () => openLegend(button));
  document.addEventListener('click', event => { const trigger = event.target.closest('[data-rating-guide]'); if (trigger) openLegend(trigger); });
  dialog.querySelector('[data-legend-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => returnTrigger.focus({ preventScroll: true }));
  function outside(event) {
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  }
  let pressedOutside = false;
  dialog.addEventListener('pointerdown', event => { pressedOutside = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (pressedOutside && event.target === dialog && outside(event)) dialog.close();
    pressedOutside = false;
  });
})();

// Geographic details open on hover, keyboard focus, or a tap.
(function () {
  const triggers = [...document.querySelectorAll('[data-place-trigger]')];
  if (!triggers.length || !('showPopover' in HTMLElement.prototype)) return;
  let active = null;
  let closeTimer;
  let pinned = false;
  let restoringFocus = false;

  function place(button, panel) {
    const anchor = button.getBoundingClientRect();
    const viewport = window.visualViewport;
    const left = viewport?.offsetLeft || 0;
    const top = viewport?.offsetTop || 0;
    const width = viewport?.width || document.documentElement.clientWidth;
    const height = viewport?.height || window.innerHeight;
    const gap = 6, edge = 12;
    if (anchor.bottom < top || anchor.top > top + height) {
      panel.hidePopover();
      return;
    }
    panel.style.maxWidth = `${width - edge * 2}px`;
    panel.style.maxHeight = `${height - edge * 2}px`;
    const box = panel.getBoundingClientRect();
    const below = top + height - anchor.bottom - gap - edge;
    const above = anchor.top - top - gap - edge;
    const useBelow = box.height <= below || below >= above;
    const available = Math.max(64, useBelow ? below : above);
    panel.style.maxHeight = `${available}px`;
    const actual = panel.getBoundingClientRect();
    panel.style.left = `${Math.max(left + edge, Math.min(anchor.left + (anchor.width - actual.width) / 2, left + width - edge - actual.width))}px`;
    panel.style.top = `${Math.max(top + edge, useBelow ? anchor.bottom + gap : anchor.top - gap - actual.height)}px`;
  }

  function show(button) {
    clearTimeout(closeTimer);
    const panel = document.getElementById(button.getAttribute('popovertarget'));
    if (active && active.button !== button) {
      active.panel.hidePopover();
      pinned = false;
    }
    active = { button, panel };
    if (!panel.matches(':popover-open')) panel.showPopover();
    place(button, panel);
    button.setAttribute('aria-expanded', 'true');
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (!active || pinned) return;
      if (active.button.matches(':hover, :focus-visible') || active.panel.matches(':hover') || active.panel.contains(document.activeElement)) return;
      active.panel.hidePopover();
    }, 180);
  }

  triggers.forEach((button) => {
    const panel = document.getElementById(button.getAttribute('popovertarget'));
    button.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') show(button);
    });
    button.addEventListener('pointerleave', scheduleClose);
    button.addEventListener('focus', () => {
      if (!restoringFocus && button.matches(':focus-visible')) show(button);
    });
    button.addEventListener('blur', scheduleClose);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (active?.button === button && pinned && panel.matches(':popover-open')) {
        panel.hidePopover();
      } else {
        show(button);
        pinned = true;
      }
    });
    panel.addEventListener('pointerenter', () => clearTimeout(closeTimer));
    panel.addEventListener('pointerleave', scheduleClose);
    panel.addEventListener('toggle', () => {
      const open = panel.matches(':popover-open');
      button.setAttribute('aria-expanded', String(open));
      if (!open && active?.panel === panel) {
        active = null;
        pinned = false;
      }
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !active) return;
    event.preventDefault();
    const closing = active;
    active = null;
    pinned = false;
    restoringFocus = true;
    closing.panel.hidePopover();
    closing.button.setAttribute('aria-expanded', 'false');
    closing.button.focus({ preventScroll: true });
    requestAnimationFrame(() => { restoringFocus = false; });
  });
  const reposition = () => {
    if (active?.panel.matches(':popover-open')) place(active.button, active.panel);
  };
  window.addEventListener('resize', reposition, { passive: true });
  window.addEventListener('scroll', reposition, { passive: true });
  window.visualViewport?.addEventListener('resize', reposition, { passive: true });
  window.visualViewport?.addEventListener('scroll', reposition, { passive: true });
})();

// Views tailored to tasks (R1): presets choose record panels and table columns; Custom remembers the reader's own choice.
(function () {
  var PANELS = ['who', 'system', 'evidence', 'replication', 'compare', 'provenance'];
  var COLS = ['system', 'depth', 'groups', 'sources', 'domain', 'location', 'echoes'];
  var PRESETS = {
    everything: { panels: PANELS, cols: COLS },
    deployer: { panels: ['who', 'system', 'compare', 'replication'], cols: ['system', 'depth', 'groups', 'domain', 'echoes'] },
    assessor: { panels: ['who', 'system', 'replication', 'evidence'], cols: ['system', 'depth', 'groups', 'echoes'] },
    researcher: { panels: ['evidence', 'provenance', 'replication', 'who'], cols: ['system', 'sources', 'echoes', 'domain'] },
    policymaker: { panels: ['who', 'evidence', 'compare'], cols: ['depth', 'groups', 'location', 'domain'] },
    journalist: { panels: ['evidence', 'system', 'provenance'], cols: ['system', 'location', 'sources'] }
  };
  var KEY = 'aibd.view';
  var select = document.querySelector('[data-view]');
  if (!select) return;
  var button = document.querySelector('[data-customize]');
  var panel = document.querySelector('[data-customize-panel]');
  var params = new URLSearchParams(window.location.search);

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function apply(state) {
    PANELS.forEach(function (p) {
      var on = state.panels.indexOf(p) !== -1;
      document.querySelectorAll('[data-panel="' + p + '"]').forEach(function (el) { el.hidden = !on; });
      var box = document.querySelector('[data-toggle-panel="' + p + '"]');
      if (box) box.checked = on;
    });
    COLS.forEach(function (c) {
      var on = state.cols.indexOf(c) !== -1;
      document.querySelectorAll('[data-col="' + c + '"]').forEach(function (el) { el.hidden = !on; });
      var box = document.querySelector('[data-toggle-col="' + c + '"]');
      if (box) box.checked = on;
    });
    select.value = state.name;
    document.body.dataset.view = state.name;
  }
  function fromPreset(name) {
    var p = PRESETS[name] || PRESETS.everything;
    return { name: PRESETS[name] ? name : 'everything', panels: p.panels.slice(), cols: p.cols.slice() };
  }
  function current() {
    var fromUrl = params.get('view');
    if (fromUrl && PRESETS[fromUrl]) return fromPreset(fromUrl);
    var stored = load();
    if (stored && stored.panels && stored.cols) return stored;
    return fromPreset('everything');
  }
  var state = current();
  apply(state);
  save(state);

  select.addEventListener('change', function () {
    if (select.value === 'custom') {
      state.name = 'custom';
      if (panel) { panel.hidden = false; }
    } else {
      if (panel) { panel.hidden = true; }
      state = fromPreset(select.value);
    }
    apply(state); save(state);
    var next = new URLSearchParams(window.location.search);
    if (state.name === 'everything' || state.name === 'custom') next.delete('view'); else next.set('view', state.name);
    var qs = next.toString();
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  });
  if (button && panel) {
    button.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      button.setAttribute('aria-expanded', String(!panel.hidden));
    });
    var closer = panel.querySelector('[data-customize-close]');
    if (closer) closer.addEventListener('click', function () { panel.hidden = true; });
    panel.addEventListener('change', function (e) {
      var t = e.target;
      if (t.matches('[data-toggle-panel]')) {
        var p = t.getAttribute('data-toggle-panel');
        state.panels = state.panels.filter(function (x) { return x !== p; });
        if (t.checked) state.panels.push(p);
      } else if (t.matches('[data-toggle-col]')) {
        var c = t.getAttribute('data-toggle-col');
        state.cols = state.cols.filter(function (x) { return x !== c; });
        if (t.checked) state.cols.push(c);
      } else {
        return;
      }
      state.name = 'custom';
      apply(state); save(state);
    });
  }
})();


// Product chrome: chart hover card, theme toggle, keyboard search, segmented view control.
(function () {
  var tip = document.querySelector('[data-tip]');
  function bindTips(root) {
    if (!tip) return;
    (root || document).querySelectorAll('.soundings .mark, [data-tip-title]').forEach(function (mark) {
      if (mark.dataset.tipBound) return;
      mark.dataset.tipBound = '1';
      function show(e) {
        tip.innerHTML = '<b></b><div class="row meta"></div><div class="row sub"></div>';
        tip.querySelector('b').textContent = mark.dataset.tipTitle || '';
        tip.querySelector('.meta').textContent = mark.dataset.tipMeta || '';
        tip.querySelector('.sub').textContent = mark.dataset.tipSub || '';
        tip.classList.add('on'); tip.setAttribute('aria-hidden', 'false');
        move(e);
      }
      function move(e) {
        var x = e.clientX + 14, y = e.clientY + 14;
        var w = tip.offsetWidth, h = tip.offsetHeight;
        if (x + w > window.innerWidth - 12) x = e.clientX - w - 14;
        if (y + h > window.innerHeight - 12) y = e.clientY - h - 14;
        tip.style.left = x + 'px'; tip.style.top = y + 'px';
      }
      function hide() { tip.classList.remove('on'); tip.setAttribute('aria-hidden', 'true'); }
      mark.addEventListener('mouseenter', show);
      mark.addEventListener('mousemove', move);
      mark.addEventListener('mouseleave', hide);
      mark.addEventListener('focus', function () { var r = mark.getBoundingClientRect(); show({clientX: r.right, clientY: r.top}); });
      mark.addEventListener('blur', hide);
    });
  }
  window.aibdBindTips = bindTips;
  bindTips(document);
  var input = document.querySelector('[data-search-input]');
  if (input) {
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.focus(); input.select(); }
      if (e.key === '/' && (e.metaKey || e.ctrlKey) && document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) === -1) { e.preventDefault(); input.focus(); }
    });
  }
  var seg = document.querySelector('[data-view-seg]');
  var select = document.querySelector('[data-view]');
  if (seg && select) {
    function paint() {
      seg.querySelectorAll('[data-view-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view-btn') === select.value)); });
    }
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-view-btn]');
      if (!b) return;
      select.value = b.getAttribute('data-view-btn');
      select.dispatchEvent(new Event('change', { bubbles: true }));
      paint();
    });
    new MutationObserver(paint).observe(select, { attributes: true, attributeFilter: ['value'] });
    paint();
    setTimeout(paint, 0);
  }
})();


function reduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

// Shelf: the cases a reader keeps, in localStorage, on every page.
(function () {
  var KEY = 'aibd-shelf';
  var sharedIds = null;
  function readAddress(address) { sharedIds = address.has('compare') && window.AIBDExplorer ? window.AIBDExplorer.caseIds(address.get('compare')) : null; }
  readAddress(new URLSearchParams(window.location.search));
  function ids() { if (sharedIds !== null) return sharedIds.slice(); try { var v = JSON.parse(window.localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function save(list) { if (sharedIds !== null) { sharedIds = list.slice(); return; } try { window.localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  var lastCleared = [];
  var shelf = window.aibdShelf = {
    ids: ids,
    readAddress: readAddress,
    has: function (id) { return ids().indexOf(id) !== -1; },
    toggle: function (id) { var list = ids(), i = list.indexOf(id); if (i === -1) list.push(id); else list.splice(i, 1); save(list); return i === -1; },
    clear: function () { save([]); }
  };
  function paint() {
    var n = ids().length;
    document.querySelectorAll('[data-shelf-link]').forEach(function (a) { a.textContent = n ? 'Compare (' + n + ')' : 'Compare'; });
    document.querySelectorAll('[data-keep]').forEach(function (b) {
      var id = b.getAttribute('data-keep'), on = shelf.has(id);
      var label = on ? b.getAttribute('data-kept-label') || 'Selected' : b.getAttribute('data-keep-label') || 'Compare';
      b.textContent = label; b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', label + (/\b(benefit|case|record)\b/i.test(label) ? '' : ' benefit') + ' № ' + id.replace('AIBD-', '') + (b.closest('[data-compare]') ? ' from comparison' : ''));
    });
    document.querySelectorAll('[data-shelf-count]').forEach(function (s) { s.textContent = String(n); });
    document.querySelectorAll('[data-shelf-words]').forEach(function (s) { s.textContent = n ? n + (n === 1 ? ' record selected' : ' records selected') : 'Nothing selected yet'; });
    document.querySelectorAll('[data-compare-open]').forEach(function (b) { b.hidden = false; });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-keep]');
    if (b) {
      var comparison = b.closest('[data-compare]'), table = b.closest('.case-table'), keptId = b.getAttribute('data-keep');
      shelf.toggle(keptId); paint();
      if (window.aibdApply) window.aibdApply();
      if (!b.isConnected) {
        var replacement = table && Array.from(table.querySelectorAll('[data-keep]')).find(function (button) { return button.getAttribute('data-keep') === keptId; });
        var target = replacement || (comparison && comparison.childElementCount ? comparison : document.querySelector('[data-compare-open]'));
        if (target) target.focus({ preventScroll: true });
      }
      return;
    }
    if (e.target.closest('[data-shelf-clear]')) { lastCleared = ids(); shelf.clear(); paint(); document.querySelectorAll('[data-shelf-undo]').forEach(function (u) { u.hidden = !lastCleared.length; }); if (window.aibdApply) window.aibdApply(); return; }
    if (e.target.closest('[data-shelf-restore]')) { save(lastCleared); lastCleared = []; paint(); document.querySelectorAll('[data-shelf-undo]').forEach(function (u) { u.hidden = true; }); if (window.aibdApply) window.aibdApply(); }
  });
  shelf.paint = paint;
  window.addEventListener('storage', function (event) {
    if (event.key !== KEY && event.key !== null) return;
    lastCleared = [];
    paint();
    document.querySelectorAll('[data-shelf-undo]').forEach(function (element) { element.hidden = true; });
    if (window.aibdApply) window.aibdApply();
  });
  paint();
})();

// The collection index works without JavaScript. Close it on Escape or a click
// elsewhere, returning focus only when the closed index contained the focus.
(function () {
  var menus = document.querySelectorAll('[data-collections-menu]');
  function close(menu) {
    if (!menu.open) return;
    var returnFocus = menu.contains(document.activeElement);
    menu.open = false;
    var summary = menu.querySelector('summary');
    if (returnFocus && summary) summary.focus();
  }
  document.addEventListener('click', function (e) { menus.forEach(function (menu) { if (!menu.contains(e.target)) close(menu); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menus.forEach(close); });
})();

// The door forwards any explorer address (a tool, a query, a filter) to the cases page.
(function () {
  if (!document.querySelector('[data-door]')) return;
  if (window.location.search.length > 1) window.location.replace('cases.html' + window.location.search);
})();

// Faceted explorer on the cases page: every facet recounts against the other active filters.
(function () {
  var ex = document.querySelector('[data-explorer]');
  if (!ex) return;
  var KEYS = ['kind', 'type', 'group', 'depth', 'sector', 'country', 'made', 'unexpected', 'evidence', 'claim', 'developer', 'deployer', 'harm', 'status', 'stage', 'import'];
  var explorerCore = window.AIBDExplorer;
  var compareData = null, compareLoading = false, compareFailed = false;
  var compareStatus = ex.querySelector('[data-compare-status]');
  var compareMessage = ex.querySelector('[data-compare-message]');
  var compareRetry = ex.querySelector('[data-compare-retry]');
  var PANELS = ['map', 'lists', 'timeline', 'matrix', 'table', 'shelf', 'roles', 'latest', 'briefs', 'submit', 'method', 'data'];
  var VIEWS = ['table', 'map', 'timeline', 'matrix'];
  var ALIAS = { entities: 'map' };
  var pendingTo = (new URLSearchParams(window.location.search).get('to') || '') || ((new URLSearchParams(window.location.search).get('open') === 'entities') ? 'orgs' : '');
  var controls = ex.querySelector('[data-case-controls]');
  var viewSelect = ex.querySelector('[data-case-view]');
  var sortSelect = ex.querySelector('[data-case-sort]');
  var roleSelect = ex.querySelector('[data-case-role]');
  var options = ex.querySelector('[data-case-options]');
  var optionsState = ex.querySelector('[data-case-options-state]');
  function paintOptionsState() {
    if (!optionsState) return;
    var labels = [viewSelect, roleSelect].filter(function (select) { return select && select.value; }).map(function (select) {
      return select.options[select.selectedIndex].textContent;
    });
    optionsState.textContent = labels.join(', ');
    optionsState.hidden = !labels.length;
  }
  function focusControl(target) {
    if (!target) return;
    var disclosure = target.closest('[data-case-options]');
    if (disclosure && !disclosure.open) target = disclosure.querySelector('summary');
    if (target) target.focus({ preventScroll: true });
  }
  if (options) options.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !options.open) return;
    options.open = false;
    focusControl(options.querySelector('summary'));
    event.preventDefault();
  });
  var entityLogoObserver = null;
  var observedEntityLogos = new WeakSet();
  function loadEntityLogo(image) {
    var source = image.getAttribute('data-src');
    if (!source) return;
    function done() {
      if (entityLogoObserver) entityLogoObserver.unobserve(image);
      image.removeEventListener('load', done);
      image.removeEventListener('error', done);
    }
    image.addEventListener('load', done);
    image.addEventListener('error', done);
    image.src = source;
    image.removeAttribute('data-src');
  }
  function observeEntityLogos(root) {
    if (!entityLogoObserver && typeof window.IntersectionObserver === 'function') {
      entityLogoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting && observedEntityLogos.has(entry.target)) loadEntityLogo(entry.target); });
      }, { rootMargin: '160px 0px' });
    }
    root.querySelectorAll('.gaz img.logo[data-src]').forEach(function (image) {
      if (observedEntityLogos.has(image)) return;
      observedEntityLogos.add(image);
      if (entityLogoObserver) entityLogoObserver.observe(image); else loadEntityLogo(image);
    });
  }
  function pauseEntityLogos(root) {
    if (!entityLogoObserver) return;
    root.querySelectorAll('.gaz img.logo[data-src]').forEach(function (image) {
      entityLogoObserver.unobserve(image);
      observedEntityLogos.delete(image);
    });
  }
  // Filters are independent of the selected view. Older ?open=lists links remain valid.
  var initialAddress = new URLSearchParams(window.location.search);
  var filtersOpen = initialAddress.get('filters') === '1' || initialAddress.get('open') === 'lists';
  var openTool = (new URLSearchParams(window.location.search).get('open') || '').split(',').map(function (k) { return ALIAS[k] || k; }).filter(function (k) { return PANELS.indexOf(k) !== -1; })[0] || null;
  if (openTool === 'lists') openTool = null;
  function goTo() {
    if (!pendingTo) return;
    var target = document.getElementById(pendingTo); if (!target) return;
    pendingTo = ''; target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  }
  function loadFragment(panel) {
    var slots = Array.from(panel.querySelectorAll('[data-fragment]')).filter(function (slot) { return !slot.dataset.loaded && !slot.dataset.loading; });
    if (!slots.length) return;
    // Keep logos inert until every fragment has settled, so that an early
    // Gazetteer response cannot start downloads before the atlas takes its space.
    pauseEntityLogos(panel);
    slots.forEach(function (slot) {
      slot.dataset.loading = '1'; slot.setAttribute('aria-busy', 'true'); slot.textContent = 'Loading…';
      fetch(slot.getAttribute('data-fragment')).then(function (r) { if (!r.ok) throw new Error('Chart request failed'); return r.text(); }).then(function (html) {
        slot.innerHTML = html; slot.dataset.loaded = '1';
        collectButtons(); bindAtlas(); if (window.aibdBindTips) window.aibdBindTips(slot); apply();
      }).catch(function () { slot.textContent = 'This chart could not be loaded.'; }).then(function () {
        slot.removeAttribute('aria-busy'); delete slot.dataset.loading;
        if (panel.querySelector('[data-fragment][data-loading]')) return;
        observeEntityLogos(panel);
        setTimeout(goTo, 50);
      });
    });
  }
  function applyTools() {
    PANELS.forEach(function (k) {
      var on = k === 'lists' ? filtersOpen : k === openTool;
      var panel = ex.querySelector('[data-tool-panel="' + k + '"]'); if (panel) { panel.hidden = !on; if (on) loadFragment(panel); }
      if (k === 'table') ex.classList.toggle('table-view', on);
    });
    ex.classList.toggle('filters-open', filtersOpen);
    if (viewSelect) viewSelect.value = VIEWS.indexOf(openTool) !== -1 ? openTool : '';
    ex.querySelectorAll('[data-explorer-view]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.explorerView === (VIEWS.indexOf(openTool) !== -1 ? openTool : openTool ? '__tool__' : ''))); });
    paintOptionsState();
    ex.querySelectorAll('[data-open-tool]').forEach(function (b) {
      var on = b.getAttribute('data-open-tool') === 'lists' ? filtersOpen : (b.getAttribute('data-open-tool') || null) === openTool;
      b.classList.toggle('on', on);
      if (b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded', String(on));
      if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', String(on));
    });
    var compare = ex.querySelector('[data-compare-open]');
    if (compare) compare.hidden = false;
  }
  ex.addEventListener('click', function (e) {
    if (e.target.closest('[data-filter-close]')) { filtersOpen = false; applyTools(); apply(true); focusControl(ex.querySelector('[data-open-tool=lists]')); return; }
    var view = e.target.closest('[data-explorer-view]');
    if (view) { openTool = view.dataset.explorerView || null; applyTools(); apply(true); return; }
    var c = e.target.closest('[data-tool-close]');
    if (c) {
      e.preventDefault();
      var previousTool = openTool;
      openTool = null; applyTools(); apply(true);
      var target = previousTool === 'lists' ? ex.querySelector('[data-open-tool="lists"]') : previousTool === 'shelf' ? ex.querySelector('[data-compare-open]:not([hidden])') : previousTool === 'roles' ? roleSelect : null;
      target = target || ex.querySelector('[data-explorer-view="' + (VIEWS.indexOf(previousTool) !== -1 ? previousTool : '') + '"]');
      focusControl(target);
      var top = controls || ex.querySelector('.lede') || ex;
      top.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    var s = e.target.closest('[data-show-cases]');
    if (s) { e.preventDefault(); var head = document.getElementById('cases'); if (head) head.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); }
  });
  // Escape closes the Filters panel, as its Close button does, unless an open popover handled it first.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !filtersOpen || e.defaultPrevented) return;
    var panel = ex.querySelector('[data-tool-panel="lists"]');
    if (!panel || panel.hidden) return;
    filtersOpen = false; applyTools(); apply(true); focusControl(ex.querySelector('[data-open-tool=lists]'));
  });
  window.addEventListener('popstate', function () {
    var p = new URLSearchParams(window.location.search);
    openTool = (p.get('open') || '').split(',').map(function (k) { return ALIAS[k] || k; }).filter(function (k) { return PANELS.indexOf(k) !== -1; })[0] || null;
    filtersOpen = p.get('filters') === '1' || openTool === 'lists';
    if (openTool === 'lists') openTool = null;
    if (window.aibdShelf) { window.aibdShelf.readAddress(p); window.aibdShelf.paint(); }
    if (typeof readFilters === 'function') readFilters(p);
    if (typeof readTrend === 'function') readTrend(p);
    if (typeof readComparisonFields === 'function') { selectedComparisonFields = readComparisonFields(p); paintComparisonFields(); }
    if (typeof setRole === 'function') setRole(p.get('role') || '');
    readSort(p);
    applyTools(); apply();
  });
  if (viewSelect) viewSelect.addEventListener('change', function () { openTool = viewSelect.value || null; applyTools(); apply(true); });
  applyTools();
  var sortState = { key: null, dir: 1 };
  var search = window.AIBDSearch;
  var sortDescription = ex.querySelector('[data-sort-description]');
  function sortBy(key, dir) {
    sortState.key = key; sortState.dir = dir;
    rows = rows.slice().sort(function (p, q) {
      return search.compareRows(rowData.get(p).data, rowData.get(q).data, key, dir);
    });
    if (sortDescription) {
      var rule;
      if (!key || key === 'depth') rule = 'Depth ' + (dir === 1 ? '5 to 1' : '1 to 5') + '. Ties: evidence, latest date, then number. Unassessed depths follow.';
      else if (key === 'date') rule = (dir === 1 ? 'Latest' : 'Earliest') + ' record date first. Dates marked ≤ use publication dates. Ties: evidence, depth, then number. Unassessed dates follow.';
      else if (key === 'evidence') rule = (dir === 1 ? 'Courts and regulators, independent studies, independent reporting, then parties’ accounts.' : 'Parties’ accounts, independent reporting, independent studies, then courts and regulators.') + ' Ties: depth, latest date, then number.';
      else if (key === 'sources') rule = 'Publications, ' + (dir === 1 ? 'most' : 'fewest') + ' first. Several publications may describe one observation. Ties: depth, evidence, latest date, then number.';
      else rule = (key === 'headline' ? 'Title' : 'Sector') + (dir === 1 ? ', Z to A.' : ', A to Z.') + ' Ties: depth, evidence, latest date, then number.';
      sortDescription.textContent = rule;
    }
    ex.querySelectorAll('[data-sort-key]').forEach(function (x) {
      var on = x.getAttribute('data-sort-key') === (key || 'depth');
      x.classList.toggle('on', on);
      x.setAttribute('aria-pressed', String(on));
      if (x.closest('th')) x.closest('th').setAttribute('aria-sort', on ? (dir === 1 ? 'descending' : 'ascending') : 'none');
      x.setAttribute('aria-label', x.textContent + (on ? ', ' + (dir === 1 ? 'descending' : 'ascending') + '; reverse order' : '; sort'));
    });
    if (sortSelect) {
      var choice = key ? key + ':' + (dir === 1 ? 'desc' : 'asc') : 'depth:desc';
      var available = Array.prototype.some.call(sortSelect.options, function (option) { return option.value === choice; });
      var custom = sortSelect.querySelector('[data-column-order]');
      if (custom) { custom.hidden = available; custom.textContent = (key === 'headline' ? 'Record' : key === 'sector' ? 'Sector' : 'Publications') + (key === 'sources' ? (dir === 1 ? ': high to low' : ': low to high') : (dir === 1 ? ': Z–A' : ': A–Z')); }
      sortSelect.value = available ? choice : '';
    }
  }
  function readSort(address) {
    var requested = (address.get('sort') || '').split(':');
    var key = requested[0] === 'year' ? 'date' : requested[0];
    if (['depth', 'date', 'evidence', 'headline', 'sector', 'sources'].indexOf(key) !== -1) {
      sortBy(key, requested[1] === 'asc' ? -1 : 1);
    } else if (role && ROLE_SORT[role]) {
      sortBy(ROLE_SORT[role][0], ROLE_SORT[role][1]);
    } else {
      sortBy(null, 1);
    }
  }
  if (sortSelect) sortSelect.addEventListener('change', function () {
    var requested = sortSelect.value.split(':');
    sortBy(requested[0], requested[1] === 'asc' ? -1 : 1);
    apply(true);
  });
  ex.querySelectorAll('[data-sort-key]').forEach(function (h) {
    h.addEventListener('click', function () {
      var key = h.getAttribute('data-sort-key');
      sortBy(key, (sortState.key || 'depth') === key ? -sortState.dir : key === 'headline' || key === 'sector' ? -1 : 1);
      apply(true);
    });
  });
  var atlasZoom = 1;
  function bindAtlas() {
    var atlas = ex.querySelector('.worldmap');
    if (!atlas || atlas.dataset.bound) return;
    atlas.dataset.bound = '1';
    var readout = ex.querySelector('[data-atlas-readout]');
    ex.querySelectorAll('[data-plate]').forEach(function (b) {
      b.addEventListener('click', function () {
        atlas.setAttribute('viewBox', b.getAttribute('data-plate'));
        ex.querySelectorAll('[data-plate]').forEach(function (x) { x.classList.toggle('on', x === b); });
        atlasZoom = 960 / (parseFloat(b.getAttribute('data-plate').split(' ')[2]) || 960);
        var arrow = atlas.querySelector('#arrow'); if (arrow) { var mw = (5 / Math.pow(atlasZoom, 0.75)).toFixed(2); arrow.setAttribute('markerWidth', mw); arrow.setAttribute('markerHeight', mw); }
        paintAtlas();
      });
    });
    var lastReadout = null;
    function show(land) {
      if (!readout) return;
      if (land === lastReadout) return;
      lastReadout = land;
      if (!land) { readout.textContent = ''; return; }
      var key = land.getAttribute('data-route-key') || land.getAttribute('data-route');
      var card = key ? ex.querySelector('[data-route-card="' + key.replace(/"/g, '\\"') + '"]') : null;
      if (card && atlas.dataset.filtered !== 'true') { readout.innerHTML = card.innerHTML; return; }
      var t = land.querySelector('title'); readout.textContent = t ? t.textContent : '';
    }
    atlas.addEventListener('mousemove', function (e) { show(e.target.closest('.land, [data-route]')); });
    ex.querySelectorAll('[data-layer-btn]').forEach(function (b) {
      b.addEventListener('click', function () {
        var layer = b.getAttribute('data-layer-btn');
        ex.querySelectorAll('[data-layer-btn]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        atlas.querySelectorAll('[data-layer]').forEach(function (g) { g.classList.toggle('layer-off', g.getAttribute('data-layer') !== layer); });
        var note = ex.querySelector('[data-made-note]'); if (note) note.hidden = layer !== 'made';
        var flows = ex.querySelector('[data-flows-note]'); if (flows) flows.hidden = layer !== 'flows';
      });
    });
    atlas.addEventListener('mousedown', function (e) { if (e.target.closest('[data-route]')) e.preventDefault(); });
    atlas.addEventListener('click', function (e) {
      var route = e.target.closest('[data-route]'); if (!route) return;
      e.preventDefault(); e.stopPropagation();
      var parts = route.getAttribute('data-route').split('|');
      var same = active.made && active.made[parts[0]] && active.country && active.country[parts[1]];
      KEYS.forEach(function (k) { active[k] = {}; });
      if (!same) { active.made = {}; active.made[parts[0]] = true; active.country = {}; active.country[parts[1]] = true; }
      apply(true);
    }, true);
    atlas.addEventListener('keydown', function (e) {
      var land = e.target.closest('.land, [data-route]'); if (!land) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); land.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }
    });
    atlas.addEventListener('focusin', function (e) { var land = e.target.closest('.land, [data-route]'); if (land) show(land); });
    atlas.addEventListener('mouseleave', function () { lastReadout = null; if (readout) readout.textContent = ''; });
    atlas.addEventListener('aibd:counts', function () { lastReadout = null; if (readout) readout.textContent = ''; var land = document.activeElement && document.activeElement.closest('.land, [data-route]'); if (land && atlas.contains(land)) show(land); });
  }
  bindAtlas();
  ex.addEventListener('click', function (e) {
    var fold = e.target.closest('[data-fold]');
    if (fold) { var li = fold.closest('.juris'); var open = li.classList.toggle('folded'); fold.setAttribute('aria-expanded', String(!open)); return; }
    var morep = e.target.closest('[data-more-parties]');
    if (morep) { morep.closest('.parties').classList.add('all'); morep.remove(); return; }
  });
  ex.addEventListener('click', function (e) {
    var route = e.target.closest('.gaz [data-route]'); if (!route) return;
    var parts = route.getAttribute('data-route').split('|');
    var same = active.made && active.made[parts[0]] && active.country && active.country[parts[1]];
    KEYS.forEach(function (k) { active[k] = {}; });
    if (!same) { active.made = {}; active.made[parts[0]] = true; active.country = {}; active.country[parts[1]] = true; }
    apply(true);
  });
  ex.addEventListener('click', function (e) {
    var land = e.target.closest('.worldmap [data-facet="country"], .worldmap [data-facet="made"]'); if (!land) return;
    var sec = document.getElementById('j-' + land.getAttribute('data-value').replace(/ /g, '-').toLowerCase());
    if (sec) { sec.classList.remove('folded'); var fb = sec.querySelector('[data-fold]'); if (fb) fb.setAttribute('aria-expanded', 'true'); setTimeout(function () { sec.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); }, 80); }
  });
  var LABELS = { type: 'type', group: 'beneficiary', harm: 'related harm', depth: 'depth', sector: 'sector', country: 'country', year: 'year', unexpected: 'unexpected', evidence: 'confidence', claim: 'claim', developer: 'developer', deployer: 'deployer', made: 'made in', status: 'benefit status', stage: 'stage of use', import: 'imported from' };
  var PAGE = 40, showAll = false;
  var returnPosition = history.state && history.state.aibdExplorer;
  if (returnPosition && returnPosition.url !== window.location.href) returnPosition = null;
  if (returnPosition) showAll = Boolean(returnPosition.showAll);
  function rememberPosition() {
    var state = Object.assign({}, history.state || {});
    state.aibdExplorer = { url: window.location.href, y: window.scrollY, showAll: showAll };
    history.replaceState(state, '', window.location.href);
  }
  window.addEventListener('pagehide', rememberPosition);
  ex.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (link && new URL(link.href, window.location.href).pathname !== window.location.pathname) rememberPosition();
  });
  var more = ex.querySelector('[data-more-rows]');
  var resultList = ex.querySelector('ol.results');
  var rows = Array.prototype.slice.call(ex.querySelectorAll('[data-row]'));
  var remaining = ex.querySelector('template[data-remaining-rows]');
  if (remaining) {
    rows = rows.concat(Array.prototype.slice.call(remaining.content.querySelectorAll('[data-row]')));
    remaining.remove();
  }
  var rowData = new WeakMap();
  var baseCounts = Object.create(null);
  KEYS.forEach(function (key) { baseCounts[key] = Object.create(null); });
  rows.forEach(function (row, rank) {
    var data = Object.assign({}, row.dataset), facets = Object.create(null);
    KEYS.forEach(function (key) {
      facets[key] = Array.from(new Set((data[key] || '').split('|')));
      facets[key].forEach(function (value) { baseCounts[key][value] = (baseCounts[key][value] || 0) + 1; });
    });
    rowData.set(row, { data: data, facets: facets, places: data.place ? data.place.split(';') : [], rank: rank, titleField: [search.field('Title', data.headline || '')] });
  });
  var matchedRows = rows.slice();
  var mountedRows = Array.prototype.slice.call(resultList.querySelectorAll('[data-row]'));
  function renderRows(visible) {
    if (visible.length === mountedRows.length && visible.every(function (row, index) { return row === mountedRows[index]; })) return;
    var fragment = document.createDocumentFragment();
    visible.forEach(function (row) { row.hidden = false; fragment.appendChild(row); });
    resultList.replaceChildren(fragment);
    mountedRows = visible.slice();
    if (window.aibdBindTips) window.aibdBindTips(resultList);
    if (window.aibdShelf) window.aibdShelf.paint();
  }
  var buttons = [];
  var buttonData = new WeakMap();
  function collectButtons() {
    buttons = Array.prototype.slice.call(ex.querySelectorAll('[data-facet]'));
    buttons.forEach(function (button) {
      if (!buttonData.has(button)) buttonData.set(button, {
        key: button.dataset.facet, value: button.dataset.value, badge: button.querySelector('[data-n]'),
        panel: button.closest('[data-tool-panel]')?.getAttribute('data-tool-panel'),
        count: null, on: null
      });
    });
  }
  collectButtons();
  var q = ex.querySelector('[data-q]') || document.querySelector('[data-search-input]');
  var count = ex.querySelector('[data-count]');
  var params = new URLSearchParams(window.location.search);
  var dateFrom = '', dateTo = '';
  var fromInput = ex.querySelector('[data-date-from]'), toInput = ex.querySelector('[data-date-to]');
  var trendGroup = 'status', trendMode = 'count', trendEvents = true;
  function readTrend(p) {
    trendGroup = ['status', 'sector', 'depth', 'evidence', 'type'].indexOf(p.get('group_by')) !== -1 ? p.get('group_by') : 'status';
    trendMode = p.get('measure') === 'share' ? 'share' : 'count';
    // By default the years count only records dated to their event; a collection or publication date is not when a benefit happened.
    trendEvents = p.get('dates') !== 'all';
    if (ex.querySelector('[data-trend-group]')) ex.querySelector('[data-trend-group]').value = trendGroup;
    if (ex.querySelector('[data-trend-events]')) ex.querySelector('[data-trend-events]').checked = trendEvents;
  }
  readTrend(params);
  var active = {};
  function readFilters(p) {
    KEYS.forEach(function (k) { var v = p.get(k); active[k] = {}; if (v) v.split('|').forEach(function (x) { active[k][x] = true; }); });
    if (q) q.value = p.get('q') || '';
    dateFrom = explorerCore.validDate(p.get('from')); dateTo = explorerCore.validDate(p.get('to_date'));
    if (fromInput) fromInput.value = dateFrom; if (toInput) toInput.value = dateTo;
    if ((dateFrom || dateTo) && fromInput) fromInput.closest('details').open = true;
  }
  var role = params.get('role') || '';
  var ROLE_SORT = { buyer: ['evidence', 1], regulator: ['evidence', 1], insurer: ['depth', 1], reporter: ['date', 1] };
  function roleLine(c) {
    if (role === 'buyer') {
      var s = c.sys + (c.dev && c.dev !== 'Unstated' ? ', by ' + c.dev : '') + '. ';
      s += c.cmp ? (c.basis === 'measured' ? 'Measured against ' : c.basis === 'assumed' ? 'Assumed comparison: ' : 'Comparison: ') + c.cmp + (c.before && c.after && c.before.length <= 60 && c.after.length <= 60 ? ': ' + c.before + ' to ' + c.after : '') + '.' : 'No comparison stated.';
      if (c.lstatus && c.lstatus !== 'unknown') s += ' Since then: ' + c.lstatus + (c.ldate ? ', ' + c.ldate : '') + '.';
      return s;
    }
    if (role === 'regulator') return c.claim + '.' + (c.dep_name ? ' Deployed by ' + c.dep_name + '.' : '') + (c.lstatus === 'litigated' ? ' Litigated' + (c.ldate ? ' on ' + c.ldate : '') + '.' : '') + (c.harm ? ' A related incident concerns a similar kind of system and stakeholder.' : '');
    if (role === 'insurer') return (c.val ? c.val + '.' : 'No value stated by a source.') + (c.lstatus && c.lstatus !== 'unknown' ? ' Since then: ' + c.lstatus + '.' : '') + ' ' + c.cat + '.';
    if (role === 'reporter') return c.sum + ' ' + c.cb;
    return '';
  }
  function paintRole() {
    rows.forEach(function (r) {
      var box = r.querySelector('.extra');
      if (!role) { if (box) box.remove(); return; }
      if (!compareData) return;
      var c = compareData[rowData.get(r).data.id]; if (!c) return;
      if (!box) { box = document.createElement('div'); box.className = 'extra'; r.querySelector('div:nth-child(2)').appendChild(box); }
      box.textContent = roleLine(c);
    });
  }
  function paintCompareStatus() {
    var needed = Boolean(role || (openTool === 'shelf' && window.aibdShelf && window.aibdShelf.ids().length));
    if (compareStatus) compareStatus.hidden = !needed || (!compareLoading && !compareFailed);
    if (compareMessage) compareMessage.textContent = compareFailed ? 'Details for this view could not load.' : 'Loading record details…';
    if (compareRetry) { compareRetry.hidden = !compareFailed; compareRetry.disabled = compareLoading; }
    var box = ex.querySelector('[data-compare]');
    if (box) box.setAttribute('aria-busy', String(needed && compareLoading));
  }
  function loadCompare() {
    if (compareData || compareLoading || compareFailed) return;
    compareLoading = true;
    paintCompareStatus();
    fetch('compare.json').then(function (response) {
      if (!response.ok) throw new Error('Record details request failed');
      return response.json();
    }).then(function (data) {
      compareData = data; compareLoading = false;
      // The reader can change views while this shared request is in flight.
      paintRole();
      if (openTool === 'shelf' && window.aibdRenderCompare) window.aibdRenderCompare();
      paintCompareStatus();
    }).catch(function () {
      compareLoading = false; compareFailed = true; paintCompareStatus();
    });
  }
  if (compareRetry) compareRetry.addEventListener('click', function () {
    compareFailed = false; loadCompare();
    var target = openTool === 'shelf' ? ex.querySelector('[data-compare-open]') : roleSelect;
    focusControl(target);
  });
  function setRole(r) {
    role = r || '';
    if (roleSelect) roleSelect.value = role;
    paintOptionsState();
    if (role) ex.setAttribute('data-role', role); else ex.removeAttribute('data-role');
    if (role) loadCompare();
    paintRole();
    paintCompareStatus();
    ex.querySelectorAll('[data-role]').forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-role') || '') === role)); });
    if (role && ROLE_SORT[role]) sortBy(ROLE_SORT[role][0], ROLE_SORT[role][1]);
  }
  ex.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-role]'); if (!b) return;
    setRole(b.getAttribute('data-role')); apply(true);
    var head = document.getElementById('cases'); if (head && role) head.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  });
  if (roleSelect) roleSelect.addEventListener('change', function () { setRole(roleSelect.value); apply(true); });
  readFilters(params);
  if (role) setRole(role);
  if ((params.get('open') || '') === 'random') { var pick0 = rows[Math.floor(Math.random() * rows.length)]; if (pick0) window.location.replace('records/' + pick0.dataset.id + '.html'); }
  var submitForm = ex.querySelector('[data-submit]');
  if (submitForm) submitForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = submitForm.elements;
    var body = 'What happened:\n' + f.body.value.trim() + '\n\nSource: ' + f.source.value.trim() + (f.who.value.trim() ? '\n\nFrom: ' + f.who.value.trim() : '');
    window.location.href = submitForm.getAttribute('action') + '?subject=' + encodeURIComponent('A record for the AI Benefits Database') + '&body=' + encodeURIComponent(body);
  });
  readSort(params);
  function hasAny(obj) { for (var k in obj) if (obj.hasOwnProperty(k)) return true; return false; }
  // Jurisdictions and organizations are downstream of each other: the map's circles, rings and routes recount from the cases that match the filters.
  function paintAtlas(filtered) {
    if (openTool !== 'map') return;
    var atlas = ex.querySelector('.worldmap'); if (!atlas) return;
    if (filtered !== undefined) atlas.dataset.filtered = String(filtered);
    var where = {}, made = {}, routes = {}, countries = {};
    matchedRows.forEach(function (r) {
      var cached = rowData.get(r), pks = cached.places, ok = cached.data.origin;
      if (ok) made[ok] = (made[ok] || 0) + 1;
      pks.forEach(function (pk) { where[pk] = (where[pk] || 0) + 1; if (ok) routes[ok + '|' + pk] = (routes[ok + '|' + pk] || 0) + 1; });
      cached.facets.country.forEach(function (country) { countries[country] = (countries[country] || 0) + 1; });
    });
    function updateCount(element, n) {
      var title = element.querySelector('title'); if (!title) return;
      if (!element.dataset.originalTitle) element.dataset.originalTitle = title.textContent;
      var text = element.dataset.originalTitle;
      if (atlas.dataset.filtered === 'true') {
        text = text.replace(/(?:\d+|no) (cases?|records?)\b/, function (_, noun) { return n + ' ' + noun.replace(/s$/, '') + (n === 1 ? '' : 's'); });
        text = text.replace(/(\b\d+ cases?)\.[\s\S]*$/, '$1.');
      }
      title.textContent = text;
      element.dataset.filteredCount = String(n);
    }
    function size(n) { return ((1.8 + 1.5 * Math.sqrt(n)) / Math.pow(atlasZoom, 0.75)).toFixed(2); }
    atlas.querySelectorAll('path[data-facet="country"]').forEach(function (land) { updateCount(land, countries[land.dataset.value] || 0); });
    atlas.querySelectorAll('[data-layer="where"] circle').forEach(function (c) { var n = where[c.dataset.place] || 0; c.style.display = n ? '' : 'none'; updateCount(c, n); if (n) c.setAttribute('r', size(n)); });
    atlas.querySelectorAll('[data-layer="made"] circle').forEach(function (c) { var n = made[c.dataset.place] || 0; c.style.display = n ? '' : 'none'; updateCount(c, n); if (n) c.setAttribute('r', size(n)); });
    atlas.querySelectorAll('.worldmap [data-route]').forEach(function (el) {
      var k = el.getAttribute('data-route-keys') || '', n = k ? (routes[k] || 0) : 0, vis = el.nextElementSibling && el.nextElementSibling.classList.contains('flow-vis') ? el.nextElementSibling : null;
      el.style.display = n ? '' : 'none'; if (vis) { vis.style.display = n ? '' : 'none'; if (n) vis.style.strokeWidth = (0.6 + 0.35 * Math.sqrt(n)).toFixed(2); }
      updateCount(el, n);
      if (n && el.classList.contains('ring')) el.setAttribute('r', size(n));
    });
    atlas.dispatchEvent(new Event('aibd:counts'));
  }
  var searchText = null, searchLoading = false, searchFailed = false;
  var searchStatus = ex.querySelector('[data-search-status]');
  function loadSearch() {
    if (searchText || searchLoading || searchFailed) return;
    searchLoading = true;
    fetch('search-fields.json').then(function (r) { if (!r.ok) throw new Error('Search request failed'); return r.json(); }).then(function (data) {
      searchText = search.prepare(data);
      searchLoading = false; apply();
    }).catch(function () { searchLoading = false; searchFailed = true; apply(); });
  }
  var searchRetry = ex.querySelector('[data-search-retry]');
  if (searchRetry) searchRetry.addEventListener('click', function () { searchFailed = false; apply(); if (q) q.focus({ preventScroll: true }); });
  function paintSearchMatch(row, matches) {
    var cached = rowData.get(row);
    var explanation = search.explain(matches);
    if (!explanation) { if (cached.matchLine) cached.matchLine.hidden = true; return; }
    if (!cached.matchLine) {
      cached.matchLine = document.createElement('p'); cached.matchLine.className = 'search-match';
      var target = row.querySelector('.case-result') || row.querySelector('h3').parentNode;
      target.appendChild(cached.matchLine);
    }
    cached.matchLine.hidden = false;
    var label = document.createElement('strong'); label.textContent = explanation.label + ': ';
    var passage = document.createTextNode(explanation.text + (explanation.also.length ? ' Also matches: ' + explanation.also.join(', ') + '.' : ''));
    cached.matchLine.replaceChildren(label, passage);
  }
  function escapeText(value) { return String(value == null ? '' : value).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var statusNames = { reported: 'Reported', intended: 'Intended', mixed: 'Reported and intended', unclear: 'Unclear' };
  var evidenceNames = { found: 'Found by a court or regulator', studied: 'Independently studied', reported: 'Independently reported', claimed: 'Claimed by the parties' };
  function groupName(group, value) {
    if (group === 'status') return statusNames[value] || value;
    if (group === 'evidence') return evidenceNames[value] || value;
    if (group === 'depth') return value === 'n/a' ? 'Depth not established' : 'Depth ' + value;
    return value;
  }
  function paintTable(visible) {
    var body = ex.querySelector('[data-case-table-body]'); if (!body) return;
    body.innerHTML = visible.map(function (row) {
      var d = rowData.get(row).data, heading = row.querySelector('h3 a'), date = row.querySelector('.meta time');
      var selected = window.aibdShelf && window.aibdShelf.has(d.id);
      return '<tr><th scope="row"><a href="records/' + escapeText(d.id) + '.html">' + escapeText(heading.textContent) + '</a><small>' + escapeText(statusNames[d.status] || 'Unclear') + '</small></th>' +
        '<td>' + escapeText(d.depth === 'n/a' ? 'Not established' : d.depth) + '</td><td>' + escapeText(d.sector) + '</td><td>' + (date ? '<time datetime="' + escapeText(d.date) + '">' + escapeText(date.parentNode.textContent.trim()) + '</time>' : 'Not established') + '</td><td>' + escapeText(evidenceNames[d.evidence] || d.evidence) + '</td><td>' + escapeText(d.sources) + '</td><td><button type="button" class="case-select" data-keep="' + escapeText(d.id) + '" data-keep-label="Compare" data-kept-label="Selected" aria-pressed="' + selected + '">' + (selected ? 'Selected' : 'Compare') + '</button></td></tr>';
    }).join('');
    if (window.aibdShelf) window.aibdShelf.paint();
  }
  function paintTrends() {
    var chart = ex.querySelector('[data-trend-chart]'); if (!chart) return;
    var trendRows = matchedRows.map(function (row) { return rowData.get(row).data; });
    var otherDates = trendRows.filter(function (d) { return d.date && d.dateBasis !== 'Observed'; }).length;
    if (trendEvents) trendRows = trendRows.filter(function (d) { return d.dateBasis === 'Observed'; });
    var summary = explorerCore.aggregate(trendRows, trendGroup);
    var scope = ex.querySelector('[data-trend-scope]');
    if (scope) scope.textContent = trendEvents
      ? (otherDates ? otherDates + (otherDates === 1 ? ' record is' : ' records are') + ' left out because ' + (otherDates === 1 ? 'its date comes' : 'their dates come') + ' from sources, such as a publication or collection date.' : '')
      : 'Years include dates taken from sources, such as publication and collection dates.';
    var palette = ['#16778c', '#397a4c', '#755392', '#bb4744', '#8f6c13', '#365c73', '#98644f', '#54585b'];
    var color = function (category) { return palette[summary.categories.indexOf(category) % palette.length]; };
    var peak = Math.max.apply(null, [1].concat(summary.years.map(function (year) { return year.total; })));
    var title = ex.querySelector('[data-trend-title]');
    if (title) title.textContent = (trendMode === 'share' ? 'Share of benefits' : 'Benefit records') + ' by year and ' + ({ status: 'benefit status', sector: 'sector', depth: 'depth', evidence: 'evidence', type: 'benefit type' }[trendGroup]);
    ex.querySelectorAll('[data-trend-mode]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.trendMode === trendMode)); });
    var html = '<ol class="trend-years" aria-label="Records by year">', dataHtml = '';
    summary.years.forEach(function (year) {
      html += '<li><span class="trend-year">' + year.year + '</span><div class="trend-bar-track"><div class="trend-bar" style="width:' + (trendMode === 'share' ? 100 : 100 * year.total / peak) + '%">';
      dataHtml += '<table class="trend-data-table"><caption>' + year.year + ' - ' + year.total + (year.total === 1 ? ' record' : ' records') + '</caption><thead><tr><th scope="col">Category</th><th scope="col">Records</th><th scope="col">Share<span class="visually-hidden"> of ' + year.year + '</span></th></tr></thead><tbody>';
      summary.categories.forEach(function (category) {
        var n = year.groups[category] || 0; if (!n) return;
        var share = 100 * n / year.total, label = groupName(trendGroup, category) + ', ' + n + (n === 1 ? ' record' : ' records') + ', ' + share.toFixed(1) + '% of ' + year.year;
        var address = new URLSearchParams();
        if (q && q.value.trim()) address.set('q', q.value.trim());
        KEYS.forEach(function (key) { var values = Object.keys(active[key]); if (values.length) address.set(key, values.join('|')); });
        if (role) address.set('role', role);
        if (sortState.key) address.set('sort', sortState.key + ':' + (sortState.dir === 1 ? 'desc' : 'asc'));
        address.set('from', dateFrom && dateFrom > year.year + '-01-01' ? dateFrom : year.year + '-01-01');
        address.set('to_date', dateTo && dateTo < year.year + '-12-31' ? dateTo : year.year + '-12-31');
        address.set(trendGroup, category);
        var href = 'cases.html?' + escapeText(address.toString()), linkLabel = escapeText(label + '. Open these records.');
        html += '<a href="' + href + '" style="width:' + share + '%;--trend-fill:' + color(category) + '" title="' + escapeText(label) + '" aria-label="' + linkLabel + '"><span>' + n + '</span></a>';
        dataHtml += '<tr><th scope="row"><a href="' + href + '" aria-label="' + linkLabel + '">' + escapeText(groupName(trendGroup, category)) + '</a></th><td>' + n + '</td><td>' + share.toFixed(1) + '%</td></tr>';
      });
      html += '</div></div><span class="trend-total">' + (trendMode === 'share' ? '100%' : year.total) + '</span></li>';
      dataHtml += '</tbody></table>';
    });
    chart.innerHTML = summary.years.length ? html + '</ol>' : '<p class="note">No dated records match these filters.</p>';
    var data = ex.querySelector('[data-trend-data]');
    if (data) { data.innerHTML = dataHtml; data.closest('details').hidden = !summary.years.length; }
    var key = ex.querySelector('[data-trend-key]');
    if (key) key.innerHTML = summary.categories.map(function (category) { return '<span><i style="background:' + color(category) + '"></i>' + escapeText(groupName(trendGroup, category)) + '</span>'; }).join('');
  }
  [fromInput, toInput].forEach(function (input) {
    if (input) input.addEventListener('change', function () { dateFrom = explorerCore.validDate(fromInput.value); dateTo = explorerCore.validDate(toInput.value); apply(true); });
  });
  ex.querySelectorAll('[data-facet-search]').forEach(function (input) {
    input.addEventListener('input', function () {
      var group = input.closest('[data-facet-group]'), term = search.normalize(input.value), found = 0;
      group.querySelectorAll('[data-facet]').forEach(function (option) { option.hidden = search.normalize(option.dataset.value).indexOf(term) === -1; if (!option.hidden) found++; });
      var empty = group.querySelector('[data-facet-empty]'); if (empty) empty.hidden = !!found;
    });
  });
  var trendSelect = ex.querySelector('[data-trend-group]');
  if (trendSelect) trendSelect.addEventListener('change', function () { trendGroup = trendSelect.value; apply(true); });
  ex.querySelectorAll('[data-trend-mode]').forEach(function (button) { button.addEventListener('click', function () { trendMode = button.dataset.trendMode; apply(true); }); });
  var trendEventsBox = ex.querySelector('[data-trend-events]');
  if (trendEventsBox) trendEventsBox.addEventListener('change', function () { trendEvents = trendEventsBox.checked; apply(true); });
  function feedback(message) { var box = ex.querySelector('[data-explorer-feedback]'); if (box) { box.textContent = message; box.hidden = !message; } }
  var shareButton = ex.querySelector('[data-share-results]');
  if (shareButton) shareButton.addEventListener('click', function () {
    apply();
    var address = window.location.href, fallback = ex.querySelector('[data-share-address]'), input = ex.querySelector('[data-share-input]');
    function showAddress() { if (fallback && input) { fallback.hidden = false; input.value = address; input.focus(); input.select(); } feedback('The link is ready to copy.'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(address).then(function () { feedback('Link copied.'); }).catch(showAddress);
    else showAddress();
  });
  function download(name, type, body) {
    var address = URL.createObjectURL(new Blob([body], { type: type })), link = document.createElement('a');
    link.href = address; link.download = name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(function () { URL.revokeObjectURL(address); }, 10000);
  }
  ex.querySelectorAll('[data-export-results]').forEach(function (button) { button.addEventListener('click', function () {
    var selection = matchedRows.slice(), ids = new Set(selection.map(function (row) { return row.dataset.id; })), query = window.location.href;
    if (openTool !== 'shelf' && searchLoading) { feedback('Search is still loading. Try the download when the results are ready.'); return; }
    if (!selection.length) { feedback('No records match these filters.'); return; }
    var filename = 'aibd-' + selection.length + '-records-' + new Date().toISOString().slice(0, 10);
    if (button.dataset.exportResults === 'csv') {
      var lines = selection.map(function (row) { var d = rowData.get(row).data; return [d.id, row.querySelector('h3 a').textContent.trim(), statusNames[d.status] || d.status, d.date, d.dateBasis, d.country.split('|').join('; '), d.sector, d.type, d.depth, evidenceNames[d.evidence] || d.evidence, d.sources, row.querySelector('.metric')?.textContent.trim() || '', new URL('records/' + d.id + '.html', window.location.href).href]; });
      download(filename + '.csv', 'text/csv;charset=utf-8', explorerCore.csv(['ID', 'Record', 'Benefit status', 'Date', 'Date basis', 'Countries', 'Sector', 'Benefit type', 'Depth', 'Evidence', 'Source count', 'Reported measure', 'Record link'], lines));
      feedback(selection.length + ' records downloaded as a CSV overview.'); return;
    }
    button.disabled = true; feedback('Preparing the selected records…');
    fetch('data/records.json').then(function (response) { if (!response.ok) throw new Error('Download unavailable'); return response.json(); }).then(function (data) {
      var records = Array.isArray(data) ? data : data.records;
      if (!Array.isArray(records)) throw new Error('Unexpected data format');
      var selected = records.filter(function (record) { return ids.has(record.id); });
      if (selected.length !== ids.size) throw new Error('The published data is updating');
      var order = new Map(selection.map(function (row, index) { return [row.dataset.id, index]; }));
      selected.sort(function (a, b) { return order.get(a.id) - order.get(b.id); });
      download(filename + '.json', 'application/json', JSON.stringify({ exported_at: new Date().toISOString(), view: query, records: selected }, null, 2) + '\n');
      feedback(selected.length + ' records downloaded.');
    }).catch(function () { feedback('The records could not be downloaded. Please try again.'); }).finally(function () { button.disabled = false; });
  }); });

  function paintCharts() {
    if (openTool !== 'timeline' && openTool !== 'matrix') return;
    var matchedIds = new Set(), counts = Object.create(null), totals = Object.create(null);
    var dated = 0, unassessed = 0, peak = 1;
    matchedRows.forEach(function (row) {
      var data = rowData.get(row).data;
      if (data.date) { matchedIds.add(data.id); dated += 1; if (data.depth === 'n/a') unassessed += 1; }
      if (!counts[data.type]) counts[data.type] = Object.create(null);
      var n = counts[data.type][data.depth] = (counts[data.type][data.depth] || 0) + 1;
      totals[data.depth] = (totals[data.depth] || 0) + 1;
      peak = Math.max(peak, n);
    });
    if (openTool === 'timeline') {
      paintTrends();
      var hiddenFocus = false;
      ex.querySelectorAll('.soundings [data-case-id]').forEach(function (mark) {
        var visible = matchedIds.has(mark.dataset.caseId);
        if (!visible && mark.contains(document.activeElement)) hiddenFocus = true;
        mark.toggleAttribute('hidden', !visible);
      });
      if (hiddenFocus && q) q.focus({ preventScroll: true });
      var datedCount = ex.querySelector('[data-timeline-count]');
      if (datedCount) datedCount.textContent = 'Dates are available for ' + dated + ' of ' + matchedRows.length + ' records.';
      var unassessedCount = ex.querySelector('[data-timeline-unassessed]');
      if (unassessedCount) { unassessedCount.textContent = 'depth unassessed, ' + unassessed + ' records'; unassessedCount.toggleAttribute('hidden', !unassessed); }
      return;
    }
    function matrixAddress(type, depth) {
      var address = new URLSearchParams();
      if (q && q.value.trim()) address.set('q', q.value.trim());
      if (dateFrom) address.set('from', dateFrom); if (dateTo) address.set('to_date', dateTo);
      KEYS.forEach(function (key) { var values = Object.keys(active[key]); if (values.length) address.set(key, values.join('|')); });
      address.set('type', type);
      if (depth !== undefined) address.set('depth', depth);
      if (role) address.set('role', role);
      return 'cases.html?' + address.toString();
    }
    ex.querySelectorAll('[data-matrix-type]').forEach(function (row) {
      var type = row.dataset.matrixType, values = counts[type] || {}, total = 0;
      row.querySelector('[data-matrix-type-link]').href = matrixAddress(type);
      row.querySelectorAll('[data-matrix-depth]').forEach(function (cell) {
        var depth = cell.dataset.matrixDepth, n = values[depth] || 0;
        total += n;
        cell.style.setProperty('--i', String(n / peak));
        var link = cell.querySelector('a'); link.textContent = String(n); link.hidden = !n;
        link.href = matrixAddress(type, depth);
      });
      row.querySelector('[data-matrix-row-total]').textContent = String(total);
    });
    ex.querySelectorAll('[data-matrix-total-depth]').forEach(function (cell) { cell.textContent = String(totals[cell.dataset.matrixTotalDepth] || 0); });
    var total = ex.querySelector('[data-matrix-total]'); if (total) total.textContent = String(matchedRows.length);
  }
  window.aibdApply = function () { apply(); };
  function apply(push) {
    var comparing = openTool === 'shelf';
    // A comparison is an explicit selection. Keep the list query in the address
    // so that returning to a browsing view restores it without dropping cases.
    var text = !comparing && q ? q.value.trim() : '';
    var terms = search.parse(text);
    var activeKeys = comparing ? [] : KEYS.filter(function (key) { return hasAny(active[key]); });
    var shelfIds = comparing ? new Set(window.aibdShelf ? window.aibdShelf.ids() : []) : null;
    var datedFilter = !comparing && !!(dateFrom || dateTo);
    var filtered = Boolean(text || shelfIds || activeKeys.length || datedFilter);
    var dateError = ex.querySelector('[data-date-error]');
    if (dateError) dateError.hidden = !(dateFrom && dateTo && dateFrom > dateTo);
    if (clear) clear.hidden = !text && !activeKeys.length && !datedFilter;
    var facetCounts = baseCounts;
    if (text && !searchText) loadSearch();
    resultList.setAttribute('aria-busy', String(Boolean(text && searchLoading)));
    if (searchStatus) {
      searchStatus.hidden = !text || !searchFailed;
      if (searchRetry) searchRetry.disabled = searchLoading;
    }
    if (filtered) {
      facetCounts = Object.create(null);
      KEYS.forEach(function (key) { facetCounts[key] = Object.create(null); });
    }
    matchedRows = [];
    rows.forEach(function (row) {
      var cached = rowData.get(row), data = cached.data;
      if (shelfIds && !shelfIds.has(data.id)) return;
      if (!comparing && !explorerCore.inDateRange(data.date, dateFrom, dateTo)) return;
      cached.matches = text ? search.match(searchText ? searchText[data.id] : cached.titleField, terms) : [];
      if (text && cached.matches === null) return;
      var failed = activeKeys.filter(function (key) {
        return !cached.facets[key].some(function (value) { return active[key][value]; });
      });
      if (!failed.length) matchedRows.push(row);
      if (filtered && failed.length <= 1) KEYS.forEach(function (key) {
        if (failed.length && failed[0] !== key) return;
        cached.facets[key].forEach(function (value) { facetCounts[key][value] = (facetCounts[key][value] || 0) + 1; });
      });
    });
    var shown = matchedRows.length;
    var visibleRows = showAll ? matchedRows : matchedRows.slice(0, PAGE);
    visibleRows.forEach(function (row) { paintSearchMatch(row, rowData.get(row).matches); });
    renderRows(visibleRows);
    resultList.hidden = openTool === 'table' || openTool === 'shelf';
    if (openTool === 'table') paintTable(visibleRows);
    if (more) { more.hidden = showAll || shown <= PAGE; more.textContent = 'Show all ' + shown; }
    var empty = ex.querySelector('[data-empty]'); if (empty) empty.hidden = shown > 0 || openTool === 'shelf' || Boolean(text && searchLoading);
    if (openTool === 'shelf' && window.aibdRenderCompare) window.aibdRenderCompare();
    paintCompareStatus();
    buttons.forEach(function (b) {
      var info = buttonData.get(b), k = info.key, v = info.value, n = facetCounts[k][v] || 0;
      if (info.panel && info.panel !== openTool && !(info.panel === 'lists' && filtersOpen)) return;
      var on = !!active[k][v];
      if (info.count === n && info.on === on) return;
      if (info.badge) info.badge.textContent = n;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('zero', n === 0 && !on);
      if (b.tagName === 'BUTTON') b.disabled = n === 0 && !on;
      info.count = n; info.on = on;
    });
    paintAtlas(filtered);
    paintCharts();
    if (openTool === 'map') {
      var places = Object.keys(active.country || {}).concat(Object.keys(active.made || {}));
      ex.querySelectorAll('.juris[data-country]').forEach(function (sec) { sec.hidden = places.length > 0 && places.indexOf(sec.getAttribute('data-country')) === -1; });
      ex.querySelectorAll('.gaz [data-route]').forEach(function (b) { var parts = b.getAttribute('data-route').split('|'); b.classList.toggle('on', !!(active.made && active.made[parts[0]] && active.country && active.country[parts[1]])); });
    }
    if (count) {
      count.textContent = comparing ? shown + ' selected records' : text && searchLoading ? 'Searching all fields…' : filtered ? shown + ' of ' + rows.length + ' records' : rows.length + ' records';
      var mirror = ex.querySelector('[data-count-mirror]'); if (mirror) mirror.textContent = shown + ' of ' + rows.length + ' records';
    }
    KEYS.forEach(function (k) { if (hasAny(active[k])) { var g = ex.querySelector('[data-facet-group="' + k + '"]'); if (g) { g.removeAttribute('data-collapsed'); if (g.tagName === 'DETAILS') g.open = true; var h = g.querySelector('[data-facet-head]'); if (h) h.setAttribute('aria-expanded', 'true'); } } });
    var activeBox = ex.querySelector('[data-active]');
    if (activeBox) {
      activeBox.innerHTML = '';
      var any = false;
      KEYS.forEach(function (k) {
        Object.keys(active[k]).forEach(function (v) {
          any = true;
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'active-chip';
          b.setAttribute('data-remove-facet', k); b.setAttribute('data-remove-value', v);
          var kk = document.createElement('span'); kk.className = 'k'; kk.textContent = LABELS[k] + ' ';
          var btn = ex.querySelector('[data-facet="' + k + '"][data-value="' + v.replace(/"/g, '\\"') + '"] .v');
          var vv = document.createElement('span'); vv.className = 'val'; vv.textContent = btn ? btn.textContent : v;
          var xx = document.createElement('span'); xx.className = 'x'; xx.textContent = ' ×';
          b.appendChild(kk); b.appendChild(vv); b.appendChild(xx);
          activeBox.appendChild(b);
        });
      });
      if (q && q.value.trim()) {
        any = true;
        var t = document.createElement('span'); t.className = 'active-text'; t.textContent = '“' + q.value.trim() + '”';
        activeBox.appendChild(t);
      }
      if (datedFilter) {
        any = true; var dates = document.createElement('button'); dates.type = 'button'; dates.className = 'active-chip'; dates.dataset.clearDates = ''; dates.textContent = (dateFrom || 'Any start') + ' to ' + (dateTo || 'any end') + ' ×'; activeBox.appendChild(dates);
      }
      activeBox.hidden = !any || comparing;
      var filterNumber = ex.querySelector('[data-filter-number]');
      if (filterNumber) { var selections = activeKeys.reduce(function (n, key) { return n + Object.keys(active[key]).length; }, 0) + (datedFilter ? 1 : 0); filterNumber.textContent = selections; filterNumber.hidden = !selections; }
    }
    var next = new URLSearchParams();
    if (q && q.value.trim()) next.set('q', q.value.trim());
    KEYS.forEach(function (k) { var vs = Object.keys(active[k]); if (vs.length) next.set(k, vs.join('|')); });
    if (openTool) next.set('open', openTool);
    if (filtersOpen) next.set('filters', '1');
    if (dateFrom) next.set('from', dateFrom); if (dateTo) next.set('to_date', dateTo);
    if (openTool === 'timeline') { next.set('group_by', trendGroup); next.set('measure', trendMode); if (!trendEvents) next.set('dates', 'all'); }
    if (openTool === 'shelf') { next.set('compare', (window.aibdShelf ? window.aibdShelf.ids() : []).join(',')); if (selectedComparisonFields) next.set('fields', selectedComparisonFields.join(',')); }
    if (openTool === 'submit') ['case', 'kind'].forEach(function (key) { if (params.has(key)) next.set(key, params.get(key)); });
    if (role) next.set('role', role);
    if (sortState.key) next.set('sort', sortState.key + ':' + (sortState.dir === 1 ? 'desc' : 'asc'));
    var qs = next.toString();
    var url = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
    if (push) history.pushState(null, '', url); else history.replaceState(history.state, '', url);
    if (returnPosition && !searchLoading) {
      var returnY = returnPosition.y; returnPosition = null;
      window.requestAnimationFrame(function () { window.scrollTo(0, returnY); });
    }
  }
  ex.addEventListener('click', function (e) {
    var b = e.target.closest('[data-facet]'); if (!b || !ex.contains(b)) return;
    var k = b.dataset.facet, v = b.dataset.value;
    if (active[k][v]) delete active[k][v]; else active[k][v] = true;
    apply(true);
  });
  function clearAll() { KEYS.forEach(function (k) { active[k] = {}; }); if (q) q.value = ''; dateFrom = ''; dateTo = ''; if (fromInput) fromInput.value = ''; if (toInput) toInput.value = ''; apply(true); }
  ex.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear-all], [data-filter-reset]')) { clearAll(); return; }
    if (e.target.closest('[data-clear-dates]')) { dateFrom = ''; dateTo = ''; fromInput.value = ''; toInput.value = ''; apply(true); return; }
    var o = e.target.closest('[data-open-tool]');
    if (o) {
      e.preventDefault();
      var requested = o.getAttribute('data-open-tool') || null;
      if (requested === 'lists') filtersOpen = !filtersOpen; else openTool = requested;
      applyTools(); apply(true);
      var target = o.getAttribute('data-scroll') ? ex.querySelector('[data-facet-group="' + o.getAttribute('data-scroll') + '"]') : null;
      if (target) target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    }
  });
  var queryTimer;
  if (q) q.addEventListener('input', function () { clearTimeout(queryTimer); queryTimer = setTimeout(function () { apply(); }, 100); });
  if (more) more.addEventListener('click', function () { showAll = true; apply(); });
  function jump() { window.scrollTo(0, ex.getBoundingClientRect().top + window.scrollY - 8); }
  var mast = document.querySelector('[data-search-input]');
  if (mast) {
    var mastForm = mast.closest('form');
    mastForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (q) { clearTimeout(queryTimer); if (q !== mast) q.value = mast.value; apply(); ex.scrollIntoView({ block: 'start' }); }
    }, true);
  }
  ex.addEventListener('click', function (e) {
    var head = e.target.closest('[data-facet-head]');
    if (head) { var g = head.closest('[data-facet-group]'); var open = g.hasAttribute('data-collapsed'); if (open) g.removeAttribute('data-collapsed'); else g.setAttribute('data-collapsed', ''); head.setAttribute('aria-expanded', String(open)); return; }
    var chip = e.target.closest('[data-remove-facet]');
    if (chip) { delete active[chip.getAttribute('data-remove-facet')][chip.getAttribute('data-remove-value')]; apply(); return; }
    var more = e.target.closest('[data-more]');
    if (more) {
      var group = more.closest('[data-facet-group]');
      var box = group.querySelector('.facet-more');
      box.hidden = !box.hidden;
      more.textContent = box.hidden ? 'More…' : 'Fewer';
    }
  });
  ex.querySelectorAll('[data-facet-group]').forEach(function (group) {
    var box = group.querySelector('.facet-more');
    if (box && box.querySelector('[data-facet]') && Object.keys(active[group.getAttribute('data-facet-group')]).some(function (v) { return !!box.querySelector('[data-facet][data-value="' + v.replace(/"/g, '\\"') + '"]'); })) {
      box.hidden = false;
      var t = group.querySelector('[data-more]'); if (t) t.textContent = 'Fewer';
    }
  });
  var clear = ex.querySelector('[data-clear]');
  if (clear) clear.addEventListener('click', clearAll);
  var comparisonFieldsKey = 'aibd-comparison-fields';
  var defaultComparisonFields = ['system', 'depth', 'confidence', 'comparison', 'later'];
  var fieldsDialog = document.getElementById('comparison-fields');
  var fieldsButton = ex.querySelector('[data-compare-fields-open]');
  var fieldCheckboxes = fieldsDialog ? Array.from(fieldsDialog.querySelectorAll('[data-compare-field]')) : [];
  var knownComparisonFields = fieldCheckboxes.map(function (checkbox) { return checkbox.value; });
  function readComparisonFields(address) {
    address = address || new URLSearchParams(window.location.search);
    if (address.has('fields')) { var linked = address.get('fields').split(',').filter(function (key) { return knownComparisonFields.indexOf(key) !== -1; }); if (linked.length) return Array.from(new Set(linked)); }
    try {
      var saved = JSON.parse(localStorage.getItem(comparisonFieldsKey));
      var selected = Array.isArray(saved) ? knownComparisonFields.filter(function (key) { return saved.indexOf(key) !== -1; }) : [];
      return selected.length ? selected : defaultComparisonFields.slice();
    } catch (error) { return defaultComparisonFields.slice(); }
  }
  var selectedComparisonFields = readComparisonFields();
  function paintComparisonFields() {
    fieldCheckboxes.forEach(function (checkbox) {
      checkbox.checked = selectedComparisonFields.indexOf(checkbox.value) !== -1;
      checkbox.disabled = checkbox.checked && selectedComparisonFields.length === 1;
    });
  }
  if (fieldsDialog && fieldsButton) {
    paintComparisonFields();
    fieldsButton.addEventListener('click', function () { fieldsDialog.showModal(); });
    fieldsDialog.querySelector('[data-compare-fields-close]').addEventListener('click', function () { fieldsDialog.close(); });
    fieldsDialog.addEventListener('cancel', function (event) { event.preventDefault(); fieldsDialog.close(); });
    fieldsDialog.addEventListener('close', function () {
      var target = fieldsButton.getClientRects().length ? fieldsButton : ex.querySelector('[data-compare-open]');
      if (target) target.focus({ preventScroll: true });
    });
    fieldsDialog.addEventListener('change', function (event) {
      if (!event.target.matches('[data-compare-field]')) return;
      var selected = fieldCheckboxes.filter(function (checkbox) { return checkbox.checked; }).map(function (checkbox) { return checkbox.value; });
      if (selected.length) selectedComparisonFields = selected;
      paintComparisonFields();
      try { localStorage.setItem(comparisonFieldsKey, JSON.stringify(selectedComparisonFields)); } catch (error) {}
      if (window.aibdRenderCompare) window.aibdRenderCompare();
      apply();
    });
    window.addEventListener('storage', function (event) {
      if (event.key !== comparisonFieldsKey && event.key !== null) return;
      selectedComparisonFields = readComparisonFields(); paintComparisonFields();
      if (openTool === 'shelf' && window.aibdRenderCompare) window.aibdRenderCompare();
    });
  }
  window.aibdRenderCompare = function () {
    var box = ex.querySelector('[data-compare]'); if (!box) return;
    var ids = window.aibdShelf ? window.aibdShelf.ids() : [];
    if (!ids.length) { box.innerHTML = ''; return; }
    if (!compareData) {
      loadCompare();
      return;
    }
    var GW = { personal: 'a person', organizational: 'an organization', societal: 'society' };
    var fields = [
      ['system', 'System', function (c) { return c.sys; }],
      ['depth', 'Depth', function (c) { return Object.keys(c.dep).map(function (g) { return (c.dep[g] === null ? 'not rated' : c.dep[g]) + ' for ' + GW[g]; }).join('; '); }],
      ['confidence', 'Confidence', function (c) { return c.conf; }],
      ['comparison', 'Comparison', function (c) { if (!c.cmp) return 'No source states a comparison.'; var s = c.cmp; if (c.before || c.after) s += ' (' + (c.before || '') + (c.before && c.after ? ' to ' : '') + (c.after || '') + ')'; return s + (c.basis ? ', ' + c.basis : ''); }],
      ['later', 'Since then', function (c) { return c.later || ''; }],
      ['status', 'Benefit status', function (c) { return c.status || 'Not assessed'; }],
      ['date', 'Date', function (c) { return c.d; }],
      ['sector', 'Sector', function (c) { return c.sec; }],
      ['country', 'Country', function (c) { return c.c; }],
      ['type', 'Benefit type', function (c) { return c.type; }],
      ['developer', 'Developer', function (c) { return c.dev; }],
      ['value', 'Value as stated', function (c) { return c.val || ''; }]
    ];
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); };
    var cases = ids.filter(function (id) { return compareData[id]; });
    var html = '<table class="compare"><caption class="visually-hidden">Comparison of selected records</caption><thead><tr><th class="f" scope="col">Field</th>' + cases.map(function (id) { return '<th scope="col"><a href="records/' + id + '.html">' + esc(compareData[id].h) + '</a><small>№ ' + esc(id.replace('AIBD-', '')) + '</small><button type="button" class="textbtn" data-keep="' + esc(id) + '" data-keep-label="Add" data-kept-label="Remove" aria-label="Remove record ' + esc(id.replace('AIBD-', '')) + ' from comparison" aria-pressed="true">Remove</button></th>'; }).join('') + '</tr></thead><tbody>';
    fields.filter(function (field) { return selectedComparisonFields.indexOf(field[0]) !== -1; }).forEach(function (f) { html += '<tr data-comparison-field="' + f[0] + '"><th class="f" scope="row">' + f[1] + '</th>' + cases.map(function (id) { return '<td>' + esc(f[2](compareData[id])) + '</td>'; }).join('') + '</tr>'; });
    box.innerHTML = html + '</tbody></table>';
  };
  apply();
  if (controls) controls.hidden = false;
  if (window.location.search.length > 1 && !(history.state && history.state.aibdExplorer)) window.requestAnimationFrame(jump);
})();

// Table: click a column head to sort; click again to reverse.
(function () {
  var table = document.querySelector('table.records');
  if (!table) return;
  var heads = Array.prototype.slice.call(table.querySelectorAll('th[data-sort]'));
  heads.forEach(function (th, idx) {
    th.setAttribute('role', 'button'); th.tabIndex = 0;
    var col = Array.prototype.indexOf.call(th.parentNode.children, th);
    function go() {
      var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
      heads.forEach(function (h) { h.removeAttribute('aria-sort'); });
      th.setAttribute('aria-sort', dir);
      var body = table.tBodies[0];
      var rows = Array.prototype.slice.call(body.rows);
      function key(row) { var c = row.cells[col]; var v = c.dataset.sort !== undefined ? c.dataset.sort : c.textContent.trim(); var n = parseFloat(v); return isNaN(n) || !/^-?[\d.]+$/.test(v) ? v.toLowerCase() : n; }
      rows.sort(function (a, b) { var x = key(a), y = key(b); if (typeof x === 'number' && typeof y === 'number') return x - y; return String(x).localeCompare(String(y)); });
      if (dir === 'descending') rows.reverse();
      rows.forEach(function (r) { body.appendChild(r); });
    }
    th.addEventListener('click', go);
    th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
})();
