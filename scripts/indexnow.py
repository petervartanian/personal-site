#!/usr/bin/env python3
"""Notify IndexNow of meaningful changes to deployed, sitemap-listed public pages.

No third-party Python packages. Run --dry-run for a local plan; actual submissions
require a successful Pages deployment at the checked-out commit. The first run
requires explicit --initialize to announce the reviewed public migration once.
"""
import argparse
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import io
import json
import os
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import urlsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler
import xml.etree.ElementTree as ET
import zipfile


ROOT = Path(__file__).resolve().parents[1]
HOST = "petervartanian.xyz"
ORIGIN = f"https://{HOST}"
KEY = "25d5c247378ed1388cd5d36f59fc81a7"
KEY_FILE = f"{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"
REPOSITORY = os.environ.get("GITHUB_REPOSITORY", "")
WORKFLOW = ".github/workflows/indexnow.yml"
DEPLOYMENT_NAMES = {"pages build and deployment", "pages-build-deployment"}
ARTIFACT = "indexnow-public-state"
FORBIDDEN = {
    "200", "agency-costs", "backdrive", "correlator", "haruspex", "monitor",
    "arcolens", "arco-lens", "artifacts", "assets", "scripts", "content",
}
MAX_BYTES = 2_000_000


def public_url(url):
    """Fail closed on noncanonical URLs and explicitly private routes/assets."""
    parsed = urlsplit(url)
    if (parsed.scheme != "https" or parsed.netloc != HOST or parsed.query
            or parsed.fragment or not re.fullmatch(r"/(?:[a-z0-9-]+/)*", parsed.path)):
        raise ValueError(f"Not a canonical public page URL: {url}")
    parts = set(parsed.path.strip("/").split("/"))
    if parts & FORBIDDEN or any("arcolens" in part for part in parts):
        raise ValueError(f"Private/asset URL is prohibited: {url}")
    return url


def sitemap_urls(data):
    root = ET.fromstring(data)
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    if root.tag != ns + "urlset":
        raise ValueError("Expected a URL sitemap, not a sitemap index")
    urls = [public_url(node.text or "") for node in root.findall(ns + "url/" + ns + "loc")]
    if not urls or len(urls) > 10_000 or len(set(urls)) != len(urls):
        raise ValueError("Sitemap is empty, duplicated, or too large")
    return urls


class Page(HTMLParser):
    """Content and crawl directives, excluding cosmetic markup and timestamps."""
    def __init__(self, data):
        super().__init__(convert_charrefs=True)
        self.main = False
        self.title = False
        self.skip = 0
        self.tokens = []
        self.canonicals = []
        self.blocked = False
        self.feed(data.decode("utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.main = True
        if tag == "title" and not self.main:
            self.title = True
        if tag in {"script", "style"}:
            self.skip += 1
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href"))
        if tag == "meta":
            name = attrs.get("name", "").lower()
            value = attrs.get("content", "")
            if name in {"robots", "bingbot", "googlebot"}:
                self.blocked |= bool(re.search(r"\b(noindex|none)\b", value, re.I))
            if attrs.get("http-equiv", "").lower() == "refresh":
                self.blocked = True
            if name == "description" or name.startswith("citation_"):
                self.tokens.append((name, value))
        if self.main and not self.skip:
            for name in ("href", "alt", "datetime"):
                if name in attrs:
                    self.tokens.append((name, attrs[name]))

    def handle_endtag(self, tag):
        if tag == "main":
            self.main = False
        if tag == "title":
            self.title = False
        if tag in {"script", "style"}:
            self.skip = max(0, self.skip - 1)

    def handle_data(self, text):
        if (self.main or self.title) and not self.skip:
            text = " ".join(text.split())
            if text:
                self.tokens.append(("text", text))

    def fingerprint(self, url):
        if self.blocked or self.canonicals != [url] or not self.tokens:
            raise ValueError(f"Page is blocked, noncanonical, or empty: {url}")
        return hashlib.sha256(json.dumps(self.tokens, ensure_ascii=False).encode()).hexdigest()


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


def snapshot(ref):
    sitemap = git("show", f"{ref}:sitemap.xml")
    pages = {}
    for url in sitemap_urls(sitemap):
        file = urlsplit(url).path.lstrip("/") + "index.html"
        data = git("show", f"{ref}:{file}")
        pages[url] = {"digest": Page(data).fingerprint(url), "body": data}
    return sitemap, pages


def changed_urls(current, previous):
    # Removed URLs are deliberately excluded: withdrawing a page for privacy must
    # never advertise its address in a notification, even a deletion notification.
    return [url for url, item in current.items()
            if previous.get(url) != item["digest"]]


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def fetch_live(url):
    # A redirect can change origin or conceal a missing page, so refuse it.
    request = Request(url, headers={"User-Agent": "PublicSiteIndexNow/1.0"})
    with build_opener(NoRedirect).open(request, timeout=30) as response:
        data = response.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise ValueError(f"Unexpectedly large live resource: {url}")
        if re.search(r"\b(noindex|none)\b", response.headers.get("X-Robots-Tag", ""), re.I):
            raise ValueError(f"Live resource blocks indexing: {url}")
        return data


def github(path):
    # gh uses the workflow token for both public and private repositories, including
    # signed artifact downloads, without putting authorization on website requests.
    if not re.fullmatch(r"petervartanian/[A-Za-z0-9_.-]+", REPOSITORY):
        raise ValueError("Expected a petervartanian repository in GITHUB_REPOSITORY")
    return subprocess.check_output(["gh", "api", f"repos/{REPOSITORY}/{path}"])


def restore_state():
    artifacts = json.loads(github(f"actions/artifacts?name={ARTIFACT}&per_page=100"))["artifacts"]
    for item in sorted(artifacts, key=lambda x: x["created_at"], reverse=True):
        if item["expired"]:
            continue
        run = json.loads(github(f"actions/runs/{item['workflow_run']['id']}"))
        if run["path"] != WORKFLOW or run["conclusion"] != "success" or run["head_branch"] != "main":
            continue
        with zipfile.ZipFile(io.BytesIO(github(f"actions/artifacts/{item['id']}/zip"))) as archive:
            state = json.loads(archive.read("indexnow-state.json"))
        if state.get("version") != 1 or state.get("repository") != REPOSITORY:
            raise ValueError("Unexpected IndexNow checkpoint")
        return state
    return None


def verify_deployment(sha):
    if os.environ.get("GITHUB_ACTIONS") != "true":
        raise ValueError("Actual submissions must run in this repository's workflow")
    runs = json.loads(github(f"actions/runs?head_sha={sha}&status=success&per_page=100"))["workflow_runs"]
    if not any(run["name"] in DEPLOYMENT_NAMES and run["head_sha"] == sha
               and run["head_branch"] == "main" and run["event"] != "pull_request"
               for run in runs):
        raise ValueError("No successful main-branch Pages deployment at this commit")


def submit(urls, allowed_urls):
    # One request only. A timeout could mean accepted; never automatically retry.
    for url in urls:
        public_url(url)
        if url not in allowed_urls:
            raise ValueError(f"URL is not in the current public sitemap: {url}")
    body = json.dumps({"host": HOST, "key": KEY,
                       "keyLocation": f"{ORIGIN}/{KEY_FILE}", "urlList": urls}).encode()
    request = Request(ENDPOINT, data=body, method="POST",
                      headers={"Content-Type": "application/json; charset=utf-8"})
    with build_opener(NoRedirect).open(request, timeout=30) as response:
        if response.status not in {200, 202}:
            raise ValueError(f"IndexNow rejected submission: HTTP {response.status}")
        print(f"IndexNow received {len(urls)} URLs (HTTP {response.status}); this is not indexing confirmation.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--initialize", action="store_true", help="Announce all reviewed public pages only when no checkpoint exists")
    parser.add_argument("--state-input", type=Path, help="Checkpoint for an offline dry run")
    parser.add_argument("--output", type=Path, default=Path("indexnow-state.json"))
    args = parser.parse_args()
    if args.state_input and not args.dry_run:
        parser.error("--state-input is allowed only with --dry-run")
    sha = git("rev-parse", "HEAD").decode().strip()
    sitemap, pages = snapshot(sha)
    if args.dry_run:
        state = json.loads(args.state_input.read_text()) if args.state_input else None
    else:
        verify_deployment(sha)
        state = restore_state()
        if state is None and not args.initialize:
            print("No checkpoint: no URLs submitted. Review the first deployment, then run the workflow with initialize=true.")
            return
    if state is None and args.initialize:
        # This is the reviewed migration's first notification, even if its final
        # deployment commit only adds CNAME. A saved checkpoint always takes
        # precedence, so rerunning initialization cannot repeat unchanged pages.
        previous = {}
    elif state is None:
        # Read only current public URLs at the parent commit: its sitemap may still
        # contain newly withdrawn private routes, which must not become candidates.
        previous = {}
        for url in pages:
            file = urlsplit(url).path.lstrip("/") + "index.html"
            old = subprocess.run(["git", "show", f"{sha}^:{file}"], cwd=ROOT, capture_output=True)
            if old.returncode == 0:
                previous[url] = Page(old.stdout).fingerprint(url)
    else:
        previous = state["pages"]
    urls = changed_urls(pages, previous)
    print(json.dumps({"commit": sha, "changed_public_urls": urls}, indent=2))
    if args.dry_run:
        return
    if git("show", f"{sha}:{KEY_FILE}").decode().strip() != KEY:
        raise ValueError("Local ownership key does not match")
    if fetch_live(f"{ORIGIN}/sitemap.xml") != sitemap:
        raise ValueError("Live sitemap differs from the deployed commit; nothing submitted")
    if fetch_live(f"{ORIGIN}/{KEY_FILE}").decode().strip() != KEY:
        raise ValueError("Live ownership key is unavailable; nothing submitted")
    for url in urls:
        if fetch_live(url) != pages[url]["body"]:
            raise ValueError(f"Live page differs from the deployed commit: {url}")
    if urls:
        submit(urls, pages)
    state = {"version": 1, "repository": REPOSITORY, "commit": sha,
             "recorded_at": datetime.now(timezone.utc).isoformat(),
             "pages": {url: item["digest"] for url, item in pages.items()}}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(state, indent=2) + "\n")
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a") as output:
            output.write("state_written=true\n")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"IndexNow stopped: {error}", file=sys.stderr)
        sys.exit(1)
