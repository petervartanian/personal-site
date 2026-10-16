import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFileSync(path.join(root, name), 'utf8');

const projects = ['agency-costs', 'backdrive', 'correlator', 'haruspex', 'monitor'];

test('no unencrypted experiment package is included in the public snapshot', () => {
  for (const directory of [...projects, 'arcolens', 'x-oscope', 'auspex']) {
    assert(!existsSync(path.join(root, directory)), `Public experiment directory must remain absent: /${directory}/`);
    assert(!existsSync(path.join(root, '200', directory)), `Private files must be ciphertext rather than a plaintext /200/${directory}/ directory`);
  }
});

test('the public experiment shell contains only the gate, loader, and ciphertext', () => {
  const shell = new Set(['index.html', 'entry.css', 'entry.mjs', 'session.mjs', 'vault-core.mjs', 'sw.js', 'deep-link.js', 'vault']);
  for (const name of readdirSync(path.join(root, '200'))) {
    assert(shell.has(name), `Unexpected public /200 resource: ${name}`);
  }
  for (const name of readdirSync(path.join(root, '200/vault'))) {
    assert(name === 'settings.json' || /^[a-f0-9]{64}\.bin$/.test(name), `Non-ciphertext vault file: ${name}`);
  }
  const settings = JSON.parse(read('200/vault/settings.json'));
  assert.equal(settings.version, 1);
  assert.equal(settings.iterations, 600000);
  assert(/^[a-f0-9]{64}\.bin$/.test(settings.manifest));
  assert(existsSync(path.join(root, '200/vault', settings.manifest)), 'Encrypted manifest must be present');
  assert(read('200/index.html').includes('noindex, nofollow'));
});

test('public discovery files do not advertise the private experiment routes', () => {
  for (const filename of ['sitemap.xml', 'llms.txt', 'site-index/index.html']) {
    const text = read(filename);
    for (const directory of ['200', ...projects, 'arcolens', 'x-oscope', 'auspex']) {
      assert(!text.includes(`/${directory}/`), `${filename} exposes /${directory}/`);
    }
  }
});

test('older encrypted catalogues point every experiment to protected routes and preserve session checks', () => {
  const heading = {}, description = {}, mark = { classList: { add(value) { this.added = value; } } };
  const style = { setProperty(key, value) { this[key] = value; } };
  const link = { style, querySelector(selector) { return { h2: heading, p: description, '.experiment-mark': mark }[selector]; } };
  const events = [];
  const timers = [];
  const oldLinks = new Map(projects.filter(name => name !== 'correlator').map(name => [name, { href: `/${name}/` }]));
  vm.runInNewContext(read('200/session.mjs'), {
    document: {
      querySelectorAll(selector) {
        if (selector === '.experiment-list a[href="/x-oscope/"], .experiment-list a[href="/correlator/"], .experiment-list a[href="/200/correlator/"]') return [link];
        for (const [name, oldLink] of oldLinks) {
          if (selector === `.experiment-list a[href="/${name}/"]`) return [oldLink];
        }
        return [];
      },
      addEventListener(name) { events.push(name); },
    },
    window: { addEventListener(name) { events.push(name); } },
    setInterval(callback, delay) { timers.push(delay); },
  });
  assert.equal(link.href, '/200/correlator/');
  for (const [name, oldLink] of oldLinks) assert.equal(oldLink.href, `/200/${name}/`);
  assert.equal(heading.textContent, 'AI Risk Correlator');
  assert.equal(description.textContent, 'What do AI incidents tell us about existential risk?');
  assert.equal(style['--accent'], '#5f4b8b');
  assert.equal(mark.textContent, 'AI');
  assert.deepEqual(events, ['pageshow', 'visibilitychange']);
  assert.deepEqual(timers, [60000]);
});
