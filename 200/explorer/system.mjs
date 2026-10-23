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
  const topicId = selectedStory?.id || (item?.type === 'story' ? item.id : current.storyId);
  const responseTopic = topicId === 'response-gaps';
  const behaviorTopic = topicId === 'evaluation-goal';
  const shownEventIds = responseTopic ? new Set(['evaluation-restart', 'hf-containment', 'developer-attribution']) : new Set();
  const events = (item?.eventIds || []).filter(id => !shownEventIds.has(id)).map(id => data.events.find(event => event.id === id)).filter(Boolean);
  const responseEvent = id => {
    const event = data.events.find(entry => entry.id === id);
    return `<a class="system-response-event" data-event="${escape(event.id)}" href="${routeFor('events', event.id)}" aria-label="${escape(`${event.date}: ${event.label}`)}"><span class="system-response-date">${escape(event.date)}</span><span>${escape(event.label)}</span></a>`;
  };
  const boardId = 'capability-agent-coordination';
  const board = `<a class="system-map-link system-board-link${item?.id === boardId ? ' related-system' : ''}" href="${routeFor('framework', boardId, undefined, 'evaluation-goal')}"${item?.id === boardId ? ' aria-current="true"' : ''}><strong class="system-map-name"><svg class="system-map-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v12H9l-5 4zM8 8h8m-8 4h5"/></svg><span>Unauthorized message board</span></strong><span class="system-map-description">Information and credentials</span></a>`;
  const map = behaviorTopic ? `<nav class="system-map system-behavior-map" aria-label="Agent communication during evaluation">
    <div class="system-map-station">${systemLink('evaluation-control', 'OpenAI', 'Evaluation agents')}</div>
    <span class="system-map-edge"><span>Shared information</span></span>
    <div class="system-map-station">${board}</div>
  </nav>` : responseTopic ? `<nav class="system-map system-response-map" aria-label="Response teams and documented events">
    <div class="system-map-station">${systemLink('evaluation-control', 'OpenAI', 'Research and security teams')}${responseEvent('evaluation-restart')}</div>
    <a class="system-map-edge system-response-connection" data-event="developer-attribution" href="${routeFor('events', 'developer-attribution')}" aria-label="July 20: attribution and notification. OpenAI links its agents to the intrusion."><span>July 20: attribution and notification</span></a>
    <div class="system-map-station">${systemLink('hugging-face-control', 'Hugging Face', 'Security and platform teams')}${responseEvent('hf-containment')}</div>
  </nav>` : `<nav class="system-map" aria-label="Systems involved in the incident">
    <div class="system-map-station">${systemLink('evaluation-control', 'OpenAI', 'Evaluation environment')}</div>
    <span class="system-map-edge"><span>Package access</span></span>
    <div class="system-map-station">${systemLink('application-control', 'Customer application', 'Public code endpoint')}${systemLink('platform-control', 'Modal', 'Platform isolation', 'system-map-host')}</div>
    <span class="system-map-edge"><span>Requests</span></span>
    <div class="system-map-station">${systemLink('hugging-face-control', 'Hugging Face', 'Dataset workers')}</div>
  </nav>`;
  return `${map}${events.length ? `<nav class="system-events" aria-label="Related events">${events.map(event => {
    const label = `${event.date}: ${event.label}`;
    return `<a class="system-event" data-event="${escape(event.id)}" href="${routeFor('events', event.id)}" aria-label="${escape(label)}" title="${escape(label)}"><span class="system-event-dot" aria-hidden="true"></span><span class="system-event-label"><span class="system-event-date">${escape(event.date)}</span><span>${escape(event.label)}</span></span></a>`;
  }).join('')}</nav>` : ''}`;
}

export function systemAnalysis(item, citationLinks, related, routeFor, topics = '', questions = []) {
  const field = (label,key) => {
    const refs = item.sourceRefs.filter(ref => ref.supports.split(',').map(x => x.trim()).includes(key));
    const citations = refs.map(ref => `<a class="citation" href="${routeFor('controlRelationships',item.id,ref.sourceId)}" aria-label="Show source for ${label.toLowerCase()}">[${item.sourceIds.indexOf(ref.sourceId)+1}]</a>`).join(' ');
    return `<div class="system-fact" data-system-field="${key}"><dt>${label}</dt><dd>${escape(item[key])} ${citations}</dd></div>`;
  };
  return `<h2 id="analysis-title" tabindex="-1">${escape(item.title)}</h2><section class="system-response" aria-label="Roles and response"><dl class="system-response-roles">${field('Team or operator','controller')}${field('Activity under their control','controlledProcess')}</dl><dl class="system-response-actions">${field('Action or setting','controlAction')}${field('Information and feedback','feedback')}</dl><dl class="system-response-context">${field('Understanding at the time','understanding')}${field('Operating context','context')}</dl></section>${topics}<section class="system-objective"><h3>Proposed requirement</h3><p>${escape(item.requiredConstraint)}</p></section><section class="system-request"><h3>Question for ${escape(item.informationHolder)}</h3><p>${escape(item.informationNeeded)}</p><div class="system-request-links">${item.questionIds.map(id => questions.find(question => question.id === id)).filter(Boolean).map(question => `<a href="${routeFor('questions',question.id)}">${escape(question.title)}</a>`).join('')}</div></section>${topics ? '' : related('controls',item.controlIds,'Safeguards and possible changes')}`;
}
