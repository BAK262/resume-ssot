# 设计立场

本 kit 是 **Agent skill**，**高度 LLM-in-the-loop**——不是 batch 简历编译器。

| 层 | 谁做 | 做什么 |
|----|------|--------|
| **Agent** | 任意 coding agent | 选材、bullet 改写、JD 对齐、术语人话、一页压缩、HR 自检 |
| **经历库** | `ssot.json` | 全量事实、边界、冲突、术语表 |
| **脚本** | `scripts/` | 校验、HTML→PDF、HTML→plain |

**刻意不提供** SSOT→HTML 全自动渲染。HTML 由 Agent 按 `templates/` + `agent/rules/resume.md` 生成；`{{PLACEHOLDER}}` 是结构骨架。

闭环在 **Agent + 人裁决**，不在 offline pipeline。

## 前身与致谢

本 kit **整合并重写**了以下 Agent Skill 的工作流（非官方 fork，无隶属关系）：

| 来源 | 贡献 |
|------|------|
| [resume-master](https://github.com/wangyafu/resume-skills/tree/main/skills/resume-master) | HTML 简历、写作规范、PDF 导出脚本 |
| [ASu Resume Skills](https://github.com/Claycui828/ASu-resume-skills) | JD 定制、证据/Scope 审计思路 |

PDF 相关脚本改编自 resume-master。完整说明见 [ACKNOWLEDGEMENTS.md](../ACKNOWLEDGEMENTS.md)。

## 对人类用户

- 入口仅 [README.md](../README.md)（人类单页 prompt）
- **禁止**要求用户读 `agent/`、`schema`、`workflows`、文件名如 `ssot.json` / `industry_base`
- 对用户只说：经历档案、通用版、投递版、网申文本
