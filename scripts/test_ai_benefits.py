"""Check the public database contract after running the site builder.

These tests read the canonical data and generated pages without rebuilding them.
Run with ``python3 scripts/test_ai_benefits.py``.
"""

from collections import Counter
from collections.abc import Iterator
import csv
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
}
COLLECTION_PAGES = {
    "index.html",
    "compare/index.html",
    "method/index.html",
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
        cls.leads = json.loads((DATABASE / "leads.json").read_text())
        cls.records = cls.data["records"]
        cls.by_id = {record["id"]: record for record in cls.records}
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
        self.assertEqual(len(self.records), 7)
        self.assertEqual(
            {r["id"]: r["record_number"] for r in self.records}, EXPECTED_RECORDS
        )
        self.assertEqual(len(self.by_id), len(self.records))
        types = Counter(r["record_type"] for r in self.records)
        self.assertEqual(types, {"individual_event": 5, "study_result": 2})
        self.assertEqual(self.data["counts"]["total"], len(self.records))
        self.assertEqual(self.data["counts"]["by_record_type"], dict(types))
        self.assertEqual(
            self.data["counts"]["by_topic"],
            dict(Counter(r["presentation"]["topic"] for r in self.records)),
        )

    def test_research_leads_remain_separate_and_counted(self) -> None:
        leads = self.leads["records"]
        ids = {lead["id"] for lead in leads}
        self.assertEqual(len(leads), 43)
        self.assertEqual(len(ids), len(leads))
        self.assertTrue(ids.isdisjoint(self.by_id))
        self.assertEqual(self.leads["counts"]["total"], len(leads))
        self.assertEqual(self.data["counts"]["research_leads"], len(leads))
        self.assertEqual(
            self.leads["counts"]["by_source_group"],
            dict(Counter(lead["source_group"] for lead in leads)),
        )
        for lead in leads:
            with self.subTest(lead=lead["id"]):
                self.assertEqual(
                    lead["review_status"],
                    "relevance_screened_source_verification_pending",
                )
                self.assertTrue(lead["verification_task"])

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
                self.assertTrue(all(p["questions"].values()))
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
                    self.assertTrue(source["published"])
                    self.assert_public_http_url(source["url"])
                    urls.add(source["url"])
                self.assertIn(record["presentation"]["url"], urls)
        for lead in self.leads["records"]:
            with self.subTest(lead=lead["id"]):
                self.assertTrue(lead["source_urls"])
                for url in lead["source_urls"]:
                    self.assert_public_http_url(url)

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
        self.assertEqual(set(self.pages), expected)
        for relative, page in self.pages.items():
            with self.subTest(page=relative):
                url = ORIGIN + "/ai-benefits/" + relative.removesuffix("index.html")
                self.assertEqual(page.canonicals, [url])

    def test_permalinks_expose_outcomes_evidence_sources_and_replication(self) -> None:
        directory = self.pages["records/index.html"]
        for record in self.records:
            with self.subTest(record=record["id"]):
                path = f'/ai-benefits/records/{record["id"]}/'
                self.assertEqual(record["record_url"], ORIGIN + path)
                self.assertIn(path, directory.links)
                page = self.pages[f'records/{record["id"]}/index.html']
                self.assertTrue(
                    {"outcome", "evidence", "replication", "sources"}.issubset(page.ids)
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
                for questions in record["presentation"]["questions"].values():
                    for question in questions:
                        self.assertIn(normalized(question), page.visible_text)

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
        paths = [
            DATABASE / "records.json",
            DATABASE / "records.csv",
            DATABASE / "leads.json",
        ]
        paths.extend(DATABASE / relative for relative in self.pages)
        for path in paths:
            with self.subTest(file=str(path.relative_to(ROOT))):
                self.assertNotRegex(path.read_text(), PRIVATE_PATH)


if __name__ == "__main__":
    unittest.main()
