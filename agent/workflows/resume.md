# 简历：base | jd | pitch | audit-terms

> 智能默认 → [ROUTER.md](../ROUTER.md)。表述/排版/证据/开场 → [rules/resume.md](../rules/resume.md)。  
> 账本（可选）→ [claim-evidence-ledger.md](../references/claim-evidence-ledger.md)。

用户说「做简历 / 投递版 / 包装要点 / 岗位定位 / HR 开场 / Boss 话术」时走本文件。

---

## Mode · base（通用版）

### 输入

`ssot.json` + `industry|academic` + template；执行 [简历规则](../rules/resume.md)，工作区 `config.json`（存在时）提供照片、路径等配置。

### 选材

1. engagements 按目标方向与证据分量选材；依据[栏目规则](../rules/resume.md#模块顺序产业)按经历实质分栏，`kind` 仅作线索。
2. outputs 按岗位相关性、个人贡献与成果分量精选，状态保留在条目内。
3. 术语 → `external_plain_zh`；跳过 `false_if_claimed`

### 输出

`resumes/industry_base.html`（不覆盖用户定稿除非明确要求）

---

## Mode · jd（投递版）

### 输入

当前 JD + 岗位名 + `ssot.json` + 工作区配置 + 相关历史定稿（无则使用模板）。

### 流程

1. **读岗位与规则**：从 JD 提取核心任务、硬技能及评价重点，确定本稿主线。读取本技能 [简历规则](../rules/resume.md) 和工作区 `config.json`（存在时）；叙事、排版与验收标准随技能生效，不要求额外偏好文件或用户重复说明。
2. **选择参照**：从现有投递记录与简历目录选择叙事参照和一份版式基线，分别说明借鉴点。叙事参照按 JD 相关性选择；版式基线须查看实际页面，核对栏目、页眉照片、字号、间距和代表作格式是否符合本技能规则，不能因生成时间最近就采用。优先使用明确认可的做法，已投递不等于整稿获认可；最新明确纠正覆盖旧稿习惯。历史稿不合规时以模板为基线。缺少历史材料时用模板和公开样例继续，不要求上传私人定稿，也不阻塞制作。
3. **选材与证据**：围绕本次 JD 独立决定项目、顺序、篇幅和代表成果；以简短选材表说明保留/压缩/省略理由。核查强主张的事实证据与个人贡献，`claimed` / 待确认强数字不得进定稿。材料充足时直接制作，不为选材或风格另设批准步骤；仅澄清影响成稿的事实缺口。
4. **重写并成稿**：按[叙事规则](../rules/resume.md#经历改写骨架)写足主项目，再排入选定基线。继承基线 CSS、页眉和条目结构，按规则设置栏目；首次渲染前保持基线字号、照片尺寸与间距，出现实际版面问题后按排版规则调整。沿用工作区命名约定生成新 HTML；无约定时用 `resumes/industry_<jd-slug>.html`，保留原定稿。
5. **验收与导出**：执行[HR 自检](../rules/resume.md#hr-自检)的内容和实际页面检查，修正后重导 PDF 并复查；从最终 HTML 导出网申文本。全部通过后首次交付。

### 交付（默认全套）

- HTML + 尽量 PDF
- **plain.txt 从投递版 HTML 导出**（与 JD 版一致）：
  ```powershell
  python scripts/export_plain.py --from-html resumes/industry_<slug>.html --in ssot.json --out resumes/industry_<slug>.txt
  ```
- 简短说明参考版本及借鉴点、当前 JD 下的取舍和 [HR 自检](../rules/resume.md#hr-自检) 结果（含实际页数与视觉检查）；不向用户倾倒内部审计表。导出或预览失败时说明未验证项，不宣称视觉验收通过。
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
2. 个人优势摘要（用于沟通；简历页眉按排版规则）
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
