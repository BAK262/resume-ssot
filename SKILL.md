---
name: resume-ssot
version: "2.6.1"
description: >-
  Tailor resumes to job descriptions (JD); maintain a career archive; export HTML, PDF, and ATS plain text.
  改简历、按 JD 定制、投递版、实习简历、产业/学术简历。用户贴 JD 或旧 CV 即可。
  Use when user mentions resume, CV, JD, job application, internship, 改简历, 投递, or 网申.
  人类只读 README.md；禁止对用户暴露 agent/ 与内部术语。
disable-model-invocation: false
license: MIT
---

# resume-ssot（Agent 入口）

**人类用户** → [README.md](README.md) · 示例 [在线预览](https://bak262.github.io/resume-ssot/fixtures/example-resume.html)

**Agent 安装** → [agent/INSTALL.md](agent/INSTALL.md)

**Agent 操作手册** → [agent/ROUTER.md](agent/ROUTER.md)（路由与智能默认，唯一权威）

内部文档均在 `agent/`、`scripts/`、`templates/`、`fixtures/`。**不要**让用户阅读这些路径。

## 对用户怎么说


| 内部                 | 对外               |
| ------------------ | ---------------- |
| ssot.json          | 经历档案（AI 维护，不用打开） |
| industry_base.html | 通用版简历            |
| industry_<slug>.html | 投递版简历            |
| .txt               | 网申粘贴文本           |


## 快速路由


| 意图                  | 读                                                          |
| ------------------- | ---------------------------------------------------------- |
| 任何任务开始前             | [agent/ROUTER.md](agent/ROUTER.md)                         |
| 从 GitHub 安装            | [agent/INSTALL.md](agent/INSTALL.md)                       |
| 设计边界 / legacy skill | [agent/DESIGN.md](agent/DESIGN.md)                         |
| 初始化                 | [agent/workflows/init.md](agent/workflows/init.md)         |
| 维护事实                | [agent/workflows/maintain.md](agent/workflows/maintain.md) |
| 写简历                 | [agent/workflows/resume.md](agent/workflows/resume.md)     |
| 轻量编辑               | [agent/workflows/patch.md](agent/workflows/patch.md)       |


变更记录 → [CHANGELOG.md](CHANGELOG.md)
