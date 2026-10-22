# Website corrections

Prepared for maintainer review. These changes have not been published.

The numerical findings below use the September 27, 2026 Arcola export of 1,698 incident records. They describe this database and its automated classifications. Reporting, coverage, and classification changes can affect the patterns; these results do not estimate the prevalence of AI harm.

Publish as explicitly dated export analysis, or recompute against the exact dataset serving the displayed charts. The live mirror differs from this export.

The date and export attribution must remain visible with the numerical findings. The chart notes below are required placement conditions, not claims that the live charts reproduce the export values.

### HOME-01

The MIT AI Incident Tracker classifies incident records from the AI Incident Database by risk, cause, harm, severity, and other dimensions.

### HOME-02

The AI Incident Tracker adds structure to reports in the AI Incident Database. Arcola AI’s classification pipeline assigns risk and harm categories so researchers can examine the composition of reported incidents. Changes in database counts can reflect reporting and coverage as well as underlying events.

### HOME-06

The charts show incident counts and distributions across risk domains, causal classifications, and harm assessments. Some views count multiple assignments per incident, so their shares describe assignments rather than distinct incidents. These patterns describe the database; they do not establish how common AI harms are across society.

### TIME-01

Among records dated 2021–2025, the share with the primary subdomain “4.3 Fraud, scams, and targeted manipulation” rose each year, from 3 of 80 (3.75%) in 2021 to 192 of 452 (42.48%) in 2025.

### TIME-02

Among records dated 2021–2025, the share with the primary subdomain “7.3 Lack of capability or robustness” fell each year, from 33 of 80 (41.25%) to 45 of 452 (9.96%). The count increased, so the falling share does not establish improved AI robustness.

### TIME-03

Among incident records dated in each year, the number with a primary-purpose tag of Deepfake Video Generation, Deepfake Image Generation, Voice Generation, or Image Generation rose from 19 of 108 records (17.6%) in 2022 to 239 of 452 (52.9%) in 2025. These four tags define the group used in this comparison.

### TIME-04

Among incident records dated in each year, the share tagged EU AI Act tier 1, “Unacceptable,” was 3 of 108 (2.8%) in 2022, 9 of 179 (5.0%) in 2023, 15 of 304 (4.9%) in 2024, and 24 of 452 (5.3%) in 2025. It did not increase every year. These automated tags are not legal determinations.

### TIME-05

Among records dated 2021–2025, the share tagged Intentional rose each year, from 17 of 80 (21.25%) to 291 of 452 (64.38%). The share whose causal entity was tagged Human also rose each year, from 22 of 80 (27.5%) to 310 of 452 (68.58%). These tags are model assessments of causation.

### TIME-06

Across all dates in the export, 1,663 of 1,698 records (97.9%) are tagged Post-deployment, 32 (1.9%) are tagged Pre-deployment, and 3 are tagged Other. This overall distribution does not imply the same proportions in every year.

**Chart note:** This all-date export summary covers a broader time span than the timeline’s 2016-onward view. Present it with an all-date export table, or recalculate it for the displayed chart window and dataset.

### OVERVIEW-01

Across all dates in the export, 830 of 1,698 incident records (48.9%) are tagged Intentional.

### OVERVIEW-02

Across all dates in the export, 1,663 of 1,698 records (97.9%) are tagged Post-deployment, 32 (1.9%) are tagged Pre-deployment, and 3 are tagged Other.

### OVERVIEW-03

Across all dates in the export, 87 of 1,698 records (5.1%) are tagged EU AI Act tier 1, “Unacceptable,” and 435 (25.6%) are tagged tier 2, “High Risk.” These automated classifications do not determine whether a particular practice is legally prohibited.

### OVERVIEW-04

Deepfake Video Generation is the most frequent single primary-purpose tag, assigned to 316 of 1,698 records (18.6%), followed by Chatbot with 181 (10.7%). The chart’s “Other” slice combines multiple less frequent purpose tags.

### OVERVIEW-05

Across all dates in the export, the most frequent primary domain is “4 Malicious actors,” with 641 of 1,698 records (37.8%), followed by “7 AI system safety, failures, & limitations,” with 378 (22.3%).

**Chart note:** These all-date export totals cover a broader time span than the domain bar chart’s 2016-onward view. Present them with an all-date export table, or recalculate them for the displayed chart window and dataset.

### OVERVIEW-06

Across all dates in the export, 440 of the 641 records whose primary domain is “4 Malicious actors” (68.6%) have the primary subdomain “4.3 Fraud, scams, and targeted manipulation.”

**Chart note:** These all-date export totals cover a broader time span than the domain bar chart’s 2016-onward view. Present them with an all-date export table, or recalculate them for the displayed chart window and dataset.

### TIME-VALIDATION, OVERVIEW-VALIDATION, VIEW-VALIDATION

A June 2026 pilot compared eight models with consensus labels from two reviewers on 10 incidents. Some model and prompt combinations met the human agreement baseline on that sample. Prompt refinements used the same incidents, so these results require testing on a separate sample. The study does not establish the accuracy of all current classifications; the September 27 export predominantly uses a model not evaluated in that pilot.

**Study scope:** The pilot evaluated Harm Severity across ten dimensions, EU AI Act risk level, and causal, domain and subdomain taxonomies. It did not establish accuracy of the current thirteen-dimension harm classification.

[Pilot study](https://airisk.mit.edu/blog/ai-incident-tracker-june-2026-update)

### NATSEC-VALIDATION

A June 2026 pilot compared eight models with consensus labels from two reviewers on 10 incidents. Some model and prompt combinations met the human agreement baseline on that sample. Prompt refinements used the same incidents, so these results require testing on a separate sample. The study does not establish the accuracy of all current classifications; the September 27 export predominantly uses a model not evaluated in that pilot. The pilot did not evaluate national-security impact scores.

**Study scope:** The pilot evaluated Harm Severity across ten dimensions, EU AI Act risk level, and causal, domain and subdomain taxonomies. It did not establish accuracy of the current thirteen-dimension harm classification.

[Pilot study](https://airisk.mit.edu/blog/ai-incident-tracker-june-2026-update)
