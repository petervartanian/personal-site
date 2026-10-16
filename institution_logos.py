"""Add locally hosted institution marks to visible names, preserving the copy."""
from pathlib import Path
from html import escape
import json
import re
import struct

# Display sizes come from scripts/measure_logos.cjs and the contact icons' footprint.
# Fractional CSS widths preserve measured area; HTML dimensions reserve image space.
LOGOS = json.loads((Path(__file__).parent / 'content/institution-logos.json').read_text())
LOGO_ROOT = Path(__file__).parent / 'assets/logos'
ALIASES = {escape(name): key for key, logo in LOGOS.items() for name in logo['aliases']}
NAMES = re.compile(r'(?<!\w)(?:' + '|'.join(re.escape(name) for name in sorted(ALIASES, key=len, reverse=True)) + r')(?!\w)')


PHRASE_BREAKS = {
    'hoover': [' at Stanford University'],
    'un': [' of the UN General Assembly'],
    'pon': [' at Harvard Law School'],
    'verum': [' The Occidental College Law Review'],
    'uepi': [' at Occidental College'],
    'bis': [' at the U.S. Department of Commerce'],
    'state': [' to International Organizations', ' in Vienna'],
}


def add_institution_logos(markup):
    def decorate(match):
        name = match[0]
        key = ALIASES[name]
        logo = LOGOS[key]
        if key == 'mckinnon':
            first, second = name.split(' &amp; ', 1)
            name = f'{first} &amp; <br><span class="institution-wide">{second}</span>'
        boundaries = PHRASE_BREAKS.get(key, [])
        if boundaries:
            phrases = re.split('(?=' + '|'.join(re.escape(part) for part in boundaries) + ')', name)
            name = ' '.join(f'<span class="institution-phrase">{phrase.strip()}</span>' for phrase in phrases if phrase.strip())
        image_file = logo['file']
        image_style = f'--logo-width: {logo["width"]}px'
        optimized_file = f'3x/{Path(image_file).stem}.webp'
        if Path(image_file).suffix.lower() == '.png' and (LOGO_ROOT / optimized_file).is_file():
            # Keep the original aspect ratio despite rounding the derivative to whole pixels.
            with (LOGO_ROOT / image_file).open('rb') as source:
                width, height = struct.unpack('>II', source.read(24)[16:24])
            image_file = optimized_file
            image_style += f'; aspect-ratio: {width} / {height}'
        image = f'<img class="institution-logo logo-{key}" src="/assets/logos/{image_file}" width="{round(logo["width"])}" height="{round(logo["height"])}" style="{image_style}" alt="" aria-hidden="true" decoding="async">'
        label_class = 'family-office-label' if key == 'family' else 'institution-text'
        return f'<span class="institution-entry"><span class="institution-logo-slot">{image}</span><span class="institution-name"><span class="{label_class}">{name}</span></span></span>'

    parts = re.split(r'(<[^>]+>)', markup)
    for index in range(0, len(parts), 2):
        if parts[index] == 'Stealth':
            parts[index] = f'<span class="institution-entry"><span class="institution-logo-slot" aria-hidden="true"><span class="institution-question">?</span></span><span class="institution-name"><span class="confidential-bar">{parts[index]}</span></span></span>'
        else:
            parts[index] = NAMES.sub(decorate, parts[index])
    result = ''.join(parts)
    # Keep references immediately after the final name, outside its shaded text.
    result = re.sub(r'</span></span></span>(</span>)?(<sup>.*?</sup>)', lambda m: '</span>' + m[2] + '</span></span>' + (m[1] or ''), result)
    return result
