# Current completion update: expanded chart coverage

The current analysis has thirteen candidate findings: the previous eleven plus potential-cause annotation coverage and a national-security score profile. All retain cautious wording, chart instructions, confidence notes, sensitivity checks and incident-ID evidence. Individual diagrams illustrate a named record; aggregate counts need the supplied supporting tables.

The new profiles have 35 calculations and 70 ID-set comparisons independently reproduced by a separate raw-CSV implementation in this session. The complete run has 2,340 calculations and 4,680 ID references. Its integrity verification passes. Python 3.11 and 3.14 each ran 248 tests: 244 passed and four existing opt-in tests were skipped. No Linux or Windows execution was performed.

A genuine older shared tracker CSV was located and compared with September: 1,200 shared records, 498 added IDs, no removed IDs, and 49 explicitly mapped fields. This is not verified as a second export from the current Arcola pipeline. A diagnostic also compares current labels with 160 prior human-reference ratings across ten incidents; it is not representative or confirmed held-out validation.

The existing monthly schedule now searches and retrieves eligible modern exports from the shared Google Drive tracker folders. Access and a legacy download were exercised; no current-format export was found there. Upstream Arcola export production or delivery is still needed. See review/completion/DRIVE_INTAKE.md.

The older behavior rubric and preliminary national-security review were recovered. Current rubric version, zero semantics, the three added severity scales, and representative current-pipeline accuracy still need owner/expert evidence. The preview identifies an intended GitHub repository, but both connected GitHub access routes returned repository-not-found responses; editing access remains unavailable. Prepared patches and corrections remain local; the public site has not been changed.

Earlier real model reviews cover the eleven-candidate evidence bundle. The two additions were checked in-session and in independent code, with no new paid model calls. They have not had an additional Fable review. Old receipts must not be presented as approving the expanded bundle.

Full supporting work is in review/completion/expanded-evidence/. v1 and existing runs remain preserved. Arcolens has focused pages for the new profiles, historical comparison and pilot-reference diagnostic.

---

The following is the preserved earlier status, superseded above where the work progressed.

# Monthly operation

The Codex heartbeat **monthly-incident-tracker-review** is installed and active for the **27th of each month at 9 a.m. America/New_York**. It runs locally in this workflow. The current [completion report](COMPLETION_REPORT.md) records the tested code and model execution; the [editorial pointer](LATEST_EDITORIAL.json) records the model-review result.

## What a regular check does

1. Looks in Downloads for an exact `incident_tracker_export_YYYY-MM-DD.csv` filename, checks its schema and dates, and compares its content hash with the previous input.
2. Refreshes the registered public statements, including when the CSV is unchanged or unavailable.
3. For genuinely changed valid input, creates a new analysis, compares it with the previous export, and runs an authenticated Astra draft followed by a separate Fable review of the numbers, chart settings, wording, and caveats.
4. Records the input, source refresh, calculations, model responses, and execution outcome. It never publishes to the tracker.

Unchanged bytes do not trigger another analysis or paid model call, even under a new filename. A failed, incomplete, or missing review remains an explicit issue. Successful review must match the current run, or pass the full evidence-equivalence validator; a matching CSV hash alone is insufficient. Changes to code or pinned definitions also require attention rather than silently certifying an old result.

A verified adjudication receipt can resolve rejected replacement text. It records the corrected wording, evidence, and reasons, preserves the original rejected model status, and still requires human publication review.

Any supplied source-review context must match the new CSV hash. Historical diagnoses are not silently carried forward as current findings.

## Run it manually

From `/Users/petervartanian/Downloads/incident-tracker-prototype/v2`:

```sh
poetry run python -B scripts/check_monthly.py
```

The verified current Mac environment can also run the check directly:

```sh
'/Users/petervartanian/Library/Caches/pypoetry/virtualenvs/incident-tracker-evidence-BIAVxxbj-py3.11/bin/python' -B '/Users/petervartanian/Downloads/incident-tracker-prototype/v2/scripts/check_monthly.py' --project '/Users/petervartanian/Downloads/incident-tracker-prototype/v2' --downloads '/Users/petervartanian/Downloads'
```

The schedule depends on this Mac and Codex being available, this local environment, and the existing official Codex and Claude authentication. It does not extract or store their tokens. Execution records are in `logs/monthly-checks/`; model requests and responses are in `logs/editorial/`; calculation runs are in `runs/`. The export's filename date and the actual execution time are recorded separately.

## What has and has not been exercised

The authenticated CLI path has executed real drafting and independent review. The website refresh checks registered quotation text and, for app content, source identity; it does not exhaustively recalculate every number rendered by the live website. Interactive checks are recorded separately. Tests cover input validation, changed and unchanged branches, failures, exact-run review binding, definition changes, and strict adoption. The optional SDK adapter has not been live-tested. Controlled fixtures do not count as a second real export; that end-to-end comparison awaits another genuine same-pipeline CSV.

Automatic local checking is installed. Automatic delivery from Arcola still needs an equivalent documented feed or an agreed file-delivery route. The public website mirror has different classifications and is not used as a substitute. Current HTML/PDF files remain a frozen presentation of the supplied export; this command generates new reports without overwriting or publishing that pack.

## Final installed rehearsal

The installed check completed successfully on September 27, 2026, New York time (September 28 UTC). It recognized the unchanged CSV, made no new analysis or model call, and revalidated the recorded editorial corrections against the current run. All 10 public sources were available: 52 registered quotations were present and seven app-source entries were unchanged. No registered quotation was classified as changed or absent. This checks 59 source-registry entries; the analytical report separately audits 19 empirical statements. See the [rehearsal record](review/completion/MONTHLY_REHEARSAL.json). This is an unchanged-input rehearsal, not a second genuine export comparison.
