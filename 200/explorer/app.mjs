import { views, readRoute, routeFor, selectSourceRef } from './state.mjs';
import { setupCredit } from './credit.mjs';

setupCredit();

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const stateNames = { held: 'Held', failed: 'Failed', absent: 'Absent', disabled: 'Disabled', unknown: 'Unknown' };
const $ = id => document.getElementById(id);
const remembered = {};
const rememberedSources = {};
let data;
let current;
let previous;

const link = (view, item, text, attrs = '') => `<a href="${routeFor(view, item.id)}" ${attrs}>${text}</a>`;
const stateLabel = state => `<span class="state state-${escape(state)}">${escape(stateNames[state])}</span>`;
const sourceDate = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

function itemSelection(view, item) {
  const active = item.id === current.itemId;
  if (view === 'events') return `<li>${link(view, item, `<time>${escape(item.date)}</time><span class="event-dot" aria-hidden="true"></span><span class="event-label">${escape(item.label)}</span>`, `class="event-button" aria-current="${active}"`)}</li>`;
  return `<li>${link(view, item, `<span class="choice-label"><span class="choice-title">${escape(item.title)}</span>${view === 'controls' ? stateLabel(item.state) : ''}</span>`, `aria-current="${active}"`)}</li>`;
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
    return `<li>${link(view, item, `${view === 'events' ? `<span class="relation-date">${escape(item.date)}</span>` : ''}<span class="relation-title">${escape(item.title || item.label)}</span>${view === 'controls' ? stateLabel(item.state) : ''}`)}</li>`;
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
  const context = current.view === 'events' ? `${escape(item.date)}, 2026` : current.view === 'controls' ? `${stateLabel(item.state)}<span>${escape(item.owner)}</span>` : current.view === 'causes' && item.kind === 'Interpretation' ? 'Interpretation' : '';
  let body = `<div class="detail-context">${context}</div><h2 id="analysis-title" tabindex="-1">${escape(item.label || item.title)}</h2>`;
  if (current.view === 'questions') {
    body += `<p class="detail-summary">${escape(item.context)}</p><div class="question-detail"><section class="decision-context"><h3>Decision this could change</h3><p>${escape(item.decision)}</p></section><section><h3>Why the answer matters</h3><p>${escape(item.whyItMatters)}</p></section><section><h3>Information needed</h3><p>${escape(item.informationNeeded)}</p></section><section><h3>Who may hold it</h3><p>${escape(item.informationHolder)}</p></section></div>`;
  } else {
    body += `<p class="detail-summary">${escape(item.summary)} <span class="inline-citations">${citationLinks(item)}</span></p>`;
  }
  if (current.view === 'events') {
    body += `<section class="analysis-section"><h3>Organizations and systems</h3><ul class="actor-list">${item.actors.map(a => `<li>${escape(a)}</li>`).join('')}</ul></section>`;
    const causes = data.causes.filter(c => c.eventIds.includes(item.id));
    body += related('causes', causes.map(c => c.id), 'How this happened');
    body += `<div class="related-columns">${related('controls', item.controlIds, 'Safeguards')}${related('questions', item.questionIds, 'Questions to investigate')}</div>`;
  } else if (current.view === 'causes') {
    body += mechanism(item);
    if (item.alternative) body += `<section class="alternative"><h3>Another account</h3><p>${escape(item.alternative)}</p></section>`;
    body += related('events', item.eventIds, 'In the chronology');
    body += `<div class="related-columns">${related('controls', item.controlIds, 'Related safeguards')}${related('questions', item.questionIds, 'Questions to investigate')}</div>`;
  } else if (current.view === 'controls') {
    body += `<section class="analysis-section decision-context"><h3>Decision</h3><p>${escape(item.decision)}</p></section><div class="question-detail"><section><h3>Option to evaluate</h3><p>${escape(item.option)}</p></section><section><h3>Check before relying on it</h3><p>${escape(item.verification)}</p></section></div>`;
    body += `<div class="related-columns">${related('events', item.eventIds, 'In the chronology')}${related('questions', item.questionIds, 'Questions to investigate')}</div>`;
  } else {
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
    return `<a href="${routeFor(current.view, item.id, id)}" class="source-option" aria-current="${id === current.sourceId}">${i + 1}. ${escape(s.publisher)}</a>`;
  }).join('')}</div>` : '';
  $('sources').innerHTML = `<div class="sources-heading"><h2 id="sources-title" tabindex="-1">${current.view === 'questions' ? 'Relevant sources' : 'Sources'}</h2><span class="source-count">${item.sourceIds.indexOf(source.id) + 1} of ${item.sourceIds.length}</span></div>${options}<div class="source-publisher"><span>${escape(source.publisher)}</span><time datetime="${escape(source.date)}">${sourceDate(source.date)}</time></div><h3 class="source-title">${escape(source.title)}</h3><p class="source-kind">${escape(source.kind)}</p>${ref.account ? `<div class="source-account"><h3>${item.kind === 'Interpretation' ? 'Assessment in this source' : 'Account in this source'}</h3><p>${escape(ref.account)}</p></div>` : ''}${ref.excerpt ? `<blockquote>“${escape(ref.excerpt)}”</blockquote>` : ''}<div class="source-locator"><strong>Where to look</strong>${escape(ref.locator || source.locator)}</div><a href="${escape(source.url)}" class="source-link" target="_blank" rel="noopener noreferrer">Read the source<span class="visually-hidden"> (opens in a new tab)</span></a>`;
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
