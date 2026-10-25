import { views, navigationViews, navigationIdFor, causeConceptIds, readRoute, readLocation, caseRouteFor, selectSourceRef } from './state.mjs?v=20261025-reading';
import { libraryMarkup, comparisonMarkup, selectionMarkup } from './catalog.mjs?v=20261025-reading';
import { systemSelection, systemAnalysis } from './system.mjs?v=20261025-reading';
import { frameworkAnalysis, frameworkTopics, safeguardsMatrix } from './framework.mjs?v=20261025-reading';
import { reportingFieldsForQuestion, reportingReferenceMarkup, reportingInventoryMarkup, comparisonForReference } from './reporting.mjs?v=20261025-reading';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const stateNames = { held: 'Worked', failed: 'Failed', absent: 'Absent', disabled: 'Off', unknown: 'Unknown' };
const organizationMarks = { OpenAI: 'openai.png', 'Hugging Face': 'hugging-face.svg', Modal: 'modal.svg' };
const applicationMark = '<svg class="organization-logo application-mark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01m-1 6-2 2 2 2m6-4 2 2-2 2"/></svg>';
const organizationName = name => `<span class="organization-name">${organizationMarks[name] ? `<img src="assets/${organizationMarks[name]}" class="organization-logo" width="22" height="22" alt="">` : name === 'Customer application operator' ? applicationMark : ''}${escape(name)}</span>`;
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
  absent: '<circle cx="12" cy="12" r="8"/><path d="M8 12h8"/>',
  unknown: '<path d="M8 8a4 4 0 0 1 8 0c0 3-4 3-4 6m0 4v1"/>',
};
const questionIcons = {
  'response-authority': 'oversight', 'hf-escalation': 'oversight', 'cross-organization-response': 'cooperation',
  'control-effectiveness': 'test', 'agent-motivation': 'agents',
  'infrastructure-dependencies': 'infrastructure', 'incident-reporting': 'report',
  'forensic-tools': 'test', 'foreign-provider-response': 'globe', 'critical-service-transfer': 'infrastructure',
  'missing-perspectives': 'people',
};
const causeIcons = { 'boundary-crossing': 'network', 'data-to-execution': 'boundary', 'collective-goals': 'agents', 'response-escalation': 'oversight' };
const phaseIcons = { Access: 'access', Intrusion: 'network', Response: 'shield', Assessment: 'report' };
const icon = name => `<svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.report}</svg>`;
const $ = id => document.getElementById(id);
let remembered = {};
const caseMemory = new Map();
const selectedCases = new Set();
let catalog = [];
let screen;
let loadNotice = '';
let data;
let current;
let previous;
const eventOrigins = new Map();

const isOverview = () => current?.view === 'framework' && current.itemId === 'account-overview';
const routeFor = (view, itemId, sourceId, storyId) => {
  if (['events', 'controls', 'questions'].includes(view) && (storyId === 'all-connections' || (storyId === undefined && current && navigationIdFor(current) === 'framework'))) return caseRouteFor(data.case.id, view, itemId, sourceId, 'all-connections');
  if (view === 'causes' && data.framework?.some(i => i.id === causeConceptIds[itemId])) {
    itemId = causeConceptIds[itemId];
    view = 'framework';
  }
  if (view === 'questions') {
    const fieldId = storyId === false ? undefined : storyId || (current?.view === view && current?.itemId === itemId ? current.reportingFieldId : undefined);
    return caseRouteFor(data.case.id, view, itemId, sourceId, fieldId);
  }
  const canHaveContext = view === 'controlRelationships' || (view === 'framework' && itemId !== 'account-overview' && data.framework.find(i => i.id === itemId)?.type !== 'story');
  const contextId = canHaveContext ? storyId : undefined;
  const context = data.framework?.find(story => story.id === contextId && story.type === 'story');
  const belongs = view === 'controlRelationships' ? context?.relationshipIds?.includes(itemId) : context?.conceptIds?.includes(itemId);
  return caseRouteFor(data.case.id, view, itemId, sourceId, belongs ? contextId : undefined);
};
const link = (view, item, text, attrs = '') => `<a href="${routeFor(view, item.id, undefined, current?.storyId === 'all-connections' && ['events','controls','questions'].includes(view) ? 'all-connections' : undefined)}" ${attrs}>${text}</a>`;
const stateLabel = item => `<span class="state state-${escape(item.state)}" title="${escape('Reported performance during the incident: ' + item.summary)}">${icon(item.state)}${escape(stateNames[item.state])}<span class="visually-hidden"> during the incident</span></span>`;
const sourceDate = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

function itemSelection(view, item) {
  const active = item.id === current.itemId;
  if (view === 'events') return `<li>${link(view, item, `<time>${escape(item.date)}</time><span class="event-dot" aria-hidden="true"></span><span class="event-label">${escape(item.label)}</span>`, `class="event-button" aria-current="${active}"`)}</li>`;
  const symbol = view === 'questions' ? questionIcons[item.id] : view === 'causes' ? causeIcons[item.id] : 'shield';
  const label = item.title;
  return `<li>${link(view, item, `${view === 'controls' ? '' : `<span class="choice-symbol">${icon(symbol)}</span>`}<span class="choice-label"><span class="choice-title">${escape(label)}</span></span>${view === 'controls' ? stateLabel(item) : ''}`, `aria-current="${active}" ${view === 'questions' ? `aria-label="${escape(item.title)}"` : ''}`)}</li>`;
}

function inquiryField(name, symbol, text, className = '', supportingText = '') {
  return `<div class="inquiry-field ${className}"><dt>${icon(symbol)}${name}</dt><dd>${escape(text)}${supportingText ? `<p class="field-reason">${escape(supportingText)}</p>` : ''}</dd></div>`;
}

function mitigationType(item) {
  const taxonomy = data.mitigationTaxonomy;
  if (!item.classification || !taxonomy?.categories?.[item.classification.code]) return '';
  const category = taxonomy.categories[item.classification.code];
  return `<div class="taxonomy-field"><span class="taxonomy-field-label">Suggested MIT category</span><a class="taxonomy-link" href="${escape(category.sourceUrl)}" target="_blank" rel="noopener noreferrer" title="${escape(taxonomy.title)}, ${escape(taxonomy.version)}"><span class="taxonomy-code">${escape(item.classification.code)}</span>${escape(category.name)}<span class="visually-hidden"> in ${escape(taxonomy.title)} (opens in a new tab)</span></a><span class="taxonomy-version">${escape(taxonomy.version)} draft</span></div>`;
}

function questionChoices(items, label) {
  return `<ul class="choice-list questions" aria-label="${escape(label)}">${items.map(i => itemSelection('questions', i)).join('')}</ul>`;
}

function renderSelection() {
  const applications = $('application-questions');
  applications.hidden = true;
  applications.innerHTML = '';
  const navigationId = navigationIdFor(current);
  if (navigationId === 'framework') {
    $('selection').innerHTML = systemSelection(data, current, routeFor);
  } else if (navigationId === 'events') {
    const account = data.framework?.find(entry => entry.id === 'account-overview');
    const introduction = isOverview() && account ? `<div class="incident-account"><p>${escape(account.summary)} <span class="inline-citations">${citationLinks(account, 'summary', 'framework')}</span></p></div>` : '';
    const selectedItem = data[current.view]?.find(entry => entry.id === current.itemId);
    const relevantEvents = new Set(selectedItem?.eventIds || (current.view === 'events' ? [current.itemId] : []));
    const chronology = `<div class="chronology unified-chronology"><div class="chronology-heading"><h2 class="selection-heading">Chronology <span class="date-span">${escape(data.case.chronologyRange || data.case.dateRange)}</span></h2></div><ol class="event-list" style="--event-count:${data.events.length}" aria-label="Select an event">${data.events.map(item => `<li><a class="event-button${relevantEvents.has(item.id) ? ' is-related' : ''}" data-event="${escape(item.id)}" href="${caseRouteFor(data.case.id, 'events', item.id)}" aria-current="${current.view === 'events' && item.id === current.itemId}"><time>${escape(item.date)}</time><span class="event-dot" aria-hidden="true"></span><span class="event-label">${escape(item.label)}</span></a></li>`).join('')}</ol><div class="chronology-scroll-controls" hidden><button type="button" data-chronology-scroll="-1" aria-label="Show earlier events">Earlier</button><button type="button" data-chronology-scroll="1" aria-label="Show later events">Later</button></div></div>`;
    $('selection').innerHTML = introduction + chronology;
  } else if (current.view === 'controls') {
    $('selection').innerHTML = safeguardsMatrix(data, current, routeFor, organizationName, stateLabel);
  } else {
    const item = data.questions.find(q => q.id === current.itemId);
    const isApplication = item.scope === 'application';
    const caseQuestions = data.questions.filter(q => q.scope === 'case');
    const applicationQuestions = data.questions.filter(q => q.scope === 'application');
    const items = isApplication ? applicationQuestions : caseQuestions;
    const picker = `<div class="inquiry-picker"><label for="inquiry-picker">Question</label><select id="inquiry-picker">${items.map(q => `<option value="${escape(q.id)}" ${q.id === current.itemId ? 'selected' : ''}>${escape(q.title)}</option>`).join('')}</select></div>`;
    $('selection').innerHTML = `<div class="question-index">${isApplication ? `<a class="context-return" href="${routeFor('questions',caseQuestions[0].id)}">Return to questions about this incident</a><h2 class="application-heading">Apply the findings to another setting</h2>` : ''}${picker}${questionChoices(items, isApplication ? 'Questions for another setting' : 'Questions about this incident')}</div>`;
    if (!isApplication && applicationQuestions.length) {
      applications.hidden = false;
      applications.innerHTML = `<h2>Apply the findings to another setting</h2>${questionChoices(applicationQuestions, 'Questions for another setting')}`;
    }
  }
  document.querySelector('.event-list')?.addEventListener('scroll', updateChronologyControls, { passive: true });
}

function updateChronologyControls() {
  const list = document.querySelector('.event-list');
  const controls = document.querySelector('.chronology-scroll-controls');
  if (!list || !controls) return;
  controls.hidden = list.scrollWidth <= list.clientWidth + 2;
  controls.querySelector('[data-chronology-scroll="-1"]').disabled = list.scrollLeft <= 2;
  controls.querySelector('[data-chronology-scroll="1"]').disabled = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
}

function related(view, ids, title) {
  if (!ids?.length) return '';
  return `<section class="analysis-section"><h3>${title}</h3><ul class="related-list">${ids.map(id => {
    const item = data[view].find(x => x.id === id);
    return `<li>${link(view, item, `${view === 'events' ? `<span class="relation-date">${escape(item.date)}</span>` : ''}<span class="relation-title">${escape(item.title || item.label)}</span>${view === 'controls' ? stateLabel(item) : ''}`)}</li>`;
  }).join('')}</ul></section>`;
}

function citationLinks(item, field = null, view = current.view) {
  const ids = field ? item.sourceIds.filter(id => item.sourceRefs.some(ref => ref.sourceId === id && ref.supports.split(',').map(value => value.trim()).includes(field))) : item.sourceIds;
  return ids.map(id => { const index = item.sourceIds.indexOf(id); return `<a href="${routeFor(view, item.id, id)}" class="citation" aria-label="Show source ${index + 1}: ${escape(data.sources.find(s => s.id === id).publisher)}">[${index + 1}]</a>`; }).join(' ');
}

function mechanism(item) {
  if (['data-to-execution','cause-dataset-processing'].includes(item.id)) return `<figure class="mechanism" aria-labelledby="mechanism-heading"><h3 id="mechanism-heading">Two routes through dataset processing</h3><div class="mechanism-rows"><div class="mechanism-input">Malicious dataset content</div><div class="mechanism-route">File-read technique</div><div class="mechanism-output">Worker files and credentials exposed</div><div class="mechanism-route">Template injection</div><div class="mechanism-output">Commands run in a production worker</div></div></figure>`;
  if (['boundary-crossing','cause-isolation-bypass'].includes(item.id)) return `<div class="system-trail" role="img" aria-label="The agents reached the internet from the evaluation environment through the package service."><span>Evaluation environment</span><span>Package service</span><span>Internet access</span></div>`;
  return '';
}

function renderAnalysis(item) {
  const context = current.view === 'events' ? `<span>${escape(item.date)}</span><span class="phase-label">${icon(phaseIcons[item.phase])}${escape(item.phase)}</span>` : current.view === 'controls' ? `${stateLabel(item)}<span class="control-owner">Owner: ${organizationName(item.owner)}</span>` : current.view === 'causes' && item.kind === 'Interpretation' ? 'Interpretation' : '';
  let body = `<div class="detail-context">${context}</div><h2 id="analysis-title" tabindex="-1">${escape(item.label || item.title)}</h2>`;
  if (current.view === 'events' && !current.storyId && eventOrigins.has(data.case.id)) {
    const origin = eventOrigins.get(data.case.id);
    body = `<a class="context-return" href="${origin.url}">Return to ${escape(origin.title)}</a>` + body;
  }
  const isReporting = current.view === 'questions' && Boolean(current.reportingFieldId);
  document.querySelector('.reading-layout').classList.toggle('is-reporting', isReporting);
  $('sources').hidden = isReporting;
  if (isReporting) {
    body = `<a class="context-return" href="${routeFor('questions', item.id, current.sourceId, false)}">Return to ${escape(item.topic)}</a>` + reportingInventoryMarkup(data.reporting, data, routeFor, { questionId: item.id, fieldId: current.reportingFieldId });
  } else if (isOverview()) {
    body = `<h2 id="analysis-title" tabindex="-1">Reported impact</h2><div class="account-prose"><p>${escape(item.explanation)} <span class="inline-citations">${citationLinks(item, 'explanation')}</span></p></div>`;
  } else if (current.view === 'framework') {
    body = frameworkAnalysis(item, data, citationLinks, routeFor, mechanism, { current });
  } else if (current.view === 'controlRelationships') {
    body = systemAnalysis(item, citationLinks, related, routeFor, frameworkTopics(data, current, routeFor), data.questions);
  } else if (current.view === 'questions') {
    body += `<div class="question-detail"><p class="detail-summary">${escape(item.context)} <span class="inline-citations">${citationLinks(item, 'context')}</span></p><section class="question-records"><h3>Missing information</h3>${item.requestFields?.length ? `<ul class="requested-records">${item.requestFields.map(field => `<li>${escape(field)}</li>`).join('')}</ul>` : `<p>${escape(item.informationNeeded)}</p>`}<p class="question-holder"><strong>Potential sources:</strong> ${escape(item.informationHolder.replace(/[.]+$/, ''))}.</p></section></div>`;
  } else {
    body += `<p class="detail-summary">${escape([item.summary, item.detail || item.explanation].filter(Boolean).join(' '))} <span class="inline-citations">${citationLinks(item)}</span></p>`;
  }
  if (isReporting || current.view === 'framework' || current.view === 'controlRelationships') {
    // The control loop already includes its linked factors, safeguards, and events.
  } else if (current.view === 'events') {
    body += `<section class="analysis-section"><h3>Organizations and systems</h3><ul class="actor-list">${item.actors.map(a => `<li>${escape(a)}</li>`).join('')}</ul></section>`;
    const causes = data.causes.filter(c => c.eventIds.includes(item.id));
    const systems = (item.relationshipIds || []).map(id => data.controlRelationships.find(entry => entry.id === id)).filter(Boolean);
    body += related('controlRelationships', systems.map(r => r.id), 'Control and feedback');
    body += related('causes', causes.map(c => c.id), 'Contributing factors');
    body += `<div class="related-columns">${related('controls', item.controlIds, 'Safeguards')}${related('questions', item.questionIds, 'Questions to investigate')}</div>`;
  } else if (current.view === 'causes') {
    body += mechanism(item);
    const relationships = data.controlRelationships.filter(r => r.causeIds.includes(item.id));
    body += related('controlRelationships', relationships.map(r => r.id), 'Control and feedback');
    if (item.alternative) body += `<section class="alternative"><h3>Another account</h3><p>${escape(item.alternative)}</p></section>`;
    body += related('events', item.eventIds, 'In the chronology');
    body += `<div class="related-columns">${related('controls', item.controlIds, 'Related safeguards')}${related('questions', item.questionIds, 'Questions to investigate')}</div>`;
  } else if (current.view === 'controls') {
    if (item.reportedChange) body += `<section class="reported-change"><h3>Reported change</h3><p>${escape(item.reportedChange.text)} <a class="citation" href="${routeFor('controls',item.id,item.reportedChange.sourceId)}" aria-label="Show source for reported change">[${item.sourceIds.indexOf(item.reportedChange.sourceId) + 1}]</a></p></section>`;
    body += `<dl class="inquiry-fields">${inquiryField('Decision', 'decision', item.decision, 'field-decision')}${inquiryField('Option to evaluate', 'shield', item.option, 'field-request', item.implication)}${inquiryField('What to verify', 'test', item.verification, 'field-holder')}</dl>`;
    body += mitigationType(item);
    body += `<div class="related-columns">${related('events', item.eventIds, 'In the chronology')}${related('questions', item.questionIds, 'Questions to investigate')}</div>`;
  } else {
    const fields = reportingFieldsForQuestion(data.reporting, item.id);
    if (fields.length) {
      const reportingHref = routeFor('questions', item.id, current.sourceId, fields[0].id);
      body += `<div class="question-tools">${reportingReferenceMarkup(data.reporting, item.id, reportingHref)}`;
    } else {
      body += '<div class="question-tools">';
    }
    for (const comparison of data.reporting?.comparisons || []) {
      if (comparison.questionId === item.id) body += `<a class="reporting-inventory-link legal-comparison-link" href="${routeFor('questions',item.id,current.sourceId,comparison.id)}">EU reporting requirements</a>`;
    }
    body += '</div>';
    body += `<div class="related-columns">${related('events', item.eventIds, 'Relevant events')}${related('controls', item.controlIds, 'Related safeguards')}</div>`;
  }
  const sourcePanel = $('sources');
  document.querySelector('.reading-layout').append(sourcePanel);
  $('analysis').innerHTML = body;
  if (!isReporting && matchMedia('(max-width:760px)').matches) {
    const related = $('analysis').querySelector('.framework-topics, .analysis-section, .related-columns');
    if (related) related.before(sourcePanel);
    else $('analysis').append(sourcePanel);
  }
}

function renderSources(item) {
  const source = data.sources.find(s => s.id === current.sourceId);
  const ref = selectSourceRef(item, source.id);
  const options = item.sourceIds.length > 1 ? `<label class="visually-hidden" for="source-picker">Choose a source</label><select id="source-picker">${item.sourceIds.map((id, i) => {
    const s = data.sources.find(s => s.id === id);
    return `<option value="${escape(id)}"${id === current.sourceId ? ' selected' : ''}>${i + 1}. ${escape(s.publisher)}${item.sourceIds.filter(other => data.sources.find(entry => entry.id === other).publisher === s.publisher).length > 1 ? `, ${escape(sourceDate(s.date).replace(', 2026',''))}` : ''}</option>`;
  }).join('')}</select>` : '';
  const passages = ref.passages?.length ? ref.passages : [{ label: 'Read the source', url: source.url }];
  const passageLinks = passages.map(passage => `<a href="${escape(passage.url)}" class="source-link" target="_blank" rel="noopener noreferrer">${escape(passage.label)}<span class="visually-hidden"> (opens in a new tab)</span></a>`).join('');
  $('sources').innerHTML = `<div class="sources-heading"><h2 id="sources-title" tabindex="-1">Sources</h2></div>${options}<div class="source-publisher"><span>${escape(source.publisher)}</span><time datetime="${escape(source.date)}">${sourceDate(source.date)}</time></div><h3 class="source-title">${escape(source.title)}</h3><p class="source-kind">${escape(source.kind)}</p>${source.scope ? `<p class="source-scope">${escape(source.scope)}</p>` : ''}${ref.account ? `<div class="source-account"><p>${escape(ref.account)}</p></div>` : ''}${ref.excerpt ? `<blockquote>“${escape(ref.excerpt)}”</blockquote>` : ''}<div class="source-locator">${escape(ref.locator || source.locator)}</div><div class="source-passages">${passageLinks}</div>`;
}

function render({ focus = false, destination = null } = {}) {
  const viewport = { left: window.scrollX, top: window.scrollY };
  const activeLink = document.activeElement?.closest('a[href]');
  const focusHref = activeLink?.getAttribute('href');
  const focusView = activeLink?.dataset.view;
  const restoreReportingFocus = ['reporting-field-select','reporting-stage-select'].includes(document.activeElement?.id) ? document.activeElement.id : null;
  const restoreInquiryFocus = document.activeElement?.id === 'inquiry-picker';
  const restoreSourceFocus = document.activeElement?.id === 'source-picker';
  const locationState = readLocation(location.hash, catalog);
  const lastScreen = screen;
  screen = locationState.screen;
  const isCase = screen === 'case';
  $('case-library').hidden = isCase;
  $('case-workspace').hidden = !isCase;
  if (!isCase) {
    document.body.dataset.view = 'library';
    if (screen === 'compare') locationState.caseIds.forEach(id => selectedCases.add(id));
    $('case-library').innerHTML = screen === 'compare' ? comparisonMarkup(catalog, locationState.caseIds) : libraryMarkup(catalog, selectedCases);
    if (loadNotice) $('case-library').insertAdjacentHTML('beforeend', loadNotice);
    document.title = screen === 'compare' ? 'Compare incidents | AI Incident Explorer' : 'AI Incident Explorer';
    $('status').textContent = screen === 'compare' ? 'Incident comparison' : 'Choose an incident';
    previous = null;
    if (lastScreen !== screen) window.scrollTo({top:0,behavior:'instant'});
    if (focus) $('case-library').querySelector('h1').focus({preventScroll:true});
    return;
  }
  const switchedCase = data?.case.id !== locationState.caseId;
  const preserveViewport = !switchedCase && lastScreen === 'case' && !destination;
  data = catalog.find(d => d.case.id === locationState.caseId);
  if (switchedCase || lastScreen !== screen) {
    previous = null;
    $('case-title').textContent = data.case.title;
    document.querySelector('.case-switcher>a').textContent = catalog.length === 1 ? 'Overview' : 'All incidents';
    document.querySelector('.case-context').textContent = data.case.dateLabel || data.case.dateRange;
    document.querySelector('.case-summary').textContent = data.case.catalogSummary || data.case.summary;
    $('case-outcome').innerHTML = `<p>${escape(data.case.reportedOutcome)}</p><a href="${caseRouteFor(data.case.id,'events','impact-assessment')}">Examine the impact</a>`;
    const number = document.querySelector('.incident-number');
    number.hidden = !data.case.incidentId;
    number.textContent = '#' + data.case.incidentId;
    number.href = 'https://incidentdatabase.ai/cite/' + data.case.incidentId;
    number.setAttribute('aria-label', 'Incident ' + data.case.incidentId + ' in the AI Incident Database');
    $('case-picker').hidden = catalog.length < 2;
    document.querySelector('label[for="case-picker"]').hidden = catalog.length < 2;
    $('case-picker').innerHTML = catalog.map(d => `<option value="${escape(d.case.id)}" ${d.case.id === data.case.id ? 'selected' : ''}>${escape(d.case.title)}</option>`).join('');
    window.scrollTo({top:0,behavior:'instant'});
  }
  if (!caseMemory.has(data.case.id)) caseMemory.set(data.case.id, {});
  remembered = caseMemory.get(data.case.id);
  current = readRoute(locationState.hash, data, remembered);
  document.body.dataset.view = isOverview() ? 'overview' : current.view === 'controlRelationships' ? 'causes' : current.view;
  if (!isOverview()) remembered[current.view] = current.itemId;
  remembered.navigation ||= {};
  remembered.navigation[navigationIdFor(current)] = { ...current };
  const item = data[current.view].find(i => i.id === current.itemId);
  const onlySourceChanged = previous && previous.view === current.view && previous.itemId === current.itemId && previous.storyId === current.storyId && previous.reportingFieldId === current.reportingFieldId && previous.sourceId !== current.sourceId;
  const stableHash = routeFor(current.view, current.itemId, current.sourceId);
  if (location.hash !== stableHash) history.replaceState(null, '', stableHash);
  const navigationId = navigationIdFor(current);
  document.body.dataset.navigation = navigationId;
  $('investigation').prepend($('selection'));
  $('question-navigation').innerHTML = navigationViews.filter(v => data[v.id]?.length).map(v => {
    const overview = v.id === 'events' && data.framework?.some(entry => entry.id === 'account-overview');
    const selected = remembered.navigation[v.id] || {
      view: overview ? 'framework' : v.id,
      itemId: overview ? 'account-overview' : v.id === 'framework' ? 'all-connections' : data[v.id][0].id,
    };
    const target = caseRouteFor(data.case.id, selected.view, selected.itemId, selected.sourceId, selected.storyId || selected.reportingFieldId);
    return `<a data-view="${v.id}" href="${target}" ${v.id === navigationId ? 'aria-current="page"' : ''}>${v.label}</a>`;
  }).join('');
  if (!onlySourceChanged) {
    const oldScroll = document.querySelector('.event-list')?.scrollLeft || 0;
    const oldMapScroll = document.querySelector('.unified-model-scroll')?.scrollLeft || 0;
    const frameworkScroll = [...document.querySelectorAll('.story-choices,.concept-choices')].map(el=>el.scrollLeft);
    renderSelection();
    renderAnalysis(item);
    document.querySelectorAll('.story-choices,.concept-choices').forEach((el,index)=>{
      el.scrollLeft = frameworkScroll[index] || 0;
      const active = el.querySelector('[aria-current=true]');
      if (active) {
        const itemRect = active.getBoundingClientRect(), containerRect = el.getBoundingClientRect();
        if (itemRect.left < containerRect.left || itemRect.right > containerRect.right) el.scrollLeft += itemRect.left - containerRect.left - 4;
      }
    });
    const list = document.querySelector('.event-list');
    if (list) {
      list.scrollLeft = oldScroll;
      const selected = list.querySelector('[aria-current=true]');
      if (selected) {
        const left = selected.offsetLeft - list.offsetLeft;
        if (left < list.scrollLeft || left + selected.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = Math.max(0, left - 12);
      }
    }
    const map = document.querySelector('.unified-model-scroll');
    if (map) {
      map.scrollLeft = oldMapScroll;
      const active = map.querySelector('[aria-current=true]');
      if (active) {
        const rect = active.getBoundingClientRect();
        const bounds = map.getBoundingClientRect();
        if (rect.left < bounds.left || rect.right > bounds.right) map.scrollLeft += rect.left - bounds.left - 5;
      }
    }
  }
  updateChronologyControls();
  if (!current.reportingFieldId) renderSources(item);
  const selectedReportingField = current.reportingFieldId ? data.reporting.fields.find(field => field.id === current.reportingFieldId) : null;
  const selectedComparison = comparisonForReference(data.reporting, current.reportingFieldId, item.id);
  const selectedRequirement = selectedComparison?.requirements.find(row => current.reportingFieldId === `${selectedComparison.id}--${row.id}`);
  document.title = `${selectedRequirement?.title || selectedComparison?.title || selectedReportingField?.label || item.label || item.title} | AI Incident Explorer`;
  $('status').textContent = selectedComparison ? `${selectedComparison.title}${selectedRequirement ? ': ' + selectedRequirement.title : ''}` : selectedReportingField ? `Reporting field ${selectedReportingField.number}: ${selectedReportingField.label}` : `${views.find(v => v.id === navigationId).label} ${item.label || item.title}${onlySourceChanged ? `. ${data.sources.find(s => s.id === current.sourceId).publisher} source selected.` : ''}`;
  if (restoreReportingFocus) $(restoreReportingFocus)?.focus({ preventScroll: true });
  if (restoreInquiryFocus) $('inquiry-picker')?.focus({ preventScroll: true });
  if (restoreSourceFocus) $('source-picker')?.focus({ preventScroll: true });
  if (focus && !restoreInquiryFocus && !restoreReportingFocus && !restoreSourceFocus) {
    const matchingControl = focusView
      ? $('question-navigation').querySelector(`[data-view="${focusView}"]`)
      : [...document.querySelectorAll('a[href]')].find(link => link.getAttribute('href') === focusHref && link.getClientRects().length);
    const target = destination ? $(destination) : matchingControl || (onlySourceChanged && !current.reportingFieldId ? $('sources-title') : $('analysis-title'));
    target?.focus({ preventScroll: true });
  }
  if (destination) $(destination).scrollIntoView({ block: 'start', behavior: 'instant' });
  else if (preserveViewport) window.scrollTo({ ...viewport, behavior: 'instant' });
  previous = { ...current };
}

new ResizeObserver(updateChronologyControls).observe($('investigation'));

let keyboardNavigation = false;
let destination = null;
document.addEventListener('keydown', event => { keyboardNavigation = event.key === 'Enter'; });
document.addEventListener('pointerdown', () => { keyboardNavigation = false; });
document.addEventListener('click', event => {
  if (event.target.closest('[data-read-analysis]')) {
    $('analysis-title')?.focus({preventScroll:true});
    $('analysis-title')?.scrollIntoView({block:'start',behavior:'instant'});
    return;
  }
  const scrollButton = event.target.closest('[data-chronology-scroll]');
  if (scrollButton) {
    const list = document.querySelector('.event-list');
    list.scrollBy({left:Number(scrollButton.dataset.chronologyScroll) * list.clientWidth * 0.75,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'});
    return;
  }
  const anchor = event.target.closest('a[href^="#/"]');
  if (!anchor) return;
  if (anchor.dataset.view === 'events') eventOrigins.delete(data.case.id);
  if (anchor.closest('.system-events,.reporting-events') || anchor.matches('.system-response-event,.system-response-connection')) {
    const item = data[current.view].find(entry => entry.id === current.itemId);
    const field = data.reporting?.fields.find(entry => entry.id === current.reportingFieldId);
    eventOrigins.set(data.case.id, {url:routeFor(current.view,current.itemId,current.sourceId,current.reportingFieldId || current.storyId), title:field?.label || item.title});
  }
  destination = anchor.matches('.citation') ? 'sources-title' : null;
  if (destination && anchor.hash === location.hash) {
    event.preventDefault();
    const target = $(destination);
    if (keyboardNavigation) target.focus({preventScroll:true});
    target.scrollIntoView({block:'start',behavior:'instant'});
    destination = null;
    keyboardNavigation = false;
  }
});
window.addEventListener('hashchange', () => {
  if (catalog.length && !['#main','#investigation'].includes(location.hash)) render({ focus: keyboardNavigation, destination });
  keyboardNavigation = false;
  destination = null;
});
matchMedia('(max-width:760px)').addEventListener('change', () => { if (catalog.length) render(); });
document.addEventListener('change', event => {
  if (event.target.id === 'source-picker') location.hash = routeFor(current.view, current.itemId, event.target.value);
  if (event.target.id === 'inquiry-picker') location.hash = routeFor('questions', event.target.value);
  if (event.target.matches('[data-reporting-field-select]')) location.hash = routeFor('questions', current.itemId, current.sourceId, event.target.value);
  if (event.target.id === 'case-picker') location.hash = caseRouteFor(event.target.value, current?.view || 'events');
  if (event.target.name === 'compare-case') {
    if (event.target.checked) selectedCases.add(event.target.value);
    else selectedCases.delete(event.target.value);
    const tray = $('comparison-tray');
    tray.hidden = selectedCases.size === 0;
    tray.innerHTML = selectionMarkup(selectedCases);
    $('status').textContent = `${selectedCases.size} incidents selected for comparison`;
  }
});
document.addEventListener('click', event => {
  if (event.target.closest('[data-reload-cases]')) location.reload();
  if (!event.target.closest('[data-clear-comparison]')) return;
  selectedCases.clear();
  document.querySelectorAll('[name="compare-case"]').forEach(input => {input.checked = false;});
  document.querySelector('[name="compare-case"]')?.focus({preventScroll:true});
  $('comparison-tray').hidden = true;
  $('status').textContent = 'Comparison selection cleared';
});

try {
  const readData = async path => {
    const url = new URL(path, import.meta.url);
    url.search = new URL(import.meta.url).search;
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Incident data could not be loaded');
    return response.json();
  };
  const entries = await readData('./case-index.json');
  const reporting = await readData('./reporting-data.json');
  const results = await Promise.allSettled(entries.map(async entry => {
    const caseData = await readData(entry.path);
    if (caseData.case.id !== entry.id) throw new Error('Incident identity does not match the library');
    return caseData;
  }));
  const first = results[0].status === 'fulfilled' ? results[0].value : null;
  catalog = results.filter(r => r.status === 'fulfilled').map(r => ({mitigationTaxonomy:first?.mitigationTaxonomy, reportingFramework:first?.reportingFramework, ...r.value, ...(r.value.case.id === 'hugging-face-1604' ? { reporting } : {})}));
  if (!catalog.length) throw new Error('No incident accounts could be loaded');
  if (catalog.length < results.length) loadNotice = '<p class="load-notice" role="alert">One investigation could not be loaded. <button type="button" data-reload-cases>Retry</button></p>';
  render();
} catch (error) {
  $('case-library').innerHTML = '<p class="error">The incidents could not be loaded. Please reload the page.</p>';
  console.error(error);
}
