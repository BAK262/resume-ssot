# job-match：官网实搜可投岗位

> 路由 → [ROUTER.md](../ROUTER.md)。事实只读经历档案；岗位包装不写回 `ssot.json`。

用户说「搜可投岗位 / 刷新岗位表 / 官网匹配」时走本流程。对用户称：**可投岗位表**（正式）与 **临时检索**（`offers/_scratch/`，勿主动甩路径）。

---

## 前置


| 项    | 说明                                                                        |
| ---- | ------------------------------------------------------------------------- |
| 经历档案 | `ssot.json` 已有可用事实                                                        |
| 正式表  | `offers/job-match-industry.html`（无则从 `templates/job-match-board.html` 复制） |
| 临时目录 | `offers/_scratch/`（自动建）                                                   |
| 硬过滤  | 读 `config.json` → `job_match.hard_filters`；无则从经历档案地点/入职窗口推断，**先确认再搜**     |
| 投递进度 | `offers/application-tracker.html`（无则从模板复制；见 [offer.md](offer.md)）         |
| 求职画像 | `offers/candidate-profile.json`（无则先走 [candidate-profile.md](candidate-profile.md)） |
| 搜岗总账 | `offers/_scratch/search-ledger.json`（字段：`slug`/`name`/`last_searched_at`/`last_result`/`watch?`；无则步骤 1 前用 `match-*` 建空架） |


**禁止**：第三方聚合/新闻「听说有岗」写入正式表；无 JD 详情链；跳过步骤 2 直接改 HTML；把包装话术写回经历档案。
**已在进度表的岗**（已生成投递版 / 已投递）**不得**再进 `JOBS`；审计时按公司+岗位或 `jdUrl` 排除。
**已在搜岗总账且无复查理由的公司**（同 `slug`）**不得**再派实搜；复查仅当 `watch` 到期、用户点名、或校招窗口明显新开。

---



## 流水线（每次刷新都走）

### 0 · 求职画像（默认，扩岗前必跑）

走 [candidate-profile.md](candidate-profile.md)：读经历档案 + 投递进度 + 已投投递版简历 → 更新 `offers/candidate-profile.json`。

- **扩面 / 刷新岗位表前默认执行**；若 `candidate-profile.json` 的 `updated_at` 早于本轮投递进度或档案 `meta.updated_at`，必须刷新。
- 用户明确说「画像不用更新」时可跳过，须在审计日志记一句。

### 1 · 关键词脑暴（1 agent）

读 `offers/candidate-profile.json` + `ssot.json`（person / engagements / outputs / metrics / constraints）+ 可选投递进度 + **`offers/_scratch/search-ledger.json`**。

画像中的 `role_directions`、`keywords`（含 negative）、`job_preferences`、`audit_axes` **优先继承**到 brief；`ssot_summary` 可压缩自画像 `identity_one_liner` 与能力柱。

**去重**：`priority: 1` 的 `slug` 不得与总账已有条目重复，除非该条有 `watch` 且本轮明确复查、或用户点名重搜。brief `notes` 写一句「已排除总账 N 家 / 本轮复查 M 家」。

写 `offers/_scratch/search-brief.json`：

```json
{
  "generated_at": "ISO8601",
  "ssot_summary": "200-400字，给匹配用",
  "hard_filters": { "cities": [], "start_window": "", "notes": "" },
  "company_types": [],
  "role_directions": [{ "id": "", "label": "", "why": "锚经历档案哪条" }],
  "keywords": { "zh": [], "en": [] },
  "companies": [{
    "slug": "acme",
    "name": "",
    "type": "",
    "portal_url": "https://...",
    "priority": 1,
    "search_hints": [],
    "notes": ""
  }]
}
```

- **本轮默认**：`priority: 1` 填 **3–5 家**并只搜这些；其余标 `priority: 2/3` 作扩面候选，**用户说扩面再开**
- 本步**不**编造具体在招岗位名



### 2 · 按企业官网实搜（N agents，一企一 agent）

每个 agent 只负责一家：打开招聘站 → 用 brief 关键词检索 → 过硬过滤 → 打开 JD → 对照 `ssot_summary` 初匹配。

每企写 `offers/_scratch/match-<slug>.json`：

```json
{
  "company": "",
  "slug": "",
  "portal_url": "",
  "searched_at": "ISO8601",
  "keywords_used": [],
  "candidates": [{
    "title": "",
    "list_url": "",
    "jd_url": "必须可打开的详情页",
    "city": "",
    "jd_excerpt": "80-200字",
    "why_preliminary": "与经历档案哪条初匹配"
  }],
  "misses_or_notes": ""
}
```

只收录：页面真实存在、可开 JD、地点过硬过滤。登录墙 / 0 命中写入 `misses_or_notes`。

并行：只跑本轮 `priority: 1`（3–5 家）；用户要扩面再开 2/3。

每企 `match-<slug>.json` 落盘后，**立刻**更新总账对应该 `slug`：`last_searched_at`、`last_result`（`hit`|`miss`）；窗口未开写可选 `watch`（一句）。细节只留 match 文件。

### 3 · 审计入库（1 agent）

再读经历档案 + 全部 `match-*.json`（+ 可选投递进度）+ **本会话/配置里用户已说清的求职标准**。

**本步目标函数（与步骤 2 不同）**
步骤 2 问的是「方向/关键词能不能圆成故事」。本步问：
**以这位候选人的真实履历与门槛，这份 JD 会不会让 TA 进面试？**
叙事能讲 ≠ 过筛。标题里的「关键词」若正文招聘画像是另一条线，按正文裁。

**标准从哪来（LLM 理解，不背死规则表）**

- **`offers/candidate-profile.json`**（技能强项、边界、want/avoid、audit_axes、已投行为）
- 经历档案里的专业、届别、履历边界（有什么 / 没有什么）
- `config.job_match` 与 brief 硬过滤
- 用户本会话明确说过的偏好与否决（例：不要实习、只要能进面的岗、某类岗可留作了解）
- 投递进度里已投同类岗所暗示的标准（已投 ≠ 自动再收；用来校准「什么叫对口」）

审计轴默认用画像 `audit_axes`（生理情感信号、人类认知评测、数据闭环 vs 训练 infra），**非**「PM vs 算法」二元。
标准未说清且会影响大面积取舍时：**先问一句再大批入库**，勿用默认「相关即可」灌表。

**怎么审（原则，非 checklist）**

- 打开或复核 JD：**要求/门槛段与职责段都要看**；过筛看门槛与招聘画像，不看职责里偶发的同领域词
- 区分校招/实习/社招通道是否说得通；通道与履历错位则倾向不入正式表
- 诚实判定；禁止为凑 `exact`/`strong` 或填满看板而美化
- 地点与 `jd_url` 仍须过硬过滤；进度表已有岗仍排除
- **精选、宁缺毋滥**；伪相关（故事圆、画像不对）不入库

可选在 `audit-log.json` 的 `kept[]`/`dropped_sample[]` 里用自然语言写清裁断理由（或轻量标 `likely` / `borderline` / `unlikely`）——方便下一轮与用户对齐标准，**不**强制统一枚举字段。

入库动作不变：

- **覆盖更新**正式表的 `JOBS` 数组；保留页面结构 / TRACKS / 渲染逻辑
- `href` = JD 详情 URL（禁止只写门户首页）
- `why` 点名经历档案锚点，1–2 句（过筛成立后的匹配理由，不是硬圆话术）
- 写 `offers/_scratch/audit-log.json`（或带 round 后缀的 `audit-log-*.json`）：`stats` + `kept[]` + `dropped_sample[]`
- **同步总账**：本轮 `slug` 的 `last_result`；对口但窗口未开写/刷新 `watch`

JOBS 字段：`{ id, company, role, city, track, category, fit, status, why, href, hrefLabel }`

| 字段 | 值 | 说明 |
|------|-----|------|
| `category` | `pending` \| `ready` \| `backup` \| `archived` | 投递决策类（见下） |
| `fit` | `exact` \| `strong` \| `stretch` | 过筛后贴合度，非关键词相似度 |
| `status` | `urgent` \| `open` | 排序用优先标记；表格内仅 `urgent` 显示「优先」 |

**入库默认 `category`（写进 HTML 种子）**

- 校招/正式岗且过筛 → `pending`（待人工确认）
- 标题含实习 / 了解 / 探索 / 科研·了解 → `archived`
- 用户当轮明确要求「这条待投」→ `ready`；「同司名额已满」→ `backup`

看板 v3：顶栏按类别计数；表格含类别下拉 + 删除；`fit`/`status` 不参与列展示，仅排序。

**浏览器状态（本机，不写 HTML）**

- 键：`resume-ssot-job-match-state-v3` → `{ deleted: string[], categories: { [id]: category } }`
- 旧键 `…-dismissed-v1` / `…-state-v1` / `…-state-v2` 首次打开自动迁入 v3
- 「删除」= 本机永久隐藏；刷新/审计前须同步到 HTML（见下）
- 工具条「导出操作记录」→ `job-match-state.json`（`exported_at` + `deleted_ids` + `categories`）

**Agent 同步可投表**（用户说「同步可投表」或发来 `job-match-state.json`）

1. 从 `JOBS` **删除** `deleted_ids` 中全部 id（磁盘真相，非仅隐藏）
2. 对存活条目：若 `categories[id]` 与 HTML 种子默认不同，写回 `job.category`；与默认相同则省略该字段
3. 保留页面结构 / TRACKS / 渲染逻辑；勿改用户未导出的 unrelated 条目
4. 短报：删 N 条 · 改类 M 条 · 请刷新浏览器

审计刷新 `JOBS` 时：合并用户已导出过的 `deleted_ids`（若有），排除进度表已有岗；**勿**把浏览器临时改类覆盖未同步的磁盘种子——用户未同步则按 HTML 内 `category` 为准。

---



## 与投递 / 简历关系


| 产物    | 角色                                                                 |
| ----- | ------------------------------------------------------------------ |
| 可投岗位表 | 尚未进入进度的官网候选                                                        |
| 投递进度表 | 已生成投递版 / 已投 / 面试状态 → [offer.md](offer.md)                          |
| 投递版简历 | 选定岗 → [resume.md](resume.md) Mode · jd **定稿交付时** Agent 自动写入进度并移出可投 |


联动不靠浏览器按钮；只靠 Agent 在简历定稿 / 确认投递时改磁盘上的两张表。

---



## 完成后（对用户）

短报：本轮搜了几家 → 初匹配数 → **过筛入库数**（已扣进度表重复）· 优先打开哪几条 · 打开可投岗位表。
入库口径是「更可能进面」，不是「关键词相关」；用户标准本轮有特殊取舍可一句带过。
中途失败：短报「搜了几家 / 卡在哪」即可续跑；勿堆临时 JSON 路径。用户要扩面再说 priority 2/3。
