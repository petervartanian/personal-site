(() => {
  'use strict'
  const root = document.body
  const page = root.dataset.page
  const dataNode = document.getElementById('bc-data')
  const records = dataNode ? JSON.parse(dataNode.textContent).records : []
  const byId = Object.fromEntries(records.map(record => [record.id, record]))
  const topics = { learn: 'Learning', discover: 'Discovery', health: 'Health', safety: 'Safety' }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]))
  const $ = selector => root.querySelector(selector)
  const announce = message => { $('#bc-announcement').textContent = message }
  const sourceLink = record => `<a href="${esc(record.url)}" target="_blank" rel="noopener noreferrer">${esc(record.source)} <span aria-hidden="true">↗</span></a>`
  const changeURL = (values, replace = false) => {
    const url = new URL(location.href)
    url.search = ''
    url.hash = ''
    Object.entries(values).forEach(([key, value]) => { if (value) url.searchParams.set(key, value) })
    history[replace ? 'replaceState' : 'pushState']({}, '', url)
  }

  function outcome(record) {
    return `<p class="bc-outcome">${esc(record.outcome)}</p><p class="bc-beneficiaries">${esc(record.beneficiaries)}</p><dl class="bc-context"><div><dt>AI contribution</dt><dd>${esc(record.ai)}</dd></div><div><dt>Human contribution</dt><dd>${esc(record.people)}</dd></div></dl>`
  }

  function evidence(record) {
    return `<h3 class="bc-evidence-type">${esc(record.kind)}</h3><p class="bc-evidence-text">${esc(record.evidence)}</p><p class="bc-time">${esc(record.duration)}</p><div class="bc-visible-limit"><h3>Limits and disclosures</h3><p>${esc(record.limits)}</p></div>`
  }

  function replication(record, horizon) {
    const options = [['elsewhere', 'Another setting'], ['more', 'More people'], ['longer', 'A longer horizon']]
    return `<h3 class="bc-replication-head">Could this benefit travel?</h3><div class="bc-setting"><label for="bc-setting">Explore</label><select id="bc-setting">${options.map(([key, label]) => `<option value="${key}" ${key === horizon ? 'selected' : ''}>${label}</option>`).join('')}</select></div><ul class="bc-questions">${record.questions[horizon].map(question => `<li>${esc(question)}</li>`).join('')}</ul><p class="bc-research-note">Questions to investigate. Transfer has not been established.</p>`
  }

  if (page === 'explore') {
    const first = records.find(record => record.topic === 'learn') || records[0]
    let state = { topic: first.topic, selected: first.id, query: '', who: '', detail: 'outcome', horizon: 'elsewhere' }
    let oldHash = location.hash.slice(1)
    try { oldHash = decodeURIComponent(oldHash) } catch { /* Ignore malformed legacy links. */ }
    if (byId[oldHash]) {
      location.replace(byId[oldHash].path)
      return
    }
    if (['scale', 'methodology', 'method'].includes(oldHash)) {
      location.replace('/ai-benefits/method/')
      return
    }
    function readURL() {
      const params = new URLSearchParams(location.search)
      const requested = byId[params.get('record')]
      state = {
        topic: topics[params.get('topic')] ? params.get('topic') : requested?.topic || first.topic,
        selected: requested?.id || first.id,
        query: (params.get('q') || '').slice(0, 200),
        who: (params.get('who') || '').slice(0, 100),
        detail: ['outcome', 'evidence', 'replication'].includes(params.get('view')) ? params.get('view') : 'outcome',
        horizon: ['elsewhere', 'more', 'longer'].includes(params.get('horizon')) ? params.get('horizon') : 'elsewhere'
      }
      if (![...$('#bc-who').options].some(option => option.value === state.who)) state.who = ''
    }
    function matches() {
      const query = state.query.trim().toLowerCase()
      return records.filter(record => (!state.who || record.groups.includes(state.who)) && (!query || [record.title, record.place, record.system, record.outcome, record.beneficiaries, record.source, ...record.groups].join(' ').toLowerCase().includes(query)))
    }
    function reconcile() {
      const all = matches()
      let visible = all.filter(record => record.topic === state.topic)
      if (!visible.length && all.length) {
        state.topic = all[0].topic
        visible = all.filter(record => record.topic === state.topic)
      }
      if (visible.length && !visible.some(record => record.id === state.selected)) state.selected = visible[0].id
      return visible
    }
    function writeURL(replace = false) {
      changeURL({ topic: state.topic === first.topic ? '' : state.topic, record: state.selected === first.id ? '' : state.selected, q: state.query, who: state.who, view: state.detail === 'outcome' ? '' : state.detail, horizon: state.horizon === 'elsewhere' ? '' : state.horizon }, replace)
    }
    function render() {
      const visible = reconcile()
      const all = matches()
      $('#bc-search').value = state.query
      $('#bc-who').value = state.who
      $('#bc-clear').hidden = !state.query && !state.who
      $('#bc-search-status').textContent = state.query || state.who ? `${all.length} matching ${all.length === 1 ? 'record' : 'records'}` : ''
      root.querySelectorAll('[data-topic]').forEach(button => {
        const count = all.filter(record => record.topic === button.dataset.topic).length
        button.setAttribute('aria-pressed', String(button.dataset.topic === state.topic))
        button.disabled = count === 0
        button.querySelector('.bc-topic-count').textContent = count
        button.querySelector('.bc-topic-count').setAttribute('aria-label', `${count} records`)
      })
      const holder = $('#bc-record')
      if (!visible.length) {
        holder.innerHTML = '<div class="bc-empty"><h2>No matching records.</h2><p>Try another outcome, system, or beneficiary.</p><button type="button" data-reset>Clear filters</button></div>'
        return
      }
      const record = byId[state.selected]
      const index = visible.indexOf(record)
      holder.style.setProperty('--bc-topic', `var(--bc-${record.topic})`)
      const detail = state.detail === 'evidence' ? evidence(record) : state.detail === 'replication' ? replication(record, state.horizon) : outcome(record)
      const tabs = [['outcome', 'Outcome'], ['evidence', 'Evidence'], ['replication', 'Replication']]
      holder.innerHTML = `<div class="bc-record-heading"><h2>${esc(record.title)}</h2><p class="bc-place">${esc(record.place)}. ${esc(record.date)}</p></div><div class="bc-tabs" aria-label="Record detail">${tabs.map(([key, label]) => `<button type="button" data-detail="${key}" aria-pressed="${state.detail === key}">${label}</button>`).join('')}</div><div class="bc-detail">${detail}</div><div class="bc-source">${sourceLink(record)}<span>${esc(record.unit)}</span></div><div class="bc-record-actions"><a href="${esc(record.path)}">Full record <span aria-hidden="true">→</span></a><a href="/ai-benefits/compare/?left=${encodeURIComponent(record.id)}">Compare this result</a></div>${visible.length > 1 ? `<div class="bc-selector"><span class="bc-selector-label">${index + 1} of ${visible.length} ${topics[record.topic].toLowerCase()} records</span><div class="bc-selector-controls"><button type="button" class="bc-step" data-step="-1" aria-label="Previous record" ${index === 0 ? 'disabled' : ''}>←</button><button type="button" class="bc-step" data-step="1" aria-label="Next record" ${index === visible.length - 1 ? 'disabled' : ''}>→</button></div></div>` : ''}`
    }
    root.addEventListener('click', event => {
      const button = event.target.closest('button')
      if (!button || button.disabled) return
      let focus = null
      if (button.dataset.topic) {
        state.topic = button.dataset.topic
        state.detail = 'outcome'
      } else if (button.dataset.detail) {
        state.detail = button.dataset.detail
        focus = `[data-detail="${state.detail}"]`
      } else if (button.dataset.step) {
        const visible = reconcile()
        const next = visible[visible.findIndex(record => record.id === state.selected) + Number(button.dataset.step)]
        if (next) state.selected = next.id
        focus = `[data-step="${button.dataset.step}"]:not(:disabled)`
      } else if (button.id === 'bc-clear' || button.hasAttribute('data-reset')) {
        state.query = ''
        state.who = ''
        focus = '#bc-search'
      } else return
      render()
      writeURL()
      if (focus) ($(focus) || $('.bc-step:not(:disabled)'))?.focus({ preventScroll: true })
      announce(byId[state.selected] ? `${byId[state.selected].title}. ${state.detail}.` : 'Selection updated.')
    })
    $('#bc-search').addEventListener('input', event => {
      state.query = event.target.value
      render()
      writeURL(true)
    })
    $('#bc-who').addEventListener('change', event => {
      state.who = event.target.value
      render()
      writeURL()
    })
    root.addEventListener('change', event => {
      if (event.target.id !== 'bc-setting') return
      state.horizon = event.target.value
      render()
      $('#bc-setting').focus({ preventScroll: true })
      writeURL()
      announce('Replication questions updated.')
    })
    window.addEventListener('popstate', () => { readURL(); render() })
    readURL()
    render()
  }

  if (page === 'compare') {
    const initialA = records.find(record => record.topic === 'learn') || records[0]
    const initialB = records.find(record => record.topic === 'discover') || records[1]
    let left = initialA.id
    let right = initialB.id
    function readURL() {
      const params = new URLSearchParams(location.search)
      left = byId[params.get('left')] ? params.get('left') : initialA.id
      right = byId[params.get('right')] ? params.get('right') : initialB.id
      if (left === right) right = records.find(record => record.id !== left).id
    }
    function render() {
      const a = byId[left]
      const b = byId[right]
      for (const [selector, selected, other] of [['#bc-compare-a', left, right], ['#bc-compare-b', right, left]]) {
        $(selector).innerHTML = records.map(record => `<option value="${record.id}" ${record.id === selected ? 'selected' : ''} ${record.id === other ? 'disabled' : ''}>${esc(record.shortTitle)}</option>`).join('')
      }
      const fields = [['Reported gain', 'outcome'], ['Beneficiaries', 'beneficiaries'], ['Evidence type', 'kind'], ['Evidence', 'evidence'], ['Over time', 'duration'], ['System', 'system'], ['AI contribution', 'ai'], ['Human contribution', 'people'], ['Attribution limits', 'limits'], ['Replication conditions', 'conditions']]
      $('#bc-comparison').innerHTML = fields.map(([label, key]) => `<div class="bc-comparison-row"><h2>${label}</h2>${[a, b].map(record => `<p><span class="bc-mobile-record">${esc(record.shortTitle)}</span>${esc(record[key])}</p>`).join('')}</div>`).join('') + `<div class="bc-comparison-row"><h2>Sources</h2>${[a, b].map(record => `<p><span class="bc-mobile-record">${esc(record.shortTitle)}</span>${sourceLink(record)}<br><a class="bc-full-link" href="${record.path}">Full record →</a></p>`).join('')}</div>`
    }
    $('#bc-compare-a').addEventListener('change', event => { left = event.target.value; render(); changeURL({ left, right }) })
    $('#bc-compare-b').addEventListener('change', event => { right = event.target.value; render(); changeURL({ left, right }) })
    window.addEventListener('popstate', () => { readURL(); render() })
    readURL()
    render()
  }

  if (page === 'sources') {
    const rows = [...root.querySelectorAll('[data-lead]')]
    const size = 8
    let query = ''
    let group = ''
    let current = 1
    function readURL() {
      const params = new URLSearchParams(location.search)
      query = (params.get('q') || '').slice(0, 200)
      group = ['tierA', 'clinical', 'feeder', 'aim'].includes(params.get('group')) ? params.get('group') : ''
      current = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1)
    }
    function render() {
      const found = records.filter(record => (!group || record.source_group === group) && [record.title, record.outcome, record.description, record.system, record.jurisdiction].join(' ').toLowerCase().includes(query.trim().toLowerCase()))
      const pages = Math.max(1, Math.ceil(found.length / size))
      current = Math.min(current, pages)
      const ids = new Set(found.slice((current - 1) * size, current * size).map(record => record.id))
      rows.forEach(row => { row.hidden = !ids.has(row.dataset.lead) })
      $('#bc-lead-search').value = query
      $('#bc-lead-count').textContent = `${found.length} ${found.length === 1 ? 'lead' : 'leads'} awaiting review`
      $('#bc-lead-reset').hidden = !query && !group
      root.querySelectorAll('.bc-topic-button[data-group]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.group === group)))
      $('.bc-pagination').hidden = !found.length
      $('#bc-page-status').textContent = `Page ${current} of ${pages}`
      $('#bc-previous').disabled = current === 1
      $('#bc-next').disabled = current === pages
      let empty = $('#bc-lead-empty')
      if (!empty) {
        empty = document.createElement('p')
        empty.id = 'bc-lead-empty'
        empty.textContent = 'No matching leads. Try another term or clear the filters.'
        $('#bc-lead-list').append(empty)
      }
      empty.hidden = found.length > 0
    }
    function update(replace = false) { render(); changeURL({ q: query, group, page: current > 1 ? String(current) : '' }, replace) }
    root.addEventListener('click', event => {
      const button = event.target.closest('button')
      if (!button || button.disabled) return
      if (button.hasAttribute('data-group')) { group = button.dataset.group; current = 1 }
      else if (button.id === 'bc-lead-reset') { query = ''; group = ''; current = 1 }
      else if (button.id === 'bc-previous') current -= 1
      else if (button.id === 'bc-next') current += 1
      else return
      update()
      if (['bc-previous', 'bc-next'].includes(button.id)) {
        const heading = $('#bc-lead-list [data-lead]:not([hidden]) h2')
        if (heading) {
          heading.tabIndex = -1
          heading.focus({ preventScroll: true })
          heading.scrollIntoView({ block: 'start', behavior: 'auto' })
        }
        announce($('#bc-page-status').textContent)
      }
    })
    $('#bc-lead-search').addEventListener('input', event => { query = event.target.value; current = 1; update(true) })
    window.addEventListener('popstate', () => { readURL(); render() })
    readURL()
    render()
  }

  if (page === 'record') {
    $('[data-copy-citation]').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText($('#bc-citation-text').textContent)
        $('#bc-copy-status').textContent = 'Citation copied.'
      } catch {
        $('#bc-copy-status').textContent = 'Select the citation text above to copy it.'
      }
    })
  }

  if (page === 'contribute') {
    const id = new URLSearchParams(location.search).get('record')
    if (id && /^[a-z0-9-]{1,100}$/.test(id)) {
      $('#bc-contribute-email').href = 'mailto:peter.vartanian@icloud.com?subject=' + encodeURIComponent('AI Benefits Database: evidence for ' + id) + '&body=' + encodeURIComponent('Record: https://petervartanian.xyz/ai-benefits/records/' + id + '/\n\nPublic source:\n\nEvidence or correction:\n')
    }
  }
})()
