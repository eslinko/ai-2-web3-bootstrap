# Backend handoff — {{PROJECT_NAME}}

## Decision

- `gpt.backend_handoff_mode`: `{{gpt.backend_handoff_mode}}`

## Handoff variants

| Mode | Handoff target |
|------|----------------|
| `service_mapped_json` | backend services/use-cases |
| `event_mapped_json` | event categories/workflows |
| `generic_structured_payload` | generic ingest endpoint / manual bridge |

## Mapping responsibilities

- `gpt_ingest`: приём и базовая проверка payload.
- `gpt_validation`: проверка по rulebook/policy.
- `gpt_mapping`: преобразование в service/event модель.

## Notes

- Handoff контракт фиксируется отдельно от prompt text.
