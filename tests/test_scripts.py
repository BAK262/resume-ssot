#!/usr/bin/env python3
"""Smoke tests for resume-ssot scripts."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
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


if __name__ == "__main__":
    test_validate_fixture()
    test_starter_has_required_top()
    test_schema_version_aligned()
    test_export_from_html()
    test_export_academic_track()
    print("OK all tests")
