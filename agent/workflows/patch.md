# patch：轻量编辑（改一句 / 改一段）

> 智能默认 → [ROUTER.md](../ROUTER.md)。

## 适用

用户只改投递版或通用版中的**局部文案**，不涉及新经历、新发表或角色边界变化。

## 步骤

1. **定位文件** — 确认改 `resumes/industry_<jd-slug>.html` 还是 `resumes/industry_base.html`（学术轨同理 `academic_*`）
2. **改 HTML** — 只动目标 bullet/段落；不借 JD 理由改量化数字或职责边界
3. **最小回写** — 若改动反映新事实（日期、数字、称谓），同步 `ssot.json` 对应字段；纯措辞优化可不回写
4. **校验** — 有 ssot 变更时运行 `python scripts/validate_ssot.py <ssot.json>`
5. **交付** — 短报说明改了什么；投递版若有 `.txt`/PDF 依赖，按需重跑 `export_plain.py` / `render_resume.py`

## 禁止

- 因 JD 压力扩大职责或编造 metrics
- 把 `role_and_boundary` / `internal` 术语写进 HTML
- 无用户确认时覆盖已定稿的其他投递版
