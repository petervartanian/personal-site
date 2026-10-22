'use strict';
document.querySelectorAll('[data-copy]').forEach(button => {button.hidden=false;});
const trendButtons=[...document.querySelectorAll('[data-trend]')];
const trendPanes=[...document.querySelectorAll('[data-trend-pane]')];
function selectTrend(id) {
 if(!trendPanes.some(pane=>pane.dataset.trendPane===id)) return;
 trendButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.trend===id)));
 trendPanes.forEach(pane=>{pane.hidden=pane.dataset.trendPane!==id;});
}
if(trendButtons.length) {
 selectTrend(trendButtons[0].dataset.trend);
 trendButtons.forEach(button=>{button.disabled=false;button.addEventListener('click',()=>selectTrend(button.dataset.trend));});
}
document.addEventListener('click', async event => {
 const button=event.target.closest('[data-copy]'); if(!button) return;
 const target=document.getElementById(button.dataset.copy);
 const status=document.getElementById('copy-feedback');
 try {if(!navigator.clipboard?.writeText) throw Error('unavailable');
 await navigator.clipboard.writeText(target.textContent); status.textContent='Wording copied.';
 } catch (_) {const range=document.createRange(); range.selectNodeContents(target);
 const selection=window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
 status.textContent='Wording selected. Press Command+C on Mac or Ctrl+C on Windows to copy.';}
 setTimeout(()=>{status.textContent='';},6500);
});
