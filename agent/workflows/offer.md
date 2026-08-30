# offer：投递进度表

> 路由 → [ROUTER.md](../ROUTER.md)。邮件巡检细节 → [references/email-monitoring.md](../references/email-monitoring.md)。  
> 与可投岗位表联动 → 本节「看板联动」+ [job-match.md](job-match.md) + [resume.md](resume.md) Mode · jd。

用户说「更新投递 / 记一笔投递 / 进度表 / Offer 状态」时走本流程。对用户称：**投递进度表**。

---

## 前置

| 项 | 说明 |
|----|------|
| 进度表 | `offers/application-tracker.html`（无则从 `templates/application-tracker.html` 复制） |
| 可投表 | `offers/job-match-industry.html`（可选，有则联动） |
| 存储键 | 进度表 `resume-ssot-application-tracker-v1`（旧键 `offer-skills-application-tracker-v1` 自动迁入）；可投表 `resume-ssot-job-match-state-v3`（`deleted` + `categories`；旧 dismissed/state 键自动迁入） |

**合并规则（磁盘种子 ↔ 浏览器）**：加载时 `mergeRecords(loaded, seed)`——同键（公司+岗位）比 `updatedAt`，**较新者胜**。Agent 写 `initialRecords` 时必须带 **ISO `updatedAt`（写盘时刻）**，否则旧浏览器缓存会盖住新种子。

**禁止**：把申请编号、密码、验证码写入公开资源或经历档案；投递状态写进 `ssot.json`。

---

## 工作流程

1. 从邮件 / 官网 / 截图提取：日期、公司、岗位、状态、下一步、备注；有则填 `portalUrl` / `jdUrl` / 内推。
2. 同公司同岗位合并；较新状态覆盖旧「已投递」。
3. 无证据不升格（自动回执 ≠ 面试 / Offer）；不确定 →「待确认」或「暂缓」。
4. 更新方式（按场景）：
   - **浏览器**：用户在进度表内增删改（数据在 localStorage；建议定期「备份 JSON」）。
   - **Agent**：改 HTML 内 `initialRecords` 种子（每条必写 `updatedAt`）；联动时**同时**改可投表 `JOBS`（见下）。
5. 邮箱巡检 → [email-monitoring.md](../references/email-monitoring.md)；登录 / MFA / CAPTCHA 由用户完成。
6. 要做投递版简历 → [resume.md](resume.md) Mode · jd（**定稿交付时自动看板联动**）。

### 状态

默认：`待投递` · `已投递` / `简历已投递` · `筛选中` 类 · `测评中` · `一面`/`二面`/`HR面` · `Offer` · `拒绝`/`已结束`/`放弃` · `暂缓` · `待确认`（表内以现有下拉为准）。

---

## 看板联动（可投 → 进度）

**仅 Agent 自动执行**（无浏览器「移入」按钮）。触发：

| 触发 | 进度表状态默认 | 备注建议 |
|------|----------------|----------|
| 投递版简历定稿交付（Mode · jd） | `待投递` | 写投递版路径 |
| 用户确认已投递 / 邮件回执 | `已投递`（或证据对应状态） | 证据一句 |

**Agent 必做（磁盘真相）**

1. **进度表**：`initialRecords` upsert（键 = 公司+岗位，或同 `jdUrl`）；补 `jdUrl` / `portalUrl` / `note`；**每条写当前 ISO `updatedAt`**。
2. **可投表**：从 `JOBS` **删除**对应条目（勿仅改文案留岗）。
3. 短报：已写入进度 · 可投表已移除 · 下一步 · **「请刷新或重新打开进度表，即可看到刚写入的条目。」**

可投表浏览器「删除」= 本机永久隐藏（写入 state-v3），**不**写入进度表；用户导出或说「同步可投表」后 Agent 才从 HTML `JOBS` 移除。刷新可投表审计时须排除进度表已有岗及已同步删除的 id。

---

## 默认交付

进度表路径（至多再带可投表）· 本轮变更摘要 · 下一步清单 · 缺证据项 · 刷新/重开进度表可见种子更新。  
勿把用户真实投递写进 skill 模板或 README。
