const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const href = value => /^(?:https?:\/\/|#|\/[^/])/.test(String(value ?? '')) ? escape(value) : '#';

export function comparisonForReference(reportingData, referenceId, questionId) {
  return reportingData?.comparisons?.find(item => item.questionId === questionId &&
    (referenceId === item.id || item.requirements.some(row => referenceId === `${item.id}--${row.id}`))) || null;
}

function comparisonMarkup(comparison, referenceId, picker, caseData) {
  const selected = comparison.requirements.find(row => referenceId === `${comparison.id}--${row.id}`);
  const choices = `<option value="${escape(comparison.id)}"${selected ? '' : ' selected'}>Scope and significance</option>${comparison.requirements.map(row => `<option value="${escape(`${comparison.id}--${row.id}`)}"${row === selected ? ' selected' : ''}>${escape(row.title)}</option>`).join('')}`;
  const refs = selected ? selected.sourceRefs : [...comparison.applicability.sourceRefs, ...comparison.significance.sourceRefs];
  const sourceById = new Map([...caseData.sources, ...comparison.sources].map(source => [source.id, source]));
  const sources = refs.map(ref => `<li><a href="${href(ref.url)}" target="_blank" rel="noopener noreferrer">${escape(sourceById.get(ref.sourceId)?.title || ref.sourceId)}</a><span class="reporting-source-locator">${escape(ref.locator)}</span></li>`).join('');
  const fact = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`;
  const detail = selected
    ? `<h3 class="reporting-stage-heading">${escape(selected.title)}</h3><p class="reporting-deadline">${escape(selected.deadline)}<span>To: ${escape(selected.recipient)}</span></p><dl class="reporting-facts">${fact('Required information', selected.requirement)}${fact('What the case provides', selected.availableInformation)}${fact('What to establish', selected.informationNeeded)}${fact('Information to request', selected.request)}${fact('Decision', selected.decision)}</dl>`
    : `<dl class="reporting-facts">${fact('Who is covered?', comparison.applicability.informationNeeded)}${fact('Jurisdiction', comparison.applicability.jurisdiction)}${fact(comparison.significance.title, comparison.significance.requirement)}${fact('Information needed', comparison.significance.informationNeeded)}</dl><p class="reporting-interpretation">${escape(comparison.significance.caseGap)}</p>`;
  const draft = comparison.draft ? '<p class="draft-notice"><span class="draft-tag">Draft</span> Prepared from the legal text for expert review. Not legal advice.</p>' : '';
  return `<section class="reporting-inventory legal-comparison">${picker}<h2 id="analysis-title" tabindex="-1">${escape(comparison.title)}</h2>${draft}<p class="reporting-comparison-scope">${escape(comparison.scope)} ${escape(comparison.applicability.summary)}</p><div class="reporting-field-picker reporting-stage-picker"><label for="reporting-stage-select">Requirement</label><select id="reporting-stage-select" data-reporting-field-select>${choices}</select></div>${detail}<section class="reporting-sources"><h3>Legal sources and case references</h3><ul>${sources}</ul></section><p class="reporting-interpretation">${escape(selected ? comparison.confidentiality : comparison.interpretation)}</p></section>`;
}

/** The legal comparison selected for a question, with a picker across the laws compared. */
export function reportingInventoryMarkup(reportingData, caseData, routeFor, { questionId, fieldId } = {}) {
  if (reportingData?.caseId !== caseData?.case?.id) return '';
  const comparison = comparisonForReference(reportingData, fieldId, questionId);
  if (!comparison) return '';
  const comparisons = reportingData.comparisons.filter(item => item.questionId === questionId);
  const picker = `<div class="reporting-field-picker"><label for="reporting-field-select">Law</label><select id="reporting-field-select" data-reporting-field-select>${comparisons.map(item => `<option value="${escape(item.id)}"${item === comparison ? ' selected' : ''}>${escape(item.title)}</option>`).join('')}</select></div>`;
  return comparisonMarkup(comparison, fieldId, picker, caseData);
}
