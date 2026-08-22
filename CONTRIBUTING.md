# Contributing

Thank you for improving **resume-ssot** (智能简历助手 / Smart Resume Assistant).

Human doc: [README.md](README.md) only — **no internal jargon**. Install steps for agents: [agent/INSTALL.md](agent/INSTALL.md).

## Quick verify

Requires Python 3.10+.

```bash
python tests/test_scripts.py
python scripts/validate_ssot.py fixtures/example-ssot.json
python scripts/export_plain.py --from-html fixtures/example-resume.html --in fixtures/example-ssot.json --out fixtures/_test_manual.txt
```

PDF rendering is optional in CI; it needs Google Chrome locally. See [scripts/README.md](scripts/README.md).

## What to change where

| Goal | Files |
|------|--------|
| Human onboarding | `README.md` only — no internal jargon |
| Agent routing / defaults | `agent/ROUTER.md` (single authority) |
| Resume wording rules | `agent/rules/resume.md`, `agent/rules/core.md` |
| SSOT schema | `agent/schema/ssot.md`, `templates/ssot-starter.json`, `fixtures/example-ssot.json` |
| HTML layout | `templates/resume-industry.html`, `templates/resume-academic.html` |
| Examples | `fixtures/example-resume.html` |
| Deterministic tools | `scripts/*.py`, `tests/test_scripts.py` |

## Schema change checklist

When adding or renaming SSOT fields:

1. Update `agent/schema/ssot.md`
2. Update `templates/ssot-starter.json` and `fixtures/example-ssot.json`
3. Extend `scripts/validate_ssot.py` if the field is required or enumerated
4. Update `scripts/export_plain.py` if plain-text export must reflect it
5. Add or extend assertions in `tests/test_scripts.py`
6. Note the change in `CHANGELOG.md`

## Pull requests

- Keep human docs (`README`) free of terms like `ssot`, `slug`, `agent/`
- One logical change per PR when possible
- Bump `SKILL.md` frontmatter `version` and add a `CHANGELOG.md` entry

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
