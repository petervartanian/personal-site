const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function resolveFinding(data, current) {
  const findings = data.findings || [];
  if (current.view === 'controls') return findings.find(item => item.controlIds.includes(current.itemId)) || findings[0];
  return findings.find(item => item.id === current.itemId || item.questionId === current.itemId) || findings[0];
}

function sourceLinks(data, finding, item, routeFor) {
  return (item.sourceIds || []).map(sourceId => {
    const source = data.sources.find(entry => entry.id === sourceId);
    if (!source) return '';
    return `<a class="citation claim-citation" data-claim="${escape(item.id)}" href="${escape(routeFor('findings', finding.id, sourceId, undefined, {claim:item.id,compare:false}))}" aria-label="Read ${escape(source.publisher)} on this finding">${escape(source.publisher)}</a>`;
  }).join(' ');
}

export function findingsSelection(data, current, routeFor) {
  const selected = resolveFinding(data, current);
  if (!selected) return '';
  const groups = [
    {scope:'case', label:'In this incident'},
    {scope:'application', label:'In another setting'},
  ].map(group => ({ ...group, items:data.findings.filter(item => item.scope === group.scope) })).filter(group => group.items.length);
  const picker = `<div class="findings-picker"><label for="findings-picker">Question</label><select id="findings-picker">${groups.map(group => `<optgroup label="${group.label}">${group.items.map(item => `<option value="${escape(item.id)}"${item.id === selected.id ? ' selected' : ''}>${escape(item.question)}</option>`).join('')}</optgroup>`).join('')}</select></div>`;
  const choices = groups.map(group => `<section class="finding-group finding-group-${group.scope}">${group.scope === 'application' ? `<h2>${group.label}</h2>` : ''}<ul class="findings-choices" aria-label="${group.label}">${group.items.map(item => `<li><a class="finding-choice" href="${escape(routeFor('findings', item.id))}"${item.id === selected.id ? ' aria-current="true"' : ''}><span class="finding-choice-title">${escape(item.title)}</span><span class="finding-choice-summary">${escape(item.cardSummary)}</span></a></li>`).join('')}</ul></section>`).join('');
  return `<div class="findings-selection is-compact">${picker}${choices}</div>`;
}

function legacyControlAnalysis(data, current, routeFor) {
  const control = data.controls.find(item => item.id === current.itemId);
  if (!control) return '';
  const labels = {held:'Worked',failed:'Failed',absent:'Absent',disabled:'Off',unknown:'Unknown'};
  const source = sourceId => {
    const item = data.sources.find(entry => entry.id === sourceId);
    return item ? `<a class="citation" href="${escape(routeFor('controls',control.id,sourceId))}">${escape(item.publisher)}</a>` : '';
  };
  const related = data.findings.filter(item => item.controlIds.includes(control.id));
  const logos = {OpenAI:'openai.png','Hugging Face':'hugging-face.svg',Modal:'modal.svg'};
  const owner = `<span class="organization-name">${logos[control.owner] ? `<img class="organization-logo" src="assets/${logos[control.owner]}" width="22" height="22" alt="">` : ''}${escape(control.owner)}</span>`;
  const change = control.reportedChange ? `<p class="finding-reported-change"><strong>Reported change.</strong> ${escape(control.reportedChange.text)} ${source(control.reportedChange.sourceId)}</p>` : '';
  return `<article class="finding-analysis control-finding"><div class="detail-context"><span class="state state-${escape(control.state)}">${labels[control.state] || 'Unknown'}</span>${owner}</div><h2 id="analysis-title" tabindex="-1">${escape(control.title)}</h2><p class="finding-answer" data-claim="summary">${escape([control.summary,control.detail || control.explanation].filter(Boolean).join(' '))}</p>${change}<section class="finding-decision"><h3>Option to evaluate</h3><p>${escape(control.option)}</p>${control.implication ? `<p>${escape(control.implication)}</p>` : ''}</section><section class="finding-next"><h3>What would establish that it works?</h3><p>${escape(control.verification)}</p></section><nav class="finding-related" aria-label="Related findings">${related.map(item => `<a href="${escape(routeFor('findings',item.id))}">${escape(item.title)}</a>`).join('')}</nav></article>`;
}

export function findingsAnalysis(data, current, routeFor) {
  if (current.view === 'controls') return legacyControlAnalysis(data,current,routeFor);
  const finding = resolveFinding(data,current);
  if (!finding) return '';
  const facts = finding.supportedClaims.map(claim => `<p class="finding-supported-claim" data-claim="${escape(claim.id)}">${escape(claim.text)} <span class="finding-claim-sources">${sourceLinks(data,finding,claim,routeFor)}</span></p>`).join('');
  const changes = finding.changes.length ? `<div class="finding-changes">${finding.changes.map(change => `<p data-claim="${escape(change.id)}"><strong>${change.status === 'reported' ? 'Reported change.' : 'Proposed change.'}</strong> ${escape(change.text)}${change.sourceIds.length ? ` <span class="finding-claim-sources">${sourceLinks(data,finding,change,routeFor)}</span>` : ''}</p>`).join('')}</div>` : '';
  const needs = finding.nextEvidence.map(item => `<li><p>${escape(item.text)}</p><p class="finding-request-purpose">${escape(item.decisionEffect)}</p><span class="finding-holder">${escape(item.holder)}</span></li>`).join('');
  const controls = finding.controlIds.map(id => data.controls.find(item => item.id === id)).filter(Boolean);
  const relatedControls = controls.length ? `<nav class="finding-controls" aria-label="Related safeguards">${controls.map(control => `<a href="${escape(routeFor('controls',control.id))}">${escape(control.title)}</a>`).join('')}</nav>` : '';
  const events = finding.eventIds.map(id => data.events.find(item => item.id === id)).filter(Boolean);
  const relatedEvents = events.length ? `<nav class="finding-events" aria-label="Related events">${events.map(event => `<a href="${escape(routeFor('events',event.id))}"><time>${escape(event.date)}</time> ${escape(event.label)}</a>`).join('')}</nav>` : '';
  const systems = finding.relationshipIds.map(id => data.controlRelationships.find(item => item.id === id)).filter(Boolean);
  const relatedSystems = systems.length ? `<nav class="finding-systems" aria-label="Related system relationships">${systems.map(item => `<a href="${escape(routeFor('controlRelationships',item.id))}">${escape(item.title || item.controller)}</a>`).join('')}</nav>` : '';
  const fields = data.reporting?.fields?.filter(field => field.questionIds.includes(finding.questionId)) || [];
  const preferredField = data.reporting?.questionReferences?.[finding.questionId]?.find(id => fields.some(field => field.id === id)) || fields[0]?.id;
  const reportingLink = preferredField ? `<a href="${escape(routeFor('findings',finding.id,undefined,preferredField))}">Reporting fields for this question</a>` : '';
  const legalLinks = (data.reporting?.comparisons || []).filter(item => item.questionId === finding.questionId).map(item => `<a href="${escape(routeFor('findings',finding.id,undefined,item.id))}">${escape(item.title)}</a>`).join('');
  const references = reportingLink || legalLinks ? `<nav class="finding-reporting" aria-label="Reporting references">${reportingLink}${legalLinks}</nav>` : '';
  return `<article class="finding-analysis"><h2 id="analysis-title" tabindex="-1">${escape(finding.question)}</h2><p class="finding-answer" data-claim="answer">${escape(finding.answer)}</p><section class="finding-decision is-lead"><h3>What this changes</h3><p>${escape(finding.decision)}</p>${changes}${finding.conditions ? `<p class="finding-conditions">${escape(finding.conditions)}</p>` : ''}</section><section class="finding-evidence"><h3>What the sources establish</h3><div class="finding-supported-claims">${facts}</div></section>${relatedControls}<section class="finding-next"><h3>What would resolve the remaining uncertainty?</h3><ul>${needs}</ul></section>${relatedEvents}${relatedSystems}${references}</article>`;
}
