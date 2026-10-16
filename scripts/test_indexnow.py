"""Safety checks for notification selection; no network or search submissions."""
import contextlib
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import indexnow
from indexnow import ORIGIN, Page, changed_urls, public_url, sitemap_urls, submit


def html(text="Research", extra="", url=ORIGIN + "/portfolio/"):
    return (f'<html><head><title>Writing</title><link rel="canonical" href="{url}">'
            f'<meta name="description" content="Public writing">{extra}</head>'
            f'<body><main><p>{text}</p></main><footer>2026</footer></body></html>').encode()


class IndexNowSafetyTests(unittest.TestCase):
    def test_private_and_asset_urls_are_never_candidates(self):
        for path in ("200", "agency-costs", "backdrive", "correlator", "haruspex",
                     "monitor", "arcolens", "arco-lens", "artifacts", "assets", "content"):
            for suffix in ("/", "/example/"):
                with self.subTest(path=path, suffix=suffix), self.assertRaises(ValueError):
                    public_url(ORIGIN + "/" + path + suffix)

    def test_obfuscated_external_and_noncanonical_urls_are_rejected(self):
        for url in (ORIGIN + "/%32%30%30/", ORIGIN + "/portfolio/../200/",
                    ORIGIN + "/cv/?private=1", ORIGIN + "/cv/#private", ORIGIN + "/cv",
                    ORIGIN + ":443/cv/", "https://petervartanian.xyz.evil.example/cv/",
                    "https://example.com/cv/", ORIGIN + "/assets/report.pdf"):
            with self.subTest(url=url), self.assertRaises(ValueError):
                public_url(url)

    def test_private_url_in_sitemap_fails_closed(self):
        xml = f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{ORIGIN}/200/</loc></url></urlset>'
        with self.assertRaises(ValueError):
            sitemap_urls(xml)

    def test_only_sitemap_pages_participate_and_removals_are_not_advertised(self):
        url = ORIGIN + "/portfolio/"
        current = {url: {"digest": "abc"}}
        previous = {url: "abc", ORIGIN + "/200/": "private"}
        self.assertEqual(changed_urls(current, previous), [])
        self.assertEqual(changed_urls(current, {url: "old"}), [url])

    def test_final_submission_gate_rejects_urls_absent_from_sitemap(self):
        with self.assertRaises(ValueError):
            submit([ORIGIN + "/unlisted/"], {ORIGIN + "/portfolio/"})

    def test_cosmetic_asset_and_footer_changes_do_not_notify(self):
        url = ORIGIN + "/portfolio/"
        before = html(extra='<link rel="stylesheet" href="/assets/site.css?v=old">')
        after = html(extra='<link rel="stylesheet" href="/assets/site.css?v=new">').replace(b">2026<", b">2027<")
        self.assertEqual(Page(before).fingerprint(url), Page(after).fingerprint(url))

    def test_content_and_destination_changes_do_notify(self):
        url = ORIGIN + "/portfolio/"
        before = Page(html('Research <a href="https://example.com/one">paper</a>')).fingerprint(url)
        for text in ("New research", 'Research <a href="https://example.com/two">paper</a>'):
            self.assertNotEqual(before, Page(html(text)).fingerprint(url))

    def test_noindex_and_wrong_canonicals_block_submission(self):
        for data in (html(extra='<meta name="robots" content="noindex,follow">'),
                     html(extra='<meta name="bingbot" content="none">'),
                     html(url=ORIGIN + "/cv/")):
            with self.assertRaises(ValueError):
                Page(data).fingerprint(ORIGIN + "/portfolio/")


class MigrationInitializationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.urls = [ORIGIN + path for path in (
            "/", "/portfolio/", "/cv/", "/contact/", "/site-index/",
            "/publications/eu-legal-statecraft/",
        )]
        for url in self.urls:
            file = self.root / (url.removeprefix(ORIGIN).lstrip("/") + "index.html")
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_bytes(html(url=url))
        (self.root / "sitemap.xml").write_text(
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            + "".join(f"<url><loc>{url}</loc></url>" for url in self.urls)
            + "</urlset>"
        )
        (self.root / indexnow.KEY_FILE).write_text(indexnow.KEY + "\n")
        def git(*args):
            subprocess.run(["git", *args], cwd=self.root, check=True, capture_output=True)
        git("init", "-b", "main")
        git("config", "user.name", "Test")
        git("config", "user.email", "test@example.invalid")
        git("add", ".")
        git("commit", "-m", "Initial public migration")
        (self.root / "CNAME").write_text(indexnow.HOST + "\n")
        git("add", "CNAME")
        git("commit", "-m", "Attach custom domain without changing pages")

    def invoke(self, *args):
        output = io.StringIO()
        with patch.object(indexnow, "ROOT", self.root), patch("sys.argv", ["indexnow.py", *args]), contextlib.redirect_stdout(output):
            indexnow.main()
        return output.getvalue()

    def test_first_migration_announces_all_six_even_after_cname_only_commit(self):
        plan = json.loads(self.invoke("--dry-run", "--initialize"))
        self.assertEqual(plan["changed_public_urls"], self.urls)

    def test_saved_checkpoint_prevents_repeat_even_with_initialize_flag(self):
        with patch.object(indexnow, "ROOT", self.root):
            _, pages = indexnow.snapshot("HEAD")
        state = self.root / "checkpoint.json"
        state.write_text(json.dumps({"pages": {url: item["digest"] for url, item in pages.items()}}))
        plan = json.loads(self.invoke("--dry-run", "--initialize", "--state-input", str(state)))
        self.assertEqual(plan["changed_public_urls"], [])

    def test_automatic_run_without_checkpoint_makes_no_live_or_submit_request(self):
        with patch.object(indexnow, "verify_deployment"), patch.object(indexnow, "restore_state", return_value=None), patch.object(indexnow, "fetch_live") as live, patch.object(indexnow, "submit") as notify:
            output = self.invoke()
        self.assertIn("no URLs submitted", output)
        live.assert_not_called()
        notify.assert_not_called()
        self.assertFalse((self.root / "indexnow-state.json").exists())


if __name__ == "__main__":
    unittest.main()
