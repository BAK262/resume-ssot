---
name: resume-ssot
version: "2.12.1"
description: >-
  Career archive + JD-tailored resumes (HTML/PDF/plain); official job match; application tracker;
  positioning / HR pitch baked into resume rules; interview predict-grill-review.
  改简历、投递版、岗位定位、要点改写、HR开场、搜可投岗位、投递进度、Offer、面试预测、模拟面试、简历追问。
  Use when user mentions resume, CV, JD, internship, offer, tracker, job match,
  改简历, 投递, 网申, 可投岗位, 开场白, 岗位定位, 面试, 模拟面试, or 追问.
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


| 内部                         | 对外                 |
| -------------------------- | ------------------ |
| ssot.json                  | 经历档案（AI 维护，不用打开）   |
| industry_base.html         | 通用版简历              |
| industry_<slug>.html       | 投递版简历              |
| .txt                       | 网申粘贴文本             |
| job-match-industry.html    | 可投岗位表              |
| application-tracker.html   | 投递进度表              |
| candidate-profile.json     | 求职画像（技能/偏好）   |


## 快速路由


| 意图                  | 读                                                          |
| ------------------- | ---------------------------------------------------------- |
| 任何任务开始前             | [agent/ROUTER.md](agent/ROUTER.md)                         |
| 从 GitHub 安装            | [agent/INSTALL.md](agent/INSTALL.md)                       |
| 设计边界 / legacy skill | [agent/DESIGN.md](agent/DESIGN.md)                         |
| 初始化                 | [agent/workflows/init.md](agent/workflows/init.md)         |
| 维护事实                | [agent/workflows/maintain.md](agent/workflows/maintain.md) |
| 写简历 / 定位开场 / 要点包装 | [agent/workflows/resume.md](agent/workflows/resume.md) + [agent/rules/resume.md](agent/rules/resume.md) |
| 轻量编辑               | [agent/workflows/patch.md](agent/workflows/patch.md)       |
| 总结技能 / 求职偏好 / 优势赛道 | [agent/workflows/candidate-profile.md](agent/workflows/candidate-profile.md) |
| 搜可投岗位 / 刷新岗位表     | [agent/workflows/candidate-profile.md](agent/workflows/candidate-profile.md) + [agent/workflows/job-match.md](agent/workflows/job-match.md) |
| 投递进度 / Offer         | [agent/workflows/offer.md](agent/workflows/offer.md)       |
| 面试预测 / 追问 / 复盘     | [agent/workflows/interview.md](agent/workflows/interview.md) |


变更记录 → [CHANGELOG.md](CHANGELOG.md)
