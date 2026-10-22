# Candidate insights — human review edition

**Analysis date:** 2026-09-27. **Snapshot:** 1,698 distinct incident records. **Status:** Thirteen descriptive candidates, including two chart profiles. Earlier recorded model reviews cover the previous eleven-candidate version; these two additions were checked in the current session and await human selection.

Calculations are deterministic. Candidate selection, caveats and wording are preserved in code, configuration and prompts. All numerical evidence is in `calculations.json`, with numerator and denominator incident IDs in content-addressed `evidence/id_sets/` files.

The logged exploratory search screened 424 comparisons; 108 passed its numerical screen and 31 more are admitted to the discovery stage under the emergence rule. The five session templates are the audited baseline; the data-driven discovery stage proposes additional candidates with a full selection ledger. Neither is a significance ranking. See `selection_decisions.json`, `discovery_ledger.json`, `tables/search_ledger.csv`, and `inputs/methodology.md`.

## Read before using the charts

- Use the recorded incident date, not the classification timestamp or assumed report-submission date.
- Keep all primary categories visible for an all-incident percentage. Hiding legend categories changes the live percentage denominator.
- All Subdomains and Harm category proportions are assignment shares. An incident may contribute to several categories.
- The live mirror differs from this export. Chart configurations describe a compatible view, not an assertion that today's public chart already reproduces these numbers.
- 2026 is excluded from complete-year comparisons. All-record cross-sectional results retain the current-year and any undated records; missing dates are reported in quality.json.

## Current chart coverage

| Chart/surface | Candidates | Outcome |
| --- | --- | --- |
| TABLE: Supporting table (no faithful current chart) | IT-D002, IT-D003, IT-D004 | Findings whose definition no current aggregate chart can display faithfully; publish, if at all, with the supporting table. |
| C01: How are numbers of reported AI Incidents changing over time? | IT-C001 | Candidate(s) supplied; consult per-candidate compatibility (a supporting table may be required). |
| C02: Incident Timeline | IT-C001, IT-C002, IT-D006 | Candidate(s) supplied; consult per-candidate compatibility (a supporting table may be required). |
| C03: Incident Overview — Interactive Chart | IT-C003, IT-C004, IT-C005 | Candidate(s) supplied; consult per-candidate compatibility (a supporting table may be required). |
| C04: Incident Numbers by Risk Domain | IT-C004, IT-D001, IT-D005 | Candidate(s) supplied; consult per-candidate compatibility (a supporting table may be required). |
| V01: incident-view | None | Listing/reference surface, not an aggregate chart. Use for incident-level evidence review; see inventory for its controls and scope. |
| V02: natsec-incident-view | None | Listing/reference surface, not an aggregate chart. Use for incident-level evidence review; see inventory for its controls and scope. |
| C05: Harm Severity Radar / optional Severity Spider attachment | IT-C005 | Candidate(s) supplied; consult per-candidate compatibility (a supporting table may be required). |
| C06: Potential Causes — Ishikawa / Fishbone | IT-P001 | Candidate(s) supplied; consult per-candidate compatibility (a supporting table may be required). |
| C07: National Security Impact Profile | IT-P002 | Candidate(s) supplied; consult per-candidate compatibility (a supporting table may be required). |
| F01: harm-taxonomy | None | Framework definition, not an empirical chart; no incident finding applies. |
| F02: natsec-impact-framework | None | Framework definition, not an empirical chart; no incident finding applies. |

# Part 1 — retained session templates (audited baseline)

## C01

### IT-C001 — Complete-year incident record counts

**Finding.** The export contains 80 incident records dated 2021 and 452 dated 2025: +372 records (+465.0% relative change). Strict annual count increase over the stated complete-year window: True. Annual denominators are the full dated cohorts, not reports or exposed people.

**Review status:** `human_review_required`. **Selection stage:** `session_template`. **Eligibility:** `{"passed": true, "rule": "complete-year counts", "baseline_count": 80, "absolute_change": 372, "relative_change_pct": 465.0}`.

**Proposed website wording**

> As of the 27 September 2026 export, the number of incident records dated in each year rose every year from 80 (2021) to 452 (2025). These counts describe the database's recorded incidents and may reflect changes in reporting and coverage.

**Chart configuration**

- **Primary chart:** C01
- **Stacking category:** Domain (all seven domains visible)
- **Filters:** {}
- **Date range:** 2021-01-01 to 2025-12-31
- **Setting:** Counts; sum stacked domains for yearly record totals
- **Available controls:** Year ≥; no ordinary timeline maximum-year control
- **Programmatic preset:** {"year": ["2021", "2022", "2023", "2024", "2025"], "stackBy": "domain", "viewMode": "counts"}
- **Compatibility:** Counts and stacks are supported. A host/programmatic exact-year preset is needed to suppress the partial current year; the ordinary controls alone do not give this exact closed interval.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.
- **Container id:** incident-domain-chart
- **Dataset:** incidents-arcola

**Confidence in calculation:** High for the retained distinct-record counts and date parsing; not an estimate of new submissions, events or people.

**Confidence in interpretation:** Low for actual incident incidence or safety changes. Moderate as a description of this database snapshot.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- The preceding year is included as a robustness check; the five-year pattern must not be called a trend extending indefinitely backwards.
- ID-order diagnostic, not observed database-entry timing: 2021: 60/80 (75.0%) have an ID above the minimum ID associated with the following incident year; 2022: 32/108 (29.63%) have an ID above the minimum ID associated with the following incident year; 2023: 58/179 (32.4%) have an ID above the minimum ID associated with the following incident year; 2024: 85/304 (27.96%) have an ID above the minimum ID associated with the following incident year; 2025: 103/452 (22.79%) have an ID above the minimum ID associated with the following incident year.
- Recent-month record counts are: 2026 monthly counts to date 01=38, 02=30, 03=27, 04=25, 05=35, 06=22, 07=33, 08=12, 09=9; the current year is shown only as a labeled year-to-date row.
- Records aggregating several occurrences (number_of_occurrences > 1) in 2021–2025: 2021: 14, 2022: 15, 2023: 30, 2024: 46, 2025: 66; annual record counts are not event counts.

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| start one year later | 2022: 108 records → 2023: 179 records → 2024: 304 records → 2025: 452 records; endpoint +344 records; +318.5% relative change; strict annual count rise; count steps: 2022→2023 up, 2023→2024 up, 2024→2025 up |
| exclude latest complete year | 2021: 80 records → 2022: 108 records → 2023: 179 records → 2024: 304 records; endpoint +224 records; +280.0% relative change; strict annual count rise; count steps: 2021→2022 up, 2022→2023 up, 2023→2024 up |
| include prior year | 2020: 92 records → 2021: 80 records → 2022: 108 records → 2023: 179 records → 2024: 304 records → 2025: 452 records; endpoint +360 records; +391.3% relative change; count steps: 2020→2021 down, 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |
| drop probable duplicate #353 | no effect (0 records removed): 2021: 80 records → 2022: 108 records → 2023: 179 records → 2024: 304 records → 2025: 452 records; endpoint +372 records; +465.0% relative change; strict annual count rise; count steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |
| dominant model/prompt cohort (excludes 43 records; not a label validation) | 22 records removed: 2021: 80 records → 2022: 105 records → 2023: 170 records → 2024: 299 records → 2025: 447 records; endpoint +367 records; +458.8% relative change; strict annual count rise; count steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |
| 2026 year-to-date through 2026-09-27 (incomplete; not comparable with whole years) | 2026 to date: 231 records |

**Executable evidence:** ID `IT-C001`. All 30 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-C001`.

## C02

### IT-C002 — Capability/robustness shares and absolute counts

**Finding.** Primary subdomain 7.3 accounts for 33/80 (41.2%) of records dated 2021, versus 45/452 (10.0%) dated 2025: -31.29 percentage points. Counts change from 33 to 45 (+36.4%). The share direction is down; the count direction is up. Strict annual share decline: True.

**Review status:** `human_review_required`. **Selection stage:** `session_template`. **Eligibility:** `{"passed": true, "rule": "comparative share shift", "reasons": [], "endpoint_delta_pp": -31.29424778761062, "minimum_denominator": 50, "minimum_category_count": 10, "materiality_pp": 5.0}`.

**Proposed website wording**

> Among incident records dated 2021–2025, the share whose primary subdomain is ‘7.3 Lack of capability or robustness’ fell each year, from 33 of 80 (41.2%) in 2021 to 45 of 452 (10.0%) in 2025, while the number of such records rose from 33 to 45. The falling share reflects faster growth in other categories, chiefly 4.3 Fraud, scams, and targeted manipulation (189 of the 372 additional records dated 2025 versus 2021); it is not evidence that AI systems became more robust.

**Chart configuration**

- **Primary chart:** C02
- **Stacking category:** Primary Subdomain
- **Filters:** {}
- **Date range:** 2021-01-01 to 2025-12-31
- **Setting:** Proportions with all primary-subdomain legend series visible; Counts for the companion count view
- **Programmatic preset:** {"year": ["2021", "2022", "2023", "2024", "2025"], "stackBy": "subdomain", "viewMode": "proportion"}
- **Compatibility:** Primary shares are faithfully representable with an exact-year host preset. Do not filter to 7.3 or hide other subdomains: either changes the denominator. All Subdomains proportions display assignment shares, not the any-label incident percentages used in sensitivity analysis.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.
- **Container id:** main-chart
- **Dataset:** incidents-arcola

**Confidence in calculation:** High for primary/any-label counting and exact annual comparisons in the export.

**Confidence in interpretation:** Moderate for a compositional database statement; low for any claim that robustness has improved or failures have become rarer.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- Additional risk tags answer a different question from the primary tag. Within-domain percentages and assignment shares are different denominators, not replacements for the all-record headline.
- Growing counts in other categories can reduce this share while the capability/robustness count rises; the excluding-domain-4 row is a sensitivity, not a decomposition, because other domains also grew.
- The 2021 starting point is a local maximum of the longer series (see the 'include prior years' context in facts.json annual.sub7.3.primary); the 2026 year-to-date row is context only and is never compared with whole years in the website text.
- ID-ordered subsets have these shares (2025: 8.4% of the lower-ID half versus 11.5% of the higher-ID half; 2026 to date: 12.1% versus 25.2%). Without database-entry timestamps or historical exports, these differences do not establish backfill or predict future revisions. The one preserved probable same-event pair (#230/#353) received different primary subdomains (7.3 vs 5.1).

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| any-label incident denominator | 2021: 53/80 (66.2%) → 2022: 62/108 (57.4%) → 2023: 72/179 (40.2%) → 2024: 108/304 (35.5%) → 2025: 121/452 (26.8%); endpoint -39.48 pp; strict annual share decline; strict annual count rise; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| any-label assignment denominator (different estimand) | -1210 records removed: 2021: 53/171 (31.0%) → 2022: 62/225 (27.6%) → 2023: 72/382 (18.8%) → 2024: 108/656 (16.5%) → 2025: 121/899 (13.5%); endpoint -17.53 pp; strict annual share decline; strict annual count rise; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| known primary classification only — no effect (0 records removed in this export) | no effect (0 records removed): 2021: 33/80 (41.2%) → 2022: 33/108 (30.6%) → 2023: 37/179 (20.7%) → 2024: 44/304 (14.5%) → 2025: 45/452 (10.0%); endpoint -31.29 pp; strict annual share decline; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| within primary domain 7 (different denominator) | 927 records removed: 2021: 33/35 (94.3%) → 2022: 33/34 (97.1%) → 2023: 37/38 (97.4%) → 2024: 44/44 (100.0%) → 2025: 45/45 (100.0%); endpoint +5.71 pp; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 flat |
| start one year later | 2022: 33/108 (30.6%) → 2023: 37/179 (20.7%) → 2024: 44/304 (14.5%) → 2025: 45/452 (10.0%); endpoint -20.60 pp; strict annual share decline; strict annual count rise; steps: 2022→2023 down, 2023→2024 down, 2024→2025 down |
| exclude latest complete year | 2021: 33/80 (41.2%) → 2022: 33/108 (30.6%) → 2023: 37/179 (20.7%) → 2024: 44/304 (14.5%); endpoint -26.78 pp; strict annual share decline; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down |
| dominant model/prompt cohort (excludes 43 records; not a label validation) | 22 records removed: 2021: 33/80 (41.2%) → 2022: 33/105 (31.4%) → 2023: 34/170 (20.0%) → 2024: 43/299 (14.4%) → 2025: 45/447 (10.1%); endpoint -31.18 pp; strict annual share decline; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| drop probable duplicate #353 — no effect (0 records removed in this export) | no effect (0 records removed): 2021: 33/80 (41.2%) → 2022: 33/108 (30.6%) → 2023: 37/179 (20.7%) → 2024: 44/304 (14.5%) → 2025: 45/452 (10.0%); endpoint -31.29 pp; strict annual share decline; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| reported direct/indirect severity ≥2 (ten dimensions) | 232 records removed: 2021: 20/67 (29.9%) → 2022: 22/80 (27.5%) → 2023: 19/131 (14.5%) → 2024: 25/250 (10.0%) → 2025: 21/363 (5.8%); endpoint -24.07 pp; strict annual share decline; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| all-channel severity ≥2 (thirteen dimensions) | 81 records removed: 2021: 26/73 (35.6%) → 2022: 25/95 (26.3%) → 2023: 27/165 (16.4%) → 2024: 35/284 (12.3%) → 2025: 33/425 (7.8%); endpoint -27.85 pp; strict annual share decline; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| excluding records primarily in domain 4 (sensitivity to the fraud/malicious-actor surge; not a decomposition) | 506 records removed: 2021: 33/74 (44.6%) → 2022: 33/87 (37.9%) → 2023: 37/113 (32.7%) → 2024: 44/146 (30.1%) → 2025: 45/197 (22.8%); endpoint -21.75 pp; strict annual share decline; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| 2026 year-to-date through 2026-09-27 (incomplete; context only, not a trend point) | 2026 to date: 43/231 (18.6%) |
| share of 2021→2025 record growth by primary subdomain (derived from the annual counts; top five) | total growth +372 records; 4.3: 3→192 (+189, 50.81% of growth); 3.1: 1→63 (+62, 16.67% of growth); 4.1: 3→54 (+51, 13.71% of growth); 5.1: 3→26 (+23, 6.18% of growth); 1.2: 10→27 (+17, 4.57% of growth) |
| pooled first two versus last two years | 2021–2022: 66/188 (35.1%) → 2024–2025: 89/756 (11.8%); change -23.33 pp |

**Executable evidence:** ID `IT-C002`. All 105 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-C002`.

## C03

### IT-C003 — Deepfake Video Generation is the largest primary-purpose category

**Finding.** Across all export records, Deepfake Video Generation has 316/1,698 (18.6%) versus Chatbot with 181/1,698 (10.7%); the lead is 7.95 percentage points. This is a plurality, not a majority, of incident records.

**Review status:** `human_review_required`. **Selection stage:** `session_template`. **Eligibility:** `{"passed": true, "rule": "ranking winner ≥50 and lead ≥5 percentage points", "winner_count": 316, "lead_pp": 7.9505300353356905}`.

**Proposed website wording**

> ‘Deepfake Video Generation’ is the most frequent single primary-purpose tag, assigned to 316 of 1,698 incident records (18.6%), followed by ‘Chatbot’ (181, 10.7%). The chart's ‘Other’ slice groups the tail beyond the 15 named purposes (394 records here) and is larger than any single named category.

**Chart configuration**

- **Primary chart:** C03
- **Stacking category:** AI Purpose (primary)
- **Filters:** {}
- **Date range:** All dates in this export; includes the incomplete current year as snapshot composition
- **Setting:** Pie proportions; keep all slices, including Other, visible; counts in tooltip
- **Programmatic preset:** {"stackBy": "aiGoal"}
- **Compatibility:** Representable. The API presents named leading categories plus Other; Other is an aggregation, not a competing single purpose. Chart numbers will differ until the mirror uses this export.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.
- **Container id:** main-chart
- **Dataset:** incidents-arcola

**Confidence in calculation:** High for the primary-purpose ranking; alternate purposes are counted separately.

**Confidence in interpretation:** Moderate for the retained tag ranking; low for which AI applications are intrinsically riskiest.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- Classifier-defined purpose categories are not equal-sized exposure groups. A leading incident count does not imply the highest risk per use.
- Purpose labels do not establish whether every implicated system actually used generative AI as described.
- Illustrative lumpings (analyst-defined, not the displayed taxonomy): an assistant family of Chatbot 181 + Writing Assistant 122 + Question Answering 26 + Code Generation 33 = 362; a synthetic-media family of Deepfake Video Generation 316 + Deepfake Image Generation 135 + Voice Generation 105 = 556. The ranking describes the taxonomy as displayed, whose granularity is asymmetric.
- The exploratory ledger screens rankings on records dated through the last complete year; this candidate ranks all dates (both windows are shown in the robustness table).

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| all dates | Deepfake Video Generation: 316/1,698 (18.6%); Chatbot: 181/1,698 (10.7%); Deepfake Image Generation: 135/1,698 (8.0%); Writing Assistant: 122/1,698 (7.2%); Autonomous Driving: 115/1,698 (6.8%) |
| complete years only | 231 records removed: Deepfake Video Generation: 274/1,467 (18.7%); Chatbot: 155/1,467 (10.6%); Deepfake Image Generation: 102/1,467 (7.0%); Writing Assistant: 101/1,467 (6.9%); Autonomous Driving: 99/1,467 (6.7%) |
| recent complete years | 575 records removed: Deepfake Video Generation: 265/1,123 (23.6%); Chatbot: 145/1,123 (12.9%); Deepfake Image Generation: 98/1,123 (8.7%); Writing Assistant: 95/1,123 (8.5%); Voice Generation: 90/1,123 (8.0%) |
| dominant model/prompt cohort (excludes 43 records; not a label validation) | 43 records removed: Deepfake Video Generation: 309/1,655 (18.7%); Chatbot: 178/1,655 (10.8%); Deepfake Image Generation: 131/1,655 (7.9%); Writing Assistant: 119/1,655 (7.2%); Autonomous Driving: 114/1,655 (6.9%) |
| drop probable duplicate #353 | 1 records removed: Deepfake Video Generation: 316/1,697 (18.6%); Chatbot: 181/1,697 (10.7%); Deepfake Image Generation: 135/1,697 (8.0%); Writing Assistant: 122/1,697 (7.2%); Autonomous Driving: 114/1,697 (6.7%) |
| known primary purpose only — no effect (0 records removed in this export) | no effect (0 records removed): Deepfake Video Generation: 316/1,698 (18.6%); Chatbot: 181/1,698 (10.7%); Deepfake Image Generation: 135/1,698 (8.0%); Writing Assistant: 122/1,698 (7.2%); Autonomous Driving: 115/1,698 (6.8%) |
| 2026 year-to-date (incomplete; context only) | 1467 records removed: Deepfake Video Generation: 42/231 (18.2%); Deepfake Image Generation: 33/231 (14.3%); Chatbot: 26/231 (11.3%); Writing Assistant: 21/231 (9.1%); Autonomous Driving: 16/231 (6.9%) |
| primary or secondary purpose (different estimand) | Deepfake Video Generation: 364/1,698 (21.4%); Voice Generation: 329/1,698 (19.4%); Chatbot: 223/1,698 (13.1%); lead 2.06 pp; same ranking-margin screen passes: False |

**Executable evidence:** ID `IT-C003`. All 38 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-C003`.

## C04

### IT-C004 — Fraud/scams within the primary malicious-actors domain

**Finding.** Among records dated 2016–2025 with primary domain 4 Malicious actors, 368/535 (68.8%) have primary subdomain 4.3 Fraud, scams and targeted manipulation.

**Review status:** `human_review_required`. **Selection stage:** `session_template`. **Eligibility:** `{"passed": true, "rule": "within-domain concentration", "minimum_denominator": 50, "minimum_share_pct": 50.0}`.

**Proposed website wording**

> Of the incident records dated 2016–2025 primarily classified as ‘4 Malicious actors’, 368 of 535 (68.8%) have primary subdomain ‘4.3 Fraud, scams and targeted manipulation’. Pooled, the within-domain 4.3 share was 71/122 (58.2%) for 2016–2023 and 297/413 (71.9%) for 2024–2025, which supply 413 of the 535 records.

**Chart configuration**

- **Primary chart:** C04
- **Stacking category:** Primary Subdomain
- **Filters:** {"domain": ["4 Malicious actors"], "year": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]}
- **Date range:** 2016-01-01 to 2025-12-31
- **Setting:** Counts (visible chart default); the percentage is derived from the domain total. A host preset can use proportions, but C04 has no visible toggle.
- **Programmatic preset:** {"year": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"], "domain": "4 Malicious actors", "stackBy": "subdomain", "viewMode": "counts"}
- **Compatibility:** Representable as the primary-subdomain segment count over the domain total. Select the exact Year values via the bar chart's verified Year control. Alternative C03 pie: same filters, Primary Subdomain; all slices visible.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.
- **Container id:** main-chart-2
- **Dataset:** incidents-arcola

**Confidence in calculation:** High for the explicitly primary, closed-window numerator and denominator.

**Confidence in interpretation:** Moderate for category composition; low for the prevalence or absolute frequency of real-world malicious AI use.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- This conditional share is within domain 4, not across all incidents. Additional-domain membership changes the population.
- The default bar includes the current partial year; exact Year selection is needed for this candidate's window.
- Pooled, the within-domain 4.3 share was 71/122 (58.2%) for 2016–2023 and 297/413 (71.9%) for 2024–2025, which supply 413 of the 535 records; annual cells before 2022 hold few records and are not quoted as a range.
- The exploratory ledger screens concentrations on records dated through the last complete year without the 2016 floor; this candidate uses the bar chart's 2016 floor (both values appear in the robustness table).

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| all dates (includes incomplete current year) | -106 records removed: 440/641 (68.6%) |
| recent complete years | 29 records removed: 351/506 (69.4%) |
| any subdomain within primary domain | 404/535 (75.5%) |
| any-domain and any-subdomain memberships (different population) | -86 records removed: 468/621 (75.4%) |
| drop probable duplicate #353 — no effect (0 records removed in this export) | no effect (0 records removed): 368/535 (68.8%) |
| dominant model/prompt cohort (excludes 43 records; not a label validation) | 12 records removed: 359/523 (68.6%) |
| known primary subdomain only — no effect (0 records removed in this export) | no effect (0 records removed): 368/535 (68.8%) |
| pooled 2016–2023 (earlier part of the window) | 413 records removed: 71/122 (58.2%) |
| pooled 2024–2025 (latest two complete years) | 122 records removed: 297/413 (71.9%) |
| 2026 year-to-date (incomplete; context only) | 431 records removed: 70/104 (67.3%) |

**Executable evidence:** ID `IT-C004`. All 11 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-C004`.

## C05

### IT-C005 — Severe-score counts with and without model inference

**Finding.** Across the original ten harm dimensions, 148/1,698 (8.7%) of records have an observed direct or indirect severity score ≥4. With inferred scores included, the count is 286/1,698 (16.8%): 138 additional records and 8.13 percentage points. This is a measurement-definition comparison, not evidence that those inferred severe harms occurred. 286 equals the export's highest_severity_10 ≥4; 148 corresponds to no exported scalar or public control. The export's 13-dimension all-channel highest_severity reaches ≥4 for 376 records, 265 of them (70.5%) without any direct score ≥4 and 199 (52.9%) without any direct or indirect score ≥4; overall the headline exceeds the highest direct score for 782/1,698 (46.1%) of records. If the deployed headline equals this field, as the live probes indicate, its label ‘Highest Direct Severity Score’ is wrong for those records.

**Review status:** `human_review_required`. **Selection stage:** `session_template`. **Eligibility:** `{"passed": true, "rule": "same-population measurement-definition contrast (5 pp share-shift rule)", "reasons": [], "endpoint_delta_pp": 8.12720848056537, "minimum_denominator": 50, "minimum_category_count": 10, "materiality_pp": 5.0, "disclosure": "The 5-pp same-population rule was clarified in definitions 2026-09-27.2 after this candidate existed; this comparison was not a cell of the v1 exploratory ledger. A same-population channel_contrast family was added to the ledger in v2 (definitions 2026-09-27.3)."}`.

**Proposed website wording**

> Severity summaries depend on the evidence channel. In the original ten harm categories, 148 of 1,698 records (8.7%) have a direct or indirect score of at least 4; 286 (16.8%) meet that threshold when model-inferred scores are included. Inferred scores require further investigation.

**Chart configuration**

- **Primary chart:** C05 (incident-level inspection); supporting severity sensitivity table for the aggregate finding
- **Stacking category:** No current grouping separates direct/indirect from inferred maxima
- **Filters:** {}
- **Date range:** All dates in the export, including partial current year; snapshot measurement comparison
- **Setting:** Counts and proportions in the supplied supporting table, not a live aggregate chart setting
- **Compatibility:** Cannot portray this comparison faithfully in the current aggregate controls. The export's highest_severity is the maximum across thirteen dimensions and direct, indirect, and inferred channels. The public highestSeverityScore uses a broad aggregate too: the incident detail's direct-only label is misleading. The live mirror can assign different scores and labels to the same records. Representative interactive checks in the in-app browser and Safari reproduced the label problem and ineffective timeline severe-harm preset. No global classification accuracy is established. On this export the headline field would show 376/1,698 (22.1%) at ≥4, not 148 or 286. C05 plots direct and indirect scores for one incident and omits an inferred numeric series. Do not publish using the severe-harm preset (it sends an ignored minSeverity key; the effective key minSeverityHighest selects on the inferred-inclusive headline) or relabel highest_severity as direct.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.

**Confidence in calculation:** High for the observed score thresholds and channel maxima. The 2 zero-coded records (#413, #1607) and 0 blank-cell records have explicit bounds and an exclusion sensitivity; whether a zero score means 'not assessed' or 'no harm' is unresolved with the exporter.

**Confidence in interpretation:** High that channel choice changes the retained score count; low that inferred scores verify realized harm severity.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- The published rubric defines the original ten dimensions. Psychological, epistemic and CSEA dimensions are reported separately as a thirteen-dimension sensitivity.
- Direct/indirect denotes explicitly reported causal pathways in app definitions; inferred means model-imputed, not an additional independently documented harm count.
- Thresholds are ordinal. Level 1 includes none through minor harm; scores and counts are not summed into a burden-of-harm metric.

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| 10 dimensions / direct / observed scores (lower bound) | 90/1,698 (5.3%) |
| 10 dimensions / direct / upper bound (treats zero-coded or blank components as possibly ≥4) | 92/1,698 (5.4%) |
| 10 dimensions / direct+indirect / observed scores (lower bound) | 148/1,698 (8.7%) |
| 10 dimensions / direct+indirect / upper bound (treats zero-coded or blank components as possibly ≥4) | 150/1,698 (8.8%) |
| 10 dimensions / direct+indirect+inferred / observed scores (lower bound) | 286/1,698 (16.8%) |
| 10 dimensions / direct+indirect+inferred / upper bound (treats zero-coded or blank components as possibly ≥4) | 288/1,698 (17.0%) |
| 13 dimensions / direct / observed scores (lower bound) | 111/1,698 (6.5%) |
| 13 dimensions / direct / upper bound (treats zero-coded or blank components as possibly ≥4) | 113/1,698 (6.7%) |
| 13 dimensions / direct+indirect / observed scores (lower bound) | 177/1,698 (10.4%) |
| 13 dimensions / direct+indirect / upper bound (treats zero-coded or blank components as possibly ≥4) | 179/1,698 (10.5%) |
| 13 dimensions / direct+indirect+inferred / observed scores (lower bound) | 376/1,698 (22.1%) |
| 13 dimensions / direct+indirect+inferred / upper bound (treats zero-coded or blank components as possibly ≥4) | 378/1,698 (22.3%) |
| exclude records with any zero-coded or blank component (13 dimensions, all channels; recalculated per export: 2 zero-coded, 0 blank) | direct+indirect: 148/1,696 (8.7%) → direct+indirect+inferred: 286/1,696 (16.9%); change +8.14 pp |
| complete years only | direct+indirect: 138/1,467 (9.4%) → direct+indirect+inferred: 271/1,467 (18.5%); change +9.07 pp |
| dominant model/prompt cohort (excludes 43 records; not a label validation) | direct+indirect: 145/1,655 (8.8%) → direct+indirect+inferred: 281/1,655 (17.0%); change +8.22 pp |
| Alternative cutoff ≥2, original ten dimensions (different question) | direct+indirect: 1,334/1,698 (78.6%) → direct+indirect+inferred: 1,447/1,698 (85.2%); change +6.65 pp; numerical candidate screen passes: True |
| Alternative cutoff ≥3, original ten dimensions (different question) | direct+indirect: 499/1,698 (29.4%) → direct+indirect+inferred: 764/1,698 (45.0%); change +15.61 pp; numerical candidate screen passes: True |
| Alternative cutoff ≥5, original ten dimensions (different question) | direct+indirect: 7/1,698 (0.4%) → direct+indirect+inferred: 19/1,698 (1.1%); change +0.71 pp; numerical candidate screen passes: False |
| what the export's public scalars express (context for the chart label) | highest_severity_10 ≥4 (10 dimensions, all channels incl. inferred): 286/1,698 (16.8%) → highest_severity ≥4 (13 dimensions, all channels incl. inferred) — the public headline field: 376/1,698 (22.1%) → 13 dimensions, direct only ≥4: 111/1,698 (6.5%) → 13 dimensions, direct or indirect ≥4: 177/1,698 (10.4%) → records whose headline exceeds their highest direct score (any level): 782/1,698 (46.1%) |

**Executable evidence:** ID `IT-C005`. All 30 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-C005`.

# Part 2 — data-driven discovery candidates (v2)

Selected by the declared discovery stage from the exploratory ledger; all texts are templated from calculations and require human review.

## C02

### IT-D006 — 3.1 False or misleading information: primary share rose 2021→2025

**Finding.** Among records dated 2021, the share of records primarily classified as ‘3.1 False or misleading information’ was 1/80 (1.2%); among records dated 2025 it was 63/452 (13.9%): +12.69 percentage points. Counts changed from 1 to 63 (+6200.0%). Annual steps: 2021→2022 up, 2022→2023 up, 2023→2024 down, 2024→2025 up. This category had fewer than 10 records in 2021 (1); the finding is admitted under the v2 emergence rule and describes where it stands in 2025, not a per-year rate. These are shares of database records, not measures of underlying risk or of AI safety.

**Review status:** `human_review_required`. **Selection stage:** `data_driven_discovery`. **Eligibility:** `{"passed": true, "rule": "comparative share shift (explore.py screen) + discovery stability floor", "endpoint_delta_pp": 12.688053097345133, "stability": 0.8, "minimum_stability": 0.6, "search_id": "SEARCH-024a0a6e19ad", "merged_sensitivities": [{"search_id": "SEARCH-980d01de6725", "name": "any:3.1", "delta_pp": 34.966814159292035, "score": 0.895}]}`.

**Proposed website wording**

> In this export, the share of records primarily classified as ‘3.1 False or misleading information’ rose from 1/80 (1.2%) in 2021 to 63/452 (13.9%) in 2025. The figures describe recorded incident classifications and may reflect changes in reporting and coverage.

**Chart configuration**

- **Primary chart:** C02
- **Stacking category:** Primary Subdomain
- **Filters:** {}
- **Date range:** 2021-01-01 to 2025-12-31
- **Setting:** Proportions with all legend series visible; Counts for the companion count view
- **Programmatic preset:** {"year": ["2021", "2022", "2023", "2024", "2025"], "stackBy": "subdomain", "viewMode": "proportion"}
- **Compatibility:** Representable as a primary-subdomain share with an exact-year host preset; do not filter to the subdomain or hide other series.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.
- **Container id:** main-chart
- **Dataset:** incidents-arcola

**Confidence in calculation:** High for the exported classifications and exact annual comparisons in this export.

**Confidence in interpretation:** Moderate as a description of database composition; low for any claim about real-world incidence, risk or safety.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- Selected by the data-driven discovery stage (score 0.710: effect 0.51, support 0.64, stability 0.80, chart_fit 1.00). Scores rank descriptive stability and chart usefulness; they are not significance tests.
- Shares are compositional: a category's share can fall while its count rises when other categories grow faster.
- Additional (non-primary) tags answer a different question from the primary tag; assignment shares are a third quantity.
- The partial current year is shown as context only; recently dated records may still be added or reclassified, so it is not a trend point.

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| start one year later | 2022: 9/108 (8.3%) → 2023: 21/179 (11.7%) → 2024: 32/304 (10.5%) → 2025: 63/452 (13.9%); endpoint +5.60 pp; strict annual count rise; steps: 2022→2023 up, 2023→2024 down, 2024→2025 up |
| exclude latest complete year | 2021: 1/80 (1.2%) → 2022: 9/108 (8.3%) → 2023: 21/179 (11.7%) → 2024: 32/304 (10.5%); endpoint +9.28 pp; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 down |
| drop probable duplicate #353 | 2021: 1/80 (1.2%) → 2022: 9/108 (8.3%) → 2023: 21/179 (11.7%) → 2024: 32/304 (10.5%) → 2025: 63/452 (13.9%); endpoint +12.69 pp; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 down, 2024→2025 up |
| common classifier/prompt cohort | 2021: 1/80 (1.2%) → 2022: 9/105 (8.6%) → 2023: 20/170 (11.8%) → 2024: 32/299 (10.7%) → 2025: 60/447 (13.4%); endpoint +12.17 pp; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 down, 2024→2025 up |
| every annual step in the same direction | 2021: 1/80 (1.2%) → 2022: 9/108 (8.3%) → 2023: 21/179 (11.7%) → 2024: 32/304 (10.5%) → 2025: 63/452 (13.9%); endpoint +12.69 pp; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 down, 2024→2025 up |
| emergence rule: preceding year already shows the shift and the final annual step does not reverse it | 2021: 1/80 (1.2%) → 2022: 9/108 (8.3%) → 2023: 21/179 (11.7%) → 2024: 32/304 (10.5%) → 2025: 63/452 (13.9%); endpoint +12.69 pp; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 down, 2024→2025 up |
| partial 2026 to date (context only; not a full-year comparison) | 23/231 (10.0%) |

**Executable evidence:** ID `IT-D006`. All 24 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-D006`.

## C04

### IT-D001 — 3.1 False or misleading information within primary 3 Misinformation

**Finding.** Among records dated through 2025 with primary domain ‘3 Misinformation’, 128/141 (90.8%) have primary subdomain ‘3.1 False or misleading information’. This conditional share is within the domain, not across all incidents.

**Review status:** `human_review_required`. **Selection stage:** `data_driven_discovery`. **Eligibility:** `{"passed": true, "rule": "within-domain concentration (explore.py screen)", "stability": 1.0, "search_id": "SEARCH-concentration-3", "merged_sensitivities": []}`.

**Proposed website wording**

> Of the records dated through 2025 primarily classified as ‘3 Misinformation’, 128/141 (90.8%) have primary subdomain ‘3.1 False or misleading information’.

**Chart configuration**

- **Primary chart:** C04
- **Stacking category:** Primary Subdomain
- **Filters:** {"domain": ["3 Misinformation"], "year": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]}
- **Date range:** 2016-01-01 to 2025-12-31 on the bar chart (2016 floor); the headline uses all complete years
- **Setting:** Counts (visible default); percentage derived from the domain total
- **Programmatic preset:** {"year": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"], "domain": "3 Misinformation", "stackBy": "subdomain", "viewMode": "counts"}
- **Compatibility:** The bar chart cannot show pre-2016 records; see the '2016 floor' robustness row for the chart-window value.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.
- **Container id:** main-chart-2
- **Dataset:** incidents-arcola

**Confidence in calculation:** High for the explicitly primary numerator and denominator.

**Confidence in interpretation:** Moderate for category composition; low for the prevalence of real-world events.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- Selected by the data-driven discovery stage (score 0.930: effect 0.82, support 1.00, stability 1.00, chart_fit 0.90). Scores rank descriptive stability and chart usefulness; they are not significance tests.
- A high within-domain concentration can reflect how the classifier uses the taxonomy's subdomains (some subdomains are rarely assigned), not only what happened.

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| all dates (includes incomplete current year) | 151/165 (91.5%) |
| 2016 floor to latest complete year (bar-chart window) | 127/140 (90.7%) |
| recent complete years | 126/135 (93.3%) |
| drop probable duplicate #353 | 128/141 (90.8%) |
| common classifier/prompt cohort | 124/137 (90.5%) |
| any 3.1 membership (primary or additional) within primary domain | 129/141 (91.5%) |
| partial 2026 to date (context only; not comparable) | 23/24 (95.8%) |

**Executable evidence:** ID `IT-D001`. All 8 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-D001`.

### IT-D005 — 5.1 Overreliance and unsafe use within primary 5 Human-Computer Interaction

**Finding.** Among records dated through 2025 with primary domain ‘5 Human-Computer Interaction’, 53/60 (88.3%) have primary subdomain ‘5.1 Overreliance and unsafe use’. This conditional share is within the domain, not across all incidents.

**Review status:** `human_review_required`. **Selection stage:** `data_driven_discovery`. **Eligibility:** `{"passed": true, "rule": "within-domain concentration (explore.py screen)", "stability": 1.0, "search_id": "SEARCH-concentration-5", "merged_sensitivities": []}`.

**Proposed website wording**

> Of the records dated through 2025 primarily classified as ‘5 Human-Computer Interaction’, 53/60 (88.3%) have primary subdomain ‘5.1 Overreliance and unsafe use’.

**Chart configuration**

- **Primary chart:** C04
- **Stacking category:** Primary Subdomain
- **Filters:** {"domain": ["5 Human-Computer Interaction"], "year": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]}
- **Date range:** 2016-01-01 to 2025-12-31 on the bar chart (2016 floor); the headline uses all complete years
- **Setting:** Counts (visible default); percentage derived from the domain total
- **Programmatic preset:** {"year": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"], "domain": "5 Human-Computer Interaction", "stackBy": "subdomain", "viewMode": "counts"}
- **Compatibility:** The bar chart cannot show pre-2016 records; see the '2016 floor' robustness row for the chart-window value.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.
- **Container id:** main-chart-2
- **Dataset:** incidents-arcola

**Confidence in calculation:** High for the explicitly primary numerator and denominator.

**Confidence in interpretation:** Moderate for category composition; low for the prevalence of real-world events.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- Selected by the data-driven discovery stage (score 0.821: effect 0.77, support 0.53, stability 1.00, chart_fit 0.90). Scores rank descriptive stability and chart usefulness; they are not significance tests.
- A high within-domain concentration can reflect how the classifier uses the taxonomy's subdomains (some subdomains are rarely assigned), not only what happened.

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| all dates (includes incomplete current year) | 61/69 (88.4%) |
| 2016 floor to latest complete year (bar-chart window) | 52/56 (92.9%) |
| recent complete years | 42/43 (97.7%) |
| drop probable duplicate #353 | 52/59 (88.1%) |
| common classifier/prompt cohort | 53/60 (88.3%) |
| any 5.1 membership (primary or additional) within primary domain | 53/60 (88.3%) |
| partial 2026 to date (context only; not comparable) | 8/9 (88.9%) |

**Executable evidence:** ID `IT-D005`. All 8 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-D005`.

## Supporting table only (no faithful current chart)

### IT-D002 — Severity-threshold share fell 2021→2025

**Finding.** Among records dated 2021, the share of records with a reported direct/indirect severity score ≥3 in any of the original ten harm categories was 35/80 (43.8%); among records dated 2025 it was 90/452 (19.9%): -23.84 percentage points. Counts changed from 35 to 90 (+157.1%). Every annual step moved in the same direction. These are shares of database records, not measures of underlying risk or of AI safety.

**Review status:** `human_review_required`. **Selection stage:** `data_driven_discovery`. **Eligibility:** `{"passed": true, "rule": "comparative share shift (explore.py screen) + discovery stability floor", "endpoint_delta_pp": -23.838495575221238, "stability": 1.0, "minimum_stability": 0.6, "search_id": "SEARCH-2613ebf99dae", "merged_sensitivities": [{"search_id": "SEARCH-dc2890087d4e", "name": "10:direct+indirect+inferred:3", "delta_pp": -29.01548672566372, "score": 0.84}, {"search_id": "SEARCH-8a584124a8e5", "name": "10:direct:3", "delta_pp": -16.061946902654867, "score": 0.7767}, {"search_id": "SEARCH-167fe49df85b", "name": "13:direct+indirect:3", "delta_pp": -19.258849557522122, "score": 0.7711}, {"search_id": "SEARCH-9ef643224b58", "name": "13:direct:3", "delta_pp": -15.752212389380531, "score": 0.659}, {"search_id": "SEARCH-e9e0de5056ae", "name": "13:direct+indirect+inferred:3", "delta_pp": -12.488938053097343, "score": 0.5499}, {"search_id": "SEARCH-e903f7c92950", "name": "13:direct+indirect+inferred:4", "delta_pp": -9.225663716814159, "score": 0.5367}, {"search_id": "SEARCH-2c958989ae6c", "name": "10:direct+indirect+inferred:4", "delta_pp": -10.70796460176991, "score": 0.5145}]}`.

**Proposed website wording**

> In this export, the share of records with a reported direct/indirect severity score ≥3 in any of the original ten harm categories fell from 35/80 (43.8%) in 2021 to 90/452 (19.9%) in 2025. It moved in the same direction in every intervening year. The figures describe recorded incident classifications and may reflect changes in reporting and coverage.

**Chart configuration** (no faithful current chart; supporting table)

- **Primary chart:** Supporting table (no faithful aggregate chart)
- **Stacking category:** No aggregate grouping matches direct/indirect scores across the original ten harm dimensions
- **Filters:** {}
- **Date range:** 2021-01-01 to 2025-12-31
- **Setting:** Counts and proportions in the supporting table
- **Compatibility:** Use a supporting table: this calculation uses direct/indirect scores in ten dimensions; the public headline includes inferred scores across thirteen dimensions.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.

**Confidence in calculation:** High for the exported classifications and exact annual comparisons in this export.

**Confidence in interpretation:** Moderate as a description of database composition; low for any claim about real-world incidence, risk or safety.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- Selected by the data-driven discovery stage (score 0.896: effect 0.95, support 1.00, stability 1.00, chart_fit 0.40). Scores rank descriptive stability and chart usefulness; they are not significance tests.
- Shares are compositional: a category's share can fall while its count rises when other categories grow faster.
- Additional (non-primary) tags answer a different question from the primary tag; assignment shares are a third quantity.
- The partial current year is shown as context only; recently dated records may still be added or reclassified, so it is not a trend point.
- Severity scores are ordinal LLM annotations under the published ten-category rubric; level 1 spans none to minor harm, and zero/missing components are unknown, not proof of no harm.
- Inferred (model-imputed) scores are excluded from this direct/indirect definition; the thirteen-dimension and inferred-inclusive variants are listed as merged sensitivities.

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| start one year later | 2022: 36/108 (33.3%) → 2023: 53/179 (29.6%) → 2024: 86/304 (28.3%) → 2025: 90/452 (19.9%); endpoint -13.42 pp; strict annual share decline; strict annual count rise; steps: 2022→2023 down, 2023→2024 down, 2024→2025 down |
| exclude latest complete year | 2021: 35/80 (43.8%) → 2022: 36/108 (33.3%) → 2023: 53/179 (29.6%) → 2024: 86/304 (28.3%); endpoint -15.46 pp; strict annual share decline; strict annual count rise; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down |
| drop probable duplicate #353 | 2021: 35/80 (43.8%) → 2022: 36/108 (33.3%) → 2023: 53/179 (29.6%) → 2024: 86/304 (28.3%) → 2025: 90/452 (19.9%); endpoint -23.84 pp; strict annual share decline; strict annual count rise; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| common classifier/prompt cohort | 2021: 35/80 (43.8%) → 2022: 34/105 (32.4%) → 2023: 51/170 (30.0%) → 2024: 84/299 (28.1%) → 2025: 88/447 (19.7%); endpoint -24.06 pp; strict annual share decline; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| every annual step in the same direction | 2021: 35/80 (43.8%) → 2022: 36/108 (33.3%) → 2023: 53/179 (29.6%) → 2024: 86/304 (28.3%) → 2025: 90/452 (19.9%); endpoint -23.84 pp; strict annual share decline; strict annual count rise; steps: 2021→2022 down, 2022→2023 down, 2023→2024 down, 2024→2025 down |
| partial 2026 to date (context only; not a full-year comparison) | 41/231 (17.7%) |

**Executable evidence:** ID `IT-D002`. All 24 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-D002`.

### IT-D003 — behavior type = Tool: share rose 2021→2025

**Finding.** Among records dated 2021, the share of records tagged behavior type = Tool was 19/80 (23.8%); among records dated 2025 it was 256/452 (56.6%): +32.89 percentage points. Counts changed from 19 to 256 (+1247.4%). Every annual step moved in the same direction. These are shares of database records, not measures of underlying risk or of AI safety.

**Review status:** `human_review_required`. **Selection stage:** `data_driven_discovery`. **Eligibility:** `{"passed": true, "rule": "comparative share shift (explore.py screen) + discovery stability floor", "endpoint_delta_pp": 32.88716814159292, "stability": 1.0, "minimum_stability": 0.6, "search_id": "SEARCH-3941b7903b9c", "merged_sensitivities": []}`.

**Proposed website wording**

> In this export, the share of records tagged behavior type = Tool rose from 19/80 (23.8%) in 2021 to 256/452 (56.6%) in 2025. It moved in the same direction in every intervening year. The figures describe recorded incident classifications and may reflect changes in reporting and coverage.

**Chart configuration** (no faithful current chart; supporting table)

- **Primary chart:** TABLE
- **Stacking category:** No current grouping dimension for this field
- **Filters:** {}
- **Date range:** 2021-01-01 to 2025-12-31
- **Setting:** Proportions with all legend series visible
- **Programmatic preset:** {}
- **Compatibility:** Table only: the field is not a chart grouping dimension.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.
- **Container id:** None
- **Dataset:** incidents-arcola

**Confidence in calculation:** High for the exported classifications and exact annual comparisons in this export.

**Confidence in interpretation:** Moderate as a description of database composition; low for any claim about real-world incidence, risk or safety.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- Selected by the data-driven discovery stage (score 0.895: effect 1.00, support 1.00, stability 1.00, chart_fit 0.30). Scores rank descriptive stability and chart usefulness; they are not significance tests.
- Shares are compositional: a category's share can fall while its count rises when other categories grow faster.
- Additional (non-primary) tags answer a different question from the primary tag; assignment shares are a third quantity.
- The partial current year is shown as context only; recently dated records may still be added or reclassified, so it is not a trend point.

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| start one year later | 2022: 36/108 (33.3%) → 2023: 96/179 (53.6%) → 2024: 171/304 (56.2%) → 2025: 256/452 (56.6%); endpoint +23.30 pp; strict annual share rise; strict annual count rise; steps: 2022→2023 up, 2023→2024 up, 2024→2025 up |
| exclude latest complete year | 2021: 19/80 (23.8%) → 2022: 36/108 (33.3%) → 2023: 96/179 (53.6%) → 2024: 171/304 (56.2%); endpoint +32.50 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up |
| drop probable duplicate #353 | 2021: 19/80 (23.8%) → 2022: 36/108 (33.3%) → 2023: 96/179 (53.6%) → 2024: 171/304 (56.2%) → 2025: 256/452 (56.6%); endpoint +32.89 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |
| common classifier/prompt cohort | 2021: 19/80 (23.8%) → 2022: 33/105 (31.4%) → 2023: 87/170 (51.2%) → 2024: 167/299 (55.9%) → 2025: 254/447 (56.8%); endpoint +33.07 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |
| every annual step in the same direction | 2021: 19/80 (23.8%) → 2022: 36/108 (33.3%) → 2023: 96/179 (53.6%) → 2024: 171/304 (56.2%) → 2025: 256/452 (56.6%); endpoint +32.89 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |
| partial 2026 to date (context only; not a full-year comparison) | 107/231 (46.3%) |
| known values only, Other excluded (different denominator) | 2021: 19/78 (24.4%) → 2022: 36/105 (34.3%) → 2023: 96/174 (55.2%) → 2024: 171/298 (57.4%) → 2025: 256/444 (57.7%); endpoint +33.30 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |

**Executable evidence:** ID `IT-D003`. All 29 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-D003`.

### IT-D004 — national-security autonomy level = Human-controlled: share rose 2021→2025

**Finding.** Among records dated 2021, the share of records tagged national-security autonomy level = Human-controlled was 19/80 (23.8%); among records dated 2025 it was 349/452 (77.2%): +53.46 percentage points. Counts changed from 19 to 349 (+1736.8%). Every annual step moved in the same direction. These are shares of database records, not measures of underlying risk or of AI safety.

**Review status:** `human_review_required`. **Selection stage:** `data_driven_discovery`. **Eligibility:** `{"passed": true, "rule": "comparative share shift (explore.py screen) + discovery stability floor", "endpoint_delta_pp": 53.46238938053097, "stability": 1.0, "minimum_stability": 0.6, "search_id": "SEARCH-3a19e1afa1ff", "merged_sensitivities": [{"search_id": "SEARCH-5c4589c3ce7b", "name": "natsec_autonomy_level:Human-supervised", "delta_pp": -38.34070796460177, "score": 0.895}, {"search_id": "SEARCH-d6deca74c49f", "name": "natsec_autonomy_level:Full autonomy", "delta_pp": -15.121681415929203, "score": 0.6225}]}`.

**Proposed website wording**

> In this export, the share of records tagged national-security autonomy level = Human-controlled rose from 19/80 (23.8%) in 2021 to 349/452 (77.2%) in 2025. It moved in the same direction in every intervening year. The figures describe recorded incident classifications and may reflect changes in reporting and coverage.

**Chart configuration** (no faithful current chart; supporting table)

- **Primary chart:** TABLE
- **Stacking category:** No current grouping dimension for this field
- **Filters:** {}
- **Date range:** 2021-01-01 to 2025-12-31
- **Setting:** Proportions with all legend series visible
- **Programmatic preset:** {}
- **Compatibility:** Table only: the field is not a chart grouping dimension.
- **Verification:** Representative controls, charts and incident details were exercised in the in-app browser and native Safari on September 27–28, 2026. Exact coverage and exclusions are recorded in review/browser/BROWSER_CHECKS.md. The live mirror differs from the supplied CSV even when both contain 1,698 records; a compatible chart configuration does not guarantee identical live figures. C04 exposes nine grouping dimensions plus None, while C03 exposes thirteen dimensions.
- **Container id:** None
- **Dataset:** incidents-arcola

**Confidence in calculation:** High for the exported classifications and exact annual comparisons in this export.

**Confidence in interpretation:** Moderate as a description of database composition; low for any claim about real-world incidence, risk or safety.

**Caveats**

- Voluntary selective reporting and changing public attention make this an unrepresentative incident-record collection; no population prevalence or exposure denominator is available.
- Incident dates can use legal/report/publication proxies. Report dates are absent, so reporting-lag durations cannot be estimated; aiid_id order provides only a conditional ordering diagnostic and cannot establish calendar entry dates or historical backfill from one export.
- LLM classification and changing model/prompt methods may affect every tag. Recorded confidence and model agreement are not statistical confidence or ground-truth validation; the export's confidence field is 'High' for almost every record and provides little discrimination and is not an accuracy estimate.
- Source report URLs/dates/IDs are absent from the export; this report verifies export calculations, not all underlying allegations.
- Selected by the data-driven discovery stage (score 0.895: effect 1.00, support 1.00, stability 1.00, chart_fit 0.30). Scores rank descriptive stability and chart usefulness; they are not significance tests.
- Shares are compositional: a category's share can fall while its count rises when other categories grow faster.
- Additional (non-primary) tags answer a different question from the primary tag; assignment shares are a third quantity.
- The partial current year is shown as context only; recently dated records may still be added or reclassified, so it is not a trend point.

**Robustness checks**

| Alternative | Calculated result |
| --- | --- |
| start one year later | 2022: 42/108 (38.9%) → 2023: 113/179 (63.1%) → 2024: 201/304 (66.1%) → 2025: 349/452 (77.2%); endpoint +38.32 pp; strict annual share rise; strict annual count rise; steps: 2022→2023 up, 2023→2024 up, 2024→2025 up |
| exclude latest complete year | 2021: 19/80 (23.8%) → 2022: 42/108 (38.9%) → 2023: 113/179 (63.1%) → 2024: 201/304 (66.1%); endpoint +42.37 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up |
| drop probable duplicate #353 | 2021: 19/80 (23.8%) → 2022: 42/108 (38.9%) → 2023: 113/179 (63.1%) → 2024: 201/304 (66.1%) → 2025: 349/452 (77.2%); endpoint +53.46 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |
| common classifier/prompt cohort | 2021: 19/80 (23.8%) → 2022: 40/105 (38.1%) → 2023: 107/170 (62.9%) → 2024: 197/299 (65.9%) → 2025: 345/447 (77.2%); endpoint +53.43 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |
| every annual step in the same direction | 2021: 19/80 (23.8%) → 2022: 42/108 (38.9%) → 2023: 113/179 (63.1%) → 2024: 201/304 (66.1%) → 2025: 349/452 (77.2%); endpoint +53.46 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |
| partial 2026 to date (context only; not a full-year comparison) | 148/231 (64.1%) |
| full national-security autonomy level distribution, 2021 (complements move together) | Human-supervised: 42/80 (52.5%); Full autonomy: 19/80 (23.8%); Human-controlled: 19/80 (23.8%) |
| full national-security autonomy level distribution, 2025 (complements move together) | Human-controlled: 349/452 (77.2%); Human-supervised: 64/452 (14.2%); Full autonomy: 39/452 (8.6%) |
| known values only, Other excluded (different denominator) | 2021: 19/80 (23.8%) → 2022: 42/108 (38.9%) → 2023: 113/179 (63.1%) → 2024: 201/304 (66.1%) → 2025: 349/452 (77.2%); endpoint +53.46 pp; strict annual share rise; strict annual count rise; steps: 2021→2022 up, 2022→2023 up, 2023→2024 up, 2024→2025 up |

**Executable evidence:** ID `IT-D004`. All 35 associated calculation IDs and their set references are in `candidates.json`; use `python3 -m tracker evidence --run <this-run> --candidate IT-D004`.

## Discovery ledger summary (data-driven stage, v2)

Discovery version `2026-09-27.v2.4`; weights `{"effect": 0.3, "support": 0.2, "stability": 0.35, "chart_fit": 0.15}`. Stages: 1 statistical screen (explore.py eligibility flags; v2 emergence relaxation admits first-endpoint-small categories that reach the end-count minimum); 2 deduplication (primary/any-label, same-field complements, severity ladder); 3 declared withholding (published/archived-claim routing, complements of audited fields, withheld families, unknown/Other, near-tautology, low-information rankings, stability floor, field cap); 4 explainable scoring (weighted components below; no novelty weight: published matches are routed before scoring); 5 chart-coverage selection (score floor, per-family, per-chart and total caps); 6 LLM interpretation and editorial choice: NOT automated; human review required.

| Decision | Cells |
| --- | --- |
| screened_out | 308 |
| withheld_family | 70 |
| route_to_claim_audit | 15 |
| merged_as_sensitivity | 12 |
| ranked_below_total_cap | 9 |
| selected | 6 |
| complement_of_audited_claim | 2 |
| route_to_archived_replay | 1 |
| withheld_unstable | 1 |

Every eligible cell has a decision and a reason in `discovery_ledger.json`. Selected and highest-scoring non-selected cells:

| Rank/decision | Family | Cell | Score | Components | Reason |
| --- | --- | --- | --- | --- | --- |
| 1 selected | within_domain_concentration | 3:3.1 | 0.930 | effect 0.82, support 1.00, stability 1.00, chart_fit 0.90 | rank 1 by declared score; chart coverage pass |
| 2 selected | severity_endpoint | 10:direct+indirect:3 | 0.896 | effect 0.95, support 1.00, stability 1.00, chart_fit 0.40 | rank 2 by declared score; chart coverage pass |
| 3 selected | scalar_endpoint | behaviour_type:Tool | 0.895 | effect 1.00, support 1.00, stability 1.00, chart_fit 0.30 | rank 3 by declared score; chart coverage pass |
| 4 selected | scalar_endpoint | natsec_autonomy_level:Human-controlled | 0.895 | effect 1.00, support 1.00, stability 1.00, chart_fit 0.30 | rank 4 by declared score; chart coverage pass |
| 5 selected | within_domain_concentration | 5:5.1 | 0.821 | effect 0.77, support 0.53, stability 1.00, chart_fit 0.90 | rank 5 by declared score; chart coverage pass |
| 6 selected | emergence | primary:3.1 | 0.710 | effect 0.51, support 0.64, stability 0.80, chart_fit 1.00 | rank 6 by declared score; chart coverage pass |
| merged_as_sensitivity | scalar_endpoint | natsec_autonomy_level:Human-supervised | 0.895 | effect 1.00, support 1.00, stability 1.00, chart_fit 0.30 | same comparison as SEARCH-3a19e1afa1ff (field:natsec_autonomy_level) |
| merged_as_sensitivity | emergence | any:3.1 | 0.895 | effect 1.00, support 1.00, stability 1.00, chart_fit 0.30 | same comparison as SEARCH-024a0a6e19ad (emergence:3.1) |
| merged_as_sensitivity | severity_endpoint | 10:direct+indirect+inferred:3 | 0.840 | effect 1.00, support 1.00, stability 0.80, chart_fit 0.40 | same comparison as SEARCH-2613ebf99dae (severity) |
| merged_as_sensitivity | severity_endpoint | 10:direct:3 | 0.777 | effect 0.64, support 0.87, stability 1.00, chart_fit 0.40 | same comparison as SEARCH-2613ebf99dae (severity) |
| merged_as_sensitivity | severity_endpoint | 13:direct+indirect:3 | 0.771 | effect 0.77, support 1.00, stability 0.80, chart_fit 0.40 | same comparison as SEARCH-2613ebf99dae (severity) |
| ranked_below_total_cap | within_domain_concentration | 2:2.1 | 0.770 | effect 0.52, support 0.64, stability 1.00, chart_fit 0.90 | total cap 6 reached |
| ranked_below_total_cap | scalar_endpoint | behaviour_type:Autonomous | 0.737 | effect 1.00, support 0.56, stability 0.80, chart_fit 0.30 | total cap 6 reached |
| ranked_below_total_cap | scalar_endpoint | natsec_novelty_level:Evolved capability | 0.706 | effect 0.84, support 1.00, stability 0.60, chart_fit 0.30 | total cap 6 reached |
| merged_as_sensitivity | scalar_endpoint | natsec_novelty_level:Established threat | 0.686 | effect 0.77, support 1.00, stability 0.60, chart_fit 0.30 | same comparison as SEARCH-4cf39a7a08ce (field:natsec_novelty_level) |
| ranked_below_total_cap | emergence | ai_goal_primary:Chatbot | 0.668 | effect 0.33, support 0.70, stability 0.80, chart_fit 1.00 | total cap 6 reached |
| merged_as_sensitivity | severity_endpoint | 13:direct:3 | 0.659 | effect 0.63, support 1.00, stability 0.60, chart_fit 0.40 | same comparison as SEARCH-2613ebf99dae (severity) |
| merged_as_sensitivity | scalar_endpoint | natsec_autonomy_level:Full autonomy | 0.623 | effect 0.60, support 0.58, stability 0.80, chart_fit 0.30 | same comparison as SEARCH-3a19e1afa1ff (field:natsec_autonomy_level) |

Cells routed to the published-claim audit or to archived replays instead of being proposed as new:

| Cell | Decision | Claims |
| --- | --- | --- |
| eu_ai_act_risk_level:4 | complement_of_audited_claim | (complement) |
| primary:4.3 | route_to_claim_audit | TIME-01 |
| eu_ai_act_risk_level:2 | route_to_claim_audit | OVERVIEW-03, TIME-04 |
| ai_goal_primary:Deepfake Video Generation | route_to_claim_audit | TIME-03 |
| causal_entity:Human | route_to_claim_audit | TIME-05 |
| domain_code | route_to_claim_audit | OVERVIEW-05 |
| any:4.3 | route_to_claim_audit | TIME-01 |
| causal_intent:Unintentional | route_to_claim_audit | OVERVIEW-01, TIME-05 |
| eu_ai_act_risk_level:3 | complement_of_audited_claim | (complement) |
| causal_entity:AI | route_to_claim_audit | TIME-05 |
| primary:7.3 | route_to_claim_audit | TIME-02 |
| 4:4.3 | route_to_claim_audit | OVERVIEW-06 |
| 7:7.3 | route_to_archived_replay | ARCH-TIMELINE-SUB-DOMAINS-03 |
| causal_timing | route_to_claim_audit | OVERVIEW-02, TIME-06 |
| any:7.3 | route_to_claim_audit | TIME-02 |
| ai_goal_primary | route_to_claim_audit | OVERVIEW-04 |
| causal_intent:Intentional | route_to_claim_audit | OVERVIEW-01, TIME-05 |
| 2021-2025 | route_to_claim_audit | HOME-02 |

- Ranking and concentration cells in the ledger use records dated through the last complete year; the retained session templates IT-C003 (all dates) and IT-C004 (2016 to the last complete year) use different windows, stated in each candidate.
- Reviewer 3's alternative weighting (effect 0.35, stability 0.25, robustness 0.15, monotonicity 0.10, chart 0.15; per-chart cap 2) and its 'domain-dominant duplicate' and 'per-harm-category domain profile' rules were considered and recorded in V2_CHANGELOG.md; the declared rules here are the ones in force.

## No-candidate and historical surfaces

C06's potential-cause diagram does not establish causal effects. C07's individual NatSec radar cannot portray an aggregate trend; its sample-size check is reported in the coverage table. The two framework pages define scales; they are not empirical charts. Historical surfaces and dated-study figures are itemized in `chart_outcomes.json` and `inputs/chart_inventory.json`; no current chart is inferred from an archived Airtable shell.

## Evidence limits and external dependencies

No export-to-export changes, historical submission volumes, delay corrections, historical classification versions, population prevalence, or causation can be identified from this single export. Late entry can only be bounded from record order under a stated assumption. Human reviewers should inspect contributing cases and the chart/version discrepancies before publication.
