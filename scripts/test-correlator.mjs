import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFileSync(path.join(root, name), 'utf8');
const projects = ['agency-costs', 'backdrive', 'correlator', 'haruspex', 'monitor', 'arcolens'];
function files(directory) {
  return readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
    const name = `${directory}/${entry.name}`;
    return entry.isDirectory() ? files(name) : [name];
  });
}

test('all six tools have static entry pages at their existing URLs', () => {
  const catalog = read('200/index.html');
  assert(!/type=["']password|data-lock|id=["']unlock/.test(catalog));
  for (const project of projects) {
    const html = read(`200/${project}/index.html`);
    assert.match(html, /<!doctype html/i);
    assert(!/type=["']password|id=["']unlock/.test(html));
    assert(catalog.includes(`href="/200/${project}/"`), `Catalog omits ${project}`);
  }
  assert.match(read('200/arcolens/index.html'), /OPEN_REVIEW\.html/);
  assert.match(read('200/arcolens/OPEN_REVIEW.html'), /Arcolens/);
  const plan = read('200/correlator/plan/index.html');
  const planTab = 'https://docs.google.com/document/d/1g9dQQXl5b8GwscmhZqLvXFifs8z2XD0p9JmsGogwc_0/edit?tab=t.qgntom4a0dv7';
  assert(plan.includes(`<meta http-equiv="refresh" content="0; url=${planTab}">`));
  assert(plan.includes(`<a href="${planTab}">`), 'The retired Plan URL needs a fallback link');
  assert(!/timeline|schedule-row|@font-face/.test(plan), 'The standalone Plan must stay retired');
  assert(!existsSync(path.join(root, '200/correlator/plan/figtree-latin.woff2')));
});

test('every tool HTML page retains search exclusion, including saved HTML reports', () => {
  const pages = files('200').filter(name => name.endsWith('.html'));
  assert(pages.length > 170, 'The existing tool pages must be preserved');
  for (const name of pages) {
    const html = read(name);
    assert(/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html), `Missing noindex: ${name}`);
    assert(!/type=["']password|\bdata-lock\b/.test(html), `Obsolete password control: ${name}`);
  }
});

test('public discovery files do not advertise the unlisted tool routes', () => {
  for (const filename of ['sitemap.xml', 'llms.txt', 'site-index/index.html']) {
    const text = read(filename);
    for (const directory of ['200', ...projects, 'x-oscope', 'auspex']) {
      assert(!text.includes(`/${directory}/`), `${filename} advertises /${directory}/`);
    }
  }
  // Crawlers need access to read noindex; disallowing these HTML pages would hide it.
  assert(!/^Disallow:\s*\/200\/?\s*$/mi.test(read('robots.txt')));
});

test('alternate root copies and obsolete application routes remain absent', () => {
  for (const directory of [...projects, 'x-oscope', 'auspex']) {
    assert(!existsSync(path.join(root, directory)), `Unexpected root copy: /${directory}/`);
  }
});

test('the transition preserves the old encrypted resources until old workers retire', () => {
  const settings = JSON.parse(read('200/vault/settings.json'));
  assert(/^[a-f0-9]{64}\.bin$/.test(settings.manifest));
  assert(existsSync(path.join(root, '200/vault', settings.manifest)));
  for (const name of readdirSync(path.join(root, '200/vault'))) {
    assert(name === 'settings.json' || /^[a-f0-9]{64}\.bin$/.test(name), `Unexpected vault file: ${name}`);
  }
});
