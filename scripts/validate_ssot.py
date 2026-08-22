#!/usr/bin/env python3
"""SSOT JSON validator for resume-ssot kit."""
import json
import sys
from pathlib import Path

REQUIRED_TOP = [
    "meta",
    "person",
    "engagements",
    "outputs",
    "metrics",
    "constraints",
    "term_registry",
    "sources_index",
    "conflicts",
    "change_log",
]

DISCLOSURE = {"essential", "plain_only", "internal", "optional"}
ENGAGEMENT_REQUIRED = ("id", "kind", "title")


def _collect_ids(items: list) -> list[str]:
    ids: list[str] = []
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            ids.append(f"<not-object:{i}>")
            continue
        val = item.get("id")
        ids.append(str(val) if val is not None else f"<missing:{i}>")
    return ids


def validate(data: dict) -> list[str]:
    errors: list[str] = []

    for key in REQUIRED_TOP:
        if key not in data:
            errors.append(f"missing top-level key: {key}")

    if "provenance" not in data:
        errors.append("missing recommended key: provenance")

    meta = data.get("meta")
    if isinstance(meta, dict):
        if not meta.get("version") and not meta.get("schema_version"):
            errors.append("meta needs version or schema_version")

    for list_key in ("engagements", "outputs", "metrics", "constraints", "term_registry", "conflicts", "change_log"):
        if list_key in data and not isinstance(data[list_key], list):
            errors.append(f"{list_key} must be a list")

    sources = data.get("sources_index")
    if sources is not None and not isinstance(sources, dict):
        errors.append("sources_index must be an object")

    valid_sources = set(sources.keys()) if isinstance(sources, dict) else set()

    def check_dup(name: str, items: list) -> None:
        seen: set[str] = set()
        for eid in _collect_ids(items):
            if eid.startswith("<"):
                errors.append(f"{name} entry missing or invalid id")
            elif eid in seen:
                errors.append(f"duplicate {name} id: {eid}")
            else:
                seen.add(eid)

    for name in ("engagements", "outputs", "constraints", "term_registry"):
        check_dup(name, data.get(name) or [])

    def check_source_refs(obj: dict, path: str) -> None:
        for sid in obj.get("source_ids") or []:
            if sid not in valid_sources:
                errors.append(f"{path}: unknown source_id {sid!r}")

    for i, eng in enumerate(data.get("engagements") or []):
        if not isinstance(eng, dict):
            errors.append(f"engagements[{i}] not an object")
            continue
        for f in ENGAGEMENT_REQUIRED:
            if f not in eng:
                errors.append(f"engagements[{i}] missing {f}")
        if "dates" in eng and not isinstance(eng["dates"], dict):
            errors.append(f"engagements[{i}] dates must be object")
        check_source_refs(eng, f"engagements[{i}]")

    for i, out in enumerate(data.get("outputs") or []):
        if not isinstance(out, dict):
            continue
        if "id" not in out:
            errors.append(f"outputs[{i}] missing id")
        if "type" not in out:
            errors.append(f"outputs[{i}] missing type")

    for i, cst in enumerate(data.get("constraints") or []):
        if isinstance(cst, dict) and "id" not in cst:
            errors.append(f"constraints[{i}] missing id")

    for i, term in enumerate(data.get("term_registry") or []):
        if not isinstance(term, dict):
            errors.append(f"term_registry[{i}] not an object")
            continue
        for f in ("id", "term", "full_name_zh", "plain_zh", "disclosure"):
            if f not in term:
                errors.append(f"term_registry[{i}] missing {f}")
        disc = term.get("disclosure")
        if disc and disc not in DISCLOSURE:
            errors.append(f"term_registry[{i}] invalid disclosure: {disc}")
        if disc == "plain_only" and not term.get("external_plain_zh"):
            errors.append(f"term_registry[{i}] plain_only needs external_plain_zh")

    return errors


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: validate_ssot.py <ssot.json>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    data = json.loads(path.read_text(encoding="utf-8"))
    errors = validate(data)
    if errors:
        print("INVALID:")
        for e in errors:
            print(" -", e)
        return 1
    print("OK", path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
