'use strict';

(() => {
  const config = document.getElementById('arcolens-guide-config');
  if (!config || document.getElementById('arcolens-guide')) return;
  const { steps } = JSON.parse(config.textContent);
  const main = document.querySelector('main');
  let current = 0;
  let target;
  let returnFocus;

  function element(tag, text, attributes = {}) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  const launcher = element('button', undefined, {
    type: 'button', class: 'guide-launcher', 'aria-label': 'Open five-step guide',
    'aria-controls': 'arcolens-guide', 'aria-expanded': 'false',
  });
  launcher.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .3c0 1.7-2.5 1.9-2.5 3.7"/><path d="M12 16v.5"/></svg><span>Guide</span>';
  const card = element('aside', undefined, {
    id: 'arcolens-guide', class: 'guide-card', role: 'dialog',
    'aria-labelledby': 'guide-title', 'aria-describedby': 'guide-description',
    tabindex: '-1',
  });
  card.hidden = true;
  const header = element('div', undefined, { class: 'guide-card-header' });
  const counter = element('span', undefined, { class: 'guide-counter' });
  const close = element('button', '×', {
    type: 'button', class: 'guide-close', 'aria-label': 'Close guide',
  });
  header.append(counter, close);
  const title = element('h2', undefined, { id: 'guide-title' });
  const description = element('p', undefined, { id: 'guide-description' });
  const resource = element('a', undefined, { class: 'guide-resource', 'data-preserve-mode': '' });
  const controls = element('div', undefined, { class: 'guide-controls' });
  const back = element('button', 'Back', { type: 'button', class: 'guide-back' });
  const next = element('button', 'Next', { type: 'button', class: 'guide-next' });
  controls.append(back, next);
  card.append(header, title, description, resource, controls);
  document.body.append(launcher, card);

  function stepNumber() {
    const value = new URL(location.href).searchParams.get('guide');
    return /^[1-5]$/.test(value || '') ? Number(value) : 0;
  }

  function activeMode() {
    return document.body.dataset.analysisMode === 'workbench' ? 'monitor' : 'review';
  }

  function stepURL(number) {
    const step = steps[number - 1];
    const url = new URL(step.page, location.href);
    url.searchParams.set('mode', step.mode || activeMode());
    url.searchParams.set('guide', number);
    return url;
  }

  function unhighlight() {
    if (target) target.classList.remove('guide-target');
    target = null;
  }

  function position() {
    const height = Math.ceil(card.getBoundingClientRect().height);
    document.body.style.setProperty('--guide-space', `${height + 32}px`);
  }

  function show(number) {
    current = number;
    const step = steps[number - 1];
    if (new URL(step.page, location.href).pathname !== location.pathname) {
      location.assign(stepURL(number));
      return;
    }
    unhighlight();
    counter.textContent = `${number} of ${steps.length}`;
    title.textContent = step.title;
    description.textContent = step.text;
    resource.textContent = step.link[1];
    const url = new URL(step.link[0], location.href);
    if (url.pathname.endsWith('.html')) url.searchParams.set('mode', step.mode || activeMode());
    resource.href = url.href;
    back.disabled = number === 1;
    next.textContent = number === steps.length ? 'Finish' : 'Next';
    card.hidden = false;
    launcher.hidden = true;
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('guide-open');
    if (step.heading) {
      const heading = Array.from(main.querySelectorAll('h2')).find(
        (node) => node.textContent.trim() === step.heading,
      );
      target = heading?.closest('section');
    } else if (step.target === 'candidates') {
      target = main.querySelector('article > section, section.content-section');
    }
    target ||= main.querySelector('.page-head') || main;
    target.querySelectorAll('details').forEach(details => { details.open = true; });
    target.classList.add('guide-target');
    position();
    // Reserve space below the page so even its last section clears the card.
    requestAnimationFrame(() => {
      const appbar = document.querySelector('.appbar');
      const top = Math.max(24, (appbar?.getBoundingClientRect().height || 0) + 24);
      window.scrollBy({ top: target.getBoundingClientRect().top - top, behavior: 'instant' });
      card.focus({ preventScroll: true });
    });
  }

  function go(number) {
    const url = stepURL(number);
    if (url.pathname === location.pathname && url.searchParams.get('mode') === activeMode()) {
      history.pushState(null, '', url);
      show(number);
    } else {
      location.assign(url);
    }
  }

  function dismiss() {
    unhighlight();
    card.hidden = true;
    launcher.hidden = false;
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('guide-open');
    document.body.style.removeProperty('--guide-space');
    const url = new URL(location.href);
    url.searchParams.delete('guide');
    history.replaceState(null, '', url);
    (returnFocus?.isConnected ? returnFocus : launcher).focus({ preventScroll: true });
  }

  launcher.addEventListener('click', () => {
    returnFocus = document.activeElement;
    go(1);
  });
  close.addEventListener('click', dismiss);
  back.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => {
    if (current === steps.length) dismiss();
    else go(current + 1);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !card.hidden) {
      event.preventDefault();
      dismiss();
    }
  });
  window.addEventListener('popstate', () => {
    const number = stepNumber();
    if (number) show(number);
    else dismiss();
  });
  window.addEventListener('resize', () => { if (!card.hidden) position(); });
  const initial = stepNumber();
  if (initial) show(initial);
})();
