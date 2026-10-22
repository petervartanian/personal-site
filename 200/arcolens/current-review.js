'use strict';
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const target = document.getElementById(button.dataset.copy);
  try {
    await navigator.clipboard.writeText(target.textContent);
    document.getElementById('copy-feedback').textContent = 'Wording copied.';
  } catch (_) {
    const range = document.createRange(); range.selectNodeContents(target);
    const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
    document.getElementById('copy-feedback').textContent = 'Text selected. Copy with your keyboard.';
  }
}));
const trendButtons = [...document.querySelectorAll('[data-trend]')];
function selectTrend(id) {
  trendButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.trend === id)));
  document.querySelectorAll('[data-trend-pane]').forEach(pane => { pane.hidden = pane.dataset.trendPane !== id; });
}
trendButtons.forEach(button => button.addEventListener('click', () => selectTrend(button.dataset.trend)));
if (trendButtons.length) selectTrend(trendButtons[0].dataset.trend);
