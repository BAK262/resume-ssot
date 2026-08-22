# Acknowledgements

**resume-ssot** is an independent project by [Ming Li (BAK262)](https://github.com/BAK262).
It is **not** affiliated with, endorsed by, or maintained by the authors of the projects below.

This kit **incorporates ideas and workflows** from earlier resume-related Agent Skills used during development, and **reimplements** them into a single SSOT-first package. It is **not** a direct fork of any one upstream repository.

## Lineage

| Source | What influenced this project | Status |
|--------|------------------------------|--------|
| [**resume-master**](https://github.com/wangyafu/resume-skills/tree/main/skills/resume-master) (in [wangyafu/resume-skills](https://github.com/wangyafu/resume-skills)) | HTML-first resume delivery, resume writing norms, Chrome headless PDF pipeline | Workflows merged; PDF scripts adapted (see below) |
| [**ASu Resume Skills**](https://github.com/Claycui828/ASu-resume-skills) | JD-oriented tailoring, evidence-aware scope/role framing, audit-minded resume review | Concepts merged into `agent/rules/` and HR self-check |

## Adapted code

The following files are **derived from** [resume-master](https://github.com/wangyafu/resume-skills/tree/main/skills/resume-master) and kept compatible with this kit’s layout:

- `scripts/render_pdf.py`
- `scripts/pdf_to_images.py`
- `scripts/pdf_page_count.py`

If upstream publishes a license file, retain compatibility with that license when redistributing these files. This project as a whole is released under [MIT](LICENSE).

## How we describe the relationship

**Recommended (accurate):**

- English: *“Incorporates workflows from resume-master and ASu Resume Skills; consolidated into a single SSOT-first Agent Skill.”*
- 中文：*「参考并整合了 resume-master 与 ASu Resume Skills 的工作流，重写为以经历档案（SSOT）为核心的单一 Agent Skill。」*

**Avoid unless literally true:**

- “Fork of …”
- “Official successor to …”
- “Powered by …” (implies ongoing dependency)

## Thanks

Thanks to the authors and communities behind **resume-master** and **ASu Resume Skills** for exploring Agent-native resume workflows.

If you maintain an upstream project and want a wording change, please [open an issue](https://github.com/BAK262/resume-ssot/issues).
