# Execution flow — v2.1 (interpreter pipeline + apply + bullrun usage handoff)

**Назначение:** связать `01` → `02` → матрицу → `04` → **materialization** в **процедуру без отдельного runtime-движка**: агент в Cursor исполняет шаги по промптам `execution/*.md` и **`execution/apply/*.md`**.

**Не является:** бинарным CLI; копирование файлов выполняет агент вручную/инструментами IDE по промптам apply.

---

## Phase 1 — Interview execution

| Шаг | Действие агента | Артефакт |
|-----|-----------------|----------|
| 1.1 | Загрузить `01-interview-orchestrator.md`, пройти блоки по порядку; пропускать вопросы для выключенных слоёв | Вопросы в чате / пошагово |
| 1.2 | Записывать ответы в **structured raw** формат (YAML) — см. §6.1 в `01` | `outputs/raw-answers.yaml` (рекомендуется) или эквивалент в конце чата |
| 1.3 | Проверить обязательные ключи (`01` §6.2) | Список missing → доопрос или default по `execution-validation.md` |

**Промпт:** `execution/run-interview.md`.

---

## Phase 2 — Summary synthesis

| Шаг | Действие | Артефакт |
|-----|----------|----------|
| 2.1 | Вход: raw answers | — |
| 2.2 | Заполнить секции `02-interview-summary-spec.md`: Meta, Enabled layers, **Apply strategy**, Excluded, Decision table, Mandatory*, Vision | `outputs/interview-summary.md` |
| 2.3 | Пока **без** финального блока `generate:` (или с пустыми значениями) | тот же файл |

**Промпт:** `execution/build-summary.md`.

---

## Phase 3 — Switch computation

| Шаг | Действие | Артефакт |
|-----|----------|----------|
| 3.1 | Вход: `interview-summary.md` (решения + слои) | — |
| 3.2 | Для каждого ключа `generate.*` выставить boolean по правилам `output-selection-rules.md` и матрице | блок YAML в summary |
| 3.3 | Применить **derived** правила (`keys_readme`, uploader, scripts, **apply_***, … — см. `execution/compute-switches.md`) | обновлённый `generate:` |
| 3.4 | Прогнать **contradiction** + `execution-validation.md` | при ошибке → уточнение или stop |
| 3.5 | Missing values: default из validation doc | заполнено |

**Промпт:** `execution/compute-switches.md`.

**Обязательные поля `generate.*`:** все ключи из `02-interview-summary-spec.md` (включая **apply_bundled_copy**, **apply_optional_scaffolds**).

---

## Phase 4 — Output selection

| Шаг | Действие | Результат |
|-----|----------|-----------|
| 4.1 | Для каждого `generate.* == true` сопоставить путь в `templates/` | список путей шаблонов |
| 4.2 | Учесть `docs_depth` (minimal → урезать необязательные docs по `output-selection-rules.md`) | скорректированный список |
| 4.3 | Исключить шаблоны для `false` слоёв | explicit excluded list |

Логика: `references/bootstrap-decision-matrix.md` + `references/output-selection-rules.md`.

---

## Phase 5 — Generation plan (без создания файлов проекта)

| Шаг | Действие | Артефакт |
|-----|----------|----------|
| 5.1 | Собрать план: **bundled_modules_to_copy**, **generated_templates_to_apply**, **optional_scaffolds_to_skip**, **excluded_items** | `outputs/generation-plan.md` |
| 5.2 | Не копировать файлы в целевой репозиторий — только план | — |
| 5.3 | Валидировать строки plan на полноту колонок (v2.0 формат) | правки plan |

**Промпт:** `execution/plan-bootstrap.md`.

---

## Phase 6 — Apply (materialize target project)

| Шаг | Действие | Артефакт |
|-----|----------|----------|
| 6.1 | `execution/apply/validate-apply-inputs.md` | отчёт валидации |
| 6.2 | `execution/apply/build-target-tree.md` → `outputs/applied-project-structure.md` | черновик дерева |
| 6.3 | `execution/apply/apply-bootstrap.md` — copy bundled + apply templates (если не `dry_run_only`) | файлы в target root |
| 6.4 | Заполнить `outputs/apply-report.md` | отчёт apply |

Канон: **`07-apply-layer.md`**, **`references/apply-rules.md`**, **`references/apply-validation.md`**.

---

## Phase 7 — Post-apply task emission & handoff

| Шаг | Действие | Артефакт |
|-----|----------|----------|
| 7.1 | `execution/bullrun/emit-initial-tasks.md` | task-файлы по зонам |
| 7.2 | `execution/bullrun/create-task-indexes.md` | обновлённые `*-index.md` + `outputs/task-indexes-created.md` |
| 7.3 | `execution/bullrun/handoff-to-bullrun-start.md` | stop point и handoff |

Канон: `BULLRUN_LAUNCH.md`, `08-bullrun-usage-mode.md`, `references/task-emission-rules.md`, `references/task-indexing-bridge.md`.

---

## Диаграмма

```text
run-interview → raw-answers.yaml
     ↓
build-summary → interview-summary.md (без switches)
     ↓
compute-switches → interview-summary.md (generate: заполнен)
     ↓
plan-bootstrap → generation-plan.md
     ↓
validate-apply-inputs → build-target-tree → apply-bootstrap
     ↓
apply-report.md + (опц.) файлы целевого проекта
     ↓
emit-initial-tasks → create-task-indexes → handoff-to-bullrun-start
     ↓
stop + continue via /.cursor/commands/bullrun-start.md
```

---

## Версия

**v2.1** — usage mode: Phase 7 (task emission + indexing + handoff к `bullrun-start.md`).
