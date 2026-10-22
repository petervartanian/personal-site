(() => {
  'use strict';
  const ids = ['dataset', 'severity-data', 'visual-data', 'ontology-data', 'temporal-data', 'cast-data', 'research-data', 'quotation-data'];

  async function load(document, request = globalThis.fetch.bind(globalThis)) {
    const entries = await Promise.all(ids.map(async (id) => {
      const source = document.getElementById(id)?.dataset.src;
      if (!source) throw new Error(`Missing data resource: ${id}`);
      const response = await request(source);
      if (!response.ok) throw new Error(`Could not load ${id}: HTTP ${response.status}`);
      return [id, await response.json()];
    }));
    return Object.fromEntries(entries);
  }

  globalThis.HaruspexData = { load };
})();
