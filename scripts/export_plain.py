#!/usr/bin/env python3
"""Export resume to ATS-friendly plain text from HTML (preferred) or SSOT."""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path

WORK_KINDS = {"internship", "fulltime", "parttime"}


def _fmt_dates(d: dict | None) -> str:
    if not d:
        return ""
    start = (d.get("start") or "").replace("-", ".")
    end = (d.get("end") or "").replace("-", ".")
    return f"{start}–{end}" if start or end else ""


def _build_term_index(registry: list) -> dict[str, dict]:
    index: dict[str, dict] = {}
    for entry in registry:
        if not isinstance(entry, dict):
            continue
        term = entry.get("term")
        if term:
            index[str(term)] = entry
        for alias in entry.get("aliases") or []:
            index[str(alias)] = entry
    return index


def apply_term_registry(text: str, registry: list) -> str:
    """Apply disclosure rules to plain text."""
    if not text or not registry:
        return text
    index = _build_term_index(registry)
    # Longest match first to avoid partial replacements
    for term in sorted(index.keys(), key=len, reverse=True):
        entry = index[term]
        disc = entry.get("disclosure")
        if disc == "internal":
            text = text.replace(term, "")
        elif disc == "plain_only":
            repl = entry.get("external_plain_zh") or entry.get("plain_zh") or term
            text = text.replace(term, repl)
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r" \n", "\n", text)
    return text.strip()


# Block tags start a new plain-text line. Inline tags (span/a/strong/em/…) stay in the sentence.
_BLOCK_FLUSH = frozenset({"p", "div", "li", "h1", "h3", "blockquote", "pre", "tr"})


def _collapse_ws(text: str) -> str:
    return " ".join(text.split())


class _ResumeHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.header_lines: list[str] = []
        self.sections: list[tuple[str, list[str]]] = []
        self._in_header = False
        self._in_section = False
        self._section_title = ""
        self._section_lines: list[str] = []
        self._buffer: list[str] = []
        self._ignore_depth = 0
        self._ignore_tags = {"script", "style", "head"}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in self._ignore_tags:
            self._ignore_depth += 1
            return
        if self._ignore_depth:
            return
        if tag == "header":
            self._in_header = True
        elif tag == "section":
            self._in_section = True
            self._section_title = ""
            self._section_lines = []
        elif tag == "li":
            self._flush(header=self._in_header)
            self._buffer.append("- ")
        elif tag == "br":
            self._flush(header=self._in_header)
        if tag == "span":
            for name, val in attrs:
                if name == "class" and val and "date" in val.split():
                    self._buffer.append(" ")
                    break

    def handle_endtag(self, tag: str) -> None:
        if tag in self._ignore_tags:
            self._ignore_depth = max(0, self._ignore_depth - 1)
            return
        if self._ignore_depth:
            return
        if tag == "header":
            self._flush(header=True)
            self._in_header = False
        elif tag == "h2":
            self._section_title = _collapse_ws("".join(self._buffer))
            self._buffer.clear()
        elif tag == "section":
            self._flush()
            if self._section_title:
                self.sections.append((self._section_title, self._section_lines))
            self._in_section = False
        elif tag in _BLOCK_FLUSH:
            self._flush(header=self._in_header)

    def handle_data(self, data: str) -> None:
        if self._ignore_depth:
            return
        self._buffer.append(data)

    def _flush(self, header: bool = False) -> None:
        line = _collapse_ws("".join(self._buffer))
        self._buffer.clear()
        if not line:
            return
        if header:
            self.header_lines.append(line)
        elif self._in_section:
            self._section_lines.append(line)

    def finalize(self) -> None:
        self._flush(header=True)


def export_from_html(html_path: Path, registry: list | None = None) -> str:
    raw = html_path.read_text(encoding="utf-8")
    raw = re.sub(r"<style[^>]*>.*?</style>", "", raw, flags=re.DOTALL | re.IGNORECASE)
    raw = re.sub(r"<script[^>]*>.*?</script>", "", raw, flags=re.DOTALL | re.IGNORECASE)
    parser = _ResumeHTMLParser()
    parser.feed(raw)
    parser.finalize()
    lines = list(parser.header_lines)
    for title, body in parser.sections:
        lines.append("")
        lines.append(title)
        lines.extend(body)
    if registry:
        lines = [apply_term_registry(ln, registry) for ln in lines]
    # Collapse duplicate blank lines
    out: list[str] = []
    prev_blank = False
    for ln in lines:
        blank = not ln.strip()
        if blank and prev_blank:
            continue
        out.append(ln)
        prev_blank = blank
    return "\n".join(out).strip() + "\n"


def _person_header(person: dict, registry: list) -> list[str]:
    name = person.get("name") or {}
    line = name.get("zh") or name.get("en") or "姓名"
    if name.get("en") and name.get("zh"):
        line = f"{name['zh']} / {name['en']}"
    lines = [apply_term_registry(line, registry)]
    for c in person.get("contacts") or []:
        val = c.get("value")
        if val:
            lines.append(apply_term_registry(str(val), registry))
    return lines


def _education(person: dict, registry: list) -> list[str]:
    out = ["", "教育"]
    for ed in person.get("education") or []:
        school = ed.get("school") or ""
        major = ed.get("major") or ""
        degree = ed.get("degree") or ""
        dates = _fmt_dates(ed.get("dates"))
        line = f"{school}  {major}  {degree}  {dates}".strip()
        out.append(apply_term_registry(line, registry))
    return out


def _engagement_block(eng: dict, registry: list) -> list[str]:
    title = apply_term_registry(str(eng.get("title") or eng.get("id") or ""), registry)
    org = apply_term_registry(str(eng.get("org") or ""), registry)
    dates = _fmt_dates(eng.get("dates"))
    lines = [f"{title}  {org}  {dates}".strip()]
    for act in eng.get("activities") or []:
        lines.append(f"  - {apply_term_registry(str(act), registry)}")
    for res in eng.get("results") or []:
        text = res.get("text")
        if text:
            lines.append(f"  - {apply_term_registry(str(text), registry)}")
    return lines


def _collect_tools_with_evidence(engagements: list) -> list[str]:
    """Skills only if backed by at least one engagement.tools entry."""
    tools: list[str] = []
    seen: set[str] = set()
    for e in engagements:
        for t in e.get("tools") or []:
            if t not in seen:
                seen.add(t)
                tools.append(t)
    return tools


def export_industry(data: dict) -> str:
    registry = data.get("term_registry") or []
    person = data.get("person") or {}
    engagements = data.get("engagements") or []
    outputs = data.get("outputs") or []

    work = [e for e in engagements if e.get("kind") in WORK_KINDS]
    projects = [e for e in engagements if e.get("kind") not in WORK_KINDS]
    tools = _collect_tools_with_evidence(engagements)

    lines = _person_header(person, registry)
    lines.extend(_education(person, registry))

    if tools:
        lines.extend(["", "技能", apply_term_registry(" · ".join(tools), registry)])

    if work:
        lines.extend(["", "工作经历"])
        for e in work:
            lines.extend(_engagement_block(e, registry))

    if projects:
        lines.extend(["", "项目"])
        for e in projects:
            lines.extend(_engagement_block(e, registry))

    pubs = [o for o in outputs if o.get("type") == "publication"]
    if pubs:
        lines.extend(["", "发表"])
        for p in pubs:
            cite = p.get("citation") or p.get("id") or ""
            role = p.get("role") or ""
            status = p.get("status") or ""
            extra = " · ".join(x for x in (role, status) if x)
            line = f"{cite}  ({extra})" if extra else cite
            lines.append(apply_term_registry(line, registry))

    return "\n".join(lines).strip() + "\n"


def export_academic(data: dict) -> str:
    registry = data.get("term_registry") or []
    person = data.get("person") or {}
    engagements = data.get("engagements") or []
    outputs = data.get("outputs") or []

    lines = _person_header(person, registry)
    lines.extend(_education(person, registry))

    interests = person.get("research_interests") or person.get("phd_thesis")
    if interests:
        if isinstance(interests, dict):
            interests = interests.get("title") or interests.get("summary") or ""
        lines.extend(["", "研究兴趣", apply_term_registry(str(interests), registry)])

    pubs = [o for o in outputs if o.get("type") == "publication"]
    if pubs:
        lines.extend(["", "发表"])
        for p in pubs:
            cite = p.get("citation") or p.get("id") or ""
            role = p.get("role") or ""
            line = f"{cite}  ({role})" if role else cite
            lines.append(apply_term_registry(line, registry))

    if engagements:
        lines.extend(["", "项目与报告"])
        for e in engagements:
            title = apply_term_registry(str(e.get("title") or ""), registry)
            org = apply_term_registry(str(e.get("org") or ""), registry)
            dates = _fmt_dates(e.get("dates"))
            lines.append(f"{title}  {org}  {dates}".strip())

    honors = [o for o in outputs if o.get("type") in ("honor", "teaching", "service")]
    if honors:
        lines.extend(["", "荣誉与服务"])
        for h in honors:
            lines.append(apply_term_registry(str(h.get("citation") or h.get("id") or ""), registry))

    return "\n".join(lines).strip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Export resume to plain text")
    parser.add_argument("--out", dest="output_path", required=True, help="output .txt path")
    parser.add_argument("--track", choices=["industry", "academic"], default="industry")
    parser.add_argument("--from-html", dest="html_path", help="JD/base HTML (preferred for 投递版)")
    parser.add_argument("--in", dest="input_path", help="ssot.json (fallback / 通用版)")
    args = parser.parse_args()

    registry: list = []
    if args.html_path:
        html = Path(args.html_path)
        if args.input_path:
            data = json.loads(Path(args.input_path).read_text(encoding="utf-8"))
            registry = data.get("term_registry") or []
        text = export_from_html(html, registry)
    elif args.input_path:
        data = json.loads(Path(args.input_path).read_text(encoding="utf-8"))
        registry = data.get("term_registry") or []
        text = export_academic(data) if args.track == "academic" else export_industry(data)
    else:
        parser.error("Provide --from-html or --in")

    Path(args.output_path).write_text(text, encoding="utf-8")
    print(args.output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
