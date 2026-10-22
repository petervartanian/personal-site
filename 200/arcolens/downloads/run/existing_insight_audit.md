# Existing published insights — current-page audit

These statuses assess the supplied export under explicit interpretations, not the original publication snapshot. Fixed historical windows are recalculated without extending them to the current partial year. Exact wording is preserved after HTML entity/whitespace extraction, including publication typos.

**Scope:** 19 current empirical quotation blocks, including repeated validation prose. Composite statements have component checks. The 4 copies of the reliability paragraph are separate source occurrences, not independent findings.

| Status | Quotation blocks |
| --- | --- |
| Needs a numerical or wording update | 2 |
| Not verifiable with the available data or an ambiguous definition | 10 |
| Supported | 6 |
| Unsupported under the stated interpretation | 1 |

| Claim | Status | Qualification | Source |
| --- | --- | --- | --- |
| HOME-01 | Needs a numerical or wording update | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker) |
| HOME-02 | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker) |
| HOME-06 | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker) |
| TIME-01 | Supported | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) |
| TIME-02 | Supported | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) |
| TIME-03 | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) |
| TIME-04 | Unsupported under the stated interpretation | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) |
| TIME-05 | Supported | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) |
| TIME-06 | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) |
| OVERVIEW-01 | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-overview) |
| OVERVIEW-02 | Supported | Rounded numerical component; ‘Almost all’ remains editorial | [page](https://airisk.mit.edu/ai-incident-tracker/incident-overview) |
| OVERVIEW-03 | Needs a numerical or wording update | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-overview) |
| OVERVIEW-04 | Supported | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-overview) |
| OVERVIEW-05 | Supported | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-overview) |
| OVERVIEW-06 | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-overview) |
| TIME-VALIDATION | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) |
| OVERVIEW-VALIDATION | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-overview) |
| VIEW-VALIDATION | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/incident-view) |
| NATSEC-VALIDATION | Not verifiable with the available data or an ambiguous definition | See component checks and interpretation | [page](https://airisk.mit.edu/ai-incident-tracker/natsec-incident-view) |

Ambiguous ‘about half’, ‘dramatically’, ‘vast majority’ and ‘few’ expressions receive exact numerical context and an editorial flag; no tolerance is silently invented. ‘Supported’ is scoped to the stated calculation and does not validate the LLM labels or population representativeness.

## HOME-01 — Needs a numerical or wording update

[Source](https://airisk.mit.edu/ai-incident-tracker) · retrieved **2026-09-27T16:43:29.440887Z** · `current_tracker`

**Exact published wording**

> The MIT AI Incident Tracker classifies 1,600 real-world report incidents from the AI Incident Database by risk, cause, harm, severity, and other relevant dimensions.

**Original window:** Not stated; current published prose, with no frozen source-data snapshot identified.

**Interpretation:** Static HTML fallback count versus the live count the page renders from the mirror's sync status; observed once in headless Chromium during the v2 review.

**Evidence and reason:** The supplied export contains 1,698 unique incident records. The page's static HTML says 1,600. A headless Chromium (Playwright chrome-headless-shell 1208, --dump-dom, no interaction) render on 2026-09-27T23:11Z showed the live count 1,697 in place of the static text (source: review/fable/scratch/v2-site-maintainer/render/home_dom.html (and r2-charts-claims/live/render/home_dom.html at 22:49Z)); the published figure is therefore a stale no-JavaScript fallback with no 'as of' date, not a wrong rendered count. Under the ID-prefix proxy, 1,600 records corresponds to aiid_id ≤ 1612 (latest incident date 2026-07-24); aiid_id is assumed to be assigned sequentially at AIID incident creation; this is unverified. Even if verified, ID order does not establish calendar entry dates or when it was reported, and cannot recover classifications in force at that time.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- rendered count observed: **Supported** — Chromium (Playwright chrome-headless-shell 1208, --dump-dom, no interaction) at 2026-09-27T23:11Z: 1,697; export 1,698; static fallback 1,600.

**Discrepancy explanation:** changed dataset: stale static fallback; the rendered count is the live mirror's record count

**Suggested revision**

> The MIT AI Incident Tracker classifies [live count, shown with its 'as of' date] incident records from the AI Incident Database by risk, cause, harm, severity and other dimensions.

**Editorial flags:** Update the static fallback whenever the page is edited; a 'count updated nightly' note is an option for the maintainers (the mirror syncs daily), not a promise this analysis can make.; Unit: incident records, not reports or events.

**Calculation definition:** `{"handler": "dataset_size", "published_count": 1600, "interpretation": "Static HTML fallback count versus the live count the page renders from the mirror's sync status; observed once in headless Chromium during the v2 review.", "browser_observation": {"engine": "Chromium (Playwright chrome-headless-shell 1208, --dump-dom, no interaction)", "observed_at_utc": "2026-09-27T23:11Z", "rendered_count": 1697, "source": "review/fable/scratch/v2-site-maintainer/render/home_dom.html (and r2-charts-claims/live/render/home_dom.html at 22:49Z)"}}`

**Incident-level evidence:** 1 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim HOME-01`. Source/quote hashes and raw source paths are retained in the same registry.

## HOME-02 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker) · retrieved **2026-09-27T16:43:29.440887Z** · `current_tracker`

**Exact published wording**

> AI incidents are on the rise, yet current databases struggle with inconsistent structure, limiting their utility for policymaking. The AI Incident Tracker project addresses this by creating a tool to classify AI incidents based on risks and harm severity. Raw reports from the AI Incident Database (AIID) are processed by Arcola AI's LLM pipeline, which categorizes them using established frameworks, such as the MIT Risk Repository and a harm severity rating system based on CSET’s AI Harm Taxonomy.

**Original window:** Not stated; current published prose, with no frozen source-data snapshot identified.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** No time window or population exposure denominator is stated. Contextual complete-year record counts: 2021: 80/80 (100.0%); 2022: 108/108 (100.0%); 2023: 179/179 (100.0%); 2024: 304/304 (100.0%); 2025: 452/452 (100.0%). Primary system-safety domain: 378/1,698 (22.3%). Classifier missing-information flag: 42/1,698 (2.5%), which is not a measure of all reporting omissions.

**Suggested revision**

> In the current export, 80 incident records are dated 2021 and 452 are dated 2025. These counts describe records in the database and reflect reporting and coverage as well as underlying events; they do not measure the incidence of AI incidents.

**Editorial flags:** Undefined population/time window; Database prevalence is not population prevalence

**Calculation definition:** `{"handler": "unbounded_rise", "context_years": [2021, 2025]}`

**Incident-level evidence:** 7 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim HOME-02`. Source/quote hashes and raw source paths are retained in the same registry.

## HOME-06 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker) · retrieved **2026-09-27T16:43:29.440887Z** · `current_tracker`

**Exact published wording**

> Key visualizations include bar charts and pie charts that display incident counts, proportions across domains (e.g., "System Failures," "Discrimination & Toxicity"), and trends in causal attributes. Additionally, insights highlight patterns such as the prevalence of system safety issues, intentional misuse trends, and incomplete reporting gaps.

**Original window:** Not stated; current published prose, with no frozen source-data snapshot identified.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** No time window or population exposure denominator is stated. Contextual complete-year record counts: 2021: 80/80 (100.0%); 2022: 108/108 (100.0%); 2023: 179/179 (100.0%); 2024: 304/304 (100.0%); 2025: 452/452 (100.0%). Primary system-safety domain: 378/1,698 (22.3%). Classifier missing-information flag: 42/1,698 (2.5%), which is not a measure of all reporting omissions.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- charts display classifications and counts: **Supported** — Verified from preserved client source and API; browser rendering was not tested.
- system-safety prevalence: **Not verifiable with the available data or an ambiguous definition** — Only database composition is measurable: 378/1,698 (22.3%) primary domain 7 records. No population prevalence denominator exists.
- intentional-misuse framing: **Not verifiable with the available data or an ambiguous definition** — Intentional tags are not independently verified misuse. Named 2021–2025 context: 2021: 17/80 (21.2%); 2022: 36/108 (33.3%); 2023: 90/179 (50.3%); 2024: 192/304 (63.2%); 2025: 291/452 (64.4%).
- reporting gaps: **Not verifiable with the available data or an ambiguous definition** — The missing-information flag is 42/1,698 (2.5%); missing source URLs and report dates prevent estimating reporting completeness.

**Suggested revision**

> The charts summarize incident-record classifications, including system-safety and intentional-cause tags. Their distributions describe this database; reporting completeness and population prevalence cannot be estimated from this export.

**Editorial flags:** Undefined population/time window; Database prevalence is not population prevalence

**Calculation definition:** `{"handler": "qualitative_frame", "context_years": [2021, 2025]}`

**Incident-level evidence:** 12 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim HOME-06`. Source/quote hashes and raw source paths are retained in the same registry.

## TIME-01 — Supported

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) · retrieved **2026-09-27T16:43:29.446045Z** · `current_tracker`

**Exact published wording**

> There has been a clear rise year on year in the proportion of incidents each year between 2021 and 2025 associated with 4.3 Fraud, scams and targeted manipulation

**Original window:** 2021–2025 inclusive, explicitly stated; year-on-year incident proportions.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** Primary: 2021: 3/80 (3.8%); 2022: 13/108 (12.0%); 2023: 38/179 (21.2%); 2024: 105/304 (34.5%); 2025: 192/452 (42.5%). Any-label incident denominator: 2021: 6/80 (7.5%); 2022: 17/108 (15.7%); 2023: 56/179 (31.3%); 2024: 131/304 (43.1%); 2025: 227/452 (50.2%). Endpoint change +38.73 percentage points; counts change +189. 2026 year-to-date through 2026-09-27 (incomplete; context only, not comparable with whole years): 70/231 (30.3%).

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- primary annual incident share: **Supported**
- any annual incident share: **Supported**

**Suggested revision**

> Among incident records dated 2021–2025, the share whose primary subdomain is ‘4.3 Fraud, scams, and targeted manipulation’ rose each year, from 3 of 80 (3.8%) in 2021 to 192 of 452 (42.5%) in 2025. These are shares of records in the database, not measures of how common such incidents are.

**Editorial flags:** Some annual category counts are below the new-candidate minimum; the published claim is still audited.

**Calculation definition:** `{"handler": "subdomain_trend", "subdomain": "4.3", "years": [2021, 2025], "direction": "up", "strict_annual": true}`

**Incident-level evidence:** 11 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim TIME-01`. Source/quote hashes and raw source paths are retained in the same registry.

## TIME-02 — Supported

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) · retrieved **2026-09-27T16:43:29.446045Z** · `current_tracker`

**Exact published wording**

> The proportion of reported incidents attributed to lack of capability or robustness has been decreasing between 2021 and 2025

**Original window:** 2021–2025 inclusive, explicitly stated; incident proportion (not absolute count).

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified. ‘Decreasing between’ is assessed as an endpoint statement; stricter annual decline and absolute counts are checked separately.

**Evidence and reason:** Primary: 2021: 33/80 (41.2%); 2022: 33/108 (30.6%); 2023: 37/179 (20.7%); 2024: 44/304 (14.5%); 2025: 45/452 (10.0%). Any-label incident denominator: 2021: 53/80 (66.2%); 2022: 62/108 (57.4%); 2023: 72/179 (40.2%); 2024: 108/304 (35.5%); 2025: 121/452 (26.8%). Endpoint change -31.29 percentage points; counts change +12. 2026 year-to-date through 2026-09-27 (incomplete; context only, not comparable with whole years): 43/231 (18.6%).

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- primary annual incident share: **Supported**
- any annual incident share: **Supported**

**Suggested revision**

> Among incident records dated 2021–2025, the share whose primary subdomain is ‘7.3 Lack of capability or robustness’ fell each year, from 33 of 80 (41.2%) in 2021 to 45 of 452 (10.0%) in 2025, while the number of such records rose from 33 to 45. The falling share reflects faster growth in other categories; it is not evidence that AI systems became more robust.

**Calculation definition:** `{"handler": "subdomain_trend", "subdomain": "7.3", "years": [2021, 2025], "direction": "down", "strict_annual": false}`

**Incident-level evidence:** 11 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim TIME-02`. Source/quote hashes and raw source paths are retained in the same registry.

## TIME-03 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) · retrieved **2026-09-27T16:43:29.446045Z** · `current_tracker`

**Exact published wording**

> Numbers of reported incidents attributed to systems whose purpose is video, voice or image generation have increased dramatically since 2022, now totalling around half reported incidents.

**Original window:** Since 2022; 'now' has no dated endpoint. Adjacent bullets discuss 2025 but this bullet does not specify the endpoint or precise generation-purpose category set.

**Interpretation:** No original purpose set or dated meaning of ‘now’ is supplied. Named purpose sets are alternative analyst operationalizations, not assumed author definitions.

**Evidence and reason:** strict_primary: 2022: 19/108 (17.6%); 2023: 74/179 (41.3%); 2024: 147/304 (48.4%); 2025: 239/452 (52.9%); expanded_primary: 2022: 22/108 (20.4%); 2023: 75/179 (41.9%); 2024: 148/304 (48.7%); 2025: 243/452 (53.8%); strict_primary_secondary: 2022: 23/108 (21.3%); 2023: 77/179 (43.0%); 2024: 161/304 (53.0%); 2025: 256/452 (56.6%). All-date narrow share: 601/1,698 (35.4%); incomplete 2026: 101/231 (43.7%) (not a full-year comparison).

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- strict_primary: **Supported** — Strictly increasing counts under this named operationalization only
- expanded_primary: **Supported** — Strictly increasing counts under this named operationalization only
- strict_primary_secondary: **Supported** — Strictly increasing counts under this named operationalization only

**Suggested revision**

> Using the primary-purpose labels Deepfake Video Generation, Deepfake Image Generation, Voice Generation and Image Generation, such incident records rose from 19 of 108 (17.6%) in 2022 to 239 of 452 (52.9%) in 2025; across all records in the export (all dates) they are 601 of 1,698 (35.4%).

**Editorial flags:** ‘Dramatically’ and ‘around half’ have no predeclared quantitative threshold.; Fix ‘now’, the year, primary/secondary scope, and purpose set before passing/failing the prose.

**Calculation definition:** `{"handler": "generation_ambiguity", "context_years": [2022, 2025], "definition_source": "config/analysis.json strict/expanded purpose lists; analyst operationalizations, not original published definitions"}`

**Incident-level evidence:** 14 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim TIME-03`. Source/quote hashes and raw source paths are retained in the same registry.

## TIME-04 — Unsupported under the stated interpretation

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) · retrieved **2026-09-27T16:43:29.446045Z** · `current_tracker`

**Exact published wording**

> The proportion of incidents classified as level 1 (Unacceptable) under the EU AI Act increased each year since 2022, reaching 4% in 2025]

**Original window:** 2022–2025; endpoint explicitly 2025. Literal trailing ']' retained.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** 2022: 3/108 (2.8%); 2023: 9/179 (5.0%); 2024: 15/304 (4.9%); 2025: 24/452 (5.3%). Adjacent changes use unrounded fractions: 2023→2024 (-0.09 pp; within one record). Years before the claim's window (context only; small cells): 2016: 2/41 (4.9%); 2017: 2/50 (4.0%); 2018: 4/46 (8.7%); 2019: 6/44 (13.6%); 2020: 6/92 (6.5%); 2021: 7/80 (8.8%). 2022 is the lowest year of 2016–2025. 2026 year-to-date through 2026-09-27 (incomplete; context only, not comparable with whole years): 4/231 (1.7%). These are automated tier classifications, not legal rulings.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- increases each year: **Unsupported under the stated interpretation** — Failing step(s): 2023→2024 (-0.09 pp; within one record). Protocol-correct on unrounded fractions; a one-record margin is fragile to backfill.
- quoted endpoint: **Needs a numerical or wording update** — Observed 24/452 (5.3%); published 4% at 0 decimals.
- full tier composition at the endpoints (complement labels move together): **Not verifiable with the available data or an ambiguous definition** — 2022: tier 1 3/108 (2.8%), tier 2 47/108 (43.5%), tier 3 40/108 (37.0%), tier 4 18/108 (16.7%); 2025: tier 1 24/452 (5.3%), tier 2 36/452 (8.0%), tier 3 374/452 (82.7%), tier 4 18/452 (4.0%)

**Discrepancy explanation:** not a calculation error: the annual-increase clause fails on unrounded fractions in this export and on the live mirror; the 4% endpoint is not reproduced by any ID-prefix snapshot proxy together with a strict rise

**Suggested revision**

> Incident records tagged tier 1 (Unacceptable) under the EU AI Act were 3 of 108 (2.8%) in 2022, 9 of 179 (5.0%) in 2023, 15 of 304 (4.9%) in 2024 and 24 of 452 (5.3%) in 2025. 2022 was the lowest year of 2016–2025. These are automated tier tags that change as records are reclassified; they are not legal determinations.

**Editorial flags:** Remove literal trailing bracket; Legal applicability/prohibition is not independently established; Temporal applicability for the human legal reviewer: confirm from which date the Act's prohibitions applied; most tier-1-tagged records are dated before 2025.

**Calculation definition:** `{"handler": "eu_annual", "years": [2022, 2025], "level": "1", "published_endpoint_percent": 4, "rounding_decimals": 0, "context_years_before": 6}`

**Incident-level evidence:** 19 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim TIME-04`. Source/quote hashes and raw source paths are retained in the same registry.

## TIME-05 — Supported

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) · retrieved **2026-09-27T16:43:29.446045Z** · `current_tracker`

**Exact published wording**

> The proportion of intentionally caused incidents has increased each year from 2021-2025, as has the proportion attributed to Human rather than AI entities.

**Original window:** 2021–2025 inclusive, explicitly stated; two parallel proportions in one published bullet.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** causal_intent: 2021: 17/80 (21.2%); 2022: 36/108 (33.3%); 2023: 90/179 (50.3%); 2024: 192/304 (63.2%); 2025: 291/452 (64.4%). causal_entity: 2021: 22/80 (27.5%); 2022: 41/108 (38.0%); 2023: 94/179 (52.5%); 2024: 198/304 (65.1%); 2025: 310/452 (68.6%). 2026 year-to-date through 2026-09-27 (incomplete; context only, not comparable with whole years): 130/231 (56.3%); 2026 year-to-date through 2026-09-27 (incomplete; context only, not comparable with whole years): 142/231 (61.5%).

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- causal_intent: **Supported**
- causal_entity: **Supported**

**Suggested revision**

> Among incident records dated 2021–2025, the share tagged as intentionally caused rose each year, from 17 of 80 (21.2%) to 291 of 452 (64.4%), and the share whose causal entity is tagged Human rather than AI rose each year, from 22 of 80 (27.5%) to 310 of 452 (68.6%). These are LLM-assigned causal tags, not verified causes.

**Calculation definition:** `{"handler": "causal_annual", "years": [2021, 2025], "targets": {"causal_intent": "Intentional", "causal_entity": "Human"}}`

**Incident-level evidence:** 22 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim TIME-05`. Source/quote hashes and raw source paths are retained in the same registry.

## TIME-06 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) · retrieved **2026-09-27T16:43:29.446045Z** · `current_tracker`

**Exact published wording**

> The overwhelming majority of incidents assessed were classified as post-deployment with no more than a few percent being pre-deployment in any year.

**Original window:** 'In any year'; no explicit start/end. Current default chart starts 2016, which is not proof of the original claim's analysis window.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** Post-deployment overall: 1,663/1,698 (97.9%). Largest pre-deployment share across observed complete years: 1996 1/1 (100.0%). In the default chart's complete-year scope (2016–2025), maximum: 2016 4/41 (9.8%); full annual series in the component below. Sparse years and unstated scope/‘few’ definitions leave the parent wording ambiguous; see the literal-universe component. 2026 year-to-date (incomplete; context only): 8/231 (3.5%).

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- pre-deployment share by year, default chart scope 2016–2025 (no threshold asserted): **Not verifiable with the available data or an ambiguous definition** — 2016: 4/41 (9.8%); 2017: 3/50 (6.0%); 2018: 1/46 (2.2%); 2019: 2/44 (4.5%); 2020: 3/92 (3.3%); 2021: 1/80 (1.2%); 2022: 1/108 (0.9%); 2023: 3/179 (1.7%); 2024: 2/304 (0.7%); 2025: 2/452 (0.4%); 2026 to date (incomplete): 8/231 (3.5%)
- literal ‘few percent in any year’, if every observed calendar year is included: **Unsupported under the stated interpretation** — The maximum is 1996: 1/1 (100.0%). An entirely pre-deployment year contradicts this literal reading without inventing a tolerance for ‘few’; sparse years and the intended publication scope need editorial review.

**Suggested revision**

> Almost all incident records are tagged post-deployment: 1,663 of 1,698 (97.9%). Pre-deployment tags were 4 of 41 (9.8%) in 2016 and 3 of 50 (6.0%) in 2017, and between 0.4% and 4.5% in each other year from 2018 to 2025; 2026 to date they are 8 of 231 (3.5%).

**Editorial flags:** overwhelming majority; few percent; in any year

**Calculation definition:** `{"handler": "timing_any_year", "context_start": 2016, "vague_terms": ["overwhelming majority", "few percent", "in any year"]}`

**Incident-level evidence:** 45 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim TIME-06`. Source/quote hashes and raw source paths are retained in the same registry.

## OVERVIEW-01 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-overview) · retrieved **2026-09-27T16:43:29.446325Z** · `current_tracker`

**Exact published wording**

> About half of all reported incidents were tagged as intentionally caused.

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** All records: 830/1,698 (48.9%); omitting Other/unknown as a sensitivity: 830/1,696 (48.9%). No numerical tolerance is invented for ‘About half’.

**Suggested revision**

> In this export, 830 of 1,698 incident records (48.9%) are tagged as intentionally caused.

**Editorial flags:** About half

**Calculation definition:** `{"handler": "vague_half", "field": "causal_intent", "value": "Intentional", "vague_terms": ["About half"]}`

**Incident-level evidence:** 2 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim OVERVIEW-01`. Source/quote hashes and raw source paths are retained in the same registry.

## OVERVIEW-02 — Supported

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-overview) · retrieved **2026-09-27T16:43:29.446325Z** · `current_tracker`

**Exact published wording**

> Almost all reported incidents have been classified as post-deployment, with only 2% pre-deployment

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Verify the explicit 2% using nearest-whole-percent rounding over all records; ‘Almost all’ is an editorial qualifier, not a separately thresholded hypothesis.

**Evidence and reason:** Pre: 32/1,698 (1.9%); post: 1,663/1,698 (97.9%); Other: 3/1,698 (0.2%).

**Suggested revision**

> Post-deployment is tagged for 1,663/1,698 (97.9%) of records; pre-deployment for 32/1,698 (1.9%), with 3 Other timing tags.

**Editorial flags:** ‘Almost all’ remains an editorial judgment; numeric component drives status.

**Calculation definition:** `{"handler": "timing_rounded", "published_percent": 2, "rounding_decimals": 0}`

**Incident-level evidence:** 3 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim OVERVIEW-02`. Source/quote hashes and raw source paths are retained in the same registry.

## OVERVIEW-03 — Needs a numerical or wording update

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-overview) · retrieved **2026-09-27T16:43:29.446325Z** · `current_tracker`

**Exact published wording**

> 5.7% of reported incidents would be classed as level 1 (Unacceptable) and therefore prohibited under the EU AI Act. 33% would be classified as level 2 (High Risk)

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** Tier 1: 87/1,698 (5.1%); Tier 2: 435/1,698 (25.6%). Tier-2 share by complete year: 2021: 43/80 (53.8%); 2022: 47/108 (43.5%); 2023: 39/179 (21.8%); 2024: 45/304 (14.8%); 2025: 36/452 (8.0%). Under the ID-prefix proxy, both published figures are reproduced jointly by 14 prefixes ending at aiid_id 1043–1058 (n 1,031–1,046; latest incident dates 2025-04-26 to 2025-04-29); single figures match {'1': 198, '2': 38} prefixes respectively, so the joint match is suggestive, not conclusive. aiid_id is assumed to be assigned sequentially at AIID incident creation; this is unverified. Even if verified, ID order does not establish calendar entry dates or when it was reported, and cannot recover classifications in force at that time. The live mirror on 2026-09-27T22:45Z–23:08Z showed tier 1 95/1697 and tier 2 435/1697; the CSV has 87 tier-1 records because eight records (#480, #487, #510, #543, #701, #1455, #1549, #1591) were reclassified from tier 1 to tier 3 in one batch 98 minutes after the mirror's 00:01 UTC sync (source: review/fable/scratch/r2-charts-claims/live/mirror_vs_csv_diff.json). Classifier tags cannot establish prohibition.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- tier 1 percentage: **Needs a numerical or wording update**
- tier 2 percentage: **Needs a numerical or wording update**
- therefore prohibited: **Not verifiable with the available data or an ambiguous definition**
- earlier-snapshot proxy (diagnostic, not a reconciliation): **Not verifiable with the available data or an ambiguous definition** — Current-label ID prefixes reproduce the rounded published figures. This is consistent with a different dataset composition, but does not establish the origin or date of the published values, recover historical labels, or exclude a calculation error. The original snapshot is required.

**Discrepancy explanation:** unconfirmed historical explanation: current-label ID prefixes reproduce the published pair, consistent with a different dataset composition; the original snapshot is required to establish its origin, and calculation error is not excluded

**Suggested revision**

> In the current export, the LLM classifier assigns EU AI Act tier 1 (Unacceptable) to 87 of 1,698 incident records (5.1%) and tier 2 (High Risk) to 435 (25.6%). These are automated tags that change between exports; they are not legal determinations, and whether a practice is prohibited depends on the Act's scope, exemptions and dates of application, which the tags do not assess.

**Editorial flags:** Automated taxonomy tags are not legal conclusions; Original all-dataset snapshot not supplied; Temporal applicability for the human legal reviewer: confirm from which date the Act's prohibitions applied; most tier-1-tagged records are dated before 2025.

**Calculation definition:** `{"handler": "eu_distribution", "quoted_percents": {"1": 5.7, "2": 33}, "rounding_decimals": {"1": 1, "2": 0}, "legal_claim_verifiable": false, "snapshot_proxy": true, "live_observation": {"observed_at_utc": "2026-09-27T22:45Z–23:08Z", "records": 1697, "tier1_count": 95, "tier2_count": 435, "note": "the CSV has 87 tier-1 records because eight records (#480, #487, #510, #543, #701, #1455, #1549, #1591) were reclassified from tier 1 to tier 3 in one batch 98 minutes after the mirror's 00:01 UTC sync (source: review/fable/scratch/r2-charts-claims/live/mirror_vs_csv_diff.json)."}}`

**Incident-level evidence:** 7 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim OVERVIEW-03`. Source/quote hashes and raw source paths are retained in the same registry.

## OVERVIEW-04 — Supported

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-overview) · retrieved **2026-09-27T16:43:29.446325Z** · `current_tracker`

**Exact published wording**

> The primary purpose category attributed to the highest number of incidents is Deepfake Video Generation

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** Deepfake Video Generation: 316/1,698 (18.6%); Chatbot: 181/1,698 (10.7%); Deepfake Image Generation: 135/1,698 (8.0%). Ranking counts primary labels over all incident dates, including the partial current year as snapshot composition.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.


**Suggested revision**

> Across all incident records in the export, the most frequent single primary AI-purpose tag is ‘Deepfake Video Generation’, assigned to 316 of 1,698 incident records (18.6%), followed by ‘Chatbot’ (181, 10.7%). The chart's ‘Other’ slice groups the tail beyond the 15 named purposes (394 records here) and is larger than any single named category.

**Calculation definition:** `{"handler": "ranking", "field": "ai_goal_primary", "expected_order": ["Deepfake Video Generation"]}`

**Incident-level evidence:** 3 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim OVERVIEW-04`. Source/quote hashes and raw source paths are retained in the same registry.

## OVERVIEW-05 — Supported

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-overview) · retrieved **2026-09-27T16:43:29.446325Z** · `current_tracker`

**Exact published wording**

> The domain with most reported incidents across the full dataset is '4 Malicious actors' followed by ‘7 AI system safety, failures, & limitations’

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** 4 Malicious actors: 641/1,698 (37.8%); 7 AI system safety, failures, & limitations: 378/1,698 (22.3%); 1 Discrimination & Toxicity: 281/1,698 (16.5%). Ranking counts primary labels over all incident dates, including the partial current year as snapshot composition.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.


**Suggested revision**

> Across all incident records in the export, the most frequent primary risk domain is ‘4 Malicious actors’ (641 of 1,698 (37.8%)), followed by ‘7 AI system safety, failures, & limitations’ (378, 22.3%).

**Calculation definition:** `{"handler": "ranking", "field": "domain_code", "expected_order": ["4 Malicious actors", "7 AI system safety, failures, & limitations"]}`

**Incident-level evidence:** 3 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim OVERVIEW-05`. Source/quote hashes and raw source paths are retained in the same registry.

## OVERVIEW-06 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-overview) · retrieved **2026-09-27T16:43:29.446325Z** · `current_tracker`

**Exact published wording**

> Within domain 4 Malicious actors, the vast majority of reported incidents were in the subdomain ‘4.3 Fraud, scams and targeted manipulation’

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** Primary within primary domain: 440/641 (68.6%); any subdomain within the same primary-domain population: 478/641 (74.6%); default bar floor: 438/639 (68.5%). ‘Vast majority’ has no declared threshold.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- literal majority (>50%): **Supported**

**Suggested revision**

> Within incident records primarily tagged ‘4 Malicious actors’, about two-thirds, 440 of 641 (68.6%), have the primary subdomain ‘4.3 Fraud, scams, and targeted manipulation’; on the default chart (2016 onwards) the figure is 438 of 639 (68.5%).

**Editorial flags:** vast majority; All-time prose versus default bar's 2016 floor

**Calculation definition:** `{"handler": "within_domain", "domain": "4", "subdomain": "4.3", "vague_terms": ["vast majority"]}`

**Incident-level evidence:** 3 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim OVERVIEW-06`. Source/quote hashes and raw source paths are retained in the same registry.

## TIME-VALIDATION — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-timeline) · retrieved **2026-09-27T16:43:29.446045Z** · `current_tracker`

**Exact published wording**

> The LLM classification tool has been developed iteratively, and its agreement with human expert consensus is comparable to the agreement between 2 independent human experts (article forthcoming). Spot-checks have been used to provide feedback on misclassifications and to iterate the tool, improving its reliability, however there are likely to remain incidents where the LLM classification does not match expert consensus.

**Original window:** Undated assertion ('article forthcoming'); June 30, 2026 pilot study supplies relevant but limited context.

**Interpretation:** Agreement/reliability against human experts; requires the study's paired labels, sampling and scoring procedures.

**Evidence and reason:** The CSV contains one retained classification per incident and no human reference labels or repeated model runs. The linked June 2026 article reports a small pilot (10 incidents, 2 expert reviewers, 8 models), not a full-dataset validation; its production model was Sonnet 4 (per the June 2026 update), whereas this export's classifications carry model_name gemini-3.5-flash (1,696), mistral-large-latest (2), so the pilot validates neither this export's model nor its prompt. The pilot's human–human agreement was itself only fair to moderate (QWK 0.31 for harm severity, 0.56 for the EU tier), and the EU AI Act tier was its weakest taxonomy. The export's confidence field is 'High' for 1,656/1,698 records (97.5%) with no 'Low' values and carries no discriminating information. The article is published, making ‘forthcoming’ stale.

**Suggested revision**

> The classifier was evaluated in a small pilot (June 2026: 10 incidents, 2 expert reviewers, 8 models); the best models agreed with the reviewers' consensus about as often as the two reviewers agreed with each other, which was itself only fair to moderate (QWK 0.31 for harm severity, 0.56 for the EU AI Act tier). The pilot did not include the model used for the current classifications, and misclassifications remain likely, especially for the EU AI Act risk tier. [Link the 30 June 2026 update in place of ‘article forthcoming’.]

**Editorial flags:** Replace ‘(article forthcoming)’ with a link to the 30 June 2026 update; Do not turn agreement/self-consistency into statistical confidence

**Calculation definition:** `{"handler": "validation_unavailable", "external_context": "June 30, 2026 pilot: ten incidents; no replicate model/human annotations in the CSV", "pilot": {"incidents": 10, "reviewers": 2, "models": 8, "production_model": "Sonnet 4 (per the June 2026 update)", "qwk_harm": 0.31, "qwk_eu": 0.56, "source": "research/published_claims_raw.json UPDATE26-L013, L018, L073, L075, L083"}}`

**Incident-level evidence:** 0 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim TIME-VALIDATION`. Source/quote hashes and raw source paths are retained in the same registry.

## OVERVIEW-VALIDATION — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-overview) · retrieved **2026-09-27T16:43:29.446325Z** · `current_tracker`

**Exact published wording**

> The LLM classification tool has been developed iteratively, and its agreement with human expert consensus is comparable to the agreement between 2 independent human experts (article forthcoming). Spot-checks have been used to provide feedback on misclassifications and to iterate the tool, improving its reliability, however there are likely to remain incidents where the LLM classification does not match expert consensus.

**Original window:** Undated assertion ('article forthcoming'); June 30, 2026 pilot study supplies relevant but limited context.

**Interpretation:** Agreement/reliability against human experts; requires the study's paired labels, sampling and scoring procedures.

**Evidence and reason:** The CSV contains one retained classification per incident and no human reference labels or repeated model runs. The linked June 2026 article reports a small pilot (10 incidents, 2 expert reviewers, 8 models), not a full-dataset validation; its production model was Sonnet 4 (per the June 2026 update), whereas this export's classifications carry model_name gemini-3.5-flash (1,696), mistral-large-latest (2), so the pilot validates neither this export's model nor its prompt. The pilot's human–human agreement was itself only fair to moderate (QWK 0.31 for harm severity, 0.56 for the EU tier), and the EU AI Act tier was its weakest taxonomy. The export's confidence field is 'High' for 1,656/1,698 records (97.5%) with no 'Low' values and carries no discriminating information. The article is published, making ‘forthcoming’ stale.

**Suggested revision**

> The classifier was evaluated in a small pilot (June 2026: 10 incidents, 2 expert reviewers, 8 models); the best models agreed with the reviewers' consensus about as often as the two reviewers agreed with each other, which was itself only fair to moderate (QWK 0.31 for harm severity, 0.56 for the EU AI Act tier). The pilot did not include the model used for the current classifications, and misclassifications remain likely, especially for the EU AI Act risk tier. [Link the 30 June 2026 update in place of ‘article forthcoming’.]

**Editorial flags:** Replace ‘(article forthcoming)’ with a link to the 30 June 2026 update; Do not turn agreement/self-consistency into statistical confidence

**Calculation definition:** `{"handler": "validation_unavailable", "external_context": "June 30, 2026 pilot: ten incidents; no replicate model/human annotations in the CSV", "pilot": {"incidents": 10, "reviewers": 2, "models": 8, "production_model": "Sonnet 4 (per the June 2026 update)", "qwk_harm": 0.31, "qwk_eu": 0.56, "source": "research/published_claims_raw.json UPDATE26-L013, L018, L073, L075, L083"}}`

**Incident-level evidence:** 0 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim OVERVIEW-VALIDATION`. Source/quote hashes and raw source paths are retained in the same registry.

## VIEW-VALIDATION — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker/incident-view) · retrieved **2026-09-27T16:43:29.446499Z** · `current_tracker`

**Exact published wording**

> The LLM classification tool has been developed iteratively, and its agreement with human expert consensus is comparable to the agreement between 2 independent human experts (article forthcoming). Spot-checks have been used to provide feedback on misclassifications and to iterate the tool, improving its reliability, however there are likely to remain incidents where the LLM classification does not match expert consensus.

**Original window:** Undated assertion ('article forthcoming'); June 30, 2026 pilot study supplies relevant but limited context.

**Interpretation:** Agreement/reliability against human experts; requires the study's paired labels, sampling and scoring procedures.

**Evidence and reason:** The CSV contains one retained classification per incident and no human reference labels or repeated model runs. The linked June 2026 article reports a small pilot (10 incidents, 2 expert reviewers, 8 models), not a full-dataset validation; its production model was Sonnet 4 (per the June 2026 update), whereas this export's classifications carry model_name gemini-3.5-flash (1,696), mistral-large-latest (2), so the pilot validates neither this export's model nor its prompt. The pilot's human–human agreement was itself only fair to moderate (QWK 0.31 for harm severity, 0.56 for the EU tier), and the EU AI Act tier was its weakest taxonomy. The export's confidence field is 'High' for 1,656/1,698 records (97.5%) with no 'Low' values and carries no discriminating information. The article is published, making ‘forthcoming’ stale.

**Suggested revision**

> The classifier was evaluated in a small pilot (June 2026: 10 incidents, 2 expert reviewers, 8 models); the best models agreed with the reviewers' consensus about as often as the two reviewers agreed with each other, which was itself only fair to moderate (QWK 0.31 for harm severity, 0.56 for the EU AI Act tier). The pilot did not include the model used for the current classifications, and misclassifications remain likely, especially for the EU AI Act risk tier. [Link the 30 June 2026 update in place of ‘article forthcoming’.]

**Editorial flags:** Replace ‘(article forthcoming)’ with a link to the 30 June 2026 update; Do not turn agreement/self-consistency into statistical confidence

**Calculation definition:** `{"handler": "validation_unavailable", "external_context": "June 30, 2026 pilot: ten incidents; no replicate model/human annotations in the CSV", "pilot": {"incidents": 10, "reviewers": 2, "models": 8, "production_model": "Sonnet 4 (per the June 2026 update)", "qwk_harm": 0.31, "qwk_eu": 0.56, "source": "research/published_claims_raw.json UPDATE26-L013, L018, L073, L075, L083"}}`

**Incident-level evidence:** 0 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim VIEW-VALIDATION`. Source/quote hashes and raw source paths are retained in the same registry.

## NATSEC-VALIDATION — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/ai-incident-tracker/natsec-incident-view) · retrieved **2026-09-27T16:43:29.668374Z** · `current_tracker`

**Exact published wording**

> The LLM classification tool has been developed iteratively, and its agreement with human expert consensus is comparable to the agreement between 2 independent human experts (article forthcoming). Spot-checks have been used to provide feedback on misclassifications and to iterate the tool, improving its reliability, however there are likely to remain incidents where the LLM classification does not match expert consensus.

**Original window:** Undated assertion ('article forthcoming'); June 30, 2026 pilot study supplies relevant but limited context.

**Interpretation:** Agreement/reliability against human experts; requires the study's paired labels, sampling and scoring procedures.

**Evidence and reason:** The CSV contains one retained classification per incident and no human reference labels or repeated model runs. The linked June 2026 article reports a small pilot (10 incidents, 2 expert reviewers, 8 models), not a full-dataset validation; its production model was Sonnet 4 (per the June 2026 update), whereas this export's classifications carry model_name gemini-3.5-flash (1,696), mistral-large-latest (2), so the pilot validates neither this export's model nor its prompt. The pilot's human–human agreement was itself only fair to moderate (QWK 0.31 for harm severity, 0.56 for the EU tier), and the EU AI Act tier was its weakest taxonomy. The export's confidence field is 'High' for 1,656/1,698 records (97.5%) with no 'Low' values and carries no discriminating information. The article is published, making ‘forthcoming’ stale.

**Suggested revision**

> The classifier was evaluated in a small pilot (June 2026: 10 incidents, 2 expert reviewers, 8 models); the best models agreed with the reviewers' consensus about as often as the two reviewers agreed with each other, which was itself only fair to moderate (QWK 0.31 for harm severity, 0.56 for the EU AI Act tier). The pilot did not include the model used for the current classifications, and misclassifications remain likely, especially for the EU AI Act risk tier. [Link the 30 June 2026 update in place of ‘article forthcoming’.]

**Editorial flags:** Replace ‘(article forthcoming)’ with a link to the 30 June 2026 update; Do not turn agreement/self-consistency into statistical confidence

**Calculation definition:** `{"handler": "validation_unavailable", "external_context": "June 30, 2026 pilot: ten incidents; no replicate model/human annotations in the CSV", "pilot": {"incidents": 10, "reviewers": 2, "models": 8, "production_model": "Sonnet 4 (per the June 2026 update)", "qwk_harm": 0.31, "qwk_eu": 0.56, "source": "research/published_claims_raw.json UPDATE26-L013, L018, L073, L075, L083"}}`

**Incident-level evidence:** 0 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim NATSEC-VALIDATION`. Source/quote hashes and raw source paths are retained in the same registry.
