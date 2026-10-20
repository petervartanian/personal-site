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


def link(url: str, text: str) -> str:
    return f'<a href="{e(url)}" target="_blank" rel="noopener noreferrer">{e(text)}</a>'


def presentation(record: dict[str, Any]) -> dict[str, Any]:
    return {
        **record["presentation"],
        "id": record["id"],
        "record_number": record["record_number"],
        "path": record_path(record),
        "groups": record["stakeholder_groups"],
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
) -> str:
    assets = root / "ai-benefits"
    version = {
        name: sha256((assets / name).read_bytes()).hexdigest()[:12]
        for name in ("style.css", "app.js")
    }
    navigation = [
        ("compare", "Compare", BASE + "compare/"),
        ("method", "Method", BASE + "method/"),
    ]
    nav = "".join(
        f'<a href="{url}"'
        + (' aria-current="page"' if key == section else "")
        + f">{label}</a>"
        for key, label, url in navigation
    )
    brand_tag = "h1" if section == "explore" else "div"
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
<meta name="color-scheme" content="light dark"><meta name="theme-color" content="#F7F8F4" media="(prefers-color-scheme:light)"><meta name="theme-color" content="#181D1C" media="(prefers-color-scheme:dark)">
<link rel="canonical" href="{SITE}{path}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="website"><meta property="og:url" content="{SITE}{path}"><meta property="og:image" content="{SITE}{BASE}social.png"><meta property="og:image:alt" content="AI Benefits Database"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{BASE}icon.svg" type="image/svg+xml"><link rel="preload" href="{BASE}archivo-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="{BASE}style.css?v={version['style.css']}"><script src="{BASE}app.js?v={version['app.js']}" defer></script>
<script type="application/ld+json">{embedded(structured)}</script>
</head><body class="benefits-app" data-page="{section}">
<a class="bc-skip" href="#main">Skip to content</a>
<header class="bc-header"><{brand_tag} class="bc-brand"><a href="{BASE}">AI Benefits Database</a></{brand_tag}><nav class="bc-nav" aria-label="Main navigation">{nav}</nav></header>
<main id="main">{content}</main>
<footer class="bc-footer"><a href="/">Peter H. Vartanian</a><nav aria-label="Data and contributions"><a href="{BASE}records.csv" download>CSV</a><a href="{BASE}records.json" download>JSON</a><a href="{e(email)}">{'Suggest a correction' if record else 'Suggest a record'}</a></nav></footer>
<div id="bc-announcement" class="bc-sr" role="status" aria-live="polite"></div>
{f'<script type="application/json" id="bc-data">{embedded(payload)}</script>' if payload is not None else ''}
</body></html>"""


def explorer(records: list[dict[str, Any]]) -> str:
    buttons = (
        '<button type="button" data-topic="" aria-pressed="true">All</button>'
        + "".join(
            f'<button type="button" data-topic="{key}" aria-pressed="false" style="--topic:var(--{key})">{label}</button>'
            for key, label in TOPICS.items()
        )
    )
    rows = []
    ordered = sorted(
        records, key=lambda record: list(TOPICS).index(record["presentation"]["topic"])
    )
    for record in ordered:
        p = presentation(record)
        search = " ".join(
            [
                p["title"],
                p["place"],
                p["date"],
                p["system"],
                p["outcome"],
                p["beneficiaries"],
                p["source"],
                p["evidence"],
                TOPICS[p["topic"]],
                json.dumps(record["system_details"], ensure_ascii=False),
                *p["groups"],
            ]
        )
        rows.append(
            f"""<article class="bc-record-row" data-record="{p['id']}" data-topic="{p['topic']}" data-search="{e(search)}">
<div><h2><a href="{p['path']}">{e(p['title'])}</a></h2><p>{e(p['outcome'])}</p><div class="bc-record-meta"><span>{TOPICS[p['topic']]}</span><span>{e(p['kind'])}</span></div></div>
<div class="bc-row-source">{link(p['url'], p['source'])}<span>{e(p['date'])}</span></div></article>"""
        )
    return f"""<section class="bc-index" aria-label="Benefit records">
<div class="bc-filters"><nav id="bc-topics" aria-label="Filter by topic">{buttons}</nav><label for="bc-search" class="bc-search"><span class="bc-sr">Search records</span><input id="bc-search" type="search" placeholder="Search records" autocomplete="off"></label></div>
<div class="bc-result-status"><p id="bc-record-count" role="status">{len(records)} records</p><button type="button" id="bc-clear" hidden>Clear filters</button></div>
<div id="bc-record-list">{''.join(rows)}</div><p id="bc-empty" hidden>No matching records.</p>
<noscript><p>All records are shown. Search and filters require JavaScript.</p></noscript></section>"""


def comparison_cell(p: dict[str, Any], key: str) -> str:
    if key == "evidence":
        return f'<p class="bc-small">{e(p["kind"])}</p><p>{e(p["evidence"])}</p><p>{e(p["limits"])}</p>'
    if key == "contributions":
        return f'<p><strong>AI.</strong> {e(p["ai"])}</p><p><strong>People.</strong> {e(p["people"])}</p>'
    if key == "source":
        return f'<p>{link(p["url"], p["source"])}</p><p><a href="{p["path"]}">Record</a></p>'
    return f"<p>{e(p[key])}</p>"


def comparison_rows(a: dict[str, Any], b: dict[str, Any]) -> str:
    fields = [
        ("Outcome", "outcome"),
        ("Beneficiaries", "beneficiaries"),
        ("Evidence", "evidence"),
        ("Contributions", "contributions"),
        ("System", "system"),
        ("Duration", "duration"),
        ("Replication", "conditions"),
        ("Sources", "source"),
    ]
    header = f'<div class="bc-sr" role="row"><span role="columnheader">Field</span><span role="columnheader">{e(a["shortTitle"])}</span><span role="columnheader">{e(b["shortTitle"])}</span></div>'
    return header + "".join(
        f'<div class="bc-comparison-row" role="row"><h2 role="rowheader">{label}</h2>'
        + "".join(
            f'<div role="cell"><span class="bc-mobile-record" aria-hidden="true">{e(p["shortTitle"])}</span>{comparison_cell(p, key)}</div>'
            for p in [a, b]
        )
        + "</div>"
        for label, key in fields
    )


def compare(records: list[dict[str, Any]]) -> str:
    ps = [presentation(record) for record in records]
    health = [p for p in ps if p["topic"] == "health"]
    a, b = health[:2]
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
    return f"""<section class="bc-compare"><div class="bc-page-heading"><h1>Compare</h1><button type="button" id="bc-download-comparison" hidden>Download brief</button></div><div class="bc-pickers">{pickers}</div><div id="bc-comparison" class="bc-comparison" role="table" aria-label="Comparison of benefit records">{comparison_rows(a, b)}</div><noscript><p>This comparison is fixed. Changing records requires JavaScript.</p></noscript></section>"""


def method_body(method: dict[str, Any]) -> str:
    principles = "".join(
        f'<div><dt>{e(p["title"])}</dt><dd>{e(p["body"])}</dd></div>'
        for p in method["principles"]
    )
    references = "".join(
        f'<li>{link(p["url"], p["title"])}<span>{e(p["note"])}</span></li>'
        for p in method["foundations"]
    )
    return f"""<article class="bc-document"><h1>Method</h1><p class="bc-intro">{e(method['intro'])}</p><section><h2>Inclusion</h2><p>{e(method['inclusion'])}</p><p>Source review establishes what an account reports. It does not independently verify the event. This selected collection does not estimate prevalence or net benefit.</p></section><section><h2>Records</h2><dl class="bc-fields">{principles}</dl><p>Outcomes retain their own measures. There is no universal benefit grade.</p></section><section><h2>References</h2><ul class="bc-references">{references}</ul></section><section><h2>Reuse</h2><p>{e(method['reuse'])} Original sources retain their own terms.</p></section></article>"""


def additional_duration(record: dict[str, Any]) -> str:
    existing = record["evidence_supports"] + " " + record["limitations"]
    sentences = re.split(r"(?<=[.!?])\s+", record["presentation"]["duration"])
    return " ".join(sentence for sentence in sentences if sentence not in existing)


def record_body(record: dict[str, Any]) -> str:
    p = presentation(record)
    system = record["system_details"]
    sources = "".join(
        f'<li>{link(source["url"], source["title"])}<span>{e(source.get("publisher", source.get("type", "Public source")))}. {e(source.get("published", record["publication_date"]))}.</span></li>'
        for source in record["sources"]
    )
    return f"""<article class="bc-document bc-record"><header id="outcome"><h1>{e(p['title'])}</h1><p class="bc-dateline">{e(p['place'])}. {e(p['date'])}.</p><p class="bc-intro">{e(record['observed_outcome'])}</p><p>{e(p['beneficiaries'])}</p><nav class="bc-record-actions" aria-label="Record actions"><a href="{BASE}compare/?left={p['id']}">Compare</a><a href="{p['path']}brief.md" download>Download brief</a></nav></header>
<section id="evidence"><h2>Evidence</h2><p class="bc-small">{e(p['kind'])}</p><p>{e(record['evidence_supports'])}</p><p>{e(record['limitations'])}</p><p>{e(additional_duration(record))}</p><p class="bc-secondary">{e(record['tradeoffs'])}</p></section>
<section id="contributions"><h2>Contributions</h2><dl class="bc-fields"><div><dt>AI</dt><dd>{e(record['ai_contribution'])}</dd></div><div><dt>People</dt><dd>{e(record['human_contribution'])}</dd></div><div><dt>System</dt><dd><strong>{e(system['system_name'])}</strong><span class="bc-system-note">{e(system['source_note'])}</span></dd></div><div><dt>Timing</dt><dd>{e(record['date_precision'])}</dd></div></dl></section>
<section id="replication"><h2>Replication</h2><p>{e(p['conditions'])}</p></section>
<section id="sources"><h2>Sources</h2><ul class="bc-references">{sources}</ul><p class="bc-small">{e(record['record_number'])}. Reviewed {e(record['reviewed_date'])}.</p></section></article>"""


def evidence_brief(record: dict[str, Any]) -> str:
    p = presentation(record)
    system = record["system_details"]
    sources = "\n".join(
        f'- [{source["title"]}]({source["url"]})' for source in record["sources"]
    )
    return f"""# {p['title']}

{p['place']}. {p['date']}.

AI Benefits Database, {record['record_number']}
Reviewed {record['reviewed_date']}
Permanent record: {record['record_url']}

## Outcome

{record['observed_outcome']}

{record['stakeholder_detail']}

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

## Replication

{p['conditions']}

## Sources

{sources}

## Citation

Peter H. Vartanian. AI Benefits Database, {record['record_number']}: {p['title']}. Reviewed {record['reviewed_date']}. {record['record_url']}
"""


def redirect() -> str:
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0; url={BASE}"><link rel="canonical" href="{SITE}{BASE}"><title>AI Benefits Database</title></head><body><p><a href="{BASE}">AI Benefits Database</a></p></body></html>"""


def build(root: Path) -> None:
    root = Path(root)
    assets = root / "ai-benefits"
    data = json.loads((assets / "records.json").read_text())
    records = data["records"]
    method = json.loads((root / "content/ai-benefits/method.json").read_text())
    payload = {"records": [presentation(record) for record in records]}
    pages = [
        (
            BASE,
            "AI Benefits Database",
            "Documented AI benefits, with outcomes, beneficiaries, sources, and evidence for replication.",
            "explore",
            explorer(records),
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
                record_body(record),
                None,
                record,
            ),
        )
        save(folder / "brief.md", evidence_brief(record))
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
