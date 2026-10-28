const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function frameworkSelection(data, current, routeFor, rememberedStory, systemMarkup = '') {
  return systemMarkup;
}

export function frameworkTopics(data, current, routeFor) {
  if (['account-overview', 'all-connections'].includes(current.itemId)) return '';
  const item = data[current.view]?.find(entry => entry.id === current.itemId);
  if (!item) return '';
  const types = { cause: 'Cause', capability: 'Capability', harm: 'Harm' };
  const concepts = current.view === 'controlRelationships'
    ? data.framework.filter(entry => types[entry.type] && entry.relationshipIds?.includes(item.id))
    : item.type === 'story' ? data.framework.filter(entry => item.conceptIds?.includes(entry.id))
    : types[item.type] ? [item] : data.framework.filter(entry => types[entry.type] && entry.eventIds?.includes(item.id));
  const controls = (item.controlIds || []).map(id => data.controls.find(entry => entry.id === id)).filter(Boolean);
  const chip = (type, label, title, url, active = false) => `<li class="axis-${type}"><a class="concept-choice in-story" href="${url}"${active ? ' aria-current="true"' : ''}><span class="concept-mark" aria-hidden="true"></span><span class="concept-copy"><span class="concept-kind">${escape(label)}</span><span>${escape(title)}</span></span></a></li>`;
  return `<nav class="framework-topics" aria-label="Factors and safeguards related to ${escape(item.title || item.label)}"><ul>${concepts.map(entry => chip(entry.type, types[entry.type], entry.title, routeFor('framework', entry.id), entry.id === current.itemId)).join('')}${controls.map(control => chip('mitigation', 'Mitigation', control.title, routeFor('controls', control.id))).join('')}</ul></nav>`;
}

export function frameworkAnalysis(item, data, citationLinks, routeFor, mechanism = () => '', { current, rememberedStory } = {}) {
  const mapping = item.classification;
  const taxonomy = mapping && data.incidentTaxonomy?.categories?.[mapping.code];
  const detail = `<h2 id="analysis-title" tabindex="-1">${escape(item.title)}</h2><div class="account-prose"><p data-claim="summary">${escape(item.summary)} <span class="inline-citations">${citationLinks(item, 'summary')}</span></p>${item.explanation ? `<p data-claim="explanation">${escape(item.explanation)} <span class="inline-citations">${citationLinks(item, 'explanation')}</span></p>` : ''}</div>`;
  const alternative = item.alternative ? `<section class="alternative"><h3>Another account</h3><p>${escape(item.alternative)} ${citationLinks(item, 'alternative')}</p></section>` : '';
  const classification = taxonomy ? `<div class="classification-note"><h3>Proposed risk category</h3><p><a href="${escape(taxonomy.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(mapping.code)} ${escape(taxonomy.name)}<span class="visually-hidden"> (opens in a new tab)</span></a>${mapping.rationale ? `: ${escape(mapping.rationale)}` : ''}</p></div>` : '';
  if (item.type === 'overview') return detail;
  const topics = frameworkTopics(data, current || {view: 'framework', itemId: item.id}, routeFor, rememberedStory);
  const connections = (label, view, ids) => ids?.length ? `<div><dt>${label}</dt><dd>${ids.map(id => {
    const target = data[view].find(entry => entry.id === id);
    return `<a href="${routeFor(view,id)}">${escape(target.title || target.label)}</a>`;
  }).join('')}</dd></div>` : '';
  return detail + alternative + mechanism(item) + topics + `<dl class="account-links">${connections('Findings and questions','questions',item.questionIds)}</dl>` + classification;

}
