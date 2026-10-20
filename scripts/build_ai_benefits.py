"""Build the public AI Benefits Database using only reviewed records."""

from __future__ import annotations

import csv
import io
import json
import re
from hashlib import sha256
from html import escape
from pathlib import Path
from typing import Any
from urllib.parse import quote

BASE = "/ai-benefits/"
SITE = "https://petervartanian.xyz"
TOPICS = {
    "learn": "Learning",
    "discover": "Discovery",
    "health": "Health",
    "safety": "Safety",
    "work": "Work",
}
COUNTRIES = {
    "AU": "Australia",
    "GB": "United Kingdom",
    "IN": "India",
    "PK": "Pakistan",
    "PH": "Philippines",
    "US": "United States",
}
EVIDENCE = {
    "comparative_study": "Comparative studies",
    "reported_outcome": "Reported outcomes",
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


def record_path(record: dict[str, Any]) -> str:
    return BASE + "records/" + record["id"] + "/"


def record_key(record: dict[str, Any]) -> str:
    content = {key: value for key, value in record.items() if key != "revision"}
    return sha256(
        json.dumps(
            content, ensure_ascii=False, sort_keys=True, separators=(",", ":")
        ).encode()
    ).hexdigest()[:12]


def version_path(record: dict[str, Any], key: str) -> str:
    return record_path(record) + "versions/" + key + "/"


def link(url: str, text: str) -> str:
    return f'<a href="{e(url)}" target="_blank" rel="noopener noreferrer">{e(text)}</a>'


def presentation(record: dict[str, Any]) -> dict[str, Any]:
    return {
        **record["presentation"],
        "id": record["id"],
        "record_number": record["record_number"],
        "path": record_path(record),
        "groups": record["stakeholder_groups"],
        "comparison": record["benefit_profile"]["comparison"],
        "details": record.get("evidence_details", {}),
        "system_note": record["system_details"]["source_note"],
        "timing": record["date_precision"],
        "sources": record["sources"],
        "revision": record.get("revision"),
    }


def shell(
    root: Path,
    title: str,
    description: str,
    path: str,
    section: str,
    content: str,
    payload: Any = None,
    record: dict[str, Any] | None = None,
    archive: bool = False,
) -> str:
    assets = root / "ai-benefits"
    version = {
        name: sha256((assets / name).read_bytes()).hexdigest()[:12]
        for name in ("style.css", "app.js", "icon.svg", "social.png")
    }
    navigation = [
        ("explore", "Explore", BASE),
        ("compare", "Compare", BASE + "compare/"),
        ("method", "Method", BASE + "method/"),
    ]
    nav = "".join(
        f'<a href="{url}"'
        + (' aria-current="page"' if key == section else "")
        + f">{label}</a>"
        for key, label, url in navigation
    )
    brand_tag = "div"
    structured: dict[str, Any] = {
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
    email = (
        CONTACT
        if record is None
        else CONTACT
        + "%20"
        + quote(record["record_number"])
        + "&body="
        + quote(record["record_url"] + "\n\n")
    )
    return f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(description)}"><meta name="author" content="Peter H. Vartanian">
{'<meta name="robots" content="noindex, follow">' if archive else ''}
<meta name="color-scheme" content="light dark"><meta name="theme-color" content="#FCFCFA" media="(prefers-color-scheme:light)"><meta name="theme-color" content="#1E1E23" media="(prefers-color-scheme:dark)">
<link rel="canonical" href="{SITE}{path}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="website"><meta property="og:url" content="{SITE}{path}"><meta property="og:image" content="{SITE}{BASE}social.png?v={version['social.png']}"><meta property="og:image:alt" content="AI Benefits Database"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{BASE}icon.svg?v={version['icon.svg']}" type="image/svg+xml"><link rel="preload" href="{BASE}archivo-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="{BASE}style.css?v={version['style.css']}"><script src="{BASE}app.js?v={version['app.js']}" defer></script>
<script type="application/ld+json">{embedded(structured)}</script>
</head><body class="benefits-app" data-page="{section}">
<a class="bc-skip" href="#main">Skip to content</a>
<header class="bc-header"><{brand_tag} class="bc-brand"><a href="{BASE}">AI Benefits Database</a></{brand_tag}><nav class="bc-nav" aria-label="Main navigation">{nav}</nav></header>
<main id="main">{content}</main>
<footer class="bc-footer"><a href="/">Peter H. Vartanian</a><nav aria-label="Data and contributions"><a href="{BASE}records.csv" download>All CSV</a><a href="{BASE}records.json" download>All JSON</a><a href="{e(email)}">{'Suggest a correction' if record else 'Suggest a record'}</a></nav></footer>
<div id="bc-announcement" class="bc-sr" role="status" aria-live="polite"></div>
{f'<script type="application/json" id="bc-data">{embedded(payload)}</script>' if payload is not None else ''}
</body></html>"""


def preview_body(record: dict[str, Any], copy: dict[str, str]) -> str:
    p = presentation(record)
    return f"""<div class="bc-feature-color"><h2>{e(copy['title'])}</h2><p class="bc-big-result"><strong>{e(copy['result'])}</strong><span>{e(copy['result_label'])}</span></p><p class="bc-synopsis">{e(copy['synopsis'])}</p></div>
<div class="bc-feature-evidence"><dl><div><dt>Comparison</dt><dd>{e(copy['comparator'])}</dd></div><div><dt>Evidence</dt><dd>{e(p['kind'])}. {e(copy['qualification'])}</dd></div></dl><div class="bc-feature-source">{link(p['url'], p['source'])}<span>{e(p['place'])}<br>{e(p['date'])}</span></div><nav aria-label="Selected record actions"><a class="bc-open-record" href="{p['path']}">Read the record <span aria-hidden="true">↗</span></a><a href="{BASE}compare/?left={p['id']}">Compare</a><a href="{p['path']}brief.md" download>Brief</a></nav></div>"""


def explorer(records: list[dict[str, Any]], display: dict[str, Any]) -> str:
    buttons = (
        '<button type="button" data-topic="" aria-pressed="true"><span>All benefits</span></button>'
        + "".join(
            f'<button type="button" data-topic="{key}" aria-pressed="false" style="--topic:var(--{key})"><span>{label}</span><i aria-hidden="true"></i></button>'
            for key, label in TOPICS.items()
        )
    )
    countries = sorted(
        {
            code
            for record in records
            for code in record["evidence_details"]["countries"]
        },
        key=COUNTRIES.get,
    )
    country_options = "".join(
        f'<option value="{code}">{COUNTRIES[code]}</option>' for code in countries
    )
    evidence_options = "".join(
        f'<option value="{key}">{label}</option>' for key, label in EVIDENCE.items()
    )
    rows = []
    ordered = sorted(
        records, key=lambda record: list(TOPICS).index(record["presentation"]["topic"])
    )
    for record in ordered:
        p = presentation(record)
        copy = display[record["id"]]
        details = p["details"]
        search = " ".join(
            [
                p["title"],
                p["place"],
                record["location"],
                p["date"],
                p["system"],
                p["outcome"],
                p["beneficiaries"],
                p["source"],
                p["evidence"],
                TOPICS[p["topic"]],
                details["application"],
                details.get("application_detail", ""),
                " ".join(details.get("search_terms", [])),
                details["geography_note"],
                " ".join(COUNTRIES[code] for code in details["countries"]),
                p["comparison"],
                json.dumps(record["system_details"], ensure_ascii=False),
                *p["groups"],
            ]
        )
        rows.append(
            f"""<article class="bc-record-row" data-record="{p['id']}" data-topic="{p['topic']}" data-countries="{' '.join(details['countries'])}" data-evidence="{details['evidence_category']}" data-search="{e(search)}">
<span class="bc-row-color" aria-hidden="true"></span><div><h3><button type="button" data-pick="{p['id']}" aria-pressed="{'true' if record is ordered[0] else 'false'}">{e(copy['title'])}</button></h3><p>{e(p['kind'])}</p></div><a class="bc-row-open" href="{p['path']}" aria-label="Read {e(copy['title'])}">Read <span aria-hidden="true">↗</span></a></article>"""
        )
    initial = ordered[0]
    return f"""<section class="bc-explorer" aria-label="Explore benefit records"><aside class="bc-index">
<h1>What becomes<br> possible?</h1><nav id="bc-topics" aria-label="Filter by topic">{buttons}</nav>
<label for="bc-search" class="bc-search"><span class="bc-sr">Search records</span><input id="bc-search" type="search" placeholder="Search tasks, people, places" maxlength="200" autocomplete="off"></label>
<div class="bc-refine"><label><span class="bc-sr">Study or event location</span><select id="bc-country"><option value="">All locations</option>{country_options}<option value="unreported">Location unreported</option></select></label><label><span class="bc-sr">Evidence type</span><select id="bc-evidence"><option value="">All evidence</option>{evidence_options}</select></label><button type="button" id="bc-clear" hidden>Clear filters</button></div>
<p class="bc-coverage">Selected cases and studies.<br><a href="{BASE}method/">How records are included</a></p></aside>
<div class="bc-explore-body"><article class="bc-feature" id="bc-feature" data-case="{initial['id']}" data-topic="{initial['presentation']['topic']}"><div id="bc-preview-body">{preview_body(initial,display[initial['id']])}</div><nav class="bc-preview-pagination" aria-label="Browse matching records"><span id="bc-preview-position">1 of {len(records)}</span><div><button type="button" id="bc-preview-prev" aria-label="Previous record" disabled>←</button><button type="button" id="bc-preview-next" aria-label="Next record">→</button></div></nav></article>
<div class="bc-result-status"><h2 id="bc-record-count" role="status">{len(records)} records</h2><nav class="bc-downloads" aria-label="Download these results"><span>Download results</span><a id="bc-export-brief" href="{BASE}brief.md" download>Brief</a><a id="bc-export-csv" href="{BASE}records.csv" download>CSV</a><a id="bc-export-json" href="{BASE}records.json" download>JSON</a></nav></div>
<div id="bc-record-list">{''.join(rows)}</div><p id="bc-empty" hidden>No records in this collection match these filters.</p>
<noscript><p>Use the Read links to open any record. Search and preview controls require JavaScript.</p></noscript></div></section>"""


def comparison_cell(p: dict[str, Any], key: str) -> str:
    details = p["details"]
    if key == "application":
        return (
            f'<p>{e(details["application"])}</p><p>{e(details["geography_note"])}</p>'
        )
    if key == "evidence":
        return f'<p class="bc-small">{e(p["kind"])}</p><p>{e(p["evidence"])}</p><p>{e(p["limits"])}</p>'
    if key == "contributions":
        return f'<p><strong>AI.</strong> {e(p["ai"])}</p><p><strong>People.</strong> {e(p["people"])}</p>'
    if key == "system":
        return f'<p>{e(p["system"])}</p><p>{e(p["system_note"])}</p>'
    if key == "conditions":
        return (
            "".join(
                f"<p>{e(condition)}</p>"
                for condition in details["documented_conditions"]
            )
            + f'<p>{e(details["transfer_limit"])}</p>'
        )
    if key == "source":
        sources = "".join(
            f'<p>{link(source["url"], source["title"])}</p>' for source in p["sources"]
        )
        return (
            sources
            + f'<p><a href="{p["path"]}">Full record</a></p><p><a href="{e(p["revision"]["url"])}">Cited version</a></p>'
        )
    return f"<p>{e(p[key])}</p>"


COMPARISON_FIELDS = [
    ("Task and setting", "application"),
    ("Outcome", "outcome"),
    ("Compared with", "comparison"),
    ("Beneficiaries", "beneficiaries"),
    ("Evidence", "evidence"),
    ("Contributions", "contributions"),
    ("System", "system"),
    ("Duration", "duration"),
    ("Conditions", "conditions"),
    ("Sources", "source"),
]


def comparison_rows(a: dict[str, Any], b: dict[str, Any]) -> str:
    header = f'<div class="bc-sr" role="row"><span role="columnheader">Field</span><span role="columnheader">{e(a["shortTitle"])}</span><span role="columnheader">{e(b["shortTitle"])}</span></div>'
    return header + "".join(
        f'<div class="bc-comparison-row" role="row"><h2 role="rowheader">{label}</h2>'
        + "".join(
            f'<div role="cell"><span class="bc-mobile-record" aria-hidden="true">{e(p["shortTitle"])}</span>{comparison_cell(p, key)}</div>'
            for p in [a, b]
        )
        + "</div>"
        for label, key in COMPARISON_FIELDS
    )


def comparison_reason(a: dict[str, Any], b: dict[str, Any]) -> str:
    relationship = next(
        (item for item in a["details"]["related"] if item["id"] == b["id"]), None
    )
    return (
        (relationship["reason"] + " " + relationship["caution"])
        if relationship
        else "These records describe different tasks or settings. Their measures do not establish which use of AI is better."
    )


def compare(records: list[dict[str, Any]]) -> str:
    ps = [presentation(record) for record in records]
    a, b = [p for p in ps if p["topic"] == "health"][:2]
    pickers = "".join(
        f'<label><span class="bc-sr">{label}</span><select id="bc-compare-{suffix}" aria-label="{label}">'
        + "".join(
            f'<option value="{p["id"]}"'
            + (" selected" if p["id"] == chosen["id"] else "")
            + f'>{e(p["shortTitle"])}</option>'
            for p in ps
        )
        + "</select></label>"
        for suffix, label, chosen in [
            ("a", "First record", a),
            ("b", "Second record", b),
        ]
    )
    return f"""<section class="bc-compare"><div class="bc-page-heading"><h1>Compare</h1><button type="button" id="bc-download-comparison" hidden>Download brief</button></div><div class="bc-pickers">{pickers}</div><p id="bc-comparison-reason" class="bc-comparison-reason">{e(comparison_reason(a,b))}</p><div id="bc-comparison" class="bc-comparison" role="table" aria-label="Comparison of benefit records">{comparison_rows(a,b)}</div><noscript><p>This comparison is fixed. Changing records requires JavaScript.</p></noscript></section>"""


def method_body(method: dict[str, Any]) -> str:
    principles = "".join(
        f'<div><dt>{e(p["title"])}</dt><dd>{e(p["body"])}</dd></div>'
        for p in method["principles"]
    )
    references = "".join(
        f'<li>{link(p["url"], p["title"])}<span>{e(p["note"])}</span></li>'
        for p in method["foundations"]
    )
    return f"""<article class="bc-document"><h1>Method</h1><p class="bc-intro">{e(method['intro'])}</p><section><h2>Inclusion</h2><p>{e(method['inclusion'])}</p><p>Source review establishes what an account reports. It does not independently verify the event. This selected collection does not estimate prevalence or net benefit.</p></section><section><h2>Records</h2><dl class="bc-fields">{principles}</dl><p>Outcomes retain their own measures. There is no universal benefit grade.</p></section><section><h2>References</h2><ul class="bc-references">{references}</ul></section><section><h2>Review and updates</h2><p>Records are assembled through AI-assisted source review and editorial selection. The review date identifies a source check, not independent verification. Each record links to the passages supporting its claims and keeps earlier published versions.</p><p>Corrections and later contrary evidence belong in the record and its history. Inclusion does not imply overall endorsement.</p></section><section><h2>Reuse</h2><p>{e(method['reuse'])} Original sources retain their own terms.</p></section></article>"""


def additional_duration(record: dict[str, Any]) -> str:
    existing = record["evidence_supports"] + " " + record["limitations"]
    sentences = re.split(r"(?<=[.!?])\s+", record["presentation"]["duration"])
    return " ".join(sentence for sentence in sentences if sentence not in existing)


def record_body(
    record: dict[str, Any],
    history: list[dict[str, Any]] | None = None,
    titles: dict[str, str] | None = None,
    archived: dict[str, Any] | None = None,
    display: dict[str, str] | None = None,
) -> str:
    p = presentation(record)
    system = record["system_details"]
    details = record.get("evidence_details", {})
    sources = []
    for index, source in enumerate(record["sources"]):
        checks = "".join(
            f'<div class="bc-source-check"><p>{e(check["claim"].rstrip("."))}.</p><p class="bc-source-locator">{e(check["locator"])}</p></div>'
            for check in details.get("source_checks", [])
            if check["source_index"] == index
        )
        publication = e(source.get("publisher", source.get("type", "Public source")))
        if source.get("published"):
            publication += ". " + e(source["published"])
        alternate = source.get("full_text_url")
        full_text = (
            " " + link(alternate, "Full text")
            if alternate and alternate != source["url"]
            else ""
        )
        sources.append(
            f'<li id="source-{index+1}">{link(source["url"], source["title"])}<span>{publication}.{full_text}</span>{checks}</li>'
        )
    if details:
        conditions = (
            '<ul class="bc-conditions">'
            + "".join(
                f"<li>{e(condition)}</li>"
                for condition in details["documented_conditions"]
            )
            + "</ul>"
            + f'<p>{e(details["transfer_limit"])}</p>'
        )
        context = f'<div><dt>Task</dt><dd>{e(details["application"])}</dd></div><div><dt>Setting</dt><dd>{e(details["geography_note"])}</dd></div>'
    else:
        conditions = f'<p>{e(p["conditions"])}</p>'
        context = ""
    related = ""
    if not archived and details.get("related"):
        items = []
        for item in details["related"]:
            path = record_path({"id": item["id"]})
            items.append(
                f'<li><a href="{path}">{e((titles or {}).get(item["id"], item["id"]))}</a><p>{e(item["reason"])} {e(item["caution"])}</p><a class="bc-small" href="{BASE}compare/?left={p["id"]}&amp;right={item["id"]}">Compare these records</a></li>'
            )
        related = (
            '<section id="related"><h2>Related records</h2><ul class="bc-references">'
            + "".join(items)
            + "</ul></section>"
        )
    updates = ""
    if history:
        items = "".join(
            f'<li><a href="{version_path(record, item["key"])}">{e(item["date"])}</a><p>{e(item["note"])}</p></li>'
            for item in reversed(history)
        )
        updates = (
            '<section id="updates"><h2>Updates</h2><ul class="bc-references">'
            + items
            + "</ul></section>"
        )
    actions = f'<a href="{BASE}compare/?left={p["id"]}">Compare</a><a href="{p["path"]}brief.md" download>Download brief</a>'
    notice = ""
    if archived:
        actions = f'<a href="{p["path"]}">Current record</a><a href="record.json" download>Download this version</a>'
        notice = f'<aside class="bc-version-note" aria-label="Version information"><p>Archived version, {e(archived["date"])}. {e(archived["note"])}</p><a href="{p["path"]}">Read the current record</a></aside>'
    result = (
        f'<p class="bc-record-result"><strong>{e(display["result"])}</strong><span>{e(display["result_label"])}</span></p>'
        if display
        else ""
    )
    return f"""<article class="bc-document bc-record" data-topic="{p['topic']}">{notice}<header id="outcome"><h1>{e(p['title'])}</h1><p class="bc-dateline">{e(p['place'])}. {e(p['date'])}.</p>{result}<p class="bc-intro">{e(record['observed_outcome'])}</p><p>{e(p['beneficiaries'])}</p><nav class="bc-record-actions" aria-label="Record actions">{actions}</nav></header>
<section id="evidence"><h2>Evidence</h2><p class="bc-small">{e(p['kind'])}</p><dl class="bc-fields">{context}<div><dt>Compared with</dt><dd>{e(p['comparison'])}</dd></div></dl><dl class="bc-fields"><div><dt>Findings</dt><dd>{e(record['evidence_supports'])}</dd></div><div><dt>Limits</dt><dd>{e(record['limitations'])}</dd></div><div><dt>Over time</dt><dd>{e(additional_duration(record))}</dd></div><div><dt>Other outcomes</dt><dd>{e(record['tradeoffs'])}</dd></div></dl></section>
<section id="contributions"><h2>Contributions</h2><dl class="bc-fields bc-contributions"><div><dt>AI</dt><dd>{e(record['ai_contribution'])}</dd></div><div><dt>People</dt><dd>{e(record['human_contribution'])}</dd></div><div><dt>System</dt><dd><strong>{e(system['system_name'])}</strong><span class="bc-system-note">{e(system['source_note'])}</span></dd></div><div><dt>Timing</dt><dd>{e(record['date_precision'])}</dd></div></dl></section>
<section id="replication"><h2>Conditions</h2>{conditions}</section>
<section id="sources"><h2>Sources</h2><ul class="bc-references">{''.join(sources)}</ul><p class="bc-small">{e(record['record_number'])}. Source review {e(record['reviewed_date'])}.</p></section>{related}{updates}</article>"""


def evidence_brief(record: dict[str, Any]) -> str:
    p = presentation(record)
    system = record["system_details"]
    details = record.get("evidence_details", {})
    source_parts = []
    for index, source in enumerate(record["sources"]):
        source_parts.append(f'- [{source["title"]}]({source["url"]})')
        source_parts.extend(
            f'  - {check["claim"].rstrip(".")}. Locator: {check["locator"]}'
            for check in details.get("source_checks", [])
            if check["source_index"] == index
        )
    sources = "\n".join(source_parts)
    conditions = "\n".join(
        f"- {condition}" for condition in details.get("documented_conditions", [])
    )
    if details:
        conditions += "\n\n" + details["transfer_limit"]
    else:
        conditions = p["conditions"]
    version = record.get("revision", {})
    citation_url = version.get("url", record["record_url"])
    context = f'{details.get("application", record["sector"])}. {details.get("geography_note", record["location"])}'
    return f"""# {p['title']}

{p['place']}. {p['date']}.

AI Benefits Database, {record['record_number']}
Source review {record['reviewed_date']}
Current record: {record['record_url']}
Cited version: {citation_url}

## Task and setting

{context}

## Outcome

{record['observed_outcome']}

{record['stakeholder_detail']}

## Compared with

{p['comparison']}

## Evidence

{p['kind']}. {record['evidence_supports']}

{record['limitations']}

{additional_duration(record)}

{record['tradeoffs']}

## Contributions

**AI:** {record['ai_contribution']}

**People:** {record['human_contribution']}

**System:** {system['system_name']}. {system['source_note']}

**Timing:** {record['date_precision']}

## Conditions

{conditions}

## Sources

{sources}

## Citation

Peter H. Vartanian. AI Benefits Database, {record['record_number']}: {p['title']}. Version {version.get('key', 'initial')}, {version.get('date', record['reviewed_date'])}. {citation_url}
"""


def collection_brief(records: list[dict[str, Any]]) -> str:
    return (
        "# AI Benefits Database\n\nSelected cases and studies. These records do not estimate prevalence or net benefit.\n\n"
        + "\n\n---\n\n".join(evidence_brief(record) for record in records)
    )


def redirect() -> str:
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0; url={BASE}"><link rel="canonical" href="{SITE}{BASE}"><title>AI Benefits Database</title></head><body><p><a href="{BASE}">AI Benefits Database</a></p></body></html>"""


def build(root: Path) -> None:
    root = Path(root)
    assets = root / "ai-benefits"
    data = json.loads((assets / "records.json").read_text())
    records = data["records"]
    method = json.loads((root / "content/ai-benefits/method.json").read_text())
    display = json.loads((root / "content/ai-benefits/display.json").read_text())
    history = json.loads((root / "content/ai-benefits/history.json").read_text())
    for record in records:
        current = history[record["id"]][-1]
        if current["key"] != record_key(record) or current["record"] != {
            key: value for key, value in record.items() if key != "revision"
        }:
            raise ValueError(f"Record {record['id']} changed without a saved revision")
        if record.get("revision") != {
            "key": current["key"],
            "date": current["date"],
            "note": current["note"],
            "url": SITE + version_path(record, current["key"]),
        }:
            raise ValueError(f"Record {record['id']} has stale version metadata")
    payload = {
        "records": [
            {
                **presentation(record),
                "display": display[record["id"]],
                "preview": preview_body(record, display[record["id"]]),
            }
            for record in records
        ],
        "raw": records,
        "briefs": {record["id"]: evidence_brief(record) for record in records},
    }
    titles = {record["id"]: record["presentation"]["title"] for record in records}
    pages = [
        (
            BASE,
            "AI Benefits Database",
            "Documented AI benefits, with outcomes, beneficiaries, sources, and evidence for replication.",
            "explore",
            explorer(records, display),
            payload,
        ),
        (
            BASE + "compare/",
            "Compare | AI Benefits Database",
            "Compare reported AI benefits, their evidence, and conditions for replication.",
            "compare",
            compare(records),
            payload,
        ),
        (
            BASE + "method/",
            "Method | AI Benefits Database",
            "How records of AI benefits are selected, sourced, and assessed.",
            "method",
            method_body(method),
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
        folder = root / record_path(record).strip("/")
        save(
            folder / "index.html",
            shell(
                root,
                p["title"] + " | AI Benefits Database",
                p["outcome"],
                record_path(record),
                "record",
                record_body(
                    record, history[record["id"]], titles, display=display[record["id"]]
                ),
                None,
                record,
            ),
        )
        save(folder / "brief.md", evidence_brief(record))
        for snapshot in history[record["id"]]:
            old = snapshot["record"]
            if record_key(old) != snapshot["key"]:
                raise ValueError(f"Archived version {snapshot['key']} was modified")
            path = version_path(old, snapshot["key"])
            archive = root / path.strip("/")
            save(
                archive / "index.html",
                shell(
                    root,
                    old["presentation"]["title"] + " | Archived record",
                    old["presentation"]["outcome"],
                    path,
                    "record",
                    record_body(old, archived=snapshot),
                    record=old,
                    archive=True,
                ),
            )
            save(archive / "record.json", json.dumps(old, ensure_ascii=False, indent=2))
    save(assets / "brief.md", collection_brief(records))
    for old in ("sources", "records", "contribute"):
        save(assets / old / "index.html", redirect())
    output = io.StringIO(newline="")
    keys = list(dict.fromkeys(key for record in records for key in record))
    writer = csv.DictWriter(output, fieldnames=keys, lineterminator="\n")
    writer.writeheader()
    writer.writerows(
        {
            key: (
                json.dumps(value, ensure_ascii=False)
                if isinstance(value, (list, dict))
                else value
            )
            for key, value in record.items()
        }
        for record in records
    )
    (assets / "records.csv").write_text(output.getvalue())
    print(
        f"Built AI Benefits Database: {len(records)} records, {len(pages) + len(records)} pages, {len(records)} evidence briefs."
    )


if __name__ == "__main__":
    build(Path(__file__).resolve().parents[1])
