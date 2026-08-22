# Scripts（Agent / 贡献者用）

> 人类用户见 [README.md](../README.md)。勿要求用户阅读本文。

## Requirements

| 组件 | 必需？ | 说明 |
|------|--------|------|
| Python | 是 | 3.10+ |
| Google Chrome | PDF 时 | headless 渲染 HTML → PDF |
| `pypdf` / `pymupdf` | 否 | 预览 PNG 与页数统计；`pip install -r scripts/requirements-pdf.txt` |

## Quick commands

```bash
# Validate career archive JSON
python scripts/validate_ssot.py fixtures/example-ssot.json

# HTML → PDF + optional preview PNGs
python scripts/render_resume.py --in resumes/industry_base.html --preview-dir resumes/preview

# Plain text for ATS (prefer --from-html on tailored resumes)
python scripts/export_plain.py --from-html resumes/industry_<slug>.html --in ssot.json --out resumes/industry_<slug>.txt

# Smoke tests (no Chrome required)
python tests/test_scripts.py
```

投递版 plain：**优先 `--from-html`**，与 PDF 一致；`--in ssot.json` 供 `term_registry` 过滤。

## Script reference

| Script | Purpose |
|--------|---------|
| `validate_ssot.py` | Top-level keys, disclosure enums, id uniqueness |
| `export_plain.py` | HTML or SSOT → `.txt`; filters `internal` terms |
| `render_pdf.py` | HTML → PDF via Chrome |
| `render_resume.py` | PDF + optional preview PNGs |
| `pdf_page_count.py` | Page count (`pdfinfo` or `pypdf`) |
| `pdf_to_images.py` | PDF → PNG previews |

## Common failures

| Error | Fix |
|-------|-----|
| Chrome not found | Install Google Chrome; ensure `chrome` / `google-chrome` on PATH |
| `pypdf not available` | `pip install pypdf` or skip preview pipeline |
| `validate_ssot.py` exit 1 | Read stderr; fix missing keys or invalid `disclosure` in SSOT |
| PDF blank / wrong font | Open HTML in browser first; check `@page` margins and web fonts |

## Agent workflow

After editing HTML: `render_resume.py` → read preview PNG for page count and overflow → adjust CSS or content before delivery.

See also [CONTRIBUTING.md](../CONTRIBUTING.md) for schema change checklist.
