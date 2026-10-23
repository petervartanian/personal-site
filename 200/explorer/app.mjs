import { views, readRoute, routeFor, selectSourceRef } from './state.mjs';
import { setupCredit } from './credit.mjs';

setupCredit();

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const stateNames = { held: 'Access blocked', failed: 'Failed', absent: 'Missing', disabled: 'Switched off', unknown: 'Unknown' };
const controlOutcomes = {
  'production-safeguards': 'Omitted or weakened',
  'evaluation-isolation': 'Boundary bypassed',
  'application-authentication': 'Authentication missing',
  'modal-isolation': 'Container boundary intact',
  'pod-admission': 'Restrictions missing',
  'critical-alerting': 'No responder alert',
  'hub-database-boundary': 'Database access blocked',
};
const organizationMarks = { OpenAI: 'openai.png', 'Hugging Face': 'hugging-face.svg', Modal: 'modal.svg' };
const organizationName = name => `<span class="organization-name">${organizationMarks[name] ? `<img src="assets/${organizationMarks[name]}" class="organization-logo" width="22" height="22" alt="">` : ''}${escape(name)}</span>`;
const icons = {
  access: '<path d="M13 3h6v18h-6M3 12h11m-4-4 4 4-4 4"/>',
  network: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v9h9M9 6h9v9"/>',
  boundary: '<rect x="3" y="3" width="7" height="18" rx="1"/><path d="M14 3h7v18h-7M7 12h10m-3-3 3 3-3 3"/>',
  agents: '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="m10 8-3 7m7-7 3 7M8 18h8"/>',
  oversight: '<path d="M3 21V4h11l-2 4 2 4H3M16 17l2 2 4-5"/>',
  shield: '<path d="m12 3 8 3v5c0 5-3 8-8 10-5-2-8-5-8-10V6z"/>',
  cooperation: '<path d="m3 8 5-4 4 3 4-3 5 4-3 8-6 4-6-4zM8 4l-2 6 5 3 4-4m-4 4 5 4"/>',
  test: '<path d="M8 3h8M9 3v6l-5 9c-1 2 0 3 2 3h12c2 0 3-1 2-3l-5-9V3M7 15h10"/>',
  border: '<path d="M12 2v3m0 3v3m0 3v3m0 3v2M2 8h7M6 5l3 3-3 3m16 5h-7m3-3-3 3 3 3"/>',
  infrastructure: '<path d="M4 21V8h6v13M10 21V3h10v18M2 21h20M14 7h2m-2 4h2m-2 4h2M6 12h2m-2 4h2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/>',
  report: '<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8m-8 4h6"/>',
  decision: '<circle cx="12" cy="12" r="9"/><path d="m15 7-2 6-6 4 2-6z"/>',
  request: '<path d="M5 3h14v18H5zM8 7h8m-8 5h5m-5 5h8"/>',
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4M16 4a3 3 0 0 1 0 6m2 3a6 6 0 0 1 3 5v3"/>',
  held: '<path d="m5 12 4 4L19 6"/>',
  failed: '<path d="m6 6 12 12M18 6 6 18"/>',
  disabled: '<path d="M12 3v9m-6-6a8 8 0 1 0 12 0"/>',
  absent: '<circle cx="12" cy="12" r="8"/>',
  unknown: '<path d="M8 8a4 4 0 0 1 8 0c0 3-4 3-4 6m0 4v1"/>',
};
const questionIcons = {
  'response-authority': 'oversight', 'cross-organization-response': 'cooperation',
  'control-effectiveness': 'test', 'agent-motivation': 'agents',
  'infrastructure-dependencies': 'infrastructure', 'incident-reporting': 'report',
  'forensic-tools': 'test',
};
const causeIcons = { 'boundary-crossing': 'network', 'data-to-execution': 'boundary', 'collective-goals': 'agents', 'response-escalation': 'oversight' };
const phaseIcons = { Access: 'access', Intrusion: 'network', Response: 'shield', Assessment: 'report' };
const icon = name => `<svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.report}</svg>`;
const $ = id => document.getElementById(id);
const remembered = {};
const rememberedSources = {};
let data;
let current;
let previous;

const link = (view, item, text, attrs = '') => `<a href="${routeFor(view, item.id)}" ${attrs}>${text}</a>`;
const stateLabel = item => `<span class="state state-${escape(item.state)}">${icon(item.state)}${escape(controlOutcomes[item.id] || stateNames[item.state])}</span>`;
const sourceDate = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

function itemSelection(view, item) {
  const active = item.id === current.itemId;
  if (view === 'events') return `<li>${link(view, item, `<time>${escape(item.date)}</time><span class="event-dot" aria-hidden="true"></span><span class="event-label">${escape(item.label)}</span>`, `class="event-button" aria-current="${active}"`)}</li>`;
  const symbol = view === 'questions' ? questionIcons[item.id] : view === 'causes' ? causeIcons[item.id] : 'shield';
  const label = view === 'questions' ? item.topic : item.title;
  return `<li>${link(view, item, `<span class="choice-symbol">${icon(symbol)}</span><span class="choice-label"><span class="choice-title">${escape(label)}</span>${view === 'controls' ? stateLabel(item) : ''}</span>`, `aria-current="${active}" ${view === 'questions' ? `aria-label="${escape(item.topic)}: ${escape(item.title)}"` : ''}`)}</li>`;
}

function inquiryField(name, symbol, text, className = '', supportingText = '') {
  return `<div class="inquiry-field ${className}"><dt>${icon(symbol)}${name}</dt><dd>${escape(text)}${supportingText ? `<p class="field-reason">${escape(supportingText)}</p>` : ''}</dd></div>`;
}

function mitigationType(item) {
  const taxonomy = data.mitigationTaxonomy;
  const category = taxonomy.categories[item.classification.code];
  return `<div class="taxonomy-field"><span class="taxonomy-field-label">Suggested MIT category</span><a class="taxonomy-link" href="${escape(category.sourceUrl)}" target="_blank" rel="noopener noreferrer" title="${escape(taxonomy.title)}, ${escape(taxonomy.version)}"><span class="taxonomy-code">${escape(item.classification.code)}</span>${escape(category.name)}<span class="visually-hidden"> in ${escape(taxonomy.title)} (opens in a new tab)</span></a><span class="taxonomy-version">${escape(taxonomy.version)} draft</span></div>`;
}

function renderSelection() {
  const definition = views.find(v => v.id === current.view);
  if (current.view === 'events') {
    $('selection').innerHTML = `<div class="chronology"><h2 class="selection-heading">Chronology <span class="date-span">July 8–27</span></h2><ol class="event-list" style="--event-count:${data.events.length}" aria-label="Select an event">${data.events.map(i => itemSelection('events', i)).join('')}</ol></div>`;
  } else {
    $('selection').innerHTML = `<div class="choice-section"><h2 class="visually-hidden">${definition.selectionLabel}</h2><ul class="choice-list ${current.view}" aria-label="${definition.selectionLabel}">${data[current.view].map(i => itemSelection(current.view, i)).join('')}</ul></div>`;
  }
}

function related(view, ids, title) {
  if (!ids?.length) return '';
  return `<section class="analysis-section"><h3>${title}</h3><ul class="related-list">${ids.map(id => {
    const item = data[view].find(x => x.id === id);
    return `<li>${link(view, item, `${view === 'events' ? `<span class="relation-date">${escape(item.date)}</span>` : ''}<span class="relation-title">${escape(item.title || item.label)}</span>${view === 'controls' ? stateLabel(item) : ''}`)}</li>`;
  }).join('')}</ul></section>`;
}

function citationLinks(item) {
  return item.sourceIds.map((id, index) => `<a href="${routeFor(current.view, item.id, id)}" class="citation" aria-label="Show source ${index + 1}: ${escape(data.sources.find(s => s.id === id).publisher)}">[${index + 1}]</a>`).join(' ');
}

function mechanism(item) {
  if (item.id === 'data-to-execution') return `<figure class="mechanism" aria-labelledby="mechanism-heading"><h3 id="mechanism-heading">Two routes through dataset processing</h3><div class="mechanism-rows"><div class="mechanism-input">Malicious dataset content</div><div class="mechanism-route">File-read technique</div><div class="mechanism-output">Worker files and credentials exposed</div><div class="mechanism-route">Template injection</div><div class="mechanism-output">Commands run in a production worker</div></div></figure>`;
  if (item.id === 'boundary-crossing') return `<div class="system-trail" role="img" aria-label="The agents reached the internet from the evaluation environment through the package service."><span>Evaluation environment</span><span>Package service</span><span>Internet access</span></div>`;
  return '';
}

function renderAnalysis(item) {
  const context = current.view === 'events' ? `<span>${escape(item.date)}, 2026</span><span class="phase-label">${icon(phaseIcons[item.phase])}${escape(item.phase)}</span>` : current.view === 'controls' ? `${stateLabel(item)}<span class="control-owner">Owner: ${organizationName(item.owner)}</span>` : current.view === 'causes' && item.kind === 'Interpretation' ? 'Interpretation' : '';
  let body = `<div class="detail-context">${context}</div><h2 id="analysis-title" tabindex="-1">${escape(item.label || item.title)}</h2>`;
  if (current.view === 'questions') {
    body += `<p class="detail-summary">${escape(item.context)}</p><dl class="inquiry-fields">${inquiryField('Decision', 'decision', item.decision, 'field-decision', item.whyItMatters)}${inquiryField('Information to request', 'request', item.informationNeeded, 'field-request')}${inquiryField('Who to ask', 'people', item.informationHolder, 'field-holder')}</dl>`;
  } else {
    body += `<p class="detail-summary">${escape(item.summary)} <span class="inline-citations">${citationLinks(item)}</span></p>`;
  }
  if (current.view === 'events') {
    body += `<section class="analysis-section"><h3>Organizations and systems</h3><ul class="actor-list">${item.actors.map(a => `<li>${organizationName(a)}</li>`).join('')}</ul></section>`;
    const causes = data.causes.filter(c => c.eventIds.includes(item.id));
    body += related('causes', causes.map(c => c.id), 'How this happened');
    body += `<div class="related-columns">${related('controls', item.controlIds, 'Safeguards')}${related('questions', item.questionIds, 'Questions to investigate')}</div>`;
  } else if (current.view === 'causes') {
    body += mechanism(item);
    if (item.alternative) body += `<section class="alternative"><h3>Another account</h3><p>${escape(item.alternative)}</p></section>`;
    body += related('events', item.eventIds, 'In the chronology');
    body += `<div class="related-columns">${related('controls', item.controlIds, 'Related safeguards')}${related('questions', item.questionIds, 'Questions to investigate')}</div>`;
  } else if (current.view === 'controls') {
    body += mitigationType(item);
    body += `<dl class="inquiry-fields">${inquiryField('Decision', 'decision', item.decision, 'field-decision')}${inquiryField('Option to evaluate', 'shield', item.option, 'field-request')}${inquiryField('What to verify', 'test', item.verification, 'field-holder')}</dl>`;
    body += `<div class="related-columns">${related('events', item.eventIds, 'In the chronology')}${related('questions', item.questionIds, 'Questions to investigate')}</div>`;
  } else {
    if (item.reportingFrameworkId) body += `<p class="reporting-reference">Reporting reference: <a href="${escape(data.reportingFramework.url)}" target="_blank" rel="noopener noreferrer">OECD framework, February 2025<span class="visually-hidden"> (opens in a new tab)</span></a></p>`;
    body += `<div class="related-columns">${related('events', item.eventIds, 'Relevant events')}${related('controls', item.controlIds, 'Related safeguards')}</div>`;
  }
  const sourcePanel = $('sources');
  document.querySelector('.reading-layout').append(sourcePanel);
  $('analysis').innerHTML = body;
  if (matchMedia('(max-width:760px)').matches) {
    const related = $('analysis').querySelector('.analysis-section, .related-columns');
    if (related) related.before(sourcePanel);
    else $('analysis').append(sourcePanel);
  }
}

function renderSources(item) {
  const source = data.sources.find(s => s.id === current.sourceId);
  const ref = selectSourceRef(item, source.id);
  const options = item.sourceIds.length > 1 ? `<div class="source-options" aria-label="Choose a source">${item.sourceIds.map((id, i) => {
    const s = data.sources.find(s => s.id === id);
    return `<a href="${routeFor(current.view, item.id, id)}" class="source-option" aria-current="${id === current.sourceId}">${i + 1}. ${organizationName(s.publisher)}</a>`;
  }).join('')}</div>` : '';
  $('sources').innerHTML = `<div class="sources-heading"><h2 id="sources-title" tabindex="-1">${current.view === 'questions' ? 'Relevant sources' : 'Sources'}</h2><span class="source-count">${item.sourceIds.indexOf(source.id) + 1} of ${item.sourceIds.length}</span></div>${options}<div class="source-publisher">${organizationName(source.publisher)}<time datetime="${escape(source.date)}">${sourceDate(source.date)}</time></div><h3 class="source-title">${escape(source.title)}</h3><p class="source-kind">${escape(source.kind)}</p>${ref.account ? `<div class="source-account"><h3>${item.kind === 'Interpretation' ? 'Assessment in this source' : 'Account in this source'}</h3><p>${escape(ref.account)}</p></div>` : ''}${ref.excerpt ? `<blockquote>“${escape(ref.excerpt)}”</blockquote>` : ''}<div class="source-locator"><strong>Where to look</strong>${escape(ref.locator || source.locator)}</div><a href="${escape(source.url)}" class="source-link" target="_blank" rel="noopener noreferrer">Read the source<span class="visually-hidden"> (opens in a new tab)</span></a>`;
}

function render({ focus = false, destination = null } = {}) {
  current = readRoute(location.hash, data, remembered);
  document.body.dataset.view = current.view;
  remembered[current.view] = current.itemId;
  rememberedSources[`${current.view}/${current.itemId}`] = current.sourceId;
  const item = data[current.view].find(i => i.id === current.itemId);
  const onlySourceChanged = previous && previous.view === current.view && previous.itemId === current.itemId && previous.sourceId !== current.sourceId;
  const stableHash = routeFor(current.view, current.itemId, current.sourceId);
  if (location.hash !== stableHash) history.replaceState(null, '', stableHash);
  $('question-navigation').innerHTML = views.map(v => `<a data-view="${v.id}" href="${routeFor(v.id, remembered[v.id], rememberedSources[`${v.id}/${remembered[v.id]}`])}" ${v.id === current.view ? 'aria-current="page"' : ''}>${v.label}</a>`).join('');
  if (!onlySourceChanged) {
    const oldScroll = document.querySelector('.event-list')?.scrollLeft || 0;
    renderSelection();
    renderAnalysis(item);
    const list = document.querySelector('.event-list');
    if (list) {
      list.scrollLeft = oldScroll;
      const selected = list.querySelector('[aria-current=true]');
      if (selected) {
        const left = selected.offsetLeft - list.offsetLeft;
        if (left < list.scrollLeft || left + selected.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = Math.max(0, left - 12);
      }
    }
  }
  renderSources(item);
  document.title = `${item.label || item.title} | AI Incident Explorer`;
  $('status').textContent = `${views.find(v => v.id === current.view).label} ${item.label || item.title}${onlySourceChanged ? `. ${data.sources.find(s => s.id === current.sourceId).publisher} source selected.` : ''}`;
  if (focus) (onlySourceChanged ? $('sources-title') : $('analysis-title')).focus({ preventScroll: true });
  if (destination) $(destination).scrollIntoView({ block: 'nearest', behavior: 'instant' });
  previous = { ...current };
}

let keyboardNavigation = false;
let destination = null;
document.addEventListener('keydown', event => { keyboardNavigation = event.key === 'Enter'; });
document.addEventListener('pointerdown', () => { keyboardNavigation = false; });
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href^="#/"]');
  if (!anchor) return;
  destination = anchor.matches('.citation') ? 'sources-title' : anchor.closest('.related-list') ? 'analysis-title' : null;
});
window.addEventListener('hashchange', () => {
  if (data && location.hash !== '#investigation') render({ focus: keyboardNavigation, destination });
  keyboardNavigation = false;
  destination = null;
});
matchMedia('(max-width:760px)').addEventListener('change', () => { if (data) render(); });

try {
  const response = await fetch(new URL('./case-data.json', import.meta.url));
  if (!response.ok) throw new Error('Case data could not be loaded');
  data = await response.json();
  render();
} catch (error) {
  $('analysis').innerHTML = '<p class="error">The investigation could not be loaded. Please reload the page.</p>';
  console.error(error);
}
