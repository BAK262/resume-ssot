# 设计立场

本 kit 是 **Agent skill**，**高度 LLM-in-the-loop**——不是 batch 简历编译器。

| 层 | 谁做 | 做什么 |
|----|------|--------|
| **Agent** | 任意 coding agent | 选材与证据化改写、JD 对齐、术语人话、一页压缩、HR 自检与开场文案、官网实搜岗位匹配、投递进度、面试追问 |
| **经历档案** | `ssot.json` | 全量事实、边界、冲突、术语表 |
| **脚本** | `scripts/` | 校验、HTML→PDF、HTML→plain |

**刻意不提供** SSOT→HTML 全自动渲染。HTML 由 Agent 按 `templates/` + `agent/rules/resume.md` 生成；`{{PLACEHOLDER}}` 是结构骨架。

**可投岗位表**须官网实搜三步（脑暴 → 按企检索 → 人-岗审计），见 [workflows/job-match.md](workflows/job-match.md)；禁止用第三方聚合结果直接入库。

**投递进度表**见 [workflows/offer.md](workflows/offer.md)；与可投表联动由 Agent 在投递版定稿 / 确认投递时自动完成（写入进度、移出可投）。

**定位 / 要点包装 / HR 开场**在 [workflows/resume.md](workflows/resume.md)（含 Mode · pitch）与 [rules/resume.md](rules/resume.md)。**面试预测与追问**见 [workflows/interview.md](workflows/interview.md)。主张确认态可选 [references/claim-evidence-ledger.md](references/claim-evidence-ledger.md)。

闭环在 **Agent + 人裁决**，不在 offline pipeline。

## 前身与致谢

本 kit **整合并重写**了以下 Agent Skill 的工作流（非官方 fork，无隶属关系）：

| 来源 | 贡献 |
|------|------|
| [resume-master](https://github.com/wangyafu/resume-skills/tree/main/skills/resume-master) | HTML 简历、写作规范、PDF 导出脚本 |
| [ASu Resume Skills](https://github.com/Claycui828/ASu-resume-skills) | JD 定制、证据/Scope、投递进度、经历表达与开场、面试追问（精髓已写入本包 `resume`/`rules`/`offer`/`interview`） |

PDF 相关脚本改编自 resume-master。完整说明见 [ACKNOWLEDGEMENTS.md](../ACKNOWLEDGEMENTS.md)。

## 对人类用户

- 入口仅 [README.md](../README.md)（人类单页 prompt）
- **禁止**要求用户读 `agent/`、`schema`、`workflows`、文件名如 `ssot.json` / `industry_base`
- 对用户只说：经历档案、通用版、投递版、网申文本、可投岗位表、投递进度表、面试准备
