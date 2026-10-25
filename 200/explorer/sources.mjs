const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

const fieldsFor = reference => String(reference.supports || '').split(',').map(field => field.trim()).filter(Boolean);
const sourceDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '')
  ? new Date(`${value}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  : String(value || '');

function publicUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

function externalLink(label, url, className = 'source-link') {
  const href = publicUrl(url);
  return href ? `<a class="${className}" href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(label)}<span class="visually-hidden"> (opens in a new tab)</span></a>` : '';
}

function referencesFor(data, item, claim) {
  const sourceIds = item.sourceIds || [...new Set((item.sourceRefs || []).map(reference => reference.sourceId))];
  return sourceIds.flatMap(sourceId => {
    const source = data.sources.find(entry => entry.id === sourceId);
    if (!source) return [];
    const references = (item.sourceRefs || []).filter(reference => reference.sourceId === sourceId && (!claim || fieldsFor(reference).includes(claim)));
    return references.map(reference => ({ source, reference }));
  });
}

function matchingCompanion(selected, candidates, claim) {
  const alternatives = candidates.filter(entry => entry.source.id !== selected.source.id);
  if (claim) return alternatives[0];
  const fields = new Set(fieldsFor(selected.reference));
  return alternatives.find(entry => fieldsFor(entry.reference).some(field => fields.has(field)));
}

function passageMarkup({ source, reference }, index) {
  const original = publicUrl(source.url);
  const passages = (reference.passages || []).filter(passage => publicUrl(passage.url));
  const uniquePassages = passages.filter((passage, position) => passages.findIndex(other => publicUrl(other.url) === publicUrl(passage.url)) === position);
  const passageLinks = uniquePassages.map(passage => externalLink(passage.label || 'Read passage', passage.url)).join('');
  const originalLink = original && !uniquePassages.some(passage => publicUrl(passage.url) === original)
    ? externalLink('Read original source', original) : '';
  const date = sourceDate(source.date);
  return `<article class="source-entry" data-source-id="${escape(source.id)}" aria-labelledby="source-title-${index}">
    <div class="source-publisher"><span>${escape(source.publisher)}</span>${date ? `<time datetime="${escape(source.date)}">${escape(date)}</time>` : ''}</div>
    <h3 class="source-title" id="source-title-${index}">${escape(source.title)}</h3>
    ${source.kind ? `<p class="source-kind">${escape(source.kind)}</p>` : ''}
    ${source.scope ? `<p class="source-scope">${escape(source.scope)}</p>` : ''}
    ${reference.account ? `<div class="source-account"><span class="source-summary-label">Summary</span><p>${escape(reference.account)}</p></div>` : ''}
    ${reference.excerpt ? `<blockquote>${escape(reference.excerpt)}</blockquote>` : ''}
    ${reference.locator || source.locator ? `<p class="source-locator">${escape(reference.locator || source.locator)}</p>` : ''}
    <div class="source-passages">${passageLinks}${originalLink}</div>
  </article>`;
}

/** Render only passages attached to this item and, when selected, this claim. */
export function sourceMarkup(data, item, current, routeFor, { compare = false, claim = null } = {}) {
  const candidates = referencesFor(data, item, claim);
  const selected = candidates.find(entry => entry.source.id === current.sourceId) || candidates[0];
  const heading = '<div class="sources-heading"><h2 id="sources-title" tabindex="-1">Sources</h2></div>';
  if (!selected) return `${heading}<p>No source passage is attached to this claim.</p>`;
  const companion = matchingCompanion(selected, candidates, claim);
  const comparison = Boolean(compare && companion);
  const sourceOptions = candidates.filter((entry, index) => candidates.findIndex(other => other.source.id === entry.source.id) === index);
  const picker = sourceOptions.length > 1 ? `<label class="visually-hidden" for="source-picker">${comparison ? 'First source to compare' : 'Choose a source'}</label><select id="source-picker">${sourceOptions.map(({ source }) => {
    const samePublisher = sourceOptions.filter(entry => entry.source.publisher === source.publisher).length > 1;
    return `<option value="${escape(source.id)}"${source.id === selected.source.id ? ' selected' : ''}>${escape(source.publisher)}${samePublisher ? `, ${escape(sourceDate(source.date))}` : ''}</option>`;
  }).join('')}</select>` : '';
  const comparisonControl = companion ? `<button type="button" ${comparison ? 'data-source-single' : 'data-source-compare'}>${comparison ? 'Read one source' : 'Compare sources'}</button>` : '';
  const tools = picker || comparisonControl ? `<div class="source-tools">${picker}${comparisonControl}</div>` : '';
  return heading + tools + (comparison
    ? `<div class="source-comparison">${passageMarkup(selected, 1)}${passageMarkup(companion, 2)}</div>`
    : passageMarkup(selected, 1));
}
