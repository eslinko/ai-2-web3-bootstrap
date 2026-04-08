# Bullrun usage integration (v2.1)

## 1. Fresh workspace → bootstrap session

- Оператор открывает чистый workspace.
- Передаёт агенту `BULLRUN_LAUNCH.md`.
- Агент выполняет planning/apply pipeline по `06` и `07`.

## 2. Bootstrap session → applied project

- `interview-summary.md` + `generation-plan.md` + apply prompts.
- Bundled copy / template apply / optional skips фиксируются в `apply-report.md`.

## 3. Applied project → task-driven workspace

- `emit-initial-tasks.md` создаёт task-файлы по task-standard.
- `create-task-indexes.md` создаёт/обновляет `*-index.md` по index-standard.

## 4. Артефакты до handoff

- `outputs/interview-summary.md`
- `outputs/generation-plan.md`
- `outputs/apply-report.md`
- `outputs/applied-project-structure.md`
- `outputs/initial-task-emission.md`
- `outputs/task-indexes-created.md`

## 5. Что остаётся оператору после handoff

- Запуск следующего режима через `/.cursor/commands/bullrun-start.md`.
- Исполнение задач по фазам run-task/run-phase.
- Реальная имплементация, тесты, коммиты, релизные действия.

