"""Regenerate lossless 3x CV logo derivatives; requires Pillow only for this script.

Run with a Python environment containing Pillow, such as Codex's bundled runtime.
The normal site build needs no image-processing dependency. Original files and
the display sizes in content/institution-logos.json are left unchanged.
"""
from io import BytesIO
import json
import math
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
LOGO_ROOT = ROOT / 'assets/logos'
OUTPUT = LOGO_ROOT / '3x'


def main():
    logos = json.loads((ROOT / 'content/institution-logos.json').read_text())
    OUTPUT.mkdir(exist_ok=True)
    original_bytes = optimized_bytes = count = 0
    for logo in logos.values():
        source = LOGO_ROOT / logo['file']
        if source.suffix.lower() != '.png':
            continue
        size = (math.ceil(logo['width'] * 3), math.ceil(logo['height'] * 3))
        with Image.open(source) as image:
            resized = image.convert('RGBA').resize(size, Image.Resampling.LANCZOS)
        encoded = BytesIO()
        resized.save(encoded, 'WEBP', lossless=True, method=6, exact=True)
        data = encoded.getvalue()
        with Image.open(BytesIO(data)) as decoded:
            assert decoded.convert('RGBA').tobytes() == resized.tobytes(), source.name
        destination = OUTPUT / source.with_suffix('.webp').name
        destination.write_bytes(data)
        original_bytes += source.stat().st_size
        optimized_bytes += len(data)
        count += 1
        print(f'{source.name}: {size[0]}×{size[1]}, {len(data):,} bytes')
    print(f'{count} logos: {original_bytes:,} → {optimized_bytes:,} bytes '
          f'({100 * (1 - optimized_bytes / original_bytes):.1f}% smaller)')


if __name__ == '__main__':
    main()
