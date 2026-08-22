# 聊出来的经历，按岗位出一页简历

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/BAK262/resume-ssot?style=flat&logo=github&label=stars&color=181717)](https://github.com/BAK262/resume-ssot/stargazers)
[![English](https://img.shields.io/badge/lang-English-555?style=flat)](README.en.md)

**在 Cursor、Claude Code 或 Codex 里做简历，不用每次从零讲起。** 像聊天一样补齐教育、实习和项目，AI 先把内容记在**经历素材库**里（保存在你的文件夹，不用自己打开那些文件）。之后每投一家公司，粘贴**岗位说明**（招聘页面上的职位介绍与要求），从真实经历里挑重点，生成**只占一页**的简历，并导出 **HTML · PDF · 可复制到招聘网站的纯文本**。

> **经历存事实 → 通用版是底稿 → 投递版按岗位裁剪。** 换公司不丢经历，数字说不清就先问，**不替你编。**

**适合：** 找实习 / 校招 / 换工作的人；项目多、要投很多不同岗位、或担心 AI 编造数字的人。

**不会搞砸：** 改错了可以重来；记不清的说「大约」或「不确定」即可。

---

## 三分钟看懂

```
① 装到你的 AI 助手（Cursor / Claude Code / Codex，复制一段话，约 1 分钟）
        ↓
② 和 AI 聊经历 → 生成通用版 HTML（第一次请从这里开始）
        ↓
③ 粘贴某公司的岗位说明 → 得到针对该公司的一页投递版（HTML / PDF / 纯文本）
```

**先看排版长什么样 →** [**在浏览器里打开示例简历**](https://bak262.github.io/resume-ssot/fixtures/example-resume.html)（虚构人物「林小航」，仅展示效果 · [源码](https://github.com/BAK262/resume-ssot/blob/main/fixtures/example-resume.html)）

---

## 你会得到什么

| 文件 | 用途 |
|------|------|
| 经历素材库 | AI 在后台维护的事实记录，换岗位不用重讲 |
| 通用版 HTML | 不针对某一公司的基础简历 |
| 投递版 HTML | 针对某一岗位压缩后的一页排版 |
| 同名 PDF | 邮件附件 |
| 同名 `.txt` | 复制到招聘网站表单 |

说「**改简历 / 做投递版 / 更新经历**」即可，**不必记包名**。

---

## 安装（只需一次）

**推荐 · 粘贴给 AI（不用开终端）**

```text
帮我把 https://github.com/BAK262/resume-ssot 安装到全局 skills 目录。
我用的工具是：Cursor（也可改成 Claude Code 或 Codex）
装完告诉我是否成功；若失败，按仓库里的 agent/INSTALL.md 逐步执行。
```

**或者 · 一行命令（Cursor）**

```bash
npx skills add BAK262/resume-ssot --agent cursor -g -y
```

Claude Code、Codex 的安装路径见 [agent/INSTALL.md](agent/INSTALL.md)。

**装好后，用这句话自测：**

```text
帮我做简历。工作区：D:\career\（请改成你的文件夹）。
测试一下 resume-ssot 是否安装成功；成功的话告诉我接下来怎么从零开始。
```

装不上 → [agent/INSTALL.md](agent/INSTALL.md)

---

## 在对话里开始（按你的情况复制一段）

以下默认工作区为 `D:\career\`，请改成**你用来放简历的文件夹**（例如桌面上的 `career`）。用 Cursor、VS Code 或其他编辑器打开该文件夹后再粘贴。

### A · 还没有简历，从头做起（第一次请从这里开始）

```text
帮我做简历。工作区：D:\career\。
我没有现成简历，目标岗位是后端开发实习。你问我答，慢慢聊我的教育、实习和项目。
先建立经历素材库，再生成通用版 HTML 保存到工作区。数字不确定的先问我，不要编造。
```

### B · 已有通用版，要投某一岗位（日常最常用）

```text
工作区：D:\career\。通用版在 D:\career\base.html。
这是【公司名】【岗位名】的岗位说明：
[粘贴招聘页面上的职位介绍与要求全文]
请做一页投递版，文件名用公司简称；对齐岗位说明里的关键词；尽量导出 PDF 和纯文本。
```

### C · 经历有更新，同步素材库和通用版

```text
工作区：D:\career\。我新增了三个月实习，细节如下：[粘贴或口述]。
请更新经历素材库，并同步改通用版 HTML 的工作经历部分。
```

---

## 第一次成功后，检查这些

| 文件 | 检查什么 |
|------|----------|
| 投递版 HTML | 浏览器打开，确认一页、无错字 |
| 同名 `.txt` | 复制到招聘网站表单 |
| 同名 `.pdf` | 作附件（没有则 HTML → 打印 → 另存 PDF） |

对话里若出现「经历档案」「ssot.json」等文件名 — **忽略即可**，AI 维护，不用打开。

---

## 和直接问 ChatGPT 有什么不同？

| | ChatGPT 直接写 | 本工具 |
|--|----------------|--------|
| 经历 | 每次从零讲 | **经历素材库**持久保存，换岗位不丢事实 |
| 输出 | 一段文字 | **HTML + PDF + 纯文本**，控制在一页 |
| 诚信 | 易编造数字 | 不确定就说「大约」，**不替你编** |
| 复杂背景 | 难维护多段实习/项目 | 会记**边界说明**，方便和面试对齐 |

---

<details>
<summary><strong>常见问题</strong></summary>

**我会搞砸吗？** 不会。改错了可以重来。AI 问「能不能写主导」是为了面试时不被追问穿帮，不会把辩解写进简历。

**数字记不清？** 说「大约」或「不确定」，AI 不会替你编造。

**要装 Python 吗？** 不必须。PDF 可用浏览器打印；有 Python 时 AI 可能自动导出。

**网申要 Word？** 用 `.txt`，Word 打开后另存为 `.docx`。

**要照片吗？** 默认不要。国内少数岗位需要时告诉 AI 即可。

**要读仓库里其他文件吗？** 不用。`agent/`、`scripts/` 是给 AI 读的。

**装不上怎么办？** 见 [agent/INSTALL.md](agent/INSTALL.md)。手动安装路径：Cursor `~/.cursor/skills/resume-ssot/` · Claude Code `~/.claude/skills/resume-ssot/` · Codex `~/.codex/skills/resume-ssot/`（以各产品文档为准）。

</details>

---

MIT License · 示例为虚构人物 · 参考 [resume-master](https://github.com/wangyafu/resume-skills) 与 [ASu Resume Skills](https://github.com/Claycui828/ASu-resume-skills) 工作流 · 详见 [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [CHANGELOG.md](CHANGELOG.md)
