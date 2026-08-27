# 简历规则（表述 · 证据 · 排版 · 沟通）

> 操作步骤 → [workflows/resume.md](../workflows/resume.md)。智能默认 → [ROUTER.md](../ROUTER.md)。  
> 主张账本 → [claim-evidence-ledger.md](../references/claim-evidence-ledger.md)。

## 表述

1. 删内部指代；缩写用 `external_plain_zh` 或 中文（English）
2. **负责 + 可核验结果**；并列 bullet 结构对齐
3. 技能从 `tools` 聚合，**无证据不写**
4. 包装 = 把事实翻成招聘方好懂、可追问的话；**不**虚构头衔、公司、项目、技术栈或数据

### 经历改写骨架

每条优先：

**动作 → 系统/方法能力 → 业务或科研价值 → 结果证据 → 个人边界（面试用，不上简历括号）**

产业项目标题旁 bullet 仍可用：

- B1 `针对…：` 问题 / 约束 → 方案与建设
- B2 `为…：` 验证 / 交付 → 指标 + 对外成果

**相邻 bullet 禁止同一起手句式**（勿连续两条都以「针对…」或「为…」开头）。

### 强动词门禁

「主导 / 负责人 / Owner / 0→1」仅当能说明决策、交付与结果；否则改「负责模块 / 参与 / 协作」。非本人负责写清「团队」或标待确认。

### 量化门禁

每条产业 bullet **尽量含**以下之一：数字 / 比例 / 样本量 N / 时效。
无数字则用定性可核验结果（交付物、venue、开源链接），并在选材表标 `claimed`。不编百分比/用户量/延迟/排名。
**定稿 bullet 只收已确认量化**；`claimed` / 待确认强数字改定性表述或先问清再写。

### 主张审计（Mode · jd 必做；pitch 有强主张时做）

强主张列表：原始说法 | 建议写法 | 事实证据 | 个人边界 | 风险/待确认。
跨岗多版本或冲突多时，可写入工作区账本（见 claim-evidence-ledger）；**成稿只消费已确认主张**。

### 产业 vs 学术

| | 产业 | 学术 |
|--|------|------|
| 语气 | 交付、指标 | 可保留方法名、在投 |
| 弱项 | 压入「其他」或删 | 可留报告/服务 |

### 禁止上简历

`internal` 术语、未裁决冲突数字、`constraints.false_if_claimed`、**`role_and_boundary` 原文**（边界只存经历档案/面试准备，**禁止**写进 bullet 括号说明）。

### 技能证据绑定

skills 行每个工具/能力须至少对应一条 engagement 的 `tools` 或 bullet 证据；无证据不写。

## 披露 · ATS

- `essential`：**保留**工具名/专名（可括注中文），兼顾 HR 与关键词
- `plain_only`：只用 `external_plain_zh`
- JD 硬技能与经历档案一致时，可 mirror 到 skills 行（不编造）；**每个硬词须能指回**某条 engagement `tools` 或已选 bullet

### ATS 纯文本

**投递版优先**从 HTML 导出（与 HR 看到的 PDF 一致）：

```powershell
python scripts/export_plain.py --from-html resumes/industry_<slug>.html --in ssot.json --out resumes/industry_<slug>.txt
```

通用版/无 HTML 时：

```powershell
python scripts/export_plain.py --in ssot.json --out resumes/industry_base.txt --track industry
```

`export_plain` 会应用 `term_registry`（`internal` 删除、`plain_only` 替换）。

网申要 Word：txt → Word 另存 docx。

## 排版

- HTML 源；内联 CSS；`body` 打印 `width: 100%`；**不要**叠 `max-width: 210mm`
- 模板：[resume-industry.html](../../templates/resume-industry.html)（含**工作经历**区块）
- 排版对照：[example-resume.html](../../fixtures/example-resume.html)（公开虚构样例；写/改版前对照）
- 作者本机私人定稿在求职工作区私有目录（如 `_private/`）；包内不引用

### 页数

| 场景 | 目标 |
|------|------|
| 实习 / 应届 / JD 投递 | **1 页** |
| 博士 / 3 年+ | **1–2 页** |
| 储备版 | 可略超 |

### 模块顺序（产业）

教育 → **工作经历**（有则写）→ 项目 → 发表 → 技能 → 其他
无工作经历时可跳过该节（见 example 样例）。

### 项目 bullet 骨架（产业）

标题：`名称　范围｜角色` + 日期
- B1 `针对…：` 问题 / 约束 → 方案与建设
- B2 `为…：` 验证 / 交付 → 指标 + 对外成果
形近即可；数字只用冻结口径；`role_and_boundary` 不进括号。

### 照片

默认**无**（模板已注释）；CN 岗需要时取消注释。

PDF → [scripts/README.md](../../scripts/README.md)

## HR 自检

jd 版交付前 Agent **必过** 5 项（对话短报即可）：

1. 首屏可见最近**实习/工作**（若有）
2. skills 与 JD 硬词：至少 3 个能指回 engagement `tools`/已选 bullet（不编造）
3. 无 `internal` 术语泄露
4. 页数符合目标
5. 联系方式完整
6. 定稿 bullet 无待确认强数字；短审计已覆盖强主张

## 沟通文案（不进经历档案）

- **开场短版**约 80—160 字：身份与方向 → 一个真实成果 → 邀请继续聊（Boss/微信）
- **自我介绍**稍完整但仍短；事实只来自经历档案
- Networking：50 / 150 / 300 字
- 求职信 `cover_letter_<slug>.md`：Why company / Why role / Why me，禁止虚构

岗位定位可给 1—3 个（稳妥 / 进取）；进取须写清待补证据。

## 禁止

虚构经历；因 JD 回写经历档案（除非用户补充新事实）；把包装话术当事实写入 `ssot.json`
