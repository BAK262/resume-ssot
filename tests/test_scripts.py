#!/usr/bin/env python3
"""Smoke tests for resume-ssot scripts."""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from export_plain import _ResumeHTMLParser
FIXTURE = ROOT / "fixtures" / "example-ssot.json"
HTML = ROOT / "fixtures" / "example-resume.html"
STARTER = ROOT / "templates" / "ssot-starter.json"
REQUIRED_TOP = [
    "meta",
    "person",
    "engagements",
    "outputs",
    "metrics",
    "constraints",
    "term_registry",
    "sources_index",
    "conflicts",
    "change_log",
]


def test_validate_fixture() -> None:
    r = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "validate_ssot.py"), str(FIXTURE)],
        capture_output=True,
        text=True,
    )
    assert r.returncode == 0, r.stdout + r.stderr


def test_starter_has_required_top() -> None:
    data = json.loads(STARTER.read_text(encoding="utf-8"))
    missing = [k for k in REQUIRED_TOP if k not in data]
    assert not missing, f"starter missing top-level keys: {missing}"


def test_schema_version_aligned() -> None:
    starter = json.loads(STARTER.read_text(encoding="utf-8"))
    example = json.loads(FIXTURE.read_text(encoding="utf-8"))
    s_ver = starter.get("meta", {}).get("schema_version")
    e_ver = example.get("meta", {}).get("schema_version")
    assert s_ver, "starter meta.schema_version missing"
    assert e_ver == s_ver, f"schema_version drift: starter={s_ver!r} example={e_ver!r}"


def test_export_from_html() -> None:
    out = ROOT / "fixtures" / "_test_export.txt"
    r = subprocess.run(
        [
            sys.executable,
            str(ROOT / "scripts" / "export_plain.py"),
            "--from-html",
            str(HTML),
            "--in",
            str(FIXTURE),
            "--out",
            str(out),
        ],
        capture_output=True,
        text=True,
    )
    assert r.returncode == 0, r.stdout + r.stderr
    text = out.read_text(encoding="utf-8")
    assert "项目" in text
    assert "不负责后端" not in text
    assert "PROJ-2024-001" not in text
    assert "94.2%（结题口径）" in text
    assert "Lin, X., Chen, Y." in text
    assert "示例理工大学 计算机学院" in text
    assert "可入职 2020.09" in text
    assert "实时告警平台｜后端组技术总负责 2024.07" in text
    out.unlink(missing_ok=True)


def test_export_academic_track() -> None:
    out = ROOT / "fixtures" / "_test_academic.txt"
    r = subprocess.run(
        [
            sys.executable,
            str(ROOT / "scripts" / "export_plain.py"),
            "--in",
            str(FIXTURE),
            "--out",
            str(out),
            "--track",
            "academic",
        ],
        capture_output=True,
        text=True,
    )
    assert r.returncode == 0, r.stdout + r.stderr
    text = out.read_text(encoding="utf-8")
    assert "发表" in text
    out.unlink(missing_ok=True)


def test_resume_presentation_contract() -> None:
    example = HTML.read_text(encoding="utf-8")
    template = (ROOT / "templates/resume-industry.html").read_text(encoding="utf-8")
    style = lambda text: re.search(r"<style>(.*?)</style>", text, re.S).group(1)
    assert style(example) == style(template), "Example CSS must track its template baseline"
    headings = re.findall(r"<h2>(.*?)</h2>", example)
    assert headings == ["教育", "项目", "代表作", "技能", "其他"]
    projects = example.split("<h2>项目</h2>")[1].split("</section>")[0]
    titles = re.findall(r'<div class="line"><span>(.*?)</span><span class="date">', projects)
    assert len(titles) == 4
    for title in titles:
        assert re.fullmatch(r"<strong>[^<]+</strong>　[^<｜]+｜[^<｜]+", title), title
    bullets = re.findall(r"<li>(.*?)</li>", projects, re.S)
    assert all(re.match(r"<strong>[^<]+：</strong>.+", bullet) for bullet in bullets)
    for name in ("resume-industry.html", "resume-academic.html"):
        text = (ROOT / "templates" / name).read_text(encoding="utf-8")
        assert "<strong>{{PROJECT_TITLE}}</strong>　{{PROJECT_SUBTITLE}}｜{{PROJECT_ROLE}}" in text


def test_compact_header_contacts() -> None:
    parser = _ResumeHTMLParser()
    parser.feed('<header><div><span>13900000000</span><a href="mailto:x@example.com">x@example.com</a><a href="#">GitHub</a></div></header>')
    parser.finalize()
    assert parser.header_lines == ["13900000000 x@example.com GitHub"]


if __name__ == "__main__":
    test_validate_fixture()
    test_starter_has_required_top()
    test_schema_version_aligned()
    test_export_from_html()
    test_export_academic_track()
    test_resume_presentation_contract()
    test_compact_header_contacts()
    print("OK all tests")
