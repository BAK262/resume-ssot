#!/usr/bin/env python3
"""HTML → PDF → preview PNGs (resume-ssot one-shot pipeline)."""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent


def _run(script: str, args: list[str]) -> None:
    cmd = [sys.executable, str(SCRIPTS / script), *args]
    proc = subprocess.run(cmd, text=True, encoding="utf-8", errors="replace")
    if proc.returncode != 0:
        raise RuntimeError(f"Failed: {' '.join(cmd)}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Render HTML resume to PDF and optional preview images."
    )
    parser.add_argument("--in", dest="in_html", required=True, help="Input HTML path")
    parser.add_argument(
        "--out",
        dest="out_pdf",
        default="",
        help="Output PDF (default: same name as HTML with .pdf)",
    )
    parser.add_argument(
        "--preview-dir",
        default="",
        help="If set, export PDF pages to PNG in this directory",
    )
    parser.add_argument("--paper", choices=["A4", "Letter"], default="A4")
    parser.add_argument("--chrome", default="", help="Optional Chrome executable path")
    parser.add_argument("--dpi", type=int, default=200, help="Preview image DPI")
    args = parser.parse_args()

    in_html = Path(args.in_html).expanduser().resolve()
    if not in_html.exists():
        raise FileNotFoundError(str(in_html))

    out_pdf = Path(args.out_pdf).expanduser().resolve() if args.out_pdf else in_html.with_suffix(".pdf")

    render_args = ["--in", str(in_html), "--out", str(out_pdf), "--paper", args.paper]
    if args.chrome:
        render_args += ["--chrome", args.chrome]
    _run("render_pdf.py", render_args)

    pages = subprocess.check_output(
        [sys.executable, str(SCRIPTS / "pdf_page_count.py"), "--in", str(out_pdf)],
        text=True,
        encoding="utf-8",
    ).strip()
    print(f"pages={pages}")
    print(f"pdf={out_pdf}")

    if args.preview_dir:
        preview = Path(args.preview_dir).expanduser().resolve()
        _run(
            "pdf_to_images.py",
            ["--in", str(out_pdf), "--outdir", str(preview), "--dpi", str(args.dpi)],
        )
        print(f"preview={preview}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"[resume-ssot render_resume.py] ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
