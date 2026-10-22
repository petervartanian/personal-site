# Source and definition checks

Checked September 27–28, 2026, against the supplied September 27 export. The source CSV and prior runs were not changed. Saved public sources and their hashes are listed in `source_manifest.json`; local computations are in `definition_diagnostics.json`.

## Results

| Issue | What the check established | Remaining dependency |
|---|---|---|
| Meaning of a zero severity score | All 69 zero cells in the export have `N/A` in the matching harm-description channel. They occur in only two records: #413 (36 cells) and #1607 (33). For 66 cells the category also says `Reported: No`; the other three are indirect channels in otherwise reported categories. | The public rubric defines scores 1–5, with no definition for 0. The exporter must confirm its sentinel convention before 0 is automatically interpreted as no harm or omitted scoring. |
| Classification validity | A source check found a concrete incident-scope problem in #1607: several classifications absorb unrelated comparison examples from its source article. | Arcola can correct/reclassify this record. A representative expert review is still needed to estimate overall classification accuracy. |
| Existing validation claim | The June 2026 validation article is published. Its pilot is evidence about the tested models and prompts on a small sample, not validation of every current row. | A held-out evaluation of the current model/prompt pipeline has not been located. |
| Incident ID ordering | The normal creation path in AIID's public source assigns the next integer above the highest incident ID. | This does not establish that every historical ID came through that path, or turn IDs into calendar entry dates. |
| Historical snapshot explanation | Current-label ID prefixes cannot establish which classifications or percentages appeared in a past export. | The original classified snapshot is required to establish why the published 5.7%/33% pair differs. |
| Public taxonomy meanings | The published ten-category harm scale and MIT causal/domain descriptions can be linked directly. | The three additional harm dimensions in this CSV still lack threshold definitions in the linked harm-scale tab. |

## The specific classification problem

[AIID incident 1607](https://incidentdatabase.ai/cite/1607/) identifies Bill Oliver's New Brunswick legislative speech. Its single [source article](https://futurism.com/artificial-intelligence/politician-accidentally-reads-ai-slop-speech) describes that speech, then discusses separate U.S. lawyer cases as comparisons. The export's `classification_summary`, `financial_loss_harm_caused`, `epistemic_harm_caused`, `ai_goal_justification`, `number_of_occurrences` (3), and reported/inferred people harmed (7) incorporate those other cases. The title and raw description keep the narrower speech scope.

This is a concrete inconsistency between the record's incident scope and its classification evidence. It does not establish a dataset-wide error rate. The targeted selection of the two zero-coded records was designed to investigate unusual values, not to sample classification accuracy.

**Recommended upstream correction:** classify #1607 using the target incident's title, description, date, and source passages. Treat the article's attorney examples as background; do not transfer their harms, people, or occurrence counts into this incident. Recompute dependent fields together rather than editing isolated scores. Preserve the original row and classification metadata in the correction history.

**Sensitivity completed:** the existing engine recomputed all 2,305 measures after excluding #1607 as a diagnostic. Complete-year headline findings are unchanged because the incident is dated 2026. The all-time Deepfake Video Generation and Chatbot numerators remain 316 and 181, with denominator 1,697. The ten-dimension direct/indirect versus all-channel severe-score comparison remains 148 versus 286, also with denominator 1,697. These are alternative calculations, not replacements for the original export. There are 494 changed measures, including denominators, current-year sensitivities, and conservative upper bounds; every changed value is recorded in `definition_diagnostics.json`.

## Severity definitions

The live [published harm-scale tab](https://docs.google.com/spreadsheets/d/e/2PACX-1vSpCMLxgUTv7nxD2G05OGOOzhVy_kzlnAknKSzZHLppiHiBRRHhukmJW2p7VI8pBQ-n7SCB1-6C74cq/pubhtml?gid=1189599743&single=true) still contains ten categories and scores from 1 (Negligible) to 5 (Catastrophic). Its lowest level includes both no harm and some minor harm. Therefore a score of 1 cannot identify an entirely unharmed record, and a score of at least 2 should be described as above-negligible severity under this rubric, rather than simply “harm occurred.” Zero is outside the published scale.

The existing conservative treatment of zero is defensible while its export semantics remain undocumented. Improve its explanation to: “Zero-coded scores have no published definition in the linked rubric. We retain them separately and show conservative bounds where they could affect a threshold result.” Do not say the export proves that all zero scores are missing information.

The CSV has three additional categories—psychological harm, epistemic harm, and CSEA—not defined by this ten-category tab. A 13-category aggregate can be recomputed, but a cross-category severity interpretation needs those additional definitions.

## Validation wording ready to use

The [June 2026 pilot](https://airisk.mit.edu/blog/ai-incident-tracker-june-2026-update) used 10 incidents, two human reviewers, and eight models. The reported human-human agreement was itself imperfect; prompt refinement used the pilot sample, and a larger held-out evaluation was proposed. The September export records `gemini-3.5-flash` for 1,696 incidents and `mistral-large-latest` for two. Neither model label appears in the pilot's tested-model list. This does not prove that current classifications are inaccurate; it means the pilot cannot establish their current accuracy.

Suggested replacement for the repeated “article forthcoming” reliability passage:

> A June 2026 pilot compared eight models with consensus labels from two reviewers on 10 incidents. Some model and prompt combinations met the human agreement baseline on that sample. This does not establish the accuracy of all current classifications; the September 27 export predominantly uses a model not evaluated in that pilot.

Keep the existing warnings about voluntary reporting, uneven source detail, and selective coverage. The CSV's self-reported confidence labels are model annotations, not calibrated accuracy estimates.

## IDs and historical claims

The deployed AIID pages identify commit `dd3f754`. At [that commit's submission-promotion code](https://github.com/responsible-ai-collaborative/aiid/blob/dd3f7543e365084654babca0b7380fc368ad28de/site/gatsby-site/server/fields/submissions.ts#L87), a new incident receives the current maximum ID plus one. This resolves the narrow question about the normal creation mechanism. The repository also exposes a separate [incident insertion path](https://github.com/responsible-ai-collaborative/aiid/blob/dd3f7543e365084654babca0b7380fc368ad28de/site/gatsby-site/server/fields/incidents.ts#L24); normal-path behavior is not a guarantee covering imports and all historical records.

Do not replace the current ID caution with a claim that ingestion dates are now known. A [2024 migration](https://github.com/responsible-ai-collaborative/aiid/blob/dd3f7543e365084654babca0b7380fc368ad28de/site/gatsby-site/migrations/2024.02.01T20.03.56.set-incidents-submissions-reports-created_at.js#L48) populated historical incident `created_at` from incident event dates. Even that field cannot automatically be interpreted as original ingestion time. Current public page data for #1043 and #1058 supplies incident dates and report publication dates, not verified incident creation timestamps. The editor note for #1607 supplies a creation date for that one record only.

Suggested historical-claim explanation:

> The published percentages differ from this export. Some subsets of the current records reproduce the rounded pair, but that does not reconstruct the original classified dataset or establish the cause of the discrepancy. The original snapshot is needed to confirm the historical figures.

[AIID publishes weekly database snapshots](https://incidentdatabase.ai/research/snapshots/). These are useful for raw-record provenance but are not established substitutes for a second Arcola export containing the same classification fields. They should not be presented as the missing matched input.

## Source checks that are now complete

- Refetched the published validation article and harm rubric.
- Checked the official record and source report for both zero-coded incident IDs.
- Compared each zero cell with its corresponding narrative channel.
- Verified the current ordinary ID-allocation path and examined the historical date migration.
- Looked up the boundary records used in the historical-prefix explanation.
- Recomputed the effect of excluding the identified scope-contaminated record.

The remaining requests to Arcola are narrow: confirm zero-score semantics; supply the three additional severity rubrics and current prompt/model validation evidence; correct #1607; and provide the original classified snapshot if the origin of historical percentages needs to be established. None prevents producing cautiously worded candidate findings from the supplied export.
