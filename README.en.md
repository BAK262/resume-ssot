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

Say **“update my resume / make an application version / update my experience”**—**no need to remember the package name**.

---

## Install (once)

**Recommended · paste to your AI (no terminal)**

```text
Install https://github.com/BAK262/resume-ssot into my global skills directory.
I use: Cursor (change to Claude Code or Codex if needed)
Tell me if it succeeded; if not, follow agent/INSTALL.md in the repo step by step.
```

**Or · one-line command (Cursor)**

```bash
npx skills add BAK262/resume-ssot --agent cursor -g -y
```

Install paths for Claude Code and Codex: [agent/INSTALL.md](agent/INSTALL.md).

**After install, self-test with:**

```text
Help me build a resume. Workspace: D:\career\ (change to your folder).
Test whether resume-ssot is installed; if yes, tell me how to start from scratch.
```

Install issues → [agent/INSTALL.md](agent/INSTALL.md)

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

---

## After your first success, check these

| File | What to verify |
|------|----------------|
| Tailored HTML | Open in browser; one page, no typos |
| Matching `.txt` | Paste into application forms |
| Matching `.pdf` | Use as attachment (or HTML → Print → Save as PDF) |

If the chat mentions filenames like “career archive” or `ssot.json`—**ignore them**; the AI maintains them, you don’t need to open them.

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

**Need Python?** Not required. PDF works via browser print; with Python the AI may auto-export.

**Application wants Word?** Use `.txt`, open in Word, Save As `.docx`.

**Need a photo?** Default is no. Tell the AI if a specific posting requires one.

**Read other files in the repo?** No. `agent/` and `scripts/` are for the AI.

**Install failed?** See [agent/INSTALL.md](agent/INSTALL.md). Manual paths: Cursor `~/.cursor/skills/resume-ssot/` · Claude Code `~/.claude/skills/resume-ssot/` · Codex `~/.codex/skills/resume-ssot/` (confirm with each product’s docs).

</details>

---

MIT License · Fictional example persona · Workflows informed by [resume-master](https://github.com/wangyafu/resume-skills) and [ASu Resume Skills](https://github.com/Claycui828/ASu-resume-skills) · See [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [CHANGELOG.md](CHANGELOG.md)
