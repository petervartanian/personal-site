'use strict';
(() => {
  // Retire the old complete/partial-year switch, including bookmarked "off" URLs.
  function clean(url) {
    for (const key of [...url.searchParams.keys()]) {
      if (/^year\d{4}$/.test(key)) url.searchParams.delete(key);
    }
    return url;
  }
  const current = clean(new URL(location.href));
  try { history.replaceState(null, '', current); } catch (_) { /* Local files can restrict history. */ }
  const directory = new URL('.', current).pathname;
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.hasAttribute('download')) return;
    const target = new URL(link.href, current);
    if (target.origin === current.origin && target.pathname.startsWith(directory)
        && target.pathname.endsWith('.html') && !target.pathname.includes('/history/')
        && !target.pathname.includes('/downloads/')) link.href = clean(target).href;
  });
})();
