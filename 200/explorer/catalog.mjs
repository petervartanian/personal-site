import { caseRouteFor, comparisonRoute } from './state.mjs?v=20261023-framework';
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const phaseColor = phase => ({Access:'access',Intrusion:'intrusion',Response:'response',Assessment:'assessment'}[phase] || 'assessment');
export function libraryMarkup(catalog, selected) {
  return `<header class="library-intro"><h1 tabindex="-1">What happened, and what can we learn?</h1><p>Follow an AI incident through the affected systems to understand the response and examine the sources.</p></header>
  <div class="incident-library">${catalog.map(data => {
    const c = data.case;
    return `<article class="library-case"><div class="library-case-story"><header class="library-case-heading"><div class="library-case-meta"><time>${escape(c.dateLabel || c.dateRange)}</time>${c.incidentId ? `<span>#${escape(c.incidentId)}</span>` : ''}</div><h2>${escape(c.title)}</h2></header>
    <p class="library-summary">${escape(c.catalogSummary || c.summary)} ${escape(c.selectionReason)}</p>
    <div class="library-case-actions"><a class="investigate-link" href="${caseRouteFor(c.id,data.framework?.length ? 'framework' : 'events')}">Explore this incident</a>${catalog.length > 1 ? `<label class="compare-choice"><input type="checkbox" name="compare-case" value="${escape(c.id)}" ${selected.has(c.id) ? 'checked' : ''}><span>Compare<span class="visually-hidden"> ${escape(c.title)}</span></span></label>` : ''}</div></div>
    <div class="library-chronology"><h3>Chronology</h3><ol class="case-events" style="--event-count:${data.events.length}" aria-label="Events in ${escape(c.title)}">${data.events.map(event => `<li><a href="${caseRouteFor(c.id,'events',event.id)}" class="library-event phase-${phaseColor(event.phase)}" title="${escape(event.date)}: ${escape(event.label)}" aria-label="${escape(event.date)}, ${escape(event.phase)}: ${escape(event.label)}"><time>${escape(event.date)}</time><span class="library-dot" aria-hidden="true"></span><span class="library-event-label">${escape(event.label)}</span></a></li>`).join('')}</ol></div></article>`;
  }).join('')}</div>
  <div class="comparison-tray" id="comparison-tray" ${selected.size ? '' : 'hidden'}>${selectionMarkup(selected)}</div>`;
}
export function selectionMarkup(selected) {
  return selected.size > 1 ? `<span>${selected.size} incidents selected</span><a class="compare-submit" href="${comparisonRoute([...selected])}">Compare cases</a><button type="button" data-clear-comparison>Clear</button>` : '<span>Select another incident to compare.</span><button type="button" data-clear-comparison>Clear</button>';
}
export function comparisonMarkup(catalog, ids) {
  const selected = ids.map(id => catalog.find(d => d.case.id === id)).filter(Boolean);
  const rows = [['setting','Setting'],['aiRole','AI role'],['outcome','Reported outcome'],['response','Response'],['unknown','Open question']];
  return `<div class="comparison-top"><a href="#/">All incidents</a></div><header class="comparison-intro"><h1 tabindex="-1">Compare incidents</h1><p>Examine how the setting and response differ across the source accounts.</p></header><div class="case-comparison" style="--case-count:${selected.length}">
  <div class="comparison-row comparison-case-headings"><span></span>${selected.map(d => `<h2><a href="${caseRouteFor(d.case.id,'events')}">${escape(d.case.title)}</a><span>${escape(d.case.dateLabel)}${d.case.incidentId ? `, #${escape(d.case.incidentId)}` : ''}</span></h2>`).join('')}</div>
  ${rows.map(([key,title]) => `<section class="comparison-row"><h3>${title}</h3>${selected.map(d => {
    const field = d.case.comparison?.[key];
    const refs = (field?.sourceIds || []).map(id => d.sources.find(s => s.id === id)).filter(Boolean);
    return `<div class="comparison-cell"><h4 class="comparison-mobile-title">${escape(d.case.title)}</h4><p>${escape(field?.text || 'Not documented in the available account.')}</p><div class="comparison-citations">${refs.map(s => `<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.publisher)}<span class="visually-hidden">: ${escape(s.title)} (opens in a new tab)</span></a>`).join('')}</div></div>`;
  }).join('')}</section>`).join('')}</div>`;
}
