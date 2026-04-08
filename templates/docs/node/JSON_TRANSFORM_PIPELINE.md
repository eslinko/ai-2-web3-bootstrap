# JSON transform pipeline — {{PROJECT_NAME}}

## 1. Входы

- Тело запроса OpenAPI
- Заголовки (`X-User-Id`, …)

## 2. Трансформации

| Этап | Действие |
|------|----------|
| Parse | Pydantic model |
| Domain | Application service |
| Out | `build_success_response` / ошибки |

## 3. Адаптеры внешних форматов (опционально)

- HTML / CSV → внутренние модели (эталон: WooCommerce adapters)

## 4. Hooks

- …
