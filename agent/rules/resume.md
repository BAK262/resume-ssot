# 简历规则（表述 · 排版 · 披露）

> JD 操作步骤 → [workflows/resume.md](../workflows/resume.md)。智能默认 → [ROUTER.md](../ROUTER.md)。

## 表述

1. 删内部指代；缩写用 `external_plain_zh` 或 中文（English）
2. **负责 + 可核验结果**；并列 bullet 结构对齐
3. 技能从 `tools` 聚合，**无证据不写**

### 量化门禁

每条产业 bullet **尽量含**以下之一：数字 / 比例 / 样本量 N / 时效。
无数字则用定性可核验结果（交付物、venue、开源链接），并在选材表标 `claimed`。

### 产业 vs 学术

| | 产业 | 学术 |
|--|------|------|
| 语气 | 交付、指标 | 可保留方法名、在投 |
| 弱项 | 压入「其他」或删 | 可留报告/服务 |

### 禁止上简历

`internal` 术语、未裁决冲突数字、`constraints.false_if_claimed`、**`role_and_boundary` 原文**（边界只存 SSOT/面试准备，**禁止**写进 bullet 括号说明）。

### 技能证据绑定

skills 行每个工具/能力须至少对应一条 engagement 的 `tools` 或 bullet 证据；无证据不写。

## 披露 · ATS

- `essential`：**保留**工具名/专名（可括注中文），兼顾 HR 与关键词
- `plain_only`：只用 `external_plain_zh`
- JD 硬技能与 SSOT 一致时，可 mirror 到 skills 行（不编造）

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

### 页数

| 场景 | 目标 |
|------|------|
| 实习 / 应届 / JD 投递 | **1 页** |
| 博士 / 3 年+ | **1–2 页** |
| 储备版 | 可略超 |

### 模块顺序（产业）

教育 → 技能 → **工作经历**（internship/fulltime）→ 项目 → 发表 → 其他

### 照片

默认**无**（模板已注释）；CN 岗需要时取消注释。

PDF → [scripts/README.md](../../scripts/README.md)

## HR 自检

jd 版交付前 Agent **必过** 5 项（对话短报即可）：

1. 首屏可见最近**实习/工作**（若有）
2. skills 与 JD 硬词交集 **≥3**（不编造）
3. 无 `internal` 术语泄露
4. 页数符合目标
5. 联系方式完整

## 可选交付（不进 SSOT）

- HR 短文案 80–160 字
- Networking：50 / 150 / 300 字
- 求职信 `cover_letter_<slug>.md`：Why company / Why role / Why me 三段，事实只来自 SSOT

## 禁止

虚构经历；因 JD 回写 SSOT（除非用户补充新事实）
