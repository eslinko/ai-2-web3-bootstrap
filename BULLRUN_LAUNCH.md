# BULLRUN launch entrypoint (v2.1 usage mode)

Ты находишься в **fresh workspace** с checkout `bootstrap-system`.

## Что прочитать сначала (SoT)

1. `outputs/interview-summary.md` (canonical skeleton)
2. `06-execution-flow.md`
3. `07-apply-layer.md`
4. `docs/methodology/task-standard.md`
5. `docs/methodology/index-standard-bullrun-fullpower.md`

## Обязательный pipeline

1. Interview (`execution/run-interview.md`)
2. Summary (`execution/build-summary.md`)
3. Switches (`execution/compute-switches.md`)
4. Generation plan (`execution/plan-bootstrap.md`)
5. Apply (`execution/apply/*`)
6. Initial task emission (`execution/bullrun/emit-initial-tasks.md`)
7. Task index creation (`execution/bullrun/create-task-indexes.md`)
8. Handoff (`execution/bullrun/handoff-to-bullrun-start.md`)

## Критичные ограничения

- Не запускать глубокую реализацию после bootstrap.
- One task = one gap.
- Index = aggregator only (без дублирования постановок).
- Задачи раскладывать по контекстным зонам `*/docs/analysis/tasks/`, а не в один глобальный backlog.

## Stop point

После создания initial tasks + indexes агент **останавливается** и предлагает продолжить через:

- `/.cursor/commands/bullrun-start.md`

