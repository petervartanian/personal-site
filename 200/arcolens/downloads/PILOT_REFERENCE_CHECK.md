# Current labels against the pilot reference

This diagnostic compares 160 ratings across ten previously selected incidents. It is not a current-pipeline accuracy estimate.

| Section | Exact matches | Kappa |
|---|---:|---:|
| Harm Severity | 67/100 | 0.239 |
| EU AI Act | 5/10 | 0.219 |
| Causal Taxonomy: Entity | 4/10 | 0.091 |
| Causal Taxonomy: Intent | 9/10 | 0.800 |
| Causal Taxonomy: Timing | 10/10 | Undefined |
| Domain (Top-level) | 7/10 | 0.620 |
| Subdomain | 7/10 | 0.670 |

## Limits

- Ten deliberately selected incidents; not a representative random sample or confirmed holdout. References were used during prompt development and may overlap development data.
- Multiple ratings within an incident are correlated. A 100-rating harm table is still only ten incidents. No confidence intervals or population accuracy estimates are claimed.
- Historical human labels and current export classifications may use different report text or rubrics. Disagreement is a review signal, not proof the current model is wrong.
- This reference file contains no national-security ratings or potential-cause labels. A separate preliminary methodology document reports earlier national-security review; its paired labels are not present in this file.
- Kappa is undefined when expected disagreement is zero; no value is substituted. EU tier codes are assessed nominally, not interpreted as legal determinations.
