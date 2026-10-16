"""Render author publication pages from verified publisher bibliographic data.

The main build owns the shared page wrapper, navigation, and sitemap. For each
record returned by ``load_publications(ROOT)``, pass ``publication_body(work)``
to that wrapper and add ``publication_head(work, SITE_URL)`` to its head. The
head includes both Scholar citation tags and a ScholarlyArticle JSON-LD object.
Include each record's path in the sitemap and link from its Writing entry.

Do not use citation_pdf_url for the external publisher PDF: Google's Scholar
guidelines require that tag's PDF to share the abstract page's subdirectory.
The visible original-PDF link remains the source of the full text. This module
does not promise that Google Scholar will index or select an author copy.
"""

from html import escape
import json
from pathlib import Path


def load_publications(root):
    """Load only authored scholarly works with a complete published abstract."""
    return json.loads(
        (Path(root) / "content/scholarly-publications.json").read_text()
    )


def publication_schema(work, site_url):
    """Describe the article without treating a repository date as publication."""
    url = site_url.rstrip("/") + work["path"]
    return {
        "@context": "https://schema.org",
        "@type": "ScholarlyArticle",
        "@id": url + "#article",
        "url": url,
        "headline": work["title"],
        "author": [
            {"@type": "Person", "name": author}
            for author in work["authors"]
        ],
        "datePublished": work["publication_year"],
        "abstract": work["abstract"],
        "inLanguage": "en",
        "identifier": {
            "@type": "PropertyValue",
            "propertyID": "DOI",
            "value": work["doi"],
        },
        "sameAs": [work["source_url"], "https://doi.org/" + work["doi"]],
        "license": work["license_url"],
        "isPartOf": {
            "@type": "PublicationIssue",
            "issueNumber": work["issue"],
            "isPartOf": {
                "@type": "PublicationVolume",
                "volumeNumber": work["volume"],
                "isPartOf": {
                    "@type": "Periodical",
                    "name": work["journal"],
                    "issn": work["issn"],
                },
            },
        },
    }


def publication_head(work, site_url):
    """Return escaped citation metadata and scholarly structured data."""
    tags = [
        ("citation_title", work["title"]),
        *[("citation_author", author) for author in work["authors"]],
        ("citation_publication_date", work["publication_year"]),
        ("citation_online_date", work["online_date"].replace("-", "/")),
        ("citation_journal_title", work["journal"]),
        ("citation_volume", work["volume"]),
        ("citation_issue", work["issue"]),
        ("citation_doi", work["doi"]),
        ("citation_issn", work["issn"]),
        ("citation_abstract_html_url", site_url.rstrip("/") + work["path"]),
    ]
    head = "\n".join(
        f'<meta name="{name}" content="{escape(value, quote=True)}">'
        for name, value in tags
    )
    payload = json.dumps(
        publication_schema(work, site_url), ensure_ascii=False,
        separators=(",", ":"),
    ).replace("<", "\\u003c")
    styles = '''<style>
.scholarly-publication .citation_title { font-size: 32px; margin-bottom: 16px; }
.scholarly-publication .citation_author { font-size: 19px; margin-bottom: 14px; }
.scholarly-publication section { margin-top: 30px; }
.scholarly-publication h2 { margin-bottom: 12px; }
.scholarly-publication > .quiet:last-child { margin-top: 30px; }
@media (max-width: 600px) {
  .scholarly-publication .citation_title { font-size: 27px; }
}
</style>'''
    return head + f'\n<script type="application/ld+json">{payload}</script>\n' + styles


def publication_body(work):
    """Render the full author-written abstract, citation, and original sources."""
    title = escape(work["title"])
    authors = escape(", ".join(work["authors"]))
    journal = escape(work["journal"])
    year = escape(work["publication_year"])
    volume = escape(work["volume"])
    article_number = escape(work["article_number"])
    doi = escape(work["doi"])
    source_url = escape(work["source_url"], quote=True)
    pdf_url = escape(work["pdf_url"], quote=True)
    license_url = escape(work["license_url"], quote=True)
    license_name = escape(work["license_name"])
    abstract = escape(work["abstract"])
    return f'''<article class="scholarly-publication" aria-labelledby="publication-title">
  <p class="quiet"><a href="/portfolio/">Writing</a></p>
  <h1 id="publication-title" class="citation_title">{title}</h1>
  <p class="citation_author">{authors}</p>
  <p><em>{journal}</em><br>Vol. {volume}, Article {article_number} ({year})<br>DOI: <a href="https://doi.org/{doi}">{doi}</a></p>
  <p><a href="{pdf_url}">Read the original paper (PDF)</a><br><a href="{source_url}">Publisher’s record</a></p>
  <section aria-labelledby="abstract-title">
    <h2 id="abstract-title">Abstract</h2>
    <p>{abstract}</p>
  </section>
  <section aria-labelledby="citation-title">
    <h2 id="citation-title">Citation</h2>
    <p>{authors} ({year}). “{title}.” <em>{journal}</em>, Vol. {volume}, Article {article_number}. <a href="https://doi.org/{doi}">https://doi.org/{doi}</a>.</p>
  </section>
  <p class="quiet">The abstract is reproduced unchanged from the <a href="{source_url}">publisher’s record</a> under the <a rel="license" href="{license_url}">{license_name}</a> license.</p>
</article>'''
