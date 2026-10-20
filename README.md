# Peter H. Vartanian

Personal website at https://petervartanian.xyz.

The personal pages are static HTML, CSS, and JavaScript. Update publication and CV records in `content/site.json`, adjust page templates in `build.py`, then run:

```sh
python3 build.py
python3 validate.py
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. Generated pages are checked into the repository for GitHub Pages. The build has no third-party Python dependencies.

`page_modified` in `content/site.json` records each canonical page’s last significant update as `YYYY-MM-DD` and supplies the sitemap’s `lastmod` values. Update only the affected pages when their main content, structured data, or links change meaningfully. Do not advance these dates merely because the site is rebuilt or redeployed.

Each personal page has its own quiet color palette in `assets/css/personal.css`. Body text uses Georgia. The name and page titles use locally hosted Sorts Mill Goudy, with its SIL Open Font License in `assets/fonts/OFL.txt`. Navigation works without JavaScript; the script enables the interactive illustration. The CV downloads as Markdown, generated alongside its web page. Publication and experience notes are always visible, with faint decorative patterns. CV headings use Roman numerals and lettered subsections; entries use borderless tables.

The homepage has an interactive SVG mobile with varied colored shapes and a suspension thread that winds around the introduction. It supports dragging and keyboard input, rests between interactions, and respects reduced-motion preferences. Without JavaScript it remains a static illustration.

`/portfolio/` retains all published writing. `/writing/` is an alias. The old placeholder collection at `/artifacts/` redirects to `/portfolio/`.

The build produces the personal and scholarly pages, the AI Benefits Database and its evidence records, and `/omphalos/` when its verified browser artifact is installed. These canonical public pages are listed in the XML sitemap. `content/public-pages.json` explicitly lists the reviewed database pages. The six protected research tools must remain outside public navigation, the sitemap, and `llms.txt`.

## AI Benefits Database

The database at `/ai-benefits/` lists ten sourced records, comprising five reported episodes and five comparative studies. Search and filters retrieve applications by task, topic, location, and evidence type. Comparisons and the method have separate pages. Every record has a permanent URL with its outcome, comparator, beneficiaries, system details, attribution limits, and conditions. Related records explain the connection and important differences.

`scripts/build_ai_benefits.py`, called by `build.py`, generates thirteen canonical pages, three redirects, version archives, evidence briefs, and the CSV export. The current collection is maintained in `ai-benefits/records.json`, the method in `content/ai-benefits/method.json`, and immutable record snapshots in `content/ai-benefits/history.json`. Static outputs are checked in for GitHub Pages. The record presentation fields provide concise display copy while canonical fields preserve full evidence and research qualifications. `evidence_details` records the application, supported country codes, source locators, documented conditions, transfer limits, and related cases. An empty country list means no study or episode country has been assigned from the reviewed evidence.

Older record hashes redirect to their permanent pages. The retired `/ai-benefits/sources/`, `/ai-benefits/records/`, and `/ai-benefits/contribute/` routes redirect to the database root and remain excluded from indexing and public discovery.

Use public primary sources only. Do not publish private chats, Slack content, consultation transcripts, unpublished notes, or local source paths. Keep reported outcomes, AI and human contributions, attribution limits, and replication conditions distinct. Source review does not independently verify an event or establish causation. Precise model versions remain unreported when the reviewed source does not identify them.

The benefit profile records gains and possibilities, beneficiaries, persistence, and reproduction. There is no universal magnitude grade. Keep documented operating conditions separate from editorial questions about applying an outcome elsewhere. A collection of included positive outcomes does not establish a success rate, a complete evidence review, or the absence of benefits where no record is found. Do not restore public research leads. The interface uses a plain list without eyebrow labels, promotional headings, tabs, or expandable sections. Original prose uses neither semicolons nor centered-dot separators. Preserve bibliographic punctuation in source data.

The collection exports as CSV and JSON. Permanent records provide printable evidence briefs, and `/ai-benefits/brief.md` preserves the complete current collection. Briefs retain comparators, limitations, source locators, and cited versions. Contributions go directly by email.

Each record version is identified by the first twelve hexadecimal characters of the SHA-256 hash of the record without its `revision` field, serialized with sorted keys, UTF-8 characters, and compact JSON separators. Its saved record and page live at `/ai-benefits/records/{id}/versions/{key}/record.json` and the corresponding directory URL. Archives carry `noindex` metadata, are included in the reviewed-file allowlist, and remain outside the canonical manifest and sitemap. Preserve previous history entries when revising a record. Add a dated explanation with the new snapshot, and confirm that the last snapshot matches the current record. Rebuilding must not silently change cited historical content.

Run `python3 -m unittest discover -s scripts -p 'test_ai_benefits.py'` after rebuilding. The tests check evidence preservation, source locators, revision recovery, exports, publication boundaries, and page inventory. Keep the public-page manifest and reviewed-file allowlist synchronized with routes and assets.

## omphalOS browser edition

omphalOS runs at `/omphalos/` using a local WebAssembly Python runtime and browser storage. GitHub Pages serves the application and runtime files; it does not receive investigation records or run a Python server. The application contacts supported public data providers directly when requested. There is no paid hosting service, iframe, or redirect.

Build the browser artifact in the omphalOS source repository, then install that complete artifact here:

```sh
python3 scripts/install_omphalos.py ../omphalos-platinum/dist/browser
python3 -m unittest discover -s scripts -p 'test_browser_app.py'
node --test scripts/test-public-snapshot.mjs
```

Installation verifies every file against `build-manifest.json`, rejects unlisted files and symbolic links, and copies only the application and its reviewed runtime assets. It updates the public-file allowlist, quiet homepage-footer and Site index links, sitemap, and `llms.txt`. No tool link is generated before the actual artifact is present. Installation builds and validates locally; it does not commit, push, or publish. Preserve the original omphalOS citation, date, credit, and repository URL; identify the 2024 version as historical and link separately to the current application. Keep the six other tools encrypted and private.

## Scholarly publication pages

`content/scholarly-publications.json` stores the complete author-written abstract and bibliographic details verified against the publisher. `scholarly_pages.py` supplies readable static HTML, Scholar citation metadata, and ScholarlyArticle structured data. The existing Writing entry retains its original publication link and gains a secondary abstract/citation link. The author page is a self-canonical, attributed copy of the abstract; it does not claim to be the publisher. The original paper stays linked at the publisher. Do not add `citation_pdf_url` for an external PDF: Scholar requires that tag to identify a PDF in the abstract page's own directory. Scholar inclusion is not guaranteed.

The two approved editorial asides on Writing use `data-nosnippet`: the affiliation correction and the credit complaint heading. Their visible text is unchanged. The publication records, abstracts, and contribution descriptions remain available for normal search excerpts.

Shared links use four 1200 × 630 preview images with backgrounds matching their pages. The preview artwork can be regenerated with `scripts/preview_cards.py` (Pillow) and `scripts/render_preview_cards.cjs` (Sharp); these optional tools are not needed to build the site. Approved PNGs live in `assets/img/social-*.png`.

## Private research tools

Agency Costs, BackDrive, AI Risk Correlator, Haruspex, AI Control Monitor, and Arcolens belong inside the encrypted `/200/` collection. Their HTML, code, data, and downloads must be encrypted before any plaintext deployment copies are removed. The old public routes and asset paths must not remain available as alternate access paths. The personal-page build does not build or publish those protected resources.

The former `/x-oscope/` and `/auspex/` applications and their redirect pages remain removed. Do not recreate those routes. Do not publish unpublished preprints or preview files; access-controlled original-source links remain access controlled.

`/200/` is an unlisted password gate. Its catalog and protected resources are encrypted with AES-256-GCM before publication. The password derives a non-extractable browser key using PBKDF2-SHA-256 with a random 32-byte salt and 600,000 iterations. No password or plaintext protected exports belong in the deployment package.

A service worker scoped to `/200/` decrypts pages and downloads after unlocking. An eight-hour session stores a non-extractable key in IndexedDB, never the password; Lock clears access and returns open experiment tabs to the gate. Decrypted responses use `Cache-Control: no-store`. The directory is excluded from the sitemap and has `noindex, nofollow` metadata. Client-side encryption depends on password strength and is not server-side authorization or an account system.

To update the protected tools, use the approved vault builder with local source directories and supply the existing password on standard input. Verify source checksums, encrypt every required resource, and emit only ciphertext and public encryption parameters into `200/vault/`. The build must not alter the underlying analyses or call an LLM. Rebuilding with a different password re-encrypts the current files; old ciphertext in Git history remains tied to its original password.

Previously public source files can remain accessible in repository history even after a deployment removes them. The privacy migration must keep source/build history private and publish only a clean deployment package containing the public pages, password gate, and ciphertext. This repository contains a fresh public history with public pages, the password gate, and encrypted resources. The prior source history is retained separately in the private `petervartanian.github.io` repository. Removing links or adding `noindex` does not make plaintext resources private, and migration cannot retract copies already downloaded elsewhere.

Run `node --test scripts/test-200.mjs` for routing, wrong-password, tampering, session, and logout checks. The private source archive contains the migration and verification scripts, which decrypt and check every packaged resource and internal link locally. Public site builds do not need the password and do not rebuild the encrypted resources.

Search-engine notifications use IndexNow only after a verified successful Pages deployment. The sitemap is the public URL allowlist and all protected tool routes are independently denied. A missing checkpoint stops automatic submission; the first manual `initialize=true` announces the reviewed public pages in the sitemap, and a saved checkpoint prevents unchanged pages from being submitted again.
