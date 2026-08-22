# Talk through your experience, one-page resume per role

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/BAK262/resume-ssot?style=flat&logo=github&label=stars&color=181717)](https://github.com/BAK262/resume-ssot/stargazers)
[![中文](https://img.shields.io/badge/lang-中文-0078d4?style=flat)](README.md)

**Build resumes in Cursor, Claude Code, or Codex without retelling your story every time.** Chat through education, internships, and projects; the assistant keeps a **career archive** in your folder (you don’t need to open those files). For each application, paste the **job posting** and get a **one-page** resume as **HTML · PDF · plain text** for online forms.

> **Facts in the archive → base HTML as draft → tailored version per role.** Switch companies without losing history; unclear numbers are asked, **never invented**.

**Preview →** [example resume in browser](https://bak262.github.io/resume-ssot/fixtures/example-resume.html) (fictional persona)

---

## Install (once)

```text
Install https://github.com/BAK262/resume-ssot into my global skills directory.
I use: Cursor (or Claude Code / Codex — pick one).
Tell me if it succeeded; if not, follow agent/INSTALL.md in the repo.
```

```bash
npx skills add BAK262/resume-ssot --agent cursor -g -y
```

---

## Use (copy one block)

**Start from scratch**

```text
Help me build a resume. Workspace: D:\career\. No existing files. Target: backend intern role.
Ask me about education, internships, and projects. Build a career archive first, then a base HTML resume.
Ask before inventing any numbers.
```

**Tailor to a job posting**

```text
Workspace: D:\career\. Base resume: D:\career\base.html. Job posting: [paste full description and requirements].
One-page tailored HTML + PDF + plain text.
```

**Update after new experience**

```text
Workspace: D:\career\. I added a 3-month internship: [paste details].
Update the career archive and sync the base HTML.
```

---

MIT License · Fictional example persona · See [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) · [CHANGELOG.md](CHANGELOG.md)
