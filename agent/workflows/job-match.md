# job-match：官网实搜可投岗位

> 路由 → [ROUTER.md](../ROUTER.md)。事实只读经历档案；岗位包装不写回 `ssot.json`。

用户说「搜可投岗位 / 刷新岗位表 / 官网匹配」时走本流程。对用户称：**可投岗位表**（正式）与 **临时检索**（`offers/_scratch/`，勿主动甩路径）。

---

## 前置

| 项 | 说明 |
|----|------|
| 经历档案 | `ssot.json` 已有可用事实 |
| 正式表 | `offers/job-match-industry.html`（无则从 `templates/job-match-board.html` 复制） |
| 临时目录 | `offers/_scratch/`（自动建） |
| 硬过滤 | 读 `config.json` → `job_match.hard_filters`；无则从经历档案地点/入职窗口推断，**先确认再搜** |
| 投递进度 | `offers/application-tracker.html`（无则从模板复制；见 [offer.md](offer.md)） |

**禁止**：第三方聚合/新闻「听说有岗」写入正式表；无 JD 详情链；跳过步骤 2 直接改 HTML；把包装话术写回经历档案。  
**已在进度表的岗**（已生成投递版 / 已投递）**不得**再进 `JOBS`；审计时按公司+岗位或 `jdUrl` 排除。

---

## 三步流水线（每次刷新都走）

### 1 · 关键词脑暴（1 agent）

读 `ssot.json`（person / engagements / outputs / metrics / constraints）+ 可选投递进度。

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

### 3 · 审计入库（1 agent）

再读经历档案 + 全部 `match-*.json`（+ 可选投递进度）。

- 纳入须：地点过硬过滤 + 可开 `jd_url` + 与经历档案实质关联 + 届别/实习窗口说得通
- 剔除：弱相关灌水、纯工程运维、门槛明显不符且无校招/实习通道
- **精选、宁缺毋滥**（不为凑数扩表）
- **覆盖更新**正式表的 `JOBS` 数组；保留页面结构 / TRACKS / 渲染逻辑
- `href` = JD 详情 URL（禁止只写门户首页）
- `why` 点名经历档案锚点，1–2 句
- 写 `offers/_scratch/audit-log.json`：`stats` + `kept[]` + `dropped_sample[]`

JOBS 字段：`{ id, company, role, city, track, fit, status, why, href, hrefLabel }`  
`fit`: `exact` | `strong` | `stretch` · `status`: `urgent` | `open`

保留看板 UI：操作列「删除」、工具条「投递进度表 / 导出已隐藏 / 恢复已隐藏」。  
浏览器删除只写 `localStorage`（`resume-ssot-job-match-dismissed-v1`）；Agent 永久删改 `JOBS`。用户导出的 `job-match-dismissed.json` 可在下次审计时并入剔除。

---

## 与投递 / 简历关系

| 产物 | 角色 |
|------|------|
| 可投岗位表 | 尚未进入进度的官网候选 |
| 投递进度表 | 已生成投递版 / 已投 / 面试状态 → [offer.md](offer.md) |
| 投递版简历 | 选定岗 → [resume.md](resume.md) Mode · jd **定稿交付时** Agent 自动写入进度并移出可投 |

联动不靠浏览器按钮；只靠 Agent 在简历定稿 / 确认投递时改磁盘上的两张表。

---

## 完成后（对用户）

短报：本轮搜了几家 → 初匹配数 → 入库数（已扣进度表重复）· 优先打开哪几条 · 打开可投岗位表。  
中途失败：短报「搜了几家 / 卡在哪」即可续跑；勿堆临时 JSON 路径。用户要扩面再说 priority 2/3。
