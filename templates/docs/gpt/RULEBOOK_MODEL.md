# Rulebook model — {{PROJECT_NAME}}

## Decisions

- `gpt.rulebook_mode`: `{{gpt.rulebook_mode}}`
- `gpt.rulebook_source`: `{{gpt.rulebook_source}}`

## Роль rulebook

- Rulebook задаёт валидационные правила и policy constraints для GPT output.
- Rulebook слой отделяется от диалогового слоя: диалог собирает данные, rulebook проверяет готовность.

## Source patterns

- `single_document`: один SSOT документ.
- `multiple_documents`: несколько источников (policy + rubric + domain rules).
- `interview_defined_later`: источник не финализирован, фиксируется в `Pending decisions`.

## Domain-specific vs reusable

- Reusable: структура проверки, readiness уровни, stop conditions.
- Domain-specific: конкретные нормы, ценности, запреты.
