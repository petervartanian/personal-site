"""Verify static deployment boundaries using temporary, fictional artifacts."""

from hashlib import sha256
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from browser_app import MANIFEST, REQUIRED, allowed_asset, browser_page, validate_artifact
from install_omphalos import install


def fixture(directory):
    names = REQUIRED | {"runtime/pyodide/pyodide.js", "runtime/wheels/pydantic-2.14.1-py3-none-any.whl", "runtime/licenses/PYODIDE-LICENSE", "runtime/licenses/PYTHON-LICENSE"}
    contents = {name: b"isolated test fixture" for name in names}
    contents["index.html"] = b'<!doctype html><html lang="en"><head><title>omphalOS</title><link rel="canonical" href="https://petervartanian.xyz/omphalos/"><link rel="stylesheet" href="./styles.css"><script src="./browser.js" defer></script><script src="./app.js" defer></script></head><body><main id="main">Isolated test fixture</main></body></html>'
    files = []
    for name, data in sorted(contents.items()):
        target = directory / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        files.append({"path": name, "sha256": sha256(data).hexdigest(), "bytes": len(data)})
    manifest = {"kind": "omphalos-browser-build", "schema_version": 1, "runtime_only": False, "files": files}
    (directory / MANIFEST).write_text(json.dumps(manifest))
    return manifest


class ArtifactTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.artifact = Path(self.temp.name) / "artifact"
        self.manifest = fixture(self.artifact)

    def save_manifest(self):
        (self.artifact / MANIFEST).write_text(json.dumps(self.manifest))

    def test_complete_artifact_is_exhaustive_and_fingerprinted(self):
        self.assertEqual(set(validate_artifact(self.artifact)), {item["path"] for item in self.manifest["files"]})

    def test_corrupt_or_unlisted_file_is_rejected(self):
        (self.artifact / "app.js").write_bytes(b"changed")
        with self.assertRaisesRegex(ValueError, "checksum"):
            validate_artifact(self.artifact)
        fixture(self.artifact)
        (self.artifact / "retained-records.json").write_text("{}")
        with self.assertRaisesRegex(ValueError, "unlisted"):
            validate_artifact(self.artifact)

    def test_partial_runtime_is_not_a_publishable_application(self):
        self.manifest["runtime_only"] = True
        self.save_manifest()
        with self.assertRaisesRegex(ValueError, "complete"):
            validate_artifact(self.artifact)

    def test_manifest_cannot_name_private_data_or_traverse(self):
        for name in ("../secret", "/root/data", "./app.js", "runtime//omphalos.zip", "runtime/../app.js", "runtime\\private.json", "200/index.html", "datasets/example.json", "runtime/pyodide/sessions.sqlite3", "runtime/pyodide/records.json", "runtime/wheels/private.whl", "runtime/.env", "app.js/"):
            with self.subTest(name=name):
                self.assertFalse(allowed_asset(name))

    def test_manifest_duplicates_and_invalid_lengths_are_rejected(self):
        self.manifest["files"].append(self.manifest["files"][0])
        self.save_manifest()
        with self.assertRaisesRegex(ValueError, "repeated"):
            validate_artifact(self.artifact)
        self.manifest = fixture(self.artifact)
        self.manifest["files"][0]["bytes"] = True
        self.save_manifest()
        with self.assertRaisesRegex(ValueError, "fingerprint"):
            validate_artifact(self.artifact)

    def test_symlinks_cannot_import_outside_files(self):
        (self.artifact / "app.js").unlink()
        (self.artifact / "app.js").symlink_to(self.artifact / "box.js")
        with self.assertRaisesRegex(ValueError, "regular files"):
            validate_artifact(self.artifact)

    def test_installer_does_not_resolve_a_symlink_before_validating(self):
        alias = Path(self.temp.name) / "alias"
        alias.symlink_to(self.artifact, target_is_directory=True)
        with self.assertRaisesRegex(ValueError, "regular directory"):
            install(Path(self.temp.name) / "website", alias)

    def test_absent_application_does_not_create_a_dead_link(self):
        self.assertIsNone(browser_page(Path(self.temp.name) / "website"))


class InstallationTests(unittest.TestCase):
    def test_installation_updates_only_public_app_and_its_navigation(self):
        with tempfile.TemporaryDirectory() as temporary:
            temporary = Path(temporary)
            root = temporary / "website"
            shutil.copytree(ROOT, root, ignore=shutil.ignore_patterns(".git", "__pycache__", "vault", "node_modules", "omphalos", ".omphalos-install-*"))
            artifact = temporary / "artifact"
            manifest = fixture(artifact)
            original_data = json.loads((root / "content/site.json").read_text())
            original_vault_shell = (root / "200/index.html").read_bytes()
            count = install(root, artifact)
            self.assertEqual(count, len(manifest["files"]))
            self.assertEqual((root / "200/index.html").read_bytes(), original_vault_shell)
            self.assertEqual(json.loads((root / "content/site.json").read_text())["writings"], original_data["writings"])
            self.assertEqual(json.loads((root / "content/public-pages.json").read_text()), [])
            for name in ("index.html", "site-index/index.html"):
                html = (root / name).read_text()
                self.assertEqual(html.count('href="/omphalos/"'), 1)
                for protected in ("200", "agency-costs", "backdrive", "correlator", "haruspex", "monitor", "arcolens"):
                    self.assertNotIn(f'href="/{protected}/"', html)
            for name in ("sitemap.xml", "llms.txt"):
                self.assertIn("https://petervartanian.xyz/omphalos/", (root / name).read_text())
            approved = set(json.loads((root / "content/public-files.json").read_text()))
            self.assertEqual({name for name in approved if name.startswith("omphalos/")}, {"omphalos/" + item["path"] for item in manifest["files"]} | {"omphalos/" + MANIFEST})
            self.assertEqual(set(validate_artifact(root / "omphalos")), {item["path"] for item in manifest["files"]})
            # Reinstall replaces only the reviewed artifact and does not accumulate files.
            install(root, artifact)
            self.assertFalse(list(root.glob(".omphalos-install-*")))

    def test_failed_build_restores_previous_files_and_metadata(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary) / "site"
            (root / "content").mkdir(parents=True)
            site = root / "content/site.json"
            inventory = root / "content/public-files.json"
            site.write_text(json.dumps({"page_modified": {"/": "2026-01-01", "/site-index/": "2026-01-01"}}))
            inventory.write_text('["README.md"]')
            original_site, original_inventory = site.read_bytes(), inventory.read_bytes()
            previous = fixture(root / "omphalos")
            artifact = Path(temporary) / "artifact"
            fixture(artifact)
            with patch("install_omphalos.subprocess.run", side_effect=[subprocess.CalledProcessError(1, "validate.py"), None]), self.assertRaises(subprocess.CalledProcessError):
                install(root, artifact)
            self.assertEqual(site.read_bytes(), original_site)
            self.assertEqual(inventory.read_bytes(), original_inventory)
            self.assertEqual(json.loads((root / "omphalos" / MANIFEST).read_text()), previous)
            self.assertFalse(list(root.glob(".omphalos-install-*")))


if __name__ == "__main__":
    unittest.main()
