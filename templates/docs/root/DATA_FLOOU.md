# Data Floou — {{PROJECT_NAME}}

Опишите **сквозные потоки** данных. Эталон: draft → prepare → cache → wallet sign → crystalize → callback (см. `references/data-floou-patterns.md`).

## 1. Поток A: (имя, напр. Activity / контент)

| Шаг | Компонент | Вход | Выход | Синхронно/асинхронно |
|-----|-----------|------|-------|----------------------|
| 1 | | | | |
| 2 | | | | |

**Корреляционный id:** `upload_id` / другое: ___

## 2. Поток B: (напр. каталог / продукты)

…

## 3. Форматы обмена

- JSON схемы: ссылка на OpenAPI / путь к файлу.
- Бинарные payload: кто подписывает, где хранится кэш.

## 4. Integration boundaries

| От | К | Протокол | Auth |
|----|---|----------|------|
| GPT | Нода | HTTPS | Bearer `GPT_ACTIONS_*` |
| Uploader | Нода | HTTPS | Bearer shared secret |
| Нода | Chain | JSON-RPC | ключ в `keys/` / Vault |

## 5. Риски рассинхрона

- Mock vs real Arweave
- Расхождение OpenAPI и фактических роутов

## 6. Следующие шаги (hooks)

- …
