(() => {
  'use strict'

  // Local phrase matching suggests editable presentation choices. It does not
  // classify people, interpret arbitrary language, or change the evidence.
  const normalize = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'").replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim()
  const regionCodes = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ')
  const fallbackCountries = {
    AU: 'Australia', BR: 'Brazil', CA: 'Canada', CN: 'China', DE: 'Germany', EG: 'Egypt', ES: 'Spain', FR: 'France', GB: 'United Kingdom', GH: 'Ghana', ID: 'Indonesia', IE: 'Ireland', IN: 'India', IT: 'Italy', JP: 'Japan', KE: 'Kenya', KR: 'South Korea', MX: 'Mexico', NG: 'Nigeria', NL: 'Netherlands', NP: 'Nepal', NZ: 'New Zealand', PH: 'Philippines', PK: 'Pakistan', PL: 'Poland', PT: 'Portugal', RU: 'Russia', SA: 'Saudi Arabia', SG: 'Singapore', TH: 'Thailand', TR: 'Türkiye', TW: 'Taiwan', UA: 'Ukraine', US: 'United States', VN: 'Vietnam', ZA: 'South Africa'
  }
  const countryNames = Object.create(null)
  const displayNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['en-US'], { type: 'region' }) : null
  for (const code of regionCodes) {
    const name = displayNames?.of(code) || fallbackCountries[code]
    if (name && name !== code) countryNames[code] = name
  }
  const countries = Object.freeze(countryNames)
  const countryAliases = {
    GB: ['uk', 'u.k.', 'britain', 'great britain', 'england', 'scotland', 'wales', 'northern ireland'],
    US: ['usa', 'united states of america'],
    KR: ['republic of korea'], KP: ['north korea'], CZ: ['czech republic'],
    CI: ["cote d'ivoire", 'ivory coast'], CD: ['democratic republic of the congo', 'dr congo', 'drc'],
    CG: ['republic of the congo', 'congo-brazzaville'], SZ: ['swaziland'],
    TR: ['turkiye'], CV: ['cape verde'], TL: ['east timor'], MM: ['burma'],
    VA: ['vatican city'], PS: ['palestine', 'palestinian territories'],
    TW: ['taiwan'], VN: ['viet nam'], TZ: ['tanzania']
  }
  const literal = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const countryPatterns = []
  for (const [code, name] of Object.entries(countries)) {
    for (const alias of new Set([name, ...(countryAliases[code] || [])])) {
      const normalized = normalize(alias).toLowerCase()
      // These names are also people, food, or a U.S. state. Require context.
      if (['georgia', 'jordan', 'chad', 'turkey'].includes(normalized)) continue
      countryPatterns.push({ code, pattern: new RegExp(`\\b${literal(normalized)}(?=$|[^a-z])`, 'i') })
    }
  }
  countryPatterns.push(
    { code: 'US', pattern: /\b(?:in|from|across|within|about|throughout)\s+the\s+US\b/ },
    { code: 'GE', pattern: /\b(?:country|nation) of georgia\b|\bgeorgia\s*\(country\)/i },
    { code: 'JO', pattern: /\b(?:in|across|within|throughout)\s+jordan\b|\b(?:country|nation) of jordan\b/i },
    { code: 'TD', pattern: /\b(?:in|across|within|throughout)\s+chad\b|\b(?:country|nation) of chad\b/i },
    { code: 'TR', pattern: /\b(?:in|from|across|within|throughout)\s+turkey\b|\b(?:country|nation) of turkey\b/i }
  )

  const topics = {
    discover: /\b(?:discovery|discoveries|ancient\s+(?:greek|text|texts|inscriptions)|inscriptions?|epigraphy|archaeolog\w*|historical\s+texts?|cultural\s+heritage|text\s+restoration)\b/i,
    learn: /\b(?:schools?|school\s+boards?|education|educational|teaching|teachers?|tutors?|tutoring|classrooms?|students?|learning\s+(?:outcomes?|gains?|retention)|student\s+learning|physics\s+lessons?)\b/i,
    health: /\b(?:doctors?|physicians?|nurses?|hospitals?|patients?|clinical|medical|medicine|healthcare|health\s+care|health|cancer|stroke|radiolog\w*|diagnos\w*|triage|therapists?|therapy)\b/i,
    safety: /\b(?:rescues?|rescuing|firefighters?|wildfires?|fire\s+(?:detection|alerts?)|emergency\s+(?:response|responders)|search\s+and\s+rescue|missing\s+(?:hikers?|people|persons?)|disaster\s+response)\b/i,
    work: /\b(?:customer\s+(?:support|service)|call\s+cent(?:er|re)s?|support\s+agents?|workplace|productivity|professional\s+writing|business\s+writing|coding|programming|software\s+(?:develop\w*|engineers?)|code\s+(?:assistants?|review|generation)|copilot|employees?|workers?)\b/i
  }
  const unavailable = [
    ['National security', /\b(?:national\s+security|military|defen[cs]e|information\s+warfare|intelligence\s+operations)\b/i],
    ['AI safety and security', /\b(?:ai\s+safety|ai\s+security|cybersecurity|cyber\s+security|alignment|jailbreaks?)\b/i],
    ['Insurance', /\b(?:insurance|reinsurance|underwriting|underwriters?|actuarial|actuary|actuaries|insurance\s+premiums?)\b/i],
    ['Agriculture', /\b(?:agriculture|agricultural|farming|farmers?|crops?|agronom\w*)\b/i],
    ['Climate and energy', /\b(?:climate|decarbon\w*|carbon\s+emissions|renewable\s+energy|clean\s+energy|energy\s+(?:sector|systems?|policy|efficiency)|electricity|power\s+grids?|environmental\s+sustainability)\b|\b(?:for|in|about|on)\s+(?:the\s+)?energy\b/i],
    ['Public finance', /\b(?:public\s+finance|public\s+spending|fiscal\s+policy|taxation|government\s+budgets?|public\s+procurement|budget\s+allocation)\b/i],
    ['Finance and banking', /\b(?:banking|banks?|investment\s+management|financial\s+services|financial\s+markets|credit\s+scoring|lending)\b/i],
    ['Law and justice', /\b(?:legal\s+(?:research|practice|services)|criminal\s+justice|court\s+proceedings|judicial|sentencing)\b/i],
    ['Transportation', /\b(?:transportation|autonomous\s+vehicles|self-driving|traffic\s+management|logistics)\b/i]
  ]
  const uncoveredSubjects = Object.freeze(unavailable.map(([label]) => label))
  const tasks = [
    ['briefing', /\b(?:brief(?:ing)?\s+(?:a|an|the|my|our|colleagues|others|people|someone)|(?:prepare|preparing|draft|drafting|write|writing|create|creating|assemble|assembling)\s+(?:a\s+|an\s+|the\s+|my\s+|our\s+)?(?:brief(?:ing)?|memo|presentation|policy\s+note|report)|(?:explain|present)\s+(?:\w+\s+){0,6}to\s+(?:\w+\s+){0,3}(?:board|colleagues|clients|decision-makers|policymakers|council|community|team|audience)|(?:need|want)\s+(?:a\s+|an\s+)?(?:brief(?:ing)?|memo|presentation))\b/i],
    ['contribution', /\b(?:(?:check|checking|verify|verifying|investigate|investigating|audit|auditing|validate|validating|evaluate|evaluating|assess|assessing|inspect|inspecting|research|researching)\s+(?:\w+['-]?\w*\s+){0,6}(?:claims?|evidence|sources?|causality|attribution|ai'?s?\s+(?:role|contribution|effect))|fact[- ]check(?:ing)?|what\s+(?:did|does|has)\s+ai\s+(?:add|contribute)|(?:did|does)\s+ai\s+(?:cause|make\s+a\s+difference)|(?:need|want)\s+to\s+(?:verify|investigate|audit))\b/i],
    ['application', /\b(?:(?:assess|assessing|evaluate|evaluating|consider|considering|plan|planning|test|testing)\s+(?:\w+['-]?\w*\s+){0,6}(?:adoption|deployment|implementation|a\s+similar\s+use|local\s+use|a\s+pilot|ai\s+(?:use|tool|system|application)|tutoring|copilot)|(?:adopt|adopting|deploy|deploying|implement|implementing|pilot|piloting)\s+(?:\w+['-]?\w*\s+){0,4}(?:ai|tools?|systems?|assistants?|tutors?|tutoring|copilot)|(?:can|could|would|will)\s+(?:this|it|ai)\s+work\s+(?:here|for\s+us|in\s+our)|(?:assess|assessing)\s+a\s+similar\s+use)\b/i],
    ['application', /\b(?:choose|choosing|select|selecting|evaluate|evaluating)\s+(?:(?:a|an|the|which|between|among|appropriate|suitable|new|ai)\s+){0,3}(?:tools?|ai\s+systems?|assistants?|tutors?|copilot)\b/i],
    ['application', /\b(?:decide|deciding)\s+(?:whether|if)\s+(?:to\s+)?(?:use|adopt|deploy|implement)\s+(?:(?:a|an|the|our|this|that)\s+){0,2}(?:ai|tools?|assistants?|tutors?|copilot)\b/i],
    ['outcome', /\b(?:(?:find|finding|show|explore|exploring|browse|browsing|discover|discovering|see|looking\s+for|look\s+for)\s+(?:\w+['-]?\w*\s+){0,5}(?:examples?|cases?|benefits?|outcomes?)|what\s+(?:has|can)\s+ai\s+(?:helped|made|improved)|what\s+becomes\s+possible)\b/i]
  ]
  const optionalFields = {
    system: /\b(?:(?:model|system|software|tool)\s+(?:names?|versions?|details|specifications)|(?:which|what)\s+(?:ai\s+)?(?:model|system|software|version)|(?:model|system)\s+and\s+(?:version|provider)|(?:exact|specific)\s+(?:model|version))\b/i,
    duration: /\b(?:long[- ]term|long[- ]run|duration|persistence|persist(?:ed|ence|s)?|sustained\s+(?:benefits?|gains?|results?|effects?)|lasting\s+(?:benefits?|gains?|results?|effects?)|learning\s+retention|follow[- ]up|over\s+time|how\s+long|durability)\b/i,
    sources: /\b(?:(?:primary|original)\s+(?:sources?|papers?|research|documents?)|source\s+(?:passages?|locations?|excerpts?|links?|citations?|quotes?)|(?:exact|verbatim)\s+(?:quotes?|quotations?|passages?)|(?:show|include|inspect|check|read|cite|find|need|want)\s+(?:\w+\s+){0,4}sources?)\b/i
  }

  function positiveText(value) {
    const text = normalize(value).replace(/<[^>]*>/g, ' ')
      .replace(/\bu\.s\.(?:a\.)?/gi, 'United States')
      .replace(/\bu\.k\./gi, 'United Kingdom')
      .replace(/\bnot\s+(?:only|just|merely)\b/gi, '')
      .replace(/\b(?:rather\s+than|instead\s+of|except\s+for)\b/gi, 'not')
    return text.split(/[.!?;,\n]+|\b(?:but|however|instead)\b|\band\s+(?=(?:i|we|my|our)\b)/i)
      .map(clause => {
        const negative = /\b(?:not|never|no|without|exclude|excluding|ignore|except|don't|doesn't|isn't|aren't|won't|can't|cannot)\b/i.exec(clause)
        if (negative && /\b(?:is|are|was|were)\s*$/i.test(clause.slice(0, negative.index))) return ''
        return negative ? clause.slice(0, negative.index) : clause
      }).join('. ')
  }

  function infer(value) {
    if (typeof value !== 'string') return { view: null, topics: [], country: null, unsupported: [], fields: [], recognized: false }
    const text = positiveText(value.slice(0, 400))
    const taskMatches = tasks.flatMap(([view, pattern]) => {
      const match = pattern.exec(text)
      if (!match) return []
      const lead = text.slice(Math.max(0, match.index - 55), match.index)
      const explicitIntent = /\b(?:i|we)\s+(?:need|want|plan|intend|am\s+trying|are\s+trying)\s+to\s+(?:\w+\s+){0,3}$|\b(?:help\s+me|please)\s*$/i.test(lead)
      return [{ view, index: match.index, intent: explicitIntent ? 1 : 0 }]
    }).sort((a, b) => b.intent - a.intent || a.index - b.index)
    const countryMatches = countryPatterns.flatMap(({ code, pattern }) => {
      const match = pattern.exec(text)
      return match ? [{ code, index: match.index, length: match[0].length }] : []
    }).sort((a, b) => a.index - b.index || b.length - a.length)
    const result = {
      view: taskMatches[0]?.view || null,
      topics: Object.entries(topics).filter(([, pattern]) => pattern.test(text)).map(([topic]) => topic),
      country: countryMatches[0]?.code || null,
      unsupported: unavailable.filter(([, pattern]) => pattern.test(text)).map(([label]) => label),
      fields: Object.entries(optionalFields).filter(([, pattern]) => pattern.test(text)).map(([field]) => field),
      recognized: false
    }
    result.recognized = Boolean(result.view || result.topics.length || result.country || result.unsupported.length || result.fields.length)
    return result
  }

  const api = Object.freeze({ infer, countries, uncoveredSubjects })
  if (typeof module !== 'undefined' && module.exports) module.exports = api
  if (typeof window !== 'undefined') window.BenefitProfile = api
})()
