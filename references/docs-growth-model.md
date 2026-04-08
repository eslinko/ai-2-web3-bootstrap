# Reference: docs growth model (эталон: root `docs/tech`, `bot/docs`, `scripts/docs`, `GPT UI/instructions`)

## Уровни зрелости

| Уровень | Содержание | Когда обновлять |
|---------|------------|-----------------|
| **Starter** | Шаблоны из `bootstrap-system/templates/docs/` | При генерации проекта |
| **SSOT машинный** | OpenAPI (`/openapi.json`) | При изменении роутов/Pydantic |
| **SSOT человеческий** | README входа в подсистему + длинный справочник при необходимости | При изменении контрактов интеграций |
| **Operational** | Deploy, Floou shell, env профили | При смене процесса релиза |

## Правило рассинхрона

Если правится только markdown, но не OpenAPI — документ считается **обзорным**. Канон контракта для клиентов — **OpenAPI** (см. обсуждение SSOT в `docs/architecture-extraction/14-open-questions.md`).

## `docs/analysis`

По умолчанию **не** поднимать до архитектурной истины без сверки с кодом.
