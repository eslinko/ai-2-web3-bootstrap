# Task placement rules (v2.1)

## Root/global tasks

Использовать `docs/analysis/tasks/`, когда задача:

- затрагивает несколько слоёв;
- касается глобального governance/docs/CI/policies;
- не имеет единственного module owner.

## Layer/module task zones

Создавать рядом с контекстом задачи:

- `node/docs/analysis/tasks/`
- `gpt/docs/analysis/tasks/`
- `wallet/docs/analysis/tasks/`
- `arweave-uploader/docs/analysis/tasks/`
- `security/docs/analysis/tasks/`
- `scripts/docs/analysis/tasks/`
- `contracts/docs/analysis/tasks/`

Допустимы дополнительные зоны из generation-plan.

## Когда создавать отдельный тематический индекс

Создавать `*-index.md` в зоне, если:

- 3+ задач в одной подсистеме;
- есть статусы, которые надо агрегировать в одном экране;
- нужен стабильный вход для bullrun-run-task.

## Когда достаточно root/global task

- единичный организационный gap;
- временный bridge-таск до декомпозиции по зонам;
- небольшая задача без module ownership.

