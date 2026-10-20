(() => {
  'use strict'
  const root = document.body
  const page = root.dataset.page
  const data = document.getElementById('bc-data')
  const records = data ? JSON.parse(data.textContent).records : []
  const byId = Object.assign(Object.create(null), Object.fromEntries(records.map(record => [record.id, record])))
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
  const sourceLink = record => `<a href="${esc(record.url)}" target="_blank" rel="noopener noreferrer">${esc(record.source)}</a>`

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
    function readURL() {
      const values = new URLSearchParams(location.search)
      query = (values.get('q') || values.get('who') || '').slice(0, 200)
      topic = ['learn', 'discover', 'health', 'safety'].includes(values.get('topic')) ? values.get('topic') : ''
    }
    function render() {
      const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
      let count = 0
      rows.forEach(row => {
        const matches = (!topic || row.dataset.topic === topic) && terms.every(term => row.dataset.search.toLocaleLowerCase().includes(term))
        row.hidden = !matches
        if (matches) count += 1
      })
      $('#bc-search').value = query
      $('#bc-topics').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)))
      $('#bc-record-count').textContent = `${count} ${count === 1 ? 'record' : 'records'}`
      $('#bc-empty').hidden = count !== 0
      $('#bc-clear').hidden = !query && !topic
    }
    $('#bc-search').addEventListener('input', event => {
      query = event.target.value
      render()
      changeURL({ q: query, topic }, true)
    })
    $('#bc-topics').addEventListener('click', event => {
      const button = event.target.closest('button')
      if (!button) return
      topic = button.dataset.topic
      render()
      changeURL({ q: query, topic })
    })
    $('#bc-clear').addEventListener('click', () => {
      query = ''
      topic = ''
      render()
      changeURL({})
      $('#bc-search').focus({ preventScroll: true })
    })
    window.addEventListener('popstate', () => { readURL(); render() })
    readURL()
    render()
  }

  if (page === 'compare') {
    const initial = records.filter(record => record.topic === 'health').slice(0, 2)
    let left = initial[0].id
    let right = initial[1].id
    const fields = [['Outcome', 'outcome'], ['Beneficiaries', 'beneficiaries'], ['Evidence', 'evidence'], ['Contributions', 'contributions'], ['System', 'system'], ['Duration', 'duration'], ['Replication', 'conditions'], ['Sources', 'source']]
    function readURL() {
      const values = new URLSearchParams(location.search)
      left = byId[values.get('left')] ? values.get('left') : initial[0].id
      const related = records.find(record => record.topic === byId[left].topic && record.id !== left)
      right = byId[values.get('right')] ? values.get('right') : related?.id || initial[1].id
      if (left === right) right = records.find(record => record.id !== left).id
    }
    function cell(record, key) {
      if (key === 'evidence') return `<p class="bc-small">${esc(record.kind)}</p><p>${esc(record.evidence)}</p><p>${esc(record.limits)}</p>`
      if (key === 'contributions') return `<p><strong>AI.</strong> ${esc(record.ai)}</p><p><strong>People.</strong> ${esc(record.people)}</p>`
      if (key === 'source') return `<p>${sourceLink(record)}</p><p><a href="${esc(record.path)}">Record</a></p>`
      return `<p>${esc(record[key])}</p>`
    }
    function render() {
      const pair = [byId[left], byId[right]]
      for (const [selector, selected, other] of [['#bc-compare-a', left, right], ['#bc-compare-b', right, left]]) {
        $(selector).innerHTML = records.map(record => `<option value="${record.id}" ${record.id === selected ? 'selected' : ''} ${record.id === other ? 'disabled' : ''}>${esc(record.shortTitle)}</option>`).join('')
      }
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
      const brief = ['# AI Benefits Database: comparison', 'Source-reviewed records. Retain the qualifications when reusing these findings.', ...[byId[left], byId[right]].map(record => `## ${record.title}\n\n${record.place}. ${record.date}.\n\nRecord: https://petervartanian.xyz${record.path}\n\n### Outcome\n\n${record.outcome}\n\n${record.beneficiaries}\n\n### Evidence\n\n${record.kind}. ${record.evidence}\n\n${record.limits}\n\n${record.duration}\n\n### Contributions\n\nAI: ${record.ai}\n\nPeople: ${record.people}\n\nSystem: ${record.system}\n\n### Replication\n\n${record.conditions}\n\n### Source\n\n[${record.source}](${record.url})`)].join('\n\n') + '\n'
      const url = URL.createObjectURL(new Blob([brief], { type: 'text/markdown;charset=utf-8' }))
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `ai-benefits-${left}-${right}.md`
      root.append(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      announce('Comparison brief downloaded.')
    })
    window.addEventListener('popstate', () => { readURL(); render() })
    readURL()
    render()
  }
})()
