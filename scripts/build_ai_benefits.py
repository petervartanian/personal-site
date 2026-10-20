"""Build the benefit-only research database from public-source records."""
from pathlib import Path
from html import escape
from hashlib import sha256
import csv
import io
import json

GRADES = [
    (0, 'No material change', 'Assessment finds no material change in the outcome being rated. Zero requires an assessment; missing evidence is not zero.'),
    (-1, 'Minor benefit', 'A small but meaningful improvement in an existing activity or experience.'),
    (-2, 'Substantial benefit', 'A material improvement in functioning, access, or the ability to pursue a valued activity.'),
    (-3, 'Major benefit', 'Overcoming a serious limitation in functioning or the ability to pursue an essential activity.'),
    (-4, 'Profound benefit', 'Creating, preserving, or restoring a foundational capability or condition, such as life, basic agency, or subsistence.'),
]
GROUPS = {'tierA':'Episode leads', 'clinical':'Clinical literature', 'feeder':'Sources and collections', 'aim':'Reported benefit leads'}
SOURCE_NAMES = {'frnsw-hiker-rescue-2026':'Fire and Rescue NSW','grass-valley-fire-alert-2023':'UC San Diego','create-case-1-lung-cancer':'Cureus · case series','royal-surrey-lung-cancer-triage':'Royal Surrey NHS','sussex-stroke-treatment-2021':'East Sussex NHS'}
PLACES = {'frnsw-hiker-rescue-2026':'Australia','grass-valley-fire-alert-2023':'California, US','create-case-1-lung-cancer':'Turkey / India','royal-surrey-lung-cancer-triage':'United Kingdom','sussex-stroke-treatment-2021':'United Kingdom'}

def e(value): return escape(str(value or ''),quote=True)
def signed(value): return '0' if value == 0 else '−'+str(abs(value))
def embedded(data): return json.dumps(data,ensure_ascii=False).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
def save(path,content): path.write_text('\n'.join(line.rstrip() for line in content.splitlines())+'\n')

def head(root,title,description,path,prefix=''):
    a=root/'ai-benefits'
    css=sha256((a/'style.css').read_bytes()).hexdigest()[:12]
    js=sha256((a/'app.js').read_bytes()).hexdigest()[:12]
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{e(title)}</title><meta name="description" content="{e(description)}"><meta name="theme-color" content="#ffffff"><meta name="author" content="Peter H. Vartanian"><link rel="canonical" href="https://petervartanian.xyz{path}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="website"><meta property="og:url" content="https://petervartanian.xyz{path}"><meta property="og:image" content="https://petervartanian.xyz/ai-benefits/social.png"><meta property="og:image:alt" content="AI Benefits Database: reported benefits, beneficiaries, and evidence"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="{prefix}icon.svg" type="image/svg+xml"><link rel="stylesheet" href="{prefix}style.css?v={css}"><script src="{prefix}app.js?v={js}" defer></script>'''

def header(queue=False):
    base='/ai-benefits/' if queue else ''
    sections=[('benefits','Benefits'),('collection','Cases'),('beneficiaries','Beneficiaries')]
    links=''.join(f'<a href="{base}#{key}" data-nav="{key}"><span>{label}</span></a>' for key,label in sections)
    return f'''<a class="ab-skip" href="#collection">Skip to cases</a><header class="ab-header"><div class="ab-header-inner"><h1><a class="ab-name" href="/ai-benefits/">AI Benefits<br> Database<span>Evidence for beneficial AI</span></a></h1><div class="ab-nav-label">Explore</div><nav class="ab-nav" aria-label="Database sections">{links}<a href="/ai-benefits/sources/"{' aria-current="page"' if queue else ''}><span>Research queue</span></a><a href="{base}#scale" data-nav="scale"><span>Benefit scale</span></a><a href="{base}#methodology" data-nav="methodology"><span>Method &amp; sources</span></a></nav><div class="ab-sidebar-note">An independent research collection.<a class="ab-curator" href="/">Peter H. Vartanian ↗</a></div></div></header>'''

def footer():
    return '''<footer class="ab-footer"><span>Peter H. Vartanian · October 2026</span><span><a href="/ai-benefits/records.csv" download>Download CSV</a><a href="/ai-benefits/records.json" download>Download JSON</a><a href="mailto:peter.vartanian@icloud.com?subject=AI%20Benefits%20Database%20%E2%80%94%20case%20or%20correction">Submit a case or correction</a></span></footer></body></html>'''

def taxonomy(records):
    descriptions={
        'rescue':('Safety','Locating people in danger and supporting their return to safety.'),
        'earlier_warning':('Response','Recognizing a developing emergency and informing a timely human response.'),
        'diagnosis_and_care':('Health','Identifying a condition and connecting a person with clinical care.'),
        'recovery_and_function':('Health','Supporting recovery and a return to valued everyday activities.'),
    }
    # Labels are episode-level editorial classifications, not a copied taxonomy.
    cards=[]
    for key in dict.fromkeys(r['benefit_type']['id'] for r in records):
        cases=[r for r in records if r['benefit_type']['id']==key]
        label=cases[0]['benefit_type']['label']
        category,description=descriptions.get(key,('Benefit',cases[0]['benefit_summary']))
        stakeholders=', '.join(dict.fromkeys(r['stakeholder_class'] for r in cases))
        sources=''.join(f'<a href="{e(r["sources"][0]["url"])}">{e(SOURCE_NAMES[r["id"]])} ↗</a>' for r in cases)
        cards.append(f'''<article class="ab-benefit-card" data-benefit-card="{e(key)}" data-stakeholders="{e(stakeholders)}"><div class="ab-card-category">{e(category)}</div><h2><a href="#collection" data-benefit-link="{e(key)}">{e(label)}</a></h2><p>{e(description)}</p><div class="ab-card-sources"><span>Sources</span>{sources}</div><div class="ab-card-bottom"><span>{e(stakeholders)}</span><a href="#collection" data-benefit-link="{e(key)}">{len(cases)} {'case' if len(cases)==1 else 'cases'} <span aria-hidden="true">→</span></a></div></article>''')
    return f'''<section id="benefits" class="ab-view ab-taxonomy"><div class="ab-page-heading"><div><h2>Benefits</h2><p>Explore beneficial outcomes and the people or organizations they reach.</p></div><span class="ab-total">{len(cards)} benefit types · {len(records)} cases</span></div><form id="taxonomy-filters" class="ab-taxonomy-toolbar" hidden><label><span>Search benefits</span><input id="taxonomy-search" type="search" placeholder="Benefit, source, or beneficiary" autocomplete="off"></label><label><span>Beneficiary</span><select id="taxonomy-stakeholder"><option value="">All beneficiaries</option><option>People</option><option>Organizations</option><option>Society</option></select></label></form><div class="ab-benefit-cards">{''.join(cards)}</div><p id="taxonomy-empty" class="ab-empty" hidden>No matching benefits. Try another term or beneficiary.</p><div class="ab-catalog-note"><strong>From a reported outcome to an inspectable case.</strong><p>Open a benefit to see its episodes, original sources, AI contribution, and conditions for replication. Promotional claims alone do not qualify.</p><p>Current cases draw on one peer-reviewed case series and four institutional accounts. Source review does not independently verify an event or establish causation.</p></div></section>'''

def row(r):
    return f'''<tr class="record" id="{e(r['id'])}"><td><button class="ab-case-button" data-record="{e(r['id'])}" type="button" aria-pressed="false"><span class="ab-ref">{e(r['record_number'])}</span><span>{e(r['display_title'])}</span></button><span class="ab-secondary">{e(PLACES[r['id']])} · Reported {e(r['publication_date'][:4])}</span></td><td><span class="ab-benefit">{e(r['benefit_type']['label'])}</span><span class="ab-secondary">{e(', '.join(r['stakeholder_groups']))}</span></td><td><a class="ab-source" href="{e(r['sources'][0]['url'])}">{e(SOURCE_NAMES[r['id']])} ↗</a><span class="ab-secondary">{e(r['evidence_basis']['source_kind'])}</span></td></tr>'''

def event_date_display(r):
    from datetime import datetime

    def readable(value):
        formats = {10: '%Y-%m-%d', 7: '%Y-%m', 4: '%Y'}
        try:
            date = datetime.strptime(value, formats[len(value)])
        except (KeyError, ValueError):
            return value
        if len(value) == 10:
            return f'{date:%B} {date.day}, {date.year}'
        return date.strftime('%B %Y' if len(value) == 7 else '%Y')

    value = r.get('event_date')
    precision = r.get('date_precision', '').strip()
    if not value:
        return precision or 'Not reported.'
    date = '–'.join(readable(part) for part in value.split('/'))
    if not precision or precision.lower() == 'day':
        return date
    return f'{date}. {precision[0].upper()}{precision[1:]}'

def inspector(r):
    fields=[('Reported benefit',r['observed_outcome']),('AI’s contribution',r['ai_contribution']),('People’s contribution',r['human_contribution'])]
    return f'''<details class="ab-detail" id="detail-{e(r['id'])}" open><summary>{e(r['record_number'])} · {e(r['display_title'])}</summary><div class="ab-detail-head"><span class="ab-ref">{e(r['record_number'])}</span><a class="ab-permalink" href="#{e(r['id'])}">Record link ↗</a></div><h2>{e(r['display_title'])}</h2><p class="ab-detail-location">{e(r['location'])}</p><a class="ab-primary-source" href="{e(r['sources'][0]['url'])}">Read the original source ↗</a><p class="ab-source-kind">{e(r['evidence_basis']['source_kind'])} · {e(r['sources'][0].get('published'))}</p><dl class="ab-evidence">{''.join(f'<div><dt>{e(label)}</dt><dd>{e(value)}</dd></div>' for label,value in fields)}</dl><details class="ab-more" open><summary>Evidence and attribution limits</summary><p>{e(r['limitations'])}</p><p>{e(r['evidence_basis']['verification_limit'])}</p></details><details class="ab-more"><summary>Beneficiaries and context</summary><p>{e(r['stakeholder_detail'])}</p><dl><dt>System</dt><dd>{e(r['system'])}</dd><dt>Event date</dt><dd>{e(event_date_display(r))}</dd><dt>Benefit magnitude</dt><dd>Unassessed. No magnitude grade has been assigned.</dd></dl></details><details class="ab-more"><summary>Conditions for replication</summary><p>{e(r['replication_hypothesis'])}</p><p>These are hypotheses to investigate, not validated instructions.</p></details><details class="ab-more"><summary>Tradeoffs and missing evidence</summary><p>{e(r['tradeoffs'])}</p></details><p class="ab-review">Source checked {e(r['reviewed_date'])}. Benefit labels are editorial classifications. The event has not been independently verified by this database.</p></details>'''

def scale(palette):
    buttons=''.join(f'<button type="button" class="ab-grade" data-grade="{value}" aria-pressed="{str(value==0).lower()}"><span class="ab-grade-num">{signed(value)}</span><span class="ab-swatch" style="background:{palette["colors"]["normal"][i]}" aria-hidden="true"></span><span>{e(label)}</span></button>' for i,(value,label,_) in enumerate(GRADES))
    return f'''<section id="scale" class="ab-view ab-section"><div class="ab-section-heading"><h2>Benefit scale</h2><p>Four degrees of benefit, with zero as the reference point.</p></div><div class="ab-scale-layout"><div><div class="ab-scale-track" role="group" aria-label="Proposed benefit magnitude grades">{buttons}</div><div class="ab-grade-definition" aria-live="polite"><h3 id="grade-title">0 · No material change</h3><p id="grade-description">{e(GRADES[0][2])}</p></div><noscript><dl>{''.join(f'<dt>{signed(v)} · {e(label)}</dt><dd>{e(description)}</dd>' for v,label,description in GRADES)}</dl></noscript></div><aside class="ab-scale-notes"><h3>Unassessed is separate</h3><p>Unknown magnitude is not zero. None of the current records has been graded.</p><p>Assess the depth of benefit for a specified beneficiary. Record reach, duration, and distribution separately.</p><details><summary>Color accessibility</summary><label>Color view<select id="color-view"><option value="normal">Original</option><option value="deuteranopia">Deuteranopia simulation</option><option value="protanopia">Protanopia simulation</option><option value="tritanopia">Tritanopia simulation</option><option value="grayscale">Grayscale</option></select></label><p id="simulation-note" hidden>A modeled view, not a guarantee of individual perception. Numbers and labels remain the primary identifiers.</p></details></aside></div><p class="ab-scale-caption">Proposed ordinal anchors. Increasingly negative numbers indicate greater benefit; they are not equal units. The number of levels and their definitions remain open to refinement.</p></section>'''

def method():
    return '''<section id="methodology" class="ab-view ab-section ab-method"><div class="ab-section-heading"><h2>Method</h2><p>Inspectable sources and specific outcomes.</p></div><div class="ab-method-grid"><div><h3>What belongs here</h3><p>A real episode with a reported benefit, identifiable beneficiaries, an explicit AI role, and an accessible public source. Useful operational outcomes qualify, but are distinguished from downstream improvements to health or welfare.</p></div><div><h3>How evidence is described</h3><p>Research, operational accounts, and institutional patient accounts retain their source type. Checking a source does not independently verify an event. A reported benefit does not establish how much of it was caused by AI.</p></div><div><h3>Who benefits</h3><p>Beneficiary groups are informed by <a href="https://trustible.ai/a-framework-for-measuring-the-benefits-of-ai/">Trustible’s benefits framework</a>: people, organizations, and society. Episode labels and assignments here are editorial judgments, not Trustible endorsements.</p></div><div><h3>How benefits can recur</h3><p>Each case identifies conditions worth investigating for replication over time and across settings. A selected collection cannot establish prevalence, comparative effectiveness, or a benefit’s long-term durability.</p></div></div><details class="ab-method-details"><summary>Research queue, corrections, and reuse</summary><p>The Gazetteer supplies a separate queue of leads screened for relevance to beneficial outcomes. Their source verification and AI attribution remain pending. Legacy severity labels are not imported into this database.</p><p>Submit a public source, the episode it describes, and evidence that changes the interpretation. Cite Peter H. Vartanian, <em>AI Benefits Database</em>, October 2026, the record identifier, and the original sources. Source materials retain their own terms.</p></details></section>'''

def build(root):
    root=Path(root);a=root/'ai-benefits'
    data=json.loads((a/'records.json').read_text());records=data['records']
    palette=json.loads((a/'palette.json').read_text());leads=json.loads((a/'leads.json').read_text())
    structured={'@context':'https://schema.org','@type':'Dataset','name':'AI Benefits Database','description':data['scope'],'url':'https://petervartanian.xyz/ai-benefits/','dateModified':data['updated'],'creator':{'@type':'Person','name':data['curator']},'distribution':[{'@type':'DataDownload','encodingFormat':typ,'contentUrl':f'https://petervartanian.xyz/ai-benefits/records.{ext}'} for typ,ext in [('text/csv','csv'),('application/json','json')]]}
    html=head(root,'AI Benefits Database','Publicly reported benefits of AI, organized by beneficiaries, outcomes, and source evidence.','/ai-benefits/')+f'<script type="application/ld+json">{embedded(structured)}</script></head><body class="ab-app" id="top" data-page="records">'+header()
    types={r['benefit_type']['id']:r['benefit_type']['label'] for r in records}
    html+=f'''<main>{taxonomy(records)}<section id="collection" class="ab-view ab-collection"><div class="ab-page-heading"><div><h2>Cases</h2><p>Reported outcomes, who benefited, and what the evidence supports.</p></div><span class="ab-total">{len(records)} source-reviewed cases</span></div><form id="filters" class="ab-toolbar" hidden><label class="ab-search-label"><span>Search cases</span><input type="search" id="search" placeholder="Outcome, system, person, or place" autocomplete="off"></label><label><span>Beneficiary</span><select id="stakeholder"><option value="">All beneficiaries</option><option>People</option><option>Organizations</option><option>Society</option></select></label><label><span>Benefit</span><select id="benefit"><option value="">All benefits</option>{''.join(f'<option value="{e(k)}">{e(v)}</option>' for k,v in types.items())}</select></label><label><span>Order</span><select id="sort"><option value="record">Record number</option><option value="newest">Newest report</option><option value="oldest">Oldest report</option></select></label></form><div class="ab-results-line"><p id="result-count" aria-live="polite">{len(records)} cases</p><div id="filter-actions" hidden><button id="reset" type="button">Clear filters</button><button id="export-view" type="button">Export current view</button></div></div><noscript><p>All records and sources are available below. JavaScript adds filtering and the side-by-side evidence viewer.</p></noscript><div class="ab-workspace"><div class="ab-register"><table class="ab-table"><thead><tr><th scope="col">Beneficial episode</th><th scope="col">Benefit / beneficiary</th><th scope="col">Evidence</th></tr></thead><tbody id="records">{''.join(row(r) for r in records)}</tbody></table><div class="ab-empty" id="empty-state" hidden><h2>No matching cases</h2><p>Try a broader term or another beneficiary group.</p><button id="empty-reset" type="button">Clear filters</button></div><p class="ab-register-note">Source type is visible for every case. A source-supported report is not the same as independently verified causation.</p></div><aside class="ab-inspector" id="evidence-panel" aria-label="Selected case evidence">{''.join(inspector(r) for r in records)}</aside></div></section>
    <section class="ab-view ab-section" id="beneficiaries"><div class="ab-section-heading"><h2>By beneficiary</h2><p>Directly reported benefits; intended downstream beneficiaries remain separate.</p></div><div class="ab-beneficiary-grid">{''.join(f'<button type="button" data-stakeholder="{name}"><span>{name}</span><span>{sum(r["stakeholder_class"]==name for r in records)} cases</span></button>' for name in ['People','Organizations','Society'])}</div></section>'''
    html+=scale(palette)+method()+f'''<section class="ab-queue-link"><div><h2>Research queue</h2><p>{len(leads['records'])} screened leads from the Gazetteer, awaiting source and attribution review.</p></div><a href="sources/">Browse research leads ↗</a></section></main><script type="application/json" id="records-data">{embedded(data)}</script><script type="application/json" id="scale-data">{embedded({'grades':GRADES,'palette':palette})}</script>'''+footer()
    save(a/'index.html',html)
    output=io.StringIO(newline='');keys=list(dict.fromkeys(k for r in records for k in r))
    writer=csv.DictWriter(output,fieldnames=keys,lineterminator='\n');writer.writeheader();writer.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(list,dict)) else v for k,v in r.items()} for r in records)
    (a/'records.csv').write_text(output.getvalue())
    queue=a/'sources';queue.mkdir(exist_ok=True)
    html=head(root,'Research queue · AI Benefits Database','Public-source leads about beneficial AI outcomes, screened for relevance and awaiting verification.','/ai-benefits/sources/','../')+'</head><body class="ab-app" id="top" data-page="sources">'+header(True)
    groups={key:label for key,label in GROUPS.items() if any(r['source_group']==key for r in leads['records'])}
    html+=f'''<main><section id="collection" class="ab-view ab-collection"><div class="ab-page-heading"><div><h2>Research queue</h2><p>Benefit-focused leads from the Gazetteer. Source verification and AI attribution remain pending.</p></div><span class="ab-total">{len(leads['records'])} leads</span></div><form class="ab-toolbar ab-queue-toolbar" id="lead-filters" hidden><label class="ab-search-label"><span>Search leads</span><input type="search" id="search" placeholder="Report, system, or location" autocomplete="off"></label><label><span>Source group</span><select id="lead-group"><option value="">All groups</option>{''.join(f'<option value="{key}">{label}</option>' for key,label in groups.items())}</select></label></form><div class="ab-results-line"><p id="lead-count" role="status">{len(leads['records'])} research leads</p><div><button id="lead-reset" type="button" hidden>Clear filters</button><a href="../leads.json" download>Download leads</a></div></div><noscript><p><a href="../leads.json">Download the complete research queue as JSON.</a> JavaScript enables searching.</p></noscript><div id="lead-list" class="ab-lead-list"></div><nav id="pagination" class="ab-pagination" aria-label="Research queue pages" hidden><button id="previous" type="button">Previous</button><span id="page-status"></span><button id="next" type="button">Next</button></nav></section></main>'''+footer()
    save(queue/'index.html',html)
    print(f'Built benefit-only database: {len(records)} cases, {len(leads["records"])} screened leads, no positive severity grades.')

if __name__=='__main__': build(Path(__file__).resolve().parents[1])
