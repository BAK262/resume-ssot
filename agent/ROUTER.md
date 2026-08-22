# Agent 路由（唯一权威）

> 设计立场 → [DESIGN.md](DESIGN.md)

## 三条 invariant

1. 事实只进 `ssot.json`；JD 包装只进 HTML  
2. 术语走 `term_registry`；`internal` 不上简历；`essential` 保留 ATS 关键词  
3. 争议 → `conflicts`；裁决 → `constraints`；再动简历  

## 数据流

```mermaid
flowchart LR
  A[旧CV / 口述] --> B[ssot.json]
  B --> C[通用版 HTML]
  C --> D[投递版 HTML]
  D --> E[PDF + plain.txt]
```

## 工作区（磁盘布局，不对用户报文件名）

```
<workspace>/
├── ssot.json
├── resumes/
│   ├── industry_base.html
│   ├── industry_<jd-slug>.html
│   ├── industry_<jd-slug>.txt
│   ├── academic_base.html
│   ├── academic_<jd-slug>.html
│   └── academic_<jd-slug>.txt
└── config.json   # 可选，templates/config.example.json
```

对用户称：**经历档案 / 通用版 / 投递版 / 网申文本**。

## 智能默认

| 信号 | 动作 |
|------|------|
| 首次、工作区空 | 自动复制 starter → 建 `resumes/` |
| 给了旧简历路径 | scan → 若要 JD 则直接 jd（lazy base） |
| 只口述 | walkthrough，3 轮，第 1 轮后出草稿 |
| 新缩写 ≤5 | 内联翻译，跳过 audit-terms |
| 投递版交付 | HTML + 尝试 PDF + `export_plain.py --from-html` |
| 只改一句 | [workflows/patch.md](workflows/patch.md)：改 HTML → 最小 ssot 回写 → validate |
| 学术版简历 | `academic` 轨 + `templates/resume-academic.html` |
| 用户焦虑 | [README.md](../README.md) FAQ；≤3 问/轮 |

**禁止**：要求用户读 agent 文档；一次丢 >3 路径；对用户说 workflow/schema 名、SSOT、audit、subagent。

## 模式路由

| 意图 | 文档 |
|------|------|
| 新建 | [workflows/init.md](workflows/init.md) + [schema/ssot.md](schema/ssot.md) |
| 改事实 | [workflows/maintain.md](workflows/maintain.md) + [rules/core.md](rules/core.md) |
| 出简历 | [workflows/resume.md](workflows/resume.md) + [rules/resume.md](rules/resume.md) |
| 轻量编辑 | [workflows/patch.md](workflows/patch.md) + [rules/resume.md](rules/resume.md) |
| 从 GitHub 安装 | [INSTALL.md](INSTALL.md) |
| PDF / ATS | [scripts/README.md](../scripts/README.md) |

## 输出

- 自然语言短报；选材表用人话  
- jd 版：[HR 自检](rules/resume.md#hr-自检)  
- 示例：[fixtures/example-ssot.json](../fixtures/example-ssot.json)

## 校验命令

```bash
python scripts/validate_ssot.py <ssot.json>
python scripts/render_resume.py --in <html> [--preview-dir <dir>]
python scripts/export_plain.py --from-html resumes/<slug>.html --in ssot.json --out resumes/<slug>.txt
python tests/test_scripts.py
```
