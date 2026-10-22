# Additional field definitions

The autonomy definitions are documented and can replace the earlier caveat that they were undefined. The public sources examined did not supply a classification rule for behavior type or severity thresholds for the three added harm dimensions. Field names and displayed values are documented separately from those missing rules.

## National-security autonomy: resolved

MIT's current [NatSec Impact Framework page](https://airisk.mit.edu/ai-incident-tracker/natsec-impact-framework) embeds this [public framework document](https://docs.google.com/document/d/e/2PACX-1vQ6Xji7LKpWY2KwG7q3FtsEHaDGjA_WcNZpTXvgb8wfTcJ2WbKggjio_ZJR5MvvQMpTh4wQBLXzrkaY/pub?embedded=true). Its “AI System Autonomy Level” table explicitly distinguishes:

| Value | Published meaning, paraphrased | Records in the supplied export |
| --- | --- | ---: |
| Full autonomy | AI chooses and carries out decisions without human intervention. | 289 |
| Human-supervised | AI operates autonomously while humans retain oversight and the ability to intervene. | 453 |
| Human-controlled | AI provides assistance; humans retain the final decisions. | 956 |

All 1,698 rows have one of these values in `natsec_autonomy_level`. This is a documented value set and meaning. It does not establish that each individual classification is correct, or validate comparisons with a different concept such as behavior type. The document says to assess autonomy separately from imminence and novelty.

The document was fetched again successfully on September 28, 2026 UTC. The exact table is preserved in `sources/natsec-framework.txt`, lines 108–116. The deployed detail view reads `natSecAutonomyLevel` and its corresponding justification; its menu obtains autonomy values from the API. That UI evidence corroborates the field's use, rather than supplying a different definition.

Suggested presentation wording: **“Autonomy categories follow the published national-security framework: human-controlled systems assist human decisions, human-supervised systems act autonomously under human oversight, and full-autonomy systems make and execute decisions without human intervention. These are model-assigned classifications of the reported incidents.”**

## Behavior type: observed values, rules unresolved

The CSV's exact field name is `behaviour_type`, with a companion `behaviour_reasoning` field. Retain these raw identifiers in code; use “behavior type” in U.S. English presentation. `behavior_type` is not a column in this export.

| Observed value | Records |
| --- | ---: |
| Tool | 787 |
| Assistant | 512 |
| Autonomous | 300 |
| Agent | 42 |
| unknown | 33 |
| Multi-agent | 21 |
| Hybrid | 3 |

These are all observed values in the supplied export, not a verified exhaustive schema. The public deployed detail code reads `behaviourType` and displays its string without an explanatory definition or enum. No normative decision rules separating Tool, Assistant, Agent, Autonomous, Multi-agent, and Hybrid were found in the reviewed MIT pages, the published frameworks, Arcola's public home/platform pages, or the deployed application source map. Targeted indexed searches of official domains found no such definitions.

Arcola's [platform description](https://www.arcolaai.com/platform) states that partners define their classification logic, taxonomies, and rubrics. That general statement does not establish the rules used by this particular export. Per-record reasoning also cannot establish a normative schema.

Suggested presentation wording: **“Behavior type is the export's classification label. The published materials examined do not define the boundaries between these labels, so the result describes recorded labels rather than a validated distinction between types of AI systems.”** Do not merge these values with the separately defined autonomy categories.

## Ten original harm dimensions and the three additions

The [MIT-linked harm rubric](https://airisk.mit.edu/ai-incident-tracker/harm-taxonomy) currently publishes one worksheet, “Severity Scales.” Its [actual worksheet content](https://docs.google.com/spreadsheets/d/e/2PACX-1vSpCMLxgUTv7nxD2G05OGOOzhVy_kzlnAknKSzZHLppiHiBRRHhukmJW2p7VI8pBQ-n7SCB1-6C74cq/pubhtml/sheet?headers=false&gid=1189599743) defines these ten dimensions, each with criteria for scores 1–5:

| Published dimension | Export prefix |
| --- | --- |
| Physical Harm | `physical_harm` |
| Infrastructure Damage | `infrastructure_damage` |
| Property Damage | `property_damage` |
| Financial Loss | `financial_loss` |
| Environmental Damage | `environmental_damage` |
| Toxic or Malicious Content | `toxic_or_malicious_content` |
| Differential Treatment | `differential_treatment` |
| Human/Civil Rights | `human_and_civil_rights` |
| Democratic Norms | `democratic_norms` |
| Privacy | `privacy` |

The supplied export adds `psychological_harm`, `epistemic_harm`, and `csea`, producing thirteen dimensions. The current [Incident View](https://airisk.mit.edu/ai-incident-tracker/incident-view) explicitly describes thirteen harm categories. The deployed detail code labels the additions Psychological, Epistemic, and CSEA. The three additional dimensions' category-specific threshold rubrics were **not found** in the published worksheet, its full published workbook, Arcola's public platform materials, or the deployed app source map. Generic labels such as “Severe” do not define those thresholds.

The application code also supports Digital Systems & Data and Reputational categories. These are not additional dimensions in this CSV. UI support does not establish that every record, export, or rubric uses fifteen categories.

Suggested presentation wording: **“This comparison uses the original ten harm dimensions with published severity criteria. The export also contains psychological harm, epistemic harm, and CSEA scores; their category-specific scoring thresholds were not available in the public materials examined.”** When displaying a thirteen-dimension result, label it explicitly and retain that caveat.

## Evidence and scope

Seven fresh public resources were retrieved without authentication: the national-security framework, published workbook wrapper, selected-tab wrapper, actual severity worksheet, Arcola home and platform pages, and deployed source map. Their URLs, retrieval times and hashes are in `source_manifest.json`; extracted source files and text accompany them. `export_field_counts.json` records the counts independently recomputed from the supplied CSV.

The search was targeted, not proof that no additional document exists anywhere. No frozen code, current LLM context, source export, or historical run was edited. The remaining request to Arcola is narrower: provide the behavior-type decision rules and the severity rubrics for psychological harm, epistemic harm, and CSEA, together with the version used for this export.
