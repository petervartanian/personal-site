(function () {
  'use strict';
  var form = document.querySelector('[data-contribution]');
  if (!form) return;
  var params = new URLSearchParams(location.search);
  var labels = {source: 'Original source', correction: 'Correction', followup: 'Later result', new: 'New benefit'};
  var fields = form.elements;
  var draft = document.querySelector('[data-contribution-draft]');
  var text = draft.querySelector('[data-contribution-body]');
  var status = draft.querySelector('[data-contribution-status]');
  var email = draft.querySelector('[data-contribution-email]');
  var submission = draft.querySelector('[data-contribution-submit]');
  var kind = params.get('kind');
  if (labels[kind]) fields.kind.value = kind;
  fields.case.value = params.get('case') || '';
  function updateKind() { fields.source.required = fields.kind.value !== 'correction'; }
  updateKind();
  fields.kind.addEventListener('change', updateKind);
  form.addEventListener('input', function () { draft.hidden = true; });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var caseText = fields.case.value.trim();
    var match = caseText.match(/^(?:AIBD-|[№#]\s*)?(\d{1,4})$/i);
    var id = match ? 'AIBD-' + match[1].padStart(4, '0') : caseText;
    var subject = 'AIBD ' + labels[fields.kind.value].toLowerCase() + (id ? ': ' + id : '');
    var lines = [labels[fields.kind.value], id ? 'Entry: ' + id : '', '', fields.body.value.trim(), '', 'Source: ' + (fields.source.value.trim() || 'Not supplied')];
    if (fields.locator.value.trim()) lines.push('Location in the source: ' + fields.locator.value.trim());
    if (fields.who.value.trim()) lines.push('', 'Credit: ' + fields.who.value.trim());
    text.value = lines.join('\n');
    email.href = 'mailto:' + form.dataset.contact + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text.value);
    if (submission) {
      var address = new URL(form.dataset.submissionUrl);
      address.searchParams.set('title', subject);
      address.searchParams.set('body', text.value);
      submission.href = address.href;
    }
    draft.hidden = false;
    status.textContent = 'The draft is ready. Nothing has been sent. GitHub assigns a tracking number after you submit it there.';
    text.focus({preventScroll: true});
    draft.scrollIntoView({block: 'nearest', behavior: 'auto'});
  });
  draft.querySelector('[data-contribution-copy]').addEventListener('click', async function () {
    try {
      await navigator.clipboard.writeText(text.value);
      status.textContent = 'Copied.';
    } catch (_) {
      text.focus(); text.select();
      status.textContent = 'The draft is selected for copying.';
    }
  });
  var download = draft.querySelector('[data-contribution-download]');
  if (download) download.addEventListener('click', function () {
    var url = URL.createObjectURL(new Blob([text.value + '\n'], {type: 'text/plain;charset=utf-8'}));
    var link = document.createElement('a');
    link.href = url; link.download = 'aibd-contribution.txt';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });
}());
