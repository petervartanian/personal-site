"""Verify the personal site's content and navigation without third-party packages."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from html import unescape, escape
import json
import re
import xml.etree.ElementTree as ET
from scholarly_pages import load_publications
from browser_app import browser_page

ROOT = Path(__file__).parent
SCHOLARLY_PUBLICATIONS = load_publications(ROOT)
OMPHALOS_PAGE = browser_page(ROOT)
PAGES = (
    [
        "index.html",
        "portfolio/index.html",
        "cv/index.html",
        "contact/index.html",
        "site-index/index.html",
        "404.html",
    ]
    + [
        item["path"].strip("/") + "/index.html"
        for item in json.loads((ROOT / "content/public-pages.json").read_text())
    ]
    + [work["path"].strip("/") + "/index.html" for work in SCHOLARLY_PUBLICATIONS]
)
PROTECTED_PATHS = (
    "/200/",
    "/agency-costs/",
    "/backdrive/",
    "/correlator/",
    "/haruspex/",
    "/monitor/",
    "/arcolens/",
)


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.refs = []
        self.ids = []
        self.h1 = 0
        self.lang = False
        self.main = False
        self.canonical = False
        self.og = False
        self.text = []
        self.canonical_urls = []
        self.robots = []
        self.resources = []
        self.metadata = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = bool(a.get("lang"))
        if tag == "h1":
            self.h1 += 1
        if tag == "main":
            self.main = True
        if "id" in a:
            self.ids.append(a["id"])
        if tag in ("a", "link", "script", "img"):
            url = a.get("href", a.get("src", ""))
            if url:
                self.refs.append(url)
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = True
            self.canonical_urls.append(a.get("href", ""))
        if tag == "meta" and a.get("name", "").lower() in ("robots", "googlebot"):
            self.robots.append(a.get("content", "").lower())
        if tag == "meta" and a.get("name"):
            self.metadata.append((a["name"], a.get("content", "")))
        if tag == "script" and a.get("src"):
            self.resources.append(a["src"])
        if tag == "link" and a.get("rel") == "stylesheet":
            self.resources.append(a.get("href", ""))
        if tag == "meta" and a.get("property") == "og:image":
            self.og = True
            self.refs.append(urlsplit(a["content"]).path)

    def handle_data(self, d):
        self.text.append(d)


pages = {name: Page(ROOT / name) for name in PAGES}
failures = []


def check(condition, message):
    if not condition:
        failures.append(message)


for name, p in pages.items():
    page_copy = " ".join(p.text)
    if name == "portfolio/index.html":
        page_copy = page_copy.replace(
            "Sometimes credit isn’t given where it’s due 😔", ""
        )
    # Personal-page style rules must not rewrite public source titles or quotations.
    if not name.startswith("ai-benefits/"):
        check(
            not re.search(
                r"\b(?:I[’']m|I[’']ve|I[’']ll|we[’']re|you[’']re|don[’']t|doesn[’']t|can[’']t|won[’']t|isn[’']t|it[’']s)\b",
                page_copy,
                re.I,
            ),
            f"{name}: contraction in page copy",
        )
    check(p.h1 == 1 and p.main and p.lang, f"{name}: missing accessible page structure")
    check(p.canonical and p.og, f"{name}: missing share metadata")
    check(len(set(p.ids)) == len(p.ids), f"{name}: duplicate IDs")
    check("/artifacts/" not in p.refs, f"{name}: empty collection still in navigation")
    for url in p.refs:
        parts = urlsplit(url)
        if parts.scheme or parts.netloc:
            continue
        target = (
            (ROOT / parts.path.lstrip("/"))
            if parts.path.startswith("/")
            else (ROOT / name).parent / parts.path
        )
        if not parts.path:
            target = ROOT / name
        if target.is_dir():
            target /= "index.html"
        check(target.is_file(), f"{name}: missing link or asset {url}")
        if parts.fragment and target.is_file() and target.suffix == ".html":
            ids = Page(target).ids
            check(unquote(parts.fragment) in ids, f"{name}: missing anchor {url}")

data = json.loads((ROOT / "content/site.json").read_text())
logo_data = json.loads((ROOT / "content/institution-logos.json").read_text())
for key, logo in logo_data.items():
    check(
        (ROOT / "assets/logos" / logo["file"]).is_file(),
        f"Missing institution logo: {key}",
    )
    check(
        f'logo-{key}"' in (ROOT / "cv/index.html").read_text(),
        f"Institution logo absent from CV: {key}",
    )
cv_html = (ROOT / "cv/index.html").read_text()
for row in re.findall(r"<tr>(.*?)</tr>", cv_html.split('id="education"')[0], re.S):
    check(
        "institution-entry" in row,
        "Experience entry is missing its aligned affiliation layout",
    )
archive = re.sub(r"\s+", " ", " ".join(pages["portfolio/index.html"].text))
for work in data["writings"] + data["contributions"]:
    check(work["title"] in archive, f'Missing publication: {work["title"]}')
    check(
        work["url"] in pages["portfolio/index.html"].refs,
        f'Missing publication URL: {work["title"]}',
    )
    check(work["venue"] in archive, f'Missing venue: {work["title"]}')
    clean = re.sub(r"[*†‡]", "", work["credit"]).strip()
    check(
        all(part.strip() in archive for part in clean.split(" · ")),
        f'Missing authorship or date: {work["title"]}',
    )
cv = "".join(pages["cv/index.html"].text)
check("Curriculum Vitæ" in cv, "CV title must use vitæ")
writing_html = (ROOT / "portfolio/index.html").read_text()
publication_rows = re.findall(
    r'<li class="(?:publication|contribution)">(.*?)</li>', writing_html, re.S
)
for work in data["writings"] + data["contributions"]:
    row = next(
        (row for row in publication_rows if f'href="{escape(work["url"])}"' in row), ""
    )
    check(bool(row), f'Missing publication or contribution row: {work["title"]}')
    if "note_id" in work:
        check(
            f'href="#publication-note-{work["note_id"]}"' in row,
            f'Wrong publication note: {work["title"]}',
        )
    else:
        check(
            'class="note-ref"' not in row,
            f'Unexpected publication note: {work["title"]}',
        )
check(
    '<details id="publication-notes"' not in writing_html
    and "note-box" not in writing_html
    and all(f'<p id="publication-note-{i}">' in writing_html for i in [1, 2, 4]),
    "Notes must remain visible together without separate boxes",
)
snippet_exclusions = re.findall(
    r"<span data-nosnippet>(.*?)</span>", writing_html, re.S
)
check(
    len(snippet_exclusions) == 2,
    "Only the approved correction and credit aside should be excluded from search excerpts",
)
check(
    "Sometimes credit isn’t given where it’s due 😔" in snippet_exclusions,
    "Credit aside is missing its snippet exclusion",
)
check(
    any(
        text.startswith(
            "The publication contains an incorrect institutional affiliation;"
        )
        for text in snippet_exclusions
    ),
    "Affiliation correction is missing its snippet exclusion",
)
check("Peter’s Memos" in archive, "Missing memo section")
check("brunellaism" not in writing_html, "Removed post must not be linked")
check(
    "<ol" not in (ROOT / "cv/index.html").read_text(),
    "Only CV headings and subheadings should be numbered",
)
for numeral in ["I.", "II.", "III.", "IV."]:
    check(numeral in cv, f"Missing CV section number {numeral}")
for entry in data["cv"]["experience"]:
    org = re.sub(r"[*/]+$", "", entry["organization"])
    check(org in cv and entry["dates"] in cv, f"Missing CV entry: {org}")
for section in data["cv"]["sections"]:
    if section["label"] in ("Education",) or section["label"].startswith("Languages"):
        continue
    for item in section["items"]:
        check(item in cv, f"Missing CV detail: {item}")
for org in [
    "Occidental College",
    "California Institute of Technology",
    "3.97/4.00",
    "4.00/4.00",
    "Classical Nahuatl",
    "Arabic (Fuṣḥā and Lebanese)",
]:
    check(org in cv, f"Missing education/language detail: {org}")
markdown = (ROOT / "cv/peter-vartanian-cv.md").read_text()
check(
    "Primary contributions only" not in markdown,
    "Markdown CV must not contain filter controls",
)
check(
    "<img" not in markdown
    and "/assets/logos/" not in markdown
    and "![" not in markdown,
    "Markdown CV must not contain images or image URLs",
)
check(
    'download="peter-vartanian-cv.md"' in (ROOT / "cv/index.html").read_text(),
    "CV download link is missing",
)
for entry in data["cv"]["experience"]:
    org = re.sub(r"[*/]+$", "", entry["organization"])
    check(org in markdown and entry["dates"] in markdown, f"Markdown CV omits {org}")
for label in ["Experience", "Education", "Languages", "Skills & methods"]:
    check(label in markdown, f"Markdown CV omits section {label}")
for institution, honors in data["cv"]["institution_honors"].items():
    for honor in honors:
        for value in [honor["title"], honor["date"]]:
            check(
                value in cv and value in markdown,
                f"Missing honor for {institution}: {value}",
            )
check(
    ">Awards</strong>" not in (ROOT / "cv/index.html").read_text(),
    "Standalone Awards section remains",
)
for marker in ["*", "†"]:
    check(f"[^{marker}]:" in markdown, f"Markdown CV omits note {marker}")
for path in ["sitemap.xml", "feed.xml"]:
    ET.parse(ROOT / path)
feed = ET.parse(ROOT / "feed.xml").getroot()
atom = {"atom": "http://www.w3.org/2005/Atom"}
check(
    feed.findtext("atom:updated", namespaces=atom)[:10]
    >= max(work["published"] for work in data["writings"]),
    "Writing feed predates its newest publication",
)
check(
    len(feed.findall("atom:entry", atom)) == len(data["writings"]),
    "Writing feed omits a publication",
)
check(
    "artifacts" not in (ROOT / "sitemap.xml").read_text(),
    "Placeholder route remains in sitemap",
)
check(
    "url=/portfolio/" in (ROOT / "artifacts/index.html").read_text(),
    "Old artifacts bookmarks do not redirect",
)
public_projects = json.loads((ROOT / "content/public-pages.json").read_text())
benefit_records = json.loads((ROOT / "ai-benefits/records.json").read_text())["records"]
expected_benefit_paths = {
    "/ai-benefits/",
    "/ai-benefits/compare/",
    "/ai-benefits/records/",
    "/ai-benefits/sources/",
    "/ai-benefits/method/",
    "/ai-benefits/contribute/",
} | {"/ai-benefits/records/" + record["id"] + "/" for record in benefit_records}
check(
    {item.get("path") for item in public_projects} == expected_benefit_paths,
    "Public projects must contain only the reviewed AI Benefits Database pages and records",
)
public_paths = (
    ["/", "/portfolio/", "/cv/", "/contact/", "/site-index/"]
    + [item["path"] for item in SCHOLARLY_PUBLICATIONS]
    + [item["path"] for item in public_projects]
    + ([OMPHALOS_PAGE["path"]] if OMPHALOS_PAGE else [])
)
check(
    len(public_paths)
    == 5
    + len(SCHOLARLY_PUBLICATIONS)
    + len(expected_benefit_paths)
    + bool(OMPHALOS_PAGE),
    "Expected the personal, scholarly, AI Benefits Database, and installed browser-app pages",
)
sitemap = ET.parse(ROOT / "sitemap.xml").getroot()
sitemap_urls = [
    element.text
    for element in sitemap.findall(
        "{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc"
    )
]
check(len(sitemap_urls) == len(set(sitemap_urls)), "Sitemap contains duplicate URLs")
check(
    set(sitemap_urls) == {"https://petervartanian.xyz" + path for path in public_paths},
    "Sitemap must include every canonical public page and no private, template, error, or redirect URLs",
)
discovery_text = (ROOT / "sitemap.xml").read_text() + (ROOT / "llms.txt").read_text()
check(
    not any(
        "https://petervartanian.xyz" + path in discovery_text
        for path in PROTECTED_PATHS
    ),
    "Protected tools appear in a public discovery file",
)
for name in ("index.html", "site-index/index.html"):
    check(
        ("/omphalos/" in pages[name].refs) == bool(OMPHALOS_PAGE),
        f"{name}: omphalOS link does not match the installed app",
    )
    check(
        "/ai-benefits/" in pages[name].refs,
        f"{name}: AI Benefits Database link is missing",
    )
check(
    "/ai-benefits/" in (ROOT / "llms.txt").read_text(),
    "AI Benefits Database is missing from public discovery",
)
check(
    "/ai-benefits/sources/" in (ROOT / "llms.txt").read_text(),
    "AI Benefits Database sources are missing from public discovery",
)
if OMPHALOS_PAGE:
    browser = Page(ROOT / "omphalos/index.html")
    check(
        browser.main and browser.lang, "omphalOS: missing accessible application shell"
    )
    check(
        "/omphalos/" in (ROOT / "llms.txt").read_text(),
        "The installed omphalOS app is missing from public discovery",
    )
for path in public_paths:
    filename = ROOT / path.strip("/") / "index.html"
    check(filename.is_file(), f"Missing public page: {path}")
    if not filename.is_file():
        continue
    public = Page(filename)
    check(
        public.canonical_urls == ["https://petervartanian.xyz" + path],
        f"{path}: canonical must identify this public page exactly once",
    )
    check(
        not any(re.search(r"\b(noindex|none)\b", value) for value in public.robots),
        f"{path}: public page blocks indexing",
    )
    check(
        filename.stat().st_size < 2_000_000,
        f"{path}: HTML exceeds Googlebot crawl limit",
    )
    for url in public.refs:
        parsed = urlsplit(url)
        if parsed.netloc and parsed.netloc != "petervartanian.xyz":
            continue
        check(
            not any(
                parsed.path == protected.rstrip("/")
                or parsed.path.startswith(protected)
                for protected in PROTECTED_PATHS
            ),
            f"{path}: protected route appears in public links: {url}",
        )
    if path != "/site-index/":
        check(path in pages["site-index/index.html"].refs, f"Site index omits {path}")
    for url in public.resources:
        parts = urlsplit(url)
        if parts.scheme or parts.netloc:
            continue
        asset = (
            ROOT / parts.path.lstrip("/")
            if parts.path.startswith("/")
            else filename.parent / parts.path
        )
        check(asset.is_file(), f"{path}: missing initial rendering resource {url}")
        if asset.is_file():
            check(
                asset.stat().st_size < 2_000_000,
                f"{path}: rendering resource exceeds Googlebot crawl limit: {url}",
            )
for work in SCHOLARLY_PUBLICATIONS:
    path = work["path"].strip("/") + "/index.html"
    publication = pages[path]
    html = (ROOT / path).read_text()
    check(
        work["path"] in pages["portfolio/index.html"].refs,
        f'Missing abstract/citation link: {work["title"]}',
    )
    check(
        work["abstract"] in " ".join(publication.text),
        f'Complete abstract is missing: {work["title"]}',
    )
    for source in (work["source_url"], work["pdf_url"], work["license_url"]):
        check(
            source in publication.refs,
            f"Missing publication source or license: {source}",
        )
    metadata = dict(publication.metadata)
    check(
        metadata.get("citation_title") == work["title"],
        f"Incorrect scholarly title: {path}",
    )
    check(
        metadata.get("citation_publication_date") == work["publication_year"],
        f"Incorrect scholarly publication year: {path}",
    )
    check(
        [value for name, value in publication.metadata if name == "citation_author"]
        == work["authors"],
        f"Incorrect scholarly author list: {path}",
    )
    check(
        metadata.get("citation_doi") == work["doi"], f"Incorrect scholarly DOI: {path}"
    )
    check(
        "citation_pdf_url" not in metadata,
        f"External publisher PDF must not be declared as a same-directory Scholar PDF: {path}",
    )
    graphs = [
        json.loads(payload)
        for payload in re.findall(
            r'<script type="application/ld\+json">(.*?)</script>', html, re.S
        )
    ]
    check(
        any(
            graph.get("@type") == "ScholarlyArticle"
            and graph.get("abstract") == work["abstract"]
            for graph in graphs
        ),
        f"Missing or incomplete scholarly structured data: {path}",
    )
if failures:
    raise SystemExit("\n".join(failures))
print(
    f'Passed: {len(PAGES)} personal/index/error pages; {len(public_paths)} indexable public pages; {len(data["writings"])} publications; {len(data["contributions"])} other contributions; {len(data["cv"]["experience"])} experience entries; content, links, metadata, crawl sizes, and redirects.'
)
