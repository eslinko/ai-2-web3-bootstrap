# Security middleware boundaries

Эта папка содержит только границы слоя middleware безопасности.

## Что сюда попадает

- HMAC middleware boundary
- Bearer guards (GPT / edge callbacks)
- request signature helpers

## Что НЕ попадает

- Полная runtime-реализация
- Реальные секреты / значения env

## Управляющие решения

- `security.api_auth_mode`
- `security.gpt_actions_protection`
- `security.edge_auth_mode`
