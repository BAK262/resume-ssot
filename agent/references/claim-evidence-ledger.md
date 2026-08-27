# 主张—证据账本

让包装、投递版、面试准备共享同一事实基线。解决跨会话交接时证据来源、个人边界和确认状态易丢的问题；不是新数据库或评分系统。

可复制 [templates/claim-ledger.example.json](../../templates/claim-ledger.example.json) 作起点。账本放在用户求职工作区（如某投递版旁），**不**写回 skill 模板，**不**替代 `ssot.json`（事实仍以经历档案为准；账本管「主张表述与确认态」）。

## 何时使用

任一即可：

- 同一经历要出多个岗位版本；
- GPA/时间/论文状态/作者序/指标/职责冲突；
- 出现「主导、负责人、Owner、0→1、核心作者」等强主张；
- 要把 PR、链接、截图、证明交给后续投递版或面试；
- 准备面试追问或复盘。

只写一句 HR 开场且材料简单时，不强制建账本文件；**投递版 Mode · jd 仍须在对话里出短审计表**（见 [resume.md](../workflows/resume.md)）。

## 最小字段

每条 `claims`：

| 字段 | 用途 |
|------|------|
| `id` | 稳定 id，如 `claim-project-001` |
| `source_fact` | 用户原始事实，不做包装 |
| `candidate_wording` | 可用于简历或沟通的候选表述 |
| `sources` | 证据类型、位置、是否公开 |
| `responsibility_level` | 参与 / 负责模块 / 主导方案或交付 / 项目负责人 |
| `verification_status` | 已确认 / 待确认 / 已过期 / 不采用 |
| `allowed_uses` | 可用于哪些岗位版本 |
| `interview_details` | 追问可展开的决策、难点、验证、结果 |
| `boundary` | 团队 vs 个人 |
| `risk_notes` | 冲突、缺口 |
| `last_verified` | 最近确认日；未知 `null` |

`sources` 只存定位信息（公开 URL、文件名、「导师证明可提供」）。勿存密码、验证码、邮件全文、内部代码、客户数据。

## 状态

| 状态 | 用法 |
|------|------|
| 已确认 | 可进正式简历；仍须保留 `boundary` |
| 待确认 | 仅审计稿/待补；草稿可带【待补】；最终 PDF 前须确认或删 |
| 已过期 | 年级、在投、Star 等；更新前不作最新事实 |
| 不采用 | 保留原因；不进对外材料 |

## 本包读写责任

| 流程 | 责任 |
|------|------|
| [resume.md](../workflows/resume.md)（含 pitch） | 读 `source_fact`/证据/边界 → 写 `candidate_wording`；冲突 → 待确认；强主张填 `interview_details`；成稿只消费「已确认」且适用当前岗的主张 |
| [interview.md](../workflows/interview.md) | 用 `interview_details` 与简历 Claim 建问题树；发现掌握不足可建议降表述强度 |
| [maintain.md](../workflows/maintain.md) | 新事实进 `ssot.json`；账本 `source_fact` 与之对齐 |

## 冲突

同一事实多版本时不并存两个「已确认」。一条记录、多 `sources`、状态「待确认」、`risk_notes` 写清冲突。用户裁决后再 [maintain.md](../workflows/maintain.md) 写 `constraints`。
