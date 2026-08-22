# Agent 安装指南

> 人类用户只读 [README.md](../README.md)。本文供 Agent 在用户粘贴「从 GitHub 安装」类 prompt 时执行。

## 目标

将本仓库安装到用户所选 Agent 产品的 **全局 skills 目录**，并确认 `SKILL.md` 可被加载。

## Cursor（默认）

| 系统 | 目标路径 |
|------|----------|
| Windows | `%USERPROFILE%\.cursor\skills\resume-ssot\` |
| macOS / Linux | `~/.cursor/skills/resume-ssot/` |

**步骤**

1. 若目录不存在：`git clone https://github.com/BAK262/resume-ssot.git` 到临时位置，或 `npx skills add BAK262/resume-ssot --agent cursor -g -y`
2. 确保目标路径下存在 `SKILL.md`、`agent/`、`scripts/`、`templates/`（**整个文件夹**，不是单文件）
3. 若已有旧版，备份后覆盖或合并
4. 告知用户：在 Cursor 打开**独立工作区**（如 `D:\career\`），粘贴 README 中的「使用」话术

**验证**：目标路径存在 `SKILL.md`，且 frontmatter `name: resume-ssot`。

## Claude Code

- 全局：`~/.claude/skills/resume-ssot/`
- 项目：`<project>/.claude/skills/resume-ssot/`

同上，复制整个文件夹。

## Codex / 其他

- 常见：`~/.codex/skills/resume-ssot/` 或 `~/.agents/skills/resume-ssot/`
- 以该产品文档为准；必须包含完整 kit（`SKILL.md` + `agent/` + `scripts/` + `templates/`）

## 安装后对用户说

1. 装好了 / 需要用户手动确认哪一步  
2. 下一步：打开简历工作区文件夹，复制 README「使用」任一段  
3. 个人真实简历**不要**放进 skill 包目录  

## 失败时

- 权限不足 → 换用户目录或项目级 skills  
- 只有 `SKILL.md` → 说明需整个仓库文件夹  
- 网络失败 → 提供手动 clone 路径表（见上文）
