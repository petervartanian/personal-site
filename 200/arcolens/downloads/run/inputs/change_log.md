# Substantive changes and reconciliations

## Before candidate exploration

- The preliminary schema assumption that `date` was a homogeneous event date was refined using the AIID editors' guide: it can use legal/report/publication proxies when event dates are uncertain. Analysis consistently calls it the recorded incident date.
- Purpose groups in the initial config were corrected **before computing comparisons** to exact exported labels. The narrow operationalization contains Deepfake Video Generation, Deepfake Image Generation, Voice Generation, Image Generation. A broader sensitivity adds Visual Art Generation, Image Retouching, Image Upscaling, Decensoring. Neither is asserted to be the unpublished category set behind “around half.” Secondary-purpose membership is a further sensitivity.
- The schema agent's record-level severity formulas and the chart agent's headline “Highest Direct Severity” text do not agree semantically. We retain both facts, do not force a field equivalence, and withhold direct-harm interpretations of the headline aggregate.
- The chart agent discovered dated and archived claims beyond the current dashboard. They are preserved with separate dispositions; current claims retain their current wording, especially the capability/robustness statement, which omits the archive's explicit “each year.”

Later verification findings and repairs are appended below.

## Independent in-session review → code 0.1.1 / definitions 2026-09-27.2

The original run `20260927T181437264435Z-fbdc9a5f21b9` and all original research/review artifacts are retained. The verifier reproduced all stored calculations, but correctly distinguished a replay's arithmetic from whether its definition answered the quoted claim. All review findings are accepted; publication remains undecided.

| Review IDs | Substantive resolution |
|---|---|
| IR-N01 | Added the omitted primary malicious-actors restriction to the archived people-harmed replay. Its illustrative 2023/2024 values change; the ambiguous parent status does not. |
| IR-M01 | Replayed the archived subdomain page's captured 2015–2025 scope explicitly. Other open-ended illustrative archive endpoints are pinned in configuration rather than drifting with future analysis dates. |
| IR-R01 | Count-only robustness tables show raw counts, count steps and absolute/relative changes. The preceding-year reversal is visible. |
| IR-C01 | Host preset years are strings; container IDs and dataset binding are included. This repairs the source-contract mismatch without claiming browser verification. |
| IR-U01 | Zero/missing-score exclusions are computed from each export over all thirteen dimensions/channels, rather than using baseline incident IDs. |
| IR-U02/U03 | Empty baselines, zero target counts, absent runner-up, ties/majorities and undated populations have explicit handling. Direction and scope wording is derived from results. |
| IR-U04 | Nonfinite/fractional/negative numeric count encodings and out-of-range aggregate/NatSec scores fail ingestion. Positive numeric predicates also guard against nonfinite values. |
| IR-U05 | Both count-comparison endpoints must meet the general minimum sample size; exploratory and candidate screens agree. |
| IR-U06 | Assignment-share API explicitly permits only a single any-label subdomain target. Composite assignment numerators are not implemented and fail validation. |
| IR-R02 | Pooled periods and channel comparisons have labels and displayed deltas; supported component checks retain their limited interpretations. |
| IR-R03 | HOME-06 has claim-specific components/revision; OVERVIEW-02's numeric-only support is visible in the summary; TIME-06 has a separate literal-universe counterexample check. |

Further reviewer suggestions were incorporated: severity-cutoff sensitivity appears in the candidate report, the primary-or-secondary purpose ranking's smaller eligibility margin is explicit, and the protocol distinguishes the 5-point same-record measurement-definition contrast from the 10-point distinct-group contrast. These are post-review clarifications/additions, not claimed pre-ranking commitments.

The core candidate numerical findings and the nineteen current empirical parent dispositions are expected to remain unchanged; the executed recheck and exact result differences are recorded separately in `review/reconciliation.md`. Regression counterexamples are in `tests/test_review_regressions.py`. Possible COMPAS overlap (#11/#40), missing report provenance, browser rendering, backend severity precedence and production classification accuracy remain unresolved.

## Fable 5.1 second review → code 0.2.0 / definitions 2026-09-27.3 / discovery 2026-09-27.v2.3

Three reviewers, three adversarial verifiers and a completeness critic (review/fable/workflow/) plus the coordinator's own oracle rechecked the corrected v1 run. No candidate or current-claim status was overturned; 42 findings and 10 verifier additions changed reasons, wording, disclosure and the recurring-workflow code. The full ledger is V2_CHANGELOG.md; V2_REVIEW.md records checks performed and not performed.

| Area | Substantive resolution |
|---|---|
| Public headline severity | Resolved empirically: `highest_severity` = 13-dimension maximum over direct, indirect and inferred scores; the deployed label “Highest Direct Severity Score” is inaccurate. All “unresolved precedence” statements replaced by one source-of-truth sentence (config/report_text.json). |
| Live mirror vs CSV | Same pipeline one sync apart (1 record absent, 10 reclassified). Published 5.7%/33% reproduce on an ID-prefix proxy of an April-2025 database; OVERVIEW-03 and HOME-01 carry a `discrepancy_explanation`. |
| Windows and partial years | TIME-04's window starts at the series trough (2022, 2.8%); IT-C002/TIME-02's starts at a local maximum (2021). Context years and labelled year-to-date rows are shown in reasons and robustness tables, never in website sentences (methodology item 3 retained). |
| Generated wording | Templates rewritten: monotone vs non-monotone branches, count direction for falling shares, subdomain labels instead of bare codes, singular rankings with runner-up and the pie's Other slice, exact EU tier values with a one-record-margin note, validation text naming the pilot's scope and models. |
| Late entry and backfill | Methodology item 2 keeps the ban on lag durations; `aiid_id` order bounds out-of-order entry under a stated, unverified assumption; composition of late entries differs by year (quality.json). |
| Zero-coded severity | 0 is stored distinct from blank, both treated as unknown; the two zero-coded records are named; the exporter's meaning of 0 is an open request. |
| Discovery stage | Data-driven shortlist over the ledger with deduplication, published/archived routing, EU-complement decisions, near-tautology withholding (95%), emergence rule with final-step no-reversal, weighted scoring without a novelty weight, coverage floor and caps; a same-population channel_contrast family enters the ledger; IT-C005's post-hoc 5-pp rule is disclosed. |
| Integrity | `verify` recomputes id-set content hashes, rejects unmanifested files, resolves evidence IDs and checks the LATEST_RUN.json manifest anchor; code fingerprint excludes review/ and documentation. |
| Ingestion hardening | Attributable errors, ASCII-only digits, canonical IDs ('01' = '1'), third-level codes rejected, blank domain derived from the primary code, `classified_at` stripped, duplicate severity categories rejected, field-named engine errors, deterministic cohort tie-break, UTF-8 reads everywhere. |
| Recurring workflow | `tracker compare`, `tracker refresh-claims`, `tracker generate-draft` (fake provider tested; Anthropic path unexecuted), `--dry-run`, `--previous-run`, rerun script that skips unchanged exports, scheduler template (not installed). |


## Maintenance 0.2.1 — September 27, 2026

Qualified current-label ID-prefix matches as historical hypotheses; removed claims that incident IDs establish calendar entry dates; clarified the direct/indirect ten-dimension severity mismatch. Counts and discovery rules are unchanged. The recurring runner verifies reused runs, detects definition changes, refreshes website claims even with unchanged CSV input, and propagates fetch and rejected-draft failures. Live LLM access and independent recurring model review remain separate requirements. This revision is session-assisted, not a repeat of Fable's multi-agent review.

## 0.3.0: operational and source verification

Added recorded official-CLI drafting and independent cross-model review; complete coverage, binding, numeric screening, failure history, and guarded response reuse. Added read-only dated CSV intake and a monthly check that refreshes live claims even when data is unchanged. Missing or unsuccessful review remains visible. Original export content is never changed.

Representative desktop interactions were tested in the in-app browser and native Safari. Corrected the domain-bar control inventory, prepared the misleading severity-label and ineffective preset fixes, and prepared independently checked replacement text for 19 published blocks. The public site was not modified.

Source checks verified ordinary ID assignment while retaining historical-date limitations, examined all 69 zero-coded cells, documented incident 1607's source-scope contamination, and recomputed all 2,305 measures with that record excluded. The main findings are unchanged. Current-model accuracy and exporter-specific undefined values remain external evidence requests.

See `COMPLETION_REPORT.md` and the recorded call statuses for actual live execution. CLI authentication is distinct from SDK environment variables. No claim that model agreement validates underlying incidents is made.

## 0.3.1: explicit resolution of rejected review suggestions

The second live model cycle completed all 30 review items, but its numeric gate rejected five replacement texts that used an implicitly dated day number or uncited context/model-label numbers. Raw responses and rejection states remain unchanged. A separate, verified editorial-resolution receipt records checked replacements, provenance, exact-evidence reuse, and a human-publication requirement. Current-run resolution is distinguished from a clean original model response; stale receipts cannot clear a new unresolved review.

## 0.4.0 / 2026-09-28

- Added declared descriptive profiles for the potential-causes diagram and national-security radar, including chart fit, complete numerator/denominator IDs, threshold and record-exclusion checks.
- Preserved comparison eligibility thresholds and the original eleven findings.
- Added an explicit legacy-schema comparison command and a ten-incident human-reference diagnostic; these are separate evidence, not substitutes for a same-pipeline monthly export or representative validation.
