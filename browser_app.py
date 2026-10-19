"""Validate the public browser build before linking or copying it."""

from hashlib import sha256
from pathlib import Path, PurePosixPath
import json
import re
import stat


MANIFEST = "build-manifest.json"
APP_PATH = "/omphalos/"
ROOT_FILES = {
    "index.html", "app.js", "box.js", "reviewer.js", "styles.css", "browser.js",
    "browser-worker.js", "geist.woff2", "geist-mono.woff2", "font-license.txt",
    "LICENSE", "LICENSE.txt", "THIRD-PARTY-LICENSES.txt",
    "logo.svg", "logo-512.png", "apple-touch-icon.png", "favicon.ico",
}
REQUIRED = {"index.html", "app.js", "box.js", "styles.css", "browser.js", "browser-worker.js", "runtime/manifest.json", "runtime/omphalos.zip"}
PYODIDE_FILES = {"pyodide.js", "pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "pyodide-lock.json", "python_stdlib.zip", "package.json"}
LICENSE_FILES = {"runtime/licenses/PYODIDE-LICENSE", "runtime/licenses/PYTHON-LICENSE"}
MAX_FILE_BYTES = 99 * 1024 * 1024
MAX_BUILD_BYTES = 250 * 1024 * 1024


def allowed_asset(value):
    if not isinstance(value, str) or not value or "\\" in value:
        return False
    path = PurePosixPath(value)
    if path.is_absolute() or str(path) != value or any(part.startswith(".") for part in path.parts):
        return False
    if value in ROOT_FILES or value in LICENSE_FILES or value in {"runtime/manifest.json", "runtime/omphalos.zip"}:
        return True
    if path.parent == PurePosixPath("runtime/wheels"):
        return bool(re.fullmatch(r"(?:annotated_types|pydantic|pydantic_core|typing_extensions|typing_inspection)-[A-Za-z0-9_.+-]+\.whl", path.name))
    if path.parent == PurePosixPath("runtime/pyodide"):
        return path.name in PYODIDE_FILES
    return False


def validate_artifact(directory):
    directory = Path(directory)
    if directory.is_symlink() or not directory.is_dir():
        raise ValueError("The browser artifact must be a regular directory.")
    manifest_file = directory / MANIFEST
    if manifest_file.is_symlink() or not manifest_file.is_file() or manifest_file.stat().st_size > 1_000_000:
        raise ValueError("The browser build manifest is missing or invalid.")
    manifest = json.loads(manifest_file.read_text())
    if not isinstance(manifest, dict) or manifest.get("kind") != "omphalos-browser-build" or manifest.get("schema_version") != 1 or manifest.get("runtime_only") is not False:
        raise ValueError("Only a complete omphalOS browser build can be installed.")
    entries = manifest.get("files") if isinstance(manifest, dict) else None
    if not isinstance(entries, list) or not 1 <= len(entries) <= 200:
        raise ValueError("The browser build needs a bounded file inventory.")
    files = {}
    total = 0
    for item in entries:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "bytes"}:
            raise ValueError("Malformed browser build file entry.")
        name, digest, size = item["path"], item["sha256"], item["bytes"]
        if not allowed_asset(name) or name.casefold() in {value.casefold() for value in files}:
            raise ValueError(f"Unexpected or repeated browser asset: {name!r}")
        if not isinstance(digest, str) or not re.fullmatch(r"[0-9a-f]{64}", digest) or type(size) is not int or not 0 < size <= MAX_FILE_BYTES:
            raise ValueError(f"Invalid browser asset fingerprint: {name}")
        files[name] = item
        total += size
    if not REQUIRED <= files.keys() or not {"runtime/pyodide/pyodide.js", "runtime/pyodide/pyodide.mjs"} & files.keys():
        raise ValueError("The browser build is missing the application or its local Python runtime.")
    if not any(name.startswith("runtime/wheels/") for name in files):
        raise ValueError("The browser build is missing its Python dependencies.")
    if total > MAX_BUILD_BYTES:
        raise ValueError("The browser build exceeds the static-site size limit.")
    actual = set()
    for path in directory.rglob("*"):
        mode = path.lstat().st_mode
        if stat.S_ISLNK(mode) or not (stat.S_ISDIR(mode) or stat.S_ISREG(mode)):
            raise ValueError("Browser artifacts may contain only regular files and directories.")
        if stat.S_ISREG(mode):
            actual.add(path.relative_to(directory).as_posix())
    if actual != set(files) | {MANIFEST}:
        raise ValueError("The browser artifact contains unlisted or missing files.")
    for name, item in files.items():
        path = directory / name
        if path.stat().st_size != item["bytes"] or sha256(path.read_bytes()).hexdigest() != item["sha256"]:
            raise ValueError(f"Browser asset checksum mismatch: {name}")
    return files


def browser_page(root):
    directory = root / "omphalos"
    if directory.is_symlink():
        raise ValueError("The installed browser app cannot be a symbolic link.")
    if not directory.exists():
        return None
    validate_artifact(directory)
    return {"title": "omphalOS", "path": APP_PATH}
