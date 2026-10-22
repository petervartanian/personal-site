# Historical export comparison

1,200 legacy records and 1,698 current records; 1,200 shared IDs, 498 added IDs, 0 removed IDs.

| Common field | Changed shared records |
|---|---:|
| date | 2/1200 |
| domain_code | 190/1200 |
| subdomain_code | 271/1200 |
| causal_entity | 244/1200 |
| causal_intent | 102/1200 |
| causal_timing | 24/1200 |
| eu_ai_act_risk_level | 259/1200 |
| ai_goal_primary | 314/1200 |
| ai_goal_secondary | 925/1200 |
| behaviour_type | 496/1200 |
| natsec_overall_score | 303/1200 |
| natsec_autonomy_level | 318/1200 |
| natsec_imminence_level | 95/1200 |
| natsec_novelty_level | 341/1200 |
| physical_harm_severity_direct | 69/1200 |
| physical_harm_severity_indirect | 74/1200 |
| physical_harm_severity_inferred | 111/1200 |
| infrastructure_damage_severity_direct | 9/1200 |
| infrastructure_damage_severity_indirect | 18/1200 |
| infrastructure_damage_severity_inferred | 15/1200 |
| property_damage_severity_direct | 49/1200 |
| property_damage_severity_indirect | 30/1200 |
| property_damage_severity_inferred | 54/1200 |
| financial_loss_severity_direct | 187/1200 |
| financial_loss_severity_indirect | 181/1200 |
| financial_loss_severity_inferred | 400/1200 |
| environmental_damage_severity_direct | 3/1200 |
| environmental_damage_severity_indirect | 5/1200 |
| environmental_damage_severity_inferred | 7/1200 |
| toxic_or_malicious_content_severity_direct | 256/1200 |
| toxic_or_malicious_content_severity_indirect | 207/1200 |
| toxic_or_malicious_content_severity_inferred | 277/1200 |
| differential_treatment_severity_direct | 175/1200 |
| differential_treatment_severity_indirect | 189/1200 |
| differential_treatment_severity_inferred | 267/1200 |
| human_and_civil_rights_severity_direct | 250/1200 |
| human_and_civil_rights_severity_indirect | 221/1200 |
| human_and_civil_rights_severity_inferred | 432/1200 |
| democratic_norms_severity_direct | 105/1200 |
| democratic_norms_severity_indirect | 146/1200 |
| democratic_norms_severity_inferred | 237/1200 |
| privacy_severity_direct | 228/1200 |
| privacy_severity_indirect | 192/1200 |
| privacy_severity_inferred | 326/1200 |
| natsec_physical_score | 77/1200 |
| natsec_information_score | 212/1200 |
| natsec_sovereignty_score | 205/1200 |
| natsec_economic_score | 189/1200 |
| natsec_societal_score | 286/1200 |

## Interpretation

- This is a genuine older shared tracker export, not verified as an export from the current Arcola classification pipeline. It tests real historical differences, not same-version month-to-month stability.
- A common-field projection is used. Ishikawa, additional subdomains, added harm dimensions and current classifier metadata are unavailable in the legacy schema; none are invented.
- Model Name in the legacy file names the incident system, not the classifier. Classifier provenance comes from API_Info.
- Changes to shared-record tags do not establish errors or improvements; source text, prompts, models and taxonomy can all differ.
- The historic filename date is not treated as authenticated collection time. Do not interpret newly present records as newly occurred incidents, or compare incomplete incident-year cohorts as full-year trends.
