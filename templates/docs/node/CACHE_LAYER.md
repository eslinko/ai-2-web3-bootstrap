# Cache layer — {{PROJECT_NAME}}

## 1. Что кэшируется (проверить по проекту)

| Тип | Где | TTL / инвалидация |
|-----|-----|-------------------|
| Payload upload | in-memory / Redis | до callback |
| ABI paths | startup | после sync artifacts |
| Переводы / каталог | … | … |

## 2. Инварианты

- `upload_id` уникален в рамках сессии publish

## 3. Риски

- In-memory кэш при нескольких репликах → нужен shared store

## 4. Hooks

- …
