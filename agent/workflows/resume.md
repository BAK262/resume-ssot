# 简历：base | jd | pitch | audit-terms

> 智能默认 → [ROUTER.md](../ROUTER.md)。表述/排版/证据/开场 → [rules/resume.md](../rules/resume.md)。  
> 账本（可选）→ [claim-evidence-ledger.md](../references/claim-evidence-ledger.md)。

用户说「做简历 / 投递版 / 包装要点 / 岗位定位 / HR 开场 / Boss 话术」时走本文件。

---

## Mode · base（通用版）

### 输入

`ssot.json` + `industry|academic` + template

### 选材

1. engagements 按重要性排序；`kind: internship/fulltime` → **工作经历**区块
2. outputs：已发表优先；产业轨 working_paper 从简
3. 术语 → `external_plain_zh`；跳过 `false_if_claimed`

### 输出

`resumes/industry_base.html`（不覆盖用户定稿除非明确要求）

---

## Mode · jd（投递版）

### 输入

JD + 岗位名 + ssot.json + 基线 HTML（无则 lazy base）

### 流程

1. 解析 JD 关键词；可先给 1—3 个岗位定位（稳妥/进取，进取标待补证据）
2. **选材表**（自然语言，必出；含保留/压缩/省略理由）
3. **强主张短审计（必做）**：原始说法 | 建议写法 | 事实证据 | 个人边界 | 风险/待确认。`claimed` / 待确认强数字**不得**进定稿 bullet（改定性可核验或先问用户）；已确认可进。跨岗多版本可另写工作区账本（可选）
4. bullet 按 [rules/resume.md](../rules/resume.md)：**动作 → 能力 → 价值 → 证据**
5. fork → `resumes/industry_<jd-slug>.html`
6. 页眉意向；重排；量化门禁改写
7. 超页按压缩序：其他 → 发表 → 弱项目 → 字号

### 交付（默认全套）

- HTML + 尽量 PDF
- **plain.txt 从投递版 HTML 导出**（与 JD 版一致）：
  ```powershell
  python scripts/export_plain.py --from-html resumes/industry_<slug>.html --in ssot.json --out resumes/industry_<slug>.txt
  ```
- [HR 自检 5 项](../rules/resume.md#hr-自检) 短报
- 页数报告
- **必答追问 2–3 条**（对本稿高风险 Claim；口径见 [interview.md](interview.md) grill——只列问题，不代写可背答案）
- **看板联动**（有 `offers/` 时**定稿交付默认必做**）：**第三方岗**定稿 → 可投表保持 `ready`、`why` 补投递版路径，**不**入进度表；**官网 / 邮件**定稿 → 按 [offer.md](offer.md) 写进度表 `待投递`。用户确认**已发简历 / 已投递** → 进度表 upsert + 从可投表 `JOBS` 删除；提醒刷新/重开进度表

HTML 模板联系区预留 GitHub / 作品集 / LinkedIn（有则填，无则删该行）。

### 可选（用户要时）

- Boss/微信开场、自我介绍 → 见 rules「沟通文案」
- `resumes/cover_letter_<slug>.md` — Why company / role / me，禁止虚构
- Networking 50/150/300 字

**不因 JD 改 SSOT**（新事实 → [maintain.md](maintain.md)）

---

## Mode · pitch（只要定位 / 要点 / 开场，不出文件）

### 信号

「岗位定位」「改几条要点」「HR 开场白」「Boss 话术」——且**未**要求 HTML/PDF。

### 流程

1. 确认目标岗 / JD（若有）/ 渠道  
2. 读 `ssot.json`（及现有投递版）；材料不足则初稿 + ≤5 待补项  
3. 强主张或冲突 → 账本或短审计表（原始 / 建议 / 证据 / 边界 / 风险）  
4. 商业分析类经历 → [business-analysis-evidence.md](../references/business-analysis-evidence.md)

### 默认交付

1. 一句话定位（可附稳妥/进取）  
2. 简历摘要（可作页眉）  
3. 2—4 条改写要点  
4. 开场短版（约 80—160 字）+ 稍完整自我介绍  
5. 证据补强与可能追问  

用户接着要文件 → 切 Mode · jd（或 base），要点直接进选材。

---

## Mode · audit-terms（可选）

>5 个新缩写，或 HR 反馈看不懂，或全称存疑。一轮 pass，不 launch subagent。

---

## Walkthrough 进度话术（init 时用）

| 轮次 | Agent 说 |
|------|----------|
| 1/3 | 「先确认学校和最近实习/项目（约 5 分钟）→ 然后给你第一版草稿」 |
| 2/3 | 「补 2–3 个项目细节和边界（你能说什么、不能说什么）」 |
| 3/3 | 「最后确认数字和技能，出通用版 HTML」 |

---

## 完成后

换 JD 直接说岗位名；通用版可继续迭代。面试追问 → [interview.md](interview.md)。
