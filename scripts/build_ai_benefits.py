"""Generate the public AI Benefits Database from reviewed, public-source records."""
from pathlib import Path
from html import escape
import csv
import io
import json
from hashlib import sha256

CATEGORIES = {
    'benefit_created': 'Benefit created or restored',
    'harm_prevented': 'Specific harm prevented',
    'protective_response': 'Protective response',
}
GRADES = [
    (-4, 'Profound benefit', 'Creates, preserves, or restores a foundational capability or condition, such as life, basic agency, or subsistence.'),
    (-3, 'Major benefit', 'Overcomes a serious limitation in functioning or the ability to pursue an essential activity.'),
    (-2, 'Substantial benefit', 'Materially improves functioning, access, or the ability to pursue a valued activity.'),
    (-1, 'Minor benefit', 'Provides a small but meaningful improvement in an existing activity or experience.'),
    (0, 'No material change', 'Assessment finds no material change in the outcome being rated.'),
    (1, 'Minor harm', 'Causes a small but meaningful setback in an existing activity or experience.'),
    (2, 'Substantial harm', 'Materially impairs functioning, access, or the ability to pursue a valued activity.'),
    (3, 'Severe harm', 'Causes a serious loss of functioning or the ability to pursue an essential activity.'),
    (4, 'Catastrophic harm', 'Causes death or destroys foundational agency or the conditions necessary for essential functioning.'),
]
GROUPS = {'tierA': 'Curated leads', 'clinical': 'Clinical leads', 'feeder': 'Sources and collections', 'exemplar': 'Harm comparisons', 'aim': 'OECD monitor leads'}

def e(value):
    return escape(str(value or ''), quote=True)

def embedded(data):
    return json.dumps(data, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')

def sign(value):
    return f'−{abs(value)}' if value < 0 else f'+{value}' if value > 0 else '0'

def event_label(record):
    day = record.get('event_date')
    if not day:
        return 'Date unreported'
    if '/' in day:
        return '2023–2024 study period'
    from datetime import date
    return date.fromisoformat(day).strftime('%b. %d, %Y').replace(' 0', ' ')

def field(label, value, emphasis=False):
    return f'<div class="evidence-field{" emphasis" if emphasis else ""}"><h4>{e(label)}</h4><p>{e(value)}</p></div>'

def record_html(r):
    fields = ''.join(field(label, r[key], key == 'limitations') for label, key in [
        ('AI’s contribution', 'ai_contribution'), ('Human contribution', 'human_contribution'),
        ('What the source establishes', 'evidence_supports'), ('Attribution limits', 'limitations'),
        ('Tradeoffs and missing evidence', 'tradeoffs'), ('Conditions for replication to investigate', 'replication_hypothesis')])
    facts = ''.join(f'<div><dt>{e(label)}</dt><dd>{e(r[key])}</dd></div>' for label, key in [
        ('Beneficiaries', 'beneficiaries'), ('Intendedness', 'intendedness'), ('Date precision', 'date_precision'), ('Evidence', 'evidence_type')])
    sources = ''.join(f'<li><a href="{e(s["url"])}">{e(s["title"])} ↗</a><small>{e(s.get("type", "Public source"))} · Published {e(s.get("published"))}</small></li>' for s in r['sources'])
    return f'''<details class="record" id="{e(r['id'])}" data-category="{e(r['category'])}" data-sector="{e(r['sector'])}" data-published="{e(r['publication_date'])}" data-number="{e(r['record_number'])}">
      <summary aria-label="Open record {e(r['record_number'])}: {e(r['title'])}">
        <div class="record-number-cell"><span class="record-no">{e(r['record_number'])}</span><p class="record-date">{e(event_label(r))}</p></div>
        <div class="record-main"><h3>{e(r['title'])}</h3><p class="record-excerpt">{e(r['observed_outcome'])}</p><p class="record-place">{e(r['location'])}</p></div>
        <div class="record-class"><p class="record-kind">{e(CATEGORIES[r['category']])}</p><p class="record-sector">{e(r['sector'])}</p><span class="assessment"><span class="unknown" aria-hidden="true"></span>Grade unassessed</span></div>
        <span class="expand" aria-hidden="true">+</span>
      </summary>
      <div class="record-content">
        <p class="standfirst"><span class="meta-label">SYSTEM</span><br>{e(r['system'])}</p>
        <div class="evidence-grid">{fields}</div>
        <dl class="record-facts">{facts}<div><dt>Consequence assessment</dt><dd>Unassessed. The <a href="#scale">proposed scale</a> has not yet been applied to this record.</dd></div><div><dt>Replication</dt><dd>Conditions listed here are hypotheses for further investigation.</dd></div></dl>
        <h4>Original source</h4><ul class="source-list">{sources}</ul>
        {f'<p class="record-place">{e(r["source_case_identifier"])}</p>' if r.get('source_case_identifier') else ''}
        <div class="record-bottom"><p>Source reviewed {e(r['reviewed_date'])}. Classification and limitations are editorial judgments. Source review does not independently verify the event.</p><a class="permalink" href="#{e(r['id'])}">Link to this record ↗</a></div>
      </div>
    </details>'''

def head(root, title, description, path, prefix=''):
    asset = root / 'ai-benefits'
    css = sha256((asset/'style.css').read_bytes()).hexdigest()[:12]
    js = sha256((asset/'app.js').read_bytes()).hexdigest()[:12]
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
      <title>{e(title)}</title><meta name="description" content="{e(description)}"><meta name="author" content="Peter H. Vartanian"><meta name="theme-color" content="#ffffff">
      <link rel="canonical" href="https://petervartanian.xyz{path}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="website"><meta property="og:url" content="https://petervartanian.xyz{path}"><meta property="og:image" content="https://petervartanian.xyz/ai-benefits/social.png"><meta property="og:image:alt" content="AI Benefits Database — outcomes, evidence, replication"><meta name="twitter:card" content="summary_large_image">
      <link rel="icon" href="{prefix}icon.svg" type="image/svg+xml"><link rel="stylesheet" href="{prefix}style.css?v={css}"><script src="{prefix}app.js?v={js}" defer></script>'''

def header(sources=False):
    base = '/ai-benefits/' if sources else ''
    return f'''<a class="skip" href="#collection">Skip to records</a><div class="wrap"><header class="topbar"><a class="brand" href="/ai-benefits/"><img src="/ai-benefits/icon.svg" alt="" width="28" height="28">AI Benefits Database</a><nav class="nav" aria-label="Main navigation"><a href="{base}#collection">Records</a><a href="{base}#scale">Scale</a><a href="{base}#methodology">Method</a><a href="/ai-benefits/sources/"{' aria-current="page"' if sources else ''}>Research leads</a><a class="home" href="/">Peter H. Vartanian ↗</a></nav></header>'''

def footer():
    return '''<footer class="footer"><span>Curated by <a href="/">Peter H. Vartanian</a></span><span>First edition · October 2026</span><span><a href="/ai-benefits/records.json" download>JSON</a> &nbsp; / &nbsp; <a href="/ai-benefits/records.csv" download>CSV</a> &nbsp; / &nbsp; <a href="#top">Back to top ↑</a></span></footer></div></body></html>'''

def search_input(placeholder):
    return f'''<label class="control search-control">Search<span class="search-wrap"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" id="search" name="q" placeholder="{e(placeholder)}" autocomplete="off"></span></label>'''

def scale_html(palette):
    buttons = ''.join(f'<button class="grade" type="button" data-grade="{v}" aria-pressed="{str(v==0).lower()}"><span class="grade-number">{sign(v)}</span><span class="swatch" style="background:{palette["colors"]["normal"][i]}" aria-hidden="true"></span><span class="grade-name">{e(label)}</span></button>' for i, (v,label,_) in enumerate(GRADES))
    return f'''<section class="scale-section" id="scale" aria-labelledby="scale-title"><div class="section-label"><span class="mono">01 /</span><h2 id="scale-title">A scale for consequences</h2></div>
      <div class="scale-intro"><p>Benefits extend below zero; harms extend above it. A shared zero preserves the possibility of <em>no material change</em>. Select a grade to explore its meaning.</p><p class="note">These are proposed reference grades. Assess depth for a stated beneficiary and outcome; document reach, duration, distribution, and evidence separately. The collection’s records are not yet graded.</p></div>
      <div class="scale-tools"><div class="scale-directions"><span>← Increasing benefit</span><span>Increasing harm →</span></div><label class="color-control">Color view<select id="color-view"><option value="normal">Original</option><option value="deuteranopia">Deuteranopia simulation</option><option value="protanopia">Protanopia simulation</option><option value="tritanopia">Tritanopia simulation</option><option value="grayscale">Grayscale</option></select></label></div>
      <div class="scale-track" role="group" aria-label="Proposed consequence grades">{buttons}</div>
      <noscript><dl>{''.join(f'<dt>{sign(v)} · {e(label)}</dt><dd>{e(description)}</dd>' for v,label,description in GRADES)}</dl></noscript>
      <div class="scale-definition" aria-live="polite" aria-atomic="true"><h3 id="grade-title">0 · No material change</h3><p id="grade-description">Assessment finds no material change in the outcome being rated.</p></div>
      <div class="scale-foot"><span class="assessment"><span class="unknown" aria-hidden="true"></span>Unassessed sits outside the scale.</span><span>Ordered grades; not equal units or a net score.</span></div>
      <p class="simulation-note" id="simulation-note" hidden>Modeled color-vision simulation, not a guarantee of an individual’s perception. Signs and labels carry meaning in every view.</p>
      <details class="method-details" style="margin-top:24px;font-size:12px"><summary style="min-height:44px;padding:10px 0">Reading the scale and its colors</summary><div class="method-text"><p>Zero requires an assessment; missing evidence does not count as zero. Record benefits and harms separately when an episode produces both. They cannot be canceled or added. A near miss is a separate event status.</p><p>Color becomes darker away from zero on each side. The palette is <a href="https://www.fabiocrameri.ch/colourmaps/">Fabio Crameri’s vik</a>, sampled at nine fixed positions. Simulations use the <a href="https://doi.org/10.1109/TVCG.2009.113">Machado et al. model</a> through Colorspacious. Color provides visual order; it does not validate the grade definitions or make welfare comparable. <a href="PALETTE-LICENSE.txt">Palette attribution and license</a>.</p></div></details>
    </section>'''

def method_html():
    return '''<section class="method" id="methodology" aria-labelledby="method-title"><div class="method-intro"><p class="eyebrow">02 / Documentation</p><h2 id="method-title" style="font-size:33px;font-weight:500;letter-spacing:-.04em">What earns a record?</h2><p>A bounded episode, an identifiable outcome, an explicit AI role, and a source that can be inspected.</p><a href="mailto:peter.vartanian@icloud.com?subject=AI%20Benefits%20Database%20%E2%80%94%20case%20or%20correction">Suggest a case or correction ↗</a></div><div class="method-body">
      <details open><summary>Outcomes and protective responses</summary><div class="method-text"><dl><dt>1 · Benefit created or restored</dt><dd>A reported improvement for an identifiable beneficiary, such as diagnosis, recovery, or rescue. AI’s causal contribution may remain uncertain.</dd><dt>2A · Specific harm prevented</dt><dd>Evidence links an intervention to stopping a particular harmful trajectory, with support for what would otherwise have happened. No initial record meets this threshold.</dd><dt>2B · Protective response</dt><dd>A response acted on a threat, but a particular loss avoided remains unproven.</dd></dl><p>These are outcome types, not magnitude grades. Studies, simulations, benchmarks, and broad deployment claims supply research context rather than individual event records.</p></div></details>
      <details><summary>Evidence and attribution</summary><div class="method-text"><p>Each entry distinguishes the reported outcome from what AI and people contributed. Source review asks whether the source supports the description; it does not independently verify the event. Program and hospital accounts can be selective or promotional.</p><p>Diagnosis, treatment, and recovery are different outcomes. An early-stage diagnosis does not establish that AI saved a life. No reported harm does not establish the absence of harm. Event dates, publication dates, and uncertain dates remain distinct.</p><p>For context, <a href="https://www.uclh.nhs.uk/news/ai-driven-technology-does-not-speed-lung-cancer-diagnosis">the LungIMPACT trial</a> found faster X-ray reporting without significantly faster lung cancer diagnosis. Individual episodes and comparative effectiveness answer different questions.</p></div></details>
      <details><summary>Depth, reach, and the long term</summary><div class="method-text"><p>The proposed scale describes depth of consequence for a stated beneficiary and outcome. Reach, duration, distribution, reversibility, and longer-term consequences require their own evidence. A local benefit can be profound; a widespread effect can be small.</p><p>The four degrees on each side are provisional anchors for use and refinement. They are not an empirically established optimum. Raters should record their rationale and uncertainty, and preserve disagreement. Long-term benefit includes what can be created, restored, sustained, and repeated.</p></div></details>
      <details><summary>Learning how benefits can recur</summary><div class="method-text"><p>Each record names conditions worth investigating: trained operators, human confirmation, accessible services, timely action, or institutional capacity. These are hypotheses, not validated instructions. The aim is to learn how beneficial outcomes might be replicated across settings and over time.</p><p>This selected collection cannot estimate prevalence, effectiveness, or net benefit. Such estimates need denominators, comparisons, costs, adverse outcomes, and distributional evidence. Related work includes <a href="https://trustible.ai/ai-benefits/">Trustible’s AI benefits taxonomy</a> and <a href="https://link.springer.com/article/10.1007/s43681-024-00600-9">Hilliard, Kazim, and Ledain on benefits and risk perceptions</a>.</p></div></details>
      <details><summary>Contribute, correct, or reuse</summary><div class="method-text"><p>Send a public source, the episode it describes, the outcome, and any evidence that changes the interpretation. Please omit confidential information and unpublished personal details. Submissions are reviewed before inclusion.</p><p>Downloads preserve source links, attribution limits, and replication hypotheses. Cite Peter H. Vartanian, <em>AI Benefits Database</em>, first edition, October 19, 2026, the record identifier, and the original source. Source materials retain their own terms.</p></div></details>
    </div></section>'''

def build(root):
    root = Path(root)
    directory = root / 'ai-benefits'
    data = json.loads((directory/'records.json').read_text())
    palette = json.loads((directory/'palette.json').read_text())
    records = data['records']
    leads = json.loads((directory/'leads.json').read_text())
    jsonld = {'@context':'https://schema.org','@type':'Dataset','name':data['title'],'description':data['scope'],'url':'https://petervartanian.xyz/ai-benefits/','dateModified':data['updated'],'creator':{'@type':'Person','name':data['curator']},'distribution':[{'@type':'DataDownload','encodingFormat':typ,'contentUrl':f'https://petervartanian.xyz/ai-benefits/records.{ext}'} for typ,ext in [('application/json','json'),('text/csv','csv')]]}
    html = head(root, 'AI Benefits Database', 'Documented episodes of beneficial AI use: outcomes, human contributions, primary sources, and conditions for replication.', '/ai-benefits/')
    html += f'<script type="application/ld+json">{embedded(jsonld)}</script></head><body id="top" data-page="records">' + header()
    html += f'''<main><section class="hero" aria-labelledby="page-title"><div><p class="eyebrow">An open record of beneficial outcomes</p><h1 id="page-title">AI Benefits<br>Database</h1></div><div class="hero-intro"><p>What happened. Who benefited.<br>What it would take to happen again.</p><div class="edition"><span class="number">{len(records):02d}</span><p>DOCUMENTED EPISODES<br>Selected collection · Updated October 19, 2026</p></div></div></section>
      <section class="collection" id="collection" aria-labelledby="collection-title"><div class="section-top"><h2 id="collection-title">The records <span class="count">{len(records):02d}</span></h2><a href="records.csv" download>Download all records ↓</a></div>
      <noscript><p class="nojs">All five records, their evidence, and downloads are available below. JavaScript adds search, filters, and interactive scale definitions.</p></noscript>
      <form class="filter-form" id="filters" hidden>{search_input('Search outcomes, places, systems…')}<label class="control">Domain<select id="sector" name="sector"><option value="">All domains</option><option>Emergency response</option><option>Healthcare</option></select></label><label class="control">Outcome type<select id="category" name="outcome"><option value="">All outcome types</option>{''.join(f'<option value="{key}">{e(label)}</option>' for key,label in CATEGORIES.items())}</select></label><label class="control order-control">Order by<select id="sort" name="order"><option value="record">Record number</option><option value="newest">Recently reported</option><option value="oldest">Oldest report first</option></select></label></form>
      <div class="filter-foot"><p class="result-count" id="result-count" aria-live="polite">{len(records)} records · all grades unassessed</p><div class="filter-actions" id="filter-actions" hidden><button class="text-button" type="button" id="reset">Reset filters</button><button class="text-button" type="button" id="export-view">Export this view ↓</button></div></div>
      <div class="list-head" aria-hidden="true"><span>Record / event</span><span>Episode &amp; reported outcome</span><span>Type / domain</span><span></span></div><div class="records" id="records">{''.join(record_html(r) for r in records)}</div><div class="empty" id="empty-state" hidden><h3>No matching records</h3><p>Try a broader term or another outcome type.</p><button type="button" class="text-button" id="empty-reset">Clear search and filters</button></div></section>'''
    html += scale_html(palette) + method_html()
    html += f'''<section class="directory-promo"><div><p class="eyebrow">03 / From the Gazetteer</p><h2>A wider field of inquiry.</h2><p>{len(leads['records']):,} research leads, source collections, clinical reports, and comparisons to explore.</p></div><div class="directory-right"><p>The original Gazetteer’s data opens paths for further research. These imported leads await reassessment and sit separately from the documented episodes above.</p><a class="directory-link" href="sources/">Explore the research leads <span aria-hidden="true">↗</span></a></div></section></main>'''
    html += f'<script type="application/json" id="records-data">{embedded(data)}</script><script type="application/json" id="scale-data">{embedded({"grades":GRADES,"palette":palette})}</script>' + footer()
    (directory/'index.html').write_text('\n'.join(line.rstrip() for line in html.splitlines()) + '\n')
    output = io.StringIO(newline='')
    writer = csv.DictWriter(output, fieldnames=list(records[0].keys()), lineterminator='\n')
    writer.writeheader()
    writer.writerows({key:json.dumps(value,ensure_ascii=False) if isinstance(value,(list,dict)) else value for key,value in r.items()} for r in records)
    (directory/'records.csv').write_text(output.getvalue())
    sources = directory/'sources'
    sources.mkdir(exist_ok=True)
    html = head(root, 'Research leads · AI Benefits Database', 'Search 673 imported Gazetteer research leads, source collections, clinical reports, and harm comparisons. These leads await reassessment.', '/ai-benefits/sources/', '../') + '</head><body id="top" data-page="sources">' + header(True)
    html += f'''<main><section class="directory-hero"><p class="eyebrow">The Gazetteer / Research register</p><h1>Follow the evidence.</h1><p>A searchable directory of {len(leads['records']):,} imported leads: individual reports, clinical literature, source collections, and harm comparisons.</p><div class="directory-note">These are unreviewed research leads, not {len(leads['records']):,} verified benefits. Original descriptions and locations may need correction; AI attribution, duplicate reports, and causal claims require review. They do not inherit grades from the consequence scale.</div></section>
      <section id="collection" aria-labelledby="leads-title"><div class="section-top"><h2 id="leads-title">Research leads <span class="count">{len(leads['records'])}</span></h2><a href="../leads.json" download>Download the directory ↓</a></div><form class="filter-form directory-filters" id="lead-filters" hidden>{search_input('Search reports, systems, locations…')}<label class="control">Source group<select id="lead-group"><option value="">All source groups</option>{''.join(f'<option value="{key}">{label} ({sum(r["source_group"]==key for r in leads["records"])})</option>' for key,label in GROUPS.items())}</select></label></form><div class="filter-foot"><p class="result-count" id="lead-count" role="status">{len(leads['records'])} imported research leads</p><button type="button" class="text-button" id="lead-reset" hidden>Reset filters</button></div><noscript><p class="nojs">Download the <a href="../leads.json">complete research directory as JSON</a>, or browse the <a href="../">documented episodes</a>. JavaScript enables searching and pagination here.</p></noscript><div class="directory-list" id="lead-list"></div><nav class="pagination" id="pagination" aria-label="Research lead pages" hidden><button id="previous" type="button">← Previous</button><span id="page-status"></span><button id="next" type="button">Next →</button></nav></section></main>''' + footer()
    (sources/'index.html').write_text('\n'.join(line.rstrip() for line in html.splitlines()) + '\n')
    print(f'Built AI Benefits Database: {len(records)} documented episodes and {len(leads["records"])} separate research leads.')

if __name__ == '__main__':
    build(Path(__file__).resolve().parents[1])
