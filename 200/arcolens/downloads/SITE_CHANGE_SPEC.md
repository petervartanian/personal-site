# Tracker changes prepared for review

No public page has been changed. The component patch applies cleanly to the publicly deployed source. The original repository, its build setup, and Webflow editing access have not been supplied.

## Severity headline

Apply `severity-label.patch` to `src/components/IncidentDetailModal.tsx`. It changes the headline to **Highest assessed severity** and explains that the value includes direct, indirect, and model-inferred assessments. It preserves the existing value and changes its description.

The deployed component reads `highestSeverityScore`. Across all 1,698 CSV records, the export's corresponding aggregate equals the maximum across 13 harm dimensions and all three assessment channels. For incident 1702, the export's direct and indirect scores are no higher than 2, while inferred democratic and epistemic harm reach 3. The live browser check independently shows the erroneous direct-only headline at 3 for that incident.

The fresh [public source map](https://airi-echarts-visualizations.vercel.app/embed.js.map) matches the archived version, SHA256 `48a0f9604debc7f674780f914545d5a4d968c14060359461443c1a25971bec27`. The extracted component's original SHA256 is `3cca2f632c6062b21e6da042cee3a28a379704d12879dd1dc8c48d18dfd18f49`. The patch was checked against that exact source. Compilation in the original application is still required before deployment because its build configuration and dependencies were not recovered.

## Severe-harm preset

On the [Incident Timeline page](https://airisk.mit.edu/ai-incident-tracker/incident-timeline), replace the existing preset JSON with `timeline-presets.json`. The first preset uses `minSeverityHighest: "4"` instead of `minSeverity: "4"`. Its label now acknowledges model-inferred harm. The EU preset describes classifier tags without implying a legal determination.

The public endpoint was checked on September 28, 2026 at approximately 01:02 UTC:

| Query | Incident records |
|---|---:|
| Primary-subdomain timeline, year 2016 onward | 1,627 |
| Same query with the existing `minSeverity=4` | 1,627 |
| Same query with `minSeverityHighest=4` | 348 |

The first two responses were byte-identical. The corrected parameter changes the returned dataset. This verifies the API behavior; it does not validate whether the underlying severity assessments are correct.

On the [NatSec Incident View](https://airisk.mit.edu/ai-incident-tracker/natsec-incident-view), `natsec-presets.json` changes the level-5 preset label to **Critical**, consistent with that view's national-security scale. This does not change its numerical filter.

## Published findings

`WEBSITE_CORRECTIONS.md` contains finished replacement text for all 19 current empirical blocks. `WEBSITE_REPLACEMENTS.json` maps each replacement to its existing claim ID, source page, source-quotation hash, and calculation evidence IDs. The validation replacements cite the published pilot and its same-sample prompt refinement. The NatSec version explicitly notes that national-security scores were not evaluated. Required chart-window notes accompany all-date findings.

The numerical replacements use the supplied September 27, 2026 export. They must appear with its date and source attribution. The public mirror currently differs in classifications even when its total record count matches, so these figures must not be described as current chart readings without checking the displayed data. Copy intended to track the live charts should instead be generated from the same pinned source serving those charts.

## Chart inventory correction

The current browser check finds 10 entries in the C04 domain-bar **Stack by** menu, including None: None, Subdomain, Entity, Intent, Timing, AI Purpose, EU AI Act Risk Tier, Highest severity, NatSec Overall Impact, and Harm category. It does not expose All Subdomains, AI Model Family, or AI Developer there. C03's broader menu must not be attributed to C04. Candidate chart instructions must use the controls actually available on their target view.

## Validation performed

- All numerical values used in the replacement text were recomputed from the original CSV with an independent standard-library script.
- The current source-map version was retrieved and matched to the archived source hash.
- The component patch passed a local application check against the extracted deployed source.
- Both replacement preset files parse as JSON. The severe-harm parameter was verified against the live read-only API.
- The API payloads, page source, URLs, timestamps, and checksums are retained under `evidence/` and `evidence_manifest.json`.

Publishing requires the maintainer's application checkout and Webflow access. These local files are a concrete proposed change, not a deployed fix or publication approval.
