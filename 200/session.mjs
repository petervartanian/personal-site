// Older decrypted catalogs can remain open while the public release is installed.
for (const link of document.querySelectorAll('.experiment-list a[href="/x-oscope/"], .experiment-list a[href="/correlator/"], .experiment-list a[href="/200/correlator/"]')) {
  link.href = '/200/correlator/';
  link.style.setProperty('--accent', '#5f4b8b');
  link.querySelector('h2').textContent = 'AI Risk Correlator';
  link.querySelector('p').textContent = 'What do AI incidents tell us about existential risk?';
  const mark = link.querySelector('.experiment-mark');
  mark.textContent = 'AI';
  mark.classList.add('experiment-monogram');
}
for (const directory of ['agency-costs', 'backdrive', 'haruspex', 'monitor']) {
  for (const link of document.querySelectorAll(`.experiment-list a[href="/${directory}/"]`)) {
    link.href = `/200/${directory}/`;
  }
}

(() => {
  if (window.__public200Migration) return;

  const ROOT = '/200/';
  const currentURL = new URL(location.href);
  if (currentURL.searchParams.get('__public200') === '20261022') {
    currentURL.searchParams.delete('__public200');
    try { window.history.replaceState(window.history.state, '', currentURL.pathname + currentURL.search + currentURL.hash); } catch { /* History can be unavailable in embedded pages. */ }
  }
  const projectDirectories = new Set(['arcolens', 'agency-costs', 'backdrive', 'correlator', 'explorer', 'haruspex', 'monitor']);
  const gate = document.getElementById('unlock');
  for (const control of document.querySelectorAll('[data-lock]')) control.remove();
  gate?.remove();
  document.body?.classList.remove('locked');

  function continuation() {
    if (![ROOT, ROOT + 'index.html'].includes(location.pathname)) return null;
    try {
      const value = new URL(location.href).searchParams.get('next');
      if (!value) return null;
      const target = new URL(value, location.origin);
      if (target.origin !== location.origin || !target.pathname.startsWith(ROOT)) return null;
      const path = decodeURIComponent(target.pathname.slice(ROOT.length));
      if (path.includes('\\') || path.includes('\0') || path.split('/').some(part => part === '.' || part === '..')) return null;
      if (!projectDirectories.has(path.split('/')[0])) return null;
      // A worker redirect may leave the original fragment on the gate URL.
      return target.pathname + target.search + (target.hash || location.hash);
    } catch { return null; }
  }

  function bounded(promise, milliseconds = 4000) {
    return new Promise(resolve => {
      const timer = setTimeout(resolve, milliseconds);
      Promise.resolve(promise).then(value => { clearTimeout(timer); resolve(value); }, () => { clearTimeout(timer); resolve(); });
    });
  }

  function removeSavedKey() {
    return bounded(new Promise(resolve => {
      try {
        const request = indexedDB.deleteDatabase('pv-200-session');
        request.onsuccess = request.onerror = request.onblocked = () => resolve();
      } catch { resolve(); }
    }));
  }

  const next = continuation();
  let replacing = false;
  function continueToPublicPage() {
    if (replacing) return;
    replacing = true;
    location.replace(next || (gate ? ROOT + '?__public200=20261022' : currentURL.pathname + currentURL.search + currentURL.hash));
  }

  window.__public200Migration = (async () => {
    const serviceWorker = navigator.serviceWorker;
    const expectedScript = location.origin + ROOT + 'sw.js';
    const oldController = serviceWorker?.controller?.scriptURL === expectedScript;
    let registration;
    if (serviceWorker?.getRegistrations) {
      const registrations = await bounded(Promise.resolve().then(() => serviceWorker.getRegistrations()));
      registration = registrations?.find(item => item.scope === location.origin + ROOT);
    }
    if (registration) {
      let changed;
      const replacement = new Promise(resolve => { changed = resolve; });
      const onControllerChange = () => changed();
      const onMessage = event => { if (event.data?.type === '200-public-ready') changed(); };
      serviceWorker.addEventListener('controllerchange', onControllerChange);
      serviceWorker.addEventListener('message', onMessage);
      try {
        // Updating an existing registration allows its retirement worker to repair
        // other open tabs. Unregistering also recovers if that update is unavailable.
        await bounded(Promise.resolve().then(() => registration.update()));
        await bounded(replacement, 1200);
        await bounded(Promise.resolve().then(() => registration.unregister()));
      } finally {
        serviceWorker.removeEventListener('controllerchange', onControllerChange);
        serviceWorker.removeEventListener('message', onMessage);
      }
    }
    await removeSavedKey();
    if (registration || oldController || gate || next) continueToPublicPage();
  })();
})();
