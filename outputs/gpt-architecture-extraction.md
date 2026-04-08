# GPT architecture extraction output

## Исследованные источники

### Confirmed from code

- `bot/api/routes/activities.py`
- `bot/services/application/activity/activity_registry_service.py`
- `bot/api/main.py`
- `bot/api/routes/uploads.py`

### Confirmed from persistent docs

- `GPT UI/instructions/base.md`
- `GPT UI/instructions/ingest-validation.md`
- `GPT UI/instructions/activity-normalizer.md`
- `GPT UI/instructions/api-orchestrator.md`
- `GPT UI/instructions/api-methods-reference.md`
- `GPT UI/instructions/search-dialogue.md`
- `GPT UI/instructions/konyrody-gate.md`
- `GPT UI/instructions/safety-compliance.md`
- `GPT UI/docs/custom-gpt-architecture-principles-for-dialog-ingest-api.md`
- `bot/docs/tech/api/api.md`

## Findings

### 1) GPT как архитектурный слой, не prompt-only

**Observation:** GPT слой модульный: разные инструкции для dialogue/parsing/validation/normalization/orchestration.

**Evidence:** `GPT UI/instructions/*` (base, ingest-validation, activity-normalizer, api-orchestrator).

**Notes:** Паттерн перенесён в bootstrap decisions/switches/templates.

### 2) Psychological elicitation присутствует как отдельный механизм

**Observation:** Используются batch-questioning, ambiguity resolution, missing required fields rounds.

**Evidence:** `ingest-validation.md` (batch field requests, missing data resolution), `search-dialogue.md`.

**Notes:** Слой выделен в `gpt.elicitation_mode` и `DIALOGUE_MODEL.md`.

### 3) Rulebook/validation отделён от оркестрации API

**Observation:** Rulebook/policy проверка и readiness gating идут отдельным этапом перед handoff.

**Evidence:** `ingest-validation.md`, `konyrody-gate.md`, `safety-compliance.md`, `api-orchestrator.md` (responsibility split).

**Notes:** Перенесено в `gpt.rulebook_mode`, `gpt.rulebook_source`, `gpt_rulebook_required`.

### 4) JSON contract и handoff в backend формализованы

**Observation:** Есть контрактные JSON структуры для нормализованного payload и поискового запроса + mapping на backend operations.

**Evidence:** `api-orchestrator.md` input contracts; `activity-normalizer.md`; `api-methods-reference.md`.

**Notes:** Перенесено в `OUTPUT_CONTRACT.md`, `BACKEND_HANDOFF.md`, code boundaries `gpt_payload`, `gpt_mapping`.

## Hypotheses

- `event_mapped_json` и `service_mapped_json` в других проектах могут требовать отдельной event taxonomy, отсутствующей в старте.
- Для `open_exploration` почти всегда нужен дополнительный этап нормализации, иначе контракт нестабилен.

## Что перенесено в bootstrap-system

- GPT decisions block в `01-interview-orchestrator.md`.
- GPT contradiction rules.
- GPT секции и switches в `02-interview-summary-spec.md`.
- GPT строки в decision matrix и output selection rules.
- GPT section в output spec.
- Шаблоны `templates/docs/gpt/*`.
- Code boundaries `services/gpt_ingest`, `services/gpt_validation`, `services/gpt_mapping`, `src/domain/contracts/gpt_payload`.
- Reference bridge: `references/gpt-abstraction-rules.md`.

## Что сознательно НЕ перенесено

- Конкретные prompt тексты Amanita как канон.
- Полный runtime ingestion engine.
- Жёсткая универсальная JSON schema для всех доменов.
- Domain-specific policy values из Amanita как обязательные defaults.

## Требует уточнения автора

- Предпочтительный default для `gpt.output_structure_mode` (strict_json vs json_plus_explanation).
- Для каких доменов в bootstrap считать default `event_mapped_json`, а для каких `service_mapped_json`.
- Нужен ли отдельный starter шаблон для rulebook-файла в корне проекта или достаточно `templates/docs/gpt/RULEBOOK_MODEL.md`.
