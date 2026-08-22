# 粘贴 JD，在 Cursor 里出一页投递简历

[![skills.sh](https://skills.sh/b/BAK262/resume-ssot)](https://skills.sh/BAK262/resume-ssot)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**不是 ChatGPT 写一次就忘** — 用对话维护**经历档案**，从真实项目/实习取材，按 JD 压缩出一页投递版（HTML / PDF / 网申文本）。  
复制下面的话粘贴到 Cursor、Claude Code 或 Codex 即可。

**在线示例：** [example-resume.html](https://bak262.github.io/resume-ssot/fixtures/example-resume.html)（虚构人物「林小航」，与任何真实个人无关）

---

## 安装（复制到 Cursor，只需一次）

```text
帮我把 https://github.com/BAK262/resume-ssot 安装到 Cursor 全局 skills 目录。
装完告诉我是否成功；若失败，按仓库里的 agent/INSTALL.md 逐步执行。
```

```bash
npx skills add BAK262/resume-ssot --agent cursor -g -y
```

---

## 使用（复制任一段）

**从零开始（最常用）**

```text
帮我做简历。工作区文件夹：D:\career\。
我没有现成简历文件，方向是后端开发实习。你问我答，慢慢聊我的教育、实习和项目。
先建立经历档案，再生成通用版 HTML 保存到 D:\career\。数字不确定的先问我，不要编造。
```

**已有通用版，按 JD 做投递版**

```text
工作区：D:\career\。通用版在 D:\career\base.html。
这是后端开发实习 JD：[粘贴招聘说明]。
请做一页投递版，文件名用公司简称；对齐 JD 里的 Go/SQL/分布式关键词；尽量导出 PDF 和网申 txt。
```

**经历有更新，同步档案与 HTML**

```text
工作区 D:\career\。我新增了三个月实习经历，细节如下：[粘贴或口述]。
请更新经历档案，并同步改 base.html 的工作经历区块。
```

说「改简历 / JD / 投递 / 经历档案」即可，**不必说 skill 名称**。

---

## 示例

浏览器打开 [fixtures/example-resume.html](fixtures/example-resume.html) 或 [在线预览](https://bak262.github.io/resume-ssot/fixtures/example-resume.html)。

完全虚构的博士产业储备简历：双学历、三段技能、四个重点项目、发表与其他区块，bullet 含量化指标与边界说明。用于展示本 skill 的产出形态，**不对应任何真实个人**。

---

## 为什么用这个而不是直接问 ChatGPT？

| | ChatGPT 直接写 | resume-ssot |
|--|----------------|-------------|
| 经历 | 每次从零讲 | **经历档案**持久保存，换 JD 不丢事实 |
| 输出 | 一段文字 | **HTML + PDF + 网申 txt**，一页纸门禁 |
| 诚信 | 易编造数字 | 不确定就说「大约」，**不替你编** |
| 复杂背景 | 难维护多段实习/项目 | **术语与边界门禁**，面试不穿帮 |

---

## 第一次成功后

| 文件 | 检查什么 |
|------|----------|
| 投递版 HTML | 浏览器打开，确认一页、无错字 |
| 同名 .txt | 复制到招聘网站表单 |
| 同名 .pdf | 作附件（没有则 HTML → 打印 → 另存 PDF） |

对话里若出现「经历档案」等后台文件名 — **忽略即可**，AI 维护，不用打开。

<details>
<summary><strong>手动安装（可选）</strong></summary>

```bash
git clone https://github.com/BAK262/resume-ssot.git
```

复制整个 `resume-ssot` 文件夹到 `%USERPROFILE%\.cursor\skills\resume-ssot\`（macOS/Linux：`~/.cursor/skills/resume-ssot/`）。

用 Cursor 打开**你的**简历文件夹（如 `D:\career\`），粘贴上面「使用」任一段。
</details>

<details>
<summary><strong>常见问题</strong></summary>

**我会搞砸吗？** 不会。改错了可以重来。AI 问「能不能写主导」是为了面试时不被追问穿帮，不会把辩解写进简历。

**数字记不清？** 说「大约」或「不确定」，AI 不会替你编造。

**要装 Python 吗？** 不必须。PDF 可用浏览器打印；有 Python 时 AI 可能自动导出。

**网申要 Word？** 用 `.txt`，Word 打开后另存为 `.docx`。

**要照片吗？** 默认不要。国内少数岗位需要时告诉 AI 即可。

**要读包里的其他文件吗？** 不用。`agent/`、`scripts/`、`tests/` 是给 AI 读的。
</details>

<details>
<summary><strong>English — Install &amp; use</strong></summary>

**Install**

```text
Install https://github.com/BAK262/resume-ssot into my Cursor global skills directory.
Tell me if it succeeded; if not, follow agent/INSTALL.md in the repo.
```

**Start from scratch (most common)**

```text
Help me build a resume. Workspace: D:\career\. No existing files. Target: backend intern role.
Ask me about education, internships, and projects. Build a career archive first, then a base HTML resume.
Ask before inventing any numbers.
```

**Tailor to a JD**

```text
Workspace: D:\career\. Base resume: D:\career\base.html. JD: [paste backend intern posting].
One-page tailored HTML + PDF + plain text.
```

MIT License · see [LICENSE](LICENSE)
</details>

<details>
<summary><strong>致谢 · Acknowledgements</strong></summary>

本仓库参考并整合了 [resume-master](https://github.com/wangyafu/resume-skills/tree/main/skills/resume-master) 与 [ASu Resume Skills](https://github.com/Claycui828/ASu-resume-skills) 的工作流，重写为 SSOT 一体化 kit。**非官方 fork，无隶属关系。** 详见 [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md)。
</details>

<details>
<summary><strong>贡献者与变更记录</strong></summary>

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CHANGELOG.md](CHANGELOG.md)
</details>
