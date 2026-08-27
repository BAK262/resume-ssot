# Changelog

## 2.10.0 (2026-08-27)

- Privacy: real layout reference lives in the career workspace (e.g. `_private/`), not the skill package; public golden is `fixtures/example-*` only
- Tracker: seed/`updatedAt` merge wins over stale browser cache; storage key `resume-ssot-application-tracker-v1` (legacy key migrated once)
- Mode · jd: mandatory short claim audit; pending metrics stay out of final bullets; delivery includes 2–3 grill questions
- Job-match default: 3–5 `priority:1` companies per round; curated board, no fill quota
- Human docs: unified term **经历档案** / career archive; install failure uses path table (no agent doc links)
- Example resume: lower metric density for credible demo
- CI: starter top-level keys + `schema_version` aligned with example fixture
- ROUTER: minimal day path + when-to-load references

## 2.9.1 (2026-08-27)

- Experience packaging / HR pitch live in `workflows/resume.md` (Mode · pitch) + `rules/resume.md` / `rules/core.md`
- Interview workflow cross-links resume pitch/rules

## 2.9.0 (2026-08-27)

- Integrate interview predict/grill/review (`agent/workflows/interview.md`); claim-evidence ledger + business-analysis references
- Packaging / HR pitch → `resume` Mode · pitch in 2.9.1

## 2.8.0 (2026-08-27)

- Integrate **offer / application tracker** workflow (`agent/workflows/offer.md`); templates for tracker + overview SVG; optional email-monitoring reference
- Board linkage: **Agent-only** on tailored-resume finalize / confirmed apply — upsert tracker, remove from open-roles `JOBS` (no browser “move to tracker” button)
- Open-roles board UI: browser **delete** (+ export/restore dismissed ids); nav link to tracker
- Template rules for Agent upsert of `initialRecords` and pruning applied roles from job-match `JOBS`

## 2.7.0 (2026-08-27)

- Add **job-match** workflow: brainstorm → per-company official career-site search → audit into board
- Agent docs: `agent/workflows/job-match.md`; ROUTER / SKILL routes; DESIGN layer note
- Template: `templates/job-match-board.html`; optional `job_match` block in `config.example.json`
- README: prompt for refreshing the open-roles board

## 2.6.4 (2026-08-25)

- Sync `templates/resume-industry.html` CSS/layout with local industry reference (section hierarchy, spacing, contact/link styles)
- Agent docs: project bullet skeleton (`针对…` / `为…`); optional local-only reference paths
- **Local-only** (`.gitignore`, never commit / never GitHub Pages / never public demo): `fixtures/reference-industry-resume.html`, `reference-ssot.json`, `reference-photo.jpg` — public demo remains fictional `example-resume.html` only

## 2.6.3 (2026-08-22)

- README.en.md: full accurate translation of README.md
- Remove QUICKSTART.md (content lives in README)

## 2.6.2 (2026-08-22)

- README badges: MIT License, GitHub stars, language switch (README.en.md)

## 2.6.1 (2026-08-22)

- README header: replace shield badges with plain preview and install links

## 2.6.0 (2026-08-22)

- Rewrite README as beginner-friendly human entry: lifecycle flow, deliverables table, install verify step
- Support Cursor, Claude Code, and Codex; replace job-posting jargon with plain Chinese

## 2.5.2 (2026-08-22)

- README preview links point to GitHub Pages rendered HTML; add `.nojekyll` for stable static hosting

## 2.5.1 (2026-08-22)

- Expand fictional example resume to full industry-reserve depth (education, skills, projects, publications, other)
- Match example-ssot.json to the HTML fixture
- Copyright and acknowledgements under BAK262

## 2.5.0 (2026-08-22)

Public release of **resume-ssot**: SSOT-first Agent Skill for career archives and JD-tailored resumes (HTML / PDF / plain text).

- Single-page README with install/use prompts
- Fictional fixture `example-resume.html` and `example-ssot.json`
- Agent kit under `agent/`; PDF/export scripts; CI smoke tests
- Acknowledgements for [resume-master](https://github.com/wangyafu/resume-skills) and [ASu Resume Skills](https://github.com/Claycui828/ASu-resume-skills)
