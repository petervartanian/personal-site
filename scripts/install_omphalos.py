#!/usr/bin/env python3
"""Install a verified omphalOS browser artifact into this website; never publish."""

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from browser_app import MANIFEST, validate_artifact


def install(root, artifact):
    artifact = Path(artifact).expanduser().absolute()
    files = validate_artifact(artifact)
    target = root / "omphalos"
    if target.exists():
        validate_artifact(target)
    site_file = root / "content/site.json"
    inventory_file = root / "content/public-files.json"
    original_site, original_inventory = site_file.read_bytes(), inventory_file.read_bytes()
    site = json.loads(original_site)
    inventory = json.loads(original_inventory)
    now = datetime.now(timezone.utc).date().isoformat()
    for path in ("/", "/site-index/", "/omphalos/"):
        site["page_modified"][path] = now
    inventory = sorted({name for name in inventory if not name.startswith("omphalos/")} | {"omphalos/" + name for name in [*files, MANIFEST]})
    with tempfile.TemporaryDirectory(prefix=".omphalos-install-", dir=root) as temporary:
        stage = Path(temporary) / "new"
        backup = Path(temporary) / "previous"
        stage.mkdir()
        for name in [*files, MANIFEST]:
            destination = stage / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(artifact / name, destination)
        validate_artifact(stage)
        had_previous = target.exists()
        if had_previous:
            target.rename(backup)
        try:
            stage.rename(target)
            site_file.write_text(json.dumps(site, ensure_ascii=False, indent=2) + "\n")
            inventory_file.write_text(json.dumps(inventory, indent=2) + "\n")
            for script in ("build.py", "validate.py"):
                subprocess.run([sys.executable, str(root / script)], cwd=root, check=True)
        except BaseException:
            site_file.write_bytes(original_site)
            inventory_file.write_bytes(original_inventory)
            if target.exists():
                shutil.rmtree(target)
            if had_previous:
                backup.rename(target)
            subprocess.run([sys.executable, str(root / "build.py")], cwd=root, check=True)
            raise
    return len(files)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path, help="The complete dist/browser directory from omphalOS")
    args = parser.parse_args()
    try:
        count = install(ROOT, args.artifact)
    except (ValueError, OSError, subprocess.CalledProcessError) as exc:
        parser.exit(1, f"omphalOS was not installed: {exc}\n")
    print(f"Installed and validated {count} browser assets at /omphalos/. No files have been published.")


if __name__ == "__main__":
    main()
