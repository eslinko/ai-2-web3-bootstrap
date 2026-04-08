# Execution prompt: create-task-indexes

Роль: создать/обновить тематические индексы задач после initial emission.

## Вход

- task-файлы в `*/docs/analysis/tasks/`
- `outputs/initial-task-emission.md`
- `references/task-indexing-bridge.md`
- `docs/methodology/index-standard-bullrun-fullpower.md`

## Инструкции

1. Найди существующие `*-index.md` в `*/docs/analysis/`.
2. Если индекс зоны отсутствует — создай новый по стандарту.
3. Если индекс есть — добавь строки в нужные секции.
4. Используй формат таблицы: `S | Key | Task | Type | Status | Scope / Notes`.
5. Стартовый статус: `⚪` (Todo), если нет явного прогресса.
6. Индекс не дублирует текст задач — только ссылка и метаданные.
7. Обнови `outputs/task-indexes-created.md`:
   - какие индексы созданы;
   - какие обновлены;
   - какие секции добавлены;
   - какие key назначены.

## Выход

- Актуальные task-index файлы.
- Обновлённый `outputs/task-indexes-created.md`.

