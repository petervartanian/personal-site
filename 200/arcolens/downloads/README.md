# Incident tracker: analysis, drafting, and independent review

The prototype produces candidate findings with calculation evidence, chart settings, and limitations, and audits existing published statements. The source CSV, original v1, and completed analysis runs are preserved. Nothing is published automatically.

Start with `COMPLETION_REPORT.md` for current execution results and remaining external inputs. `REPORT_INDEX.md` links to the deterministic analysis. `LATEST_EDITORIAL.json` identifies the recorded model cycle and any strictly verified adoption by a later equivalent run. The shareable presentation is `../simon-review/OPEN_REVIEW.html` and `../Simon-review-pack.zip`.

## Run the regular check

From this v2 directory, with the locked dependencies installed:

```sh
poetry run python -B scripts/check_monthly.py
```

The current Mac also has a verified Python installation at `/Users/petervartanian/Library/Caches/pypoetry/virtualenvs/incident-tracker-evidence-BIAVxxbj-py3.11/bin/python`. It can replace `poetry run python` in these commands.

The check scans Downloads for `incident_tracker_export_YYYY-MM-DD.csv`, validates its schema/date/content, and checks the website's registered statements on every invocation. Use `--inbox /absolute/path` to include another local delivery folder. No remote export credentials are assumed.

A genuinely changed export triggers a new analysis, a comparison with the previous export, a real Astra draft, and a separate Fable review. An unchanged export makes no new paid model call. Missing, failed, or rejected review work remains visible and needs attention; it cannot silently become a successful unchanged check. A renamed copy of the same bytes does not count as new data.

The filename date is the declared export date, not a proven retrieval cutoff. The input and observed execution dates are recorded separately. A new filename alone never establishes a new data observation.

Outputs are written under `runs/`, `logs/monthly-checks/`, and `logs/editorial/`. These contain the selected CSV hash, calculations, incident ID sets, source refresh results, model requests and responses, checks, and execution status. The current HTML/PDF pack is a frozen presentation of the supplied September export; the recurring command produces new report files and does not overwrite or publish that pack.

## Run individual stages

```sh
poetry run python -B -m tracker.intake
poetry run python -B -m tracker verify --run latest
poetry run python -B -m tracker refresh-claims
poetry run python -B -m tracker --help
```

`tracker run` requires an input path and analysis date and always creates a new run. `tracker compare` compares registered runs or CSVs. The CLI help describes their options.

`tracker editorial-cycle --run latest --output /absolute/new/output/folder` uses the installed official Codex and Claude tools, their existing authentication, Astra at ultra effort, and Fable at max effort. It does not extract or store authentication tokens. `TRACKER_CODEX_BIN` and `TRACKER_CLAUDE_BIN` can select explicit executables. The current native Claude installation is preferred over an older installation on PATH. Every call records the executable/version, requested model/effort, returned model identity where available, usage, and input/output hashes.

Model responses must cover every candidate and current empirical claim. Numerical screening covers website wording, chart instructions, confidence, caveats, and reviewer replacement text. A separate model evaluates interpretation and chart compatibility. This does not turn model agreement into source validation. Human publication decisions remain required.

An optional `--context` file must match the source CSV hash. Historical source diagnostics are never silently applied to a different export. `--resume` can reuse an unchanged successful model response after a local validation repair, preserving failure history. It verifies the complete editorial manifest first and refuses changed evidence/schema/settings. Failed provider calls have at most two explicit resume retries; failures remain recorded.

## Verification and remaining access

`poetry run python -B -m unittest discover -s tests` runs the tests. The completion report records the executed counts and Python versions. Controlled fixtures test failure and changed-input branches; they are not represented as a second real export.

The monthly local schedule is recorded in `MONTHLY_READINESS.md`. Automatic delivery from Arcola still requires its equivalent export endpoint or another agreed delivery route. Genuine export-to-export validation requires another same-pipeline CSV. Public-site changes are prepared under `review/site/`; deployment requires the maintainer's source/build setup and access.

The optional Anthropic SDK adapter is retained for earlier workflows but was not established as live-tested by the CLI work. The fake provider is a test fixture, not an LLM. Current code is 0.4.0; earlier runs retain their original code and review provenance.

A rejected reviewer suggestion remains preserved. Explicit editorial adjudication can replace only the rejected replacement text with checked copy; its receipt records the original response, correction, reasons, evidence, and hashes. The monthly check accepts that receipt only after revalidating it against the current run. It does not alter raw model responses or grant publication approval.


## Expanded chart coverage and recovered evidence (0.4.0)

The standard run now includes `IT-P001` (six-category potential-cause annotation coverage) and `IT-P002` (national-security score profile). These are descriptive profiles, separate from the unchanged comparative-trend criteria. Review their chart settings, source assumptions, sensitivity tables, and incident-ID sets. The earlier model cycle covers the previous eleven-candidate bundle, not these two additions; changed-evidence review must not reuse its receipt.

`review/completion/expanded-evidence/` contains the genuine historical comparison, the pilot-reference diagnostic, source definitions, access findings and independent code checks. Private raw shared sources are retained there and excluded from the share ZIP. `review/completion/DRIVE_INTAKE.md` describes the updated existing schedule and its authenticated Drive retrieval. Upstream production of a fresh Arcola export is still external to this workflow.

Reproduce the legacy comparison with `python -m tracker.legacy_compare --old PATH_TO_ORIGINAL_LEGACY_CSV --new PATH_TO_CURRENT_CSV --output NEW_OUTPUT_DIRECTORY`. The explicit common-field mapping does not manufacture modern fields. Reproduce the small pilot diagnostic with `python -m tracker.pilot_reference_check --reference PATH_TO_CANONICAL_INPUT_CSV --export PATH_TO_CURRENT_CSV --output NEW_OUTPUT_DIRECTORY`. These command arguments identify saved input files, not fields in the review interface.
