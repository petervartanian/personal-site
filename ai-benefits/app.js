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
  const viewNames = data.viewLabels || {
    outcome: 'Find an example',
    contribution: 'Check AI’s contribution',
    application: 'Assess a similar use'
  }
  const validView = value => ['outcome', 'contribution', 'application'].includes(value) ? value : 'outcome'
  const viewParam = view => view === 'outcome' ? '' : view
  const announce = message => { $('#bc-announcement').textContent = message }
  const queryString = values => {
    const params = new URLSearchParams()
    Object.entries(values).forEach(([key, value]) => { if (value) params.set(key, value) })
    return params.size ? `?${params}` : ''
  }
  const changeURL = (values, replace = false) => {
    const url = new URL(location.href)
    url.search = queryString(values)
    url.hash = ''
    history[replace ? 'replaceState' : 'pushState']({}, '', url)
  }
  const navigation = (selected, view, right = '', context = {}) => {
    root.querySelectorAll('.bc-nav a').forEach(anchor => {
      const path = new URL(anchor.href, location.href).pathname
      if (path === '/ai-benefits/') anchor.href = path + queryString({ ...context, case: selected, view: viewParam(view) })
      if (path === '/ai-benefits/compare/') anchor.href = path + queryString({ ...context, left: selected, right, view: viewParam(view) })
    })
  }
  const download = (text, filename) => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    root.append(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    announce('Download ready.')
  }
  const md = value => String(value ?? '').replace(/([\\`*_[\]<>])/g, '\\$1')
  const mdLink = (title, url) => `[${md(title)}](${String(url).replace(/\(/g, '%28').replace(/\)/g, '%29')})`
  const recordURL = record => rawById[record.id]?.record_url || new URL(record.path, document.querySelector('link[rel="canonical"]')?.href || location.href).href
  const taskBrief = (record, view) => {
    const copy = record.display
    const fields = [`## ${md(copy.title)}`]
    if (view === 'outcome') {
      fields.push(`**Result:** ${md(copy.result)}. ${md(copy.result_label)}.`)
      fields.push(md(copy.synopsis))
      fields.push(`**Beneficiaries:** ${md(record.beneficiaries)}`)
      fields.push(`**Setting:** ${md(record.place)}. ${md(record.date)}.`)
    } else if (view === 'contribution') {
      const contribution = record.views.contribution
      fields.push(`**Reported result:** ${md(copy.synopsis)}`)
      fields.push(`**AI:** ${md(contribution.ai)}`)
      fields.push(`**People:** ${md(contribution.people)}`)
      fields.push(`**Evidence:** ${md(contribution.basis)}`)
    } else {
      const application = record.views.application
      fields.push(`**Setting:** ${md(application.setting)}`)
      fields.push(`**Reported result:** ${md(copy.synopsis)}`)
      fields.push(`**Documented conditions**\n\n${application.conditions.map(condition => `- ${md(condition)}`).join('\n')}`)
      fields.push(`**Transfer limit:** ${md(application.limit)}`)
      fields.push(`**Over time:** ${md(record.duration)}`)
    }
    fields.push(`**Compared with:** ${md(copy.comparator || record.comparison)}`)
    fields.push(`**Qualification:** ${md(copy.qualification || record.limits)}`)
    fields.push(`**Sources**\n\n${record.sources.map(source => `- ${mdLink(source.title, source.url)}`).join('\n')}`)
    if (view === 'contribution' && record.details.source_checks?.length) {
      fields.push(`**Source locations**\n\n${record.details.source_checks.map(check => {
        const source = record.sources[check.source_index]
        return `- ${md(check.claim)} ${md(check.locator)}${source ? ` ${mdLink(source.publisher || source.title, source.url)}` : ''}`
      }).join('\n')}`)
    }
    fields.push(`${mdLink('Full record', recordURL(record))}\n\n${mdLink('Cited version', record.revision.url)}`)
    return fields.filter(Boolean).join('\n\n')
  }
  const brief = (ids, view, context) => `# AI Benefits Database\n\n${md(viewNames[view])}\n\n${context}\n\n${ids.map(id => taskBrief(byId[id], view)).join('\n\n---\n\n')}\n`
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
    let view = 'outcome'
    let visible = []
    let selected = ''
    const values = () => ({ q: query, topic, country, evidence, case: selected, view: viewParam(view) })
    const allowed = (selector, value) => [...$(selector).options].some(option => option.value === value) ? value : ''
    function readURL() {
      const params = new URLSearchParams(location.search)
      query = (params.get('q') || params.get('who') || '').slice(0, 200)
      topic = ['learn', 'discover', 'health', 'safety', 'work'].includes(params.get('topic')) ? params.get('topic') : ''
      country = allowed('#bc-country', params.get('country'))
      evidence = allowed('#bc-evidence', params.get('evidence'))
      selected = byId[params.get('case')] ? params.get('case') : ''
      view = validView(params.get('view'))
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
        $('#bc-feature').dataset.view = view
        $('#bc-preview-body').innerHTML = record.previews[view]
      }
      rows.forEach(row => {
        const anchor = row.querySelector('[data-pick]')
        if (row.dataset.record === selected) anchor.setAttribute('aria-current', 'true')
        else anchor.removeAttribute('aria-current')
      })
      $('#bc-search').value = query
      $('#bc-country').value = country
      $('#bc-evidence').value = evidence
      $('#bc-view').value = view
      $('#bc-topics').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)))
      $('#bc-record-count').textContent = `${visible.length} ${visible.length === 1 ? 'record' : 'records'}`
      $('#bc-empty').hidden = visible.length !== 0
      $('#bc-clear').hidden = !query && !topic && !country && !evidence
      $('#bc-save-view').hidden = visible.length === 0
      navigation(selected, view, '', { q: query, topic, country, evidence })
    }
    function pick(id) {
      selected = id
      render()
      changeURL(values())
      announce(byId[id].display.title)
    }
    $('#bc-record-list').addEventListener('click', event => {
      const anchor = event.target.closest('[data-pick]')
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      pick(anchor.dataset.pick)
      $('#bc-feature').scrollIntoView({ block: 'start', behavior: 'instant' })
    })
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
    $('#bc-view').addEventListener('change', event => {
      view = validView(event.target.value)
      render()
      changeURL(values())
      announce(viewNames[view])
    })
    $('#bc-clear').addEventListener('click', () => {
      query = topic = country = evidence = selected = ''
      render()
      changeURL(values())
      $('#bc-search').focus({ preventScroll: true })
    })
    $('#bc-save-view').addEventListener('click', () => {
      if (!visible.length) return
      download(brief(visible, view, `${visible.length} ${visible.length === 1 ? 'record' : 'records'}\n\n${mdLink('View these records', location.href)}`), `ai-benefits-${view}.md`)
    })
    window.addEventListener('popstate', () => { readURL(); render() })
    readURL()
    render()
  }

  if (page === 'compare') {
    const initial = records.filter(record => record.topic === 'health').slice(0, 2)
    let left = initial[0].id
    let right = initial[1].id
    let view = 'outcome'
    let context = {}
    const values = () => ({ ...context, left, right, view: viewParam(view) })
    function readURL() {
      const params = new URLSearchParams(location.search)
      context = Object.fromEntries(['q', 'topic', 'country', 'evidence'].map(key => [key, (params.get(key) || '').slice(0, 200)]))
      left = byId[params.get('left')] ? params.get('left') : initial[0].id
      const related = byId[left].details.related.find(item => byId[item.id] && item.id !== left)
      right = byId[params.get('right')] ? params.get('right') : related?.id || records.find(record => record.id !== left).id
      if (left === right) right = records.find(record => record.id !== left).id
      view = validView(params.get('view'))
    }
    function render() {
      const pair = [byId[left], byId[right]]
      for (const [selector, selected, other] of [['#bc-compare-a', left, right], ['#bc-compare-b', right, left]]) {
        $(selector).innerHTML = records.map(record => `<option value="${record.id}" ${record.id === selected ? 'selected' : ''} ${record.id === other ? 'disabled' : ''}>${esc(record.shortTitle)}</option>`).join('')
      }
      $('#bc-view').value = view
      $('#bc-comparison-reason').textContent = relationship(...pair)
      $('#bc-comparison').innerHTML = pair.map(record => `<article class="bc-feature" data-case="${esc(record.id)}" data-topic="${esc(record.topic)}" data-view="${view}" aria-label="${esc(record.display.title)}">${record.previews[view]}</article>`).join('')
      navigation(left, view, right, context)
    }
    for (const [id, side] of [['bc-compare-a', 'left'], ['bc-compare-b', 'right']]) {
      document.getElementById(id).addEventListener('change', event => {
        const selected = event.target.value
        if (!byId[selected] || selected === (side === 'left' ? right : left)) return
        if (side === 'left') left = selected
        else right = selected
        render()
        changeURL(values())
        announce(`Comparing ${byId[left].shortTitle} and ${byId[right].shortTitle}.`)
      })
    }
    $('#bc-view').addEventListener('change', event => {
      view = validView(event.target.value)
      render()
      changeURL(values())
      announce(viewNames[view])
    })
    $('#bc-download-comparison').hidden = false
    $('#bc-download-comparison').addEventListener('click', () => {
      const context = `${mdLink('View this comparison', location.href)}\n\n${md(relationship(byId[left], byId[right]))}`
      download(brief([left, right], view, context), `ai-benefits-${left}-${right}-${view}.md`)
    })
    window.addEventListener('popstate', () => { readURL(); render() })
    readURL()
    render()
  }
})()
