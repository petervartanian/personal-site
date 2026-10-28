(function () {
  'use strict';
  var page = document.querySelector('.record-fields-page');
  var reader = document.querySelector('[data-record-reader]');
  if (!page || !reader) return;
  var buttons = Array.from(reader.querySelectorAll('[data-record-mode]'));
  var sections = Array.from(document.querySelectorAll('[data-record-section] h2, #sources'));
  var links = Array.from(reader.querySelectorAll('.record-sections a'));
  var mode = new URLSearchParams(location.search).get('view') === 'full' ? 'full' : 'overview';

  function setMode(next, updateAddress) {
    mode = next === 'full' ? 'full' : 'overview';
    page.dataset.reading = mode;
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.recordMode === mode));
    });
    if (updateAddress) {
      var address = new URL(location.href);
      if (mode === 'full') address.searchParams.set('view', 'full');
      else {
        address.searchParams.delete('view');
        var linked = destination(address.hash);
        // A hidden field would reopen the full view on the next visit. Keep
        // useful source and visible-section anchors when choosing Overview.
        if (linked && (linked.id === 'field-profile' || linked.closest('[data-record-extra]'))) address.hash = '';
      }
      history.replaceState(history.state, '', address.href);
    }
  }

  function destination(hash) {
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch (error) { return null; }
  }

  function reveal(hash, shouldScroll) {
    var target = destination(hash);
    if (!target) return;
    if (target.id === 'field-profile' || target.closest('[data-record-extra]')) setMode('full', false);
    if (shouldScroll) requestAnimationFrame(function () {
      target.scrollIntoView({ block: 'start' });
    });
  }

  setMode(mode, false);
  reader.hidden = false;
  reveal(location.hash, true);
  buttons.forEach(function (button) {
    button.addEventListener('click', function () { setMode(button.dataset.recordMode, true); });
  });
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    reveal(link.hash, false);
  });
  window.addEventListener('hashchange', function () { reveal(location.hash, true); });
  window.addEventListener('popstate', function () {
    setMode(new URLSearchParams(location.search).get('view'), false);
    reveal(location.hash, true);
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      var entry = entries.filter(function (item) { return item.isIntersecting; })[0];
      if (!entry) return;
      links.forEach(function (link) {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-12% 0px -60% 0px' });
    sections.forEach(function (section) { observer.observe(section); });
  }

  var dialog = document.getElementById('record-citation');
  var cite = document.querySelector('[data-citation-open]');
  if (!dialog || !cite || typeof dialog.showModal !== 'function') return;
  var status = dialog.querySelector('[data-citation-status]');
  cite.addEventListener('click', function (event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    status.textContent = '';
    dialog.showModal();
  });
  dialog.querySelector('[data-citation-close]').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () { cite.focus({ preventScroll: true }); });
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.querySelectorAll('[data-citation-copy]').forEach(function (button) {
    button.addEventListener('click', async function () {
      var field = document.getElementById(button.dataset.citationCopy);
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(field.value);
        status.textContent = 'Copied.';
      } catch (error) {
        field.focus();
        field.select();
        status.textContent = 'The text is selected. Copy it with your keyboard or the selection menu.';
      }
    });
  });
}());
