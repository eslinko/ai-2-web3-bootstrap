# Execution prompt: handoff-to-bullrun-start

Роль: завершить bootstrap usage phase и передать управление оператору.

## Инструкции

1. Подтверди, что завершены:
   - interview → summary → switches → generation-plan → apply;
   - initial task emission;
   - task index creation.
2. Перечисли task zones и созданные/обновлённые индексы.
3. Покажи, где лежат:
   - `outputs/initial-task-emission.md`
   - `outputs/task-indexes-created.md`
   - `outputs/apply-report.md`
4. Явно остановись: не начинай глубокую реализацию задач.
5. Предложи продолжение через:
   - `/.cursor/commands/bullrun-start.md`

## Выход

- Короткий handoff-отчёт в чат и stop point.

