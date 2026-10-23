const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function systemSelection(data, current, routeFor) {
  const selected = data.controlRelationships.find(r => r.id === current.itemId) || data.controlRelationships.find(r => r.causeIds.includes(current.itemId)) || data.controlRelationships[0];
  const unknown = selected.feedback.endsWith('?');
  const systemLink = (id,label,classes='') => `<a class="system-place-link ${classes}" data-relationship="${id}" href="${routeFor('controlRelationships',id)}" ${id === selected.id ? 'aria-current="true"' : ''}>${label}</a>`;
  return `<section class="system-selection" aria-label="Control relationships"><div class="system-heading"><h2>Intrusion route</h2><a href="https://psas.scripts.mit.edu/home/books-and-handbooks/" target="_blank" rel="noopener noreferrer" class="method-link">CAST method<span class="visually-hidden"> (opens in a new tab)</span></a></div>
  <nav class="system-overview" aria-label="Systems along the intrusion route; select a system to examine its control and feedback">
    <div class="system-place">${systemLink('evaluation-control','<strong>OpenAI</strong><span>Evaluation environment</span>')}</div>
    <span class="system-route-edge" aria-label="Outbound access through Artifactory"><span>Via Artifactory</span></span>
    <div class="hosted-system">${systemLink('application-control','<strong>Public customer application</strong><span>Code execution</span>','application-link')}${systemLink('platform-control','Hosted on Modal<span>Platform isolation</span>','platform-link')}</div>
    <span class="system-route-edge" aria-label="Requests from the customer application to Hugging Face services"><span>Launchpad</span></span>
    <div class="system-place">${systemLink('hugging-face-control','<strong>Hugging Face</strong><span>Dataset processing</span>')}</div>
  </nav>
  <figure class="control-loop-diagram" aria-label="Controller: ${escape(selected.controller)}. Controlled process: ${escape(selected.controlledProcess)}. ${unknown ? 'Feedback needs to be established.' : 'Feedback from the process.'}"><div class="controller-node">${escape(selected.controller)}</div><div class="loop-connections" aria-hidden="true"><span class="action-direction">Control action</span><span class="feedback-direction ${unknown ? 'feedback-unknown' : ''}">${unknown ? 'Feedback to establish' : 'Feedback'}</span></div><div class="process-node">${escape(selected.controlledProcess)}</div></figure></section>`;
}

export function systemAnalysis(item, citationLinks, related, routeFor) {
  const field = (label,key) => {
    const refs = item.sourceRefs.filter(ref => ref.supports.split(',').map(x => x.trim()).includes(key));
    const citations = refs.map(ref => `<a class="citation" href="${routeFor('controlRelationships',item.id,ref.sourceId)}" aria-label="Show source for ${label.toLowerCase()}">[${item.sourceIds.indexOf(ref.sourceId)+1}]</a>`).join(' ');
    return `<div class="system-fact"><dt>${label}</dt><dd>${escape(item[key])} ${citations}</dd></div>`;
  };
  return `<h2 id="analysis-title" tabindex="-1">${escape(item.title)}</h2><p class="detail-summary">${escape(item.summary)} <span class="inline-citations">${citationLinks(item, 'summary')}</span></p><dl class="system-facts">${field('Control or intervention','controlAction')}${field('Information and feedback','feedback')}${field('Understanding at the time','understanding')}${field('Operating context','context')}</dl><section class="system-objective"><h3>Safety objective to assess</h3><p>${escape(item.requiredConstraint)}</p></section><section class="system-request"><h3>Question for ${escape(item.informationHolder)}</h3><p>${escape(item.informationNeeded)}</p><div class="system-request-links">${item.questionIds.map(id => `<a href="${routeFor('questions',id)}">${escape(id === 'hf-escalation' ? 'Alert escalation' : id === 'response-authority' ? 'Stop and restart authority' : id === 'control-effectiveness' ? 'Safeguard testing' : id === 'cross-organization-response' ? 'Provider cooperation' : 'Forensic tools')}</a>`).join('')}</div></section>${related('causes',item.causeIds,'Contributing factors')}<div class="related-columns">${related('controls',item.controlIds,'Safeguards and possible changes')}${related('events',item.eventIds,'Relevant events')}</div>`;
}
