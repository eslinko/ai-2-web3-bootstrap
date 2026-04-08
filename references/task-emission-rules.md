# Task emission rules (v2.1)

Source of truth:

- `docs/methodology/task-standard.md`
- `docs/methodology/index-standard-bullrun-fullpower.md`

## 1. Why tasks emitted after bootstrap

После apply остаются implementation gaps, pending decisions и риск-флаги.  
Initial emission превращает bootstrap-output в task-driven runway.

## 2. Global vs local tasks

- **Global:** cross-layer задачи (SSOT docs, auth contracts, env governance).
- **Local:** задачи, ограниченные конкретным модулем/слоем.

## 3. Derivation inputs

Формировать задачи из:

- `outputs/interview-summary.md` (решения, pending, risks)
- `outputs/generation-plan.md` (что применено/пропущено)
- split bundled/generated/skip
- `outputs/apply-report.md` (конфликты/ручные follow-ups)

## 4. Atomicity rule

One task = one gap.  
Если AC/DoD покрывают разные проблемы — декомпозировать.

## 5. Avoid catch-all tasks

- Не делать “implement entire module”.
- Разбивать по вертикали: auth, mapping, validation, deployment, tests.
- Для каждого таска: конкретные файлы/команды/проверка.

## 6. Mapping to layer folders

Зона определяется owner-контекстом gap:

- runtime API → `node/docs/analysis/tasks/`
- contracts → `contracts/docs/analysis/tasks/`
- uploader → `arweave-uploader/docs/analysis/tasks/`
- wallet → `wallet/docs/analysis/tasks/`
- scripts layer → `scripts/docs/analysis/tasks/`
- GPT/instructions → `gpt/docs/analysis/tasks/` или проектный GPT-каталог
- cross-cutting → `docs/analysis/tasks/`

