# Analytical protocol (frozen before candidate ranking)

Version `2026-09-27.3`; baseline analysis date `2026-09-27`. Version .3 records the second-version (Fable 5.1 review) additions listed at the end; the frozen eligibility rules are unchanged except for the declared emergence relaxation used only by the discovery stage. The initial pre-ranking protocol is preserved in the first run's inputs/code snapshot. Version .2 records post-verification clarifications and repairs; it is not represented as pre-data registration.

The actual CSV schema, marginal encodings, and public chart source were inspected before this protocol. These criteria are a documented exploratory selection rule, **not a preregistration before seeing the data**. No candidate comparisons had been ranked when the rule was written. Subsequent changes belong in the change log, not an overwritten protocol.

## Current presentation scope

The six-candidate cap below applies to the template-based analytical stage in
`tracker/candidates.py`, controlled by `max_shortlisted_candidates` in
`config/analysis.json`. The discovery and chart-profile stages add further
candidates. The current delivery's **Top findings** section prioritizes ten of the
full thirteen-candidate pool through `delivery/resources/review-selection.json`.
That presentation choice does not change the analytical eligibility rules or
recorded evidence. The full candidate pool remains available.

## Units, dates, and denominators

1. One observation is one unique AIID **incident record** (`aiid_id`). Records can aggregate occurrences. Neither report counts, estimated people, nor occurrence counts are weights. Duplicate IDs fail validation. Similar-event records remain distinct; drop #353 in a named sensitivity because #230/#353 may describe the same event.
2. Parse the calendar date from `date`. The AIID editors' guide uses the event date, first harm in prolonged events, legal/report dates when uncertain, and publication date as a last resort. Thus this is a heterogeneous incident-date series, not a report arrival series. The classification timestamp is separate. Report dates are absent, so do not estimate lag durations from this file. `aiid_id` order, under a stated and unverified assumption that IDs are assigned sequentially at AIID incident creation, gives only a lower bound on out-of-order (late) entry; its composition differs by year and is reported as context.
3. Complete-year comparisons stop at the year before the analysis date. The baseline is 2021–2025, the last five complete calendar years. Alternative windows are 2022–2025, 2021–2024 and pooled 2021–2022 versus 2024–2025. Year-to-date 2026 appears only in explicitly labeled snapshot distributions and tables; it is not annualized or compared with whole years.
4. Primary classification is a mutually exclusive partition. Any-label membership is the set union of primary plus additional subdomain codes, deduplicated within incident/category. Percent of incidents uses distinct incident N; assignment share uses the sum of memberships and is a separate quantity. Parent domains are derived from numeric prefixes only for explicitly labeled any-domain sensitivity.
5. All-incident denominators retain unknown/Other values. A known-only sensitivity excludes documented sentinels; Other is omitted only in a separately named causal-known sensitivity, since it can be a substantive category. Never hide legend categories when expecting an all-incident denominator.
6. Highest severity must name its dimensions and channels. In this export no severity cell is blank; 69 cells in two records (#413, #1607) are zero-coded. Zero-coded and blank components are both treated as unknown here, while the exporter's own aggregates treat 0 as a value; the exporter's meaning of 0 is an open evidence request and the two records are named wherever bounds are shown. Recompute maxima for ten versus thirteen dimensions and direct / direct+indirect / all three channels. Level 1 spans none to minor harm. Zero and missing are unknown, not proof of no harm. A threshold result with unknown components has lower/upper bounds. A direct-or-indirect score ≥2 measures **above-negligible scoring**, not any harm. Ordinal scores are not averaged or added to measure harm burden.
7. The current public ten-category rubric does not establish the thresholds for the three additional dimensions. Treat those as a schema sensitivity, not interchangeable measurements. National-security scores use a different rubric; grade 5 is Critical. EU AI Act values are LLM tags, not legal determinations.

## Candidate search and eligibility

All numerical claims are produced by executable code. Search families: complete-year record counts; primary and any-label subdomain shares; scalar category shares and concentrations; group contrasts; severity/channel/version contrasts (year-endpoint cells, and from version .3 same-population channel contrasts so that measurement-definition findings such as IT-C005 are screened cells); national-security and harm-category intersections. Record all screened cells and exclusions, not just winners. This is exploratory analysis, with no p-values, population inference, or significance ranking.

- A comparative subgroup/year must have **at least 50 incident records**, and a highlighted category must have **at least 10 observations in each compared endpoint/group**. These prevent fragile small-cell headlines; they are editorial stability rules, not a confidence level. Version .3 adds one declared relaxation for the discovery stage only: a cell excluded solely by the 10-observation rule at its first endpoint, whose denominators both meet the 50-record minimum and whose larger count reaches 50, is admitted as an **emergence** finding, phrased as where the category stands at the end year, and must pass its own stability rule (the preceding year already shows the shift and the final annual step does not reverse it).
- Share shifts must be **at least 5 percentage points**; cross-group contrasts **at least 10 percentage points**. Absolute count changes must meet **both 50 incidents and 25% relative change**, with baseline N ≥50. Descriptive concentrations require subgroup N ≥50, numerator ≥10 and share ≥50%. A ranking candidate requires winner count ≥50 and a lead of ≥5 percentage points over the runner-up.
- A methodology/data-quality comparison **within the same record population** uses the 5-percentage-point definition-change rule and the same sample requirements. The 10-point rule applies to contrasts between distinct subgroups. This explicit clarification follows independent review; it preserves the initial candidate's screen. A measurement finding uses a supporting table when the live chart cannot express it.
- Audit all published claims regardless of eligibility; small cells are a caveat, not a reason to omit a claim check.
- Shortlist at most **six** complementary candidates. Prefer exact, useful, chart-compatible comparisons with stable direction under reasonable alternatives. A result that changes with the definition may be retained only as an explicit definition-sensitivity finding. Do not silently substitute a favorable definition.
- Annual monotonicity requires **every** adjacent year to move strictly in the stated direction. Report flats and reversals; an endpoint difference is not a consistent annual trend. Counts and shares are evaluated separately. Missing years are filled with zero record counts, and zero-denominator proportions are undefined; they cannot pass monotonicity checks.

## Robustness and interpretation

For shortlisted findings, test relevant choices: primary/any-label, incident/assignment denominator, known-only denominator, endpoint and pooled windows, excluding the suspected duplicate, common classifier/prompt cohort, direct/indirect/inferred channels, 10/13 dimensions, and exclusion/bounds for zero scores. Not every variation is the same estimand; state which definition changes the question.

Calculation confidence means reproducibility against this export, not source truth. Broad interpretation confidence is lower because voluntary selective reporting, changing attention, reporting delays, backfilled history, aggregated events, and evolving LLM classifications affect the sample. Prompt and classifier cohort restriction checks cannot recover earlier classifications. Agreement/self-confidence scores do not provide statistical confidence. No classification-error rate is estimated; narrative spot-checks are targeted diagnostics, not representative validation.

## Existing-claim audit rules

Preserve the exact published block, URL, source hash, retrieval timestamp and original time window. Split composite assertions into named checks while retaining the parent wording. Fixed historical windows never roll forward with the current year. Interpret unspecified all-dataset figures against the current supplied snapshot and state that the original snapshot is unavailable.

- **Supported:** the explicitly operationalized assertion is met; limited to that interpretation and snapshot.
- **Needs a numerical or wording update:** direction/basic description holds but the published number, precision, scope or wording requires revision.
- **Unsupported under the stated interpretation:** an explicit ranking, annual direction or defined relationship is contradicted by the calculation.
- **Not verifiable with the available data or an ambiguous definition:** necessary data, window, category set, or qualitative decision rule is missing.

Exact displayed percentages are compared at their stated rounding precision (nearest whole or tenth percent; Python's half-even rule). Display strings use that same formatting convention; full fractions remain authoritative. No tolerance is invented for “around half,” “dramatically,” “few,” or “overwhelming.” These get numerical context and an editorial flag. A separate objective component may still be supported. LLM tier tags cannot verify that a use was legally prohibited. Pilot-model-validation claims cannot be independently checked using one incident-classification export.

Archives and dated methodology publications retain their own status/window and are not counted as current dashboard insights. The full discovery registry is retained; current empirical insight blocks receive the detailed CSV audit. Other records receive explicit scope/data-availability dispositions and targeted checks where the export can address them.

## Reuse

Monthly is the default cadence; `--cadence fortnightly` changes scheduling metadata only. Each run preserves input bytes, UTC run timestamps, code/config/prompt hashes and outputs in a new dated run. The first export is a baseline. Only later genuinely preserved exports can support export-to-export additions/reclassifications. Deterministic computations never invoke an LLM. Session-assisted text is evidence-bound and re-rendered from numerical results; unattended model invocation requires a separately tested provider integration.

The executable shortlist rechecks five session-selected analytical templates. It does not autonomously choose replacement findings when a template becomes ineligible: such outputs are withheld, while the fresh exploratory ledger remains available for human or later configured-LLM selection. Zero/missing-score exclusions are recomputed per input, not fixed to baseline IDs. Numeric inputs reject nonfinite, fractional and negative count encodings. Composite assignment-share targets are rejected; only singleton any-label subdomain numerators are implemented.

Archived page scopes are stored in `config/claim_checks.json`; the subdomain archive explicitly uses 2015–2025. Other open-ended archive illustrations are anchored at 2025 and remain labeled as analyst replays, rather than rolling forward with the analysis date. This does not recover the original archived dataset snapshot.

## Version 2026-09-27.3 — second-version additions (Fable 5.1 review)

The following stages and rules were added after the independent second review. They are declared rules, not statistical tests, and are recorded in every run's `discovery_ledger.json`.

### Data-driven discovery stage

1. **Statistical screen.** The exploratory ledger (`explore.py`) is the only source of candidate cells; the frozen eligibility rules above are applied unchanged.
2. **Deduplication.** Cells describing the same comparison are merged: primary and any-label versions of one subdomain (the primary version is kept because the public chart shows primary shares); labels of one low-cardinality field (≤4 observed labels) whose shares necessarily move together; and the severity dimension/channel/threshold ladder (one finding, the public ten-category direct/indirect definition preferred). Merged cells stay attached to the survivor as sensitivities.
3. **Declared withholding.** A cell that matches a currently published claim is routed to the claim audit rather than proposed as new. Cross-domain harm contrasts and national-security group contrasts are kept in the ledger but not proposed (taxonomy-entangled, no causal reading). Unknown/Other buckets, rankings over fields with few categories, within-domain concentrations at or above 95% (near-tautologies recorded as taxonomy-usage notes), complement labels of fields whose other labels are audited (given an explicit decision with their numbers), and cells whose direction is not stable under the alternative windows and cohorts below are withheld with a stated reason.
4. **Explainable scoring.** Each surviving cell receives five components in [0, 1], stored with the weights used: effect (absolute shift relative to a saturation of 25 percentage points; relative change for counts; excess over 50% for concentrations; lead for rankings), support (combined category observations at both endpoints, saturating at 100, so that a category rising from a small base is not penalised relative to its falling complement), stability (share of alternative definitions — start one year later, drop the latest complete year, drop the probable duplicate, restrict to the dominant classifier/prompt cohort, and every annual step in the same direction — that preserve direction and materiality), chart fit (how faithfully a current public chart can show it), and, from version .3, no novelty component: cells that match a published or archived claim are routed before scoring.
5. **Coverage-aware selection.** The best stable cell per chart whose score reaches the declared floor is taken first, then remaining slots are filled by score subject to per-family, per-chart and total caps. Every eligible cell ends with a decision and a reason.
6. **Interpretation and editorial choice are not automated.** Discovered candidates are drafted from templates and marked `human_review_required`; the LLM stage, if ever enabled, receives the same evidence bundle and is checked for numerical grounding before independent review.

### Context rows added to trend findings

Every endpoint comparison now shows the partial current year as context (never as a trend point) and, for the retained templates, the two years preceding the window, because the 2021 start of the capability/robustness decline is a local maximum of that series and the 2022 start of the EU tier-1 statement is a trough.


### Rules considered and not adopted

Reviewer 3 proposed merging a subdomain that holds at least 85% of its domain into a domain-level finding and turning pairwise domain × harm-category contrasts into per-harm-category domain profiles; both are recorded in V2_CHANGELOG.md as considered alternatives. Cross-domain harm contrasts remain withheld because they are entangled with taxonomy assignment and the live harm percentages are assignment shares.

## Recorded editorial cycle and source checks (0.3.0)

The deterministic report and model editorial cycle are separate artifacts. The latter receives a compact selection of calculations, definitions, candidates, current empirical claims, and optional source context bound to the same CSV hash. Source text is treated as untrusted evidence, not instructions. Astra drafts; a fresh Fable call reviews each candidate and each current empirical statement for numerical fit, chart compatibility, and wording. Neither model may authorize publication.

Schema checks, exact item coverage, evidence IDs, and numerical-token checks are necessary but do not prove semantic correctness. The numerical screen accepts stated display rounding and declared derived count/percentage changes; it does not generate confidence intervals or population estimates. Qualifier flags require interpretation, including recognition of negation in statements such as “does not establish safer AI.” Reviewer suggestions failing numerical screening are labeled rejected and not presented as checked replacement copy.

The source check was targeted at unusual zero-coded records, not a representative accuracy sample. All 69 zero cells have N/A in matching narrative channels, but zero is not defined in the linked 1–5 rubric. Incident 1607 incorporates unrelated comparison cases from its source article. Excluding that record leaves complete-year headline findings unchanged. Neither result supplies a dataset-wide error rate. The original CSV remains unchanged.

The current public mirror can contain the same number of records with different model classifications. Chart settings describe a possible compatible view, not equality between live-chart values and the export. Current browser coverage and control corrections are recorded under `review/browser/`; exact proposed website copy and its independent calculation audit are under `review/site/`.

## Editorial adjudication records

A completed model review may contain replacement suggestions rejected by numerical screening. Those suggestions are withheld. Explicit editorial adjudication may substitute checked replacement text for precisely those failed items, leaving the original model response and other review fields intact. A separate receipt binds the before/after text, rationale, source evidence and hashes to the model cycle and exact analytical evidence. It does not represent a fresh model call or publication authorization. Changed analytical evidence requires a new review rather than reuse of an old receipt.

## Version 2026-09-28.1 — descriptive chart profiles

This post-inspection extension adds one descriptive profile for C06 and one for C07. It does not relax the existing 50-record comparison threshold or claim preregistration. Profiles describe a finite export and remain subject to human selection.

For C06, count distinct records with at least one non-placeholder annotation in each of the six fixed categories. Keep every export record in the denominator. Explicit blank/N/A labels are excluded; malformed or incomplete category payloads withhold the profile. Retain per-category counts and sensitivity to records 353 and 1607. Use the lowest-ID record with all six categories only as an illustration. The prompt structure, including up to three causes per category, prevents reading these counts as causal importance or verified causation.

For C07, select recorded overall national-security scores >=4, then count distinct records scoring >=4 on each of five axes. Categories overlap. Keep thresholds 3 and 5, exclusion of the partial current year, and record exclusions as sensitivities. A small-group description is permitted; no annual trend, population-risk inference, or radar-area comparison follows. The radar can show only a named incident; an aggregate supporting table is required. Check that overall equals the maximum category score before admitting the profile.

Earlier model editorial reviews apply to the previous eleven candidates. The two new profiles were analyzed and reviewed in the current session; a fresh paid model cycle has not been executed for this expanded evidence bundle. All new profiles remain human_review_required.

A separate legacy comparison maps 49 fields from the genuine shared 1,200-record historical CSV onto the current schema. Missing modern fields are never fabricated. This provides real historical comparison evidence, but it is not a second export verified from the current Arcola pipeline. The ten-incident human-consensus comparison is diagnostic, not a representative current accuracy estimate or confirmed held-out validation.
