const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function systemSelection(data, current, routeFor, { selectedStory, selectedItem } = {}) {
  const selectedRelationship = current.view === 'controlRelationships'
    ? data.controlRelationships.find(item => item.id === current.itemId)
    : null;
  const item = selectedRelationship || selectedItem || data[current.view]?.find(entry => entry.id === current.itemId) || selectedStory;
  const relatedIds = new Set(selectedRelationship ? [selectedRelationship.id] : item?.relationshipIds || []);
  const marks = {
    'evaluation-control': '<img src="assets/openai.png" width="20" height="20" alt="">',
    'application-control': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01m-1 6-2 2 2 2m6-4 2 2-2 2"/></svg>',
    'platform-control': '<img src="assets/modal.svg" width="20" height="20" alt="">',
    'hugging-face-control': '<img src="assets/hugging-face.svg" width="20" height="20" alt="">',
  };
  const systemLink = (id, name, description, className = '') => {
    const relationship = data.controlRelationships.find(entry => entry.id === id);
    return `<a class="system-map-link${className ? ` ${className}` : ''}${relatedIds.has(id) ? ' related-system' : ''}" data-relationship="${id}" href="${routeFor('controlRelationships', id)}" aria-label="${escape(`${name}: ${description}. ${relationship.title}`)}"${selectedRelationship?.id === id ? ' aria-current="true"' : ''}><strong class="system-map-name"><span class="system-map-mark" aria-hidden="true">${marks[id]}</span><span>${escape(name)}</span></strong><span class="system-map-description">${escape(description)}</span></a>`;
  };
  const events = (item?.eventIds || []).map(id => data.events.find(event => event.id === id)).filter(Boolean);
  return `<nav class="system-map" aria-label="Systems involved in the incident">
    <div class="system-map-station">${systemLink('evaluation-control', 'OpenAI', 'Evaluation environment')}</div>
    <span class="system-map-edge"><span>Package access</span></span>
    <div class="system-map-station">${systemLink('application-control', 'Customer application', 'Public code endpoint')}${systemLink('platform-control', 'Modal', 'Platform isolation', 'system-map-host')}</div>
    <span class="system-map-edge"><span>Requests</span></span>
    <div class="system-map-station">${systemLink('hugging-face-control', 'Hugging Face', 'Dataset workers')}</div>
  </nav>${events.length ? `<nav class="system-events" aria-label="Related events"><span class="system-events-title">Events</span>${events.map(event => {
    const label = `${event.date}: ${event.label}`;
    return `<a class="system-event" data-event="${escape(event.id)}" href="${routeFor('events', event.id)}" aria-label="${escape(label)}" title="${escape(label)}"><span class="system-event-dot" aria-hidden="true"></span><span class="system-event-label" aria-hidden="true">${escape(label)}</span></a>`;
  }).join('')}</nav>` : ''}`;
}

export function systemAnalysis(item, citationLinks, related, routeFor) {
  const field = (label,key) => {
    const refs = item.sourceRefs.filter(ref => ref.supports.split(',').map(x => x.trim()).includes(key));
    const citations = refs.map(ref => `<a class="citation" href="${routeFor('controlRelationships',item.id,ref.sourceId)}" aria-label="Show source for ${label.toLowerCase()}">[${item.sourceIds.indexOf(ref.sourceId)+1}]</a>`).join(' ');
    return `<div class="system-fact"><dt>${label}</dt><dd>${escape(item[key])} ${citations}</dd></div>`;
  };
  return `<h2 id="analysis-title" tabindex="-1">${escape(item.title)}</h2><dl class="system-facts">${field('Action or setting','controlAction')}${field('Information and feedback','feedback')}${field('Understanding at the time','understanding')}${field('Operating context','context')}</dl><section class="system-objective"><h3>Proposed requirement</h3><p>${escape(item.requiredConstraint)}</p></section><section class="system-request"><h3>Question for ${escape(item.informationHolder)}</h3><p>${escape(item.informationNeeded)}</p><div class="system-request-links">${item.questionIds.map(id => `<a href="${routeFor('questions',id)}">${escape(id === 'hf-escalation' ? 'Alert escalation' : id === 'response-authority' ? 'Stop and restart authority' : id === 'control-effectiveness' ? 'Safeguard testing' : id === 'cross-organization-response' ? 'Provider cooperation' : 'Forensic verification')}</a>`).join('')}</div></section>${related('controls',item.controlIds,'Safeguards and possible changes')}`;
}
