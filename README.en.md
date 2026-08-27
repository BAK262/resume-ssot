# Talk through your experience, one-page resume per role

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/BAK262/resume-ssot?style=flat&logo=github&label=stars&color=181717)](https://github.com/BAK262/resume-ssot/stargazers)
[![中文](https://img.shields.io/badge/lang-中文-0078d4?style=flat)](README.md)

**Build resumes in Cursor, Claude Code, or Codex without starting from scratch every time.** Chat through education, internships, and projects; the assistant first saves everything in a **career archive** (stored in your folder—you don’t need to open those files). For each company you apply to, paste the **job posting** (the role description and requirements from the hiring page), pick highlights from your real experience, and get a **one-page** resume exported as **HTML · PDF · plain text you can paste into application forms**.

> **Facts in the archive → base HTML as draft → tailored version per role.** Switch companies without losing history; if a number is unclear, the assistant asks first—**it won’t invent one for you**.

**Good for:** internship / campus / job seekers; people with many projects, many different roles to apply to, or anyone worried an AI might fabricate numbers.

**Hard to mess up:** you can redo anything; if you’re unsure, say “roughly” or “not sure”.

---

## Understand in three minutes

```
① Install to your AI assistant (Cursor / Claude Code / Codex — copy one prompt, ~1 min)
        ↓
② Chat through your experience with the AI → generate base HTML (start here the first time)
        ↓
③ Paste a company’s job posting → get a one-page tailored version for that company (HTML / PDF / plain text)
```

**See what the layout looks like →** [**Open the example resume in your browser**](https://bak262.github.io/resume-ssot/fixtures/example-resume.html) (fictional persona “Lin Xiaohang”, demo only · [source](https://github.com/BAK262/resume-ssot/blob/main/fixtures/example-resume.html))

---

## What you get

| File | Purpose |
|------|---------|
| Career archive | Facts maintained by the AI in the background; no need to retell when you switch roles |
| Base HTML | General resume not tied to one company |
| Tailored HTML | One-page layout compressed for a specific role |
| Matching PDF | Email attachment |
| Matching `.txt` | Paste into online application forms |

Say **“update my resume / make an application version / update my experience / search open roles / log application progress”**—**no need to remember the package name**.

---

## Install (once)

**Recommended · paste to your AI (no terminal)**

```text
Install https://github.com/BAK262/resume-ssot into my global skills directory.
I use: Cursor (change to Claude Code or Codex if needed)
Tell me if it succeeded; on failure, place the full folder using the path table below and retry.
```

**Or · one-line command (Cursor)**

```bash
npx skills add BAK262/resume-ssot --agent cursor -g -y
```

**Manual install paths (copy the whole folder; must include SKILL.md)**

| Tool | Path |
|------|------|
| Cursor | `~/.cursor/skills/resume-ssot/` (Windows: `%USERPROFILE%\.cursor\skills\resume-ssot\`) |
| Claude Code | `~/.claude/skills/resume-ssot/` or project `.claude/skills/resume-ssot/` |
| Codex | `~/.codex/skills/resume-ssot/` or `~/.agents/skills/resume-ssot/` |

**After install, self-test with:**

```text
Help me build a resume. Workspace: D:\career\ (change to your folder).
Test whether resume-ssot is installed; if yes, tell me how to start from scratch.
```

---

## Start in chat (copy the block that fits)

Default workspace below is `D:\career\`—change it to **the folder where you keep resume files** (e.g. a `career` folder on your desktop). Open that folder in Cursor, VS Code, or another editor, then paste.

### A · No resume yet—build from scratch (start here the first time)

```text
Help me build a resume. Workspace: D:\career\.
I don’t have a resume yet. Target role: backend intern. Ask me questions; let’s chat through education, internships, and projects.
Build the career archive first, then save base HTML to the workspace. Ask before inventing any numbers.
```

### B · Base version ready—apply to a specific role (most common day to day)

```text
Workspace: D:\career\. Base resume: D:\career\base.html.
Job posting for [Company] [Role title]:
[paste full role description and requirements from the hiring page]
Make a one-page tailored version; filename = company short name; align keywords from the posting; export PDF and plain text if possible.
```

### C · Experience updated—sync archive and base version

```text
Workspace: D:\career\. I added a 3-month internship; details: [paste or describe].
Update the career archive and sync the work experience section in base HTML.
```

### D · Search official open roles (job board)

```text
Workspace: D:\career\. Using my career archive, search each company’s official careers site for matching roles.
Hard filters: [city, e.g. Beijing]; start window: [e.g. Summer/Fall 2027].
Only keep roles with openable official JD pages; write them into the open-roles board. Then make a tailored resume for the ones I pick.
```

### E · Update application tracker

```text
Workspace: D:\career\. Log this progress into the application tracker:
Company: [] Role: [] Status: [applied / interview / …] Evidence: [email or screenshot notes]
If a tailored resume already exists, remove the matching row from the open-roles board.
```

### F · Positioning / bullets / HR pitch (chat-first OK)

```text
Workspace: D:\career\. Target role: [].
Using the career archive, propose positioning, rewrite 2–4 bullets, and a short Boss/WeChat pitch (~120 chars/words).
Flag uncertain numbers; do not invent them. If we make a tailored resume next, reuse these bullets.
```

### G · Interview predict or grill

```text
Workspace: D:\career\. Tailored resume: [path or role]. JD: [paste or skip].
Predict likely interview questions; or grill mode—one question at a time—to pressure-test resume claims.
```

---

## After your first success, check these

| File | What to verify |
|------|----------------|
| Tailored HTML | Open in browser; one page, no typos; you can explain strong metrics |
| Matching `.txt` | Paste into application forms |
| Matching `.pdf` | Use as attachment (or HTML → Print → Save as PDF) |
| Open-roles board | Official JD links; browser **Delete** hides a candidate (AI moves roles to tracker when a tailored resume is finalized / applied) |
| Application tracker | Status matches evidence; no duplicate of open-roles rows; refresh/reopen after AI writes |
| Interview prep | Oral round on high-risk claims in this version |

If the chat mentions internal filenames—**ignore them**; the career archive is maintained by the AI.

---

## How is this different from asking ChatGPT directly?

| | ChatGPT directly | This tool |
|--|------------------|-----------|
| Experience | Retell from scratch each time | **Career archive** persists; facts stay when you switch roles |
| Output | A block of text | **HTML + PDF + plain text**, kept to one page |
| Integrity | Easy to fabricate numbers | Say “roughly” when unsure—**won’t invent for you** |
| Complex background | Hard to maintain many internships/projects | Keeps **scope notes** so interviews stay aligned |

---

<details>
<summary><strong>FAQ</strong></summary>

**Will I break something?** No. You can redo. If the AI asks “can we say you led this?”, it’s to avoid interview mismatch—not to put excuses on the resume.

**Numbers fuzzy?** Say “roughly” or “not sure”; the AI won’t fabricate.

**Need Python?** Needed for archive validation and auto PDF export; without it, open HTML → Print → Save as PDF.

**Application wants Word?** Use `.txt`, open in Word, Save As `.docx`.

**Need a photo?** Default is no. Tell the AI if a specific posting requires one.

**Read other files in the repo?** No. Copy prompts from this page; install-folder docs are for the AI.

**Install failed?** Use the manual path table above (full folder with `SKILL.md`), then rerun the self-test prompt.

</details>

---

MIT License · Fictional example persona · Workflows informed by [resume-master](https://github.com/wangyafu/resume-skills) and [ASu Resume Skills](https://github.com/Claycui828/ASu-resume-skills) · See [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [CHANGELOG.md](CHANGELOG.md)
