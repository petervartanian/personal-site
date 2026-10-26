import { caseRouteFor } from './state.mjs?v=20261026-brief';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const href = value => /^(?:https?:\/\/|#|\/[^/])/.test(String(value ?? '')) ? escape(value) : '#';

export const explorerVersion = Object.freeze({ number: '0.2', date: '26 October 2026' });

export const casePages = Object.freeze([
  { id: 'brief', label: 'Brief', title: 'Brief for decision-makers', tab: true },
  { id: 'gaps', label: 'Reporting gaps', title: 'Reporting gaps', tab: true },
  { id: 'method', label: 'Method', title: 'How this case was built', tab: false },
]);

export const pageRoute = (caseId, page) => '#/cases/' + encodeURIComponent(caseId) + '/' + page;

const stateLabels = { failed: 'Failed', absent: 'Absent', disabled: 'Switched off', held: 'Held' };
const stateOrder = ['failed', 'absent', 'disabled', 'held'];
const statusOrder = ['not-established', 'partial', 'public-report'];

function findingForField(data, field) {
  for (const questionId of field.questionIds || []) {
    const finding = data.findings?.find(item => item.questionId === questionId);
    if (finding) return finding;
  }
  return null;
}

export function fieldRoute(data, field) {
  const finding = findingForField(data, field);
  return finding ? caseRouteFor(data.case.id, 'findings', finding.id, undefined, field.id) : pageRoute(data.case.id, 'gaps');
}

const comparisonRoute = (data, comparison, row) => caseRouteFor(data.case.id, 'findings', comparison.questionId, undefined, row ? `${comparison.id}--${row.id}` : comparison.id);
const draftTag = comparison => comparison.draft ? '<span class="draft-tag" title="Prepared from the legal text for expert review. Not legal advice.">Draft</span>' : '';

function statusCounts(fields) {
  const counts = Object.fromEntries(statusOrder.map(status => [status, 0]));
  for (const field of fields) counts[field.status] = (counts[field.status] || 0) + 1;
  return counts;
}

function statusBadge(reporting, status) {
  const definition = reporting.statuses[status];
  return `<span class="gap-status gap-status-${escape(status)}" title="${escape(definition?.description)}">${escape(definition?.label || status)}</span>`;
}

function countStrip(reporting, fields, label) {
  const counts = statusCounts(fields);
  const segments = statusOrder.map(status => counts[status] ? `<span class="gap-bar-segment gap-status-${status}" style="flex:${counts[status]}" aria-hidden="true"></span>` : '').join('');
  const legend = statusOrder.map(status => `<li><span class="gap-dot gap-status-${status}" aria-hidden="true"></span><strong>${counts[status]}</strong> ${escape(reporting.statuses[status].label.toLowerCase())}</li>`).join('');
  return `<figure class="gap-summary"><figcaption>${escape(label)}</figcaption><div class="gap-bar" role="img" aria-label="${statusOrder.map(status => `${counts[status]} ${reporting.statuses[status].label.toLowerCase()}`).join(', ')}, of ${fields.length} fields">${segments}</div><ul class="gap-legend">${legend}</ul></figure>`;
}

/** For each OECD field, the legal comparisons and stages that ask for it. */
function legalAsks(reporting) {
  const map = new Map();
  for (const comparison of reporting.comparisons || []) {
    for (const row of comparison.requirements) {
      for (const id of row.oecdFieldIds) {
        if (!map.has(id)) map.set(id, new Map());
        const byLaw = map.get(id);
        if (!byLaw.has(comparison.id)) byLaw.set(comparison.id, { comparison, rows: [] });
        byLaw.get(comparison.id).rows.push(row);
      }
    }
  }
  return map;
}

function fieldsAskedBy(comparison) {
  return new Set(comparison.requirements.flatMap(row => row.oecdFieldIds));
}

function requestsText(data) {
  const reporting = data.reporting;
  const asks = legalAsks(reporting);
  const lines = [`Information requests: ${data.case.title} (AI Incident Database #${data.case.incidentId})`, `Fields from ${reporting.framework.citation || 'the OECD common reporting framework'}`, ''];
  for (const status of ['not-established', 'partial']) {
    const fields = reporting.fields.filter(field => field.status === status);
    if (!fields.length) continue;
    lines.push(`${reporting.statuses[status].label} (${fields.length})`);
    for (const field of fields) {
      const laws = [...(asks.get(field.id)?.values() || [])].map(({ comparison, rows }) => `${comparison.shortTitle || comparison.title}${comparison.draft ? ' (draft)' : ''}: ${rows.map(row => row.title).join(', ')}`);
      lines.push(`- ${field.number}. ${field.label}${field.requiredByFramework ? ' [required in the framework]' : ''}`);
      lines.push(`  Still needed: ${field.informationNeeded}`);
      lines.push(`  Who may hold it: ${field.informationHolder}`);
      if (laws.length) lines.push(`  Asked for under: ${laws.join('; ')}`);
    }
    lines.push('');
  }
  lines.push('Framework fields do not determine legal reporting duties. Draft legal comparisons are not legal advice.');
  return lines.join('\n');
}

function briefText(data) {
  const c = data.case;
  const lines = [`${c.title} (${c.dateRange}; AI Incident Database #${c.incidentId})`, '', c.summary, ''];
  const rows = [['setting', 'Setting'], ['aiRole', 'What the AI did'], ['outcome', 'Reported outcome'], ['response', 'Response'], ['unknown', 'Still unknown']];
  for (const [key, label] of rows) if (c.comparison?.[key]) lines.push(`${label}: ${c.comparison[key].text}`);
  lines.push('', 'Safeguards');
  for (const state of stateOrder) for (const control of data.controls.filter(item => item.state === state)) lines.push(`- ${stateLabels[state]}: ${control.title} (${control.owner})`);
  lines.push('', 'Decisions to make');
  for (const finding of data.findings) lines.push(`- ${finding.title}: ${finding.decision}`);
  return lines.join('\n');
}

export const pageText = { brief: briefText, gaps: requestsText };

function pageActions(page) {
  const copyLabel = page === 'gaps' ? 'Copy information requests' : 'Copy brief as text';
  return `<div class="page-actions"><button type="button" data-page-copy="${page}">${copyLabel}</button><button type="button" data-page-print>Print or save as PDF</button><span class="page-action-status" role="status" aria-live="polite"></span></div>`;
}

export function briefMarkup(data) {
  const c = data.case;
  const route = (view, id, detail) => caseRouteFor(c.id, view, id, undefined, detail);
  const rows = [['setting', 'Setting'], ['aiRole', 'What the AI did'], ['outcome', 'Reported outcome'], ['response', 'Response'], ['unknown', 'Still unknown']];
  const sourceLinks = ids => (ids || []).map(id => data.sources.find(source => source.id === id)).filter(Boolean)
    .map(source => `<a class="brief-source" href="${href(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.publisher)}<span class="visually-hidden">: ${escape(source.title)} (opens in a new tab)</span></a>`).join('');
  const account = rows.filter(([key]) => c.comparison?.[key]).map(([key, label]) => `<div><dt>${label}</dt><dd>${escape(c.comparison[key].text)} <span class="brief-sources">${sourceLinks(c.comparison[key].sourceIds)}</span></dd></div>`).join('');
  const controls = stateOrder.map(state => {
    const items = data.controls.filter(control => control.state === state);
    if (!items.length) return '';
    return `<li class="brief-control-group"><span class="state state-${state}">${stateLabels[state]} <span class="brief-count">${items.length}</span></span><ul>${items.map(control => `<li><a href="${route('controls', control.id)}">${escape(control.title)}</a><span class="brief-owner">${escape(control.owner)}</span></li>`).join('')}</ul></li>`;
  }).join('');
  const groups = [['case', 'In this incident'], ['application', 'In another setting']].map(([scope, label]) => {
    const items = data.findings.filter(finding => finding.scope === scope);
    if (!items.length) return '';
    return `<section class="brief-decision-group"><h4>${label}</h4><ol class="brief-decisions">${items.map(finding => `<li><a href="${route('findings', finding.id)}">${escape(finding.title)}</a><p>${escape(finding.decision)}</p></li>`).join('')}</ol></section>`;
  }).join('');
  const reporting = data.reporting;
  const missing = reporting ? reporting.fields.filter(field => field.status === 'not-established') : [];
  const gaps = reporting ? `<section class="brief-section brief-gaps" aria-labelledby="brief-gaps-title"><h3 id="brief-gaps-title">What the public record cannot establish</h3>${countStrip(reporting, reporting.fields, `All ${reporting.fields.length} fields of the OECD common reporting framework`)}<ul class="brief-missing">${missing.map(field => `<li><a href="${fieldRoute(data, field)}">${field.number}. ${escape(field.label)}</a><span>${escape(field.informationHolder)}</span></li>`).join('')}</ul><a class="brief-more" href="${pageRoute(c.id, 'gaps')}">See all ${reporting.fields.length} fields, who may hold the missing information, and which laws ask for it</a></section>` : '';
  return `<article class="case-page brief-page">
    <header class="case-page-header"><h2 id="page-title" tabindex="-1">Brief for decision-makers</h2><p>What happened, which safeguards held and which failed, what has to be decided, and what is still unknown. Every item links to the full analysis and its sources.</p>${pageActions('brief')}</header>
    <section class="brief-section" aria-labelledby="brief-account-title"><h3 id="brief-account-title">What happened <span class="brief-date">${escape(c.dateRange)}</span></h3><p class="brief-lede">${escape(c.summary)}</p><dl class="brief-account">${account}</dl></section>
    <div class="brief-columns">
      <section class="brief-section" aria-labelledby="brief-controls-title"><h3 id="brief-controls-title">Safeguards</h3><ul class="brief-controls">${controls}</ul></section>
      ${gaps}
    </div>
    <section class="brief-section" aria-labelledby="brief-decisions-title"><h3 id="brief-decisions-title">Decisions to make</h3>${groups}</section>
    <p class="case-page-note">“Public report” means that a cited public account states it. It does not mean that the claim has been independently verified. <a href="${pageRoute(c.id, 'method')}">How this case was built</a></p>
  </article>`;
}

export function gapsMarkup(data) {
  const reporting = data.reporting;
  if (!reporting?.fields?.length) return `<article class="case-page"><h2 id="page-title" tabindex="-1">Reporting gaps</h2><p>No reporting framework has been mapped for this incident yet.</p></article>`;
  const framework = reporting.framework;
  const asks = legalAsks(reporting);
  const required = reporting.fields.filter(field => field.requiredByFramework);
  const dimensions = [...new Set(reporting.fields.map(field => field.dimension))];
  const filters = `<div class="gap-filters" role="group" aria-label="Filter fields"><span class="gap-filter-label">Show</span>${[['all', 'All fields'], ['not-established', reporting.statuses['not-established'].label], ['partial', reporting.statuses.partial.label], ['public-report', reporting.statuses['public-report'].label]].map(([value, label], index) => `<button type="button" data-gap-status="${value}" aria-pressed="${index === 0}">${escape(label)}</button>`).join('')}<label class="gap-required"><input type="checkbox" data-gap-required> Required in the framework only</label></div>`;
  const rows = dimensions.map(dimension => {
    const fields = reporting.fields.filter(field => field.dimension === dimension);
    return `<tbody data-gap-dimension><tr class="gap-dimension"><th colspan="5" scope="colgroup">${escape(dimension)}</th></tr>${fields.map(field => {
      const laws = [...(asks.get(field.id)?.values() || [])].map(({ comparison, rows: stages }) => `<div class="gap-law"><span class="gap-law-name">${escape(comparison.shortTitle || comparison.title)}${comparison.draft ? '<span class="draft-dot" title="Draft comparison">*</span>' : ''}</span>${stages.map(row => `<a href="${comparisonRoute(data, comparison, row)}" title="${escape(row.deadline)}">${escape(row.title)}</a>`).join('')}</div>`).join('');
      return `<tr class="gap-row" data-status="${escape(field.status)}" data-required="${field.requiredByFramework}">
        <th scope="row" class="gap-field"><a href="${fieldRoute(data, field)}"><span class="gap-number">${field.number}</span>${escape(field.label)}</a>${field.requiredByFramework ? '<span class="gap-required-tag">Required in the framework</span>' : ''}</th>
        <td class="gap-cell-status" data-label="Status">${statusBadge(reporting, field.status)}</td>
        <td data-label="Still needed">${field.status === 'public-report' ? `<span class="gap-known">Established.</span> ${escape(field.reportedInformation)}` : escape(field.informationNeeded)}</td>
        <td data-label="Who may hold it">${escape(field.informationHolder)}</td>
        <td class="gap-legal" data-label="Asked for under">${laws || '<span class="gap-none">None of the compared laws</span>'}</td>
      </tr>`;
    }).join('')}</tbody>`;
  }).join('');
  const total = reporting.fields.length;
  const comparisons = (reporting.comparisons || []).map(comparison => `<li><div class="gap-law-heading"><a href="${comparisonRoute(data, comparison)}">${escape(comparison.title)}</a>${draftTag(comparison)}</div><span>${escape(comparison.scope)}</span><span class="gap-law-count">Asks for ${fieldsAskedBy(comparison).size} of the ${total} framework fields.</span></li>`).join('');
  const hasDraft = (reporting.comparisons || []).some(comparison => comparison.draft);
  return `<article class="case-page gaps-page">
    <header class="case-page-header"><h2 id="page-title" tabindex="-1">Reporting gaps</h2><p>Each field of the OECD common reporting framework: what the public record shows for this incident, who may hold what is missing, and which reporting laws would ask for it.</p>${pageActions('gaps')}</header>
    <div class="gap-summaries">${countStrip(reporting, reporting.fields, `All ${total} framework fields`)}${countStrip(reporting, required, `The ${required.length} fields that the framework requires`)}</div>
    ${filters}
    <div class="gap-table-wrap"><table class="gap-table"><caption class="visually-hidden">OECD reporting fields for ${escape(data.case.title)}, by status</caption><thead><tr><th scope="col">Field</th><th scope="col">Status</th><th scope="col">Still needed</th><th scope="col">Who may hold it</th><th scope="col">Asked for under</th></tr></thead>${rows}</table><p class="gap-empty" hidden>No fields match these filters.</p>${hasDraft ? '<p class="gap-footnote"><span class="draft-dot">*</span> Draft comparison, prepared from the legal text for expert review. Not legal advice.</p>' : ''}</div>
    <section class="gap-laws" aria-labelledby="gap-laws-title"><h3 id="gap-laws-title">Laws compared</h3><ul>${comparisons}</ul></section>
    <footer class="reporting-framework"><p><a href="${href(framework.url)}" target="_blank" rel="noopener noreferrer">OECD (2025), ${escape(framework.title)}</a>. <a href="${href(framework.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(framework.license)}</a>. The case mapping is Explorer analysis. Framework requirements do not determine legal reporting duties. <a href="${pageRoute(data.case.id, 'method')}">Why this framework?</a></p><small class="reporting-source-note">${escape(framework.adaptationNotice)}</small></footer>
  </article>`;
}

export function methodMarkup(data) {
  const reporting = data.reporting;
  const framework = reporting?.framework;
  const statuses = reporting ? statusOrder.map(status => `<div><dt>${statusBadge(reporting, status)}</dt><dd>${escape(reporting.statuses[status].description)}</dd></div>`).join('') : '';
  const laws = (reporting?.comparisons || []).map(comparison => `<li><a href="${comparisonRoute(data, comparison)}">${escape(comparison.title)}</a>${draftTag(comparison)}<span class="method-law-scope">${escape(comparison.scope)}</span></li>`).join('');
  const steps = [
    ['Collect the accounts', 'Start from each organization’s own account, then add independent reconstructions and official statements. Every claim in the Explorer links to the passage that supports it.'],
    ['Build the chronology', 'Take dates from the sources. Where accounts differ, show each one and let readers compare them.'],
    ['Map who controlled what', 'For each organization, record which process it controlled, what action it took, what feedback reached it, and which constraint it had to enforce. This follows the STAMP approach to accident analysis.'],
    ['Mark each safeguard', 'Record whether it held, failed, was absent, or was switched off, who owned it, and a test that would show whether a repair works.'],
    ['Ask what a decision-maker needs to know', 'Turn each gap into a question, name who may hold the answer, and list the records to request.'],
    ['Keep observation and interpretation apart', 'Where sources disagree about motives, as OpenAI and METR and Redwood do here, label the claim as interpretation and present both readings.'],
    ['Map the reporting fields and the law', 'Go through the OECD framework field by field, mark what the public record establishes, and compare the case with specific reporting laws.'],
  ];
  return `<article class="case-page method-page">
    <header class="case-page-header"><h2 id="page-title" tabindex="-1">How this case was built</h2><p>Every case follows the same steps, so the next incident can be compared with this one. This page sets out those steps, what the labels mean, and the frameworks used.</p></header>
    <section class="method-section" aria-labelledby="method-steps-title"><h3 id="method-steps-title">Steps</h3><ol class="method-steps">${steps.map(([title, text]) => `<li><strong>${title}</strong><p>${text}</p></li>`).join('')}</ol></section>
    ${statuses ? `<section class="method-section" aria-labelledby="method-status-title"><h3 id="method-status-title">What the statuses mean</h3><dl class="method-statuses">${statuses}</dl></section>` : ''}
    ${framework ? `<section class="method-section" aria-labelledby="method-oecd-title"><h3 id="method-oecd-title">Why the OECD framework?</h3>
      <p>The OECD’s <a href="${href(framework.url)}" target="_blank" rel="noopener noreferrer">common reporting framework</a> (February 2025) is the main attempt at a checklist that different countries can share. It has 29 criteria and is voluntary: countries can adopt it and adapt it to their own laws. The European Commission says it is trying to keep its own AI Act incident reporting consistent with it.</p>
      <p>The Explorer uses it as a neutral checklist because it is not tied to one country’s law, and because its CC BY 4.0 licence lets the fields be reproduced here. It is not a legal standard. It also has gaps for a case like this: one field covers autonomy and one covers interaction between AI systems, but none covers containment, notification timing, or what a recipient could do with a report. For legal duties, the Explorer compares the case with specific laws instead.</p></section>` : ''}
    ${laws ? `<section class="method-section" aria-labelledby="method-laws-title"><h3 id="method-laws-title">Laws compared</h3><ul class="method-laws">${laws}</ul><p class="case-page-note">Comparisons marked Draft were prepared from the legal texts for expert review. They are not legal advice.</p></section>` : ''}
    <section class="method-section" aria-labelledby="method-limits-title"><h3 id="method-limits-title">What the Explorer does not do</h3><ul class="method-limits"><li>It does not verify claims independently. A “public report” status means that a cited account states the claim.</li><li>It does not make legal findings or decide whether any organization complied with a law.</li><li>It does not assign a severity category or settle disputed motives.</li></ul></section>
    <section class="method-section" aria-labelledby="method-version-title"><h3 id="method-version-title">Version ${explorerVersion.number}, ${explorerVersion.date}</h3><ul class="method-limits"><li>A brief for decision-makers.</li><li>A table of reporting gaps for all 29 framework fields, with copyable information requests.</li><li>Draft comparisons with the EU AI Act, California SB 53, and New York’s RAISE Act.</li><li>Findings now open with what each one changes.</li></ul></section>
  </article>`;
}

export function bindGapFilters(root) {
  const apply = () => {
    const table = root.querySelector('.gap-table');
    if (!table) return;
    const status = root.querySelector('[data-gap-status][aria-pressed="true"]')?.dataset.gapStatus || 'all';
    const requiredOnly = root.querySelector('[data-gap-required]')?.checked;
    let shown = 0;
    for (const body of table.querySelectorAll('[data-gap-dimension]')) {
      let visible = 0;
      for (const row of body.querySelectorAll('.gap-row')) {
        const show = (status === 'all' || row.dataset.status === status) && (!requiredOnly || row.dataset.required === 'true');
        row.hidden = !show;
        if (show) visible += 1;
      }
      body.hidden = visible === 0;
      shown += visible;
    }
    root.querySelector('.gap-empty').hidden = shown > 0;
  };
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-gap-status]');
    if (!button) return;
    for (const other of root.querySelectorAll('[data-gap-status]')) other.setAttribute('aria-pressed', String(other === button));
    apply();
  });
  root.addEventListener('change', event => { if (event.target.matches('[data-gap-required]')) apply(); });
}
