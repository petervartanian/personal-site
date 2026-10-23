export const views = Object.freeze([
  { id: 'events', label: 'What happened?', selectionLabel: 'Chronology' },
  { id: 'controlRelationships', label: 'How did it happen?', selectionLabel: 'Control relationships' },
  { id: 'causes', label: 'How did it happen?', selectionLabel: 'Contributing factors', navigationId: 'controlRelationships' },
  { id: 'controls', label: 'What could change?', selectionLabel: 'Safeguards' },
  { id: 'questions', label: 'What do we need to know?', selectionLabel: 'Investigative questions' },
]);

export const navigationViews = Object.freeze(views.filter(v => !v.navigationId));

export function readRoute(hash, data, remembered = {}) {
  let parts;
  try { parts = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent); }
  catch { parts = []; }
  const view = views.some(v => v.id === parts[0]) && data[parts[0]]?.length ? parts[0] : 'events';
  const items = data[view];
  const requestedId = view === 'questions' && parts[1] === 'cross-border-response' ? 'cross-organization-response' : parts[1];
  const item = items.find(i => i.id === requestedId) || items.find(i => i.id === remembered[view]) || items[0];
  const sourceId = item.sourceIds.includes(parts[2]) ? parts[2] : item.sourceIds[0];
  return { view, itemId: item.id, sourceId };
}

export function routeFor(view, itemId, sourceId) {
  return '#/' + [view, itemId, sourceId].filter(Boolean).map(encodeURIComponent).join('/');
}

export function selectSourceRef(item, sourceId) {
  return item.sourceRefs?.find(ref => ref.sourceId === sourceId) || { sourceId };
}

export function caseRouteFor(caseId, view, itemId, sourceId) {
  return '#/cases/' + encodeURIComponent(caseId) + '/' + routeFor(view, itemId, sourceId).slice(2);
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
