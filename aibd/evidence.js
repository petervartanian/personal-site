(function () {
  'use strict';
  if (!window.HTMLDialogElement) return;
  var dialog = document.createElement('dialog');
  dialog.className = 'source-preview';
  dialog.setAttribute('aria-labelledby', 'source-preview-title');
  dialog.innerHTML = '<header><h2 id="source-preview-title"></h2><button type="button" aria-label="Close source">×</button></header><div class="source-preview-body"></div><footer><a class="source-preview-reference">Full reference</a></footer>';
  document.body.appendChild(dialog);
  var trigger = null;
  var referenceTarget = null;
  var body = dialog.querySelector('.source-preview-body');
  var reference = dialog.querySelector('.source-preview-reference');
  dialog.querySelector('button').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', function () {
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    var destination = referenceTarget || trigger;
    referenceTarget = null;
    if (destination) destination.focus({preventScroll: true});
  });
  reference.addEventListener('click', function () {
    referenceTarget = document.getElementById(reference.hash.slice(1));
    if (referenceTarget) referenceTarget.setAttribute('tabindex', '-1');
    dialog.close();
  });
  document.querySelectorAll('[data-source-preview]').forEach(function (link) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-expanded', 'false');
    link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var source = document.getElementById(link.hash.slice(1));
      if (!source) return;
      event.preventDefault();
      trigger = link;
      body.replaceChildren();
      Array.from(source.children).forEach(function (child) {
        var copy = child.cloneNode(true);
        copy.removeAttribute('id');
        if (copy.hasAttribute('data-source-passages')) copy.hidden = false;
        body.appendChild(copy);
      });
      var label = link.closest('.benefit-item')?.querySelector('.benefit-title')?.textContent.trim()
        || link.closest('.field-row')?.querySelector('dt')?.textContent.trim();
      dialog.querySelector('h2').textContent = label ? 'Source for ' + label.toLowerCase() : 'Source';
      reference.href = link.hash;
      link.setAttribute('aria-expanded', 'true');
      dialog.showModal();
    });
  });
}());
