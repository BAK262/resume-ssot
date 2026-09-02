# job-match：多渠道实搜可投岗位

> 路由 → [ROUTER.md](../ROUTER.md)。事实只读经历档案；岗位包装不写回 `ssot.json`。

用户说「搜可投岗位 / 刷新岗位表 / 扩面 / 官网匹配」时走本流程。对用户称：**可投岗位表**（正式）与 **临时检索**（`offers/_scratch/`，勿主动甩路径）。

---

## 前置

| 项 | 说明 |
| --- | --- |
| 经历档案 | `ssot.json` 已有可用事实 |
| 正式表 | `offers/job-match-industry.html`（无则从 `templates/job-match-board.html` 复制） |
| 临时目录 | `offers/_scratch/`（自动建） |
| 硬过滤 | 读 `config.json` → `job_match.hard_filters`；无则从经历档案地点/入职窗口推断，**先确认再搜** |
| 投递进度 | `offers/application-tracker.html`（无则从模板复制；见 [offer.md](offer.md)） |
| 求职画像 | `offers/candidate-profile.json`（无则先走 [candidate-profile.md](candidate-profile.md)） |
| 搜岗总账 | `offers/_scratch/search-ledger.json`（`slug` / `name` / `last_searched_at` / `last_result` / `watch?`；无则步骤 1 前用 `match-*` 建空架） |

**信息源（平等，无平台优先级）**

- **官网 / 校招门户**、**Boss / 猎聘 / 智联**、**邮件 JD** 均可作发现与入库来源；须有可打开的 **JD 详情 URL** + 可核验地点。
- 官网 JD **可靠性通常更高**；有则记入 `official_href` 作交叉核验，**不是**入库前置条件。
- 仅有第三方、无官源 → 正常入库；`why` 写明投递通道（见下）。

**禁止**

- 第三方聚合/新闻「听说有岗」直接入库
- 无 JD 详情链
- 跳过实搜直接改 HTML
- 把包装话术写回经历档案
- 搜到即批量打招呼（须待投递确认后再走平台沟通）

**去重**

- 已在进度表的岗（已生成投递版 / 已投递）**不得**再进 `JOBS`；按公司+岗位或 `jdUrl` 排除
- 搜岗总账已有 `slug` 且无复查理由**不得**再派实搜；复查仅当 `watch` 到期、用户点名、或校招窗口明显新开

---

## 流水线

```
0 求职画像 → 1 脑暴 brief → 2 实搜 match-*.json → 3 审计入库 JOBS
```

### 0 · 求职画像（扩岗前默认）

走 [candidate-profile.md](candidate-profile.md)：读经历档案 + 投递进度 + 已投投递版 → 更新 `offers/candidate-profile.json`。

- 扩面/刷新岗位表前**默认执行**；若 `updated_at` 早于投递进度或档案 `meta.updated_at`，必须刷新
- 用户明确说「画像不用更新」可跳过，审计日志记一句

### 1 · 关键词脑暴（1 agent）

读 `candidate-profile.json` + `ssot.json`（person / engagements / outputs / metrics / constraints）+ 可选投递进度 + `search-ledger.json`。

- 画像 `role_directions`、`keywords`（含 negative）、`job_preferences`、`audit_axes` **优先继承**到 brief
- `ssot_summary` 可压缩自 `identity_one_liner` 与能力柱
- `priority: 1` 的 `slug` 不得与总账重复，除非 `watch` 复查或用户点名重搜
- brief `notes` 写「已排除总账 N 家 / 本轮复查 M 家」
- **本轮默认**：`priority: 1` 填 **3–5 家**并只搜这些；2/3 作扩面候选，**用户说扩面再开**
- 本步**不**编造具体在招岗位名

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

### 2 · 实搜（N agents，一企一 agent）

每个 agent：按 brief 关键词检索 → 过硬过滤 → 打开 JD → 对照 `ssot_summary` 初匹配。

**三条入口（无优先级；按可得性选用）**

| 入口 | 做法 |
| --- | --- |
| 企业官网 / 校招 | `portal_url` 实搜 |
| 第三方平台 | Boss / 猎聘 / 智联关键词或公司页；见下「第三方检索工具」 |
| 用户直链 | 打开用户给的 Boss/猎聘/智联/邮件链 → 读 JD → 可选官源交叉核验 |

**第三方检索工具（推荐，可降级）**

本机已配置 **`boss-agent` MCP**（[boss-agent-cli](https://github.com/can4hou6joeng4/boss-agent-cli)）时，优先用于 **Boss 直聘**（及 CLI 已支持的 **智联** 求职者只读）：

| 能力 | MCP / CLI | 说明 |
| --- | --- | --- |
| 关键词搜岗 | `search` | 城市、经验、薪资等筛选；结果写 `match-*.json` |
| 读 JD 详情 | `detail` | 用户直链或列表 `security_id` |
| 登录态 | 本机 `boss login`（用户完成） | 非 Boss 官方 API；须遵守平台协议与频率 |

**降级**：未配置 MCP、登录失效、猎聘、验证码墙、公司页打不开 → **浏览器 MCP** 或用户提供的 JD 链。不因缺 MCP 而跳过第三方扩岗。

**官源交叉核验（可选，非入库门槛）**

1. 有则记：官网招聘页、校招门户、官方邮箱/公告、猎聘/智联**企业直招**帖（署名本公司 HR）→ `official_href`
2. 猎头匿名但有猎聘**同文案**帖 → 交叉核验薪酬/职责，**勿**当雇主官网
3. 实搜后仍无官源 → `channel_note` 写「无官网招聘页；投递：Boss 直聊 / 猎聘沟通 / 邮件 xxx」

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
    "salary": "平台明示区间；未展示可省略",
    "source": "Boss直聘 / 猎聘 / 智联 / 官网 等",
    "official_href": "可选：官网或企业直招 JD",
    "official_label": "可选",
    "channel_note": "官源实搜一句 + 投递通道",
    "jd_excerpt": "80-200字",
    "why_preliminary": "与经历档案哪条初匹配"
  }],
  "misses_or_notes": ""
}
```

- 只收录：页面真实存在、可开 JD、地点过硬过滤
- 登录墙 / 0 命中 → `misses_or_notes`
- 落盘后**立刻**更新总账：`last_searched_at`、`last_result`（`hit`|`miss`）；窗口未开写 `watch`

### 3 · 审计入库（1 agent）

再读经历档案 + 全部 `match-*.json`（+ 可选投递进度）+ **本会话用户已说清的求职标准**。

**目标函数（与步骤 2 不同）**

- 步骤 2：方向/关键词能不能圆成故事
- 步骤 3：**以真实履历与门槛，这份 JD 会不会让 TA 进面试？**
- 叙事能讲 ≠ 过筛；标题关键词若正文招聘画像是另一条线，按正文裁

**标准从哪来**

- `candidate-profile.json`（强项、边界、want/avoid、audit_axes、已投行为）
- 经历档案专业、届别、履历边界
- `config.job_match` 与 brief 硬过滤
- 用户本会话偏好与否决
- 投递进度已投同类岗所暗示的标准（校准「什么叫对口」，已投 ≠ 自动再收）

审计轴默认用画像 `audit_axes`（生理情感信号、人类认知评测、数据闭环 vs 训练 infra），**非**「PM vs 算法」二元。标准未说清且影响大面积取舍时：**先问一句再大批入库**。

**怎么审**

- 要求/门槛段与职责段都要看；过筛看门槛与招聘画像
- 校招/实习/社招通道与履历是否说得通
- 诚实判定；禁止为凑 `exact`/`strong` 或填满看板而美化
- 地点与 `jd_url` 过硬过滤；进度表已有岗排除
- **精选、宁缺毋滥**

**入库动作**

- 覆盖更新正式表 `JOBS`；保留页面结构 / TRACKS / 渲染逻辑
- `href` = JD 详情 URL（禁止只写门户首页）
- `why` = 匹配理由 1–2 句（锚经历档案）+ 薪酬 / 官源 / **投递方式**（有则记，无则略）
- 写 `audit-log.json` 或 `audit-log-*.json`：`stats` + `kept[]` + `dropped_sample[]`
- 同步总账 `last_result`；对口但窗口未开写/刷新 `watch`
- 可选在 `kept[]`/`dropped_sample[]` 用自然语言写裁断理由

**JOBS 字段**

`{ id, company, role, city, track, category, fit, status, why, href, hrefLabel }`

| 字段 | 值 | 说明 |
| --- | --- | --- |
| `category` | `pending` \| `ready` \| `backup` \| `archived` | 投递决策类 |
| `fit` | `exact` \| `strong` \| `stretch` | 过筛后贴合度 |
| `status` | `urgent` \| `open` | 排序；仅 `urgent` 显示「优先」 |

**默认 `category`**

- **第三方平台**（Boss / 猎聘 / 智联等）入库 → `pending`（待平台沟通）
- 官网 / 校招 / 邮件 JD 且过筛 → `pending`（待确认）
- 标题含实习 / 了解 / 探索 / 科研·了解 → `archived`
- 用户当轮明确「待投」→ `ready`；「同司名额已满」→ `backup`

薪酬、官源、投递方式只写进 `why`，不单开表列；`match-*.json` 可保留 `salary` / `channel_note` 备查。

---

## 投递通道（与可投 / 进度联动）

### 第三方平台（Boss / 猎聘 / 智联等）

**第一步是平台沟通，不是发简历。**

| 阶段 | 可投表 `category` | 动作 |
| --- | --- | --- |
| 扩岗入库 | `pending`（默认） | 写入 JD + `why`（含投递通道）；**不**自动打招呼 |
| 平台交流 / 打招呼 | `pending` → `ready` | 用户确认「已打招呼」后改 `ready`；`why` 记沟通要点 |
| 交流后不匹配 / 放弃 | → `archived` | `why` 记放弃原因 |
| 待投递阶段 | `ready` | 可出投递版（[resume.md](resume.md) Mode · jd）；**定稿留可投表**，不入进度表 |
| 交流后已发简历 | — | [offer.md](offer.md) 写入进度表（`已投递` / `简历已投递`），移出可投表 |

平台注意：Boss 有日沟通上限；打招呼前可复用 [resume.md](resume.md) Mode · pitch 开场；控制频率，避免批量泛招呼触发风控。**打招呼 ≠ 已投递**，勿提前写入进度表。

### 官网 / 邮件等直投通道

| 阶段 | 动作 |
| --- | --- |
| 入库 | 默认 `pending`；用户明确待投 → `ready` |
| 出投递版 | `ready` 下 fork；定稿可在进度表记 `待投递`（备注路径），或留可投表至实投前 |
| 确认已投递 | 进度表 `已投递` 等，移出可投表 |

---

## 看板与同步

看板 v3：顶栏按类别计数；类别下拉 + 删除；`fit`/`status` 仅排序。

**浏览器状态（本机，不写 HTML）**

- 键：`resume-ssot-job-match-state-v3` → `{ deleted: string[], categories: { [id]: category } }`
- 旧键 v1/v2/dismissed 首次打开自动迁入
- 「删除」= 本机永久隐藏；「导出操作记录」→ `job-match-state.json`

**Agent 同步可投表**（用户说「同步可投表」或发来 `job-match-state.json`）

1. 从 `JOBS` 删除 `deleted_ids` 全部 id（磁盘真相）
2. 存活条目：`categories[id]` 与 HTML 种子默认不同则写回 `job.category`
3. 保留页面结构；勿改用户未导出的 unrelated 条目
4. 短报：删 N 条 · 改类 M 条 · 请刷新浏览器

审计刷新 `JOBS` 时：合并已导出 `deleted_ids`，排除进度表已有岗；用户未同步则按 HTML 内 `category` 为准。

---

## 与投递 / 简历

| 产物 | 角色 |
| --- | --- |
| 可投岗位表 | 尚未进入进度的候选 |
| 投递进度表 | 已生成投递版 / 已投 / 面试 → [offer.md](offer.md) |
| 投递版简历 | 选定岗 → [resume.md](resume.md) Mode · jd；定稿时写入进度并移出可投 |

联动靠 Agent 改磁盘上的两张表，不靠浏览器按钮。

---

## 完成后（对用户）

短报：本轮搜了几家 → 初匹配数 → **过筛入库数**（已扣进度表重复）· 优先打开哪几条 · 打开可投岗位表。

入库口径是「更可能进面」，不是「关键词相关」。中途失败：短报「搜了几家 / 卡在哪」即可续跑；用户要扩面再说 priority 2/3。
