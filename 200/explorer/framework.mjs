const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const storyChoices = [
  ['crossing-boundaries', 'Access route'],
  ['response-gaps', 'Response decisions'],
  ['evaluation-goal', 'Agent behavior'],
];

const visibleStories = data => storyChoices.map(([id, label]) => {
  const story = data.framework.find(item => item.id === id && item.type === 'story');
  return story ? { ...story, choiceLabel: label } : null;
}).filter(Boolean);

export function selectedStory(data, current, rememberedStory) {
  const item = data[current.view]?.find(i => i.id === current.itemId) || data.framework.find(i => i.id === current.itemId);
  const stories = visibleStories(data);
  if (item?.type === 'story' && item.id !== 'all-connections') return stories.find(story => story.id === item.id) || item;
  const belongs = story => current.view === 'controlRelationships'
    ? story.relationshipIds?.includes(item?.id)
    : story.conceptIds?.includes(item?.id);
  return stories.find(story => story.id === current.storyId && belongs(story))
    || stories.find(story => story.id === rememberedStory && belongs(story))
    || stories.find(belongs)
    || stories[0];
}

export function frameworkSelection(data, current, routeFor, rememberedStory, systemMarkup = '') {
  const story = selectedStory(data, current, rememberedStory);
  return `<section class="framework-panel" aria-label="Incident connections">
    <nav class="story-choices" aria-label="Choose an aspect of the incident">${visibleStories(data).map(s => `<a href="${routeFor('framework',s.id)}" ${s.id === story.id ? 'aria-current="true"' : ''}>${escape(s.choiceLabel)}</a>`).join('')}</nav>
    ${systemMarkup}
  </section>`;
}

export function frameworkTopics(data, current, routeFor, rememberedStory) {
  if (current.itemId === 'account-overview') return '';
  const story = selectedStory(data, current, rememberedStory);
  if (!story) return '';
  const relationship = current.view === 'controlRelationships' ? data.controlRelationships.find(i => i.id === current.itemId) : null;
  const conceptIds = relationship ? story.conceptIds.filter(id => data.framework.find(i => i.id === id)?.relationshipIds?.includes(relationship.id)) : story.conceptIds;
  const selectedItem = data[current.view]?.find(item => item.id === current.itemId);
  const scope = relationship || (selectedItem?.type !== 'story' ? selectedItem : null);
  const controlIds = scope ? story.controlIds.filter(id => scope.controlIds?.includes(id)) : story.controlIds;
  const types = { cause: 'Cause', capability: 'Capability', harm: 'Harm' };
  const concepts = conceptIds.map(id => data.framework.find(item => item.id === id)).filter(item => item && types[item.type]);
  const controls = controlIds.map(id => data.controls.find(item => item.id === id)).filter(Boolean);
  const chip = (type, label, title, url, active = false) => `<li class="axis-${type}"><a class="concept-choice in-story" href="${url}"${active ? ' aria-current="true"' : ''}><span class="concept-mark" aria-hidden="true"></span><span class="concept-copy"><span class="concept-kind">${escape(label)}</span><span>${escape(title)}</span></span></a></li>`;
  return `<nav class="framework-topics" aria-label="Factors and safeguards related to ${escape(relationship?.title || story.choiceLabel || story.title)}"><ul>${concepts.map(item => chip(item.type, types[item.type], item.title, routeFor('framework', item.id, undefined, story.id), item.id === current.itemId)).join('')}${controls.map(control => chip('mitigation', 'Mitigation', control.title, routeFor('controls', control.id))).join('')}</ul></nav>`;
}

export function frameworkAnalysis(item, data, citationLinks, routeFor, mechanism = () => '', { current, rememberedStory } = {}) {
  const mapping = item.classification;
  const taxonomy = mapping && data.incidentTaxonomy?.categories?.[mapping.code];
  const detail = `<h2 id="analysis-title" tabindex="-1">${escape(item.title)}</h2><div class="account-prose"><p>${escape(item.summary)} <span class="inline-citations">${citationLinks(item, 'summary')}</span></p>${item.explanation ? `<p>${escape(item.explanation)} <span class="inline-citations">${citationLinks(item, 'explanation')}</span></p>` : ''}</div>`;
  const alternative = item.alternative ? `<section class="alternative"><h3>Another account</h3><p>${escape(item.alternative)}</p></section>` : '';
  const classification = taxonomy ? `<div class="classification-note"><h3>Proposed risk category</h3><p><a href="${escape(taxonomy.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(mapping.code)} ${escape(taxonomy.name)}<span class="visually-hidden"> (opens in a new tab)</span></a>${mapping.rationale ? `: ${escape(mapping.rationale)}` : ''}</p></div>` : '';
  if (item.type === 'overview') return detail;
  const topics = frameworkTopics(data, current || {view: 'framework', itemId: item.id}, routeFor, rememberedStory);
  const connections = (label, view, ids) => ids?.length ? `<div><dt>${label}</dt><dd>${ids.map(id => {
    const target = data[view].find(entry => entry.id === id);
    return `<a href="${routeFor(view,id)}">${escape(target.title || target.label)}</a>`;
  }).join('')}</dd></div>` : '';
  return detail + alternative + mechanism(item) + classification + topics + `<dl class="account-links">${connections('Questions to investigate','questions',item.questionIds)}</dl>`;

}

export function safeguardsMatrix(data, current, routeFor, organizationName, stateLabel) {
  const owners = [...new Set(data.controls.map(c => c.owner))];
  const groups = Object.entries(data.mitigationTaxonomy.categories);
  return `<section class="safeguard-matrix"><div class="matrix-heading"><h2>Safeguards across organizations</h2><p>Grouped by proposed MIT mitigation category.</p></div><div class="matrix-scroll" role="region" aria-label="Safeguards by category and owner" tabindex="0"><table><thead><tr><th scope="col">Mitigation category</th>${owners.map(owner => `<th scope="col">${organizationName(owner)}</th>`).join('')}</tr></thead><tbody>${groups.map(([code,category]) => `<tr><th scope="row"><span class="matrix-code">${escape(code)}</span>${escape(category.name)}</th>${owners.map(owner => {
    const controls = data.controls.filter(c => c.owner === owner && c.classification.code === code);
    return `<td>${controls.length ? controls.map(c => `<a class="matrix-control state-${escape(c.state)}" href="${routeFor('controls',c.id)}" ${c.id === current.itemId ? 'aria-current="true"' : ''}>${stateLabel(c)}<span class="matrix-control-name">${escape(c.title)}</span></a>`).join('') : '<span class="matrix-empty" aria-label="No safeguard mapped in this category for this organization">–</span>'}</td>`;
  }).join('')}</tr>`).join('')}</tbody></table></div><p class="matrix-key">Statuses describe reported performance during the incident. A dash means that no safeguard is mapped here.</p></section>`;
}
