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
  if (tip) {
    document.querySelectorAll('.soundings .mark').forEach(function (mark) {
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
  var input = document.querySelector('[data-search-input]');
  if (input) {
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.focus(); input.select(); }
      if (e.key === '/' && document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) === -1) { e.preventDefault(); input.focus(); }
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


// Faceted explorer on the front page: every facet recounts against the other active filters.
(function () {
  var ex = document.querySelector('[data-explorer]');
  if (!ex) return;
  var KEYS = ['type', 'group', 'depth', 'sector', 'country', 'unexpected', 'evidence', 'developer', 'harm'];
  var TOOLS = ['sector', 'type', 'group', 'depth', 'evidence', 'harm', 'country'];
  var kit = ex.querySelector('[data-kit]');
  function toolSet() {
    var p = new URLSearchParams(window.location.search).get('tools');
    var saved = null; try { saved = window.localStorage.getItem('aibd-tools'); } catch (e) {}
    var list = (p || saved || TOOLS.join(',')).split(',').filter(function (k) { return TOOLS.indexOf(k) !== -1; });
    return list.length ? list : TOOLS.slice();
  }
  var activeTools = toolSet();
  function applyTools() {
    TOOLS.forEach(function (k) {
      var on = activeTools.indexOf(k) !== -1;
      var g = ex.querySelector('[data-facet-group="' + k + '"]'); if (g) g.hidden = !on;
      var b = kit ? kit.querySelector('[data-tool="' + k + '"]') : null; if (b) { b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); }
    });
    try { window.localStorage.setItem('aibd-tools', activeTools.join(',')); } catch (e) {}
  }
  if (kit) kit.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tool]'); if (!b) return;
    var k = b.getAttribute('data-tool'); var i = activeTools.indexOf(k);
    if (i === -1) activeTools.push(k); else if (activeTools.length > 1) activeTools.splice(i, 1);
    applyTools(); apply();
  });
  applyTools();
  var LABELS = { type: 'type', group: 'beneficiary', harm: 'harm on record', depth: 'depth', sector: 'sector', country: 'country', year: 'year', unexpected: 'unexpected', evidence: 'confidence', developer: 'developer' };
  var PAGE = 40, showAll = false;
  var more = ex.querySelector('[data-more-rows]');
  var rows = Array.prototype.slice.call(ex.querySelectorAll('[data-row]'));
  var buttons = Array.prototype.slice.call(ex.querySelectorAll('[data-facet]'));
  var q = ex.querySelector('[data-q]') || document.querySelector('[data-search-input]');
  var count = ex.querySelector('[data-count]');
  var params = new URLSearchParams(window.location.search);
  var active = {};
  KEYS.forEach(function (k) { var v = params.get(k); active[k] = {}; if (v) v.split('|').forEach(function (x) { active[k][x] = true; }); });
  if (q && params.get('q')) q.value = params.get('q');
  function hasAny(obj) { for (var k in obj) if (obj.hasOwnProperty(k)) return true; return false; }
  function matches(row, ignore) {
    var d = row.dataset;
    var text = q ? q.value.trim().toLowerCase() : '';
    if (text && d.text.indexOf(text) === -1) return false;
    for (var i = 0; i < KEYS.length; i++) {
      var k = KEYS[i];
      if (k === ignore || !hasAny(active[k])) continue;
      var vals = (d[k] || '').split('|'), ok = false;
      for (var j = 0; j < vals.length; j++) if (active[k][vals[j]]) { ok = true; break; }
      if (!ok) return false;
    }
    return true;
  }
  function apply() {
    var shown = 0;
    rows.forEach(function (r) { var ok = matches(r, null); if (ok) { r.hidden = !showAll && shown >= PAGE; shown++; } else { r.hidden = true; } });
    if (more) { more.hidden = showAll || shown <= PAGE; more.textContent = 'Show all ' + shown; }
    buttons.forEach(function (b) {
      var k = b.dataset.facet, v = b.dataset.value, n = 0;
      rows.forEach(function (r) { if ((r.dataset[k] || '').split('|').indexOf(v) !== -1 && matches(r, k)) n++; });
      b.querySelector('[data-n]').textContent = n;
      var on = !!active[k][v];
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('zero', n === 0 && !on);
    });
    if (count) count.textContent = shown + ' of ' + rows.length + ' records';
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
    if (activeTools.length !== TOOLS.length) next.set('tools', activeTools.join(','));
    var qs = next.toString();
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.facet, v = b.dataset.value;
      if (active[k][v]) delete active[k][v]; else active[k][v] = true;
      apply();
    });
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
  if (clear) clear.addEventListener('click', function () { KEYS.forEach(function (k) { active[k] = {}; }); if (q) q.value = ''; apply(); });
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
