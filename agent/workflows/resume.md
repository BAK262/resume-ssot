# 简历：base | jd | audit-terms

> 智能默认 → [ROUTER.md](../ROUTER.md)。表述/排版/HR 自检 → [rules/resume.md](../rules/resume.md)。

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

1. 解析 JD 关键词
2. **选材表**（自然语言，必出；含保留/压缩/省略理由）
3. fork → `resumes/industry_<jd-slug>.html`
4. 页眉意向；重排；bullet 按量化门禁改写
5. 超页按压缩序：其他 → 发表 → 弱项目 → 字号

### 交付（默认全套）

- HTML + 尽量 PDF
- **plain.txt 从投递版 HTML 导出**（与 JD 版一致）：
  ```powershell
  python scripts/export_plain.py --from-html resumes/industry_<slug>.html --in ssot.json --out resumes/industry_<slug>.txt
  ```
- [HR 自检 5 项](../rules/resume.md#hr-自检) 短报
- 页数报告

HTML 模板联系区预留 GitHub / 作品集 / LinkedIn（有则填，无则删该行）。

### 可选（用户要时）

- `resumes/cover_letter_<slug>.md` — Why company / role / me，禁止虚构
- Networking 50/150/300 字

**不因 JD 改 SSOT**（新事实 → maintain）

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

换 JD 直接说岗位名；通用版可继续迭代。
