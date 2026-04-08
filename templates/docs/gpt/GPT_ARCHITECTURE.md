# GPT architecture — {{PROJECT_NAME}}

## Роль GPT слоя

- GPT слой является частью системного Floou: человек -> диалог -> structured output -> backend handoff.
- GPT не заменяет backend: источник истины остаётся в node/services.

## Decisions snapshot

- `gpt.enabled`: `{{gpt.enabled}}`
- `gpt.actions_integration`: `{{gpt.actions_integration}}`
- `gpt.backend_handoff_mode`: `{{gpt.backend_handoff_mode}}`

## Связь с backend

- При `service_mapped_json`: payload маппится в service-операции.
- При `event_mapped_json`: payload маппится в event categories/workflows.
- При `generic_structured_payload`: сохраняется как структурированный handoff без жёсткого event/service mapping.
