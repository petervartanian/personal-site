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

`/portfolio/` retains all published writing. `/writing/` is an alias. `/artifacts/` presents the public working databases and tools listed in `content/site.json`. Its navigation label preserves the usual type size, with a small “working” above it inside the existing link box. The page has its own pale blue palette and matching share image.

The build produces the personal and scholarly pages and `/omphalos/` when its verified browser artifact is installed. These canonical public pages are listed in the XML sitemap. `content/public-pages.json` lists reviewed public project pages, including AIBD and chygraph. The seven research tools at `/200/` open without a password and remain outside public navigation, the sitemap, and `llms.txt`.

## omphalOS browser edition

omphalOS runs at `/omphalos/` using a local WebAssembly Python runtime and browser storage. GitHub Pages serves the application and runtime files; it does not receive investigation records or run a Python server. The application contacts supported public data providers directly when requested. There is no paid hosting service, iframe, or redirect.

Build the browser artifact in the omphalOS source repository, then install that complete artifact here:

```sh
python3 scripts/install_omphalos.py ../omphalos-platinum/dist/browser
python3 -m unittest discover -s scripts -p 'test_browser_app.py'
node --test scripts/test-public-snapshot.mjs
```

Installation verifies every file against `build-manifest.json`, rejects unlisted files and symbolic links, and copies only the application and its reviewed runtime assets. It updates the public-file allowlist, quiet homepage-footer and Site index links, sitemap, and `llms.txt`. No tool link is generated before the actual artifact is present. Installation builds and validates locally; it does not commit, push, or publish. Preserve the original omphalOS citation, date, credit, and repository URL; identify the 2024 version as historical and link separately to the current application. Keep the seven other tools out of public discovery files.

## Scholarly publication pages

`content/scholarly-publications.json` stores the complete author-written abstract and bibliographic details verified against the publisher. `scholarly_pages.py` supplies readable static HTML, Scholar citation metadata, and ScholarlyArticle structured data. The existing Writing entry retains its original publication link and gains a secondary abstract/citation link. The author page is a self-canonical, attributed copy of the abstract; it does not claim to be the publisher. The original paper stays linked at the publisher. Do not add `citation_pdf_url` for an external PDF: Scholar requires that tag to identify a PDF in the abstract page's own directory. Scholar inclusion is not guaranteed.

The two approved editorial asides on Writing use `data-nosnippet`: the affiliation correction and the credit complaint heading. Their visible text is unchanged. The publication records, abstracts, and contribution descriptions remain available for normal search excerpts.

Shared links use five 1200 × 630 preview images with backgrounds matching their pages. The preview artwork can be regenerated with `scripts/preview_cards.py` (Pillow) and `scripts/render_preview_cards.cjs` (Sharp); these optional tools are not needed to build the site. Both scripts accept a page key such as `artifacts` to regenerate one card. Approved PNGs live in `assets/img/social-*.png`.

## Unlisted research tools

Agency Costs, BackDrive, AI Risk Correlator, AI Incident Explorer, Haruspex, AI Control Monitor, and Arcolens open directly beneath `/200/`. The catalog is `/200/`; Arcolens also has a directory alias for its `OPEN_REVIEW.html` entry. Preserve these paths, queries, and fragments when publishing updates. Deploy the complete reviewed static build, including its data and assets, and add its exact file paths to `content/public-files.json`. The personal-page build does not regenerate these tools.

The tools are accessible to anyone with their URLs. Every HTML page has `noindex, nofollow` metadata, and the tool routes remain excluded from public navigation, the sitemap, `llms.txt`, and IndexNow submissions. Search exclusion is not access control. Do not add tool routes to discovery files when updating the tools.

`200/session.mjs` and `200/entry.mjs` retire the previous password loader for returning visitors. They update only existing `/200/` service workers. The replacement `200/sw.js` stops intercepting requests, deletes the saved session key, and unregisters itself. Keep these compatibility files at their original URLs so that old browser profiles can recover. Fresh visitors do not register a service worker. The previous ciphertext and derivation settings remain temporarily available for older workers during migration; no password is published or needed by the new pages.

The former `/x-oscope/` and `/auspex/` applications and their redirect pages remain removed. Do not recreate those routes or alternate copies of the tools at the site root. Do not publish additional source checkouts, unpublished preprints, credentials, or preview files. The prior source history remains in the separate private `petervartanian.github.io` repository.

Run `node --test scripts/test-200.mjs scripts/test-correlator.mjs scripts/test-public-snapshot.mjs` to verify browser migration, tool entry pages, search exclusions, and the deployment allowlist.

Search-engine notifications use IndexNow only after a verified successful Pages deployment. The sitemap is the public URL allowlist and all unlisted tool routes are independently excluded. A missing checkpoint stops automatic submission; the first manual `initialize=true` announces the reviewed public pages in the sitemap, and a saved checkpoint prevents unchanged pages from being submitted again.
