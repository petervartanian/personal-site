const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function systemSelection(data, current, routeFor) {
  const item = data[current.view]?.find(entry => entry.id === current.itemId);
  const selectedRelationship = current.view === 'controlRelationships' ? item : null;
  const relatedIds = new Set(selectedRelationship ? [item.id] : item?.relationshipIds || (current.view === 'controls' ? data.controlRelationships.filter(entry => entry.controlIds.includes(item.id)).map(entry => entry.id) : current.view === 'questions' ? data.controlRelationships.filter(entry => entry.questionIds.includes(item.id)).map(entry => entry.id) : []));
  const active = (view, id) => current.view === view && current.itemId === id;
  const currentAttr = (view, id) => active(view, id) ? ' aria-current="true"' : '';
  const relationship = id => data.controlRelationships.find(entry => entry.id === id);
    const marks = {
    'evaluation-control': '<img src="assets/openai.png" width="20" height="20" alt="">',
    'application-control': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18m-9 3-3 3 3 3m3-6 3 3-3 3"/></svg>',
    'platform-control': '<img src="assets/modal.svg" width="20" height="20" alt="">',
    'hugging-face-control': '<img src="assets/hugging-face.svg" width="20" height="20" alt="">',
  };
  const actor = (id, name, role) => `<a class="model-actor${relatedIds.has(id) ? ' related-system' : ''}" data-relationship="${id}" href="${routeFor('controlRelationships', id)}" aria-label="${escape(`${name}: ${role}. ${relationship(id).title}`)}"${currentAttr('controlRelationships', id)}><span class="model-mark" aria-hidden="true">${marks[id]}</span><span><strong>${escape(name)}</strong><span>${escape(role)}</span></span></a>`;
  const edge = (id, field, text, kind, targetView, targetId) => {
    const target = relationship(id);
    const selected = active('controlRelationships', id) && current.claim === field;
    return `<a class="model-loop-edge ${kind}${selected ? ' is-highlighted' : ''}" data-connection="${id}-${field}" href="${routeFor('controlRelationships', id, undefined, undefined, {claim: field})}" aria-label="${escape(`${text}: ${target.title}`)}"${selected ? ' aria-current="true"' : ''}><span>${escape(text)}</span></a>`;
  };
  const process = (relationshipId, view, id, text) => `<a class="model-process${relatedIds.has(relationshipId) ? ' related-system' : ''}" data-process="${relationshipId}" href="${routeFor(view, id, undefined, 'all-connections')}"${currentAttr(view, id)}>${escape(text)}</a>`;
  const access = (id, text, eventIds, className) => `<a class="model-access ${className}${active('framework', id) || (current.view === 'events' && eventIds.includes(current.itemId)) ? ' is-highlighted' : ''}" data-connection="${id}" href="${routeFor('framework', id)}"${currentAttr('framework', id)}><span>${escape(text)}</span></a>`;
  const supplementary = (view, id, text, className, mark = '') => `<a class="model-supplement ${className}" href="${routeFor(view, id)}"${currentAttr(view, id)}>${mark}<span>${escape(text)}</span></a>`;
  return `<section class="unified-model" aria-labelledby="model-heading">
    <div class="model-heading"><h2 id="model-heading"><a href="${routeFor('framework', 'all-connections')}">Systems and response</a></h2><span class="model-key"><span class="key-access">Access</span><span class="key-control">Control</span><span class="key-information">Information</span></span></div>
    <div class="unified-model-scroll" role="region" aria-label="Systems and their control relationships" tabindex="0">
      <div class="model-grid">
        <a class="model-notification${active('events', 'developer-attribution') ? ' is-highlighted' : ''}" data-connection="notification" href="${routeFor('events', 'developer-attribution', undefined, 'all-connections')}"${currentAttr('events', 'developer-attribution')}><span>July 20: OpenAI notifies Hugging Face</span></a>
        <div class="model-station model-evaluation${relatedIds.has('evaluation-control') ? ' is-highlighted' : ''}">
          ${actor('evaluation-control', 'OpenAI', 'Research and security teams')}
          <div class="model-loop">${edge('evaluation-control', 'controlAction', 'Repairs and restart', 'control', 'questions', 'response-authority')}${edge('evaluation-control', 'feedback', 'Missed warning signs', 'information', 'framework', 'cause-warning-escalation')}</div>
          ${process('evaluation-control', 'framework', 'cause-agent-motives', 'Evaluation agents')}
          ${supplementary('framework', 'capability-agent-coordination', 'Shared message board', 'model-board')}
        </div>
        ${access('cause-isolation-bypass', 'Via package service', ['evaluation-boundary', 'external-launchpad'], 'access-first')}
        <div class="model-station model-application${relatedIds.has('application-control') ? ' is-highlighted' : ''}">
          ${actor('application-control', 'Application operator', 'Customer of Modal')}
          <div class="model-loop">${edge('application-control', 'controlAction', 'Access rules', 'control', 'controls', 'application-authentication')}<a class="model-open-question" href="${routeFor('controlRelationships', 'application-control')}">Monitoring records?</a></div>
          ${process('application-control', 'controlRelationships', 'application-control', 'Public code endpoint')}
          <div class="model-host">${actor('platform-control', 'Modal', 'Hosting and isolation')}</div>
        </div>
        ${access('cause-dataset-processing', 'Requests to workers', ['worker-compromise', 'expanded-access'], 'access-second')}
        <div class="model-station model-hugging-face${relatedIds.has('hugging-face-control') ? ' is-highlighted' : ''}">
          ${actor('hugging-face-control', 'Hugging Face', 'Security and platform teams')}
          <div class="model-loop">${edge('hugging-face-control', 'controlAction', 'Containment', 'control', 'controls', 'dataset-processing-isolation')}${edge('hugging-face-control', 'feedback', 'Alert escalation', 'information', 'questions', 'hf-escalation')}</div>
          ${process('hugging-face-control', 'framework', 'cause-dataset-processing', 'Dataset workers')}
        </div>
      </div>
    </div>
  </section>`;
}

export function systemAnalysis(item, citationLinks, related, routeFor, topics = '', questions = []) {
  const questionFields = item.questionFields || [];
  const field = (label, key) => {
    if (questionFields.includes(key)) return '';
    const citations = citationLinks(item, key, 'controlRelationships');
    return `<div class="system-fact" data-system-field="${key}"><dt>${label}</dt><dd>${escape(item[key])} ${citations}</dd></div>`;
  };
  const decisionLinks = item.questionIds.map(id => questions.find(question => question.id === id)).filter(Boolean).map(question => `<a href="${routeFor('questions',question.id)}">${escape(question.title)}</a>`).join('');
  const openQuestions = questionFields.map(key => `<li data-question-field="${key}">${escape(item[key])}</li>`).join('');
  return `<h2 id="analysis-title" tabindex="-1">${escape(item.title)}</h2><p class="system-role">${escape(item.controller)}: ${escape(item.controlledProcess.charAt(0).toLowerCase() + item.controlledProcess.slice(1))}.</p><section class="system-response" aria-label="Actions and information"><dl class="system-response-actions">${field('Action or setting','controlAction')}${field('Information and feedback','feedback')}</dl><dl class="system-response-context">${field('Understanding at the time','understanding')}${field('Operating context','context')}</dl></section>${openQuestions ? `<section class="system-unknowns"><h3>Unresolved</h3><ul>${openQuestions}</ul></section>` : ''}${topics}${decisionLinks ? `<section class="analysis-section"><h3>Assess the response</h3><nav class="system-decision-links" aria-label="Assess this response">${decisionLinks}</nav></section>` : ''}`;
}
