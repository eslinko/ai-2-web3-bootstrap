# Web2-нода — {{PROJECT_NAME}}

Эталон в Amanita: каталог `bot/`. Здесь — **посредническая нода**: FastAPI + опционально Telegram.

## Документы

| Файл | Назначение |
|------|------------|
| [NODE_ARCHITECTURE](./NODE_ARCHITECTURE.md) | Слои приложения, DI, роутеры |
| [CACHE_LAYER](./CACHE_LAYER.md) | Кэш ABI, payload, переводы |
| [JSON_TRANSFORM_PIPELINE](./JSON_TRANSFORM_PIPELINE.md) | Вход API → домен → side effects |

## Обязательные решения (заполнить)

- Какие роуты публичны vs Bearer vs HMAC
- Где лежат артефакты ABI и как задаётся `ABI_BASE_DIR`
