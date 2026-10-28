// Safeguard states and the safeguard matrix. The four states (failed, held, switched off,
// absent) and their symbols follow Alexander (Zan) Saeri's draft AIRI briefing on this incident.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const stateOrder = Object.freeze(['failed', 'disabled', 'absent', 'held']);
export const stateNames = Object.freeze({ failed: 'Failed', disabled: 'Switched off', absent: 'Absent', held: 'Held', unknown: 'Unknown' });
export const stateDescriptions = Object.freeze({
  failed: 'In place, but did not stop the activity.',
  disabled: 'In place, but deliberately switched off.',
  absent: 'Not in place.',
  held: 'In place, and stopped or limited the activity.',
});

const paths = {
  held: '<path d="m5 12 4 4L19 6"/>',
  failed: '<path d="m6 6 12 12M18 6 6 18"/>',
  disabled: '<path d="M12 3v9m-6-6a8 8 0 1 0 12 0"/>',
  absent: '<circle cx="12" cy="12" r="8"/>',
  unknown: '<path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14m0 3h.01"/>',
};

export const stateIcon = state => `<svg class="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[state] || paths.unknown}</svg>`;

export const stateBadge = (state, label = stateNames[state] || stateNames.unknown) =>
  `<span class="state state-${escape(state)}">${stateIcon(state)}${escape(label)}</span>`;

const marks = { OpenAI: 'openai.png', 'Hugging Face': 'hugging-face.svg', Modal: 'modal.svg' };
const applicationMark = '<svg class="organization-logo application-mark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01m-1 6-2 2 2 2m6-4 2 2-2 2"/></svg>';
const authorityMark = '<svg class="organization-logo application-mark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10h18L12 4 3 10Zm2 0v8m4.5-8v8m5-8v8M19 10v8M3 20h18"/></svg>';

export const organizationMark = name => marks[name]
  ? `<img src="assets/${marks[name]}" class="organization-logo" width="22" height="22" alt="">`
  : name === 'Public authorities' ? authorityMark : name.includes('application') ? applicationMark : '';

export const organizationName = name => `<span class="organization-name">${organizationMark(name)}${escape(name)}</span>`;

/** Owners in the order of the control structure, then any others. */
export function controlOwners(data) {
  const ordered = (data.controlRelationships || []).map(item => item.controller.replace(/ (research and security|security and platform) teams$/, ''));
  const owners = [...new Set(data.controls.map(control => control.owner))];
  return [...ordered.filter(name => owners.includes(name)), ...owners.filter(name => !ordered.includes(name))];
}

export function stateSummary(data) {
  const count = state => data.controls.filter(control => control.state === state).length;
  const failed = count('failed'), off = count('disabled'), absent = count('absent'), held = count('held');
  const notHeld = failed + off + absent;
  const words = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const n = value => words[value] ?? String(value);
  const cap = text => text.charAt(0).toUpperCase() + text.slice(1);
  if (!notHeld) return `All ${n(held)} safeguards held.`;
  const inPlace = failed + off;
  const parts = [failed ? `${n(failed)} failed` : '', off ? `${n(off)} ${off === 1 ? 'was' : 'were'} switched off` : ''].filter(Boolean).join(' and ');
  return `${cap(n(inPlace))} of the ${n(notHeld)} safeguards that did not hold were in place: ${parts}. ${absent ? `${cap(n(absent))} ${absent === 1 ? 'was' : 'were'} absent. ` : ''}${held ? `${cap(n(held))} held.` : ''}`.trim();
}

export function stateLegend() {
  return `<ul class="state-legend" aria-label="Safeguard states">${stateOrder.map(state => `<li>${stateBadge(state)}<span>${escape(stateDescriptions[state])}</span></li>`).join('')}</ul>`;
}

/**
 * Safeguards by kind (rows, MIT mitigation taxonomy) and organization (columns, the controllers
 * in the CAST control structure). `link(control)` returns the URL for a safeguard.
 */
export function safeguardMatrix(data, { link, currentId, headingLevel = 2, heading = 'Safeguards across organizations' } = {}) {
  const owners = controlOwners(data);
  const categories = Object.entries(data.mitigationTaxonomy?.categories || {});
  const rows = categories.filter(([code]) => data.controls.some(control => control.classification?.code === code));
  const cell = (owner, code) => {
    const controls = data.controls.filter(control => control.owner === owner && control.classification?.code === code);
    if (!controls.length) return '<td><span class="matrix-empty" aria-label="No safeguard of this kind recorded for this organization">–</span></td>';
    return `<td>${controls.map(control => `<a class="matrix-control state-${escape(control.state)}" href="${escape(link(control))}"${control.id === currentId ? ' aria-current="true"' : ''}>${stateBadge(control.state)}<span class="matrix-control-name">${escape(control.title)}</span></a>`).join('')}</td>`;
  };
  const h = `h${headingLevel}`;
  return `<section class="safeguard-matrix" aria-labelledby="safeguard-matrix-title">
    <div class="matrix-heading"><${h} id="safeguard-matrix-title">${escape(heading)}</${h}><p>${escape(stateSummary(data))}</p></div>
    ${stateLegend()}
    <div class="matrix-scroll" role="region" aria-label="Safeguards by kind and organization" tabindex="0"><table>
      <thead><tr><th scope="col">Kind of safeguard</th>${owners.map(owner => `<th scope="col">${organizationName(owner)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(([code, category]) => `<tr><th scope="row"><span class="matrix-code">${escape(code)}</span>${escape(category.name)}</th>${owners.map(owner => cell(owner, code)).join('')}</tr>`).join('')}</tbody>
    </table></div>
    <p class="matrix-key">Rows use the draft MIT AI Risk Mitigation Taxonomy. States describe how each safeguard performed during the incident, as the cited accounts report it. A dash means that the accounts record no safeguard of that kind for that organization.</p>
  </section>`;
}
