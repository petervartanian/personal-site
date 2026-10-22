# Published-insight audit

Simon, use these assessments to decide which published insights need updating.

Run: 20260928T153240558526Z-fbdc9a5f21b9
Input SHA-256: fbdc9a5f21b9db1bf2eacdea60763e8795650bc121c631923c4856537353d4f0

These findings describe the supplied incident records. They require human review before publication.

## HOME-01: The MIT AI Incident Tracker classifies 1,600 real-world report incidents from the AI Incident Database by risk, cause, harm, severity, and other relevant dimensions.

Status: Update needed

**Proposed wording**

The MIT AI Incident Tracker classifies incident records from the AI Incident Database by risk, cause, harm, severity, and other dimensions.

**Assessment reason**

The export contains 1,698 unique incident records. The static HTML fallback says 1,600; the latest rendered page shows 1,698. The live mirror nevertheless has different classifications. A static numerical claim should state its snapshot date or use the verified dynamic count.

**Interpretation**

Static HTML fallback count versus the live count the page renders from the mirror's sync status; observed once in headless Chromium during the v2 review.

**Limitations**

- Update the static fallback when editing the page. The mirror syncs daily. A claim that the count updates nightly needs confirmation from the maintainers.
- Unit: incident records. Counts of distinct reports or events require separate verification.

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker

**Chart settings**

```json
{
  "browser_observation": {
    "engine": "Chromium (Playwright chrome-headless-shell 1208, --dump-dom, no interaction)",
    "observed_at_utc": "2026-09-27T23:11Z",
    "rendered_count": 1697,
    "source": "review/fable/scratch/v2-site-maintainer/render/home_dom.html (and r2-charts-claims/live/render/home_dom.html at 22:49Z)"
  },
  "handler": "dataset_size",
  "interpretation": "Static HTML fallback count versus the live count the page renders from the mirror's sync status; observed once in headless Chromium during the v2 review.",
  "published_count": 1600
}
```

**Calculation evidence**

- claim.HOME-01.size: 1698 / 1698 (100.00%). Contributing IDs: run/evidence/id_sets/be5f4d38501ee262cc38218b465566950d7fb116edab0ffe8df46cce60eaa3ae.json

Model review: {"chart_review": "Not chart-based. The static fallback and any live counter should carry the same 'as of' date.", "disposition": "revise", "evidence_ids": ["claim.HOME-01.size"], "issues": ["Count stale against the export.", "Unit confusion between reports and incident records.", "No 'as of' date."], "item_id": "HOME-01", "item_type": "published_claim", "numerical_review": "The export holds 1,698 unique incident records (claim.HOME-01.size); the static page text says 1,600, a shortfall of 98. Supplied context reports a headless render showing 1,697 on 2026-09-27 and the mirror at 1,698 on 2026-09-28 (SITE-MIRROR-DIFFERENCE); those renders were not repeated here. The ID-prefix proxy dating 1,600 to about July 2026 is unverified and not needed for the correction.", "suggested_revision": "The MIT AI Incident Tracker classifies incident records from the AI Incident Database by risk, cause, harm, severity and other dimensions; the September 27, 2026 export contains 1,698 incident records. [If a live counter is used, show its 'as of' date.]", "wording_review": "'1,600 real-world report incidents' is stale and mixes units: the tracker counts incident records, not reports. 'classifies' is fine."}

## HOME-02: AI incidents are on the rise, yet current databases struggle with inconsistent structure, limiting their utility for policymaking. The AI Incident Tracker project addresses this by creating a tool to classify AI incidents based on risks and harm severity. Raw reports from the AI Incident Database (AIID) are processed by Arcola AI's LLM pipeline, which categorizes them using established frameworks, such as the MIT Risk Repository and a harm severity rating system based on CSET’s AI Harm Taxonomy.

Status: Unresolved

**Proposed wording**

The AI Incident Tracker adds structure to reports in the AI Incident Database. Arcola AI’s classification pipeline assigns risk and harm categories so researchers can examine the composition of reported incidents. Changes in database counts can reflect reporting and coverage as well as underlying events.

**Assessment reason**

No time window or population exposure denominator is stated. Contextual complete-year record counts: 2021: 80/80 (100.0%); 2022: 108/108 (100.0%); 2023: 179/179 (100.0%); 2024: 304/304 (100.0%); 2025: 452/452 (100.0%). Primary system-safety domain: 378/1,698 (22.3%). Classifier missing-information flag: 42/1,698 (2.5%), which is not a measure of all reporting omissions.

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**

- Undefined population/time window
- Database prevalence is not population prevalence

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker

**Chart settings**

```json
{
  "context_years": [
    2021,
    2025
  ],
  "handler": "unbounded_rise"
}
```

**Calculation evidence**

- claim.HOME-02.context_counts.2021: 80 / 80 (100.00%). Contributing IDs: run/evidence/id_sets/2a5fd76ecf8462165b63482aaf2825823bba56be9373a658e8c28dc8a1d5edd4.json
- claim.HOME-02.context_counts.2022: 108 / 108 (100.00%). Contributing IDs: run/evidence/id_sets/a28ca161f928be1430fe39082b3d991256c81d397beef9c7bd756fd6ed080b2e.json
- claim.HOME-02.context_counts.2023: 179 / 179 (100.00%). Contributing IDs: run/evidence/id_sets/e02f35d7ae74027367d5df23c5287af40834633dd2af6102ffaa92cbcb12b4e7.json
- claim.HOME-02.context_counts.2024: 304 / 304 (100.00%). Contributing IDs: run/evidence/id_sets/b4bc9f0a4b0410b8f1e8c225191dcedf2cbfe1160567e475cf603de291d35b76.json
- claim.HOME-02.context_counts.2025: 452 / 452 (100.00%). Contributing IDs: run/evidence/id_sets/a118863422bb3a59189126e006519c5001086ab4aa3057f87165c2953de7a042.json
- claim.HOME-02.primary_safety: 378 / 1698 (22.26%). Contributing IDs: run/evidence/id_sets/8a619e2b1def4939909f61e676ebf15a3e96382e5f347e7c3c2f98a5c667a5a3.json
- claim.HOME-02.missing_information_flag: 42 / 1698 (2.47%). Contributing IDs: run/evidence/id_sets/f70bec9090312c289dccf0b1f82261777a0043f1be5ea071a6f3ad4ba1372435.json

Model review: {"chart_review": "Not chart-based.", "disposition": "revise", "evidence_ids": ["claim.HOME-02.context_counts.2021", "claim.HOME-02.context_counts.2022", "claim.HOME-02.context_counts.2023", "claim.HOME-02.context_counts.2024", "claim.HOME-02.context_counts.2025", "claim.HOME-02.primary_safety", "claim.HOME-02.missing_information_flag", "candidate.IT-C001.sensitivity2.2020"], "issues": ["Population incidence is not measurable from this database.", "No time window.", "Framework references are unverifiable from the export."], "item_id": "HOME-02", "item_type": "published_claim", "numerical_review": "'AI incidents are on the rise' has no population, window or exposure denominator. Database record counts rose from 80 (2021) to 452 (2025) (claim.HOME-02.context_counts.2021 to .2025), but 2020 had 92 records (candidate.IT-C001.sensitivity2.2020), so even the record series is not monotone from 2020. Primary system-safety domain 378/1,698 (22.3%) and the missing-information flag 42/1,698 (2.5%) (primary_safety, missing_information_flag) do not bear on the sentence. The pipeline and framework statements are process descriptions the export cannot verify beyond the model_name field.", "suggested_revision": "The number of AI incident records in the AI Incident Database dated each year rose from 80 in 2021 to 452 in 2025 (September 27, 2026 export); these counts reflect reporting and coverage as well as underlying events. Databases of such reports vary in structure, which limits their use for policymaking. The AI Incident Tracker classifies AIID reports with Arcola AI's LLM pipeline using the MIT Risk Repository and a harm-severity rating based on CSET's AI Harm Taxonomy.", "wording_review": "The opening clause asserts real-world incidence from a voluntary, selectively reported collection; that is the overclaim. The remainder is descriptive and can stand with a source citation."}

## HOME-06: Key visualizations include bar charts and pie charts that display incident counts, proportions across domains (e.g., "System Failures," "Discrimination & Toxicity"), and trends in causal attributes. Additionally, insights highlight patterns such as the prevalence of system safety issues, intentional misuse trends, and incomplete reporting gaps.

Status: Unresolved

**Proposed wording**

The charts show incident counts and distributions across risk domains, causal classifications, and harm assessments. Some views count multiple assignments per incident. Their percentages use all assignments as the denominator. These patterns describe the database; they do not establish how common AI harms are across society.

**Assessment reason**

No time window or population exposure denominator is stated. Contextual complete-year record counts: 2021: 80/80 (100.0%); 2022: 108/108 (100.0%); 2023: 179/179 (100.0%); 2024: 304/304 (100.0%); 2025: 452/452 (100.0%). Primary system-safety domain: 378/1,698 (22.3%). Classifier missing-information flag: 42/1,698 (2.5%), which is not a measure of all reporting omissions.

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**

- Undefined population/time window
- Database prevalence is not population prevalence

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker

**Chart settings**

```json
{
  "context_years": [
    2021,
    2025
  ],
  "handler": "qualitative_frame"
}
```

**Calculation evidence**

- claim.HOME-06.context_counts.2021: 80 / 80 (100.00%). Contributing IDs: run/evidence/id_sets/2a5fd76ecf8462165b63482aaf2825823bba56be9373a658e8c28dc8a1d5edd4.json
- claim.HOME-06.context_counts.2022: 108 / 108 (100.00%). Contributing IDs: run/evidence/id_sets/a28ca161f928be1430fe39082b3d991256c81d397beef9c7bd756fd6ed080b2e.json
- claim.HOME-06.context_counts.2023: 179 / 179 (100.00%). Contributing IDs: run/evidence/id_sets/e02f35d7ae74027367d5df23c5287af40834633dd2af6102ffaa92cbcb12b4e7.json
- claim.HOME-06.context_counts.2024: 304 / 304 (100.00%). Contributing IDs: run/evidence/id_sets/b4bc9f0a4b0410b8f1e8c225191dcedf2cbfe1160567e475cf603de291d35b76.json
- claim.HOME-06.context_counts.2025: 452 / 452 (100.00%). Contributing IDs: run/evidence/id_sets/a118863422bb3a59189126e006519c5001086ab4aa3057f87165c2953de7a042.json
- claim.HOME-06.primary_safety: 378 / 1698 (22.26%). Contributing IDs: run/evidence/id_sets/8a619e2b1def4939909f61e676ebf15a3e96382e5f347e7c3c2f98a5c667a5a3.json
- claim.HOME-06.missing_information_flag: 42 / 1698 (2.47%). Contributing IDs: run/evidence/id_sets/f70bec9090312c289dccf0b1f82261777a0043f1be5ea071a6f3ad4ba1372435.json
- claim.HOME-06.intentional_context.2021: 17 / 80 (21.25%). Contributing IDs: run/evidence/id_sets/0807a7ebb7966ae50768564e0c7ef06e80d578680720917e84eba5a137ce9e17.json
- claim.HOME-06.intentional_context.2022: 36 / 108 (33.33%). Contributing IDs: run/evidence/id_sets/03f645c5589947b9c25156ec990cf9a48c288cd555006278bb445013f650ec6d.json
- claim.HOME-06.intentional_context.2023: 90 / 179 (50.28%). Contributing IDs: run/evidence/id_sets/330d8e653e424b2407b3d5659a71b669b459802437eacae349bdeb07ee8b8fbb.json
- claim.HOME-06.intentional_context.2024: 192 / 304 (63.16%). Contributing IDs: run/evidence/id_sets/48366498fbb30bcbb1b7b073e001e1cc3035ecfac61d4ddd4df94e2432b28a91.json
- claim.HOME-06.intentional_context.2025: 291 / 452 (64.38%). Contributing IDs: run/evidence/id_sets/1003f6e46054c29b5df8226a6a545297d0583f231a68089c0ca68751caf1f69c.json

Model review: {"chart_review": "Bar and pie charts exist per the site checks. The example label 'System Failures' does not match the taxonomy string '7 AI system safety, failures, & limitations'.", "disposition": "revise", "evidence_ids": ["claim.HOME-06.primary_safety", "claim.HOME-06.missing_information_flag", "claim.HOME-06.intentional_context.2021", "claim.HOME-06.intentional_context.2025", "claim.HOME-06.context_counts.2021", "claim.HOME-06.context_counts.2025"], "issues": ["'prevalence' implies population measurement.", "'incomplete reporting gaps' is not measured; the 2.5% flag is a classifier field.", "Domain label does not match the taxonomy."], "item_id": "HOME-06", "item_type": "published_claim", "numerical_review": "The empirical hooks are: system-safety domain 7 is the second-most frequent primary domain at 378/1,698 (22.3%) (claim.HOME-06.primary_safety); intentional tags rose from 17/80 (21.25%) in 2021 to 291/452 (64.4%) in 2025 (intentional_context.2021 to .2025); the missing-information flag is 42/1,698 (2.5%) (missing_information_flag) and measures classifier-flagged gaps, not reporting completeness.", "suggested_revision": "Key visualizations include bar and pie charts of incident-record counts and proportions across risk domains (for example '7 AI system safety, failures, & limitations' and '1 Discrimination & Toxicity') and of causal attributes over time. The accompanying notes describe patterns in the recorded classifications, such as the share of records tagged to system-safety failures and to intentional causes. They describe this database; they do not measure how common AI incidents are or how completely they are reported.", "wording_review": "'prevalence of system safety issues' and 'incomplete reporting gaps' imply measurements the export cannot supply; 'trends in causal attributes' describes database tags."}

## TIME-01: There has been a clear rise year on year in the proportion of incidents each year between 2021 and 2025 associated with 4.3 Fraud, scams and targeted manipulation

Status: Supported

**Proposed wording**

Among records dated 2021–2025, the share with the primary subdomain “4.3 Fraud, scams, and targeted manipulation” rose each year, from 3 of 80 (3.75%) in 2021 to 192 of 452 (42.48%) in 2025.

**Assessment reason**

Primary: 2021: 3/80 (3.8%); 2022: 13/108 (12.0%); 2023: 38/179 (21.2%); 2024: 105/304 (34.5%); 2025: 192/452 (42.5%). Any-label incident denominator: 2021: 6/80 (7.5%); 2022: 17/108 (15.7%); 2023: 56/179 (31.3%); 2024: 131/304 (43.1%); 2025: 227/452 (50.2%). Endpoint change +38.73 percentage points; counts change +189. 2026 year-to-date through 2026-09-27 (incomplete year, provided as context and excluded from whole-year comparisons): 70/231 (30.3%).

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**

- Some annual category counts are below the new-candidate minimum; the published claim is still audited.

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-timeline

**Chart settings**

```json
{
  "direction": "up",
  "handler": "subdomain_trend",
  "strict_annual": true,
  "subdomain": "4.3",
  "years": [
    2021,
    2025
  ]
}
```

**Calculation evidence**

- claim.TIME-01.primary.2021: 3 / 80 (3.75%). Contributing IDs: run/evidence/id_sets/a3d68aa896d32e729a66941cee18c1399615e77b65a1da6d6f4ad13016b94fe2.json
- claim.TIME-01.primary.2022: 13 / 108 (12.04%). Contributing IDs: run/evidence/id_sets/8f195492860b2a569677df6ef247743384e034d52a192c2a0c79c1d014ebe63b.json
- claim.TIME-01.primary.2023: 38 / 179 (21.23%). Contributing IDs: run/evidence/id_sets/85a2c36774f84597ba3241887a8a62d97cf6dae650ddca04a7ad0476cce67949.json
- claim.TIME-01.primary.2024: 105 / 304 (34.54%). Contributing IDs: run/evidence/id_sets/4408058e82a13e49010984ead260959dee4e5e50c219aae64fc24eecdad53f8f.json
- claim.TIME-01.primary.2025: 192 / 452 (42.48%). Contributing IDs: run/evidence/id_sets/d5f8de4f4d187fad66e2999a7c3c2964f13d4750e95ccbe2c96252395e2fa944.json
- claim.TIME-01.any.2021: 6 / 80 (7.50%). Contributing IDs: run/evidence/id_sets/f588565d000f1d8cac1a102532a35faf59b9dc7356f3d2acaf1c9ed342882573.json
- claim.TIME-01.any.2022: 17 / 108 (15.74%). Contributing IDs: run/evidence/id_sets/dba6870359c254f4626f31b3d803bc81122b9c68a90d3424e098f45be6143bb6.json
- claim.TIME-01.any.2023: 56 / 179 (31.28%). Contributing IDs: run/evidence/id_sets/bb8bd9998935a04a70ad1f930f6e04d5a6d8f397a47687e4a2b90f1eed8e7434.json
- claim.TIME-01.any.2024: 131 / 304 (43.09%). Contributing IDs: run/evidence/id_sets/a505aeda7d36f0df47e0e5d8f2ad67fe7388cfc773fd3b86f45b87ced77a2d81.json
- claim.TIME-01.any.2025: 227 / 452 (50.22%). Contributing IDs: run/evidence/id_sets/b6f7a95063cb7332538e3013e8293a4a3692f6cebab272f2b966631aa1e20061.json
- claim.TIME-01.ytd_primary: 70 / 231 (30.30%). Contributing IDs: run/evidence/id_sets/1a1f44b24635923b82d93a47d480e89c679bcabbf51dd13e6e3adafd6aa7be08.json

Model review: {"chart_review": "C02 primary-subdomain proportions over exact years 2021 to 2025 with all series visible shows the primary series; the any-label series has no faithful chart, and the 'All Subdomains' view shows assignment shares, a different quantity.", "disposition": "pass", "evidence_ids": ["claim.TIME-01.primary.2021", "claim.TIME-01.primary.2022", "claim.TIME-01.primary.2023", "claim.TIME-01.primary.2024", "claim.TIME-01.primary.2025", "claim.TIME-01.any.2021", "claim.TIME-01.any.2022", "claim.TIME-01.any.2023", "claim.TIME-01.any.2024", "claim.TIME-01.any.2025", "claim.TIME-01.ytd_primary"], "issues": ["'associated with' does not say primary or any-label; both hold, but the two series differ by up to 10 points.", "2021 baseline is 3 primary records."], "item_id": "TIME-01", "item_type": "published_claim", "numerical_review": "Primary 4.3 share rises every year: 3/80 (3.75%), 13/108 (12.0%), 38/179 (21.2%), 105/304 (34.5%), 192/452 (42.5%) (claim.TIME-01.primary.2021 to .2025); smallest step 7.9 points. Any-label share also rises every year: 6/80 (7.5%), 17/108 (15.7%), 56/179 (31.3%), 131/304 (43.1%), 227/452 (50.2%) (any.2021 to .2025). The claim holds under either reading of 'associated with'. 2021 rests on 3 (primary) or 6 (any-label) records. 2026 year-to-date 70/231 (30.3%) is context only (ytd_primary).", "suggested_revision": "Among incident records dated 2021 to 2025, the share whose primary subdomain is '4.3 Fraud, scams, and targeted manipulation' rose every year, from 3 of 80 (3.75%) in 2021 to 192 of 452 (42.5%) in 2025 (September 27, 2026 export). Counting any risk tag rather than only the primary one, the share rose from 6 of 80 (7.5%) to 227 of 452 (50.2%). These are shares of records in this database, not measures of how common such incidents are.", "wording_review": "Supported. 'clear' is editorial but the steps are large. Naming 'primary subdomain' and 'incident records in the database' would remove ambiguity."}

## TIME-02: The proportion of reported incidents attributed to lack of capability or robustness has been decreasing between 2021 and 2025

Status: Supported

**Proposed wording**

Among records dated 2021–2025, the share with the primary subdomain “7.3 Lack of capability or robustness” fell each year, from 33 of 80 (41.25%) to 45 of 452 (9.96%). The count increased, so the falling share does not establish improved AI robustness.

**Assessment reason**

Primary: 2021: 33/80 (41.2%); 2022: 33/108 (30.6%); 2023: 37/179 (20.7%); 2024: 44/304 (14.5%); 2025: 45/452 (10.0%). Any-label incident denominator: 2021: 53/80 (66.2%); 2022: 62/108 (57.4%); 2023: 72/179 (40.2%); 2024: 108/304 (35.5%); 2025: 121/452 (26.8%). Endpoint change -31.29 percentage points; counts change +12. 2026 year-to-date through 2026-09-27 (incomplete year, provided as context and excluded from whole-year comparisons): 43/231 (18.6%).

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified. ‘Decreasing between’ is assessed as an endpoint statement; stricter annual decline and absolute counts are checked separately.

**Limitations**


**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-timeline

**Chart settings**

```json
{
  "direction": "down",
  "handler": "subdomain_trend",
  "strict_annual": false,
  "subdomain": "7.3",
  "years": [
    2021,
    2025
  ]
}
```

**Calculation evidence**

- claim.TIME-02.primary.2021: 33 / 80 (41.25%). Contributing IDs: run/evidence/id_sets/54c8d56d9e31220b944cfd82442269aeb7bdec4d92fefa31512a3f427df8d4cc.json
- claim.TIME-02.primary.2022: 33 / 108 (30.56%). Contributing IDs: run/evidence/id_sets/ea9992dddfdbeebc47a18f7ef56dd767ae87e60a808f4fde5b9842b974a21ef0.json
- claim.TIME-02.primary.2023: 37 / 179 (20.67%). Contributing IDs: run/evidence/id_sets/5fede23a23a38e6a570f4ed91630bc5621dda3b691dd14867f41c7d5bd942236.json
- claim.TIME-02.primary.2024: 44 / 304 (14.47%). Contributing IDs: run/evidence/id_sets/70af92ce89d1c28d3d5d0fa167e44e86a9961b99b29e20dedeb5b13c8ca631c1.json
- claim.TIME-02.primary.2025: 45 / 452 (9.96%). Contributing IDs: run/evidence/id_sets/dc063dc2593e4939bbc9abfc820223b3607a999898f96f3d2ea6901851654c36.json
- claim.TIME-02.any.2021: 53 / 80 (66.25%). Contributing IDs: run/evidence/id_sets/2ba6471baf6ab129ddb8e05cd91932f600ae5fa0a0acf20aa8841eae1c02a5e3.json
- claim.TIME-02.any.2022: 62 / 108 (57.41%). Contributing IDs: run/evidence/id_sets/55a8f6dd2021c61f2fbe84bcc8fbe6a0c8e17fb7bce585c6a09eb1624b10308a.json
- claim.TIME-02.any.2023: 72 / 179 (40.22%). Contributing IDs: run/evidence/id_sets/1eacdbb3f4d8813b64286ad3d37227c331e7027953b7bafbf026f0fe0eb9c328.json
- claim.TIME-02.any.2024: 108 / 304 (35.53%). Contributing IDs: run/evidence/id_sets/65d1508498f60409d764617517405806d3979a85eef69bf80f9e4df194e00698.json
- claim.TIME-02.any.2025: 121 / 452 (26.77%). Contributing IDs: run/evidence/id_sets/e144183da5e9c34ffccd78de1260576b7778d2288b01e34c411491b0fe851be0.json
- claim.TIME-02.ytd_primary: 43 / 231 (18.61%). Contributing IDs: run/evidence/id_sets/56dddb07d8fc5270f967be7ed1b06f10ebf86dc9fbc66c743d764776e1ab7c00.json

Model review: {"chart_review": "As TIME-01: C02 primary proportions over exact years; the any-label series has no faithful chart.", "disposition": "pass", "evidence_ids": ["claim.TIME-02.primary.2021", "claim.TIME-02.primary.2022", "claim.TIME-02.primary.2023", "claim.TIME-02.primary.2024", "claim.TIME-02.primary.2025", "claim.TIME-02.any.2021", "claim.TIME-02.any.2022", "claim.TIME-02.any.2023", "claim.TIME-02.any.2024", "claim.TIME-02.any.2025", "claim.TIME-02.ytd_primary"], "issues": ["Scope (primary versus any-label) unstated.", "Risk of a causal reading; counts rose while the share fell."], "item_id": "TIME-02", "item_type": "published_claim", "numerical_review": "Primary 7.3 share falls every year: 41.25%, 30.6%, 20.7%, 14.5%, 10.0% (claim.TIME-02.primary.2021 to .2025); any-label share falls every year: 66.25%, 57.4%, 40.2%, 35.5%, 26.8% (any.2021 to .2025). Counts rose 33 to 45 (primary) and 53 to 121 (any-label). 2026 year-to-date 43/231 (18.6%) is context only (ytd_primary).", "suggested_revision": "Among incident records dated 2021 to 2025, the share whose primary subdomain is '7.3 Lack of capability or robustness' fell every year, from 33 of 80 (41.25%) in 2021 to 45 of 452 (10.0%) in 2025, while the number of such records rose from 33 to 45 (September 27, 2026 export). The falling share reflects faster growth in other categories; it is not evidence that AI systems became more robust.", "wording_review": "Supported as a proportion statement under either reading. It must not be repeated elsewhere as robustness improving; adding the rising counts prevents that reading."}

## TIME-03: Numbers of reported incidents attributed to systems whose purpose is video, voice or image generation have increased dramatically since 2022, now totalling around half reported incidents.

Status: Unresolved

**Proposed wording**

Among incident records dated in each year, the number with a primary-purpose tag of Deepfake Video Generation, Deepfake Image Generation, Voice Generation, or Image Generation rose from 19 of 108 records (17.6%) in 2022 to 239 of 452 (52.9%) in 2025. These four tags define the group used in this comparison.

**Assessment reason**

strict_primary: 2022: 19/108 (17.6%); 2023: 74/179 (41.3%); 2024: 147/304 (48.4%); 2025: 239/452 (52.9%); expanded_primary: 2022: 22/108 (20.4%); 2023: 75/179 (41.9%); 2024: 148/304 (48.7%); 2025: 243/452 (53.8%); strict_primary_secondary: 2022: 23/108 (21.3%); 2023: 77/179 (43.0%); 2024: 161/304 (53.0%); 2025: 256/452 (56.6%). All-date narrow share: 601/1,698 (35.4%); incomplete 2026: 101/231 (43.7%) (not a full-year comparison).

**Interpretation**

No original purpose set or dated meaning of ‘now’ is supplied. The analyst chose the named purpose sets to examine alternative interpretations.

**Limitations**

- ‘Dramatically’ and ‘around half’ have no predeclared quantitative threshold.
- Fix ‘now’, the year, primary/secondary scope, and purpose set before passing/failing the prose.

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-timeline

**Chart settings**

```json
{
  "context_years": [
    2022,
    2025
  ],
  "definition_source": "config/analysis.json strict/expanded purpose lists; definitions chosen for this analysis",
  "handler": "generation_ambiguity"
}
```

**Calculation evidence**

- claim.TIME-03.strict_primary.2022: 19 / 108 (17.59%). Contributing IDs: run/evidence/id_sets/1ab53d8b9d895161fd4f3c153a7a81b5a3e24c51b044e544238c097aaad25207.json
- claim.TIME-03.strict_primary.2023: 74 / 179 (41.34%). Contributing IDs: run/evidence/id_sets/6427302ff6b5cf60d68a08d168d1eea661481f04efd7de79f946ecc6a08ded45.json
- claim.TIME-03.strict_primary.2024: 147 / 304 (48.36%). Contributing IDs: run/evidence/id_sets/1b97bf48136af55fe43939c5a93ba217ff9aaf58a2da13cd8c5995de129cdccb.json
- claim.TIME-03.strict_primary.2025: 239 / 452 (52.88%). Contributing IDs: run/evidence/id_sets/4399c404bda9c6a9ac5be5032e44c9e93c3df6ed9b6b2d9787dd8d59970eb873.json
- claim.TIME-03.expanded_primary.2022: 22 / 108 (20.37%). Contributing IDs: run/evidence/id_sets/bf2501d0e6b421a5c65066d0dc564ab1e2b5275dbc02d386e71f92da62908d17.json
- claim.TIME-03.expanded_primary.2023: 75 / 179 (41.90%). Contributing IDs: run/evidence/id_sets/c89b7f94ca760a91c7738df70ba4a40e3c73316833635d13ac95e408746216b4.json
- claim.TIME-03.expanded_primary.2024: 148 / 304 (48.68%). Contributing IDs: run/evidence/id_sets/6fd221961c2583b8d342a2cef79fb7cf8372e0a27bff126fa67bd70de1d39809.json
- claim.TIME-03.expanded_primary.2025: 243 / 452 (53.76%). Contributing IDs: run/evidence/id_sets/c214eb098a8f996fc99dc8db815d24e806b476c91c087bbcae3a25c40ede820d.json
- claim.TIME-03.strict_primary_secondary.2022: 23 / 108 (21.30%). Contributing IDs: run/evidence/id_sets/5657c2ef1f7f852544d0d64684a79a2da1ad702bdfcfb21326cd09b5a7e2b96d.json
- claim.TIME-03.strict_primary_secondary.2023: 77 / 179 (43.02%). Contributing IDs: run/evidence/id_sets/955a173d0ba0fe9b12d71f3ec7d338802a1c65a3bcf93c50dba3930ecc043304.json
- claim.TIME-03.strict_primary_secondary.2024: 161 / 304 (52.96%). Contributing IDs: run/evidence/id_sets/173846e6d14202d0bf92c605703765d79cf65807b33b44652349ec3ab1dc2341.json
- claim.TIME-03.strict_primary_secondary.2025: 256 / 452 (56.64%). Contributing IDs: run/evidence/id_sets/3322e0866ebd46fd078e9c8e380d097249061fc7ca67ab49bf86349d314dd27c.json
- claim.TIME-03.strict_all_dates: 601 / 1698 (35.39%). Contributing IDs: run/evidence/id_sets/a77b26b5ffdd297b73c1b682be8687ef5793b204eb2872923f2a94aa06de7a26.json
- claim.TIME-03.strict_partial_current_year: 101 / 231 (43.72%). Contributing IDs: run/evidence/id_sets/2fcec7a3146695cf7d637d89b386b48cc545f01299e4131c429bb68fd3ae0d8d.json

Model review: {"chart_review": "C03 pie by aiGoal shows primary purposes for a chosen window; the four-purpose union requires summing slices. A timeline count view needs a host preset to fix years.", "disposition": "revise", "evidence_ids": ["claim.TIME-03.strict_primary.2022", "claim.TIME-03.strict_primary.2023", "claim.TIME-03.strict_primary.2024", "claim.TIME-03.strict_primary.2025", "claim.TIME-03.expanded_primary.2022", "claim.TIME-03.expanded_primary.2025", "claim.TIME-03.strict_primary_secondary.2022", "claim.TIME-03.strict_primary_secondary.2025", "claim.TIME-03.strict_all_dates", "claim.TIME-03.strict_partial_current_year"], "issues": ["'now' undefined; the true value ranges from 35% (all records) to 53% to 57% (2025).", "Purpose set undefined; the three supplied definitions differ by up to 4 points in 2025.", "'Numbers ... increased' followed by 'totalling around half' mixes counts and shares."], "item_id": "TIME-03", "item_type": "published_claim", "numerical_review": "With primary purpose in {Deepfake Video Generation, Deepfake Image Generation, Voice Generation, Image Generation}: 19/108 (17.6%) in 2022, 74/179 (41.3%), 147/304 (48.4%), 239/452 (52.9%) in 2025 (claim.TIME-03.strict_primary.2022 to .2025). Expanded purpose set: 22, 75, 148, 243 (53.8%) (expanded_primary.*). Primary-or-secondary: 23, 77, 161, 256 (56.6%) (strict_primary_secondary.*). All dates: 601/1,698 (35.4%) (strict_all_dates); 2026 year-to-date 101/231 (43.7%) (strict_partial_current_year). 'around half' holds only if 'now' means records dated 2025; it fails for all records (35%) and is marginal for 2026 to date (44%).", "suggested_revision": "Incident records whose primary AI purpose is tagged Deepfake Video Generation, Deepfake Image Generation, Voice Generation or Image Generation rose from 19 of 108 records dated 2022 (17.6%) to 239 of 452 records dated 2025 (52.9%) in the September 27, 2026 export. Across all records in the export they are 601 of 1,698 (35.4%).", "wording_review": "'dramatically', 'now' and the purpose set are undefined. The count increase (19 to 239) is large under any supplied definition, but the 'around half' clause depends on the endpoint chosen, and the sentence mixes counts with a share."}

## TIME-04: The proportion of incidents classified as level 1 (Unacceptable) under the EU AI Act increased each year since 2022, reaching 4% in 2025]

Status: Unsupported

**Proposed wording**

Among incident records dated in each year, the share tagged EU AI Act tier 1, “Unacceptable,” was 3 of 108 (2.8%) in 2022, 9 of 179 (5.0%) in 2023, 15 of 304 (4.9%) in 2024, and 24 of 452 (5.3%) in 2025. It did not increase every year. These automated tags are not legal determinations.

**Assessment reason**

2022: 3/108 (2.8%); 2023: 9/179 (5.0%); 2024: 15/304 (4.9%); 2025: 24/452 (5.3%). Adjacent changes use unrounded fractions: 2023→2024 (-0.09 pp; within one record). Years before the claim's window (context only; small cells): 2016: 2/41 (4.9%); 2017: 2/50 (4.0%); 2018: 4/46 (8.7%); 2019: 6/44 (13.6%); 2020: 6/92 (6.5%); 2021: 7/80 (8.8%). 2022 is the lowest year of 2016–2025. 2026 year-to-date through 2026-09-27 (incomplete year, provided as context and excluded from whole-year comparisons): 4/231 (1.7%). A model assigned these tiers. Establishing a legal classification requires a separate assessment.

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**

- Remove literal trailing bracket
- Legal applicability/prohibition is not independently established
- Temporal applicability for the human legal reviewer: confirm from which date the Act's prohibitions applied; most tier-1-tagged records are dated before 2025.

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-timeline

**Chart settings**

```json
{
  "context_years_before": 6,
  "handler": "eu_annual",
  "level": "1",
  "published_endpoint_percent": 4,
  "rounding_decimals": 0,
  "years": [
    2022,
    2025
  ]
}
```

**Calculation evidence**

- claim.TIME-04.level1.2022: 3 / 108 (2.78%). Contributing IDs: run/evidence/id_sets/77ad194c2265493cd48f72598b2be6e2769d01a42fb4885d76bbf0d937a5933b.json
- claim.TIME-04.level1.2023: 9 / 179 (5.03%). Contributing IDs: run/evidence/id_sets/a2f8190d69b34fe9dbbc8f6702dc47237f0cdc49dc8e446449c6a8f96912b607.json
- claim.TIME-04.level1.2024: 15 / 304 (4.93%). Contributing IDs: run/evidence/id_sets/9e318bf650d28f2c5771cf016961eb5b1e8328aea8f3e5687c3c8fd0b36ad830.json
- claim.TIME-04.level1.2025: 24 / 452 (5.31%). Contributing IDs: run/evidence/id_sets/f616dc6ea9f283257a5d3afe38b659d2a1fe7af34cecc6103466716ecc06ebcd.json
- claim.TIME-04.level1_context_before.2016: 2 / 41 (4.88%). Contributing IDs: run/evidence/id_sets/a9e27ef61f6c06a395966549cc37abd39b1512e8aef69c2e952ff453bc68634e.json
- claim.TIME-04.level1_context_before.2017: 2 / 50 (4.00%). Contributing IDs: run/evidence/id_sets/348c7ea231693efe59dfdf7924485753fae725d844f56bda2f4724653debbfe1.json
- claim.TIME-04.level1_context_before.2018: 4 / 46 (8.70%). Contributing IDs: run/evidence/id_sets/90c5ca6255cd520d743bde98153979e0108a75f26933eecb475a861b4a6a181c.json
- claim.TIME-04.level1_context_before.2019: 6 / 44 (13.64%). Contributing IDs: run/evidence/id_sets/a00d59700e7514e55f9bf758f02c859547689f89f8ab07a998d2a6462a83deda.json
- claim.TIME-04.level1_context_before.2020: 6 / 92 (6.52%). Contributing IDs: run/evidence/id_sets/85cbc71ccfcbac12d5f17f3c1365eb821786fb894a8f0eb2ab1e53b239e17927.json
- claim.TIME-04.level1_context_before.2021: 7 / 80 (8.75%). Contributing IDs: run/evidence/id_sets/a1328f5e44900acd46b79bd2d8d82adff7599d2ea8de77d50422e94002001d79.json
- claim.TIME-04.tier1.2022: 3 / 108 (2.78%). Contributing IDs: run/evidence/id_sets/77ad194c2265493cd48f72598b2be6e2769d01a42fb4885d76bbf0d937a5933b.json
- claim.TIME-04.tier2.2022: 47 / 108 (43.52%). Contributing IDs: run/evidence/id_sets/a76b36a1b66186dbd27266ed3db737bdaa2e67b30d24558f8938c8439d8b2594.json
- claim.TIME-04.tier3.2022: 40 / 108 (37.04%). Contributing IDs: run/evidence/id_sets/666d7d3fbdf72f5ceff689bde15fb3dce5e0b5a58a11e8756623fb9e93c0a30c.json
- claim.TIME-04.tier4.2022: 18 / 108 (16.67%). Contributing IDs: run/evidence/id_sets/92aaf2472b3519bd5b7f05254fa6aec24ae9ef882211cfaa157361b1fcfacbbf.json
- claim.TIME-04.tier1.2025: 24 / 452 (5.31%). Contributing IDs: run/evidence/id_sets/f616dc6ea9f283257a5d3afe38b659d2a1fe7af34cecc6103466716ecc06ebcd.json
- claim.TIME-04.tier2.2025: 36 / 452 (7.96%). Contributing IDs: run/evidence/id_sets/afd34555085677e9be7414a2ef2cb3b3f3f396dc895e80c7e1afe0f73588f121.json
- claim.TIME-04.tier3.2025: 374 / 452 (82.74%). Contributing IDs: run/evidence/id_sets/2d3b85d4127bc81d944cb404087283855054b655d95b9ea9f1b8917ca3d24888.json
- claim.TIME-04.tier4.2025: 18 / 452 (3.98%). Contributing IDs: run/evidence/id_sets/b1e411254e8793e480a58f4c6f71bd160efb65e0d362e5b0efc209eb03b85630.json
- claim.TIME-04.ytd_level1: 4 / 231 (1.73%). Contributing IDs: run/evidence/id_sets/39d4886a943be15b9d2fcca51a3dc28e190c4702f10705a873e5bfa5c8300024.json

Model review: {"chart_review": "A timeline stacked by EU AI Act tier with an exact-year preset would show the series if that grouping exists; any live reading will differ from the export after reclassification batches.", "disposition": "revise", "evidence_ids": ["claim.TIME-04.level1.2022", "claim.TIME-04.level1.2023", "claim.TIME-04.level1.2024", "claim.TIME-04.level1.2025", "claim.TIME-04.level1_context_before.2016", "claim.TIME-04.level1_context_before.2017", "claim.TIME-04.level1_context_before.2018", "claim.TIME-04.level1_context_before.2019", "claim.TIME-04.level1_context_before.2020", "claim.TIME-04.level1_context_before.2021", "claim.TIME-04.ytd_level1"], "issues": ["Monotonicity fails at 2023 to 2024 (5.0% to 4.9%).", "Endpoint is 5.3%, not 4%.", "Window starts at the 2016 to 2025 minimum.", "Tier tags are reclassified in batches; the EU tier was reportedly the pilot's weakest taxonomy, which was not verified here.", "Legal applicability and the Act's application dates are for human legal review."], "item_id": "TIME-04", "item_type": "published_claim", "numerical_review": "Tier-1 shares: 3/108 (2.8%) in 2022, 9/179 (5.0%) in 2023, 15/304 (4.9%) in 2024, 24/452 (5.3%) in 2025 (claim.TIME-04.level1.2022 to .2025). 2023 to 2024 falls by 0.09 points, so 'increased each year' fails by one record; '4% in 2025' is 5.3% in this export. Earlier years (level1_context_before.2016 to .2021): 4.9%, 4.0%, 8.7%, 13.6%, 6.5%, 8.75%; 2022 is the lowest year of 2016 to 2025, so the window starts at the trough. 2026 year-to-date 4/231 (1.7%) (ytd_level1). Supplied context reports eight records moved from tier 1 to tier 3 in one batch between the mirror sync and this export, about 8% of tier-1 records, so these tags move in batches.", "suggested_revision": "Incident records tagged tier 1 (Unacceptable) under the EU AI Act were 3 of 108 (2.8%) in 2022, 9 of 179 (5.0%) in 2023, 15 of 304 (4.9%) in 2024 and 24 of 452 (5.3%) in 2025 in the September 27, 2026 export; 2022 was the lowest year of 2016 to 2025. These are automated tags that are revised between exports, not legal determinations.", "wording_review": "Unsupported as written: neither the monotone increase nor the 4% endpoint reproduces. The trailing ']' is a typo. 'classified as level 1 (Unacceptable) under the EU AI Act' presents automated tags as legal classification. The original bullet should not stand; the replacement is optional and must carry the volatility caveat."}

## TIME-05: The proportion of intentionally caused incidents has increased each year from 2021-2025, as has the proportion attributed to Human rather than AI entities.

Status: Supported

**Proposed wording**

Among records dated 2021–2025, the share tagged Intentional rose each year, from 17 of 80 (21.25%) to 291 of 452 (64.38%). The share whose causal entity was tagged Human also rose each year, from 22 of 80 (27.5%) to 310 of 452 (68.58%). These tags are model assessments of causation.

**Assessment reason**

causal_intent: 2021: 17/80 (21.2%); 2022: 36/108 (33.3%); 2023: 90/179 (50.3%); 2024: 192/304 (63.2%); 2025: 291/452 (64.4%). causal_entity: 2021: 22/80 (27.5%); 2022: 41/108 (38.0%); 2023: 94/179 (52.5%); 2024: 198/304 (65.1%); 2025: 310/452 (68.6%). 2026 year-to-date through 2026-09-27 (incomplete year, provided as context and excluded from whole-year comparisons): 130/231 (56.3%); 2026 year-to-date through 2026-09-27 (incomplete year, provided as context and excluded from whole-year comparisons): 142/231 (61.5%).

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**


**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-timeline

**Chart settings**

```json
{
  "handler": "causal_annual",
  "targets": {
    "causal_entity": "Human",
    "causal_intent": "Intentional"
  },
  "years": [
    2021,
    2025
  ]
}
```

**Calculation evidence**

- claim.TIME-05.causal_intent.2021: 17 / 80 (21.25%). Contributing IDs: run/evidence/id_sets/0807a7ebb7966ae50768564e0c7ef06e80d578680720917e84eba5a137ce9e17.json
- claim.TIME-05.causal_intent.2022: 36 / 108 (33.33%). Contributing IDs: run/evidence/id_sets/03f645c5589947b9c25156ec990cf9a48c288cd555006278bb445013f650ec6d.json
- claim.TIME-05.causal_intent.2023: 90 / 179 (50.28%). Contributing IDs: run/evidence/id_sets/330d8e653e424b2407b3d5659a71b669b459802437eacae349bdeb07ee8b8fbb.json
- claim.TIME-05.causal_intent.2024: 192 / 304 (63.16%). Contributing IDs: run/evidence/id_sets/48366498fbb30bcbb1b7b073e001e1cc3035ecfac61d4ddd4df94e2432b28a91.json
- claim.TIME-05.causal_intent.2025: 291 / 452 (64.38%). Contributing IDs: run/evidence/id_sets/1003f6e46054c29b5df8226a6a545297d0583f231a68089c0ca68751caf1f69c.json
- claim.TIME-05.causal_intent.known.2021: 17 / 80 (21.25%). Contributing IDs: run/evidence/id_sets/0807a7ebb7966ae50768564e0c7ef06e80d578680720917e84eba5a137ce9e17.json
- claim.TIME-05.causal_intent.known.2022: 36 / 108 (33.33%). Contributing IDs: run/evidence/id_sets/03f645c5589947b9c25156ec990cf9a48c288cd555006278bb445013f650ec6d.json
- claim.TIME-05.causal_intent.known.2023: 90 / 179 (50.28%). Contributing IDs: run/evidence/id_sets/330d8e653e424b2407b3d5659a71b669b459802437eacae349bdeb07ee8b8fbb.json
- claim.TIME-05.causal_intent.known.2024: 192 / 304 (63.16%). Contributing IDs: run/evidence/id_sets/48366498fbb30bcbb1b7b073e001e1cc3035ecfac61d4ddd4df94e2432b28a91.json
- claim.TIME-05.causal_intent.known.2025: 291 / 452 (64.38%). Contributing IDs: run/evidence/id_sets/1003f6e46054c29b5df8226a6a545297d0583f231a68089c0ca68751caf1f69c.json
- claim.TIME-05.causal_entity.2021: 22 / 80 (27.50%). Contributing IDs: run/evidence/id_sets/581650193754514214b0d95259508b0fade5d7d30eefa91301dd2fb38049af32.json
- claim.TIME-05.causal_entity.2022: 41 / 108 (37.96%). Contributing IDs: run/evidence/id_sets/465d1b5c6a28d373ef60f906b07307e3a28cc9a5a57213237f6a27c384bd5c59.json
- claim.TIME-05.causal_entity.2023: 94 / 179 (52.51%). Contributing IDs: run/evidence/id_sets/11e7baedd668dcbb5623e85252b99154b27dee4430ad616145cc280b2edd7314.json
- claim.TIME-05.causal_entity.2024: 198 / 304 (65.13%). Contributing IDs: run/evidence/id_sets/c3598bfeef3cf4bc3c65e159bbbb21e8c281636656fdb2bfbc2df1ce80ad2e23.json
- claim.TIME-05.causal_entity.2025: 310 / 452 (68.58%). Contributing IDs: run/evidence/id_sets/92ef3fe87647c295cadb2beeadf9de1d72b342b02e5b0f52e24e9c16a8f01370.json
- claim.TIME-05.causal_entity.known.2021: 22 / 79 (27.85%). Contributing IDs: run/evidence/id_sets/581650193754514214b0d95259508b0fade5d7d30eefa91301dd2fb38049af32.json
- claim.TIME-05.causal_entity.known.2022: 41 / 108 (37.96%). Contributing IDs: run/evidence/id_sets/465d1b5c6a28d373ef60f906b07307e3a28cc9a5a57213237f6a27c384bd5c59.json
- claim.TIME-05.causal_entity.known.2023: 94 / 178 (52.81%). Contributing IDs: run/evidence/id_sets/11e7baedd668dcbb5623e85252b99154b27dee4430ad616145cc280b2edd7314.json
- claim.TIME-05.causal_entity.known.2024: 198 / 304 (65.13%). Contributing IDs: run/evidence/id_sets/c3598bfeef3cf4bc3c65e159bbbb21e8c281636656fdb2bfbc2df1ce80ad2e23.json
- claim.TIME-05.causal_entity.known.2025: 310 / 449 (69.04%). Contributing IDs: run/evidence/id_sets/92ef3fe87647c295cadb2beeadf9de1d72b342b02e5b0f52e24e9c16a8f01370.json
- claim.TIME-05.ytd_causal_intent: 130 / 231 (56.28%). Contributing IDs: run/evidence/id_sets/f79d015efc40af18bf59f0dac93c490d2df3dadaa81e3881d3d9f880609cae2c.json
- claim.TIME-05.ytd_causal_entity: 142 / 231 (61.47%). Contributing IDs: run/evidence/id_sets/12d5f8378897999073f199c1723331eaaeb714729f1a5283bf638624d90b63ca.json

Model review: {"chart_review": "A timeline stacked by causal intent or causal entity in proportions with an exact-year preset would show both series if those groupings exist; not verified here.", "disposition": "revise", "evidence_ids": ["claim.TIME-05.causal_intent.2021", "claim.TIME-05.causal_intent.2022", "claim.TIME-05.causal_intent.2023", "claim.TIME-05.causal_intent.2024", "claim.TIME-05.causal_intent.2025", "claim.TIME-05.causal_intent.known.2025", "claim.TIME-05.causal_entity.2021", "claim.TIME-05.causal_entity.2022", "claim.TIME-05.causal_entity.2023", "claim.TIME-05.causal_entity.2024", "claim.TIME-05.causal_entity.2025", "claim.TIME-05.causal_entity.known.2025", "claim.TIME-05.ytd_causal_intent", "claim.TIME-05.ytd_causal_entity"], "issues": ["Wording asserts cause; it should say 'tagged as'.", "2024 to 2025 intent step is 1.2 points.", "2026 year-to-date is lower for both series; context only."], "item_id": "TIME-05", "item_type": "published_claim", "numerical_review": "Intentional share rises every year: 17/80 (21.25%), 36/108 (33.3%), 90/179 (50.3%), 192/304 (63.2%), 291/452 (64.4%) (claim.TIME-05.causal_intent.2021 to .2025); the last step is 1.2 points, about five records. Known-only denominators are identical (causal_intent.known.*). Human causal-entity share rises every year: 22/80 (27.5%), 41/108 (38.0%), 94/179 (52.5%), 198/304 (65.1%), 310/452 (68.6%) (causal_entity.2021 to .2025); known-only 27.8, 38.0, 52.8, 65.1, 69.0% (causal_entity.known.*). 2026 year-to-date: 130/231 (56.3%) and 142/231 (61.5%), both below 2025 (ytd_causal_intent, ytd_causal_entity).", "suggested_revision": "Among incident records dated 2021 to 2025, the share tagged as intentionally caused rose each year, from 17 of 80 (21.25%) to 291 of 452 (64.4%), and the share whose causal entity is tagged Human rather than AI rose each year, from 22 of 80 (27.5%) to 310 of 452 (68.6%) (September 27, 2026 export). These are automated causal tags, not verified findings about intent.", "wording_review": "Numbers reproduce. 'intentionally caused incidents' states causation as fact; these are LLM-assigned tags and the pilot did not evaluate the current model. 'attributed to Human rather than AI' is acceptable shorthand for a rising Human share; the residual includes AI and a few Other or unknown values."}

## TIME-06: The overwhelming majority of incidents assessed were classified as post-deployment with no more than a few percent being pre-deployment in any year.

Status: Unresolved

**Proposed wording**

Across all dates in the export, 1,663 of 1,698 records (97.9%) are tagged Post-deployment, 32 (1.9%) are tagged Pre-deployment, and 3 are tagged Other. This overall distribution does not imply the same proportions in every year.

**Assessment reason**

Post-deployment overall: 1,663/1,698 (97.9%). Largest pre-deployment share across observed complete years: 1996 1/1 (100.0%). In the default chart's complete-year scope (2016–2025), maximum: 2016 4/41 (9.8%); full annual series in the component below. Sparse years and unstated scope/‘few’ definitions leave the parent wording ambiguous; see the literal-universe component. 2026 year-to-date (incomplete; context only): 8/231 (3.5%).

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**

- overwhelming majority
- few percent
- in any year

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-timeline

**Chart settings**

```json
{
  "context_start": 2016,
  "handler": "timing_any_year",
  "vague_terms": [
    "overwhelming majority",
    "few percent",
    "in any year"
  ]
}
```

**Calculation evidence**

- claim.TIME-06.pre.1983: 0 / 1 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1984: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1985: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1986: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1987: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1988: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1989: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1990: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1991: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1992: 0 / 1 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1993: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1994: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1995: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1996: 1 / 1 (100.00%). Contributing IDs: run/evidence/id_sets/46fe453cacc7a9f7d949ed2718b99fbc2c34e720799b77b11e2bceda8764c301.json
- claim.TIME-06.pre.1997: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1998: 0 / 1 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.1999: 0 / 1 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2000: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2001: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2002: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2003: 0 / 4 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2004: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2005: 0 / 0 (not applicable). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2006: 0 / 1 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2007: 0 / 1 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2008: 0 / 3 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2009: 0 / 2 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2010: 0 / 1 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2011: 1 / 3 (33.33%). Contributing IDs: run/evidence/id_sets/fcfbd054f281d6d16f790a834d4f1a73467bec5848ce6ea90d55de4d8e9a5ac9.json
- claim.TIME-06.pre.2012: 0 / 8 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2013: 0 / 6 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2014: 0 / 13 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2015: 0 / 24 (0.00%). Contributing IDs: run/evidence/id_sets/37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570.json
- claim.TIME-06.pre.2016: 4 / 41 (9.76%). Contributing IDs: run/evidence/id_sets/02d46f0cf9a95ee9b6d64c5b16d77a81d23b663fe920825b291a8737861e18c9.json
- claim.TIME-06.pre.2017: 3 / 50 (6.00%). Contributing IDs: run/evidence/id_sets/b843e6d944803cce9bae3ad46781ab0461fefec51aa735cfbf25eebb75211683.json
- claim.TIME-06.pre.2018: 1 / 46 (2.17%). Contributing IDs: run/evidence/id_sets/bba1b6a98fbc99f2716cbb1fbd3ec98e3660377d2c7f320167f0722ab4daf501.json
- claim.TIME-06.pre.2019: 2 / 44 (4.55%). Contributing IDs: run/evidence/id_sets/a7e6ba76d01226db6deb0e096ce58fc2e82b7757f954a21ef56386f1366dd9a6.json
- claim.TIME-06.pre.2020: 3 / 92 (3.26%). Contributing IDs: run/evidence/id_sets/6da8c19b3c096ef18e120c09a8cd7acf3a151adef14bc4b6195712cebd0d7089.json
- claim.TIME-06.pre.2021: 1 / 80 (1.25%). Contributing IDs: run/evidence/id_sets/3b9ae58a54ada156ac15fb1aad96986dcbf0e247e0b0a75849e2f4b210915974.json
- claim.TIME-06.pre.2022: 1 / 108 (0.93%). Contributing IDs: run/evidence/id_sets/62eecdd3ef2e07b022277c72df835c7168137a36e323f9a112163ebf56b112ea.json
- claim.TIME-06.pre.2023: 3 / 179 (1.68%). Contributing IDs: run/evidence/id_sets/e3e48a49c710dec324a8b7168be28a25ac862411cff62505f5d56e267e664274.json
- claim.TIME-06.pre.2024: 2 / 304 (0.66%). Contributing IDs: run/evidence/id_sets/f24cf56088229c043836b6ea43a8bb2b37b05b879050f23457c2d56d1ba1ac35.json
- claim.TIME-06.pre.2025: 2 / 452 (0.44%). Contributing IDs: run/evidence/id_sets/eba19649ef2d8a6611ac771c73842eb9da6a003e2ab354386cd4c022abaa26f9.json
- claim.TIME-06.post: 1663 / 1698 (97.94%). Contributing IDs: run/evidence/id_sets/a5c72d32384db6b30f33cba507a7805f4b25fc806720d72183a4e1fa6ad0f58e.json
- claim.TIME-06.ytd_pre: 8 / 231 (3.46%). Contributing IDs: run/evidence/id_sets/361bd07ff5b6eee52509f8c683732adbc285e1e40ba4ce6cacd5fb187e43bda4.json

Model review: {"chart_review": "A timeline stacked by causal timing from 2016 onward would show the 2016 and 2017 bars above later years; the default chart's 2016 floor is not the claim's stated window.", "disposition": "revise", "evidence_ids": ["claim.TIME-06.post", "claim.TIME-06.pre.1996", "claim.TIME-06.pre.2011", "claim.TIME-06.pre.2016", "claim.TIME-06.pre.2017", "claim.TIME-06.pre.2018", "claim.TIME-06.pre.2019", "claim.TIME-06.pre.2020", "claim.TIME-06.pre.2021", "claim.TIME-06.pre.2022", "claim.TIME-06.pre.2023", "claim.TIME-06.pre.2024", "claim.TIME-06.pre.2025", "claim.TIME-06.ytd_pre"], "issues": ["2016 at 9.8% and 2017 at 6.0% exceed 'a few percent'.", "Sparse years with 1 to 3 records make 'any year' unfalsifiable without a stated floor."], "item_id": "TIME-06", "item_type": "published_claim", "numerical_review": "Post-deployment 1,663/1,698 (97.9%) (claim.TIME-06.post) supports 'overwhelming majority'. Pre-deployment by complete year: 2016 4/41 (9.8%), 2017 3/50 (6.0%), 2018 1/46 (2.2%), 2019 2/44 (4.5%), 2020 3/92 (3.3%), 2021 1/80 (1.25%), 2022 1/108 (0.9%), 2023 3/179 (1.7%), 2024 2/304 (0.7%), 2025 2/452 (0.4%) (pre.2016 to .2025); sparse earlier years include 1996 1/1 and 2011 1/3 (pre.1996, pre.2011), and many years have no records. 2026 year-to-date 8/231 (3.5%) (ytd_pre). 'no more than a few percent in any year' fails for 2016 (9.8%) and 2017 (6.0%) under ordinary readings and trivially for sparse years.", "suggested_revision": "Almost all incident records are tagged post-deployment: 1,663 of 1,698 (97.9%) in the September 27, 2026 export. Pre-deployment tags were 4 of 41 records (9.8%) in 2016 and 3 of 50 (6.0%) in 2017, and between 0.4% and 4.5% in each year from 2018 to 2025.", "wording_review": "'overwhelming majority' is supported; 'a few percent in any year' is not. 'incidents assessed' is fine."}

## OVERVIEW-01: About half of all reported incidents were tagged as intentionally caused.

Status: Unresolved

**Proposed wording**

Across all dates in the export, 830 of 1,698 incident records (48.9%) are tagged Intentional.

**Assessment reason**

All records: 830/1,698 (48.9%); omitting Other/unknown as a sensitivity: 830/1,696 (48.9%). No numerical tolerance is invented for ‘About half’.

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**

- About half

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-overview

**Chart settings**

```json
{
  "field": "causal_intent",
  "handler": "vague_half",
  "vague_terms": [
    "About half"
  ],
  "value": "Intentional"
}
```

**Calculation evidence**

- claim.OVERVIEW-01.all: 830 / 1698 (48.88%). Contributing IDs: run/evidence/id_sets/a0ed3528049412b816cc7a4deed634ef88dad3df5c9592cebb88970d2f87ccbd.json
- claim.OVERVIEW-01.known: 830 / 1696 (48.94%). Contributing IDs: run/evidence/id_sets/a0ed3528049412b816cc7a4deed634ef88dad3df5c9592cebb88970d2f87ccbd.json

Model review: {"chart_review": "An overview chart by causal intent would show the share; the live value may differ from the export.", "disposition": "pass", "evidence_ids": ["claim.OVERVIEW-01.all", "claim.OVERVIEW-01.known"], "issues": ["No export date or exact figure."], "item_id": "OVERVIEW-01", "item_type": "published_claim", "numerical_review": "830/1,698 (48.9%) tagged Intentional (claim.OVERVIEW-01.all); 830/1,696 (48.9%) excluding two records with unknown intent (known). Both are within about one point of half.", "suggested_revision": "About half of incident records, 830 of 1,698 (48.9%) in the September 27, 2026 export, are tagged as intentionally caused.", "wording_review": "'About half' accurately describes 48.9%, and 'tagged as' correctly attributes the label. This review disagrees with the source's 'not verifiable' status: no predeclared tolerance is needed to accept 48.9% as about half. Adding the exact figure and date improves precision."}

## OVERVIEW-02: Almost all reported incidents have been classified as post-deployment, with only 2% pre-deployment

Status: Supported

**Proposed wording**

Across all dates in the export, 1,663 of 1,698 records (97.9%) are tagged Post-deployment, 32 (1.9%) are tagged Pre-deployment, and 3 are tagged Other.

**Assessment reason**

Pre: 32/1,698 (1.9%); post: 1,663/1,698 (97.9%); Other: 3/1,698 (0.2%).

**Interpretation**

Verify the explicit 2% using nearest-whole-percent rounding over all records; the phrase “Almost all” has no specified numerical threshold.

**Limitations**

- ‘Almost all’ remains an editorial judgment; numeric component drives status.

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-overview

**Chart settings**

```json
{
  "handler": "timing_rounded",
  "published_percent": 2,
  "rounding_decimals": 0
}
```

**Calculation evidence**

- claim.OVERVIEW-02.pre: 32 / 1698 (1.88%). Contributing IDs: run/evidence/id_sets/f3c1bbffc505b089b013095dabba9d741d5ae0db89e23639424ca138a68496e2.json
- claim.OVERVIEW-02.post: 1663 / 1698 (97.94%). Contributing IDs: run/evidence/id_sets/a5c72d32384db6b30f33cba507a7805f4b25fc806720d72183a4e1fa6ad0f58e.json
- claim.OVERVIEW-02.other: 3 / 1698 (0.18%). Contributing IDs: run/evidence/id_sets/2811c47945bf617f35cc4d28a6195ab2cb0f31a4b7891a594fad11402a45a9e6.json

Model review: {"chart_review": "An overview chart by causal timing; the live value may differ from the export.", "disposition": "pass", "evidence_ids": ["claim.OVERVIEW-02.pre", "claim.OVERVIEW-02.post", "claim.OVERVIEW-02.other"], "issues": ["Add counts, date and the three Other tags for completeness."], "item_id": "OVERVIEW-02", "item_type": "published_claim", "numerical_review": "Pre-deployment 32/1,698 (1.9%), post-deployment 1,663/1,698 (97.9%), Other 3 (0.2%) (claim.OVERVIEW-02.pre, .post, .other). 'only 2%' matches 1.9% rounded.", "suggested_revision": "Almost all incident records are tagged post-deployment: 1,663 of 1,698 (97.9%) in the September 27, 2026 export; 32 (1.9%) are tagged pre-deployment and 3 as Other.", "wording_review": "Supported. 'Almost all' fits 97.9%."}

## OVERVIEW-03: 5.7% of reported incidents would be classed as level 1 (Unacceptable) and therefore prohibited under the EU AI Act. 33% would be classified as level 2 (High Risk)

Status: Update needed

**Proposed wording**

Across all dates in the export, 87 of 1,698 records (5.1%) are tagged EU AI Act tier 1, “Unacceptable,” and 435 (25.6%) are tagged tier 2, “High Risk.” These automated classifications do not determine whether a particular practice is legally prohibited.

**Assessment reason**

The current export gives 87/1,698 (5.1%) in tier 1 and 435/1,698 (25.6%) in tier 2. The published percentages are consistent with an earlier dataset composition, but confirming their origin requires the original snapshot. The reconstruction uses current labels and a conditional assumption about historical ID order, so it cannot establish the classifications in force in April 2025. Classifier tags do not establish legal prohibition.

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**

- Automated taxonomy tags are not legal conclusions
- Original all-dataset snapshot not supplied
- Temporal applicability for the human legal reviewer: confirm from which date the Act's prohibitions applied; most tier-1-tagged records are dated before 2025.

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-overview

**Chart settings**

```json
{
  "handler": "eu_distribution",
  "legal_claim_verifiable": false,
  "live_observation": {
    "note": "the CSV has 87 tier-1 records because eight records (#480, #487, #510, #543, #701, #1455, #1549, #1591) were reclassified from tier 1 to tier 3 in one batch 98 minutes after the mirror's 00:01 UTC sync (source: review/fable/scratch/r2-charts-claims/live/mirror_vs_csv_diff.json).",
    "observed_at_utc": "2026-09-27T22:45Z–23:08Z",
    "records": 1697,
    "tier1_count": 95,
    "tier2_count": 435
  },
  "quoted_percents": {
    "1": 5.7,
    "2": 33
  },
  "rounding_decimals": {
    "1": 1,
    "2": 0
  },
  "snapshot_proxy": true
}
```

**Calculation evidence**

- claim.OVERVIEW-03.level1: 87 / 1698 (5.12%). Contributing IDs: run/evidence/id_sets/403380868f233f63b9127fb4ce8d3f33fc8f34d450ae0677c5ba0c018df095ef.json
- claim.OVERVIEW-03.level2: 435 / 1698 (25.62%). Contributing IDs: run/evidence/id_sets/ef3cb9f4de7969a8519fc9700f912462ca245d208333722521cb3e85cfb7e05e.json
- claim.OVERVIEW-03.level2_context.2021: 43 / 80 (53.75%). Contributing IDs: run/evidence/id_sets/5bb9903c0befe4eac0ba4730be4270403bbe7c750e0cc57e9bc2563a81cacc98.json
- claim.OVERVIEW-03.level2_context.2022: 47 / 108 (43.52%). Contributing IDs: run/evidence/id_sets/a76b36a1b66186dbd27266ed3db737bdaa2e67b30d24558f8938c8439d8b2594.json
- claim.OVERVIEW-03.level2_context.2023: 39 / 179 (21.79%). Contributing IDs: run/evidence/id_sets/bc92585fe5b9a71d750591168a43897cef87857e582eb59fba984c6051bc870f.json
- claim.OVERVIEW-03.level2_context.2024: 45 / 304 (14.80%). Contributing IDs: run/evidence/id_sets/341b4d8d90225070dedb7a29613fd1e1902cec7cdb28f17dafc0d5dd83c79967.json
- claim.OVERVIEW-03.level2_context.2025: 36 / 452 (7.96%). Contributing IDs: run/evidence/id_sets/afd34555085677e9be7414a2ef2cb3b3f3f396dc895e80c7e1afe0f73588f121.json

Model review: {"chart_review": "An overview chart by EU AI Act tier; live values already differ from both the published text and the export.", "disposition": "revise", "evidence_ids": ["claim.OVERVIEW-03.level1", "claim.OVERVIEW-03.level2", "claim.OVERVIEW-03.level2_context.2021", "claim.OVERVIEW-03.level2_context.2022", "claim.OVERVIEW-03.level2_context.2023", "claim.OVERVIEW-03.level2_context.2024", "claim.OVERVIEW-03.level2_context.2025"], "issues": ["Both percentages differ from the export (5.1% and 25.6%).", "Legal conclusion must be removed.", "Tier tags are volatile; the EU tier was reportedly the pilot's weakest taxonomy, which was not verified here.", "Application dates of the Act's prohibitions are for human legal review."], "item_id": "OVERVIEW-03", "item_type": "published_claim", "numerical_review": "Tier 1: 87/1,698 (5.1%); tier 2: 435/1,698 (25.6%) (claim.OVERVIEW-03.level1, .level2), against the published 5.7% and 33%. The tier-2 share falls steeply by year, 53.8% (2021) to 8.0% (2025) (level2_context.2021 to .2025), so the all-records tier-2 share declines as newer records accumulate, consistent with 33% being an older snapshot; the ID-prefix match to April 2025 is suggestive and unverified. Supplied context reports the mirror at 95/1,697 tier 1 before eight records were moved to tier 3, so tier-1 counts move in batches.", "suggested_revision": "In the September 27, 2026 export, the classifier assigns EU AI Act tier 1 (Unacceptable) to 87 of 1,698 incident records (5.1%) and tier 2 (High Risk) to 435 (25.6%). These are automated tags that change between exports; they are not legal determinations, and whether a practice is prohibited depends on the Act's scope, exemptions and dates of application, which the tags do not assess.", "wording_review": "Numbers are stale. 'and therefore prohibited under the EU AI Act' is a legal conclusion the classifier tag cannot support; scope, exemptions and application dates are not assessed. 'would be classed' hedges the tier but not the prohibition."}

## OVERVIEW-04: The primary purpose category attributed to the highest number of incidents is Deepfake Video Generation

Status: Supported

**Proposed wording**

Deepfake Video Generation is the most frequent single primary-purpose tag, assigned to 316 of 1,698 records (18.6%), followed by Chatbot with 181 (10.7%). The chart’s “Other” slice combines multiple less frequent purpose tags.

**Assessment reason**

Deepfake Video Generation: 316/1,698 (18.6%); Chatbot: 181/1,698 (10.7%); Deepfake Image Generation: 135/1,698 (8.0%). Ranking counts primary labels over all incident dates, including the partial current year as snapshot composition.

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**


**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-overview

**Chart settings**

```json
{
  "expected_order": [
    "Deepfake Video Generation"
  ],
  "field": "ai_goal_primary",
  "handler": "ranking"
}
```

**Calculation evidence**

- claim.OVERVIEW-04.08fea3890a66: 316 / 1698 (18.61%). Contributing IDs: run/evidence/id_sets/01f613b5ba2ed3c6f83e553ae0bf8acce3e29e8190625c94fa51a7f3169c163a.json
- claim.OVERVIEW-04.4db675e01582: 181 / 1698 (10.66%). Contributing IDs: run/evidence/id_sets/0006af680f4f6d433e605c3ac7efb10a2c0da029f7a6c06acb7439aeaf3943ab.json
- claim.OVERVIEW-04.2eff61a22915: 135 / 1698 (7.95%). Contributing IDs: run/evidence/id_sets/400531cf0df95b421cd08292c2e5004b37bfda80c0399fe72db0135c20f774ae.json

Model review: {"chart_review": "C03 pie by aiGoal; the aggregated Other slice may exceed any named slice and must not be read as a category.", "disposition": "pass", "evidence_ids": ["claim.OVERVIEW-04.08fea3890a66", "claim.OVERVIEW-04.4db675e01582", "claim.OVERVIEW-04.2eff61a22915", "candidate.IT-C003.secondary1"], "issues": ["Voice Generation (329) outranks Chatbot (223) under primary-or-secondary scope (candidate.IT-C003.secondary1); scope must stay explicit.", "Other slice is an aggregate."], "item_id": "OVERVIEW-04", "item_type": "published_claim", "numerical_review": "Deepfake Video Generation 316/1,698 (18.6%) leads Chatbot 181 (10.7%) and Deepfake Image Generation 135 (8.0%) (claim.OVERVIEW-04.08fea3890a66, .4db675e01582, .2eff61a22915); the leader is stable across the IT-C003 variants, including through 2025 and 2026 year-to-date.", "suggested_revision": "The primary AI-purpose tag attributed to the most incident records is Deepfake Video Generation, 316 of 1,698 (18.6%) in the September 27, 2026 export, followed by Chatbot (181, 10.7%).", "wording_review": "Supported as a primary-purpose statement; 'attributed to' is fine. Keep 'primary' because Voice Generation outranks Chatbot under primary-or-secondary scope."}

## OVERVIEW-05: The domain with most reported incidents across the full dataset is '4 Malicious actors' followed by ‘7 AI system safety, failures, & limitations’

Status: Supported

**Proposed wording**

Across all dates in the export, the most frequent primary domain is “4 Malicious actors,” with 641 of 1,698 records (37.8%), followed by “7 AI system safety, failures, & limitations,” with 378 (22.3%).

**Assessment reason**

4 Malicious actors: 641/1,698 (37.8%); 7 AI system safety, failures, & limitations: 378/1,698 (22.3%); 1 Discrimination & Toxicity: 281/1,698 (16.5%). Ranking counts primary labels over all incident dates, including the partial current year as snapshot composition.

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**


**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-overview

**Chart settings**

```json
{
  "expected_order": [
    "4 Malicious actors",
    "7 AI system safety, failures, & limitations"
  ],
  "field": "domain_code",
  "handler": "ranking"
}
```

**Calculation evidence**

- claim.OVERVIEW-05.b42bf733eb83: 641 / 1698 (37.75%). Contributing IDs: run/evidence/id_sets/f9dc6fb22188184f00d18e38251beaae3ba06831e17575ac096003b3065f02a3.json
- claim.OVERVIEW-05.7e468c14a922: 378 / 1698 (22.26%). Contributing IDs: run/evidence/id_sets/8a619e2b1def4939909f61e676ebf15a3e96382e5f347e7c3c2f98a5c667a5a3.json
- claim.OVERVIEW-05.adb1b3c71dba: 281 / 1698 (16.55%). Contributing IDs: run/evidence/id_sets/1ed8338536a1d2b81b21fa77a19c789feb671abb80920a63d6c77df77820180a.json

Model review: {"chart_review": "Domain bar or overview pie by domain; live values differ from the export.", "disposition": "pass", "evidence_ids": ["claim.OVERVIEW-05.b42bf733eb83", "claim.OVERVIEW-05.7e468c14a922", "claim.OVERVIEW-05.adb1b3c71dba"], "issues": ["Primary-only ranking; no any-label domain ranking was supplied."], "item_id": "OVERVIEW-05", "item_type": "published_claim", "numerical_review": "Primary domain 4: 641/1,698 (37.8%); domain 7: 378 (22.3%); domain 1: 281 (16.5%) (claim.OVERVIEW-05.b42bf733eb83, .7e468c14a922, .adb1b3c71dba). The ranking holds over all dates including 2026 to date.", "suggested_revision": "Across all incident records in the September 27, 2026 export, the most frequent primary risk domain is '4 Malicious actors' (641 of 1,698, 37.8%), followed by '7 AI system safety, failures, & limitations' (378, 22.3%).", "wording_review": "Supported for primary classification. 'across the full dataset' should be dated."}

## OVERVIEW-06: Within domain 4 Malicious actors, the vast majority of reported incidents were in the subdomain ‘4.3 Fraud, scams and targeted manipulation’

Status: Unresolved

**Proposed wording**

Across all dates in the export, 440 of the 641 records whose primary domain is “4 Malicious actors” (68.6%) have the primary subdomain “4.3 Fraud, scams, and targeted manipulation.”

**Assessment reason**

Primary within primary domain: 440/641 (68.6%); any subdomain within the same primary-domain population: 478/641 (74.6%); default bar floor: 438/639 (68.5%). ‘Vast majority’ has no declared threshold.

**Interpretation**

Distinct incident records; primary scalar classification; all incidents in each stated date window are the denominator unless specified.

**Limitations**

- vast majority
- All-time prose versus default bar's 2016 floor

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-overview

**Chart settings**

```json
{
  "domain": "4",
  "handler": "within_domain",
  "subdomain": "4.3",
  "vague_terms": [
    "vast majority"
  ]
}
```

**Calculation evidence**

- claim.OVERVIEW-06.primary: 440 / 641 (68.64%). Contributing IDs: run/evidence/id_sets/3721f4f78d53e6cfb7f599300d21153266420277ee8a7253fc2a225222ac39ea.json
- claim.OVERVIEW-06.any_subdomain_within_primary_domain: 478 / 641 (74.57%). Contributing IDs: run/evidence/id_sets/73cb53e3cc90d450996058f6c9e7f279fca430b78e8cb71f6f6a981b05a9fe5c.json
- claim.OVERVIEW-06.bar_default: 438 / 639 (68.54%). Contributing IDs: run/evidence/id_sets/8ee488517ced0ef40c4ce1c0edf8b44efc1761110936ca29ec18873d7f3e946c.json

Model review: {"chart_review": "C04 with Domain = 4 in counts shows the segment; the default window includes partial 2026. No proportions toggle.", "disposition": "revise", "evidence_ids": ["claim.OVERVIEW-06.primary", "claim.OVERVIEW-06.any_subdomain_within_primary_domain", "claim.OVERVIEW-06.bar_default", "candidate.IT-C004.primary"], "issues": ["'vast majority' unsupported for 68.6% (or 74.6% any-label).", "Window unstated; the default bar differs from all-time prose."], "item_id": "OVERVIEW-06", "item_type": "published_claim", "numerical_review": "Primary 4.3 within primary domain 4: 440/641 (68.6%) (claim.OVERVIEW-06.primary); any-label 4.3 within the same population: 478/641 (74.6%) (any_subdomain_within_primary_domain); default bar from 2016 including 2026 to date: 438/639 (68.5%) (bar_default). Complete years 2016 to 2025 give 368/535 (68.8%) (candidate.IT-C004.primary).", "suggested_revision": "Within incident records primarily classified as '4 Malicious actors', 440 of 641 (68.6%) have the primary subdomain '4.3 Fraud, scams, and targeted manipulation' in the September 27, 2026 export; on the overview bar chart, which starts at 2016, the figure is 438 of 639 (68.5%).", "wording_review": "'vast majority' overstates roughly two-thirds to three-quarters; it is a majority, not a vast one. State the number and the definition."}

## TIME-VALIDATION: The LLM classification tool has been developed iteratively, and its agreement with human expert consensus is comparable to the agreement between 2 independent human experts (article forthcoming). Spot-checks have been used to provide feedback on misclassifications and to iterate the tool, improving its reliability, however there are likely to remain incidents where the LLM classification does not match expert consensus.

Status: Unresolved

**Proposed wording**

A June 2026 pilot compared eight models with consensus labels from two reviewers on 10 incidents. Some model and prompt combinations met the human agreement baseline on that sample. Prompt refinements used the same incidents, so these results require testing on a separate sample. The study leaves the accuracy of current classifications unresolved. The September 27 export predominantly uses a model that the pilot did not evaluate.

**Assessment reason**

The June 2026 pilot is now published, but it tested ten incidents with earlier models and refined prompts on that same sample. It does not validate all current classifications. The published June pilot did not evaluate national-security scores. A separate shared preliminary study reports earlier national-security review, but it does not establish current-pipeline accuracy. The newly located ten-incident reference permits a limited comparison with current labels, shown under Pilot reference check.

**Interpretation**

Agreement/reliability against human experts; requires the study's paired labels, sampling and scoring procedures.

**Limitations**

- Replace ‘(article forthcoming)’ with a link to the 30 June 2026 update
- Do not turn agreement/self-consistency into statistical confidence

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-timeline

**Chart settings**

```json
{
  "external_context": "June 30, 2026 pilot: ten incidents; no replicate model/human annotations in the CSV",
  "handler": "validation_unavailable",
  "pilot": {
    "incidents": 10,
    "models": 8,
    "production_model": "Sonnet 4 (per the June 2026 update)",
    "qwk_eu": 0.56,
    "qwk_harm": 0.31,
    "reviewers": 2,
    "source": "research/published_claims_raw.json UPDATE26-L013, L018, L073, L075, L083"
  }
}
```

**Calculation evidence**


Model review: {"chart_review": "Not chart-based.", "disposition": "revise", "evidence_ids": [], "issues": ["No quantitative evidence in the run; the statement cannot be verified from the export.", "The pilot did not include the current model, so the comparability claim does not transfer.", "'forthcoming' should link the June 30, 2026 update.", "Editors should quote agreement statistics directly from the published article rather than from this review."], "item_id": "TIME-VALIDATION", "item_type": "published_claim", "numerical_review": "No supplied calculation addresses classifier agreement. The export has one retained classification per record and no human reference labels or repeated runs. Supplied context (VALIDATION-SCOPE) states the June 2026 pilot used 10 incidents, two reviewers and eight models, and that the export's models (gemini-3.5-flash for 1,696 rows, mistral-large-latest for 2) are not in the pilot's model list. The agreement statistics quoted in the source's reason and the confidence-field distribution were not verified here and have no calculation IDs.", "suggested_revision": "The LLM classifier was evaluated in a small pilot published in June 2026 (10 incidents, 2 expert reviewers, 8 models) [link the June 30, 2026 update and quote its agreement statistics directly]. That pilot did not include the model used for the current classifications, so its results do not establish the accuracy of the current tags. Spot-checks have been used to give feedback on misclassifications, and incidents remain where the classification will not match expert consensus.", "wording_review": "'article forthcoming' is stale per supplied context. 'comparable to the agreement between 2 independent human experts' reports a 10-incident pilot on other models as if it covered the current tool; 'improving its reliability' is not demonstrated by supplied evidence. The closing caveat is appropriate and should stay."}

## OVERVIEW-VALIDATION: The LLM classification tool has been developed iteratively, and its agreement with human expert consensus is comparable to the agreement between 2 independent human experts (article forthcoming). Spot-checks have been used to provide feedback on misclassifications and to iterate the tool, improving its reliability, however there are likely to remain incidents where the LLM classification does not match expert consensus.

Status: Unresolved

**Proposed wording**

A June 2026 pilot compared eight models with consensus labels from two reviewers on 10 incidents. Some model and prompt combinations met the human agreement baseline on that sample. Prompt refinements used the same incidents, so these results require testing on a separate sample. The study leaves the accuracy of current classifications unresolved. The September 27 export predominantly uses a model that the pilot did not evaluate.

**Assessment reason**

The June 2026 pilot is now published, but it tested ten incidents with earlier models and refined prompts on that same sample. It does not validate all current classifications. The published June pilot did not evaluate national-security scores. A separate shared preliminary study reports earlier national-security review, but it does not establish current-pipeline accuracy. The newly located ten-incident reference permits a limited comparison with current labels, shown under Pilot reference check.

**Interpretation**

Agreement/reliability against human experts; requires the study's paired labels, sampling and scoring procedures.

**Limitations**

- Replace ‘(article forthcoming)’ with a link to the 30 June 2026 update
- Do not turn agreement/self-consistency into statistical confidence

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-overview

**Chart settings**

```json
{
  "external_context": "June 30, 2026 pilot: ten incidents; no replicate model/human annotations in the CSV",
  "handler": "validation_unavailable",
  "pilot": {
    "incidents": 10,
    "models": 8,
    "production_model": "Sonnet 4 (per the June 2026 update)",
    "qwk_eu": 0.56,
    "qwk_harm": 0.31,
    "reviewers": 2,
    "source": "research/published_claims_raw.json UPDATE26-L013, L018, L073, L075, L083"
  }
}
```

**Calculation evidence**


Model review: {"chart_review": "Not chart-based.", "disposition": "revise", "evidence_ids": [], "issues": ["No quantitative evidence in the run.", "Pilot did not cover the current model or prompt.", "'forthcoming' should link the June 30, 2026 update.", "Quote agreement statistics from the article, not from this review."], "item_id": "OVERVIEW-VALIDATION", "item_type": "published_claim", "numerical_review": "Identical text to TIME-VALIDATION. No supplied calculation addresses classifier agreement; the export carries one classification per record with no reference labels or repeated runs. Supplied context (VALIDATION-SCOPE): the June 2026 pilot used 10 incidents, two reviewers and eight models, none of which is the export's gemini-3.5-flash or mistral-large-latest. Quoted agreement statistics and the confidence-field distribution were not verified here.", "suggested_revision": "The LLM classifier was evaluated in a small pilot published in June 2026 (10 incidents, 2 expert reviewers, 8 models) [link the June 30, 2026 update and quote its agreement statistics directly]. That pilot did not include the model used for the current classifications, so its results do not establish the accuracy of the current tags. Spot-checks have been used to give feedback on misclassifications, and incidents remain where the classification will not match expert consensus.", "wording_review": "'article forthcoming' is stale. The comparability sentence extends a 10-incident pilot on other models to the current tool; 'improving its reliability' is undemonstrated. Keep the closing caveat."}

## VIEW-VALIDATION: The LLM classification tool has been developed iteratively, and its agreement with human expert consensus is comparable to the agreement between 2 independent human experts (article forthcoming). Spot-checks have been used to provide feedback on misclassifications and to iterate the tool, improving its reliability, however there are likely to remain incidents where the LLM classification does not match expert consensus.

Status: Unresolved

**Proposed wording**

A June 2026 pilot compared eight models with consensus labels from two reviewers on 10 incidents. Some model and prompt combinations met the human agreement baseline on that sample. Prompt refinements used the same incidents, so these results require testing on a separate sample. The study leaves the accuracy of current classifications unresolved. The September 27 export predominantly uses a model that the pilot did not evaluate.

**Assessment reason**

The June 2026 pilot is now published, but it tested ten incidents with earlier models and refined prompts on that same sample. It does not validate all current classifications. The published June pilot did not evaluate national-security scores. A separate shared preliminary study reports earlier national-security review, but it does not establish current-pipeline accuracy. The newly located ten-incident reference permits a limited comparison with current labels, shown under Pilot reference check.

**Interpretation**

Agreement/reliability against human experts; requires the study's paired labels, sampling and scoring procedures.

**Limitations**

- Replace ‘(article forthcoming)’ with a link to the 30 June 2026 update
- Do not turn agreement/self-consistency into statistical confidence

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/incident-view

**Chart settings**

```json
{
  "external_context": "June 30, 2026 pilot: ten incidents; no replicate model/human annotations in the CSV",
  "handler": "validation_unavailable",
  "pilot": {
    "incidents": 10,
    "models": 8,
    "production_model": "Sonnet 4 (per the June 2026 update)",
    "qwk_eu": 0.56,
    "qwk_harm": 0.31,
    "reviewers": 2,
    "source": "research/published_claims_raw.json UPDATE26-L013, L018, L073, L075, L083"
  }
}
```

**Calculation evidence**


Model review: {"chart_review": "Not chart-based; the incident-view page shows per-record classifications whose accuracy this statement is meant to qualify.", "disposition": "revise", "evidence_ids": [], "issues": ["No quantitative evidence in the run.", "Pilot did not cover the current model or prompt.", "'forthcoming' should link the June 30, 2026 update.", "Quote agreement statistics from the article, not from this review."], "item_id": "VIEW-VALIDATION", "item_type": "published_claim", "numerical_review": "Identical text to TIME-VALIDATION. No supplied calculation addresses classifier agreement; the export carries one classification per record with no reference labels or repeated runs. Supplied context (VALIDATION-SCOPE): the June 2026 pilot used 10 incidents, two reviewers and eight models, none of which is the export's gemini-3.5-flash or mistral-large-latest. Quoted agreement statistics and the confidence-field distribution were not verified here.", "suggested_revision": "The LLM classifier was evaluated in a small pilot published in June 2026 (10 incidents, 2 expert reviewers, 8 models) [link the June 30, 2026 update and quote its agreement statistics directly]. That pilot did not include the model used for the current classifications, so its results do not establish the accuracy of the current tags. Spot-checks have been used to give feedback on misclassifications, and incidents remain where the classification will not match expert consensus.", "wording_review": "'article forthcoming' is stale. The comparability sentence extends a 10-incident pilot on other models to the current tool; 'improving its reliability' is undemonstrated. Keep the closing caveat."}

## NATSEC-VALIDATION: The LLM classification tool has been developed iteratively, and its agreement with human expert consensus is comparable to the agreement between 2 independent human experts (article forthcoming). Spot-checks have been used to provide feedback on misclassifications and to iterate the tool, improving its reliability, however there are likely to remain incidents where the LLM classification does not match expert consensus.

Status: Unresolved

**Proposed wording**

A June 2026 pilot compared eight models with consensus labels from two reviewers on 10 incidents. Some model and prompt combinations met the human agreement baseline on that sample. Prompt refinements used the same incidents, so these results require testing on a separate sample. The study leaves the accuracy of current classifications unresolved. The September 27 export predominantly uses a model that the pilot did not evaluate. The pilot did not evaluate national-security impact scores.

**Assessment reason**

The June 2026 pilot is now published, but it tested ten incidents with earlier models and refined prompts on that same sample. It does not validate all current classifications. The published June pilot did not evaluate national-security scores. A separate shared preliminary study reports earlier national-security review, but it does not establish current-pipeline accuracy. The newly located ten-incident reference permits a limited comparison with current labels, shown under Pilot reference check.

**Interpretation**

Agreement/reliability against human experts; requires the study's paired labels, sampling and scoring procedures.

**Limitations**

- Replace ‘(article forthcoming)’ with a link to the 30 June 2026 update
- Do not turn agreement/self-consistency into statistical confidence

**Tracker source**

https://airisk.mit.edu/ai-incident-tracker/natsec-incident-view

**Chart settings**

```json
{
  "external_context": "June 30, 2026 pilot: ten incidents; no replicate model/human annotations in the CSV",
  "handler": "validation_unavailable",
  "pilot": {
    "incidents": 10,
    "models": 8,
    "production_model": "Sonnet 4 (per the June 2026 update)",
    "qwk_eu": 0.56,
    "qwk_harm": 0.31,
    "reviewers": 2,
    "source": "research/published_claims_raw.json UPDATE26-L013, L018, L073, L075, L083"
  }
}
```

**Calculation evidence**


Model review: {"chart_review": "Not chart-based; C07 radar scores on this page are the labels the statement qualifies.", "disposition": "revise", "evidence_ids": [], "issues": ["No quantitative evidence in the run.", "Pilot did not cover the current model, prompt or the national-security taxonomy.", "'forthcoming' should link the June 30, 2026 update.", "Quote agreement statistics from the article, not from this review."], "item_id": "NATSEC-VALIDATION", "item_type": "published_claim", "numerical_review": "Identical text to TIME-VALIDATION. No supplied calculation addresses classifier agreement; the export carries one classification per record with no reference labels or repeated runs. Supplied context (VALIDATION-SCOPE): the June 2026 pilot used 10 incidents, two reviewers and eight models, none of which is the export's gemini-3.5-flash or mistral-large-latest. The source additionally notes that prior small-sample validation does not cover national-security labels. Quoted agreement statistics were not verified here.", "suggested_revision": "The LLM classifier was evaluated in a small pilot published in June 2026 (10 incidents, 2 expert reviewers, 8 models) [link the June 30, 2026 update and quote its agreement statistics directly]. That pilot did not include the model used for the current classifications or the national-security scores shown here, so its results do not establish their accuracy. Spot-checks have been used to give feedback on misclassifications, and incidents remain where the classification will not match expert consensus.", "wording_review": "'article forthcoming' is stale. The comparability sentence extends a 10-incident pilot on other models and other taxonomies to the national-security scores; 'improving its reliability' is undemonstrated. Keep the closing caveat."}
