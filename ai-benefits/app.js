(() => {
  'use strict'
  const root = document.body
  const page = root.dataset.page
  const node = document.getElementById('bc-data')
  const data = node ? JSON.parse(node.textContent) : {}
  const records = data.records || []
  const byId = Object.assign(Object.create(null), Object.fromEntries(records.map(record => [record.id, record])))
  const rawById = Object.assign(Object.create(null), Object.fromEntries((data.raw || []).map(record => [record.id, record])))
  const $ = selector => root.querySelector(selector)
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]))
  const announce = message => { $('#bc-announcement').textContent = message }
  const changeURL = (values, replace = false) => {
    const url = new URL(location.href)
    url.search = ''
    url.hash = ''
    Object.entries(values).forEach(([key, value]) => { if (value) url.searchParams.set(key, value) })
    history[replace ? 'replaceState' : 'pushState']({}, '', url)
  }
  const link = (url, title) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a>`
  const download = (text, filename, type) => {
    const url = URL.createObjectURL(new Blob([text], { type }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    root.append(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    announce('Download ready.')
  }
  const brief = (ids, context) => `# AI Benefits Database\n\n${context}\n\nSelected cases and studies. These records do not estimate prevalence or net benefit.\n\n${ids.map(id => data.briefs[id]).join('\n\n---\n\n')}`
  const csv = selected => {
    const keys = [...new Set(data.raw.flatMap(record => Object.keys(record)))]
    const field = value => `"${String(value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : value).replaceAll('"', '""')}"`
    return [keys.map(field).join(','), ...selected.map(record => keys.map(key => field(record[key])).join(','))].join('\n') + '\n'
  }
  const relationship = (a, b) => {
    const item = a.details.related.find(value => value.id === b.id) || b.details.related.find(value => value.id === a.id)
    return item ? `${item.reason} ${item.caution}` : 'These records describe different tasks or settings. Their measures do not establish which use of AI is better.'
  }

  if (page === 'explore') {
    let fragment = location.hash.slice(1)
    try { fragment = decodeURIComponent(fragment) } catch { /* Ignore malformed old links. */ }
    if (byId[fragment]) {
      location.replace(byId[fragment].path)
      return
    }
    if (['scale', 'methodology', 'method'].includes(fragment)) {
      location.replace('/ai-benefits/method/')
      return
    }
    const params = new URLSearchParams(location.search)
    if (byId[params.get('record')]) {
      location.replace(byId[params.get('record')].path)
      return
    }
    const rows = [...root.querySelectorAll('[data-record]')]
    let query = ''
    let topic = ''
    let country = ''
    let evidence = ''
    let visible = []
    let selected = ''
    const values = () => ({ q: query, topic, country, evidence, case: selected })
    const allowed = (selector, value) => [...$(selector).options].some(option => option.value === value) ? value : ''
    function readURL() {
      const params = new URLSearchParams(location.search)
      query = (params.get('q') || params.get('who') || '').slice(0, 200)
      topic = ['learn', 'discover', 'health', 'safety', 'work'].includes(params.get('topic')) ? params.get('topic') : ''
      country = allowed('#bc-country', params.get('country'))
      evidence = allowed('#bc-evidence', params.get('evidence'))
      selected = byId[params.get('case')] ? params.get('case') : ''
    }
    function render() {
      const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
      visible = []
      rows.forEach(row => {
        const countries = row.dataset.countries.split(' ').filter(Boolean)
        const matchesCountry = !country || (country === 'unreported' ? countries.length === 0 : countries.includes(country))
        const matches = (!topic || row.dataset.topic === topic) && matchesCountry && (!evidence || row.dataset.evidence === evidence) && terms.every(term => row.dataset.search.toLocaleLowerCase().includes(term))
        row.hidden = !matches
        if (matches) visible.push(row.dataset.record)
      })
      if (!visible.includes(selected)) selected = visible[0] || ''
      $('#bc-feature').hidden = !selected
      if (selected) {
        const record = byId[selected]
        $('#bc-feature').dataset.case = selected
        $('#bc-feature').dataset.topic = record.topic
        $('#bc-preview-body').innerHTML = record.preview
        const position = visible.indexOf(selected)
        $('#bc-preview-position').textContent = `${position + 1} of ${visible.length}`
        $('#bc-preview-prev').disabled = position === 0
        $('#bc-preview-next').disabled = position === visible.length - 1
      }
      rows.forEach(row => row.querySelector('[data-pick]').setAttribute('aria-pressed', String(row.dataset.record === selected)))
      $('#bc-search').value = query
      $('#bc-country').value = country
      $('#bc-evidence').value = evidence
      $('#bc-topics').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)))
      $('#bc-record-count').textContent = `${visible.length} ${visible.length === 1 ? 'record' : 'records'}`
      $('#bc-empty').hidden = visible.length !== 0
      $('#bc-clear').hidden = !query && !topic && !country && !evidence
      $('.bc-downloads').hidden = visible.length === 0
    }
    function pick(id) {
      selected = id
      render()
      changeURL(values())
      announce(byId[id].display.title)
    }
    $('#bc-record-list').addEventListener('click', event => {
      const button = event.target.closest('[data-pick]')
      if (!button) return
      pick(button.dataset.pick)
      $('#bc-feature').scrollIntoView({ block: 'start', behavior: 'instant' })
    })
    for (const [id, step] of [['bc-preview-prev', -1], ['bc-preview-next', 1]]) {
      document.getElementById(id).addEventListener('click', () => {
        const next = visible[visible.indexOf(selected) + step]
        if (next) pick(next)
      })
    }
    $('#bc-search').addEventListener('input', event => {
      query = event.target.value
      render()
      changeURL(values(), true)
    })
    $('#bc-topics').addEventListener('click', event => {
      const button = event.target.closest('button')
      if (!button) return
      topic = button.dataset.topic
      render()
      changeURL(values())
    })
    for (const id of ['bc-country', 'bc-evidence']) {
      document.getElementById(id).addEventListener('change', event => {
        if (id === 'bc-country') country = event.target.value
        else evidence = event.target.value
        render()
        changeURL(values())
      })
    }
    $('#bc-clear').addEventListener('click', () => {
      query = topic = country = evidence = selected = ''
      render()
      changeURL({})
      $('#bc-search').focus({ preventScroll: true })
    })
    for (const format of ['brief', 'csv', 'json']) {
      $(`#bc-export-${format}`).addEventListener('click', event => {
        event.preventDefault()
        if (!visible.length) return
        const selected = visible.map(id => rawById[id])
        if (format === 'brief') download(brief(visible, `${visible.length} records. Search: ${location.href}`), 'ai-benefits-results.md', 'text/markdown;charset=utf-8')
        if (format === 'csv') download(csv(selected), 'ai-benefits-results.csv', 'text/csv;charset=utf-8')
        if (format === 'json') download(JSON.stringify({ title: 'AI Benefits Database', source: location.href, filters: values(), count: selected.length, records: selected }, null, 2) + '\n', 'ai-benefits-results.json', 'application/json;charset=utf-8')
      })
    }
    window.addEventListener('popstate', () => { readURL(); render() })
    readURL()
    render()
  }

  if (page === 'compare') {
    const initial = records.filter(record => record.topic === 'health').slice(0, 2)
    let left = initial[0].id
    let right = initial[1].id
    const fields = [['Task and setting', 'application'], ['Outcome', 'outcome'], ['Compared with', 'comparison'], ['Beneficiaries', 'beneficiaries'], ['Evidence', 'evidence'], ['Contributions', 'contributions'], ['System', 'system'], ['Duration', 'duration'], ['Conditions', 'conditions'], ['Sources', 'source']]
    function readURL() {
      const values = new URLSearchParams(location.search)
      left = byId[values.get('left')] ? values.get('left') : initial[0].id
      const related = byId[left].details.related.find(item => byId[item.id])
      right = byId[values.get('right')] ? values.get('right') : related?.id || records.find(record => record.id !== left).id
      if (left === right) right = records.find(record => record.id !== left).id
    }
    function cell(record, key) {
      if (key === 'application') return `<p>${esc(record.details.application)}</p><p>${esc(record.details.geography_note)}</p>`
      if (key === 'evidence') return `<p class="bc-small">${esc(record.kind)}</p><p>${esc(record.evidence)}</p><p>${esc(record.limits)}</p>`
      if (key === 'contributions') return `<p><strong>AI.</strong> ${esc(record.ai)}</p><p><strong>People.</strong> ${esc(record.people)}</p>`
      if (key === 'system') return `<p>${esc(record.system)}</p><p>${esc(record.system_note)}</p>`
      if (key === 'conditions') return record.details.documented_conditions.map(condition => `<p>${esc(condition)}</p>`).join('') + `<p>${esc(record.details.transfer_limit)}</p>`
      if (key === 'source') return record.sources.map(source => `<p>${link(source.url, source.title)}</p>`).join('') + `<p><a href="${esc(record.path)}">Full record</a></p><p><a href="${esc(record.revision.url)}">Cited version</a></p>`
      return `<p>${esc(record[key])}</p>`
    }
    function render() {
      const pair = [byId[left], byId[right]]
      for (const [selector, selected, other] of [['#bc-compare-a', left, right], ['#bc-compare-b', right, left]]) {
        $(selector).innerHTML = records.map(record => `<option value="${record.id}" ${record.id === selected ? 'selected' : ''} ${record.id === other ? 'disabled' : ''}>${esc(record.shortTitle)}</option>`).join('')
      }
      $('#bc-comparison-reason').textContent = relationship(...pair)
      const header = `<div class="bc-sr" role="row"><span role="columnheader">Field</span>${pair.map(record => `<span role="columnheader">${esc(record.shortTitle)}</span>`).join('')}</div>`
      $('#bc-comparison').innerHTML = header + fields.map(([label, key]) => `<div class="bc-comparison-row" role="row"><h2 role="rowheader">${label}</h2>${pair.map(record => `<div role="cell"><span class="bc-mobile-record" aria-hidden="true">${esc(record.shortTitle)}</span>${cell(record, key)}</div>`).join('')}</div>`).join('')
    }
    for (const [id, side] of [['bc-compare-a', 'left'], ['bc-compare-b', 'right']]) {
      document.getElementById(id).addEventListener('change', event => {
        if (side === 'left') left = event.target.value
        else right = event.target.value
        render()
        changeURL({ left, right })
        announce(`Comparing ${byId[left].shortTitle} and ${byId[right].shortTitle}.`)
      })
    }
    $('#bc-download-comparison').hidden = false
    $('#bc-download-comparison').addEventListener('click', () => {
      download(brief([left, right], `Comparison: ${location.href}\n\n${relationship(byId[left], byId[right])}`), `ai-benefits-${left}-${right}.md`, 'text/markdown;charset=utf-8')
    })
    window.addEventListener('popstate', () => { readURL(); render() })
    readURL()
    render()
  }
})()
