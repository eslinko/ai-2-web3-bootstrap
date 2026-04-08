# {{PROJECT_NAME}} — документация (starter)

## Назначение этого набора

Рабочие заготовки: фиксировать **решения**, **границы интеграций** и **Data Floou** по мере роста проекта. Не дублировать OpenAPI — для контрактов API используйте `/openapi.json` на ноде.

## Навигация

| Документ | Вопросы, на которые отвечает |
|----------|-------------------------------|
| [SYSTEM_OVERVIEW](./SYSTEM_OVERVIEW.md) | Зачем система, какие слои, что не входит в scope |
| [DATA_FLOOU](./DATA_FLOOU.md) | Как движутся данные от AI/клиента до storage и chain |
| [DOMAIN_MODEL](./DOMAIN_MODEL.md) | Сущности, идентификаторы, связи |
| [ENVIRONMENT](./ENVIRONMENT.md) | Env-контуры, секреты, профили |
| [DEPLOYMENT](./DEPLOYMENT.md) | Как выкатываем, smoke, откат |
| [PROJECT_INDEX](./PROJECT_INDEX.md) | Карта репозитория и entry points |

## Обязательные блоки при доработке

- **Technical decisions** — таблица: решение | альтернатива | статус.
- **Integration boundaries** — кто вызывает кого (нода ↔ uploader ↔ chain ↔ GPT).
- **Assumptions & risks** — что считаем данным «по умолчанию».
- **Hooks следующего слоя** — что сознательно отложено (ссылка на task backlog).
