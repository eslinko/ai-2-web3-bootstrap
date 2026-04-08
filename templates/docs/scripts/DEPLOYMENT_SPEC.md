# Deployment spec (JSON)

## Формат (эталон)

Репозиторий-эталон использует **deployment README** + JSON с полями вроде `contract_name`, `scenario`, шагов валидации. Это **контракт между human/AI и автоматизацией**, не runtime API ноды.

## Использование в bootstrap

- **`docs_only`** — описание формата в markdown, без генерации JSON.
- **`json_spec_enabled`** — минимальный **пример** (пустой pipeline / один шаг) в `deployment/pipeline.minimal.example.json` + README template.
- **`none`** — секция не генерируется.

## Важно

Не импортировать **`variant-a.json`** эталона как канон: только **структура** и **соглашения имен**.

## Связь

- **GPT/Floou:** spec может питать сценарии и документацию Actions.
- **Scripts router:** шаги могут вызывать именованные операции (если реализовано позже).
