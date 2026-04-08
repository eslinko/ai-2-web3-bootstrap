# GPT architecture extraction (эталон Amanita)

## 1. Role of GPT layer

**Observation:** В эталоне GPT слой оформлен как модульный pipeline инструкций (base -> parsing/validation/normalization -> api orchestrator), а не как единый prompt.

**Evidence:** `GPT UI/instructions/base.md`, `GPT UI/instructions/ingest-validation.md`, `GPT UI/instructions/activity-normalizer.md`, `GPT UI/instructions/api-orchestrator.md`.

**Notes:** GPT слой включён в общий Floou: пользовательский ввод -> структурированный JSON -> backend API/handoff.

## 2. Psychological elicitation pattern

**Observation:** Диалоговый слой содержит режимы извлечения и уточнения: batch-questions, resolution ambiguities, missing required fields, guided flow до readiness.

**Evidence:** `GPT UI/instructions/ingest-validation.md` (batch field requests, missing-data resolution), `GPT UI/instructions/search-dialogue.md`, `GPT UI/instructions/base.md`.

**Notes:** Паттерн reusable: «хаос -> уточнения -> структурированная модель»; конкретные формулировки вопросов domain-specific.

## 3. Rulebook / validation pattern

**Observation:** Валидация отделена в отдельный слой (validation + gate), с readiness-уровнями и stop-the-line условиями.

**Evidence:** `GPT UI/instructions/ingest-validation.md` (Draft-ready/SentToReview-ready, stop_the_line), `GPT UI/instructions/konyrody-gate.md`, `GPT UI/instructions/safety-compliance.md`.

**Notes:** Reusable паттерн: rulebook as separate contract; domain policy (e.g. KоныРода) — project-specific.

## 4. JSON output contract

**Observation:** Есть явные структурированные payload contracts для handoff между модулями и к backend (`validated_data`, `validation_metadata`, `normalized_activity_payload`, search query JSON).

**Evidence:** `GPT UI/instructions/ingest-validation.md` (Output Contract), `GPT UI/instructions/activity-normalizer.md`, `GPT UI/instructions/api-orchestrator.md` (Input Contract sections).

**Notes:** Обязательные части в эталоне: payload sections + metadata/readiness refs + operation mapping.

## 5. Event / service handoff

**Observation:** Handoff в backend завязан на operation mapping и lifecycle операций (`/activities/*`, `/reference/*`, search, submit/publish), а также на связку с upload/sign flows.

**Evidence:** `GPT UI/instructions/api-orchestrator.md`, `GPT UI/instructions/api-methods-reference.md`, `bot/api/routes/activities.py`, `bot/services/application/activity/activity_registry_service.py`.

**Notes:** В эталоне присутствуют и service-oriented операции, и event-like workflow этапы.

## 6. Reusable vs project-specific

**Observation:** Reusable: модульный pipeline, readiness/checkpoint model, разделение ingest/validation/mapping/orchestrator, contract-first handoff.

**Evidence:** структура `GPT UI/instructions/*` + интеграция с `bot/api`.

**Notes:** Project-specific: Activity data model, policy names, taxonomy enums, exact endpoint set.

## 7. Risks of abstraction

**Observation:** При переносе легко потерять психологический слой (elicitation), если оставить только JSON schema.

**Evidence:** наличие отдельных инструкций dialogue/parsing/validation в эталоне.

**Notes:** Второй риск — смешать domain rulebook с generic GPT pattern; третий — свести handoff к «любой JSON» без mapping mode.
