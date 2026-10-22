# Arcolens setup

Use this package to analyze your next Arcola CSV. It includes the original
export and supporting evidence.

You can read the reports on Peter's hosted Arcolens without installing anything.
Follow this guide to run the analysis on your own computer.

## Install

Install Python 3.11 or newer. Extract the ZIP, then open a terminal in its arcolens
folder. On macOS or Linux:

    python3 -m venv .venv
    .venv/bin/python -m pip install --require-hashes -r requirements.txt

On Windows PowerShell:

    py -3 -m venv .venv
    .venv\Scripts\python.exe -m pip install --require-hashes -r requirements.txt

Use that Python executable in all commands below. On Windows, substitute
.venv\Scripts\python.exe for .venv/bin/python.

## Open a complete example

    .venv/bin/python -m delivery.runner verify-package
    .venv/bin/python -m delivery.runner build --output deliveries/example

Open `deliveries/example/simon-review/OPEN_REVIEW.html` in a browser. This builds
a review of the supplied September CSV without contacting a model provider.

Review presents the findings. Monitor adds the update history and extra chart
controls. Scheduled updates require a separate operator configuration.

## Analyze the next CSV

Place the new dated Arcola export in this folder, then run:

    .venv/bin/python -m delivery.runner update --csv incident_tracker_export_2026-10-27.csv --output deliveries/october

The filename supplies the export date. An arbitrary filename requires
--analysis-date YYYY-MM-DD. Use the date of the export.

The program validates the CSV before recalculating the reports. It compares the
results with the previous run, then verifies the new review. Earlier work remains
intact.

Open the generated review to assess each candidate. The published-insight audit
has a separate page. Download reports from Files and evidence.

The default update runs offline. Use --refresh-claims to check live published
wording. A changed quotation is flagged for review. Updating the claim registry
requires a separate decision.

## Optional LLM review

Install the official Codex and Claude command-line tools. Authenticate under the
accounts you intend to use. Add --models to run an Astra draft followed by an
independent Fable review. Those calls may incur provider charges. Supply your own
credentials. An ordinary build or default update runs offline.

The review checks the numbers, chart settings, and wording. A failed model review
stops a models-enabled delivery. Its full record remains available locally.
Check the supporting evidence before choosing a model suggestion for publication.

## Recurring operation

Run the update command when a new export arrives. To automate updates, connect
your source accounts and configure a schedule. Review and Monitor display the
configuration recorded at build time. See delivery/SOURCE_DELIVERY.md for setup.

You and Peter decide what to publish on the public tracker. An ordinary build
creates a local review. Publication requires a separate configured action that
encrypts private content for the personal site's /200/ collection. Source code,
source data, and plaintext review files stay in this private repository.
See delivery/HOSTING.md for that optional handoff.

## Checks

    .venv/bin/python -m tracker verify --run latest
    .venv/bin/python -m unittest discover -s delivery/tests

The definitions under research/ and config/ specify how results are calculated.
Update them when the tracker changes. Classification accuracy requires an
independent evaluation. Reporting bias requires separate investigation.
