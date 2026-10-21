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
    (root || document).querySelectorAll('.soundings .mark').forEach(function (mark) {
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
  function ids() { try { var v = JSON.parse(window.localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function save(list) { try { window.localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  var lastCleared = [];
  var shelf = window.aibdShelf = {
    ids: ids,
    has: function (id) { return ids().indexOf(id) !== -1; },
    toggle: function (id) { var list = ids(), i = list.indexOf(id); if (i === -1) list.push(id); else list.splice(i, 1); save(list); return i === -1; },
    clear: function () { save([]); }
  };
  function paint() {
    var n = ids().length;
    document.querySelectorAll('[data-shelf-link]').forEach(function (a) { a.textContent = n ? 'Compare (' + n + ')' : 'Compare'; });
    document.querySelectorAll('[data-keep]').forEach(function (b) { var on = shelf.has(b.getAttribute('data-keep')); b.textContent = on ? 'Kept' : 'Keep this case'; b.setAttribute('aria-pressed', String(on)); });
    document.querySelectorAll('[data-shelf-count]').forEach(function (s) { s.textContent = String(n); });
    document.querySelectorAll('[data-shelf-words]').forEach(function (s) { s.textContent = n ? n + (n === 1 ? ' case kept' : ' cases kept') : 'Nothing kept yet'; });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-keep]');
    if (b) { shelf.toggle(b.getAttribute('data-keep')); paint(); return; }
    if (e.target.closest('[data-shelf-clear]')) { lastCleared = ids(); shelf.clear(); paint(); document.querySelectorAll('[data-shelf-undo]').forEach(function (u) { u.hidden = !lastCleared.length; }); if (window.aibdApply) window.aibdApply(); return; }
    if (e.target.closest('[data-shelf-restore]')) { save(lastCleared); lastCleared = []; paint(); document.querySelectorAll('[data-shelf-undo]').forEach(function (u) { u.hidden = true; }); if (window.aibdApply) window.aibdApply(); }
  });
  shelf.paint = paint;
  paint();
})();

// Tools: the tray in the top-right corner of the masthead. It opens from its
// handle and shuts on a tool, a click elsewhere or Escape.
(function () {
  var kit = document.querySelector('[data-kit]');
  if (!kit) return;
  var handle = kit.querySelector('[data-kit-handle]');
  function setKit(open) {
    var was = !kit.hasAttribute('data-retracted');
    if (open) kit.removeAttribute('data-retracted'); else kit.setAttribute('data-retracted', '');
    if (handle) { handle.setAttribute('aria-expanded', String(open)); if (was && !open && kit.contains(document.activeElement)) handle.focus(); }
  }
  if (handle) handle.addEventListener('click', function () { setKit(kit.hasAttribute('data-retracted')); });
  document.addEventListener('click', function (e) { if (!kit.contains(e.target)) setKit(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setKit(false); });
  window.aibdKit = { shut: function () { setKit(false); } };
})();

// Faceted explorer on the front page: every facet recounts against the other active filters.
(function () {
  var ex = document.querySelector('[data-explorer]');
  if (!ex) return;
  var KEYS = ['type', 'group', 'depth', 'sector', 'country', 'unexpected', 'evidence', 'claim', 'developer', 'harm'];
  var compareData = null, compareLoading = false;
  var PANELS = ['map', 'lists', 'timeline', 'matrix', 'table', 'shelf', 'roles', 'method', 'data'];
  var kit = document.querySelector('[data-kit]');
  // One tool at a time: the open one, or none.
  var openTool = (new URLSearchParams(window.location.search).get('open') || '').split(',').filter(function (k) { return PANELS.indexOf(k) !== -1; })[0] || null;
  function loadFragment(panel) {
    var slot = panel.querySelector('[data-fragment]'); if (!slot || slot.dataset.loaded || slot.dataset.loading) return;
    slot.dataset.loading = '1'; slot.setAttribute('aria-busy', 'true'); slot.textContent = 'Loading…';
    fetch(slot.getAttribute('data-fragment')).then(function (r) { return r.text(); }).then(function (html) {
      slot.innerHTML = html; slot.dataset.loaded = '1'; slot.removeAttribute('aria-busy'); delete slot.dataset.loading;
      collectButtons(); bindAtlas(); if (window.aibdBindTips) window.aibdBindTips(slot); apply();
    }).catch(function () { slot.textContent = 'This chart could not be loaded.'; slot.removeAttribute('aria-busy'); delete slot.dataset.loading; });
  }
  function applyTools() {
    PANELS.forEach(function (k) {
      var on = k === openTool;
      var panel = ex.querySelector('[data-tool-panel="' + k + '"]'); if (panel) { panel.hidden = !on; if (on) loadFragment(panel); }
      if (k === 'table' || k === 'shelf') { if (on || (openTool !== 'table' && openTool !== 'shelf')) { ex.classList.toggle('tabular', on); var th = ex.querySelector('[data-table-head]'); if (th) th.hidden = !on; } }
      var b = kit ? kit.querySelector('[data-kit-tool="' + k + '"]') : null;
      if (b) { b.classList.toggle('on', on); if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(on)); else if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); }
    });
    var label = kit ? kit.querySelector('[data-kit-on]') : null;
    if (label) { var name = openTool ? kit.querySelector('[data-kit-tool="' + openTool + '"] .tn') : null; label.textContent = name ? name.textContent : ''; }
  }
  ex.addEventListener('click', function (e) {
    var c = e.target.closest('[data-tool-close]');
    if (c) { e.preventDefault(); openTool = null; applyTools(); apply(true); var top = ex.querySelector('.lede') || ex; top.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); return; }
    var s = e.target.closest('[data-show-cases]');
    if (s) { e.preventDefault(); var head = document.getElementById('cases'); if (head) head.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); }
  });
  window.addEventListener('popstate', function () {
    var p = new URLSearchParams(window.location.search);
    openTool = (p.get('open') || '').split(',').filter(function (k) { return PANELS.indexOf(k) !== -1; })[0] || null;
    if (typeof readFilters === 'function') readFilters(p);
    if (typeof setRole === 'function') setRole(p.get('role') || '');
    applyTools(); apply();
  });
  if (kit) {
    kit.addEventListener('click', function (e) {
      var b = e.target.closest('[data-kit-tool]'); if (!b) return;
      e.preventDefault();
      var k = b.getAttribute('data-kit-tool');
      openTool = openTool === k ? null : k;
      applyTools(); apply(true);
      if (window.aibdKit) window.aibdKit.shut();
      var panel = ex.querySelector('[data-tool-panel="' + k + '"]');
      if (panel && !panel.hidden) { panel.setAttribute('tabindex', '-1'); panel.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); panel.focus({ preventScroll: true }); }
      else if (kit) { var hd = kit.querySelector('[data-kit-handle]'); if (hd) hd.focus(); }
    });
  }
  applyTools();
  var sortState = { key: null, dir: 1 };
  var CONF = { found: 0, studied: 1, reported: 2, claimed: 3 };
  function sortBy(key, dir) {
    sortState.key = key; sortState.dir = dir;
    var list = ex.querySelector('ol.results');
    var val = function (r) {
      var d = r.dataset;
      if (key === 'depth') return d.depth === 'n/a' ? -1 : parseInt(d.depth, 10);
      if (key === 'year') return parseInt(d.year, 10);
      if (key === 'sources') return parseInt(d.sources, 10);
      if (key === 'evidence') return -(CONF[d.evidence] || 0);
      return d[key] || '';
    };
    var sorted = rows.slice().sort(function (p, q) { var x = val(p), y = val(q); return (x < y ? -1 : x > y ? 1 : 0) * -dir; });
    if (key === 'headline' || key === 'sector') sorted.reverse();
    sorted.forEach(function (r) { list.appendChild(r); });
    rows = sorted;
    ex.querySelectorAll('[data-sort-key]').forEach(function (x) { var on = x.getAttribute('data-sort-key') === key; x.classList.toggle('on', on); if (on) x.setAttribute('aria-sort', dir === 1 ? 'descending' : 'ascending'); else x.removeAttribute('aria-sort'); });
  }
  ex.querySelectorAll('[data-sort-key]').forEach(function (h) {
    h.addEventListener('click', function () {
      var key = h.getAttribute('data-sort-key');
      sortBy(key, sortState.key === key ? -sortState.dir : 1);
      apply(true);
    });
  });
  function bindAtlas() {
    var atlas = ex.querySelector('.worldmap');
    if (!atlas || atlas.dataset.bound) return;
    atlas.dataset.bound = '1';
    var readout = ex.querySelector('[data-atlas-readout]');
    ex.querySelectorAll('[data-plate]').forEach(function (b) {
      b.addEventListener('click', function () {
        atlas.setAttribute('viewBox', b.getAttribute('data-plate'));
        ex.querySelectorAll('[data-plate]').forEach(function (x) { x.classList.toggle('on', x === b); });
      });
    });
    atlas.addEventListener('mousemove', function (e) {
      var land = e.target.closest('.land'); if (!readout) return;
      if (!land) { readout.textContent = ''; return; }
      var t = land.querySelector('title'); readout.textContent = t ? t.textContent : '';
    });
    atlas.addEventListener('keydown', function (e) {
      var land = e.target.closest('.land'); if (!land) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); land.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }
    });
    atlas.addEventListener('focusin', function (e) { var land = e.target.closest('.land'); if (land && readout) { var t = land.querySelector('title'); readout.textContent = t ? t.textContent : ''; } });
    atlas.addEventListener('mouseleave', function () { if (readout) readout.textContent = ''; });
  }
  bindAtlas();
  var LABELS = { type: 'type', group: 'beneficiary', harm: 'harm on record', depth: 'depth', sector: 'sector', country: 'country', year: 'year', unexpected: 'unexpected', evidence: 'confidence', claim: 'claim', developer: 'developer' };
  var PAGE = 40, showAll = false;
  var more = ex.querySelector('[data-more-rows]');
  var rows = Array.prototype.slice.call(ex.querySelectorAll('[data-row]'));
  var buttons = [];
  function collectButtons() { buttons = Array.prototype.slice.call(ex.querySelectorAll('[data-facet]')); }
  collectButtons();
  var q = ex.querySelector('[data-q]') || document.querySelector('[data-search-input]');
  var count = ex.querySelector('[data-count]');
  var params = new URLSearchParams(window.location.search);
  var active = {};
  function readFilters(p) {
    KEYS.forEach(function (k) { var v = p.get(k); active[k] = {}; if (v) v.split('|').forEach(function (x) { active[k][x] = true; }); });
    if (q) q.value = p.get('q') || '';
  }
  var role = params.get('role') || '';
  var ROLE_SORT = { buyer: ['evidence', 1], regulator: ['evidence', 1], insurer: ['depth', 1], reporter: ['year', 1] };
  function roleLine(c) {
    if (role === 'buyer') {
      var s = c.sys + (c.dev && c.dev !== 'Unstated' ? ', by ' + c.dev : '') + '. ';
      s += c.cmp ? 'Measured against ' + c.cmp + (c.before && c.after ? ': ' + c.before + ' to ' + c.after : '') + '.' : 'No comparison stated.';
      if (c.lstatus && c.lstatus !== 'unknown') s += ' Since then: ' + c.lstatus + (c.ldate ? ', ' + c.ldate : '') + '.';
      return s;
    }
    if (role === 'regulator') return c.claim + '.' + (c.dep_name ? ' Deployed by ' + c.dep_name + '.' : '') + (c.lstatus === 'litigated' ? ' Litigated' + (c.ldate ? ' on ' + c.ldate : '') + '.' : '') + (c.harm ? ' A harm of the same kind is on record.' : '');
    if (role === 'insurer') return (c.val ? c.val + '.' : 'No value stated by a source.') + (c.lstatus && c.lstatus !== 'unknown' ? ' Since then: ' + c.lstatus + '.' : '') + ' ' + c.cat + '.';
    if (role === 'reporter') return c.sum + ' ' + c.cb;
    return '';
  }
  function paintRole() {
    rows.forEach(function (r) {
      var box = r.querySelector('.extra');
      if (!role) { if (box) box.remove(); return; }
      if (!compareData) return;
      var c = compareData[r.dataset.id]; if (!c) return;
      if (!box) { box = document.createElement('div'); box.className = 'extra'; r.querySelector('div:nth-child(2)').appendChild(box); }
      box.textContent = roleLine(c);
    });
  }
  function setRole(r) {
    role = r || '';
    if (role) ex.setAttribute('data-role', role); else ex.removeAttribute('data-role');
    if (role && !compareData && !compareLoading) { compareLoading = true; fetch('compare.json').then(function (x) { return x.json(); }).then(function (d) { compareData = d; compareLoading = false; paintRole(); }).catch(function () { compareLoading = false; }); }
    paintRole();
    ex.querySelectorAll('[data-role]').forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-role') || '') === role)); });
    if (role && ROLE_SORT[role]) sortBy(ROLE_SORT[role][0], ROLE_SORT[role][1]);
  }
  ex.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-role]'); if (!b) return;
    setRole(b.getAttribute('data-role')); apply(true);
    var head = document.getElementById('cases'); if (head && role) head.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  });
  readFilters(params);
  if (role) setRole(role);
  (function () { var s = (params.get('sort') || '').split(':'); if (s[0] && ex.querySelector('[data-sort-key="' + s[0] + '"]')) sortBy(s[0], s[1] === 'asc' ? -1 : 1); })();
  function hasAny(obj) { for (var k in obj) if (obj.hasOwnProperty(k)) return true; return false; }
  var searchText = null, searchLoading = false;
  function loadSearch() {
    if (searchText || searchLoading) return;
    searchLoading = true;
    fetch('search.json').then(function (r) { return r.json(); }).then(function (data) {
      searchText = {}; for (var id in data) if (data.hasOwnProperty(id)) searchText[id] = String(data[id]).toLowerCase();
      searchLoading = false; apply();
    }).catch(function () { searchLoading = false; });
  }
  function matches(row, ignore) {
    var d = row.dataset;
    if (openTool === 'shelf' && !(window.aibdShelf && window.aibdShelf.has(d.id))) return false;
    var text = q ? q.value.trim().toLowerCase() : '';
    if (text) {
      if (!searchText) { loadSearch(); if ((d.headline || '').indexOf(text) === -1) return false; }
      else if ((searchText[d.id] || '').indexOf(text) === -1) return false;
    }
    for (var i = 0; i < KEYS.length; i++) {
      var k = KEYS[i];
      if (k === ignore || !hasAny(active[k])) continue;
      var vals = (d[k] || '').split('|'), ok = false;
      for (var j = 0; j < vals.length; j++) if (active[k][vals[j]]) { ok = true; break; }
      if (!ok) return false;
    }
    return true;
  }
  window.aibdApply = function () { apply(); };
  function apply(push) {
    var shown = 0;
    rows.forEach(function (r) { var ok = matches(r, null); if (ok) { r.hidden = !showAll && shown >= PAGE; shown++; } else { r.hidden = true; } });
    if (more) { more.hidden = showAll || shown <= PAGE; more.textContent = 'Show all ' + shown; }
    var empty = ex.querySelector('[data-empty]'); if (empty) empty.hidden = shown > 0 || openTool === 'shelf';
    if (openTool === 'shelf' && window.aibdRenderCompare) window.aibdRenderCompare();
    buttons.forEach(function (b) {
      var k = b.dataset.facet, v = b.dataset.value, n = 0;
      rows.forEach(function (r) { if ((r.dataset[k] || '').split('|').indexOf(v) !== -1 && matches(r, k)) n++; });
      var badge = b.querySelector('[data-n]'); if (badge) badge.textContent = n;
      var on = !!active[k][v];
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('zero', n === 0 && !on);
      if (b.tagName === 'BUTTON') b.disabled = n === 0 && !on;
    });
    if (count) {
      var filtered = (q && q.value.trim()) || openTool === 'shelf' || KEYS.some(function (k) { return hasAny(active[k]); });
      count.textContent = filtered ? shown + ' of ' + rows.length + ' cases' : rows.length + ' cases';
      var mirror = ex.querySelector('[data-count-mirror]'); if (mirror) mirror.textContent = shown + ' of ' + rows.length + ' cases';
    }
    KEYS.forEach(function (k) { if (hasAny(active[k])) { var g = ex.querySelector('[data-facet-group="' + k + '"]'); if (g) { g.removeAttribute('data-collapsed'); var h = g.querySelector('[data-facet-head]'); if (h) h.setAttribute('aria-expanded', 'true'); } } });
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
      activeBox.hidden = !any;
    }
    var next = new URLSearchParams();
    if (q && q.value.trim()) next.set('q', q.value.trim());
    KEYS.forEach(function (k) { var vs = Object.keys(active[k]); if (vs.length) next.set(k, vs.join('|')); });
    if (openTool) next.set('open', openTool);
    if (role) next.set('role', role);
    if (sortState.key) next.set('sort', sortState.key + ':' + (sortState.dir === 1 ? 'desc' : 'asc'));
    var qs = next.toString();
    var url = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
    if (push) history.pushState(null, '', url); else history.replaceState(null, '', url);
  }
  ex.addEventListener('click', function (e) {
    var b = e.target.closest('[data-facet]'); if (!b || !ex.contains(b)) return;
    var k = b.dataset.facet, v = b.dataset.value;
    if (active[k][v]) delete active[k][v]; else active[k][v] = true;
    apply(true);
  });
  function clearAll() { KEYS.forEach(function (k) { active[k] = {}; }); if (q) q.value = ''; apply(true); }
  ex.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear-all]')) { clearAll(); return; }
    var o = e.target.closest('[data-open-tool]');
    if (o) {
      e.preventDefault(); openTool = o.getAttribute('data-open-tool'); applyTools(); apply(true);
      var target = o.getAttribute('data-scroll') ? ex.querySelector('[data-facet-group="' + o.getAttribute('data-scroll') + '"]') : null;
      if (target) target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    }
  });
  if (q) q.addEventListener('input', apply);
  if (more) more.addEventListener('click', function () { showAll = true; apply(); });
  function jump() { window.scrollTo(0, ex.getBoundingClientRect().top + window.scrollY - 8); }
  if (window.location.search.length > 1) {
    jump();
    window.addEventListener('load', function () { setTimeout(jump, 60); });
  }
  var mast = document.querySelector('[data-search-input]');
  if (mast) {
    var mastForm = mast.closest('form');
    mastForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (q) { if (q !== mast) q.value = mast.value; apply(); ex.scrollIntoView({ block: 'start' }); }
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
  window.aibdRenderCompare = function () {
    var box = ex.querySelector('[data-compare]'); if (!box) return;
    var ids = window.aibdShelf ? window.aibdShelf.ids() : [];
    if (!ids.length) { box.innerHTML = ''; return; }
    if (!compareData) {
      if (!compareLoading) { compareLoading = true; fetch('compare.json').then(function (r) { return r.json(); }).then(function (d) { compareData = d; compareLoading = false; window.aibdRenderCompare(); }).catch(function () { compareLoading = false; }); }
      return;
    }
    var GW = { personal: 'a person', organizational: 'an organization', societal: 'society' };
    var fields = [
      ['Depth', function (c) { return Object.keys(c.dep).map(function (g) { return (c.dep[g] === null ? 'not rated' : c.dep[g]) + ' for ' + GW[g]; }).join('; '); }],
      ['Confidence', function (c) { return c.conf; }],
      ['Claim', function (c) { return c.claim; }],
      ['Observed', function (c) { return c.d; }],
      ['Sector', function (c) { return c.sec; }],
      ['Country', function (c) { return c.c; }],
      ['Benefit type', function (c) { return c.type; }],
      ['System', function (c) { return c.sys; }],
      ['Developer', function (c) { return c.dev; }],
      ['Measured against', function (c) { if (!c.cmp) return 'No source states a comparison.'; var s = c.cmp; if (c.before || c.after) s += ' (' + (c.before || '') + (c.before && c.after ? ' to ' : '') + (c.after || '') + ')'; return s + (c.basis ? ', ' + (c.basis === 'measured' ? 'measured' : 'asserted') : ''); }],
      ['Since then', function (c) { return c.later || ''; }],
      ['Value as stated', function (c) { return c.val || ''; }]
    ];
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); };
    var cases = ids.filter(function (id) { return compareData[id]; });
    var html = '<table class="compare"><thead><tr><th class="f"></th>' + cases.map(function (id) { return '<th><a href="records/' + id + '.html">' + esc(compareData[id].h) + '</a><small>' + id + '</small></th>'; }).join('') + '</tr></thead><tbody>';
    fields.forEach(function (f) { html += '<tr><th class="f" scope="row">' + f[0] + '</th>' + cases.map(function (id) { return '<td>' + esc(f[1](compareData[id])) + '</td>'; }).join('') + '</tr>'; });
    box.innerHTML = html + '</tbody></table>';
  };
  apply();
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
