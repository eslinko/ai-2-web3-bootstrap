# Node architecture — {{PROJECT_NAME}}

## 1. Структура (эталон: `bot/api/` + `services/`)

| Пакет / папка | Ответственность |
|---------------|-----------------|
| `api/main.py` | FastAPI app, middleware, lifespan |
| `api/config.py` | Переменные с префиксом (`APIConfig`) |
| `api/dependencies.py` | `Depends()` провайдеры |
| `api/routes/` | Тонкие HTTP-слои |
| `services/application/` | Оркестрация use-case |
| `services/core/` | Blockchain, storage, … |

## 2. Порядок middleware (критично)

Зафиксируйте порядок: CORS → TrustedHost → **Bearer (GPT)** → **HMAC** — как в эталоне последний добавленный = первый выполняемый.

## 3. Два контура доверия

| Контур | Клиент | Механизм |
|--------|--------|----------|
| A | Custom GPT / OpenAI | `Authorization: Bearer` |
| B | WooCommerce / партнёр | HMAC заголовки |

## 4. Жизненный цикл запроса

1. Валидация Pydantic
2. Dependency injection
3. Application service
4. Ответ / ошибка домена

## 5. Риски

- Смешение секретов GPT и uploader callbacks

## 6. Hooks

- Подключение Supabase / БД
- Finalizer jobs (upload)
