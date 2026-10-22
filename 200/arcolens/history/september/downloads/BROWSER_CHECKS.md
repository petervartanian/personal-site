# Live tracker browser checks

Checked September 28, 2026 UTC, completed at 01:10 UTC. All UI interactions used CUA. The public site was not modified. The created in-app tab and Safari test tab were closed afterward; the user's preexisting Safari tab was preserved.

Representative rendering and interaction checks now cover the four aggregate charts, ordinary incident detail, its harm radar and cause diagram, and national-security detail. These checks establish what the interface showed and how selected controls behaved. They do not validate the underlying incident reports, classifications, or every chart calculation.

## Observed results

| Surface and browser | Actions | Observed result |
|---|---|---|
| [Homepage annual chart](https://airisk.mit.edu/ai-incident-tracker), in-app browser | Loaded the homepage and used the count/proportion toggle. | Homepage count dynamically displayed 1,698. Domain-stacked annual bars rendered, retained the 2016 floor, and changed to a percentage axis. The 2026 column was labeled “to date.” |
| [Timeline](https://airisk.mit.edu/ai-incident-tracker/incident-timeline), Safari | Applied the severe/catastrophic preset, inspected its severity selections, manually selected Any category ≥ 4, and changed to counts. | Both percentage and count charts rendered. The preset alone created a “Severity: category ≥ 4” badge while every severity selector remained Any. Manually selecting 4 applied a real threshold and visibly changed the chart. The preset needs correction. |
| [Overview pie](https://airisk.mit.edu/ai-incident-tracker/incident-overview), in-app browser | Opened the grouping menu, selected AI Purpose, and clicked the Deepfake Video Generation slice. | Thirteen grouping dimensions were present. The slice tooltip displayed Count: 311 and Proportion: 18.3%. Clicking it opened a matching incident list; clicking incident 1702 opened its detail window. Escape closed the window. |
| Overview pie, Safari | Opened the grouping menu and selected EU AI Act Risk Tier. | The menu showed the same thirteen dimensions. The pie rendered, displaying 5.6% for Unacceptable and 25.6% for High Risk. These are live-mirror observations, not replacements for the CSV calculations. |
| Overview domain bars, in-app browser | Opened Stack by and Add filter, selected EU AI Act Risk Tier, selected exact Year 2025, then cleared. | Bars rendered. The selected-year badge appeared, its checkbox was checked, and Clear restored Subdomain grouping. The menu has nine grouping dimensions plus None, not the twelve dimensions previously assigned to this surface in the inventory. |
| Overview domain bars, Safari | Opened Stack by and selected Entity. | The same ten menu entries were observed. Entity-stacked horizontal bars rendered. |
| [Ordinary incident listing](https://airisk.mit.edu/ai-incident-tracker/incident-view), Safari | Searched for 1702 and opened the result. | The default list displayed 1,698 incidents. Search displayed “1 of 1698 incidents (1698 total).” Opening the record added `?incident=1702` to the URL and opened its detail window. Escape closed it. |
| [Incident 1702](https://airisk.mit.edu/ai-incident-tracker/incident-view?incident=1702), in-app browser and Safari | Inspected harm definitions, category score labels, and radar. | The direct/indirect radar rendered with thirteen categories. The headline said Highest Direct Severity Score: Substantial, although all displayed direct and indirect scores were Negligible or Minor. This directly contradicts the headline's stated direct-only meaning. The interface does not expose a numeric inferred series in the radar. |
| Incident 1702 cause diagram, in-app browser | Scrolled to Potential Causes of Incident. | The fishbone diagram rendered with six categories: Technology, Data Inputs, Human Factors, Process and Methods, Regulatory Environment, and Management. It was labeled as potential causes from LLM analysis, requiring further investigation. |
| [National-security listing](https://airisk.mit.edu/ai-incident-tracker/natsec-incident-view), in-app browser | Loaded default view, searched for 1701, and opened it. | Default threshold was ≥ 4 and the count was 32 of 1,698. Search reduced the display to one result. Opening detail added `?incident=1701` to the URL. |
| [National-security incident 1701](https://airisk.mit.edu/ai-incident-tracker/natsec-incident-view?incident=1701), in-app browser | Inspected impact summary, radar and category labels. | Five-axis radar rendered with labels Negligible through Critical. Overall Severe matched the highest displayed category level. The page separately exposed imminence, autonomy and novelty. |
| National-security threshold and reset, in-app browser | Changed Overall ≥ 4 to ≥ 5; cleared filters. | The ≥ 5 view displayed three Critical incidents: 672, 169 and 249. Clear restored the ≥ 4 default and 32-result view, rather than an unfiltered all-incident view. |
| [Harm Taxonomy](https://airisk.mit.edu/ai-incident-tracker/harm-taxonomy), in-app browser | Loaded the embedded rubric. | The published Google Sheet loaded as “READ ONLY AI Harm Severity Rating Scales v2,” with ten category columns and levels 1–5. Negligible includes descriptions allowing no harm. It does not document the three additional categories displayed in incident detail. |

## Exact C04 controls

Stack by: None, Subdomain, Entity, Intent, Timing, AI Purpose, EU AI Act Risk Tier, Highest severity, NatSec Overall Impact, Harm category.

Add filter: Year, Year ≥, Domain, Subdomain, Harm category, Entity, Intent, Timing, AI Purpose, EU AI Act Risk Tier. Severity has its separate control. All Subdomains, AI Model Family and AI Developer were absent from both menus. API option arrays containing those dimensions are not evidence that this surface exposes them.

The ordinary timeline count/proportion button describes the action it performs. For example, “Incident counts” appears while the percentage chart is displayed. Chart axis labels and geometry were inspected to establish the active view.

## Defects and data boundaries

1. **Misleading severity headline:** incident 1702 supplies a directly observable counterexample in both browsers. Fix the title and explanation or calculate an actual direct-only maximum. The UI observation alone cannot identify which backend field supplied the value.
2. **Ineffective published severity preset:** Safari shows a badge suggesting a threshold while all actual threshold selectors remain Any. This corroborates the separately performed source/API check of the obsolete `minSeverity` parameter. It is not an independent HTTP proof of which parameter the server ignored.
3. **Incorrect C04 capability inventory:** remove All Subdomains, AI Model Family and AI Developer from its advertised menu controls. Their possible API availability is a separate question.
4. **Rubric scope mismatch:** the linked rubric contains ten categories; current detail shows thirteen. Keep the versions and channel definitions explicit rather than treating the rubric as complete documentation of all current scores.

The current public mirror and the supplied CSV both contain 1,698 records, but their classifications are not identical. The live pie shows 311 Deepfake Video Generation records and 5.6% Unacceptable, whereas the supplied CSV results are 316 and 5.1%. Matching total counts do not justify substituting live values into the frozen CSV report. Historical September 27 API snapshots in the inventory retain their original timestamps and counts.

## Evidence and limits

Screenshots and accessibility trees were captured and inspected in the CUA tool transcript. Persistent screenshot files were not exported by the supported APIs used; no local screenshot paths are claimed. The exact observations and source URLs are recorded above and in `context.json`.

The updated `chart_inventory.json` and `controls_by_default_surface.json` are copies for integration. Originals and historical run directories were not modified. Historical API option arrays and source hashes remain intact; browser observations are appended separately.

These were representative desktop interaction checks, not an exhaustive cross-browser test suite. Archived Airtable interiors, every filter combination, every incident, mobile Safari, Firefox, Windows, and Linux were not tested. Safari national-security detail was not separately exercised; that radar was exercised in the in-app browser. No claim of classification accuracy, source-report truth, or legal applicability follows from successful rendering.
