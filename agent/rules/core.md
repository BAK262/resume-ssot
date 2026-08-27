# 事实层规则（core）

## 原则

1. **全量保真**：多种口径可并存，裁决前不删
2. **先经历档案后简历**：冲突以 SSOT + `constraints` 为准
3. **信息不减**：重组时不丢历史
4. **事实与包装分离**：包装表述只进 HTML / 开场文案 / 可选账本的 `candidate_wording`，不进事实字段冒充 verified

## 冲突

1. 矛盾 → `conflicts[]`（备证、`source_ids`）
2. 用户裁决 → `constraints[]` + 更新权威字段
3. 非对外口径标 `canon: 备证`，不写进简历
4. 强主张表述争议可旁挂账本（[claim-evidence-ledger.md](../references/claim-evidence-ledger.md)），权威数字仍以 `constraints` 为准

## role_and_boundary

- 存**真相**与**勿写边界**（如不宣称独立完成训练、不写未担任的负责人头衔）
- 简历写「负责 + 结果」；防御性说明留面试；开场白同样遵守边界

## metrics

多套并存时，`constraints` 规定对外用哪套（例：结题 N=159 vs 报告 N=191）。

## maintain 输出

1. 自然语言短报（改了哪些经历/项目）
2. 至多 1 个澄清问题
3. 完整 JSON + `change_log`

轻量编辑见 [ROUTER.md](../ROUTER.md)。

## 禁止

- 写入 JD 选材、skills 列表、visibility、包装话术
- 无证据把 `claimed` 改成 `verified`
