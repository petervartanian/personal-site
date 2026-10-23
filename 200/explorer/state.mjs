export const views = Object.freeze([
  { id: 'events', label: 'What happened?', selectionLabel: 'Chronology' },
  { id: 'causes', label: 'How did it happen?', selectionLabel: 'Explanations' },
  { id: 'controls', label: 'What affected the outcome?', selectionLabel: 'Safeguards' },
  { id: 'questions', label: 'What is still unknown?', selectionLabel: 'Investigative questions' },
]);

export function readRoute(hash, data, remembered = {}) {
  let parts;
  try { parts = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent); }
  catch { parts = []; }
  const view = views.some(v => v.id === parts[0]) ? parts[0] : 'events';
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
