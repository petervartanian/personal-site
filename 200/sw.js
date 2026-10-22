// Retire the former password worker without intercepting public files.
const ROOT = '/200/';
const DB_NAME = 'pv-200-session';

function isToolClient(value) {
  try {
    const url = new URL(value);
    return url.origin === self.location.origin && url.pathname.startsWith(ROOT);
  } catch { return false; }
}

function removeSavedKey() {
  return new Promise(resolve => {
    try {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = request.onerror = request.onblocked = () => resolve();
    } catch { resolve(); }
  });
}

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    await self.registration.unregister();
    await removeSavedKey();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(clients.filter(client => isToolClient(client.url)).map(async client => {
      const url = new URL(client.url);
      // A previously loaded gate has no listener for the new migration message.
      try {
        if (url.pathname === ROOT || url.pathname === ROOT + 'index.html') {
          url.searchParams.set('__public200', '20261022');
          await client.navigate(url.href);
        } else {
          client.postMessage({ type: '200-public-ready' });
        }
      } catch { /* A tab may close during activation. */ }
    }));
  })());
});

self.addEventListener('message', event => {
  if (!isToolClient(event.source?.url)) return;
  if (['status', 'unlock', 'lock', 'public-status'].includes(event.data?.action)) {
    // Old pages may retain their session timers until the next navigation.
    event.ports[0]?.postMessage({ ok: true, unlocked: true, public: true });
  }
});
