# GPT abstraction rules (bootstrap bridge)

## 1. Инварианты GPT слоя (из Amanita)

- Модульная схема: dialogue/parsing -> validation/rulebook -> normalization -> API orchestrator.
- Структурированный handoff контракт (JSON + metadata), а не свободный текст.
- Явное разделение «сбор мыслей» и «выполнение backend операций».
- Проверки readiness/stop conditions до handoff.

## 2. Что должно быть кастомизируемым

- Domain capture type (идеи/запросы/события/кастом).
- Rulebook content и источники документов.
- JSON sections и required fields под домен.
- Service/event mapping модель и endpoint set.

## 3. Как отделять domain rulebook от общего GPT pattern

- Общий pattern: есть rulebook layer + validation workflow.
- Domain layer: конкретные нормы/policy/ценности и их формулировки.
- В summary фиксировать отдельно: `gpt.rulebook_mode` и `gpt.rulebook_source`.

## 4. Как не потерять психологический слой

- Не заменять elicitation голой формой полей.
- Фиксировать `gpt.elicitation_mode` в decisions и в `DIALOGUE_MODEL.md`.
- Включать этап уточняющих вопросов и ambiguity resolution в boundary docs.

## 5. Как не перепутать «сбор мыслей» и «строгий backend contract»

- Dialogue model и Output contract — две отдельные сущности.
- `strict_json` включает контрактные артефакты/версии, но не отменяет elicitation этап.
- `open_exploration` требует отдельной нормализации до deterministic handoff.
