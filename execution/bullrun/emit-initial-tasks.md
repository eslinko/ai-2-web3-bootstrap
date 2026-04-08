# Execution prompt: emit-initial-tasks

Роль: после apply сформировать стартовый task runway.

## Вход

- `outputs/interview-summary.md`
- `outputs/generation-plan.md`
- `outputs/apply-report.md`
- `references/task-emission-rules.md`
- `references/task-placement-rules.md`
- `docs/methodology/task-standard.md`

## Инструкции

1. Выдели initial gaps из summary/plan/apply-report.
2. Декомпозируй по правилу **one task = one gap**.
3. Для каждого gap создай task-файл с именем `task-<type>-<slug>.md`.
4. Заполняй обязательные секции task-standard: цель, факты из кода, gap, AC/DoD, где менять, план, команды проверки.
5. Разложи файлы по контекстным зонам `*/docs/analysis/tasks/` по `task-placement-rules.md`.
6. Обнови `outputs/initial-task-emission.md`:
   - список созданных task-файлов;
   - global vs local split;
   - pending decisions → tasks;
   - risk flags → tasks.

## Выход

- Созданные task-файлы в целевых зонах.
- Обновлённый `outputs/initial-task-emission.md`.

