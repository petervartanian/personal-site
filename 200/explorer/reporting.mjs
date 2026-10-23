const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const href = value => /^(?:https?:\/\/|#|\/[^/])/.test(String(value ?? '')) ? escape(value) : '#';

export function reportingFieldsForQuestion(reportingData, questionId) {
  if (!reportingData?.fields || !questionId) return [];
  const linked = reportingData.fields.filter(field => field.questionIds.includes(questionId));
  const priority = reportingData.questionReferences?.[questionId] || [];
  return [...priority.map(id => linked.find(field => field.id === id)).filter(Boolean), ...linked.filter(field => !priority.includes(field.id))];
}

export function reportingReferenceMarkup(reportingData, questionId, inventoryHref) {
  const fields = reportingFieldsForQuestion(reportingData, questionId);
  if (!fields.length) return '';
  const priority = reportingData.questionReferences?.[questionId] || [];
  const references = (priority.length ? fields.filter(field => priority.includes(field.id)) : fields.slice(0, 3));
  return `<div class="reporting-reference"><span class="reporting-reference-label">OECD reporting fields</span><span class="reporting-reference-fields">${references.map(field => `<span>${field.number}. ${escape(field.label)}</span>`).join('')}</span><a class="reporting-inventory-link" href="${href(inventoryHref)}">Reporting fields and requests</a></div>`;
}

export function reportingInventoryMarkup(reportingData, caseData, routeFor, { questionId, fieldId } = {}) {
  if (!reportingData?.fields?.length || reportingData.caseId !== caseData?.case?.id) return '';
  const fields = reportingData.fields;
  const relatedFields = reportingFieldsForQuestion(reportingData, questionId);
  const selected = fields.find(field => field.id === fieldId) || relatedFields[0] || fields[0];
  const relatedIds = new Set(relatedFields.map(field => field.id));
  const option = field => `<option value="${escape(field.id)}"${field.id === selected.id ? ' selected' : ''}>${field.number}. ${escape(field.label)}</option>`;
  const groups = new Map();
  for (const field of fields.filter(field => !relatedIds.has(field.id))) {
    if (!groups.has(field.dimension)) groups.set(field.dimension, []);
    groups.get(field.dimension).push(field);
  }
  const choices = `${relatedFields.length ? `<optgroup label="Related to this question">${relatedFields.map(option).join('')}</optgroup>` : ''}${[...groups].map(([dimension, items]) => `<optgroup label="${escape(dimension)}">${items.map(option).join('')}</optgroup>`).join('')}`;
  const status = reportingData.statuses[selected.status];
  const sources = selected.sourceRefs.map(ref => {
    const source = caseData.sources.find(item => item.id === ref.sourceId);
    if (!source) return '';
    return `<li data-source-id="${escape(source.id)}"><a href="${href(ref.url || source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.publisher)}: ${escape(source.title)}</a><span class="reporting-source-locator">${escape(ref.locator)}</span>${ref.supports === 'context' ? '<span class="reporting-source-scope">Context for the question; this source does not establish a value for this field.</span>' : ''}</li>`;
  }).join('');
  const events = selected.eventIds.map(id => caseData.events.find(event => event.id === id)).filter(Boolean);
  const questions = selected.questionIds.filter(id => id !== questionId).map(id => caseData.questions.find(question => question.id === id)).filter(Boolean);
  const framework = reportingData.framework;
  const officialLinks = `<a href="${href(`${framework.pdfUrl}#page=${selected.tablePage}`)}" target="_blank" rel="noopener noreferrer">OECD Table 2.2, page ${selected.tablePage}</a><a href="${href(`${framework.pdfUrl}#page=${selected.annexPage}`)}" target="_blank" rel="noopener noreferrer">Annex B, page ${selected.annexPage}</a>`;
  return `<section class="reporting-inventory">
    <div class="reporting-field-picker"><label for="reporting-field-select">Reporting field</label><select id="reporting-field-select" data-reporting-field-select>${choices}</select></div>
    <h2 id="analysis-title" tabindex="-1">${selected.number}. ${escape(selected.label)}</h2>
    <p class="reporting-field-meta"><span>${escape(selected.dimension)}</span><span>${escape(selected.answerFormat)}</span>${selected.requiredByFramework ? '<span>Required in this framework</span>' : ''}<span class="reporting-status reporting-status-${escape(selected.status)}" title="${escape(status.description)}">${escape(status.label)}</span></p>
    <dl class="reporting-facts"><div><dt>Available information</dt><dd>${escape(selected.reportedInformation)}</dd></div><div><dt>Still needed</dt><dd>${escape(selected.informationNeeded)}</dd></div><div><dt>Who may hold it</dt><dd>${escape(selected.informationHolder)}</dd></div></dl>
    ${selected.interpretationNote ? `<p class="reporting-interpretation">${escape(selected.interpretationNote)}</p>` : ''}
    ${sources ? `<section class="reporting-sources"><h3>Case sources</h3><ul>${sources}</ul></section>` : ''}
    ${events.length ? `<nav class="reporting-events" aria-label="Related events">${events.map(event => `<a href="${href(routeFor('events', event.id))}">${escape(event.date)}: ${escape(event.label)}</a>`).join('')}</nav>` : ''}
    ${questions.length ? `<nav class="reporting-questions" aria-label="Related investigation questions">${questions.map(question => `<a href="${href(routeFor('questions', question.id, undefined, false))}">${escape(question.topic)}</a>`).join('')}</nav>` : ''}
    <footer class="reporting-framework"><p>${officialLinks}</p><p><a href="${href(framework.url)}" target="_blank" rel="noopener noreferrer">OECD (2025), ${escape(framework.title)}</a>. <a href="${href(framework.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(framework.license)}</a>. The case mapping is Explorer analysis. Framework requirements do not determine legal reporting duties.</p><small class="reporting-source-note">${escape(framework.adaptationNotice)}</small></footer>
  </section>`;
}
