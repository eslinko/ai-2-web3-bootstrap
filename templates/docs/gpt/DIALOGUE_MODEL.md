# Dialogue model — {{PROJECT_NAME}}

## Elicitation mode

- `gpt.elicitation_mode`: `{{gpt.elicitation_mode}}`
- `gpt.domain_capture_type`: `{{gpt.domain_capture_type}}`

## Переход от хаоса к структуре

1. Вытягивание исходного намерения и контекста пользователя.
2. Уточняющие вопросы по недостающим полям.
3. Сбор структурированных блоков для последующей нормализации.
4. Подтверждение пользователем перед handoff.

## Типы вопросов

- Clarification questions (для неоднозначностей).
- Missing-data questions (для обязательных полей).
- Scope questions (что in/out of scope).
- Constraint questions (правила, ограничения, критерии).
