# SSOT schema（v2.1）

> Agent 文档。用户入口见 [README.md](../../README.md)。

## 顶层

| 层 | 用途 |
|----|------|
| `meta` | `version`, `schema_version`, `updated_at`, `owner`, `locale` |
| `person` | 姓名、联系方式、教育、`phd_thesis`、`identity`（可选） |
| `engagements` | 项目/课题/岗位经历 |
| `outputs` | 论文、软著、奖项、报告 |
| `metrics` | 可核验数字；多套口径可并存 |
| `constraints` | 事实边界：`false_if_claimed` / `true_if_claimed` / `statement` |
| `term_registry` | 术语对照与对外披露（见下） |
| `sources_index` | `source_ids` → 本地路径 |
| `conflicts` | 未裁决冲突 |
| `provenance` | 迁移/来源说明 |
| `change_log` | 增量摘要 |

## engagement

```json
{
  "id": "proj-example",
  "kind": "grant_delivery | phd_core | publication_project | undergrad_grant | internship | fulltime | ...",
  "title": "对外题名",
  "org": "机构",
  "dates": { "start": "YYYY-MM", "end": "YYYY-MM" },
  "activities": ["动词开头"],
  "tools": ["工具名"],
  "role_and_boundary": "真相 + 简历勿写什么",
  "results": [{ "text": "...", "confidence": "verified|claimed", "canon": "结题交付|paper|oral" }]
}
```

`kind: internship | fulltime` → 产业简历优先进「工作经历」区块（见 [rules/resume.md](../rules/resume.md)）。

## output

```json
{
  "id": "pub-example",
  "type": "publication | talk | patent | honor | teaching | ...",
  "citation": "完整引用",
  "role": "第一作者 | 共同一作",
  "status": "published | submitted | working_paper"
}
```

## term_registry

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | 是 | 如 `term-eeg` |
| `term` | 是 | 缩写或黑话 |
| `full_name_zh` | 是 | 精确中文全称 |
| `full_name_en` | 建议 | 英文全称 |
| `plain_zh` | 是 | 维护者可读解释 |
| `disclosure` | 是 | 见下 |
| `external_plain_zh` | 条件 | `plain_only` 必填；简历用此 |
| `aliases` | 否 | 其它写法 |
| `story_relevance` | 否 | `high|medium|low|none` |

### disclosure 四级

| 值 | 简历 |
|----|------|
| `essential` | 可用 term 或 `external_plain_zh`；**领域关键词/工具名/数据集专名保留**（兼顾 ATS） |
| `plain_only` | **只用** `external_plain_zh`，不用校内简称 |
| `internal` | **禁止**上简历 |
| `optional` | 学术 CV 或 JD 匹配时选用 |

**专名策略**：`essential` 可写「PyTorch · Redis · 项目代号（中文括注）」——HR 可读且关键词可检索。

### 术语审阅（可选门禁）

简历里**新出现的**缩写才登记。≤5 个：Agent 内联翻译。大量黑话 → [workflows/resume.md](../workflows/resume.md) audit-terms 节。

## 硬规则

**禁止写入 SSOT**：JD bullet、skills 聚合、投递状态、包装话术、可投岗位表条目。

JD 只存在于：HTML 文件、对话选材表、可选 `config.json`。

## 版本

- 结构变更：`meta.schema_version` patch
- 内容变更：`meta.version` patch + `change_log`

## 参考

- 空壳：[templates/ssot-starter.json](../../templates/ssot-starter.json)
- 完整示例：[fixtures/example-ssot.json](../../fixtures/example-ssot.json)
