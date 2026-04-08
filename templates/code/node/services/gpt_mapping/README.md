# GPT mapping boundaries

Граница маппинга валидированного GPT payload в backend модель.

## Responsibilities

- mapping в service model (`service_mapped_json`);
- mapping в event model (`event_mapped_json`);
- fallback generic structured payload handoff.

## Decisions

- `gpt.backend_handoff_mode`
- `gpt.output_structure_mode`
