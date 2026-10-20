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
    briefing: 'Prepare a briefing',
    contribution: 'Check AI’s contribution',
    application: 'Assess a similar use'
  }
  const validView = value => ['outcome', 'briefing', 'contribution', 'application'].includes(value) ? value : 'outcome'
  const viewParam = view => view === 'outcome' ? '' : view
  const announce = message => { $('#bc-announcement').textContent = message }
  const profileEngine = window.BenefitProfile
  const topicNames = { discover: 'Discovery', learn: 'Learning', health: 'Health', safety: 'Safety', work: 'Work' }
  const fieldNames = { system: 'System details', duration: 'Over time', sources: 'Source trail' }
  let personal = { active: false, topics: [], country: '', fields: [], gaps: [] }
  let contextText = ''
  let profilePrompt = ''
  const profileValues = () => ({ custom: personal.active ? '1' : '', first: personal.topics.join(','), near: personal.country, show: personal.fields.join(','), gap: personal.gaps.join(',') })
  const distinct = values => [...new Set(values)]
  const profileKey = view => JSON.stringify({ ...profileValues(), view })
  const storedContexts = () => {
    try {
      const value = JSON.parse(sessionStorage.getItem('aibd-reader-contexts') || '[]')
      return Array.isArray(value) ? value.filter(item => Array.isArray(item) && typeof item[0] === 'string' && typeof item[1] === 'string').slice(-12) : []
    } catch { return [] }
  }
  function rememberContext(view) {
    if (!personal.active || !contextText) return
    const key = profileKey(view)
    const entries = storedContexts().filter(item => item[0] !== key)
    entries.push([key, contextText.slice(0, 400)])
    try { sessionStorage.setItem('aibd-reader-contexts', JSON.stringify(entries.slice(-12))) } catch { /* Private browsing still supports the current view. */ }
  }
  function readProfile(params, view) {
    const list = key => (params.get(key) || '').slice(0, 400).split(',').filter(Boolean)
    personal = {
      active: params.get('custom') === '1',
      topics: distinct(list('first').filter(key => Object.hasOwn(topicNames, key))),
      country: Object.hasOwn(profileEngine?.countries || {}, params.get('near')) ? params.get('near') : '',
      fields: distinct(list('show').filter(key => Object.hasOwn(fieldNames, key))),
      gaps: distinct(list('gap').filter(name => profileEngine?.uncoveredSubjects.includes(name)))
    }
    personal.active ||= !!(personal.topics.length || personal.country || personal.fields.length || personal.gaps.length)
    const saved = history.state
    contextText = saved?.readerViewKey === profileKey(view) && typeof saved.readerContext === 'string' ? saved.readerContext.slice(0, 400) : storedContexts().find(item => item[0] === profileKey(view))?.[1] || ''
    profilePrompt = ''
    rememberContext(view)
    if ($('#bc-profile-text')) $('#bc-profile-text').value = contextText
  }
  function renderProfile() {
    if ($('#bc-profile-form')) $('#bc-profile-form').hidden = !profileEngine
    $('#bc-field-choice').hidden = !personal.active
    root.querySelectorAll('[data-field]').forEach(input => { input.checked = personal.fields.includes(input.dataset.field) })
    if (!$('#bc-personal-context')) return
    $('#bc-personal-context').hidden = !personal.active
    $('#bc-reset-profile').hidden = !personal.active
    const priorities = [['', 'All topics equally'], ...Object.entries(topicNames)]
    if (personal.topics.length > 1) priorities.push([personal.topics.join(','), personal.topics.map(key => topicNames[key]).join(' + ')])
    $('#bc-priority').innerHTML = priorities.map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join('')
    $('#bc-priority').value = personal.topics.join(',')
    $('#bc-setting').innerHTML = '<option value="">Any location</option>' + Object.entries(profileEngine?.countries || {}).sort((a, b) => a[1].localeCompare(b[1])).map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join('')
    $('#bc-setting').value = personal.country
    const messages = []
    if (personal.gaps.length) messages.push(`This collection has no cases on ${personal.gaps.join(' or ')}. Other topics remain available.`)
    if (personal.country && !records.some(record => record.details.countries.includes(personal.country))) messages.push(`No cases from ${profileEngine.countries[personal.country]} in this collection. Showing other locations.`)
    if (profilePrompt) messages.push(profilePrompt)
    const status = $('#bc-profile-status')
    status.textContent = messages.join(' ')
    status.hidden = !messages.length
  }
  const extraFields = record => {
    const parts = []
    if (personal.fields.includes('system')) parts.push(`<div class="bc-extra-field"><h3>System details</h3><p>${esc(record.system)}</p><p>${esc(record.system_note)}</p></div>`)
    if (personal.fields.includes('duration')) parts.push(`<div class="bc-extra-field"><h3>Over time</h3><p>${esc(record.duration)}</p></div>`)
    if (personal.fields.includes('sources')) {
      const items = record.details.source_checks.map(check => {
        const source = record.sources[check.source_index]
        return `<li><p>${esc(check.claim)}</p><p class="bc-source-locator">${esc(check.locator)}</p>${source ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.publisher || source.title)}</a>${source.full_text_url && source.full_text_url !== source.url ? ` <a href="${esc(source.full_text_url)}" target="_blank" rel="noopener noreferrer">Full text</a>` : ''}` : ''}</li>`
      }).join('')
      parts.push(`<div class="bc-extra-field"><h3>Source trail</h3><ol>${items}</ol></div>`)
    }
    return parts.length ? `<section class="bc-extra-fields" aria-label="Selected record details">${parts.join('')}</section>` : ''
  }
  const recordPreview = (record, view) => record.previews[view] + extraFields(record)
  const priorityScore = record => (personal.topics.includes(record.topic) ? 100 : 0) + (personal.country && record.details.countries.includes(personal.country) ? 10 : 0)
  const savedViewContext = () => [
    personal.topics.length ? `Topics first: ${personal.topics.map(key => topicNames[key]).join(', ')}` : '',
    personal.country ? `Setting of interest: ${profileEngine.countries[personal.country]}. Other locations remain available.` : '',
    personal.gaps.length ? `Collection coverage gaps: ${personal.gaps.join(', ')}` : ''
  ].filter(Boolean).join('\n\n')
  const queryString = values => {
    const params = new URLSearchParams()
    Object.entries(values).forEach(([key, value]) => { if (value) params.set(key, value) })
    return params.size ? `?${params}` : ''
  }
  const changeURL = (values, replace = false) => {
    rememberContext(values.view || 'outcome')
    const url = new URL(location.href)
    url.search = queryString(values)
    url.hash = ''
    const state = personal.active ? { readerViewKey: profileKey(values.view || 'outcome'), readerContext: contextText.slice(0, 400) } : {}
    history[replace ? 'replaceState' : 'pushState'](state, '', url)
  }
  const navigation = (selected, view, right = '', context = {}) => {
    root.querySelectorAll('.bc-nav a').forEach(anchor => {
      const path = new URL(anchor.href, location.href).pathname
      if (path === '/ai-benefits/') anchor.href = path + queryString({ ...profileValues(), ...context, case: selected, view: viewParam(view) })
      if (path === '/ai-benefits/compare/') anchor.href = path + queryString({ ...profileValues(), ...context, left: selected, right, view: viewParam(view) })
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
    if (view === 'outcome' || view === 'briefing') {
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
    fields.push(`**Sources**\n\n${record.sources.map(source => `- ${mdLink(source.title, source.url)}${source.full_text_url && source.full_text_url !== source.url ? ` ${mdLink('Full text', source.full_text_url)}` : ''}`).join('\n')}`)
    if ((view === 'contribution' || personal.fields.includes('sources')) && record.details.source_checks?.length) {
      fields.push(`**Source locations**\n\n${record.details.source_checks.map(check => {
        const source = record.sources[check.source_index]
        return `- ${md(check.claim)} ${md(check.locator)}${source ? ` ${mdLink(source.publisher || source.title, source.url)}${source.full_text_url && source.full_text_url !== source.url ? ` ${mdLink('Full text', source.full_text_url)}` : ''}` : ''}`
      }).join('\n')}`)
    }
    if (personal.fields.includes('system')) fields.push(`**System:** ${md(record.system)}\n\n${md(record.system_note)}`)
    if (personal.fields.includes('duration') && view !== 'application') fields.push(`**Over time:** ${md(record.duration)}`)
    fields.push(`${mdLink('Full record', recordURL(record))}\n\n${mdLink('Cited version', record.revision.url)}`)
    return fields.filter(Boolean).join('\n\n')
  }
  const brief = (ids, view, context) => `# AI Benefits Database\n\n${md(viewNames[view])}\n\n${context}\n\n${md(savedViewContext())}\n\n${ids.map(id => taskBrief(byId[id], view)).join('\n\n---\n\n')}\n`
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
    let focused = []
    const divider = document.createElement('h3')
    divider.className = 'bc-list-divider'
    divider.textContent = 'Other cases'
    let selected = ''
    const values = () => ({ ...profileValues(), q: query, topic, country, evidence, case: selected, view: viewParam(view) })
    const allowed = (selector, value) => [...$(selector).options].some(option => option.value === value) ? value : ''
    function readURL() {
      const params = new URLSearchParams(location.search)
      query = (params.get('q') || params.get('who') || '').slice(0, 200)
      topic = ['learn', 'discover', 'health', 'safety', 'work'].includes(params.get('topic')) ? params.get('topic') : ''
      country = allowed('#bc-country', params.get('country'))
      evidence = allowed('#bc-evidence', params.get('evidence'))
      selected = byId[params.get('case')] ? params.get('case') : ''
      view = validView(params.get('view'))
      readProfile(params, view)
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
      const ordered = personal.active ? [...rows].sort((a, b) => priorityScore(byId[b.dataset.record]) - priorityScore(byId[a.dataset.record])) : rows
      const currentOrder = [...$('#bc-record-list').querySelectorAll('[data-record]')]
      if (ordered.some((row, index) => row !== currentOrder[index])) ordered.forEach(row => $('#bc-record-list').append(row))
      visible = ordered.filter(row => !row.hidden).map(row => row.dataset.record)
      focused = personal.topics.length ? visible.filter(id => personal.topics.includes(byId[id].topic)) : personal.country ? visible.filter(id => byId[id].details.countries.includes(personal.country)) : []
      divider.remove()
      if (focused.length && focused.length < visible.length) {
        const other = ordered.find(row => !row.hidden && !focused.includes(row.dataset.record))
        $('#bc-record-list').insertBefore(divider, other)
      }
      if (!visible.includes(selected)) selected = visible[0] || ''
      $('#bc-feature').hidden = !selected
      if (selected) {
        const record = byId[selected]
        $('#bc-feature').dataset.case = selected
        $('#bc-feature').dataset.topic = record.topic
        $('#bc-feature').dataset.view = view
        $('#bc-preview-body').innerHTML = recordPreview(record, view)
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
      renderProfile()
      $('#bc-topics').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)))
      $('#bc-record-count').textContent = `${visible.length} ${visible.length === 1 ? 'record' : 'records'}${focused.length ? `, ${focused.length} in focus` : ''}`
      $('#bc-save-view').textContent = focused.length ? (view === 'briefing' ? 'Save focused brief' : 'Save focused view') : 'Save this view'
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
    $('#bc-profile-form').addEventListener('submit', event => {
      event.preventDefault()
      if (!profileEngine) return
      contextText = $('#bc-profile-text').value.trim().slice(0, 400)
      if (!contextText) { $('#bc-profile-text').focus(); return }
      const suggested = profileEngine.infer(contextText)
      personal = { active: true, topics: suggested.topics, country: suggested.country || '', fields: suggested.fields || [], gaps: suggested.unsupported }
      profilePrompt = !suggested.recognized ? 'Choose a purpose and a topic to shape your view.' : !suggested.view ? 'Choose what you need to do.' : ''
      view = suggested.view || 'outcome'
      query = topic = country = evidence = selected = ''
      render()
      changeURL(values())
      announce(`View ready. ${viewNames[view]}. ${$('#bc-profile-status').textContent}`)
    })
    $('#bc-priority').addEventListener('change', event => {
      personal.topics = event.target.value.split(',').filter(key => Object.hasOwn(topicNames, key))
      profilePrompt = ''
      selected = ''
      render()
      changeURL(values())
    })
    $('#bc-setting').addEventListener('change', event => {
      personal.country = event.target.value
      selected = ''
      render()
      changeURL(values())
    })
    $('#bc-reset-profile').addEventListener('click', () => {
      personal = { active: false, topics: [], country: '', fields: [], gaps: [] }
      contextText = ''
      profilePrompt = ''
      $('#bc-profile-text').value = ''
      try { sessionStorage.removeItem('aibd-reader-contexts') } catch { /* Reset the visible state even if storage is unavailable. */ }
      view = 'outcome'
      render()
      changeURL(values())
      $('#bc-profile-text').focus({ preventScroll: true })
    })
    $('#bc-field-choice').addEventListener('change', () => {
      personal.fields = [...root.querySelectorAll('[data-field]:checked')].map(input => input.dataset.field)
      render()
      changeURL(values())
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
      profilePrompt = ''
      personal.active = true
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
      const included = focused.length ? focused : visible
      download(brief(included, view, `${included.length} ${included.length === 1 ? 'record' : 'records'}\n\n${mdLink('View these records', location.href)}`), `ai-benefits-${view}.md`)
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
    const values = () => ({ ...profileValues(), ...context, left, right, view: viewParam(view) })
    function readURL() {
      const params = new URLSearchParams(location.search)
      context = Object.fromEntries(['q', 'topic', 'country', 'evidence'].map(key => [key, (params.get(key) || '').slice(0, 200)]))
      left = byId[params.get('left')] ? params.get('left') : initial[0].id
      const related = byId[left].details.related.find(item => byId[item.id] && item.id !== left)
      right = byId[params.get('right')] ? params.get('right') : related?.id || records.find(record => record.id !== left).id
      if (left === right) right = records.find(record => record.id !== left).id
      view = validView(params.get('view'))
      readProfile(params, view)
    }
    function render() {
      const pair = [byId[left], byId[right]]
      for (const [selector, selected, other] of [['#bc-compare-a', left, right], ['#bc-compare-b', right, left]]) {
        $(selector).innerHTML = records.map(record => `<option value="${record.id}" ${record.id === selected ? 'selected' : ''} ${record.id === other ? 'disabled' : ''}>${esc(record.shortTitle)}</option>`).join('')
      }
      $('#bc-view').value = view
      renderProfile()
      $('#bc-comparison-reason').textContent = relationship(...pair)
      $('#bc-comparison').innerHTML = pair.map(record => `<article class="bc-feature" data-case="${esc(record.id)}" data-topic="${esc(record.topic)}" data-view="${view}" aria-label="${esc(record.display.title)}">${recordPreview(record, view)}</article>`).join('')
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
      profilePrompt = ''
      personal.active = true
      render()
      changeURL(values())
      announce(viewNames[view])
    })
    $('#bc-field-choice').addEventListener('change', () => {
      personal.fields = [...root.querySelectorAll('[data-field]:checked')].map(input => input.dataset.field)
      render()
      changeURL(values())
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
