# candidate-profile：求职者技能与求职偏好总结

> 路由 → [ROUTER.md](../ROUTER.md)。事实只读经历档案；**本流程产出不写回** `ssot.json`。

用户说「总结我的技能/求职偏好 / 我适合投什么 / 我的优势赛道」时走本流程。对用户称：**求职画像**（磁盘上维护，勿主动甩路径）。

---

## 何时跑（含默认）


| 触发                     | 动作                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------- |
| 用户明确要求总结技能/偏好/赛道       | **本流程**                                                                            |
| 「搜可投岗位 / 刷新岗位表 / 扩面」   | **[job-match.md](job-match.md) 步骤 0**：先跑本流程或确认 `offers/candidate-profile.json` 为最新 |
| 投递进度表新增 ≥3 岗或用户确认已投重要岗 | 建议刷新本画像                                                                            |
| 经历档案重大更新（maintain 后）   | 建议刷新本画像                                                                            |


**禁止**：把 JD 包装话术写回经历档案；用会话臆测替代档案与已投事实。

---

## 输入


| 源                                      | 用途                                                     |
| -------------------------------------- | ------------------------------------------------------ |
| `ssot.json`                            | person、engagements、outputs、metrics、**constraints**（边界） |
| `offers/application-tracker.html`      | 已投岗、状态、JD URL                                          |
| `resumes/` 下**已投**投递版 `.txt` / `.html` | 实际简历叙事与选材（比 JD 标题更准）                                   |
| 可选 `config.json` → `job_match`         | 硬过滤                                                    |
| 用户当轮补充                                 | 偏好校准（写入画像 `job_preferences`，非 ssot）                    |


---

## 输出

写 `offers/candidate-profile.json`（工作区根下 `offers/`，非 `_scratch`）。

结构见 [fixtures/candidate-profile.example.json](../../fixtures/candidate-profile.example.json)。

要点字段：

- `identity_one_liner` — 一句话定位
- `pillar_layers` — 能力分层
- `skill_strengths` / `skill_boundaries` — 可举证强项与 **constraints 对齐** 的禁区
- `job_preferences` — want / avoid / hard_filters
- `audit_axes` — 供 [job-match.md](job-match.md) 审计轴
- `applied_behavior_summary` — 从已投行为反推 core / bridge 赛道
- `role_directions` + `keywords`（含 negative）

`updated_at` 每次刷新必更新。

---

## 步骤

1. 读 `ssot.json` + `constraints` 中 `false_if_claimed` / `fact_boundary`。
2. 读投递进度表全部记录；对 **已投递 / 评估中** 岗，读对应投递版简历（有则读）。
3. 归纳：
  - **三层能力柱**
  - **已投行为**：core_lane vs bridge_lane
  - **偏好**：want / avoid
4. 写入 `candidate-profile.json`；与旧版 diff 大时可在文件内 `changelog` 留一句（可选）。
5. 对用户短报：一句话定位 · 3–5 个最强项 · 优先赛道 · 明确少投类型。

---

## 与 job-match 联动

[job-match.md](job-match.md) 步骤 1 写 `search-brief.json` 时：

- **必须**读 `offers/candidate-profile.json`
- `ssot_summary` 可压缩自画像 + 档案；`role_directions` / `keywords` / `negative` 优先从画像继承
- 审计步骤 3 的「标准从哪来」：**画像 > 会话 > 默认**

---

## 完成后（对用户）

短报画像要点；提示「下次扩岗前会默认更新本画像」。勿堆 JSON 路径。
