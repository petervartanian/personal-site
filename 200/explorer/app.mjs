import { views, navigationViews, navigationIdFor, causeConceptIds, readRoute, readLocation, caseRouteFor } from './state.mjs?v=20261025-branching';
import { libraryMarkup, comparisonMarkup, selectionMarkup } from './catalog.mjs?v=20261025-branching';
import { systemSelection, systemAnalysis } from './system.mjs?v=20261025-branching';
import { frameworkAnalysis, frameworkTopics } from './framework.mjs?v=20261025-branching';
import { findingsSelection, findingsAnalysis } from './findings.mjs?v=20261025-branching';
import { sourceMarkup } from './sources.mjs?v=20261025-branching';
import { reportingInventoryMarkup, comparisonForReference } from './reporting.mjs?v=20261025-branching';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const $ = id => document.getElementById(id);
const memories = new Map();
const positions = new Map();
const selectedCases = new Set();
let catalog = [];
let data;
let current;
let previous;
let screen;
let keyboardNavigation = false;
let clickedLink = false;
let loadNotice = '';

const isOverview = () => current?.view === 'framework' && current.itemId === 'account-overview';
const itemFor = route => data[route.view]?.find(item => item.id === route.itemId);
const positionKey = route => route ? `${data.case.id}/${route.view}/${route.itemId}/${route.reportingFieldId || ''}` : '';

function routeFor(view, itemId, sourceId, context, options = {}) {
  if (view === 'causes' && data.framework?.some(item => item.id === causeConceptIds[itemId])) {
    itemId = causeConceptIds[itemId];
    view = 'framework';
  }
  if (view === 'questions' && data.findings?.some(item => item.id === itemId)) view = 'findings';
  const sameItem = current?.view === view && current?.itemId === itemId;
  let detail;
  if (['findings', 'questions'].includes(view)) {
    detail = context === false ? undefined : context === 'all-connections' ? undefined : context || (sameItem ? current.reportingFieldId : undefined);
  } else if (view === 'controlRelationships' || view === 'framework') {
    const story = data.framework?.find(item => item.id === context && item.type === 'story');
    if (view === 'controlRelationships' ? story?.relationshipIds?.includes(itemId) : story?.conceptIds?.includes(itemId)) detail = context;
  }
  const url = caseRouteFor(data.case.id, view, itemId, sourceId, detail);
  const query = new URLSearchParams();
  const claim = options.claim === null ? null : options.claim || (sameItem ? current.claim : null);
  const compare = options.compare ?? (sameItem && current.compare);
  if (claim) query.set('claim', claim);
  if (compare) query.set('compare', '1');
  return url + (query.size ? '?' + query : '');
}

function citationLinks(item, field = null, view = current.view) {
  const refs = field ? (item.sourceRefs || []).filter(ref => (ref.supports || '').split(',').map(value => value.trim()).includes(field)) : item.sourceRefs || [];
  const ids = [...new Set(refs.map(ref => ref.sourceId))];
  return ids.map(id => {
    const source = data.sources.find(entry => entry.id === id);
    if (!source) return '';
    return `<a href="${routeFor(view, item.id, id, undefined, {claim: field, compare: false})}" class="citation" aria-controls="sources" aria-label="Read ${escape(source.publisher)} on this statement">[${item.sourceIds.indexOf(id) + 1}]</a>`;
  }).join(' ');
}

function related(view, ids, title) {
  const items = [...new Set(ids || [])].map(id => data[view]?.find(item => item.id === id)).filter(Boolean);
  if (!items.length) return '';
  return `<section class="analysis-section related-section"><h3>${escape(title)}</h3><ul class="related-list">${items.map(item => `<li><a href="${routeFor(view, item.id)}">${view === 'events' ? `<span class="relation-date">${escape(item.date)}</span>` : ''}<span class="relation-title">${escape(item.label || item.title)}</span></a></li>`).join('')}</ul></section>`;
}

function renderSelection() {
  const nav = navigationIdFor(current);
  if (nav === 'framework') {
    $('selection').innerHTML = systemSelection(data, current, routeFor);
  } else if (nav === 'findings') {
    $('selection').innerHTML = findingsSelection(data, current, routeFor);
  } else {
    const account = data.framework?.find(item => item.id === 'account-overview');
    $('selection').innerHTML = `<section class="chronology unified-chronology" aria-label="Incident chronology"><div class="chronology-heading"><h2 class="selection-heading">Chronology <span class="date-span">${escape(data.case.chronologyRange || data.case.dateRange)}</span></h2>${account ? `<a class="impact-selection" href="${routeFor('framework', account.id)}" ${isOverview() ? 'aria-current="true"' : ''}>Account and impact</a>` : ''}</div><ol class="event-list" style="--event-count:${data.events.length}" aria-label="Select an event">${data.events.map(item => `<li><a class="event-button" href="${routeFor('events', item.id)}" aria-current="${current.view === 'events' && item.id === current.itemId}"><time>${escape(item.date)}</time><span class="event-dot" aria-hidden="true"></span><span class="event-label">${escape(item.label)}</span></a></li>`).join('')}</ol><div class="chronology-scroll-controls" hidden><button type="button" data-chronology-scroll="-1" aria-label="Show earlier events">Earlier</button><button type="button" data-chronology-scroll="1" aria-label="Show later events">Later</button></div></section>`;
    document.querySelector('.event-list')?.addEventListener('scroll', updateChronologyControls, {passive: true});
  }
}

function updateChronologyControls() {
  const list = document.querySelector('.event-list');
  const controls = document.querySelector('.chronology-scroll-controls');
  if (!list || !controls) return;
  controls.hidden = list.scrollWidth <= list.clientWidth + 2;
  controls.querySelector('[data-chronology-scroll="-1"]').disabled = list.scrollLeft <= 2;
  controls.querySelector('[data-chronology-scroll="1"]').disabled = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
}

function renderAnalysis(item) {
  const reporting = Boolean(current.reportingFieldId);
  const layout = document.querySelector('.reading-layout');
  layout.classList.toggle('is-reporting', reporting);
  layout.classList.toggle('is-comparing', Boolean(current.compare));
  $('sources').hidden = reporting;
  let body;
  if (reporting) {
    body = `<a class="context-return" href="${routeFor(current.view, item.id, current.sourceId, false)}">${escape(item.title)}</a>` + reportingInventoryMarkup(data.reporting, data, routeFor, {questionId: item.id, fieldId: current.reportingFieldId});
  } else if (isOverview()) {
    body = `<h2 id="analysis-title" tabindex="-1">The incident and its impact</h2><div class="account-prose"><p data-claim="summary">${escape(item.summary)} ${citationLinks(item, 'summary')}</p><p data-claim="explanation">${escape(item.explanation)} ${citationLinks(item, 'explanation')}</p></div><nav class="impact-links" aria-label="Examine consequences"><a href="${routeFor('findings', 'infrastructure-dependencies')}">Affected people and services</a><a href="${routeFor('findings', 'missing-perspectives')}">Whose experience is missing?</a></nav>`;
  } else if (navigationIdFor(current) === 'findings') {
    body = findingsAnalysis(data, current, routeFor);
  } else if (current.view === 'framework') {
    body = frameworkAnalysis(item, data, citationLinks, routeFor, () => '', {current});
  } else if (current.view === 'controlRelationships') {
    body = systemAnalysis(item, citationLinks, related, routeFor, frameworkTopics(data, current, routeFor), data.questions);
  } else {
    body = `<div class="detail-context"><time>${escape(item.date)}</time></div><h2 id="analysis-title" tabindex="-1">${escape(item.label || item.title)}</h2><div class="account-prose"><p data-claim="summary">${escape(item.summary)} ${citationLinks(item, 'summary')}</p>${item.detail ? `<p data-claim="detail">${escape(item.detail)} ${citationLinks(item, 'detail')}</p>` : ''}</div><ul class="actor-list" aria-label="Organizations and systems">${(item.actors || []).map(actor => `<li>${escape(actor)}</li>`).join('')}</ul>`;
    const causes = data.framework.filter(entry => entry.type === 'cause' && entry.eventIds?.includes(item.id));
    body += related('controlRelationships', item.relationshipIds, 'Examine the response');
    body += related('framework', causes.map(entry => entry.id), 'Explain the connection');
    body += related('questions', item.questionIds, 'Findings and questions');
    if (item.id === 'impact-assessment') body += `<nav class="impact-links" aria-label="Investigate the reported impact"><a href="${routeFor('findings','missing-perspectives')}">Whose experience is missing?</a></nav>`;
  }
  $('analysis').innerHTML = body;
  if (current.claim) {
    for (const element of $('analysis').querySelectorAll('[data-claim],[data-system-field]')) {
      element.classList.toggle('selected-claim', (element.dataset.claim || element.dataset.systemField) === current.claim);
    }
  }
  $('sources').innerHTML = reporting ? '' : sourceMarkup(data, item, current, routeFor, {compare: current.compare, claim: current.claim});
}

function defaultSelection(view) {
  if (view === 'events' && data.framework?.some(item => item.id === 'account-overview')) return {view: 'framework', itemId: 'account-overview'};
  return {view, itemId: view === 'framework' ? 'all-connections' : data[view][0].id};
}

function render({focus = false, restoreHistory = false} = {}) {
  const viewport = {left: window.scrollX, top: window.scrollY};
  if (previous && screen === 'case') positions.set(positionKey(previous), viewport);
  const active = document.activeElement;
  const focusId = active?.id;
  const focusHref = active?.closest('a[href]')?.getAttribute('href');
  const focusView = active?.closest('[data-view]')?.dataset.view;
  const sourceControl = active?.matches('[data-source-compare],[data-source-single]');
  const oldEventScroll = document.querySelector('.event-list')?.scrollLeft;
  const oldFindingScroll = document.querySelector('.findings-choices')?.scrollLeft;
  const locationState = readLocation(location.hash, catalog);
  const lastScreen = screen;
  screen = locationState.screen;
  $('case-library').hidden = screen === 'case';
  $('case-workspace').hidden = screen !== 'case';
  if (screen !== 'case') {
    document.body.dataset.view = 'library';
    document.body.dataset.navigation = 'library';
    if (screen === 'compare') locationState.caseIds.forEach(id => selectedCases.add(id));
    $('case-library').innerHTML = screen === 'compare' ? comparisonMarkup(catalog, locationState.caseIds) : libraryMarkup(catalog, selectedCases);
    if (loadNotice) $('case-library').insertAdjacentHTML('beforeend', loadNotice);
    document.title = screen === 'compare' ? 'Compare incidents | AI Incident Explorer' : 'AI Incident Explorer';
    $('status').textContent = screen === 'compare' ? 'Incident comparison' : 'Choose an incident';
    previous = null;
    if (lastScreen !== screen) window.scrollTo({top: 0, behavior: 'instant'});
    if (focus) $('case-library').querySelector('h1')?.focus({preventScroll: true});
    return;
  }
  const switchedCase = data?.case.id !== locationState.caseId;
  data = catalog.find(entry => entry.case.id === locationState.caseId);
  if (!memories.has(data.case.id)) memories.set(data.case.id, {navigation: {}, scrolls: {}});
  const remembered = memories.get(data.case.id);
  if (previous && !switchedCase) {
    const priorNav = navigationIdFor(previous);
    remembered.scrolls[priorNav] = viewport;
    if (oldEventScroll !== undefined) remembered.eventScroll = oldEventScroll;
    if (oldFindingScroll !== undefined) remembered.findingScroll = oldFindingScroll;
  }
  current = readRoute(locationState.hash, data, remembered);
  if (current.view === 'questions' && data.findings?.some(item => item.id === current.itemId)) current.view = 'findings';
  const nav = navigationIdFor(current);
  const item = itemFor(current);
  if (!item.sourceIds.includes(current.sourceId)) current.sourceId = item.sourceIds[0];
  if (switchedCase || lastScreen !== 'case') {
    $('case-title').textContent = data.case.title;
    document.querySelector('.case-switcher>a').textContent = catalog.length === 1 ? 'Overview' : 'All incidents';
    document.querySelector('.case-context').textContent = data.case.dateLabel || data.case.dateRange;
    document.querySelector('.case-summary').textContent = data.case.catalogSummary || data.case.summary;
    const number = document.querySelector('.incident-number');
    number.hidden = !data.case.incidentId;
    number.textContent = '#' + data.case.incidentId;
    number.href = 'https://incidentdatabase.ai/cite/' + data.case.incidentId;
    number.setAttribute('aria-label', 'Incident ' + data.case.incidentId + ' in the AI Incident Database');
    $('case-picker').hidden = catalog.length < 2;
    document.querySelector('label[for="case-picker"]').hidden = catalog.length < 2;
    $('case-picker').innerHTML = catalog.map(entry => `<option value="${escape(entry.case.id)}" ${entry.case.id === data.case.id ? 'selected' : ''}>${escape(entry.case.title)}</option>`).join('');
  }
  remembered[current.view] = current.itemId;
  remembered.navigation[nav] = {...current};
  document.body.dataset.view = isOverview() ? 'overview' : current.view;
  document.body.dataset.navigation = nav;
  const stableHash = routeFor(current.view, current.itemId, current.sourceId, current.reportingFieldId || current.storyId);
  if (location.hash !== stableHash) history.replaceState(null, '', stableHash);
  $('question-navigation').innerHTML = navigationViews.filter(view => data[view.id]?.length).map(view => {
    const selected = remembered.navigation[view.id] || defaultSelection(view.id);
    let target = caseRouteFor(data.case.id, selected.view, selected.itemId, selected.sourceId, selected.reportingFieldId || selected.storyId);
    const query = new URLSearchParams();
    if (selected.claim) query.set('claim', selected.claim);
    if (selected.compare) query.set('compare', '1');
    if (query.size) target += '?' + query;
    return `<a data-view="${view.id}" href="${target}" ${view.id === nav ? 'aria-current="page"' : ''}>${view.label}</a>`;
  }).join('');
  renderSelection();
  renderAnalysis(item);
  const timeline = document.querySelector('.event-list');
  if (timeline) {
    timeline.scrollLeft = remembered.eventScroll || 0;
    const selected = timeline.querySelector('[aria-current=true]');
    if (selected) {
      const child = selected.getBoundingClientRect(), parent = timeline.getBoundingClientRect();
      if (child.left < parent.left || child.right > parent.right) timeline.scrollLeft += child.left - parent.left - 8;
    }
  }
  const findings = document.querySelector('.findings-choices');
  if (findings) {
    findings.scrollLeft = remembered.findingScroll || 0;
    const selected = findings.querySelector('[aria-current=true]');
    if (selected) {
      const child = selected.getBoundingClientRect(), parent = findings.getBoundingClientRect();
      if (child.left < parent.left || child.right > parent.right) findings.scrollLeft += child.left - parent.left - 8;
    }
  }
  updateChronologyControls();
  const comparison = comparisonForReference(data.reporting, current.reportingFieldId, item.id);
  const field = data.reporting?.fields.find(entry => entry.id === current.reportingFieldId);
  document.title = `${comparison?.title || field?.label || item.label || item.title} | AI Incident Explorer`;
  $('status').textContent = `${navigationViews.find(view => view.id === nav).label}: ${item.label || item.title}${current.compare ? '. Sources compared.' : ''}`;
  if (focusId && ['source-picker','inquiry-picker','findings-picker','reporting-field-select','reporting-stage-select'].includes(focusId)) $(focusId)?.focus({preventScroll: true});
  else if (sourceControl) document.querySelector('[data-source-compare],[data-source-single]')?.focus({preventScroll: true});
  else if (focus) {
    const replacement = focusView ? document.querySelector(`[data-view="${focusView}"]`) : [...document.querySelectorAll('a[href]')].find(link => link.getAttribute('href') === focusHref && link.getClientRects().length);
    (replacement || $('analysis-title'))?.focus({preventScroll: true});
  }
  const changedView = previous && navigationIdFor(previous) !== nav;
  const saved = restoreHistory ? positions.get(positionKey(current)) : changedView ? remembered.scrolls[nav] : null;
  const target = switchedCase || lastScreen !== 'case' ? {top: 0, left: 0} : saved || viewport;
  window.scrollTo({...target, behavior: 'instant'});
  previous = {...current};
}

history.scrollRestoration = 'manual';
new ResizeObserver(updateChronologyControls).observe($('investigation'));
document.addEventListener('keydown', event => {keyboardNavigation = event.key === 'Enter' || event.key === ' ';});
document.addEventListener('pointerdown', () => {keyboardNavigation = false;});
document.addEventListener('click', event => {
  const scrollButton = event.target.closest('[data-chronology-scroll]');
  if (scrollButton) {
    const list = document.querySelector('.event-list');
    list.scrollBy({left: Number(scrollButton.dataset.chronologyScroll) * list.clientWidth * .75, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'});
    return;
  }
  if (event.target.closest('[data-source-compare],[data-source-single]')) {
    clickedLink = true;
    location.hash = routeFor(current.view, current.itemId, current.sourceId, undefined, {compare: Boolean(event.target.closest('[data-source-compare]'))});
    return;
  }
  if (event.target.closest('[data-reload-cases]')) location.reload();
  if (event.target.closest('[data-clear-comparison]')) {
    selectedCases.clear();
    document.querySelectorAll('[name="compare-case"]').forEach(input => {input.checked = false;});
    $('comparison-tray').hidden = true;
  }
  const anchor = event.target.closest('a[href^="#/"]');
  if (anchor && !event.metaKey && !event.ctrlKey && !event.shiftKey) clickedLink = anchor.hash !== location.hash;
});
window.addEventListener('hashchange', () => {
  if (catalog.length && !['#main','#investigation'].includes(location.hash)) render({focus: keyboardNavigation, restoreHistory: !clickedLink});
  clickedLink = false;
  keyboardNavigation = false;
});
document.addEventListener('change', event => {
  clickedLink = true;
  if (event.target.id === 'source-picker') location.hash = routeFor(current.view, current.itemId, event.target.value);
  if (['findings-picker','inquiry-picker'].includes(event.target.id)) location.hash = routeFor('findings', event.target.value);
  if (event.target.matches('[data-reporting-field-select]')) location.hash = routeFor('findings', current.itemId, current.sourceId, event.target.value);
  if (event.target.id === 'case-picker') location.hash = caseRouteFor(event.target.value, 'framework', 'account-overview');
  if (event.target.name === 'compare-case') {
    if (event.target.checked) selectedCases.add(event.target.value);
    else selectedCases.delete(event.target.value);
    $('comparison-tray').hidden = selectedCases.size === 0;
    $('comparison-tray').innerHTML = selectionMarkup(selectedCases);
  }
});

try {
  const readData = async path => {
    const url = new URL(path, import.meta.url);
    url.search = new URL(import.meta.url).search;
    const response = await fetch(url, {cache: 'no-cache'});
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
  catalog = results.filter(result => result.status === 'fulfilled').map(result => ({mitigationTaxonomy: first?.mitigationTaxonomy, reportingFramework: first?.reportingFramework, ...result.value, ...(result.value.case.id === 'hugging-face-1604' ? {reporting} : {})}));
  if (!catalog.length) throw new Error('No incident accounts could be loaded');
  if (catalog.length < results.length) loadNotice = '<p class="load-notice" role="alert">One investigation could not be loaded. <button type="button" data-reload-cases>Retry</button></p>';
  render();
} catch (error) {
  $('case-library').innerHTML = '<p class="error">The incidents could not be loaded. Please reload the page.</p>';
  console.error(error);
}
