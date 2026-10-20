"""Build the public AI Benefits Database and its permanent evidence records."""

from __future__ import annotations

import csv
import io
import json
from hashlib import sha256
from html import escape
from pathlib import Path
from typing import Any

BASE = "/ai-benefits/"
SITE = "https://petervartanian.xyz"
TOPICS = {
    "learn": "Learning",
    "discover": "Discovery",
    "health": "Health",
    "safety": "Safety",
}
GROUPS = {
    "tierA": "Episode leads",
    "clinical": "Clinical literature",
    "feeder": "Collections",
    "aim": "Public reports",
}
CONTACT = "mailto:peter.vartanian@icloud.com?subject=AI%20Benefits%20Database"


def e(value: Any) -> str:
    return escape(str(value or ""), quote=True)


def embedded(value: Any) -> str:
    return (
        json.dumps(value, ensure_ascii=False)
        .replace("<", "\\u003c")
        .replace(">", "\\u003e")
        .replace("&", "\\u0026")
    )


def save(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(line.rstrip() for line in content.splitlines()) + "\n")


def record_path(record: dict) -> str:
    return BASE + "records/" + record["id"] + "/"


def link(url: str, text: str, css: str = "") -> str:
    return f'<a class="{e(css)}" href="{e(url)}" target="_blank" rel="noopener noreferrer">{e(text)} <span aria-hidden="true">↗</span></a>'


def shell(
    root: Path,
    title: str,
    description: str,
    path: str,
    section: str,
    content: str,
    payload: Any = None,
    record: dict | None = None,
) -> str:
    a = root / "ai-benefits"
    version = {
        name: sha256((a / name).read_bytes()).hexdigest()[:12]
        for name in ("style.css", "app.js")
    }
    navigation = [
        ("explore", "Explore", BASE),
        ("compare", "Compare", BASE + "compare/"),
        ("sources", "Research leads", BASE + "sources/"),
        ("method", "Method", BASE + "method/"),
    ]
    nav = "".join(
        f'<a href="{url}"'
        + (' aria-current="page"' if key == section else "")
        + f">{label}</a>"
        for key, label, url in navigation
    )
    brand_tag = "h1" if section == "explore" else "div"
    structured = {
        "@context": "https://schema.org",
        "@type": "Dataset" if section == "explore" else "WebPage",
        "name": title,
        "description": description,
        "url": SITE + path,
        "inLanguage": "en-US",
        "creator": {"@type": "Person", "name": "Peter H. Vartanian"},
    }
    if section == "explore":
        structured["distribution"] = [
            {
                "@type": "DataDownload",
                "encodingFormat": kind,
                "contentUrl": SITE + BASE + "records." + ext,
            }
            for kind, ext in [("application/json", "json"), ("text/csv", "csv")]
        ]
    if record:
        structured["citation"] = [source["url"] for source in record["sources"]]
        structured["dateModified"] = record["reviewed_date"]
    return f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(description)}"><meta name="author" content="Peter H. Vartanian">
<meta name="color-scheme" content="light dark"><meta name="theme-color" content="#F7F8F4" media="(prefers-color-scheme:light)"><meta name="theme-color" content="#181D1C" media="(prefers-color-scheme:dark)">
<link rel="canonical" href="{SITE}{path}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="website"><meta property="og:url" content="{SITE}{path}"><meta property="og:image" content="{SITE}{BASE}social.png"><meta property="og:image:alt" content="AI Benefits Database. What becomes possible?"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{BASE}icon.svg" type="image/svg+xml"><link rel="preload" href="{BASE}archivo-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="{BASE}style.css?v={version['style.css']}"><script src="{BASE}app.js?v={version['app.js']}" defer></script>
<script type="application/ld+json">{embedded(structured)}</script>
</head><body class="benefits-app" data-page="{section}">
<a class="bc-skip" href="#main">Skip to content</a>
<header class="bc-header"><{brand_tag} class="bc-brand"><a href="{BASE}">AI Benefits Database</a></{brand_tag}><nav class="bc-nav" aria-label="Main navigation">{nav}</nav></header>
<main id="main">{content}</main>
<footer class="bc-footer"><a href="/">Curated by Peter H. Vartanian</a><nav aria-label="Data and contributions"><a href="{BASE}records/">All records</a><a href="{BASE}records.csv" download>CSV</a><a href="{BASE}records.json" download>JSON</a><a href="{BASE}contribute/">Contribute</a></nav></footer>
<div id="bc-announcement" class="bc-sr" role="status" aria-live="polite"></div>
{f'<script type="application/json" id="bc-data">{embedded(payload)}</script>' if payload is not None else ''}
</body></html>"""


def presentation(record: dict) -> dict:
    return {
        **record["presentation"],
        "id": record["id"],
        "record_number": record["record_number"],
        "path": record_path(record),
        "groups": record["stakeholder_groups"],
    }


def detail_content(p: dict, view: str = "outcome", horizon: str = "elsewhere") -> str:
    if view == "evidence":
        return f'<h3 class="bc-evidence-type">{e(p["kind"])}</h3><p class="bc-evidence-text">{e(p["evidence"])}</p><p class="bc-time">{e(p["duration"])}</p><div class="bc-visible-limit"><h3>Limits and disclosures</h3><p>{e(p["limits"])}</p></div>'
    if view == "replication":
        options = "".join(
            f'<option value="{key}"'
            + (" selected" if key == horizon else "")
            + f">{label}</option>"
            for key, label in [
                ("elsewhere", "Another setting"),
                ("more", "More people"),
                ("longer", "A longer horizon"),
            ]
        )
        questions = "".join(f"<li>{e(q)}</li>" for q in p["questions"][horizon])
        return f'<h3 class="bc-replication-head">Could this benefit travel?</h3><div class="bc-setting"><label for="bc-setting">Explore</label><select id="bc-setting">{options}</select></div><ul class="bc-questions">{questions}</ul><p class="bc-research-note">Questions to investigate. Transfer has not been established.</p>'
    return f'<p class="bc-outcome">{e(p["outcome"])}</p><p class="bc-beneficiaries">{e(p["beneficiaries"])}</p><dl class="bc-context"><div><dt>AI contribution</dt><dd>{e(p["ai"])}</dd></div><div><dt>Human contribution</dt><dd>{e(p["people"])}</dd></div></dl>'


def sheet(p: dict) -> str:
    tabs = "".join(
        f'<button type="button" data-detail="{key}" aria-pressed="{str(key == "outcome").lower()}">{label}</button>'
        for key, label in [
            ("outcome", "Outcome"),
            ("evidence", "Evidence"),
            ("replication", "Replication"),
        ]
    )
    return f"""<div class="bc-record-heading"><h2>{e(p['title'])}</h2><p class="bc-place">{e(p['place'])}. {e(p['date'])}</p></div>
<div class="bc-tabs" aria-label="Record detail">{tabs}</div><div class="bc-detail">{detail_content(p)}</div>
<div class="bc-source">{link(p['url'], p['source'])}<span>{e(p['unit'])}</span></div><div class="bc-record-actions"><a href="{p['path']}">Full record <span aria-hidden="true">→</span></a><a href="{BASE}compare/?left={p['id']}">Compare this result</a></div>"""


def explorer(records: list[dict], leads: dict) -> str:
    ps = [presentation(r) for r in records]
    first = next(p for p in ps if p["topic"] == "learn")
    topic_buttons = "".join(
        f'<button type="button" class="bc-topic-button" style="--bc-topic:var(--bc-{key})" data-topic="{key}" aria-pressed="{str(key == "learn").lower()}"><span class="bc-topic-name">{label}</span><span class="bc-topic-count" aria-label="{sum(p["topic"] == key for p in ps)} records">{sum(p["topic"] == key for p in ps)}</span></button>'
        for key, label in TOPICS.items()
    )
    people = sorted({group for r in records for group in r["stakeholder_groups"]})
    options = "".join(f"<option>{e(group)}</option>" for group in people)
    return f"""<section class="bc-explorer" aria-label="Explore documented benefits"><aside class="bc-index"><h2>What becomes possible?</h2>
<div class="bc-topic-list" id="bc-topics" aria-label="Benefit topics">{topic_buttons}</div>
<label class="bc-search" for="bc-search"><span class="bc-sr">Search records</span><input id="bc-search" type="search" placeholder="Search records" autocomplete="off"></label>
<label class="bc-who" for="bc-who">Who benefits?<select id="bc-who"><option value="">Everyone</option>{options}</select></label>
<p class="bc-search-status" id="bc-search-status" role="status"></p><button class="bc-text-button" id="bc-clear" type="button" hidden>Clear filters</button>
<p class="bc-index-foot"><span id="bc-record-count">{len(records)} sourced records</span><br><a href="{BASE}sources/">{len(leads['records'])} research leads</a></p>
</aside><article class="bc-sheet" id="bc-record" aria-label="Selected record" style="--bc-topic:var(--bc-learn)">{sheet(first)}</article></section>
<noscript><p>Search and comparison controls need JavaScript. Every record is available in the <a href="{BASE}records/">complete collection</a>.</p></noscript>"""


def compare(records: list[dict]) -> str:
    ps = [presentation(r) for r in records]
    a = next(p for p in ps if p["topic"] == "learn")
    b = next(p for p in ps if p["topic"] == "discover")
    fields = [
        ("Reported gain", "outcome"),
        ("Beneficiaries", "beneficiaries"),
        ("Evidence", "evidence"),
        ("Over time", "duration"),
        ("AI contribution", "ai"),
        ("Attribution limits", "limits"),
        ("Replication conditions", "conditions"),
    ]
    pickers = "".join(
        f'<div><label for="bc-compare-{suffix}">{label}</label><select id="bc-compare-{suffix}">'
        + "".join(
            f'<option value="{p["id"]}"'
            + (" selected" if p["id"] == chosen["id"] else "")
            + f'>{e(p["shortTitle"])}</option>'
            for p in ps
        )
        + "</select></div>"
        for suffix, label, chosen in [
            ("a", "First record", a),
            ("b", "Second record", b),
        ]
    )
    rows = "".join(
        f'<div class="bc-comparison-row"><h2>{label}</h2>'
        + "".join(
            f'<p><span class="bc-mobile-record">{e(p["shortTitle"])}</span>{e(p[key])}</p>'
            for p in [a, b]
        )
        + "</div>"
        for label, key in fields
    )
    return f'<section class="bc-compare"><h1 class="bc-page-title">Put the evidence side by side.</h1><p class="bc-compare-intro">Compare gains, beneficiaries, and conditions in their own terms.</p><div class="bc-pickers">{pickers}</div><div id="bc-comparison" class="bc-comparison" aria-live="polite">{rows}</div></section>'


def method_body(method: dict) -> str:
    principles = "".join(
        f'<section class="bc-method-item"><h2>{e(p["title"])}</h2><p>{e(p["body"])}</p></section>'
        for p in method["principles"]
    )
    foundations = "".join(
        f'<li>{link(p["url"], p["title"])}<p>{e(p["note"])}</p></li>'
        for p in method["foundations"]
    )
    return f"""<article class="bc-method"><h1 class="bc-page-title">Begin with the benefit.</h1><p class="bc-method-intro">{e(method['intro'])}</p><div class="bc-method-grid">{principles}<section class="bc-method-item"><h2>What belongs here</h2><p>{e(method['inclusion'])}</p></section></div>
<section class="bc-method-section"><h2>Assessment</h2><p>Outcomes retain their own measures. A benefit profile records gains, beneficiaries, persistence, and conditions for reproduction. These fields are a proposed approach, not a validated universal ranking.</p><p>Reading a source establishes what it reports. Independent verification and causal attribution require further evidence. This selected collection does not estimate prevalence or net benefit.</p></section>
<section class="bc-method-section"><h2>Foundations</h2><p>These references inform the approach. Their domain-specific scales do not establish a universal AI-benefit grade.</p><ul class="bc-foundations">{foundations}</ul></section>
<section class="bc-method-section"><h2>Use the collection</h2><p>{e(method['reuse'])} The structured records are available as <a href="{BASE}records.csv" download>CSV</a> and <a href="{BASE}records.json" download>JSON</a>. Original sources retain their own terms.</p></section></article>"""


def directory(records: list[dict]) -> str:
    rows = []
    for record in records:
        p = presentation(record)
        rows.append(
            f'<article class="bc-directory-row" data-directory-record="{e(record["id"])}"><div><h2><a href="{p["path"]}">{e(p["title"])}</a></h2><p>{e(p["outcome"])}</p><div class="bc-directory-meta"><span>{e(p["source"])}</span><span>{e(p["unit"])}</span></div></div><span class="bc-topic-label" style="--bc-topic:var(--bc-{p["topic"]})">{TOPICS[p["topic"]]}</span></article>'
        )
    return f'<section class="bc-directory"><h1 class="bc-page-title">The collection</h1><p class="bc-compare-intro">Five reported episodes and two comparative studies. Every record links to its evidence.</p>{"".join(rows)}</section>'


def record_body(record: dict) -> str:
    p = presentation(record)
    sources = "".join(
        f'<li>{link(s["url"], s["title"])}<p>{e(s.get("publisher", s.get("type", "Public source")))}. Published {e(s.get("published", record["publication_date"]))}.</p></li>'
        for s in record["sources"]
    )
    questions = "".join(
        f"<section><h3>{label}</h3><ul>"
        + "".join(f"<li>{e(q)}</li>" for q in p["questions"][key])
        + "</ul></section>"
        for key, label in [
            ("elsewhere", "Another setting"),
            ("more", "More people"),
            ("longer", "A longer horizon"),
        ]
    )
    evidence = "".join(
        f"<p>{e(value)}</p>"
        for value in dict.fromkeys([record["evidence_supports"], p["evidence"]])
    )
    system = record["system_details"]
    system_fields = "".join(
        f"<div><dt>{label}</dt><dd>{e(value)}</dd></div>"
        for label, value in [
            ("System", system["system_name"]),
            ("Provider", system["provider"] or "Not reported"),
            ("Model or family", system["model_or_family"] or "Not reported"),
            ("Version", system["version"] or "Not reported"),
            ("System evidence", system["source_note"]),
        ]
    )
    citation = f'Peter H. Vartanian. AI Benefits Database, {record["record_number"]}: {p["title"]}. Reviewed {record["reviewed_date"]}. {SITE}{p["path"]}'
    return f"""<article class="bc-full-record" style="--bc-topic:var(--bc-{p['topic']})"><header class="bc-full-heading"><h1>{e(p['title'])}</h1><p>{e(p['place'])}. {e(p['date'])}</p><div class="bc-full-tools">{link(p['url'], 'Read the source')}<a href="{BASE}compare/?left={p['id']}">Compare this record</a><span>{e(record['record_number'])}</span></div></header>
<div class="bc-record-layout"><nav class="bc-contents" aria-label="Record sections"><a href="#outcome">Outcome</a><a href="#evidence">Evidence</a><a href="#replication">Replication</a><a href="#sources">Sources and citation</a></nav><div class="bc-record-body">
<section id="outcome"><h2>The reported benefit</h2><p class="bc-lead-paragraph">{e(record['observed_outcome'])}</p><dl class="bc-record-fields"><div><dt>Who benefits</dt><dd>{e(record['stakeholder_detail'])}</dd></div><div><dt>AI contribution</dt><dd>{e(record['ai_contribution'])}</dd></div><div><dt>Human contribution</dt><dd>{e(record['human_contribution'])}</dd></div>{system_fields}<div><dt>Timing</dt><dd>{e(record['date_precision'])}</dd></div></dl></section>
<section id="evidence"><h2>What the evidence supports</h2><p class="bc-source-description">{e(p['kind'])}</p>{evidence}<h3>Attribution and limits</h3><p>{e(record['limitations'])}</p><h3>Over time</h3><p>{e(p['duration'])}</p><h3>Context for interpretation</h3><p>{e(record['tradeoffs'])}</p></section>
<section id="replication"><h2>Could this benefit travel?</h2><p>{e(p['conditions'])}</p><div class="bc-replication-grid">{questions}</div><p class="bc-research-note-light">These are research questions. Transfer to other settings has not been established by this record.</p></section>
<section id="sources"><h2>Sources and citation</h2><ul class="bc-source-list">{sources}</ul><p>Source reviewed on {e(record['reviewed_date'])}. This is a source review, not independent verification of the event.</p><div class="bc-citation"><p id="bc-citation-text">{e(citation)}</p><button type="button" data-copy-citation>Copy citation</button><span id="bc-copy-status" role="status"></span></div><a href="{BASE}contribute/?record={p['id']}">Add evidence or suggest a correction →</a></section>
</div></div></article>"""


def lead_rows(records: list[dict]) -> str:
    rows = []
    for r in records:
        urls = " ".join(
            link(
                url, "Original source" if "oecd.ai" not in url else "OECD monitor entry"
            )
            for url in r["source_urls"]
        )
        rows.append(
            f'<article class="bc-lead" id="lead-{e(r["id"])}" data-lead="{e(r["id"])}" data-group="{e(r["source_group"])}"><h2>{e(r["title"])}</h2><p>{e(r.get("outcome",r.get("description","")))}</p><div class="bc-lead-check"><h3>To establish</h3><p>{e(r.get("verification_task", "Check the original source, outcome, and AI contribution."))}</p></div><div class="bc-lead-links">{urls}<span>{e(GROUPS[r["source_group"]])}</span></div></article>'
        )
    return "".join(rows)


def queue(leads: dict) -> str:
    buttons = "".join(
        f'<button type="button" class="bc-topic-button" data-group="{key}" aria-pressed="false"><span class="bc-topic-name">{label}</span><span class="bc-topic-count">{sum(r["source_group"] == key for r in leads["records"])}</span></button>'
        for key, label in GROUPS.items()
    )
    return f"""<section class="bc-queue"><div class="bc-queue-heading"><h1 class="bc-page-title">Where the research goes next.</h1><p>43 leads from the Gazetteer. The underlying sources and AI contribution still need review.</p></div><div class="bc-queue-layout"><aside class="bc-index"><div class="bc-topic-list"><button type="button" class="bc-topic-button" data-group="" aria-pressed="true"><span class="bc-topic-name">All leads</span><span class="bc-topic-count">43</span></button>{buttons}</div><label class="bc-search" for="bc-lead-search"><span class="bc-sr">Search research leads</span><input type="search" id="bc-lead-search" placeholder="Search research leads" autocomplete="off"></label><p class="bc-index-foot">Lead summaries guide research. They are not additional reviewed benefit records.</p><a class="bc-lead-download" href="{BASE}leads.json" download>Download the research leads ↗</a></aside><div><div class="bc-lead-status"><p id="bc-lead-count" role="status">43 research leads</p><button type="button" id="bc-lead-reset" hidden>Clear filters</button></div><div id="bc-lead-list">{lead_rows(leads['records'])}</div><nav class="bc-pagination" aria-label="Research lead pages" hidden><button type="button" id="bc-previous">Previous</button><span id="bc-page-status"></span><button type="button" id="bc-next">Next</button></nav></div></div></section>"""


def contribute(method: dict) -> str:
    return f"""<article class="bc-contribute"><h1 class="bc-page-title">Bring a benefit into view.</h1><p class="bc-method-intro">{e(method['submission'])}</p><div class="bc-contribute-layout"><section><h2>What makes a useful submission</h2><ul><li>A public report or research paper.</li><li>A specific gain and identifiable beneficiaries.</li><li>The AI system and what people contributed.</li><li>Evidence of follow-up, replication, or a changed interpretation.</li></ul><p>A promising lead is welcome even when the full picture is still emerging.</p></section><section class="bc-contact-panel"><h2>Send a source or correction</h2><p>Submissions go directly to Peter H. Vartanian.</p><a href="{CONTACT}" id="bc-contribute-email">Write an email <span aria-hidden="true">↗</span></a><p class="bc-small">Include a record link when updating an existing case.</p></section></div><section class="bc-method-section"><h2>Use the data</h2><p>{e(method['reuse'])}</p><div class="bc-download-links"><a href="{BASE}records.csv" download>Download CSV</a><a href="{BASE}records.json" download>Download JSON</a></div></section></article>"""


def build(root: Path) -> None:
    root = Path(root)
    a = root / "ai-benefits"
    data = json.loads((a / "records.json").read_text())
    records = data["records"]
    leads = json.loads((a / "leads.json").read_text())
    method = json.loads((root / "content/ai-benefits/method.json").read_text())
    payload = {"records": [presentation(r) for r in records]}
    pages = [
        (
            BASE,
            "AI Benefits Database",
            "Explore documented AI benefits through learning, discovery, health, and safety. Inspect evidence and investigate how gains can spread and endure.",
            "explore",
            explorer(records, leads),
            payload,
        ),
        (
            BASE + "compare/",
            "Compare benefits | AI Benefits Database",
            "Compare reported AI benefits, beneficiaries, evidence, and conditions in their own terms.",
            "compare",
            compare(records),
            payload,
        ),
        (
            BASE + "method/",
            "Method | AI Benefits Database",
            "How the AI Benefits Database documents gains, beneficiaries, evidence, persistence, and reproduction.",
            "method",
            method_body(method),
            None,
        ),
        (
            BASE + "sources/",
            "Research leads | AI Benefits Database",
            "43 public-source leads for future research on beneficial AI outcomes, awaiting source and attribution review.",
            "sources",
            queue(leads),
            leads,
        ),
        (
            BASE + "records/",
            "The collection | AI Benefits Database",
            "Seven public-source records covering reported episodes and comparative research on beneficial AI.",
            "directory",
            directory(records),
            None,
        ),
        (
            BASE + "contribute/",
            "Contribute | AI Benefits Database",
            "Submit public evidence, beneficial AI outcomes, follow-up research, or corrections to the AI Benefits Database.",
            "contribute",
            contribute(method),
            None,
        ),
    ]
    for path, title, description, section, content, page_data in pages:
        save(
            root / path.strip("/") / "index.html",
            shell(root, title, description, path, section, content, page_data),
        )
    for record in records:
        p = presentation(record)
        save(
            root / record_path(record).strip("/") / "index.html",
            shell(
                root,
                p["title"] + " | AI Benefits Database",
                p["outcome"],
                record_path(record),
                "record",
                record_body(record),
                None,
                record,
            ),
        )
    output = io.StringIO(newline="")
    keys = list(dict.fromkeys(key for r in records for key in r))
    writer = csv.DictWriter(output, fieldnames=keys, lineterminator="\n")
    writer.writeheader()
    writer.writerows(
        {
            key: (
                json.dumps(value, ensure_ascii=False)
                if isinstance(value, (list, dict))
                else value
            )
            for key, value in r.items()
        }
        for r in records
    )
    (a / "records.csv").write_text(output.getvalue())
    print(
        f"Built AI Benefits Database: {len(records)} sourced records, {len(leads['records'])} research leads, {len(pages) + len(records)} pages."
    )


if __name__ == "__main__":
    build(Path(__file__).resolve().parents[1])
