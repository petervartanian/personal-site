# Archived insights — explicitly bounded retrospective replays

These are archived `/old-ai-incident-tracker/` claims, not current dashboard text. Missing original snapshots/relative endpoints make many historical claims unverifiable. Replays expose what the current CSV says under named definitions; they do not establish what an earlier export contained.

## ARCH-RISK-CLASSIFICATION-01 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/risk-classification) · retrieved **2026-09-27T16:43:30.279614Z** · `archived_tracker`

**Exact published wording**

> The domain with most reported incidents across the full dataset is '4 Malicious actors' (35%) followed by ‘7 AI system safety, failures, & limitations’ (22%)

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Current full-export replay, domains 4/7: 641/1,698 (37.8%); 378/1,698 (22.3%). The ordering is tested by current OVERVIEW-05.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 2 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-RISK-CLASSIFICATION-01`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-RISK-CLASSIFICATION-02 — Needs a numerical or wording update

[Source](https://airisk.mit.edu/old-ai-incident-tracker/risk-classification) · retrieved **2026-09-27T16:43:30.279614Z** · `archived_tracker`

**Exact published wording**

> For risks reported in 2025, the proportion of incidents attributed to malicious actors is much higher at 57%

**Original window:** 2025, as stated on archived page.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** Fixed 2025 incident-date window recalculated as 255/452 (56.4%). Original 2025 cutoff may have been year-to-date; this does not reconstruct that earlier database.

**Current-export replay (not a correction of the archived text; original snapshot unavailable)**

> In the current export, 255/452 (56.4%) of records dated 2025 are primarily tagged domain 4.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 1 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-RISK-CLASSIFICATION-02`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-RISK-CLASSIFICATION-03 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/risk-classification) · retrieved **2026-09-27T16:43:30.279614Z** · `archived_tracker`

**Exact published wording**

> Within domain 4, the vast majority of reported incidents (329 of 426) were in the subdomain ‘4.3 Fraud, scams and targeted manipulation’

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Current primary replay: 440/641 (68.6%); original quote was 329/426.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 1 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-RISK-CLASSIFICATION-03`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-RISK-CLASSIFICATION-04 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/risk-classification) · retrieved **2026-09-27T16:43:30.279614Z** · `archived_tracker`

**Exact published wording**

> 51% of reported incidents were tagged as intentionally caused.

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Current scalar replay: 830/1,698 (48.9%)

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 1 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-RISK-CLASSIFICATION-04`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-RISK-CLASSIFICATION-05 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/risk-classification) · retrieved **2026-09-27T16:43:30.279614Z** · `archived_tracker`

**Exact published wording**

> Almost all reported incidents have been classified as post-deployment, with only 2% pre-deployment

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Current scalar replay: 32/1,698 (1.9%)

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 1 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-RISK-CLASSIFICATION-05`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-RISK-CLASSIFICATION-06 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/risk-classification) · retrieved **2026-09-27T16:43:30.279614Z** · `archived_tracker`

**Exact published wording**

> 3% of reported incidents would be classed as level 1 (Unacceptable) and therefore prohibited under the EU AI Act. 35% would be classified as level 2 (High Risk)

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Current scalar replay: 87/1,698 (5.1%); 435/1,698 (25.6%)

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; Tier tags cannot establish legal prohibition

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 2 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-RISK-CLASSIFICATION-06`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-RISK-CLASSIFICATION-07 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/risk-classification) · retrieved **2026-09-27T16:43:30.279614Z** · `archived_tracker`

**Exact published wording**

> The primary purpose category attributed to the highest number of incidents is Deepfake Video Generation

**Original window:** Full reported-incident dataset according to prose; original analytical snapshot/date not supplied.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Current ranking winner: Deepfake Video Generation; quoted category: 316/1,698 (18.6%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 1 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-RISK-CLASSIFICATION-07`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-RISK-CLASSIFICATION-01 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-risk-classification) · retrieved **2026-09-27T16:43:30.360412Z** · `archived_tracker`

**Exact published wording**

> There has been a clear rise year on year in the proportion of incidents in the following subdomains since 2022: 4.3 Fraud, scams and targeted manipulation, 3.1 False or misleading information

**Original window:** Since 2022; adjacent text references 2025, while page scope says 2015–2024.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Bounded replay 4.3/primary: 2022: 13/108 (12.0%); 2023: 38/179 (21.2%); 2024: 105/304 (34.5%); 2025: 192/452 (42.5%). Bounded replay 4.3/any: 2022: 17/108 (15.7%); 2023: 56/179 (31.3%); 2024: 131/304 (43.1%); 2025: 227/452 (50.2%). Bounded replay 3.1/primary: 2022: 9/108 (8.3%); 2023: 21/179 (11.7%); 2024: 32/304 (10.5%); 2025: 63/452 (13.9%). Bounded replay 3.1/any: 2022: 16/108 (14.8%); 2023: 54/179 (30.2%); 2024: 101/304 (33.2%); 2025: 175/452 (38.7%).

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.


**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 16 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-RISK-CLASSIFICATION-01`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-RISK-CLASSIFICATION-02 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-risk-classification) · retrieved **2026-09-27T16:43:30.360412Z** · `archived_tracker`

**Exact published wording**

> The proportion of reported incidents attributed to lack of capability or robustness has been decreasing each year since 2021

**Original window:** Each year since 2021; no endpoint specified.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Bounded replay 7.3/primary: 2021: 33/80 (41.2%); 2022: 33/108 (30.6%); 2023: 37/179 (20.7%); 2024: 44/304 (14.5%); 2025: 45/452 (10.0%). Bounded replay 7.3/any: 2021: 53/80 (66.2%); 2022: 62/108 (57.4%); 2023: 72/179 (40.2%); 2024: 108/304 (35.5%); 2025: 121/452 (26.8%).

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.


**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 10 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-RISK-CLASSIFICATION-02`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-RISK-CLASSIFICATION-03 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-risk-classification) · retrieved **2026-09-27T16:43:30.360412Z** · `archived_tracker`

**Exact published wording**

> Numbers of reported incidents attributed to systems whose purpose is video, voice or image generation have increased dramatically since 2022, now totalling around half reported incidents.

**Original window:** Since 2022; 'now' undated.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Defined four-purpose replay: 2022: 19/108 (17.6%); 2023: 74/179 (41.3%); 2024: 147/304 (48.4%); 2025: 239/452 (52.9%). ‘Dramatically’, ‘around half’, and ‘now’ remain ambiguous.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 4 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-RISK-CLASSIFICATION-03`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-RISK-CLASSIFICATION-04 — Unsupported under the stated interpretation

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-risk-classification) · retrieved **2026-09-27T16:43:30.360412Z** · `archived_tracker`

**Exact published wording**

> The proportion of incidents classified as level 1 (Unacceptable) under the EU AI Act has increased each year since 2022, reaching 4% in 2025]

**Original window:** 2022–2025; literal trailing ']' retained.

**Interpretation:** Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Evidence and reason:** 2022: 3/108 (2.8%); 2023: 9/179 (5.0%); 2024: 15/304 (4.9%); 2025: 24/452 (5.3%). Adjacent changes use unrounded fractions: 2023→2024 (-0.09 pp; within one record). 2026 year-to-date through 2026-09-27 (incomplete; context only, not comparable with whole years): 4/231 (1.7%). These are automated tier classifications, not legal rulings.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- increases each year: **Unsupported under the stated interpretation** — Failing step(s): 2023→2024 (-0.09 pp; within one record). Protocol-correct on unrounded fractions; a one-record margin is fragile to backfill.
- quoted endpoint: **Needs a numerical or wording update** — Observed 24/452 (5.3%); published 4% at 0 decimals.
- full tier composition at the endpoints (complement labels move together): **Not verifiable with the available data or an ambiguous definition** — 2022: tier 1 3/108 (2.8%), tier 2 47/108 (43.5%), tier 3 40/108 (37.0%), tier 4 18/108 (16.7%); 2025: tier 1 24/452 (5.3%), tier 2 36/452 (8.0%), tier 3 374/452 (82.7%), tier 4 18/452 (4.0%)

**Discrepancy explanation:** not a calculation error: the annual-increase clause fails on unrounded fractions in this export and on the live mirror; the 4% endpoint is not reproduced by any ID-prefix snapshot proxy together with a strict rise

**Current-export replay (not a correction of the archived text; original snapshot unavailable)**

> Incident records tagged tier 1 (Unacceptable) under the EU AI Act were 3 of 108 (2.8%) in 2022, 9 of 179 (5.0%) in 2023, 15 of 304 (4.9%) in 2024 and 24 of 452 (5.3%) in 2025. These are automated tier tags that change as records are reclassified; they are not legal determinations.

**Editorial flags:** Remove literal trailing bracket; Legal applicability/prohibition is not independently established; Temporal applicability for the human legal reviewer: confirm from which date the Act's prohibitions applied; most tier-1-tagged records are dated before 2025.; Archived version; fixed 2025 window recalculated

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 13 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-RISK-CLASSIFICATION-04`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-RISK-CLASSIFICATION-05 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-risk-classification) · retrieved **2026-09-27T16:43:30.360412Z** · `archived_tracker`

**Exact published wording**

> The proportion of intentionally caused incidents has increased each year since 2021, as has the proportion attributed to Human rather than AI entities.

**Original window:** Each year since 2021; no endpoint specified.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Bounded causal_intent replay: 2021: 17/80 (21.2%); 2022: 36/108 (33.3%); 2023: 90/179 (50.3%); 2024: 192/304 (63.2%); 2025: 291/452 (64.4%). Bounded causal_entity replay: 2021: 22/80 (27.5%); 2022: 41/108 (38.0%); 2023: 94/179 (52.5%); 2024: 198/304 (65.1%); 2025: 310/452 (68.6%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 10 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-RISK-CLASSIFICATION-05`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-SUB-DOMAINS-01 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-sub-domains) · retrieved **2026-09-27T16:43:30.360733Z** · `archived_tracker`

**Exact published wording**

> Within risk domain '1 Discrimination and Toxicity', the proportion of incidents reported that have been classed as '1.2 Exposure to Toxic Content' has increased since 2020 whereas the proportion classed as '1.1 Unfair Discrimination and Misrepresentation' has decreased.

**Original window:** Since 2020; archived page scope 2015–2025.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. The captured page explicitly scopes its view to 2015–2025; that scope is replayed below. Within-primary-domain replay 1.1: 2020: 10/29 (34.5%); 2021: 6/27 (22.2%); 2022: 6/24 (25.0%); 2023: 3/27 (11.1%); 2024: 7/39 (17.9%); 2025: 2/33 (6.1%). Within-primary-domain replay 1.2: 2020: 3/29 (10.3%); 2021: 10/27 (37.0%); 2022: 10/24 (41.7%); 2023: 17/27 (63.0%); 2024: 21/39 (53.8%); 2025: 27/33 (81.8%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 12 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-SUB-DOMAINS-01`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-SUB-DOMAINS-02 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-sub-domains) · retrieved **2026-09-27T16:43:30.360733Z** · `archived_tracker`

**Exact published wording**

> The number of incidents in domain '6 Socioeconomic & Environmental' is very low relative to other domains, with no more than 3 reported in any year.

**Original window:** Any year in archived page's 2015–2025 scope.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. The captured page explicitly scopes its view to 2015–2025; that scope is replayed below. Captured-scope maximum: 2024, 11/304 (3.6%). The ‘no more than 3’ component is checked within that scope.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- captured-page-scope annual count <=3: **Unsupported under the stated interpretation**

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 11 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-SUB-DOMAINS-02`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-SUB-DOMAINS-03 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-sub-domains) · retrieved **2026-09-27T16:43:30.360733Z** · `archived_tracker`

**Exact published wording**

> The overwhelming majority of reported incidents within domain 7 'AI System Safety, Failures & Limitations' are classed as '7.3 Lack of Capability or Robustness'

**Original window:** Archived page's 2015–2025 scope; statement gives no explicit window.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. The captured page explicitly scopes its view to 2015–2025; that scope is replayed below. Captured-scope within-domain share: 299/307 (97.4%); overwhelming is not thresholded. Separately labeled all-date context: 360/378 (95.2%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 2 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-SUB-DOMAINS-03`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-SUB-DOMAINS-04 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-sub-domains) · retrieved **2026-09-27T16:43:30.360733Z** · `archived_tracker`

**Exact published wording**

> Most incidents attributed to Malicious Actors in the last 3 years are frauds, scams or targeted attacks, with very incidents classified as cyberattacks.

**Original window:** 'Last 3 years'; absolute years not specified, page scope 2015–2025.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. The captured page explicitly scopes its view to 2015–2025; that scope is replayed below. Illustrative last-three-complete-year replay 4.3: 335/479 (69.9%). Illustrative last-three-complete-year replay 4.1: 131/479 (27.3%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 2 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-SUB-DOMAINS-04`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-ALLEGED-DEVELOPERS-01 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/alleged-developers) · retrieved **2026-09-27T16:43:29.742413Z** · `archived_tracker`

**Exact published wording**

> The developers associated with the highest number of reported incidents overall (within all incidents since 2015 where the developer was one of the 10 most frequently reported) were OpenAI (14%) and Meta (10%).

**Original window:** Since 2015, restricted to incidents whose developer is one of the ten most frequent.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; Alleged-developer free text and registry-derived ai_developers arrays are distinct. Do not split free text on commas or silently swap identities.

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 0 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-ALLEGED-DEVELOPERS-01`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-ALLEGED-DEVELOPERS-02 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/alleged-developers) · retrieved **2026-09-27T16:43:29.742413Z** · `archived_tracker`

**Exact published wording**

> The numbers of incidents associated with OpenAI increased dramatically in 2023 compared with previous years, following the launch of ChatGPT to the public in November 2022.

**Original window:** 2023 compared with previous years; ChatGPT launch November 2022 mentioned.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Different-field sensitivity only: 2021: 4/80 (5.0%); 2022: 10/108 (9.3%); 2023: 34/179 (19.0%); 2024: 49/304 (16.1%); 2025: 67/452 (14.8%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; Alleged-developer free text and registry-derived ai_developers arrays are distinct. Do not split free text on commas or silently swap identities.

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 5 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-ALLEGED-DEVELOPERS-02`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-ALLEGED-DEVELOPERS-03 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/alleged-developers) · retrieved **2026-09-27T16:43:29.742413Z** · `archived_tracker`

**Exact published wording**

> The share of incidents with a substantial National Security impact, which are attributed to OpenAI has increased each year since 2021.

**Original window:** Each year since 2021; no endpoint specified.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Different-field sensitivity only: 2021: 1/12 (8.3%); 2022: 0/13 (0.0%); 2023: 3/26 (11.5%); 2024: 13/61 (21.3%); 2025: 7/66 (10.6%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; Alleged-developer free text and registry-derived ai_developers arrays are distinct. Do not split free text on commas or silently swap identities.

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 5 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-ALLEGED-DEVELOPERS-03`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-ALLEGED-DEVELOPERS-04 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/alleged-developers) · retrieved **2026-09-27T16:43:29.742413Z** · `archived_tracker`

**Exact published wording**

> The developers of the AI systems associated with almost a half of reported incidents are unknown.

**Original window:** Full archived dataset; no snapshot date stated.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; Alleged-developer free text and registry-derived ai_developers arrays are distinct. Do not split free text on commas or silently swap identities.

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 0 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-ALLEGED-DEVELOPERS-04`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-HARM-SEVERITY-01 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/harm-severity) · retrieved **2026-09-27T16:43:29.742693Z** · `archived_tracker`

**Exact published wording**

> Only one incident has been classified with a direct environmental damage score of more than 1 (negligible harm)

**Original window:** Full archived dataset; 'only one', no snapshot date stated.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Current direct environmental score ≥2: 5/1,698 (0.3%). ‘Medium/high’ in the second archive is not a recovered threshold.

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- current-export direct environmental >1 count=1: **Needs a numerical or wording update**

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 1 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-HARM-SEVERITY-01`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-HARM-SEVERITY-02 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/harm-severity) · retrieved **2026-09-27T16:43:29.742693Z** · `archived_tracker`

**Exact published wording**

> Over the past 7 years, the severity of harm in the Toxic and Malicious Content category has increased with fewer 'negligible' classifications each year.

**Original window:** 'Past 7 years'; absolute endpoints unspecified.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Illustrative last-seven-complete-year direct score ≥2 share: 2019: 8/44 (18.2%); 2020: 30/92 (32.6%); 2021: 18/80 (22.5%); 2022: 31/108 (28.7%); 2023: 84/179 (46.9%); 2024: 163/304 (53.6%); 2025: 260/452 (57.5%). No average ordinal severity is computed.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 7 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-HARM-SEVERITY-02`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-HIGH-SEVERITY-INCIDENTS-01 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-high-severity-incidents) · retrieved **2026-09-27T16:43:30.279963Z** · `archived_tracker`

**Exact published wording**

> The proportion of high severity incidents (across all categories) attributed to 'Malicious Actors' has increased significantly in the past 4 years, reaching 65% of all high severity incidents in 2025.

**Original window:** 'Past 4 years', ending at stated 2025 endpoint; exact first year not independently given.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. 2025 ≥4/direct sensitivity: 12/17 (70.6%). 2025 ≥4/direct+indirect sensitivity: 20/27 (74.1%). 2025 ≥4/direct+indirect+inferred sensitivity: 39/60 (65.0%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 3 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-HIGH-SEVERITY-INCIDENTS-01`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-HIGH-SEVERITY-INCIDENTS-02 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-high-severity-incidents) · retrieved **2026-09-27T16:43:30.279963Z** · `archived_tracker`

**Exact published wording**

> The number of incidents causing direct financial loss >$1M has increased dramatically with the overwhelming majority attributed to malicious actors.

**Original window:** Undated trend, direct loss >$1M.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Published 1–5 scale uses $1M–$100M for financial level 3; strict >$1M cannot be recovered from the ordinal band. ≥3 proxy: 2021: 5/80 (6.2%); 2022: 7/108 (6.5%); 2023: 8/179 (4.5%); 2024: 20/304 (6.6%); 2025: 22/452 (4.9%). Domain 4 among proxy: 39/98 (39.8%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 6 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-HIGH-SEVERITY-INCIDENTS-02`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-HIGH-SEVERITY-INCIDENTS-03 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-high-severity-incidents) · retrieved **2026-09-27T16:43:30.279963Z** · `archived_tracker`

**Exact published wording**

> Only one incident causing medium or high severity Direct Environmental Damage has been reported to date.

**Original window:** 'To date' on archived page; historical snapshot date unknown.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Current direct environmental score ≥2: 5/1,698 (0.3%). ‘Medium/high’ in the second archive is not a recovered threshold.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 1 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-HIGH-SEVERITY-INCIDENTS-03`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-HIGH-SEVERITY-MULTIPLE-CATEGORIES-01 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-high-severity-multiple-categories) · retrieved **2026-09-27T16:43:30.280280Z** · `archived_tracker`

**Exact published wording**

> Reported numbers for incidents with moderate and high severity scores in multiple categories has increased each year since 2012, and almost doubled from 2023 to 2024.

**Original window:** Each year since 2012; explicitly compares 2023 to 2024.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Explicit direct/ten-dimension/≥2-categories/score≥2 sensitivity: 2012: 7/8 (87.5%); 2013: 4/6 (66.7%); 2014: 4/13 (30.8%); 2015: 13/24 (54.2%); 2016: 17/41 (41.5%); 2017: 19/50 (38.0%); 2018: 24/46 (52.2%); 2019: 27/44 (61.4%); 2020: 43/92 (46.7%); 2021: 38/80 (47.5%); 2022: 42/108 (38.9%); 2023: 61/179 (34.1%); 2024: 127/304 (41.8%); 2025: 154/452 (34.1%). Explicit direct/ten-dimension/≥2-categories/score≥3 sensitivity: 2012: 4/8 (50.0%); 2013: 2/6 (33.3%); 2014: 2/13 (15.4%); 2015: 8/24 (33.3%); 2016: 6/41 (14.6%); 2017: 3/50 (6.0%); 2018: 11/46 (23.9%); 2019: 12/44 (27.3%); 2020: 5/92 (5.4%); 2021: 7/80 (8.8%); 2022: 7/108 (6.5%); 2023: 12/179 (6.7%); 2024: 20/304 (6.6%); 2025: 16/452 (3.5%). Explicit direct/ten-dimension/≥2-categories/score≥4 sensitivity: 2012: 1/8 (12.5%); 2013: 0/6 (0.0%); 2014: 1/13 (7.7%); 2015: 3/24 (12.5%); 2016: 2/41 (4.9%); 2017: 0/50 (0.0%); 2018: 2/46 (4.3%); 2019: 3/44 (6.8%); 2020: 1/92 (1.1%); 2021: 0/80 (0.0%); 2022: 0/108 (0.0%); 2023: 2/179 (1.1%); 2024: 3/304 (1.0%); 2025: 3/452 (0.7%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; ‘Moderate/high’ thresholds and channels are ambiguous; ordinal-score sums are not used as category counts.

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 42 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-HIGH-SEVERITY-MULTIPLE-CATEGORIES-01`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-HIGH-SEVERITY-MULTIPLE-CATEGORIES-02 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-high-severity-multiple-categories) · retrieved **2026-09-27T16:43:30.280280Z** · `archived_tracker`

**Exact published wording**

> In the past 5 years, incidents reported in the 'Malicious Actors' risk domain have increased significantly as a proportion of total incidents causing moderate or severe harm in multiple harm categories

**Original window:** 'Past 5 years'; absolute endpoints unspecified.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Explicit direct/ten-dimension/≥2-categories/score≥2 sensitivity: 2021: 5/38 (13.2%); 2022: 11/42 (26.2%); 2023: 38/61 (62.3%); 2024: 82/127 (64.6%); 2025: 120/154 (77.9%). Explicit direct/ten-dimension/≥2-categories/score≥3 sensitivity: 2021: 1/7 (14.3%); 2022: 1/7 (14.3%); 2023: 5/12 (41.7%); 2024: 9/20 (45.0%); 2025: 8/16 (50.0%). Explicit direct/ten-dimension/≥2-categories/score≥4 sensitivity: 2021: 0/0 (undefined); 2022: 0/0 (undefined); 2023: 1/2 (50.0%); 2024: 1/3 (33.3%); 2025: 1/3 (33.3%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; ‘Moderate/high’ thresholds and channels are ambiguous; ordinal-score sums are not used as category counts.

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 15 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-HIGH-SEVERITY-MULTIPLE-CATEGORIES-02`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-NUMBER-OF-PEOPLE-AFFECTED-01 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-number-of-people-affected) · retrieved **2026-09-27T16:43:30.359861Z** · `archived_tracker`

**Exact published wording**

> The number of high-severity incidents reported where > 1 million people were exposed to risk increased dramatically in 2024.

**Original window:** 2024, explicitly stated.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Illustrative 2023/2024 replay of records with more than 1,000,000 people reportedly exposed and a direct or indirect score ≥3 in the original ten dimensions (all domains): 2023: 11/179 (6.1%); 2024: 25/304 (8.2%); counts too small to support any trend statement. Illustrative 2023/2024 replay of records with more than 1,000,000 people reportedly exposed and a direct or indirect score ≥4 in the original ten dimensions (all domains): 2023: 5/179 (2.8%); 2024: 13/304 (4.3%); counts too small to support any trend statement.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; People-count estimates lack unknown/overlap semantics and report-level validation; no population totals are inferred.

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 4 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-NUMBER-OF-PEOPLE-AFFECTED-01`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-TIMELINE-NUMBER-OF-PEOPLE-AFFECTED-02 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/timeline-number-of-people-affected) · retrieved **2026-09-27T16:43:30.359861Z** · `archived_tracker`

**Exact published wording**

> Looking at medium and high severity incidents where > 1000 people were harmed, the number of incidents associated with malicious actors has increased significantly in the past 2 years.

**Original window:** 'Past 2 years'; absolute endpoints unspecified.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Illustrative 2023/2024 replay of records with more than 1,000 people reportedly harmed and a direct or indirect score ≥3 in the original ten dimensions (primary domain 4 only): 2023: 2/179 (1.1%); 2024: 4/304 (1.3%); counts too small to support any trend statement. Illustrative 2023/2024 replay of records with more than 1,000 people reportedly harmed and a direct or indirect score ≥4 in the original ten dimensions (primary domain 4 only): 2023: 1/179 (0.6%); 2024: 2/304 (0.7%); counts too small to support any trend statement.

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; People-count estimates lack unknown/overlap semantics and report-level validation; no population totals are inferred.

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 4 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-TIMELINE-NUMBER-OF-PEOPLE-AFFECTED-02`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-NATSEC-IMPACT-01 — Needs a numerical or wording update

[Source](https://airisk.mit.edu/old-ai-incident-tracker/natsec-impact) · retrieved **2026-09-27T16:43:30.205507Z** · `archived_tracker`

**Exact published wording**

> The number of reported incidents where overall national security impact was rated high (>=4) almost tripled from 2023 to 2024. (10 incidents in 2023 to 29 in 2024)

**Original window:** 2023 versus 2024, explicitly stated.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** Fixed 2023/2024 window, overall score ≥4: 2023: 3/179 (1.7%); 2024: 7/304 (2.3%). Original quote: 10→29. Current retained tags differ; no prior export is available to attribute differences to backfill versus reclassification.

**Current-export replay (not a correction of the archived text; original snapshot unavailable)**

> In the current export, national-security overall score ≥4 is assigned to 3 records dated 2023 and 7 dated 2024. These are small counts; omit ‘almost tripled’. 

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 2 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-NATSEC-IMPACT-01`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-NATSEC-IMPACT-02 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/natsec-impact) · retrieved **2026-09-27T16:43:30.205507Z** · `archived_tracker`

**Exact published wording**

> The number of reported incidents attributed to a fully autonomous AI system has decreased each year since 2022, with the large majority being attributed to human-controlled AI systems.

**Original window:** Each year since 2022; endpoint unspecified.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. Bounded current replay: 2022: 24/108 (22.2%); 2023: 22/179 (12.3%); 2024: 45/304 (14.8%); 2025: 39/452 (8.6%). Human-controlled: 956/1,698 (56.3%).

**Component checks:** `claim_audit.json` preserves every component, alternative denominator and annual step; a composite claim is not passed merely because one part matches.

- bounded strict count decline: **Unsupported under the stated interpretation**

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 5 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-NATSEC-IMPACT-02`. Source/quote hashes and raw source paths are retained in the same registry.

## ARCH-NATSEC-IMPACT-03 — Not verifiable with the available data or an ambiguous definition

[Source](https://airisk.mit.edu/old-ai-incident-tracker/natsec-impact) · retrieved **2026-09-27T16:43:30.205507Z** · `archived_tracker`

**Exact published wording**

> Incidents with non-negligible overall impact that are classified as near-term or immediate threats have been increasing as a proportion of total each year between 2019-2024.

**Original window:** 2019–2024, explicitly stated.

**Interpretation:** Archived prose; any current-export replay below is retrospective, not a reconstruction of the unpublished original snapshot.

**Evidence and reason:** The original snapshot and/or relative time-window endpoint is unavailable. The archived Airtable chart's internal field/threshold definitions were not recovered. Open-ended illustrative series are frozen at 2025, rather than extended when new exports arrive. 2019–2024 ≥2 proxy, all records: 2019: 0/44 (0.0%); 2020: 2/92 (2.2%); 2021: 3/80 (3.8%); 2022: 3/108 (2.8%); 2023: 8/179 (4.5%); 2024: 41/304 (13.5%); within-qualified: 2019: 0/39 (0.0%); 2020: 2/75 (2.7%); 2021: 3/62 (4.8%); 2022: 3/73 (4.1%); 2023: 8/145 (5.5%); 2024: 41/248 (16.5%). 2019–2024 ≥3 proxy, all records: 2019: 0/44 (0.0%); 2020: 1/92 (1.1%); 2021: 2/80 (2.5%); 2022: 2/108 (1.9%); 2023: 7/179 (3.9%); 2024: 28/304 (9.2%); within-qualified: 2019: 0/8 (0.0%); 2020: 1/13 (7.7%); 2021: 2/12 (16.7%); 2022: 2/13 (15.4%); 2023: 7/26 (26.9%); 2024: 28/61 (45.9%).

**Editorial flags:** Archived, not a current dashboard claim; Current-export replay, not a correction of the archived text; original snapshot unavailable; NatSec rubric starts at Minor, not Negligible; ‘non-negligible’ and ‘total’ need definitions.

**Calculation definition:** `{"handler": "archival_check", "implementation": "tracker/audit.py:archival_check", "historical_snapshot_available": false, "replay": {"frozen_illustrative_endpoint_year": 2025, "page_scope_by_claim_prefix": {"ARCH-TIMELINE-SUB-DOMAINS-": [2015, 2025]}, "note": "Captured page scope is replayed when available. Otherwise the fixed endpoint is an analyst illustration, not an asserted original publication endpoint.", "expectations": {"ARCH-RISK-CLASSIFICATION-02": {"published_percent": 57}, "ARCH-RISK-CLASSIFICATION-03": {"published_fraction": "329/426"}, "ARCH-TIMELINE-SUB-DOMAINS-02": {"maximum_annual_count": 3}, "ARCH-HARM-SEVERITY-01": {"published_count": 1}, "ARCH-NATSEC-IMPACT-01": {"published_counts": [10, 29]}}, "rounding_rule": "half_even (Python round) at the published precision"}}`

**Incident-level evidence:** 24 calculation references in `claim_audit.json`. Run `python3 -m tracker evidence --run <this-run> --claim ARCH-NATSEC-IMPACT-03`. Source/quote hashes and raw source paths are retained in the same registry.
