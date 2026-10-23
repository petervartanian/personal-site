import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const origin = 'https://petervartanian.xyz';
const workerSource = await readFile(new URL('../200/sw.js', import.meta.url), 'utf8');
const sessionSource = await readFile(new URL('../200/session.mjs', import.meta.url), 'utf8');
const entrySource = await readFile(new URL('../200/entry.mjs', import.meta.url), 'utf8');
const deepLinkSource = await readFile(new URL('../200/deep-link.js', import.meta.url), 'utf8');

function database(log, outcome = 'success') {
  return {
    deleteDatabase(name) {
      log.push(name);
      if (outcome === 'throw') throw new Error('Unavailable storage');
      const request = {};
      queueMicrotask(() => request['on' + outcome]?.());
      return request;
    },
  };
}

function retirementWorker({ storage = 'success', closeGate = false } = {}) {
  const events = {};
  const actions = [];
  const deleted = [];
  const navigated = [];
  const messages = [];
  const urls = [
    origin + '/200/?next=%2F200%2Fcorrelator%2F%23%2Fpathway',
    origin + '/200/index.html',
    origin + '/200/correlator/#/pathway?case=example',
    origin + '/200/arcolens/OPEN_REVIEW.html?year=2026#details',
    origin + '/portfolio/',
    'https://other.example/200/',
  ];
  const clients = urls.map(url => ({
    url,
    async navigate(target) {
      if (closeGate) throw new Error('This tab has closed');
      navigated.push(target);
    },
    postMessage(message) { messages.push({ url, ...message }); },
  }));
  const self = {
    location: { origin },
    addEventListener(name, callback) { events[name] = callback; },
    async skipWaiting() { actions.push('skipWaiting'); },
    registration: { async unregister() { actions.push('unregister'); } },
    clients: {
      async claim() { actions.push('claim'); },
      async matchAll() { return clients; },
    },
  };
  vm.runInNewContext(workerSource, { self, indexedDB: database(deleted, storage), URL, Promise });
  return {
    events, actions, deleted, navigated, messages,
    async lifecycle(name) {
      let task;
      events[name]({ waitUntil(value) { task = value; } });
      await task;
    },
    message(action, sourceURL = origin + '/200/correlator/', hasPort = true) {
      let response;
      const data = { action };
      Object.defineProperty(data, 'password', { get() { throw new Error('The password must never be read.'); } });
      events.message({
        data,
        source: { url: sourceURL },
        ports: hasPort ? [{ postMessage(value) { response = JSON.parse(JSON.stringify(value)); } }] : [],
      });
      return response;
    },
  };
}

function publicPage({
  path = '/200/correlator/#/pathway', gate = false, registration = false,
  controller = registration, replacement = 'controllerchange', update = 'success',
  storage = 'success', unrelated = false, serviceWorkers = true, getRegistrations = 'success',
} = {}) {
  const location = new URL(path, origin);
  const navigations = [];
  location.replace = value => navigations.push(value);
  const removed = [];
  const deleted = [];
  const calls = [];
  const listeners = new Map();
  const timers = new Set();
  const serviceWorker = {
    controller: controller ? { scriptURL: origin + '/200/sw.js' } : null,
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    async register() { throw new Error('Public visitors must never install a worker.'); },
    async getRegistrations() {
      calls.push('getRegistrations');
      if (getRegistrations === 'failure') throw new Error('Registration lookup unavailable');
      return [...(registration ? [existing] : []), ...(unrelated ? [other] : [])];
    },
  };
  const existing = {
    scope: origin + '/200/',
    update() {
      calls.push('update');
      if (update === 'throw') throw new Error('Update failed synchronously');
      if (update === 'failure') return Promise.reject(new Error('Offline update'));
      if (update === 'hang') return new Promise(() => {});
      if (replacement) queueMicrotask(() => {
        for (const callback of listeners.get(replacement) || []) {
          callback({ data: { type: '200-public-ready' } });
        }
      });
      return Promise.resolve();
    },
    async unregister() { calls.push('unregister'); return true; },
  };
  const other = {
    scope: origin + '/some-other-app/',
    async update() { throw new Error('Other registrations must be left alone'); },
    async unregister() { throw new Error('Other registrations must be left alone'); },
  };
  const document = {
    querySelectorAll(selector) {
      if (selector === '[data-lock]') return [{ remove() { removed.push('lock'); } }];
      return [];
    },
    getElementById(name) { return name === 'unlock' && gate ? { remove() { removed.push('gate'); } } : null; },
    body: { classList: { remove(name) { removed.push(name); } } },
  };
  const histories = [];
  const window = { history: { state: null, replaceState(state, title, value) { histories.push(value); location.href = new URL(value, origin).href; } } };
  const context = vm.createContext({
    document, window, location, navigator: serviceWorkers ? { serviceWorker } : {},
    indexedDB: database(deleted, storage), URL, Set, Promise,
    setTimeout(callback, delay) {
      const timer = setTimeout(() => { timers.delete(timer); callback(); }, Math.min(delay, 5));
      timers.add(timer);
      return timer;
    },
    clearTimeout(timer) { timers.delete(timer); clearTimeout(timer); },
  });
  const execute = () => vm.runInContext(sessionSource, context);
  execute();
  return {
    calls, navigations, histories, removed, deleted, listeners, timers, execute,
    async finished() { await window.__public200Migration; },
  };
}

test('the retirement worker never intercepts public requests and activates promptly', async () => {
  const worker = retirementWorker();
  assert.equal(worker.events.fetch, undefined);
  await worker.lifecycle('install');
  assert.deepEqual(worker.actions, ['skipWaiting']);
});

test('activation clears only the old key, retires its registration, and refreshes old gates', async () => {
  const worker = retirementWorker();
  await worker.lifecycle('activate');
  assert.deepEqual(worker.actions, ['claim', 'unregister']);
  assert.deepEqual(worker.deleted, ['pv-200-session']);
  assert.deepEqual(worker.navigated, [
    origin + '/200/?next=%2F200%2Fcorrelator%2F%23%2Fpathway&__public200=20261022',
    origin + '/200/index.html?__public200=20261022',
  ]);
  assert.deepEqual(worker.messages.map(message => message.url), [
    origin + '/200/correlator/#/pathway?case=example',
    origin + '/200/arcolens/OPEN_REVIEW.html?year=2026#details',
  ]);
  assert(worker.messages.every(message => message.type === '200-public-ready'));
});

test('old session timers and cached gate actions remain compatible without reading passwords', () => {
  const worker = retirementWorker();
  for (const action of ['status', 'unlock', 'lock', 'public-status']) {
    assert.deepEqual(worker.message(action), { ok: true, unlocked: true, public: true });
    assert.doesNotThrow(() => worker.message(action, origin + '/200/', false));
  }
  assert.equal(worker.message('unknown'), undefined);
  assert.equal(worker.message('status', origin + '/portfolio/'), undefined);
  assert.equal(worker.message('status', origin + '/200-other/'), undefined);
  assert.equal(worker.message('status', 'https://other.example/200/'), undefined);
});

test('closed tabs and unavailable key storage do not prevent worker retirement', async () => {
  for (const storage of ['error', 'blocked', 'throw']) {
    const worker = retirementWorker({ storage, closeGate: true });
    await worker.lifecycle('activate');
    assert.deepEqual(worker.actions, ['claim', 'unregister']);
    assert.equal(worker.messages.length, 2);
  }
});

test('fresh public visits never register a worker, reload, or wait for an auth session', async () => {
  const page = publicPage();
  await page.finished();
  assert.deepEqual(page.calls, ['getRegistrations']);
  assert.deepEqual(page.navigations, []);
  assert.deepEqual(page.deleted, ['pv-200-session']);
  assert(page.removed.includes('lock'));
  assert.equal(page.timers.size, 0);
});

test('an old worker is updated and removed before one navigation preserving the full tool URL', async () => {
  for (const replacement of ['controllerchange', 'message']) {
    const page = publicPage({ path: '/200/correlator/?view=all#/pathway?case=example&panel=analysis', registration: true, replacement });
    await page.finished();
    assert.deepEqual(page.calls, ['getRegistrations', 'update', 'unregister']);
    assert.deepEqual(page.navigations, ['/200/correlator/?view=all#/pathway?case=example&panel=analysis']);
    assert([...page.listeners.values()].every(callbacks => callbacks.size === 0));
    assert.equal(page.timers.size, 0);
    page.execute();
    await page.finished();
    assert.equal(page.navigations.length, 1);
    assert.equal(page.calls.filter(value => value === 'update').length, 1);
  }
});

test('old locked and cached gate pages continue into a validated tool deep link without a password', async () => {
  for (const registration of [true, false]) {
    const page = publicPage({
      path: '/200/?next=' + encodeURIComponent('/200/correlator/?view=all#/pathway?case=example'),
      gate: true, registration,
    });
    await page.finished();
    assert.deepEqual(page.navigations, ['/200/correlator/?view=all#/pathway?case=example']);
    assert(page.removed.includes('gate'));
  }
  const inherited = publicPage({ path: '/200/?next=%2F200%2Fcorrelator%2F#/pathway?case=example', gate: true });
  await inherited.finished();
  assert.deepEqual(inherited.navigations, ['/200/correlator/#/pathway?case=example']);
  const plainGate = publicPage({ path: '/200/', gate: true });
  await plainGate.finished();
  assert.deepEqual(plainGate.navigations, ['/200/?__public200=20261022']);
});

test('the gate cache-busting marker is removed without another page load', async () => {
  const page = publicPage({ path: '/200/?__public200=20261022#catalog' });
  await page.finished();
  assert.deepEqual(page.histories, ['/200/#catalog']);
  assert.deepEqual(page.navigations, []);
  const deepLink = publicPage({ path: '/200/?next=%2F200%2Fcorrelator%2F&__public200=20261022#/pathway' });
  await deepLink.finished();
  assert.deepEqual(deepLink.histories, ['/200/?next=%2F200%2Fcorrelator%2F#/pathway']);
  assert.deepEqual(deepLink.navigations, ['/200/correlator/#/pathway']);
});

test('failed, synchronous, and stalled worker updates still unregister before continuing', async () => {
  for (const update of ['failure', 'throw', 'hang']) {
    const page = publicPage({ registration: true, update });
    await page.finished();
    assert.deepEqual(page.calls, ['getRegistrations', 'update', 'unregister']);
    assert.deepEqual(page.navigations, ['/200/correlator/#/pathway']);
    assert.equal(page.timers.size, 0);
  }
});

test('continuation rejects foreign URLs, unexpected resources, traversal, and malformed encodings', async () => {
  const targets = [
    'https://other.example/200/correlator/', '//other.example/200/correlator/',
    '/200-other/correlator/', '/portfolio/', '/200/vault/settings.json',
    '/200/session.mjs', '/200/', '/200/index.html', '/200/correlator-other/',
    '/200/correlator/%2e%2e%2fsecret', '/200/correlator/%00', '/200/correlator/%zz',
    'javascript:alert(1)',
  ];
  for (const target of targets) {
    const page = publicPage({ path: '/200/?next=' + encodeURIComponent(target) });
    await page.finished();
    assert.deepEqual(page.navigations, [], target);
  }
});

test('known tool destinations retain their queries and fragments from the catalog', async () => {
  for (const project of ['arcolens', 'agency-costs', 'backdrive', 'correlator', 'explorer', 'haruspex', 'monitor']) {
    const target = `/200/${project}/?view=all#details`;
    const page = publicPage({ path: '/200/index.html?next=' + encodeURIComponent(target) });
    await page.finished();
    assert.deepEqual(page.navigations, [target]);
  }
  const inTool = publicPage({ path: '/200/correlator/?next=%2F200%2Farcolens%2F#/pathway' });
  await inTool.finished();
  assert.deepEqual(inTool.navigations, []);
});

test('unrelated workers, unavailable APIs, and already-retired controllers do not create loops', async () => {
  const unrelated = publicPage({ unrelated: true });
  await unrelated.finished();
  assert.deepEqual(unrelated.calls, ['getRegistrations']);
  assert.deepEqual(unrelated.navigations, []);
  const noAPI = publicPage({ serviceWorkers: false, storage: 'throw' });
  await noAPI.finished();
  assert.deepEqual(noAPI.navigations, []);
  const retired = publicPage({ controller: true });
  await retired.finished();
  assert.deepEqual(retired.navigations, ['/200/correlator/#/pathway']);
  const nextVisit = publicPage();
  await nextVisit.finished();
  assert.deepEqual(nextVisit.navigations, []);
  const failedLookup = publicPage({ getRegistrations: 'failure' });
  await failedLookup.finished();
  assert.deepEqual(failedLookup.navigations, []);
});

test('missing tool files retain their 404 URL and legacy entry scripts contain no password flow', async () => {
  const page = publicPage({ path: '/200/correlator/does-not-exist.html?view=all#details' });
  await page.finished();
  assert.deepEqual(page.navigations, []);
  assert.match(entrySource, /import '\.\/session\.mjs\?public=20261022'/);
  assert.doesNotMatch(entrySource, /password|unlock|\.register\(/);
  assert.match(deepLinkSource, /import\('\/200\/session\.mjs\?public=20261022'\)/);
  assert.doesNotMatch(deepLinkSource, /location\.replace|next=/);
});
