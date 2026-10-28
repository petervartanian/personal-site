import { caseRouteFor } from './state.mjs?v=20261027-cast';
import { stateOrder, stateNames, stateDescriptions, stateBadge, organizationName, safeguardMatrix, stateSummary } from './safeguards.mjs?v=20261027-cast';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const href = value => /^(?:https?:\/\/|#|\/[^/])/.test(String(value ?? '')) ? escape(value) : '#';

export const explorerVersion = Object.freeze({ number: '0.3', date: '27 October 2026' });

export const casePages = Object.freeze([
  { id: 'brief', label: 'Brief', title: 'Brief for decision-makers', tab: true },
  { id: 'gaps', label: 'Safeguards and gaps', title: 'Safeguards and gaps', tab: true },
  { id: 'method', label: 'Method', title: 'How this case was built', tab: false },
]);

export const pageRoute = (caseId, page) => '#/cases/' + encodeURIComponent(caseId) + '/' + page;

const facts = [
  ['controlAction', 'What it did'],
  ['feedback', 'What information reached it'],
  ['understanding', 'Why it acted as it did'],
  ['context', 'Conditions'],
];

const ownerFor = controller => controller.replace(/ (research and security|security and platform) teams$/, '');

/** The organizations in CAST step 3: each controller in the control structure, then public authorities. */
function controllers(data) {
  const rows = (data.controlRelationships || []).map(item => ({ ...item, owner: ownerFor(item.controller), relationship: true }));
  if (data.cast?.authorities) rows.push({ ...data.cast.authorities, owner: data.cast.authorities.controller, relationship: false });
  return rows;
}

const isOpen = (row, key) => (row.questionFields || []).includes(key);

const shortDate = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

/** Publisher links; when one publisher appears twice, the date tells the two apart. */
function sourceLinks(data, ids) {
  const sources = [...new Set(ids || [])].map(id => data.sources.find(source => source.id === id)).filter(Boolean);
  const repeated = new Set(sources.map(source => source.publisher).filter((name, index, all) => all.indexOf(name) !== index));
  return sources.map(source => `<a class="brief-source" href="${href(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.publisher)}${repeated.has(source.publisher) && source.date ? `, ${escape(shortDate(source.date))}` : ''}<span class="visually-hidden">: ${escape(source.title)} (opens in a new tab)</span></a>`).join('');
}

const comparisonRoute = (data, comparison, row) => caseRouteFor(data.case.id, 'findings', comparison.questionId, undefined, row ? `${comparison.id}--${row.id}` : comparison.id);
const draftTag = comparison => comparison.draft ? '<span class="draft-tag" title="Prepared from the legal text for expert review. Not legal advice.">Draft</span>' : '';
const caseBadge = (data, id) => `<span class="coordination-case case-${escape(id)}" title="${escape(data.cast.coordinationCases[id]?.description)}">${escape(data.cast.coordinationCases[id]?.label || id)}</span>`;
const elementLabel = (data, id) => data.cast.coordinationElements.find(element => element.id === id)?.label || id;

// ---------- Copyable text ----------

function requestsText(data) {
  const lines = [`Information requests: ${data.case.title} (AI Incident Database #${data.case.incidentId})`, 'Built with CAST: what each organization did and knew, and where coordination broke down.', ''];
  for (const row of controllers(data)) {
    lines.push(row.owner);
    for (const [key, label] of facts) if (isOpen(row, key)) lines.push(`- Open: ${label.toLowerCase()}. ${row[key]}`);
    lines.push(`- Still needed: ${row.informationNeeded}`);
    lines.push(`- Who may hold it: ${row.informationHolder}`);
    lines.push('');
  }
  if (data.cast?.coordination?.length) {
    lines.push('Coordination between organizations');
    for (const entry of data.cast.coordination) {
      lines.push(`- ${entry.title} (${data.cast.coordinationCases[entry.case]?.label.toLowerCase()}): ${entry.informationNeeded} Who may hold it: ${entry.informationHolder}.`);
    }
    lines.push('');
  }
  lines.push('Statements about the public record describe what the cited accounts report. They are not independent verification.');
  return lines.join('\n');
}

function briefText(data) {
  const c = data.case;
  const lines = [`${c.title} (${c.dateRange}; AI Incident Database #${c.incidentId})`, '', c.summary, ''];
  const rows = [['setting', 'Setting'], ['aiRole', 'What the AI did'], ['outcome', 'Reported outcome'], ['response', 'Response'], ['unknown', 'Still unknown']];
  for (const [key, label] of rows) if (c.comparison?.[key]) lines.push(`${label}: ${c.comparison[key].text}`);
  lines.push('', 'Safeguards', stateSummary(data));
  for (const state of stateOrder) for (const control of data.controls.filter(item => item.state === state)) lines.push(`- ${stateNames[state]}: ${control.title} (${control.owner})`);
  if (data.cast?.coordination?.length) {
    lines.push('', 'Where coordination broke down');
    for (const entry of data.cast.coordination) lines.push(`- ${entry.title} (${data.cast.coordinationCases[entry.case]?.label.toLowerCase()}): ${entry.reading}`);
  }
  const comparisons = data.reporting?.comparisons || [];
  if (comparisons.length) {
    lines.push('', 'Was a report owed? (draft comparisons, not legal advice)');
    for (const comparison of comparisons) lines.push(`- ${comparison.shortTitle || comparison.title}: report to ${comparison.brief.to}; ${comparison.brief.first.charAt(0).toLowerCase() + comparison.brief.first.slice(1)}. ${comparison.brief.here}`);
  }
  lines.push('', 'Decisions to make');
  for (const finding of data.findings) lines.push(`- ${finding.title}: ${finding.decision}`);
  return lines.join('\n');
}

export const pageText = { brief: briefText, gaps: requestsText };

function pageActions(page) {
  const copyLabel = page === 'gaps' ? 'Copy information requests' : 'Copy brief as text';
  return `<div class="page-actions"><button type="button" data-page-copy="${page}">${copyLabel}</button><button type="button" data-page-print>Print or save as PDF</button><span class="page-action-status" role="status" aria-live="polite"></span></div>`;
}

// ---------- Brief ----------

function lawsMarkup(data, headingId) {
  const comparisons = data.reporting?.comparisons || [];
  if (!comparisons.length) return '';
  const rows = comparisons.map(comparison => `<tr>
      <th scope="row"><a href="${comparisonRoute(data, comparison)}">${escape(comparison.shortTitle || comparison.title)}</a>${draftTag(comparison)}</th>
      <td data-label="Who must report">${escape(comparison.brief.duty)}</td>
      <td data-label="Report to">${escape(comparison.brief.to)}</td>
      <td data-label="First deadline">${escape(comparison.brief.first)}</td>
      <td data-label="In this incident">${escape(comparison.brief.here)}</td>
    </tr>`).join('');
  return `<section class="brief-section brief-laws" aria-labelledby="${headingId}"><h3 id="${headingId}">Was a report owed?</h3>
    <div class="law-table-wrap"><table class="law-table"><thead><tr><th scope="col">Law</th><th scope="col">Who must report</th><th scope="col">Report to</th><th scope="col">First deadline</th><th scope="col">In this incident</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="case-page-note">Comparisons marked Draft were prepared from the legal texts for expert review. They are not legal advice and do not decide whether any organization complied.</p></section>`;
}

export function briefMarkup(data) {
  const c = data.case;
  const route = (view, id, detail) => caseRouteFor(c.id, view, id, undefined, detail);
  const rows = [['setting', 'Setting'], ['aiRole', 'What the AI did'], ['outcome', 'Reported outcome'], ['response', 'Response'], ['unknown', 'Still unknown']];
  const account = rows.filter(([key]) => c.comparison?.[key]).map(([key, label]) => `<div><dt>${label}</dt><dd>${escape(c.comparison[key].text)} <span class="brief-sources">${sourceLinks(data, c.comparison[key].sourceIds)}</span></dd></div>`).join('');
  const controls = stateOrder.map(state => {
    const items = data.controls.filter(control => control.state === state);
    if (!items.length) return '';
    return `<li class="brief-control-group">${stateBadge(state)} <span class="brief-count">${items.length}</span><ul>${items.map(control => `<li><a href="${route('controls', control.id)}">${escape(control.title)}</a><span class="brief-owner">${escape(control.owner)}</span></li>`).join('')}</ul></li>`;
  }).join('');
  const coordination = data.cast?.coordination?.length ? `<section class="brief-section" aria-labelledby="brief-coordination-title"><h3 id="brief-coordination-title">Where coordination broke down</h3>
    <ul class="brief-coordination">${data.cast.coordination.map(entry => `<li>${caseBadge(data, entry.case)}<div><a href="${pageRoute(c.id, 'gaps')}#coordination-${escape(entry.id)}">${escape(entry.title)}</a><p>${escape(entry.reading)}</p></div></li>`).join('')}</ul>
    <a class="brief-more" href="${pageRoute(c.id, 'gaps')}">What each organization did and knew, and what is still missing</a></section>` : '';
  const groups = [['case', 'In this incident'], ['application', 'In another setting']].map(([scope, label]) => {
    const items = data.findings.filter(finding => finding.scope === scope);
    if (!items.length) return '';
    return `<section class="brief-decision-group"><h4>${label}</h4><ol class="brief-decisions">${items.map(finding => `<li><a href="${route('findings', finding.id)}">${escape(finding.title)}</a><p>${escape(finding.decision)}</p></li>`).join('')}</ol></section>`;
  }).join('');
  return `<article class="case-page brief-page">
    <header class="case-page-header"><h2 id="page-title" tabindex="-1">Brief for decision-makers</h2><p>What happened, which safeguards held and which failed, where coordination broke down, whether a report was owed, and what has to be decided. Every item links to the full analysis and its sources.</p>${pageActions('brief')}</header>
    <section class="brief-section" aria-labelledby="brief-account-title"><h3 id="brief-account-title">What happened <span class="brief-date">${escape(c.dateRange)}</span></h3><p class="brief-lede">${escape(c.summary)}</p><dl class="brief-account">${account}</dl></section>
    <div class="brief-columns">
      <section class="brief-section" aria-labelledby="brief-controls-title"><h3 id="brief-controls-title">Safeguards</h3><p class="brief-summary">${escape(stateSummary(data))}</p><ul class="brief-controls">${controls}</ul><a class="brief-more" href="${pageRoute(c.id, 'gaps')}">Safeguards by organization</a></section>
      ${coordination}
    </div>
    ${lawsMarkup(data, 'brief-laws-title')}
    <section class="brief-section" aria-labelledby="brief-decisions-title"><h3 id="brief-decisions-title">Decisions to make</h3>${groups}</section>
    <p class="case-page-note">The Explorer reports what the cited public accounts state. It does not verify those claims independently. <a href="${pageRoute(c.id, 'method')}">How this case was built</a></p>
  </article>`;
}

// ---------- Safeguards and gaps ----------

function controllerCard(data, row) {
  const c = data.case;
  const factMarkup = facts.map(([key, label]) => {
    if (!row[key]) return '';
    const open = isOpen(row, key);
    const analysis = (row.analysisFields || []).includes(key);
    const supporting = (row.sourceRefs || []).filter(ref => (ref.supports || '').split(',').map(value => value.trim()).includes(key)).map(ref => ref.sourceId);
    const sources = open || analysis ? '' : sourceLinks(data, [...new Set(supporting.length ? supporting : row.sourceIds)]);
    const status = open ? 'Open question' : analysis ? `From the <a href="${pageRoute(c.id, 'brief')}">laws compared</a>` : `Public account${sources ? `: <span class="brief-sources">${sources}</span>` : ''}`;
    return `<div class="${open ? 'is-open' : 'is-public'}"><dt>${label}</dt><dd>${escape(row[key])}<span class="fact-status">${status}</span></dd></div>`;
  }).join('');
  const safeguards = data.controls.filter(control => control.owner === row.owner);
  const safeguardList = safeguards.length ? `<ul class="controller-safeguards" aria-label="Safeguards owned by ${escape(row.owner)}">${safeguards.map(control => `<li><a href="${caseRouteFor(c.id, 'controls', control.id)}">${stateBadge(control.state)}<span>${escape(control.title)}</span></a></li>`).join('')}</ul>` : '';
  const open = facts.filter(([key]) => row[key] && isOpen(row, key)).length;
  const more = row.relationship
    ? `<a href="${caseRouteFor(c.id, 'controlRelationships', row.id)}">See it in the control structure</a>`
    : row.findingId ? `<a href="${caseRouteFor(c.id, 'findings', row.findingId)}">See the finding on reporting</a>` : '';
  return `<article class="controller-card" id="controller-${escape(row.id)}">
    <header><h4>${organizationName(row.owner)}</h4><span class="controller-open${open ? '' : ' is-complete'}">${open ? `${open} open ${open === 1 ? 'question' : 'questions'}` : 'No open questions on these points'}</span></header>
    <p class="controller-process"><span>Controlled</span> ${escape(row.controlledProcess)}</p>
    <p class="controller-constraint"><span>Had to ensure</span> ${escape(row.requiredConstraint)}</p>
    <dl class="controller-facts">${factMarkup}</dl>
    ${safeguardList}
    <div class="controller-request"><p><strong>Still needed.</strong> ${escape(row.informationNeeded)}</p><p class="controller-holder">Who may hold it: ${escape(row.informationHolder)}</p></div>
    ${more ? `<p class="controller-more">${more}</p>` : ''}
  </article>`;
}

function coordinationEntry(data, entry) {
  const c = data.case;
  const elements = data.cast.coordinationElements.map(element => `<li class="${entry.elements.includes(element.id) ? 'is-flagged' : ''}">${escape(element.label)}</li>`).join('');
  return `<li class="coordination-entry" id="coordination-${escape(entry.id)}">
    <div class="coordination-head">${caseBadge(data, entry.case)}<h4>${escape(entry.title)}</h4></div>
    <p class="coordination-parties">${entry.parties.map(party => `<span>${escape(party)}</span>`).join('<span class="coordination-link" aria-label="and">↔</span>')}</p>
    <p>${escape(entry.interdependency)}</p>
    <ul class="coordination-evidence">${entry.evidence.map(item => `<li>${escape(item.text)} <span class="brief-sources">${sourceLinks(data, item.sourceIds)}</span></li>`).join('')}</ul>
    <p class="coordination-reading"><strong>Reading.</strong> ${escape(entry.reading)}</p>
    <div class="coordination-elements"><span>Elements at issue</span><ul aria-label="The nine coordination elements; those at issue are marked">${elements}</ul><span class="visually-hidden">At issue: ${entry.elements.map(id => escape(elementLabel(data, id))).join(', ')}.</span></div>
    <div class="controller-request"><p><strong>Still needed.</strong> ${escape(entry.informationNeeded)}</p><p class="controller-holder">Who may hold it: ${escape(entry.informationHolder)}</p></div>
    ${entry.findingId ? `<p class="controller-more"><a href="${caseRouteFor(c.id, 'findings', entry.findingId)}">See the related finding</a></p>` : ''}
  </li>`;
}

export function gapsMarkup(data) {
  const c = data.case;
  const rows = controllers(data);
  const openTotal = rows.reduce((sum, row) => sum + facts.filter(([key]) => row[key] && isOpen(row, key)).length, 0);
  const cases = data.cast ? Object.entries(data.cast.coordinationCases).map(([id, item]) => `<li>${caseBadge(data, id)}<span>${escape(item.description)}</span></li>`).join('') : '';
  return `<article class="case-page gaps-page">
    <header class="case-page-header"><h2 id="page-title" tabindex="-1">Safeguards and gaps</h2><p>Which safeguards held, what each organization did and knew, where coordination between them broke down, and what the public record still leaves open. Each gap ends in a request: what is needed and who may hold it.</p>${pageActions('gaps')}</header>
    ${safeguardMatrix(data, { link: control => caseRouteFor(c.id, 'controls', control.id), headingLevel: 3, heading: 'Safeguards' })}
    <section class="cast-step" aria-labelledby="controllers-title" data-open-only="false">
      <div class="cast-step-heading"><h3 id="controllers-title">What each organization did and knew</h3>
        <p>For every organization with control over part of the incident: what it had to ensure, what it did, what information reached it, and why its action made sense at the time. ${openTotal} of these points are open questions in the public record.</p>
        <div class="gap-filters" role="group" aria-label="Filter the organizations’ accounts"><span class="gap-filter-label">Show</span><button type="button" data-controller-filter="all" aria-pressed="true">Everything</button><button type="button" data-controller-filter="open" aria-pressed="false">Open questions only</button></div>
      </div>
      <div class="controller-grid">${rows.map(row => controllerCard(data, row)).join('')}</div>
    </section>
    ${data.cast?.coordination?.length ? `<section class="cast-step" id="coordination" aria-labelledby="coordination-title">
      <div class="cast-step-heading"><h3 id="coordination-title">Where coordination broke down</h3>
        <p>Where two parties depended on each other, did they coordinate? Each case below is checked against nine elements of coordination and sorted into one of four ways that coordination can fail.</p>
        <ul class="coordination-cases" aria-label="Four ways coordination fails">${cases}</ul>
      </div>
      <ol class="coordination-list">${data.cast.coordination.map(entry => coordinationEntry(data, entry)).join('')}</ol>
    </section>` : ''}
    <p class="case-page-note">“Public account” means that a cited source reports it; the Explorer has not verified it independently. “Had to ensure” and the readings are Explorer analysis. <a href="${pageRoute(c.id, 'method')}">How this case was built</a></p>
  </article>`;
}

// ---------- Method ----------

export function methodMarkup(data) {
  const c = data.case;
  const cast = data.cast;
  const route = (view, id) => caseRouteFor(c.id, view, id);
  const basics = (cast?.basics || []).map(item => `<div><dt>${escape(item.label)}</dt><dd>${escape(item.text)} ${item.sourceIds.length ? `<span class="brief-sources">${sourceLinks(data, item.sourceIds)}</span>` : '<span class="fact-status">Explorer analysis</span>'}</dd></div>`).join('');
  const steps = [
    ['Gather the facts', 'Start from each organization’s own account, then add independent reconstructions. Date every event from the sources, and state the loss, the hazard, and the constraint that was not enforced.', [['What happened?', route('framework', 'account-overview')]], basics ? `<dl class="method-basics">${basics}</dl>` : ''],
    ['Map who controlled what', 'Draw the control structure: which organization controlled which process, through which actions, and with what information coming back.', [['How did it happen?', route('framework', 'all-connections')]], ''],
    ['Examine each organization’s part', 'For each organization, record what it had to ensure, what it did, what information reached it, and why its action made sense at the time. Give each safeguard one of four states.', [['Safeguards and gaps', pageRoute(c.id, 'gaps')]], ''],
    ['Find the flaws in the whole structure', 'Look across organizations, above all at coordination between them. This step uses CAST-Coordination, which checks nine elements of coordination and sorts each failure into one of four types.', [['Where coordination broke down', `${pageRoute(c.id, 'gaps')}#coordination`], ['Findings and questions', route('findings', data.findings?.[0]?.id)]], ''],
    ['Recommend changes, and how to check them', 'Every finding opens with what it changes. For every safeguard, the Explorer gives a test that would show whether a repair works. For every gap, it lists the records to request and who may hold them.', [['Decisions to make', pageRoute(c.id, 'brief')]], ''],
  ];
  const stepMarkup = steps.map(([title, text, links, extra]) => `<li><strong>${title}</strong><p>${text}</p>${extra}<p class="method-step-links">${links.map(([label, url]) => `<a href="${href(url)}">${escape(label)}</a>`).join('')}</p></li>`).join('');
  const states = stateOrder.map(state => `<div><dt>${stateBadge(state)}</dt><dd>${escape(stateDescriptions[state])}</dd></div>`).join('');
  const elements = cast ? cast.coordinationElements.map(element => `<li>${escape(element.label)}</li>`).join('') : '';
  const laws = (data.reporting?.comparisons || []).map(comparison => `<li><a href="${comparisonRoute(data, comparison)}">${escape(comparison.title)}</a>${draftTag(comparison)}<span class="method-law-scope">${escape(comparison.scope)}</span></li>`).join('');
  return `<article class="case-page method-page">
    <header class="case-page-header"><h2 id="page-title" tabindex="-1">How this case was built</h2><p>The Explorer uses one method throughout: CAST, Causal Analysis based on System Theory, from Nancy Leveson’s group at MIT. With CAST, investigators trace how the controls around an accident failed to prevent it, and look beyond the last mistake. Every case follows the same five steps, so the next incident can be compared with this one.</p></header>
    <section class="method-section" aria-labelledby="method-steps-title"><h3 id="method-steps-title">The five steps</h3><ol class="method-steps">${stepMarkup}</ol></section>
    <section class="method-section" aria-labelledby="method-states-title"><h3 id="method-states-title">Safeguard states</h3><dl class="method-statuses">${states}</dl>
      <p class="method-credit">The four states come from Alexander (Zan) Saeri’s draft briefing on this incident for the MIT AI Risk Initiative. So does the point that most of the safeguards that mattered were in place rather than missing. The safeguard rows use the draft MIT AI Risk Mitigation Taxonomy as labels.</p></section>
    ${cast ? `<section class="method-section" aria-labelledby="method-coordination-title"><h3 id="method-coordination-title">Coordination</h3>
      <p>Kip Johnson’s <a href="${href(cast.method.coordination.url)}" target="_blank" rel="noopener noreferrer">CAST-Coordination</a> (MIT, ${cast.method.coordination.year}), developed under Leveson, adds steps for parties that depend on each other. He tested it on the 2003 shootdown of an RAF Tornado by a US Patriot battery, where two units shared airspace without adequate coordination. It checks nine elements:</p>
      <ul class="method-elements">${elements}</ul>
      <p>It sorts each failure into one of four types: coordination was missing, inadequate, itself the cause of the hazard, or set up too late.</p></section>` : ''}
    <section class="method-section" aria-labelledby="method-why-title"><h3 id="method-why-title">Why CAST?</h3>
      <p>Reporting schemes set out what a report should contain. Examples include the OECD’s common reporting framework, the EU’s serious-incident template, and California’s SB 53. None of them says how to investigate. CAST does. It has been used on accidents in aviation, nuclear power, and healthcare, and on cyber breaches. Carnegie Mellon’s Software Engineering Institute has applied it to 100 incidents in the AI Incident Database, and the US Nuclear Regulatory Commission tested it with its own staff.</p></section>
    ${laws ? `<section class="method-section" aria-labelledby="method-laws-title"><h3 id="method-laws-title">Laws compared</h3><ul class="method-laws">${laws}</ul><p class="case-page-note">Comparisons marked Draft were prepared from the legal texts for expert review. They are not legal advice.</p></section>` : ''}
    <section class="method-section" aria-labelledby="method-limits-title"><h3 id="method-limits-title">What the Explorer does not do</h3><ul class="method-limits"><li>It does not verify claims independently. “Public account” means that a cited source reports the claim.</li><li>It does not make legal findings or decide whether any organization complied with a law.</li><li>It does not assign a severity category or settle disputed motives.</li></ul></section>
    <section class="method-section" aria-labelledby="method-sources-title"><h3 id="method-sources-title">Sources for the method</h3><ul class="method-sources">
      <li><a href="https://psas.scripts.mit.edu/home/materials/" target="_blank" rel="noopener noreferrer">MIT Partnership for Systems Approaches to Safety and Security: STAMP, STPA, and CAST materials, including the CAST Handbook</a></li>
      <li><a href="https://dspace.mit.edu/handle/1721.1/108922" target="_blank" rel="noopener noreferrer">Kip E. Johnson (2017), Systems-theoretic safety analyses extended for coordination, MIT PhD thesis</a></li>
      <li><a href="https://psas.scripts.mit.edu/home/wp-content/uploads/2025/2025-03-26-0920__Applications_of_CAST_to_AI_Incidents_to_Mitig__PUB.pdf" target="_blank" rel="noopener noreferrer">Walsh, Schulker, and Davison (2025), Applications of CAST to AI incidents, Carnegie Mellon SEI</a></li>
      <li><a href="https://www.nrc.gov/docs/ML2227/ML22277A013.pdf" target="_blank" rel="noopener noreferrer">John Thomas (2021), Investigation of the use of CAST, report for the US Nuclear Regulatory Commission</a></li>
    </ul></section>
    <section class="method-section" aria-labelledby="method-version-title"><h3 id="method-version-title">Version ${explorerVersion.number}, ${explorerVersion.date}</h3><ul class="method-limits"><li>One method, CAST, replaces the OECD field-by-field mapping.</li><li>The safeguard matrix is back, with Zan Saeri’s four states.</li><li>New: what each organization did and knew, and where coordination broke down.</li><li>The Brief now shows, law by law, whether a report was owed.</li></ul></section>
  </article>`;
}

export function bindGapFilters(root) {
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-controller-filter]');
    if (!button) return;
    const section = button.closest('.cast-step');
    for (const other of section.querySelectorAll('[data-controller-filter]')) other.setAttribute('aria-pressed', String(other === button));
    section.dataset.openOnly = String(button.dataset.controllerFilter === 'open');
  });
}
