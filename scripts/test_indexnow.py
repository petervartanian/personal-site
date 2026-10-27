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
from indexnow import ORIGIN, Page, changed_urls, page_file, public_url, sitemap_urls, submit


def html(text="Research", extra="", url=ORIGIN + "/portfolio/"):
    return (f'<html><head><title>Writing</title><link rel="canonical" href="{url}">'
            f'<meta name="description" content="Public writing">{extra}</head>'
            f'<body><main><p>{text}</p></main><footer>2026</footer></body></html>').encode()


def sitemap(urls):
    return ('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            + "".join(f"<url><loc>{url}</loc></url>" for url in urls)
            + "</urlset>")


class IndexNowSafetyTests(unittest.TestCase):
    def test_private_and_asset_urls_are_never_candidates(self):
        for path in ("200", "agency-costs", "backdrive", "correlator", "haruspex",
                     "monitor", "arcolens", "arco-lens", "explorer", "x-oscope", "auspex",
                     "assets", "scripts", "content", "data", "src", "source"):
            for suffix in ("/", "/example/"):
                with self.subTest(path=path, suffix=suffix), self.assertRaises(ValueError):
                    public_url(ORIGIN + "/" + path + suffix)

    def test_public_aibd_pages_and_artifacts_have_exact_file_paths(self):
        for path, file in (
            ("/", "index.html"),
            ("/artifacts/", "artifacts/index.html"),
            ("/aibd/", "aibd/index.html"),
            ("/aibd/all-cases.html", "aibd/all-cases.html"),
            ("/aibd/fructus.html", "aibd/fructus.html"),
            ("/aibd/records/AIBD-0042.html", "aibd/records/AIBD-0042.html"),
        ):
            with self.subTest(path=path):
                self.assertEqual(public_url(ORIGIN + path), ORIGIN + path)
                self.assertEqual(page_file(ORIGIN + path), file)

    def test_aibd_fragments_redirects_downloads_and_artifact_children_are_rejected(self):
        for path in (
            "/aibd/index.html", "/aibd/atlas.html", "/aibd/entities.html",
            "/aibd/timeline.html", "/aibd/all-fructus.html", "/aibd/dividend.html",
            "/aibd/records/AIBD-0042.assessment.html", "/aibd/records/AIBD-0042.json",
            "/aibd/records/aibd-0042.html", "/aibd/data/records.json", "/aibd/data/",
            "/aibd/style.css", "/aibd/private/", "/artifacts/example/",
            "/publications/artifacts/",
        ):
            with self.subTest(path=path), self.assertRaises(ValueError):
                public_url(ORIGIN + path)

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

    def test_collection_sitemap_cannot_advertise_another_public_section(self):
        with self.assertRaises(ValueError):
            sitemap_urls(sitemap([ORIGIN + "/portfolio/"]), prefix="/aibd/")

    def test_sitemap_duplicates_still_fail_within_one_file(self):
        with self.assertRaises(ValueError):
            sitemap_urls(sitemap([ORIGIN + "/aibd/", ORIGIN + "/aibd/"]))

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

    def test_header_and_footer_links_notify_without_cosmetic_attributes(self):
        url = ORIGIN + "/portfolio/"
        original = html()
        for region in ("header", "footer"):
            with self.subTest(region=region):
                def navigation(links):
                    block = f"<{region}>{links}</{region}>".encode()
                    return original.replace(b"<body>", b"<body>" + block)

                link = '<a href="/artifacts/">Artifacts</a>'
                before = Page(navigation("")).fingerprint(url)
                added = Page(navigation(link)).fingerprint(url)
                self.assertNotEqual(before, added)
                self.assertNotEqual(
                    added, Page(navigation(link.replace("/artifacts/", "/site-index/"))).fingerprint(url)
                )
                styled = link.replace('<a ', '<a class="muted" style="color: blue" ')
                self.assertEqual(added, Page(navigation(styled)).fingerprint(url))

    def test_noindex_and_wrong_canonicals_block_submission(self):
        for data in (html(extra='<meta name="robots" content="noindex,follow">'),
                     html(extra='<meta name="bingbot" content="none">'),
                     html(url=ORIGIN + "/cv/")):
            with self.assertRaises(ValueError):
                Page(data).fingerprint(ORIGIN + "/portfolio/")


class MigrationInitializationTests(unittest.TestCase):
    def git(self, *args):
        subprocess.run(["git", "-c", "core.fsmonitor=false", *args], cwd=self.root,
                       check=True, capture_output=True, timeout=20)

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
        (self.root / "sitemap.xml").write_text(sitemap(self.urls))
        (self.root / indexnow.KEY_FILE).write_text(indexnow.KEY + "\n")
        self.git("init", "-b", "main")
        self.git("config", "core.fsmonitor", "false")
        self.git("config", "user.name", "Test")
        self.git("config", "user.email", "test@example.invalid")
        self.git("add", ".")
        self.git("commit", "-m", "Initial public migration")
        (self.root / "CNAME").write_text(indexnow.HOST + "\n")
        self.git("add", "CNAME")
        self.git("commit", "-m", "Attach custom domain without changing pages")

    def add_aibd(self):
        urls = [ORIGIN + path for path in (
            "/aibd/", "/aibd/cases.html", "/aibd/fructus.html",
            "/aibd/records/AIBD-0042.html",
        )]
        for url in urls:
            path = self.root / page_file(url)
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(html(url=url))
        (self.root / "aibd/sitemap.xml").write_text(sitemap(urls))
        (self.root / "sitemap.xml").write_text(sitemap(self.urls + [urls[0]]))
        self.git("add", ".")
        self.git("commit", "-m", "Publish public AIBD collection")
        return urls

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

    def test_snapshot_combines_only_known_sitemaps_and_deduplicates_the_homepage(self):
        urls = self.add_aibd()
        (self.root / "unreviewed.xml").write_text(sitemap([ORIGIN + "/200/"]))
        self.git("add", "unreviewed.xml")
        self.git("commit", "-m", "Unrelated file outside notification discovery")
        with patch.object(indexnow, "ROOT", self.root):
            sitemaps, pages = indexnow.snapshot("HEAD")
        self.assertEqual(set(sitemaps), {"sitemap.xml", "aibd/sitemap.xml"})
        self.assertEqual(list(pages), self.urls + urls)
        self.assertEqual(len(pages), len(self.urls) + len(urls))

    def test_existing_checkpoint_announces_new_aibd_pages_once(self):
        with patch.object(indexnow, "ROOT", self.root):
            _, previous = indexnow.snapshot("HEAD")
        state = self.root / "checkpoint.json"
        state.write_text(json.dumps({"pages": {url: item["digest"] for url, item in previous.items()}}))
        urls = self.add_aibd()
        plan = json.loads(self.invoke("--dry-run", "--state-input", str(state)))
        self.assertEqual(plan["changed_public_urls"], urls)

    def test_new_public_page_can_replace_an_excluded_redirect(self):
        url = ORIGIN + "/artifacts/"
        path = self.root / page_file(url)
        path.parent.mkdir()
        path.write_bytes(html(url=ORIGIN + "/portfolio/",
                              extra='<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/portfolio/">'))
        self.git("add", ".")
        self.git("commit", "-m", "Old excluded alias")
        path.write_bytes(html("Public working artifacts", url=url))
        (self.root / "sitemap.xml").write_text(sitemap(self.urls + [url]))
        self.git("add", ".")
        self.git("commit", "-m", "Publish the authorized Artifacts page")
        plan = json.loads(self.invoke("--dry-run"))
        self.assertEqual(plan["changed_public_urls"], [url])

    def test_aibd_noindex_page_stops_the_snapshot(self):
        urls = self.add_aibd()
        (self.root / page_file(urls[-1])).write_bytes(
            html(url=urls[-1], extra='<meta name="robots" content="noindex">'))
        self.git("add", ".")
        self.git("commit", "-m", "Exclude an entry")
        with patch.object(indexnow, "ROOT", self.root), self.assertRaises(ValueError):
            indexnow.snapshot("HEAD")

    def test_changed_live_aibd_sitemap_prevents_any_notification(self):
        self.add_aibd()
        with patch.object(indexnow, "ROOT", self.root):
            sitemaps, _ = indexnow.snapshot("HEAD")
        live_data = {ORIGIN + "/" + path: data for path, data in sitemaps.items()}
        live_data[ORIGIN + "/aibd/sitemap.xml"] = b"different public inventory"
        with patch.object(indexnow, "verify_deployment"), \
                patch.object(indexnow, "restore_state", return_value={"pages": {}}), \
                patch.object(indexnow, "fetch_live", side_effect=live_data.__getitem__) as live, \
                patch.object(indexnow, "submit") as notify, self.assertRaises(ValueError):
            self.invoke()
        self.assertEqual([call.args[0] for call in live.call_args_list],
                         [ORIGIN + "/sitemap.xml", ORIGIN + "/aibd/sitemap.xml"])
        notify.assert_not_called()
        self.assertFalse((self.root / "indexnow-state.json").exists())


if __name__ == "__main__":
    unittest.main()
