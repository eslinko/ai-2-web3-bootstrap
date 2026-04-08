# GPT output contract — {{PROJECT_NAME}}

## Decisions

- `gpt.output_structure_mode`: `{{gpt.output_structure_mode}}`

## Contract sections

- `input_context`: источник и контекст запроса.
- `structured_payload`: канонический JSON для backend handoff.
- `validation_metadata`: readiness, missing fields, ambiguity flags.
- `handoff_metadata`: mode, version, mapping target.

## Required fields (customize per project)

- `payload_version`
- `entity_type`
- `operation_type`
- `required_data`
- `readiness_level`

## Output modes

- `strict_json`: только JSON, без свободного текста.
- `json_plus_explanation`: JSON + краткое пояснение.
- `multi_stage`: отдельные стадии (parse/validate/map) с артефактами.
