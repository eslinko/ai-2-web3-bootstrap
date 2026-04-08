# Bullrun usage mode (v2.1)

## 1. Clean workspace startup

- Checkout `bootstrap-system` в чистом workspace.
- Передать агенту один файл: `BULLRUN_LAUNCH.md`.
- Агент синхронизирует контекст с canonical summary/apply/methodology.

## 2. Interview and bootstrap

- Собрать `outputs/raw-answers.yaml`.
- Сформировать `outputs/interview-summary.md`.
- Вычислить `generate:*` switches.
- Построить `outputs/generation-plan.md`.
- Выполнить apply phase (`execution/apply/*`) и получить:
  - `outputs/applied-project-structure.md`
  - `outputs/apply-report.md`

## 3. Initial task emission

- Сгенерировать **global tasks** (project-wide gaps).
- Сгенерировать **local tasks** по модулям/слоям.
- Формат task-файлов строго по `docs/methodology/task-standard.md`.

## 4. Index creation

- Создать/обновить тематические индексы по зонам.
- Формат индексов по `docs/methodology/index-standard-bullrun-fullpower.md`.
- Индекс хранит метаданные/ссылки, а не дубли задач.

## 5. Handoff to task-driven continuation

- Агент сообщает stop point после bootstrap + emission.
- Перечисляет созданные task zones и индексы.
- Предлагает продолжать через `/.cursor/commands/bullrun-start.md`.
- Глубокую реализацию автоматически не запускает.

