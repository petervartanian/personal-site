'use strict'
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { infer, countries, uncoveredSubjects } = require('../ai-benefits/personalize.js')
let count = 0
const check = (name, fn) => {
  try { fn(); count += 1 }
  catch (error) { error.message = `${name}: ${error.message}`; throw error }
}
const expect = (text, expected) => {
  const actual = infer(text)
  for (const [key, value] of Object.entries(expected)) assert.deepEqual(actual[key], value, `${key} for ${JSON.stringify(text)}`)
  return actual
}

check('school-board briefing', () => {
  expect('I’m briefing a school board about AI tutoring.', { view: 'briefing', topics: ['learn'], country: null, fields: [] })
})
check('doctor is context, not a task', () => {
  expect('I am a doctor in Kenya.', { view: null, topics: ['health'], country: 'KE' })
})
check('researcher is not a discovery task', () => {
  expect('I am a researcher.', { view: null, topics: [], recognized: false })
})
check('journalist is not automatically writing a brief', () => {
  expect('I am a journalist.', { view: null, topics: [], recognized: false })
})
check('primary-source investigation', () => {
  expect('Please investigate a claim about AI-assisted diagnosis, including primary sources and exact model versions.', { view: 'contribution', topics: ['health'], fields: ['system', 'sources'] })
})
check('similar customer-support use', () => {
  expect('I work in operations and want to assess a similar use of customer support AI.', { view: 'application', topics: ['work'] })
})
check('health adoption', () => {
  expect('I am a hospital manager planning a pilot of AI triage.', { view: 'application', topics: ['health'] })
})
check('choosing tools for a school is an application task', () => {
  expect('I’m choosing tools for a school.', { view: 'application', topics: ['learn'] })
  expect('I need to select an AI tool for our teachers.', { view: 'application', topics: ['learn'] })
  expect('I am evaluating tools for a classroom.', { view: 'application', topics: ['learn'] })
})
check('deciding whether to use AI is an application task', () => {
  expect("I'm deciding whether to use AI in a hospital.", { view: 'application', topics: ['health'] })
})
check('generic decisions and school roles do not imply tool adoption', () => {
  expect('I am choosing a school policy.', { view: null, topics: ['learn'] })
  expect('I am deciding whether to change a hospital policy.', { view: null, topics: ['health'] })
  expect('I am a school procurement officer.', { view: null, topics: ['learn'] })
})
check('negated tool selection stays off', () => {
  expect('I am not choosing tools for a school. I need to investigate a medical claim.', { view: 'contribution', topics: ['health'] })
})
check('discovery is a request, not a profession', () => {
  expect('Find examples of AI helping with ancient Greek inscriptions.', { view: 'outcome', topics: ['discover'] })
})
check('first explicit task beats a later purpose', () => {
  expect('Please check the evidence before preparing a briefing on medical imaging.', { view: 'contribution', topics: ['health'] })
})
check('current explicit intent beats habitual work', () => {
  expect('I write reports, but today I need to investigate claims in archaeology.', { view: 'contribution', topics: ['discover'] })
})
check('multiple themes remain available', () => {
  expect('I am a teacher and a nurse assessing AI adoption in India.', { view: 'application', topics: ['learn', 'health'], country: 'IN' })
})
check('work and machine learning are not benefit topics by themselves', () => {
  expect('My work concerns machine learning.', { view: null, topics: [], recognized: false })
})
check('AI safety is not emergency rescue', () => {
  expect('I research AI safety and national security.', { topics: [], unsupported: ['National security', 'AI safety and security'] })
})
check('insurance, agriculture and public finance stay visibly uncovered', () => {
  expect('Prepare a briefing on insurance, agriculture, and public finance.', { view: 'briefing', topics: [], unsupported: ['Insurance', 'Agriculture', 'Public finance'] })
})
check('climate and energy are not quietly mapped to existing cases', () => {
  expect('I want to evaluate deployment of AI for renewable energy and climate adaptation.', { view: 'application', topics: [], unsupported: ['Climate and energy'] })
})
check('role negation does not erase the positive task', () => {
  expect('I am not a doctor, but I need to brief a school board on tutoring.', { view: 'briefing', topics: ['learn'] })
})
check('a negated task and domain are not inferred', () => {
  expect('Do not investigate national security. Find examples of wildfire rescue instead.', { view: 'outcome', topics: ['safety'], unsupported: [] })
})
check('negated subject after a verb is excluded', () => {
  expect('Insurance is not relevant. I want to prepare a briefing about tutoring.', { view: 'briefing', topics: ['learn'], unsupported: [] })
})
check('not only means both subjects', () => {
  expect('Not only schools but hospitals interest me.', { topics: ['learn', 'health'] })
})
check('negated geography does not become a hint', () => {
  expect('Find examples not in France but in Kenya.', { view: 'outcome', country: 'KE' })
})
check('us as a pronoun is never a country', () => {
  expect('Could this work for us? Show us examples of tutoring.', { country: null })
})
check('punctuated U.S. is a country', () => {
  expect('Find examples of tutoring in the U.S.', { country: 'US' })
})
check('uppercase US needs geographic context', () => {
  expect('I want examples in the US.', { country: 'US' })
  expect('HELP US FIND EXAMPLES.', { country: null })
  expect('TELL ME ABOUT US.', { country: null })
})
check('country names use word boundaries', () => {
  expect('USAID and Indonesian-language documentation.', { country: null })
})
check('ambiguous place or person names need explicit context', () => {
  expect('I am Jordan. I work in Georgia.', { country: null })
  expect('Find examples in the country of Georgia.', { country: 'GE' })
})
check('worldwide country names and accents work', () => {
  expect('I am preparing a memo in Côte d’Ivoire.', { view: 'briefing', country: 'CI' })
  expect('Investigate evidence in Nepal.', { view: 'contribution', country: 'NP' })
})
check('optional fields require the actual information request', () => {
  expect('I need primary sources, model details, and long-term follow-up.', { fields: ['system', 'duration', 'sources'] })
  expect('I need evidence about tutoring.', { fields: [] })
  expect('Compare record versions and customer retention.', { fields: [] })
  expect('Which model did they use and how long did the gain persist?', { fields: ['system', 'duration'] })
})
check('negated optional fields stay off', () => {
  expect('Show source passages, but not model details or long-term follow-up.', { fields: ['sources'] })
})
check('arbitrary input does not execute or leak into the result', () => {
  const text = '<img src=x onerror="globalThis.profileInjection = true"> __proto__ constructor prototype'
  const result = infer(text)
  assert.equal(globalThis.profileInjection, undefined)
  assert.equal(result.recognized, false)
  assert.deepEqual(Object.keys(result), ['view', 'topics', 'country', 'unsupported', 'fields', 'recognized'])
  assert.ok(!JSON.stringify(result).includes(text))
})
check('malformed and non-text input is safe', () => {
  const trapped = new Proxy({}, { get() { throw new Error('Input object inspected') } })
  for (const input of [null, undefined, 34, {}, [], trapped, Symbol('brief a board'), '\ud800']) {
    assert.equal(infer(input).recognized, false)
  }
})
check('only the first 400 characters are considered', () => {
  expect('x'.repeat(400) + ' Prepare a briefing on tutoring.', { recognized: false })
  expect('Prepare a briefing on tutoring. ' + 'x'.repeat(10000), { view: 'briefing', topics: ['learn'] })
})
check('coverage output is an explicit allowlist', () => {
  for (const text of ['national security', 'insurance', 'agriculture', 'climate', 'public finance', 'banking', 'legal research', 'transportation', 'AI safety']) {
    assert.ok(infer(text).unsupported.every(subject => uncoveredSubjects.includes(subject)))
  }
  assert.ok(Object.isFrozen(uncoveredSubjects))
  assert.ok(Object.isFrozen(countries))
  assert.equal(countries.KE, 'Kenya')
  assert.equal(countries.US, 'United States')
  assert.ok(Object.keys(countries).length > 200)
})
check('browser export is the same pure API and needs no network or DOM', () => {
  const context = { window: {} }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../ai-benefits/personalize.js'), 'utf8'), context)
  assert.equal(typeof context.window.BenefitProfile.infer, 'function')
  assert.equal(context.window.BenefitProfile.infer('Prepare a briefing on tutoring.').view, 'briefing')
  assert.deepEqual(Object.keys(context.window.BenefitProfile).sort(), ['countries', 'infer', 'uncoveredSubjects'])
})
console.log(`${count} personalization scenarios passed`)
