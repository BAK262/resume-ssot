# maintain：增量维护经历档案

> 轻量编辑 → [workflows/patch.md](patch.md)。

## 步骤

1. 读 `ssot.json` + `constraints`
2. 变更写入对应层
3. 新缩写 → `term_registry` 草稿
4. `meta.version` patch + `change_log`
5. 可选：`validate_ssot.py`（有 structural 变更时 **建议必跑**）

## 冲突裁决

用户选择 → `constraints` + 更新权威字段 + 移除 `conflicts`  
若工作区有主张账本，同步 `verification_status` / `risk_notes`（见 [claim-evidence-ledger.md](../references/claim-evidence-ledger.md)）

## 输出

自然语言短报 → 至多 1 澄清问题 → 完整 JSON

**禁止**要求用户读 schema；**禁止**一次丢 >3 路径；**禁止**把岗位包装话术写入经历档案。
