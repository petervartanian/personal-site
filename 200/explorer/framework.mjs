const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const storySymbols = {
  'evaluation-goal': '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m11 8-4 7m6-7 4 7M8 18h8"/>',
  'crossing-boundaries': '<rect x="2" y="5" width="6" height="14" rx="2"/><rect x="16" y="5" width="6" height="14" rx="2"/><path d="M8 12h8m-4-3 3 3-3 3"/>',
  'response-gaps': '<circle cx="6" cy="12" r="3"/><path d="M9 12h5m3 0h5M13 5c3 2 3 12 0 14M17 3c4 4 4 14 0 18"/>',
};

function storyCards(data, routeFor) {
  const stories = data.framework.filter(item => item.type === 'story' && item.id !== 'all-connections');
  return `<section class="story-cards analysis-section" aria-label="Explore explanations of the incident">${stories.map(story => `<a class="story-card" data-story="${escape(story.id)}" href="${routeFor('framework', story.id)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${storySymbols[story.id] || ''}</svg><h3>${escape(story.title)}</h3><p>${escape(story.summary)}</p></a>`).join('')}</section>`;
}

export function selectedStory(data, current, rememberedStory) {
  const item = data[current.view]?.find(i => i.id === current.itemId) || data.framework.find(i => i.id === current.itemId);
  const stories = data.framework.filter(i => i.type === 'story');
  if (item?.type === 'story') return item;
  const belongs = story => current.view === 'controlRelationships'
    ? story.relationshipIds?.includes(item?.id)
    : story.conceptIds.includes(item?.id);
  return stories.find(s => s.id === current.storyId && belongs(s))
    || stories.find(s => s.id === rememberedStory && belongs(s))
    || stories[0];
}

export function frameworkSelection(data, current, routeFor, rememberedStory, systemMarkup = '') {
  const story = selectedStory(data, current, rememberedStory);
  const stories = data.framework.filter(i => i.type === 'story');
  const relationship = current.view === 'controlRelationships' ? data.controlRelationships.find(i => i.id === current.itemId) : null;
  const conceptIds = relationship ? story.conceptIds.filter(id => data.framework.find(i => i.id === id)?.relationshipIds?.includes(relationship.id)) : story.conceptIds;
  const controlIds = relationship ? story.controlIds.filter(id => relationship.controlIds.includes(id)) : story.controlIds;
  const contextTitle = relationship?.title || story.title;
  const groups = [['cause','Causes'], ['capability','Capabilities'], ['harm','Harms']];
  return `<section class="framework-panel" aria-label="Incident connections">
    <nav class="story-choices" aria-label="Choose an aspect of the incident">${stories.map(s => `<a href="${routeFor('framework',s.id)}" ${s.id === story.id ? 'aria-current="true"' : ''}>${escape(s.id === 'all-connections' ? 'All connections' : s.title)}</a>`).join('')}</nav>
    ${systemMarkup}
    <div class="framework-axes">${groups.map(([type,label]) => `<section class="framework-axis axis-${type}"><h2>${label}</h2><div class="concept-choices">${data.framework.filter(i => i.type === type).map(i => {
      const linked = conceptIds.includes(i.id);
      return `<a aria-label="${escape(i.title)}. ${linked ? `Related to ${escape(contextTitle)}` : 'Select to examine this topic'}" class="concept-choice ${linked ? 'in-story' : 'outside-story'}" href="${routeFor('framework',i.id,undefined,story.id)}" ${i.id === current.itemId ? 'aria-current="true"' : ''}><span class="concept-mark" aria-hidden="true"></span>${escape(i.title)}</a>`;
    }).join('')}</div></section>`).join('')}
    <section class="framework-axis axis-mitigation"><h2>Mitigations</h2><div class="concept-choices">${Object.entries(data.mitigationTaxonomy.categories).map(([code,category]) => {
      const controls = data.controls.filter(c => c.classification.code === code);
      const linked = controls.filter(c => controlIds.includes(c.id));
      return `<a aria-label="${escape(category.name)}. ${linked.length ? `Related to ${escape(contextTitle)}` : 'Select to examine these safeguards'}" class="concept-choice ${linked.length ? 'in-story' : 'outside-story'}" href="${routeFor('controls',(linked[0] || controls[0]).id)}"><span class="concept-mark" aria-hidden="true"></span>${escape(category.name)}</a>`;
    }).join('')}</div></section></div>
  </section>`;
}

export function frameworkAnalysis(item, data, citationLinks, routeFor, mechanism = () => '') {
  const mapping = item.classification;
  const taxonomy = mapping && data.incidentTaxonomy?.categories?.[mapping.code];
  const detail = `<h2 id="analysis-title" tabindex="-1">${escape(item.title)}</h2><div class="account-prose"><p>${escape(item.summary)} <span class="inline-citations">${citationLinks(item, 'summary')}</span></p>${item.explanation ? `<p>${escape(item.explanation)} <span class="inline-citations">${citationLinks(item, 'explanation')}</span></p>` : ''}</div>`;
  const alternative = item.alternative ? `<section class="alternative"><h3>Another account</h3><p>${escape(item.alternative)}</p></section>` : '';
  const classification = taxonomy ? `<div class="classification-note"><h3>Proposed risk category</h3><p><a href="${escape(taxonomy.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(mapping.code)} ${escape(taxonomy.name)}<span class="visually-hidden"> (opens in a new tab)</span></a>${mapping.rationale ? `: ${escape(mapping.rationale)}` : ''}</p></div>` : '';
  if (item.type === 'overview') return detail + storyCards(data, routeFor);
  const connections = (label, view, ids) => ids?.length ? `<div><dt>${label}</dt><dd>${ids.map(id => {
    const target = data[view].find(entry => entry.id === id);
    return `<a href="${routeFor(view,id)}">${escape(target.title || target.label)}</a>`;
  }).join('')}</dd></div>` : '';
  return detail + alternative + mechanism(item) + classification + `<dl class="account-links">${connections('Safeguards','controls',item.controlIds)}${connections('Questions to investigate','questions',item.questionIds)}</dl>`;

}

export function safeguardsMatrix(data, current, routeFor, organizationName, stateLabel) {
  const owners = [...new Set(data.controls.map(c => c.owner))];
  const groups = Object.entries(data.mitigationTaxonomy.categories);
  return `<section class="safeguard-matrix"><div class="matrix-heading"><h2>Safeguards across organizations</h2><p>Grouped by proposed MIT mitigation category.</p></div><div class="matrix-scroll" role="region" aria-label="Safeguards by category and owner" tabindex="0"><table><thead><tr><th scope="col">Mitigation category</th>${owners.map(owner => `<th scope="col">${organizationName(owner)}</th>`).join('')}</tr></thead><tbody>${groups.map(([code,category]) => `<tr><th scope="row"><span class="matrix-code">${escape(code)}</span>${escape(category.name)}</th>${owners.map(owner => {
    const controls = data.controls.filter(c => c.owner === owner && c.classification.code === code);
    return `<td>${controls.length ? controls.map(c => `<a class="matrix-control state-${escape(c.state)}" href="${routeFor('controls',c.id)}" ${c.id === current.itemId ? 'aria-current="true"' : ''}>${stateLabel(c)}<span class="matrix-control-name">${escape(c.title)}</span></a>`).join('') : '<span class="matrix-empty" aria-label="No safeguard mapped in this category for this organization">–</span>'}</td>`;
  }).join('')}</tr>`).join('')}</tbody></table></div><p class="matrix-key">Statuses describe reported performance during the incident. A dash means that no safeguard is mapped here.</p></section>`;
}
