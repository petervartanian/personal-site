(function () {
  'use strict';
  // Copy the printed reference; select it when the clipboard is unavailable.
  var status = document.querySelector('[data-copy-status]');
  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', async function () {
      var text = document.getElementById(button.dataset.copy);
      if (!text) return;
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text.textContent.trim());
        if (status) status.textContent = 'Copied.';
      } catch (error) {
        var range = document.createRange();
        range.selectNodeContents(text);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        if (status) status.textContent = 'The reference is selected. Copy it with your keyboard or the selection menu.';
      }
    });
  });
}());
