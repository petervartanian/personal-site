"""Check the public database contract after running the site builder.

These tests read the canonical data and generated pages without rebuilding them.
Run with ``python3 scripts/test_ai_benefits.py``.
"""

from collections import Counter
from collections.abc import Iterator
import csv
import hashlib
from html.parser import HTMLParser
import ipaddress
import json
from pathlib import Path
import re
from typing import Any
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DATABASE = ROOT / "ai-benefits"
ORIGIN = "https://petervartanian.xyz"
EXPECTED_RECORDS = {
    "frnsw-hiker-rescue-2026": "AI-B-001",
    "grass-valley-fire-alert-2023": "AI-B-002",
    "create-case-1-lung-cancer": "AI-B-003",
    "royal-surrey-lung-cancer-triage": "AI-B-004",
    "sussex-stroke-treatment-2021": "AI-B-005",
    "harvard-physics-tutor-2023": "AI-B-006",
    "ithaca-historians-2022": "AI-B-007",
    "customer-support-assistant-2020": "AI-B-008",
    "professional-writing-chatgpt-2023": "AI-B-009",
    "copilot-http-server-2022": "AI-B-010",
}
PUBLISHED_BASELINE_VERSIONS = {
    "frnsw-hiker-rescue-2026": "954b08f682fc",
    "grass-valley-fire-alert-2023": "d433cff3724c",
    "create-case-1-lung-cancer": "9ddac75eb21d",
    "royal-surrey-lung-cancer-triage": "7359836dc539",
    "sussex-stroke-treatment-2021": "15727ce3d91e",
    "harvard-physics-tutor-2023": "c89d2d03bc1b",
    "ithaca-historians-2022": "ed703072d058",
}
COLLECTION_PAGES = {
    "index.html",
    "compare/index.html",
    "method/index.html",
}
REDIRECT_PAGES = {
    "sources/index.html",
    "records/index.html",
    "contribute/index.html",
}
SYSTEM_FIELDS = {
    "system_name",
    "provider",
    "model_or_family",
    "version",
    "version_status",
    "source_note",
}
PRIVATE_PATH = re.compile(
    r"file://|/(?:Users|home|tmp|private|var/folders)/"
    r"|\b[A-Za-z]:[\\/](?:Users|Documents|Temp)[\\/]"
    r"|FI2I_corpus|Biscotti\.store|Recording_alignment_",
    re.IGNORECASE,
)


def normalized(text: str) -> str:
    return " ".join(text.split())


def walk(value: Any, path: str = "") -> Iterator[tuple[str, Any]]:
    """Yield nested fields so publication checks include embedded metadata."""
    yield path, value
    if isinstance(value, dict):
        for key, child in value.items():
            yield from walk(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, f"{path}[{index}]")


class Page(HTMLParser):
    """Collect rendered text and structural facts without executing scripts."""

    VOID = {
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
    }
    INERT = {"script", "style", "template"}

    def __init__(self, source: str) -> None:
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.ids = set()
        self.classes = set()
        self.links = set()
        self.canonicals = []
        self.robots = []
        self.refreshes = []
        self.attributes = []
        self.text = []
        self.stack = []
        self.in_body = False
        self.feed(source)
        self.close()

    def handle_starttag(
        self, tag: str, attributes: list[tuple[str, str | None]]
    ) -> None:
        attrs = dict(attributes)
        self.tags.append(tag)
        self.attributes.append(attrs)
        self.classes.update(attrs.get("class", "").split())
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.add(attrs["href"])
        if tag == "link" and "canonical" in attrs.get("rel", "").split():
            self.canonicals.append(attrs.get("href"))
        if tag == "meta" and attrs.get("name", "").lower() == "robots":
            self.robots.append(attrs.get("content", "").lower())
        if tag == "meta" and attrs.get("http-equiv", "").lower() == "refresh":
            self.refreshes.append(attrs.get("content", ""))
        if tag == "body":
            self.in_body = True
        suppressed = (
            bool(self.stack and self.stack[-1][1])
            or tag in self.INERT
            or "hidden" in attrs
        )
        if tag not in self.VOID:
            self.stack.append((tag, suppressed))

    def handle_startendtag(
        self, tag: str, attributes: list[tuple[str, str | None]]
    ) -> None:
        self.handle_starttag(tag, attributes)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag == "body":
            self.in_body = False
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def handle_data(self, text: str) -> None:
        if self.in_body and not (self.stack and self.stack[-1][1]):
            self.text.append(text)

    @property
    def visible_text(self) -> str:
        return normalized(" ".join(self.text))


class DatabaseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.data = json.loads((DATABASE / "records.json").read_text())
        cls.records = cls.data["records"]
        cls.by_id = {record["id"]: record for record in cls.records}
        cls.history = json.loads(
            (ROOT / "content/ai-benefits/history.json").read_text()
        )
        cls.archives = {
            f"records/{record_id}/versions/{snapshot['key']}/index.html": snapshot
            for record_id, snapshots in cls.history.items()
            for snapshot in snapshots
        }
        cls.pages = {
            str(path.relative_to(DATABASE)): Page(path.read_text())
            for path in DATABASE.rglob("*.html")
        }

    def assert_public_http_url(self, value: str) -> None:
        self.assertIsInstance(value, str)
        self.assertNotRegex(value, r"\s")
        parsed = urlsplit(value)
        self.assertIn(parsed.scheme, {"http", "https"}, value)
        self.assertTrue(parsed.hostname, value)
        self.assertIsNone(parsed.username, value)
        self.assertIsNone(parsed.password, value)
        host = parsed.hostname.lower()
        self.assertNotEqual(host, "localhost", value)
        self.assertFalse(host.endswith((".localhost", ".local", ".internal")), value)
        try:
            address = ipaddress.ip_address(host)
        except ValueError:
            self.assertIn(".", host, value)
        else:
            self.assertTrue(address.is_global, value)

    def test_record_identities_and_counts(self) -> None:
        self.assertEqual(self.data["schema_version"], "2.0")
        self.assertEqual(len(self.records), 10)
        self.assertEqual(
            {r["id"]: r["record_number"] for r in self.records}, EXPECTED_RECORDS
        )
        self.assertEqual(len(self.by_id), len(self.records))
        types = Counter(r["record_type"] for r in self.records)
        self.assertEqual(types, {"individual_event": 5, "study_result": 5})
        self.assertEqual(self.data["counts"]["total"], len(self.records))
        self.assertEqual(self.data["counts"]["by_record_type"], dict(types))
        self.assertEqual(
            self.data["counts"]["by_topic"],
            dict(Counter(r["presentation"]["topic"] for r in self.records)),
        )

    def test_retired_research_data_is_absent_from_public_outputs(self) -> None:
        self.assertFalse((DATABASE / "leads.json").exists())
        for path, value in walk(self.data):
            if isinstance(value, dict):
                self.assertNotIn("research_leads", value, path)
        forbidden = re.compile(r"research leads?|leads\.json", re.IGNORECASE)
        for name, page in self.pages.items():
            with self.subTest(page=name):
                self.assertNotRegex(page.visible_text, forbidden)
                self.assertFalse(any("leads.json" in link for link in page.links))
        files = [DATABASE / name for name in ("records.csv", "app.js")]
        files.extend(DATABASE.rglob("*.json"))
        files.extend(DATABASE.rglob("brief.md"))
        for path in files:
            with self.subTest(file=str(path.relative_to(DATABASE))):
                self.assertNotRegex(path.read_text(), forbidden)

    def test_records_have_evidence_beneficiaries_and_replication_context(self) -> None:
        required = {
            "observed_outcome",
            "ai_contribution",
            "human_contribution",
            "limitations",
            "stakeholder_detail",
            "evidence_basis",
            "sources",
            "benefit_profile",
            "presentation",
            "system_details",
            "evidence_details",
            "revision",
        }
        for record in self.records:
            with self.subTest(record=record["id"]):
                self.assertTrue(required.issubset(record))
                for field in required:
                    self.assertTrue(record[field], field)
                p = record["presentation"]
                self.assertEqual(p["id"], record["id"])
                for field in (
                    "outcome",
                    "kind",
                    "evidence",
                    "duration",
                    "limits",
                    "conditions",
                ):
                    self.assertTrue(p[field], field)
                self.assertEqual(set(p["questions"]), {"elsewhere", "more", "longer"})
                for questions in p["questions"].values():
                    self.assertIsInstance(questions, list)
                    self.assertTrue(
                        all(
                            isinstance(question, str) and question.strip()
                            for question in questions
                        )
                    )
                self.assertEqual(record["benefit_profile"]["gain"], p["outcome"])
                self.assertEqual(
                    record["benefit_profile"]["replication"]["questions"],
                    p["questions"],
                )

    def test_model_metadata_distinguishes_known_names_from_unknown_versions(
        self,
    ) -> None:
        for record in self.records:
            with self.subTest(record=record["id"]):
                details = record["system_details"]
                self.assertEqual(set(details), SYSTEM_FIELDS)
                self.assertTrue(details["system_name"])
                self.assertTrue(details["source_note"])
                self.assertIn(details["version_status"], {"reported", "not_reported"})
                if details["version_status"] == "not_reported":
                    self.assertIsNone(details["version"])
                else:
                    self.assertIsInstance(details["version"], str)
                    self.assertTrue(details["version"].strip())
                for field in ("provider", "model_or_family", "version"):
                    value = details[field]
                    self.assertTrue(
                        value is None or isinstance(value, str) and value.strip()
                    )
        self.assertEqual(
            self.by_id["harvard-physics-tutor-2023"]["system_details"][
                "model_or_family"
            ],
            "GPT-4",
        )

    def test_sources_use_public_http_urls(self) -> None:
        for record in self.records:
            with self.subTest(record=record["id"]):
                urls = set()
                for source in record["sources"]:
                    self.assertTrue(source["title"])
                    self.assertTrue(
                        source["published"] is None
                        or isinstance(source["published"], str)
                        and source["published"].strip()
                    )
                    self.assert_public_http_url(source["url"])
                    urls.add(source["url"])
                self.assertIn(record["presentation"]["url"], urls)

    def test_evidence_details_have_supported_context_and_traceable_claims(self) -> None:
        expected_countries = {
            "frnsw-hiker-rescue-2026": ["AU"],
            "grass-valley-fire-alert-2023": ["US"],
            "create-case-1-lung-cancer": [],
            "royal-surrey-lung-cancer-triage": ["GB"],
            "sussex-stroke-treatment-2021": ["GB"],
            "harvard-physics-tutor-2023": ["US"],
            "ithaca-historians-2022": [],
            "customer-support-assistant-2020": ["PH", "US"],
            "professional-writing-chatgpt-2023": [],
            "copilot-http-server-2022": ["IN", "PK"],
        }
        for record in self.records:
            with self.subTest(record=record["id"]):
                evidence = record["evidence_details"]
                for field in (
                    "application",
                    "geography_note",
                    "source_checks",
                    "documented_conditions",
                    "transfer_limit",
                ):
                    self.assertTrue(evidence[field], field)
                expected_category = (
                    "comparative_study"
                    if record["record_type"] == "study_result"
                    else "reported_outcome"
                )
                self.assertEqual(evidence["evidence_category"], expected_category)
                countries = evidence["countries"]
                self.assertIsInstance(countries, list)
                self.assertEqual(len(countries), len(set(countries)))
                for country in countries:
                    self.assertIn(country, {"AU", "GB", "IN", "PK", "PH", "US"})
                if record["id"] in expected_countries:
                    self.assertEqual(countries, expected_countries[record["id"]])
                for check in evidence["source_checks"]:
                    self.assertTrue(check["claim"].strip())
                    self.assertTrue(check["locator"].strip())
                    index = check["source_index"]
                    self.assertIs(type(index), int)
                    self.assertGreaterEqual(index, 0)
                    self.assertLess(index, len(record["sources"]))
                for condition in evidence["documented_conditions"]:
                    self.assertTrue(condition.strip())
                related_ids = []
                for relation in evidence["related"]:
                    self.assertIn(relation["id"], self.by_id)
                    self.assertNotEqual(relation["id"], record["id"])
                    self.assertTrue(relation["reason"].strip())
                    self.assertTrue(relation["caution"].strip())
                    related_ids.append(relation["id"])
                self.assertEqual(len(related_ids), len(set(related_ids)))

    def test_current_records_preserve_comparators_and_source_locators(self) -> None:
        for record in self.records:
            with self.subTest(record=record["id"]):
                page = self.pages[f'records/{record["id"]}/index.html']
                brief = (DATABASE / f'records/{record["id"]}/brief.md').read_text()
                evidence = record["evidence_details"]
                required = [
                    record["benefit_profile"]["comparison"],
                    evidence["application"],
                    evidence["geography_note"],
                    evidence["transfer_limit"],
                    *evidence["documented_conditions"],
                ]
                required.extend(check["locator"] for check in evidence["source_checks"])
                for text in required:
                    self.assertTrue(text)
                    self.assertIn(normalized(text), page.visible_text)
                    self.assertIn(normalized(text), normalized(brief))
                for relation in evidence["related"]:
                    self.assertIn(f'/ai-benefits/records/{relation["id"]}/', page.links)
                    self.assertIn(normalized(relation["reason"]), page.visible_text)
                    self.assertIn(normalized(relation["caution"]), page.visible_text)

    def test_current_record_versions_are_recoverable_and_content_addressed(
        self,
    ) -> None:
        for record in self.records:
            with self.subTest(record=record["id"]):
                revision = record["revision"]
                content = {
                    key: value for key, value in record.items() if key != "revision"
                }
                digest = hashlib.sha256(
                    json.dumps(
                        content,
                        ensure_ascii=False,
                        sort_keys=True,
                        separators=(",", ":"),
                    ).encode()
                ).hexdigest()[:12]
                self.assertEqual(revision["key"], digest)
                self.assertRegex(revision["date"], r"^\d{4}-\d{2}-\d{2}$")
                self.assertTrue(revision["note"].strip())
                relative = f'records/{record["id"]}/versions/{digest}/'
                self.assertEqual(revision["url"], ORIGIN + "/ai-benefits/" + relative)
                self.assertTrue((DATABASE / relative / "record.json").is_file())
                saved = json.loads((DATABASE / relative / "record.json").read_text())
                self.assertEqual(saved, content)
                self.assertIn(relative + "index.html", self.pages)
                current = self.pages[f'records/{record["id"]}/index.html']
                self.assertTrue(
                    any(
                        urlsplit(link).path == "/ai-benefits/" + relative
                        for link in current.links
                    )
                )
                brief = (DATABASE / f'records/{record["id"]}/brief.md').read_text()
                self.assertIn(revision["url"], brief)

    def test_every_history_entry_has_a_matching_recoverable_snapshot(self) -> None:
        self.assertEqual(set(self.history), set(self.by_id))
        for record_id, snapshots in self.history.items():
            self.assertTrue(snapshots, record_id)
            self.assertEqual(
                len(snapshots), len({snapshot["key"] for snapshot in snapshots})
            )
            self.assertEqual(
                snapshots[-1]["key"], self.by_id[record_id]["revision"]["key"]
            )
            for snapshot in snapshots:
                with self.subTest(record=record_id, version=snapshot["key"]):
                    self.assertEqual(snapshot["record"]["id"], record_id)
                    relative = f"records/{record_id}/versions/{snapshot['key']}/"
                    saved = json.loads(
                        (DATABASE / relative / "record.json").read_text()
                    )
                    self.assertEqual(saved, snapshot["record"])
                    digest = hashlib.sha256(
                        json.dumps(
                            saved,
                            ensure_ascii=False,
                            sort_keys=True,
                            separators=(",", ":"),
                        ).encode()
                    ).hexdigest()[:12]
                    self.assertEqual(digest, snapshot["key"])
                    page = self.pages[relative + "index.html"]
                    self.assertIn("Archived version", page.visible_text)
                    self.assertIn(normalized(snapshot["note"]), page.visible_text)
                    self.assertIn(f"/ai-benefits/records/{record_id}/", page.links)
                    self.assertIn("record.json", page.links)
                    self.assertNotIn(
                        f"/ai-benefits/records/{record_id}/brief.md", page.links
                    )

    def test_collection_brief_preserves_all_records_and_evidence_limits(self) -> None:
        brief = (DATABASE / "brief.md").read_text()
        self.assertIn("/ai-benefits/brief.md", self.pages["index.html"].links)
        for record in self.records:
            with self.subTest(record=record["id"]):
                for text in (
                    record["record_number"],
                    record["observed_outcome"],
                    record["benefit_profile"]["comparison"],
                    record["limitations"],
                    record["revision"]["url"],
                ):
                    self.assertIn(normalized(text), normalized(brief))

    def test_published_baseline_versions_cannot_be_silently_rewritten(self) -> None:
        for record_id, key in PUBLISHED_BASELINE_VERSIONS.items():
            with self.subTest(record=record_id):
                path = (
                    DATABASE / "records" / record_id / "versions" / key / "record.json"
                )
                snapshot = json.loads(path.read_text())
                content = {
                    field: value
                    for field, value in snapshot.items()
                    if field != "revision"
                }
                digest = hashlib.sha256(
                    json.dumps(
                        content,
                        ensure_ascii=False,
                        sort_keys=True,
                        separators=(",", ":"),
                    ).encode()
                ).hexdigest()[:12]
                self.assertEqual(digest, key)
                self.assertEqual(snapshot["id"], record_id)
                page = self.pages[f"records/{record_id}/versions/{key}/index.html"]
                self.assertIn(
                    normalized(snapshot["observed_outcome"]), page.visible_text
                )
                self.assertIn(normalized(snapshot["limitations"]), page.visible_text)

    def test_comparison_keeps_each_selected_baseline_and_qualification(self) -> None:
        page = self.pages["compare/index.html"]
        selected = [
            attrs["value"]
            for attrs in page.attributes
            if "selected" in attrs and attrs.get("value") in self.by_id
        ]
        self.assertEqual(len(selected), 2)
        self.assertEqual(len(set(selected)), 2)
        for record_id in selected:
            with self.subTest(record=record_id):
                record = self.by_id[record_id]
                for text in (
                    record["benefit_profile"]["comparison"],
                    record["presentation"]["limits"],
                    record["evidence_details"]["transfer_limit"],
                ):
                    self.assertIn(normalized(text), page.visible_text)

    def test_study_measurements_keep_their_denominator_qualifications(self) -> None:
        tutor = self.by_id["harvard-physics-tutor-2023"]["research_data"]
        self.assertEqual(tutor["denominators"]["eligible"], 194)
        self.assertEqual(tutor["denominators"]["reported_ai_post_tests"], 142)
        self.assertEqual(tutor["denominators"]["reported_classroom_post_tests"], 174)
        self.assertTrue(tutor["denominators"]["notes"])
        scores = next(
            m
            for m in tutor["measurements"]
            if m["measure"] == "Immediate post-test median"
        )
        self.assertFalse(scores["score_range_verified"])
        self.assertTrue(scores["range_note"])
        ithaca = self.by_id["ithaca-historians-2022"]["research_data"]
        self.assertEqual(ithaca["denominators"]["human_evaluators"], 2)
        self.assertEqual(ithaca["denominators"]["full_model_test_inscriptions"], 7811)
        self.assertIsNone(ithaca["denominators"]["human_evaluation_total_confirmed"])
        self.assertTrue(ithaca["denominators"]["notes"])

    def test_csv_round_trips_every_record_and_nested_value(self) -> None:
        with (DATABASE / "records.csv").open(newline="") as stream:
            reader = csv.DictReader(stream)
            rows = list(reader)
            fields = reader.fieldnames
        self.assertEqual(len(rows), len(self.records))
        self.assertEqual(len(fields), len(set(fields)))
        self.assertEqual(
            set(fields), {key for record in self.records for key in record}
        )
        indexed = {row["id"]: row for row in rows}
        self.assertEqual(set(indexed), set(self.by_id))
        for record in self.records:
            row = indexed[record["id"]]
            restored = {}
            for key in fields:
                with self.subTest(record=record["id"], field=key):
                    value = record.get(key)
                    if isinstance(value, (dict, list)):
                        restored[key] = json.loads(row[key])
                        self.assertEqual(restored[key], value)
                    elif value is None:
                        self.assertEqual(row[key], "")
                        if key in record:
                            restored[key] = None
                    else:
                        self.assertEqual(row[key], str(value))
                        restored[key] = value
            self.assertEqual(restored, record)

    def test_exact_public_page_inventory_and_canonical_urls(self) -> None:
        expected = COLLECTION_PAGES | {
            f"records/{record_id}/index.html" for record_id in EXPECTED_RECORDS
        }
        self.assertEqual(len(expected), 13)
        self.assertEqual(
            set(self.pages), expected | REDIRECT_PAGES | set(self.archives)
        )
        for relative, page in self.pages.items():
            with self.subTest(page=relative):
                if relative in REDIRECT_PAGES:
                    self.assertEqual(page.canonicals, [ORIGIN + "/ai-benefits/"])
                    self.assertTrue(
                        any(re.search(r"\bnoindex\b", value) for value in page.robots)
                    )
                    self.assertIn("/ai-benefits/", page.links)
                    self.assertEqual(len(page.refreshes), 1)
                    self.assertRegex(
                        page.refreshes[0],
                        r"(?i)^\s*0\s*;\s*url\s*=\s*/ai-benefits/\s*$",
                    )
                elif relative in self.archives:
                    url = ORIGIN + "/ai-benefits/" + relative.removesuffix("index.html")
                    self.assertEqual(page.canonicals, [url])
                    self.assertTrue(
                        any(re.search(r"\bnoindex\b", value) for value in page.robots)
                    )
                    self.assertFalse(page.refreshes)
                else:
                    url = ORIGIN + "/ai-benefits/" + relative.removesuffix("index.html")
                    self.assertEqual(page.canonicals, [url])
                    self.assertFalse(
                        any(
                            re.search(r"\b(noindex|none)\b", value)
                            for value in page.robots
                        )
                    )

    def test_public_manifests_exclude_retired_routes_and_data(self) -> None:
        manifest = json.loads((ROOT / "content/public-pages.json").read_text())
        expected = {
            "/ai-benefits/" + relative.removesuffix("index.html")
            for relative in COLLECTION_PAGES
        } | {f"/ai-benefits/records/{record_id}/" for record_id in EXPECTED_RECORDS}
        self.assertEqual({entry["path"] for entry in manifest}, expected)
        self.assertEqual(len(manifest), len(expected))
        by_path = {entry["path"]: entry for entry in manifest}
        for record in self.records:
            page = by_path[f'/ai-benefits/records/{record["id"]}/']
            self.assertEqual(page["title"], record["presentation"]["title"])
            self.assertEqual(page["description"], record["presentation"]["outcome"])
        allowlist = json.loads((ROOT / "content/public-files.json").read_text())
        self.assertNotIn("ai-benefits/leads.json", allowlist)
        for relative in self.pages:
            self.assertIn("ai-benefits/" + relative, allowlist)
        for record_id in EXPECTED_RECORDS:
            self.assertIn(f"ai-benefits/records/{record_id}/brief.md", allowlist)
        self.assertIn("ai-benefits/brief.md", allowlist)
        self.assertIn("content/ai-benefits/history.json", allowlist)
        for relative in self.archives:
            self.assertIn(
                "ai-benefits/" + relative.replace("index.html", "record.json"),
                allowlist,
            )
        discovery = (ROOT / "sitemap.xml").read_text() + (ROOT / "llms.txt").read_text()
        for relative in self.archives:
            self.assertNotIn(
                "/ai-benefits/" + relative.removesuffix("index.html"), discovery
            )
        retired_paths = {
            "/ai-benefits/" + relative.removesuffix("index.html")
            for relative in REDIRECT_PAGES
        }
        for relative, page in self.pages.items():
            if relative not in REDIRECT_PAGES:
                with self.subTest(page=relative):
                    self.assertTrue(
                        retired_paths.isdisjoint(
                            urlsplit(link).path for link in page.links
                        )
                    )

    def test_permalinks_expose_outcomes_evidence_sources_and_replication(self) -> None:
        directory = self.pages["index.html"]
        for record in self.records:
            with self.subTest(record=record["id"]):
                path = f'/ai-benefits/records/{record["id"]}/'
                self.assertEqual(record["record_url"], ORIGIN + path)
                self.assertIn(path, directory.links)
                page = self.pages[f'records/{record["id"]}/index.html']
                self.assertTrue(
                    {"contributions", "evidence", "replication", "sources"}.issubset(
                        page.ids
                    )
                )
                for text in (
                    record["observed_outcome"],
                    record["evidence_supports"],
                    record["limitations"],
                    record["presentation"]["kind"],
                ):
                    self.assertIn(normalized(text), page.visible_text)
                for source in record["sources"]:
                    self.assertIn(source["url"], page.links)
                    self.assertIn(normalized(source["title"]), page.visible_text)
                self.assertIn(
                    normalized(record["system_details"]["system_name"]),
                    page.visible_text,
                )
                self.assertIn(
                    normalized(record["system_details"]["source_note"]),
                    page.visible_text,
                )

    def test_evidence_briefs_preserve_outcomes_limits_and_sources(self) -> None:
        briefs = {
            str(path.relative_to(DATABASE)) for path in DATABASE.glob("**/brief.md")
        }
        self.assertEqual(
            briefs,
            {f"records/{record_id}/brief.md" for record_id in EXPECTED_RECORDS}
            | {"brief.md"},
        )
        for record in self.records:
            with self.subTest(record=record["id"]):
                relative = f'records/{record["id"]}/brief.md'
                brief = (DATABASE / relative).read_text()
                page = self.pages[f'records/{record["id"]}/index.html']
                self.assertIn("/ai-benefits/" + relative, page.links)
                for field in ("observed_outcome", "evidence_supports", "limitations"):
                    self.assertIn(normalized(record[field]), normalized(brief))
                self.assertIn(record["record_url"], brief)
                for source in record["sources"]:
                    self.assertIn(source["url"], brief)

    def test_generated_prose_has_no_semicolons_or_centered_dots(self) -> None:
        for name, page in self.pages.items():
            with self.subTest(page=name):
                self.assertNotRegex(page.visible_text, r"[;\u00b7\u22c5]")

    def test_pages_have_no_disclosures_eyebrows_or_universal_grades(self) -> None:
        for name, page in self.pages.items():
            with self.subTest(page=name):
                self.assertTrue({"details", "summary"}.isdisjoint(page.tags))
                self.assertFalse(any("eyebrow" in css.lower() for css in page.classes))
                self.assertFalse(
                    any(
                        "data-grade" in attrs or "data-severity" in attrs
                        for attrs in page.attributes
                    )
                )
                self.assertNotRegex(
                    page.visible_text,
                    r"(?i)\b(?:benefit|harm|severity)\s+(?:grade|score)\s*[:=]\s*[−-]?\d",
                )
        obsolete = {
            "benefit_assessment",
            "consequence_assessment",
            "benefit_grade",
            "harm_grade",
            "severity_grade",
        }
        for path, value in walk(self.data):
            if isinstance(value, dict):
                self.assertTrue(obsolete.isdisjoint(value), path)

    def test_public_outputs_have_no_local_or_private_paths(self) -> None:
        paths = [DATABASE / "records.csv", ROOT / "content/ai-benefits/history.json"]
        paths.extend(DATABASE.rglob("*.json"))
        paths.extend(DATABASE / relative for relative in self.pages)
        paths.extend(DATABASE.rglob("brief.md"))
        for path in paths:
            with self.subTest(file=str(path.relative_to(ROOT))):
                self.assertNotRegex(path.read_text(), PRIVATE_PATH)


if __name__ == "__main__":
    unittest.main()
