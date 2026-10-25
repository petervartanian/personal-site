export const views = Object.freeze([
  { id: 'events', label: 'What happened?', selectionLabel: 'Chronology' },
  { id: 'framework', label: 'How did it happen?', selectionLabel: 'Connections across the incident' },
  { id: 'controlRelationships', label: 'How did it happen?', selectionLabel: 'Control relationships', navigationId: 'framework' },
  { id: 'causes', label: 'How did it happen?', selectionLabel: 'Contributing factors', navigationId: 'framework' },
  { id: 'controls', label: 'What affected the outcome?', selectionLabel: 'Safeguards' },
  { id: 'questions', label: 'What do we still need to know?', selectionLabel: 'Investigative questions' },
]);

export const navigationViews = Object.freeze(views.filter(v => !v.navigationId));

export function navigationIdFor(route) {
  if (route.view === 'framework' && route.itemId === 'account-overview') return 'events';
  if (route.storyId === 'all-connections') return 'framework';
  const definition = views.find(v => v.id === route.view);
  return definition?.navigationId || route.view;
}

export const causeConceptIds = Object.freeze({
  'boundary-crossing': 'cause-isolation-bypass',
  'data-to-execution': 'cause-dataset-processing',
  'collective-goals': 'cause-agent-motives',
  'response-escalation': 'cause-warning-escalation',
});

export function readRoute(hash, data, remembered = {}) {
  let parts;
  try { parts = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent); }
  catch { parts = []; }
  if (parts[0] === 'causes' && data.framework?.some(i => i.id === causeConceptIds[parts[1]])) parts.splice(0, 2, 'framework', causeConceptIds[parts[1]]);
  const view = views.some(v => v.id === parts[0]) && data[parts[0]]?.length ? parts[0] : data.framework?.length ? 'framework' : 'events';
  const items = data[view];
  if (view === 'framework' && parts[0] === 'framework' && !parts[1]) parts[1] = 'all-connections';
  const requestedId = view === 'questions' && parts[1] === 'cross-border-response' ? 'cross-organization-response' : parts[1];
  const rememberedId = remembered[view];
  const item = items.find(i => i.id === requestedId) || items.find(i => i.id === rememberedId) || items[0];
  const defaultSource = item.id === 'account-overview' ? item.sourceRefs.find(ref => ref.supports.split(',').map(value => value.trim()).includes('explanation'))?.sourceId : undefined;
  const sourceId = item.sourceIds.includes(parts[2]) ? parts[2] : defaultSource || item.sourceIds[0];
  const story = data.framework?.find(s => s.id === parts[3] && s.type === 'story');
  const storyId = story && (
    (['events', 'controls', 'questions'].includes(view) && story.id === 'all-connections')
    || (view === 'framework' && item.type !== 'story' && story.conceptIds?.includes(item.id))
    || (view === 'controlRelationships' && story.relationshipIds?.includes(item.id))
  ) ? story.id : null;
  const legalReference = data.reporting?.comparisons?.some(comparison => comparison.questionId === item.id &&
    (comparison.id === parts[3] || comparison.requirements.some(row => `${comparison.id}--${row.id}` === parts[3])));
  const reportingFieldId = view === 'questions' && (data.reporting?.fields?.some(field => field.id === parts[3]) || legalReference) ? parts[3] : null;
  return { view, itemId: item.id, sourceId, ...(storyId ? { storyId } : {}), ...(reportingFieldId ? { reportingFieldId } : {}) };
}

export function routeFor(view, itemId, sourceId, storyId) {
  return '#/' + [view, itemId, sourceId || (storyId ? '_' : null), storyId].filter(Boolean).map(encodeURIComponent).join('/');
}

export function selectSourceRef(item, sourceId) {
  return item.sourceRefs?.find(ref => ref.sourceId === sourceId) || { sourceId };
}

export function caseRouteFor(caseId, view, itemId, sourceId, storyId) {
  return '#/cases/' + encodeURIComponent(caseId) + '/' + routeFor(view, itemId, sourceId, storyId).slice(2);
}

export function readLocation(hash, catalog) {
  let parts;
  try { parts = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent); }
  catch { return { screen: 'home' }; }
  if (parts[0] === 'compare') {
    const caseIds = [...new Set(parts.slice(1))].filter(id => catalog.some(d => d.case.id === id));
    return caseIds.length > 1 ? { screen: 'compare', caseIds } : { screen: 'home' };
  }
  if (parts[0] === 'cases') {
    if (!catalog.some(d => d.case.id === parts[1])) return { screen: 'home' };
    return { screen: 'case', caseId: parts[1], hash: '#/' + parts.slice(2).map(encodeURIComponent).join('/') };
  }
  if (views.some(v => v.id === parts[0]) && catalog.some(d => d.case.id === 'hugging-face-1604')) return { screen: 'case', caseId: 'hugging-face-1604', hash };
  return { screen: 'home' };
}

export function comparisonRoute(ids) {
  return '#/compare/' + [...new Set(ids)].map(encodeURIComponent).join('/');
}
