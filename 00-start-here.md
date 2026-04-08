# Bootstrap system — старт здесь

Набор артефактов для **interview-driven bootstrap** новых проектов на базе паттернов, извлечённых из Amanita Protocol (см. `docs/architecture-extraction/`).

**Версия:** **v2.1** — см. `CHANGELOG.md`.

## Execution pipeline (v2.1)

Исполняется **Cursor-агентом** по документам (без отдельного движка):

1. **`06-execution-flow.md`** — обзор фаз.
2. **`execution/run-interview.md`** → `outputs/raw-answers.yaml`
3. **`execution/build-summary.md`** → `outputs/interview-summary.md`
4. **`execution/compute-switches.md`** → дополняет `generate:` в summary
5. **`execution/plan-bootstrap.md`** → `outputs/generation-plan.md`
6. **Apply (materialization):** **`07-apply-layer.md`** → `execution/apply/validate-apply-inputs.md` → `build-target-tree.md` → `apply-bootstrap.md` → `outputs/apply-report.md`
7. **Usage handoff:** `execution/bullrun/emit-initial-tasks.md` → `create-task-indexes.md` → `handoff-to-bullrun-start.md`

Валидация: **`references/execution-validation.md`**, **`references/apply-validation.md`** (фаза apply).

Слой решений: матрица `references/bootstrap-decision-matrix.md`, `references/output-selection-rules.md`, `03`, `04`, `05`.  
Mock wallet (Floou signing client): `references/mock-wallet-pattern.md`.  
Security contours: `references/security-architecture.md`, `references/security-crypto-inventory.md`.
GPT contours: `references/gpt-architecture-extraction.md`, `references/gpt-abstraction-rules.md`.  
Uploader layer (Floou / controlled Arweave ingress): `references/arweave-uploader-architecture-extraction.md`, `references/arweave-uploader-abstraction-rules.md`, `references/uploader-bundled-transition-notes.md`.  
**Bundled prototype modules:** `references/bundled-modules-strategy.md`, `references/bundled-code-placement-rules.md`, `references/wallet-bundled-prototype.md`, `outputs/bundled-modules-transition.md`.  
**Scripts layer (mixed scaffold):** `references/scripts-layer-strategy.md`, `references/scripts-abstraction-rules.md`, `outputs/scripts-layer-integration.md`.  
**Apply layer:** `07-apply-layer.md`, `references/apply-rules.md`, `outputs/apply-layer-integration.md`.  
**Bullrun usage mode:** `BULLRUN_LAUNCH.md`, `08-bullrun-usage-mode.md`, `references/task-emission-rules.md`, `references/task-indexing-bridge.md`, `outputs/bullrun-usage-integration.md`.

## Порядок работы (классический + execution)

1. Прочитать **`references/architecture-pattern.md`**.
2. Запустить pipeline по **`06-execution-flow.md`** и промптам в **`execution/`**.
3. Далее: **`03-task-generator.md`** → `outputs/task-backlog.md`; применение шаблонов — вручную или отдельным шагом по **`outputs/generation-plan.md`**.
4. Индекс проекта: **`05-project-index-rules.md`**.

## Внешние методологии

- **`task-standard`** (вне репозитория) — формат описания таска.
- **`bullrun`** — индексатор/оркестрация тасков.

## Связь с экстракцией

Исходная карта: `docs/architecture-extraction/00-index.md`.  
Подозрительные пути: `references/suspicious-files-triage.md`.

## Каталог

| Путь | Назначение |
|------|------------|
| `06-execution-flow.md` | Interpreter pipeline v2.1 |
| `execution/` | Промпты исполнения |
| `references/` | Паттерны, матрица, validation, output rules |
| `templates/` | Деревья, env, docs, code |
| `outputs/` | interview-summary, generation-plan, raw-answers, task-backlog, … |
