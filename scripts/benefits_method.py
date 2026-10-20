"""Render the public method as a compact, visible record-making process."""

from __future__ import annotations

from html import escape
from typing import Any


def _e(value: Any) -> str:
    return escape(str(value or ""), quote=True)


def method_body(
    method: dict[str, Any], records: list[dict[str, Any]] | None = None
) -> str:
    """Keep inclusion, source review, and continued revision distinct."""
    coverage = ""
    if records is not None:
        episodes = sum(
            record["record_type"] == "individual_event" for record in records
        )
        studies = sum(record["record_type"] == "study_result" for record in records)
        episode_label = "reported episode" if episodes == 1 else "reported episodes"
        study_label = "comparative study" if studies == 1 else "comparative studies"
        coverage = (
            '<p class="bc-method-coverage">'
            f"{episodes} {episode_label} and {studies} {study_label}."
            "</p>"
        )
    stages = "".join(
        f'<li><h2>{_e(stage["title"])}</h2><p>{_e(stage["body"])}</p></li>'
        for stage in method["stages"]
    )
    questions = "".join(
        f'<div><dt>{_e(question["question"])}</dt>'
        f'<dd>{_e(question["answer"])}</dd></div>'
        for question in method["questions"]
    )
    foundations = "".join(
        f'<li><a href="{_e(source["url"])}" target="_blank" '
        f'rel="noopener noreferrer">{_e(source["title"])}</a></li>'
        for source in method["foundations"]
    )
    return f"""<article class="bc-method">
<header class="bc-method-heading"><h1>{_e(method['title'])}</h1><p>{_e(method['intro'])}</p>{coverage}</header>
<ol class="bc-method-track" aria-label="How records are prepared">{stages}</ol>
<section class="bc-method-anatomy"><h2>Inside a record</h2><dl class="bc-method-questions">{questions}</dl></section>
<section class="bc-method-limits" aria-label="Scope and reuse"><div><h2>Scope</h2><p>{_e(method['scope'])}</p><p>{_e(method['review'])}</p></div><div><h2>Reuse</h2><p>{_e(method['reuse'])}</p></div></section>
<section class="bc-method-foundations"><h2>Informed by</h2><ul class="bc-method-links">{foundations}</ul></section>
</article>"""
