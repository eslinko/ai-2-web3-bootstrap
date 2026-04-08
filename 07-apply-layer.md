# Apply layer — v2.1 (materialize + post-apply handoff)

**Назначение:** перевести артефакты **plan** в **реальное дерево целевого репозитория** (или в dry-run отчёт), строго по SoT, без «генерации с нуля по фантазии».

**SoT:** `outputs/interview-summary.md`, `outputs/generation-plan.md`, `references/apply-rules.md`, `references/apply-validation.md`, `references/bundled-apply-rules.md`, `04-bootstrap-output-spec.md` § Apply outputs, `references/output-selection-rules.md`.

**Не является:** отдельным бинарным движком; агент в Cursor исполняет промпты из `execution/apply/`.

---

## 1. Полный apply pipeline

| # | Шаг | Действие | Артефакт / проверка |
|---|-----|----------|---------------------|
| 1 | **Read canonical summary** | Загрузить `outputs/interview-summary.md`: `generate:`, Apply strategy, Enabled layers, Decision table | Понимание switches и `apply.*` |
| 2 | **Read generation plan** | Загрузить `outputs/generation-plan.md`: `bundled_modules_to_copy`, `generated_templates_to_apply`, `optional_scaffolds_to_skip`, `excluded_items` | Список операций |
| 3 | **Resolve bundled modules to copy** | Для каждой строки plan: `source` донора существует; `generate.bundled_*` и `apply.bundled_copy_mode` допускают копирование; см. `references/bundled-apply-rules.md` | Очередь copy |
| 4 | **Resolve generated templates to apply** | Для каждой записи: шаблон в `bootstrap-system/templates/`; соответствующий `generate.* == true` | Очередь apply templates |
| 5 | **Resolve optional scaffolds to skip** | Исключить из очереди всё, что в plan помечено skip; уважать `apply.optional_scaffolds_mode` и `generate.apply_optional_scaffolds` | Финальная очередь без optional при `skip_optional` |
| 6 | **Materialize target tree** | Промпт `execution/apply/build-target-tree.md` → черновик `outputs/applied-project-structure.md`; затем копирование/запись файлов по `apply-bootstrap.md` (если не `dry_run_only`) | Файлы в целевом root |
| 7 | **Produce apply report** | `outputs/apply-report.md`: что скопировано, что применено, что пропущено, конфликты, ручные шаги | Отчёт для оператора |

**Перед шагом 6:** промпт `execution/apply/validate-apply-inputs.md`.

---

## 2. Режимы (`apply.*`)

См. `01-interview-orchestrator.md` § Apply strategy decisions и `02-interview-summary-spec.md` § Apply strategy.

- **`dry_run_only`:** только `applied-project-structure.md` + `apply-report.md` без записи в целевой репозиторий (или с явным запретом write в промпте).
- **`existing_repo`:** не создавать корень проекта с нуля; только согласованные пути; см. `apply.overwrite_policy`.
- **`new_project`:** целевой root задаёт оператор (env или первый шаг apply).

---

## 3. Связь с execution flow

После **Phase 5 — Generation plan** → **Phase 6 — Apply** (см. `06-execution-flow.md`).

---

## 4. Post-apply task emission & handoff (v2.1)

После apply фаза **не уходит в бесконечную реализацию**:

1. `execution/bullrun/emit-initial-tasks.md`
2. `execution/bullrun/create-task-indexes.md`
3. `execution/bullrun/handoff-to-bullrun-start.md`

Обязательный stop point: после создания task runway агент предлагает продолжить через `/.cursor/commands/bullrun-start.md`.

---

## 5. Версия

**v2.1** — apply + post-apply task emission/indexing + handoff.
