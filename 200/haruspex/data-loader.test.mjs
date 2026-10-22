import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import './data-loader.js';

const root = new URL('./', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const template = await readFile(new URL('index.template.html', root), 'utf8');
assert(Buffer.byteLength(html) < 2_000_000, 'The complete page must fit the crawl limit.');
assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large">/);
assert.match(template, /<meta name="robots" content="noindex, follow">/);
assert.match(html, /<link rel="canonical" href="https:\/\/petervartanian\.xyz\/haruspex\/">/);
const sources = Object.fromEntries([...html.matchAll(/<script id="([^"]+)" type="application\/json" data-src="([^"]+)"><\/script>/g)].map(match => [match[1], match[2]]));
assert.equal(Object.keys(sources).length, 8, 'All eight layers must use external JSON.');
const document = { getElementById: id => sources[id] ? { dataset: { src: sources[id] } } : null };
const responses = new Map();
for (const source of Object.values(sources)) {
  const url = new URL(source, root);
  const content = await readFile(new URL(url.pathname, 'file:'), 'utf8');
  assert(Buffer.byteLength(content) < 2_000_000, `${source} must fit the crawl limit.`);
  assert.equal(url.searchParams.get('v'), createHash('sha256').update(content).digest('hex').slice(0, 12));
  responses.set(source, { ok: true, json: async () => JSON.parse(content) });
}

const pending = new Map();
const loaded = globalThis.HaruspexData.load(document, source => new Promise(resolve => pending.set(source, resolve)));
assert.equal(pending.size, 8, 'Data layers must load concurrently.');
for (const [source, resolve] of [...pending].reverse()) resolve(responses.get(source));
const actual = await loaded;
const files = {
  dataset: 'haruspex-dataset.json',
  'severity-data': 'severity-assessments.json',
  'visual-data': 'visual-encodings.json',
  'ontology-data': 'incident-ontology.json',
  'temporal-data': 'temporal-assessments.json',
  'cast-data': 'cast-analysis.json',
  'research-data': 'research-expansion.json',
  'quotation-data': 'opening-quotations.json',
};
for (const [id, file] of Object.entries(files)) {
  const expected = JSON.parse(await readFile(new URL(file, root), 'utf8'));
  if (id === 'research-data') expected.collection_method = JSON.parse(await readFile(new URL('collection-method.json', root), 'utf8'));
  assert.deepEqual(actual[id], expected, `${id} must preserve its complete source data.`);
}
await assert.rejects(globalThis.HaruspexData.load(document, async source => source === sources.dataset
  ? { ok: false, status: 404 }
  : responses.get(source)), /Could not load dataset: HTTP 404/);
await assert.rejects(globalThis.HaruspexData.load(document, async source => source === sources.dataset
  ? { ok: true, json: async () => JSON.parse('incomplete') }
  : responses.get(source)), SyntaxError);
await assert.rejects(globalThis.HaruspexData.load({ getElementById: () => null }, async () => {
  throw new Error('Missing resources must be caught before fetching.');
}), /Missing data resource: dataset/);
console.log('Eight complete JSON layers: concurrent loading, source-data parity, versioned resources, crawl limits, indexing metadata, and failure handling verified.');
