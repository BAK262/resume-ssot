#!/usr/bin/env python3
"""Smoke tests for resume-ssot scripts."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "fixtures" / "example-ssot.json"
HTML = ROOT / "fixtures" / "example-resume.html"


def test_validate_fixture() -> None:
    r = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "validate_ssot.py"), str(FIXTURE)],
        capture_output=True,
        text=True,
    )
    assert r.returncode == 0, r.stdout + r.stderr


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
    test_export_from_html()
    test_export_academic_track()
    print("OK all tests")
