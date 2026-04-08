# Execution prompt: apply-bootstrap

**Роль:** материализовать целевое дерево проекта по **каноническому** summary и **generation-plan**.

## Вход

- `outputs/interview-summary.md` (полный, с `generate:` и секциями Apply)
- `outputs/generation-plan.md`
- Целевой root: от оператора (path) **или** только отчёты при `apply.target_mode = dry_run_only`
- `references/apply-rules.md`, `references/bundled-apply-rules.md`, `references/apply-validation.md`

## Инструкции

1. Выполни **`execution/apply/validate-apply-inputs.md`**; при A1/A2 критичных — stop.
2. Выполни **`execution/apply/build-target-tree.md`**; обнови/создай `outputs/applied-project-structure.md`.
3. Если **`dry_run_only`:** заполни `outputs/apply-report.md` (planned operations only), **не** пиши файлы в целевой репозиторий.
4. Иначе, в порядке:
   - Создай недостающие каталоги целевого root.
   - **Bundled:** для каждой строки `bundled_modules_to_copy` при выполненных условиях copy (см. `bundled-apply-rules.md`) — скопируй дерево source → target; уважай `apply.overwrite_policy`.
   - **Templates:** для каждой строки `generated_templates_to_apply` с `generate.*` = true — скопируй/адаптируй файлы из `bootstrap-system/templates/` в целевые пути plan; снимай суффиксы `.stub`/`.template` по правилам слоя (scripts и т.д.) если указано в plan notes.
   - **Не включай** пути из `optional_scaffolds_to_skip` если режим `skip_optional` или switch optional false.
5. Заполни **`outputs/apply-report.md`:** copied, generated, skipped, conflicts prevented, manual follow-ups.
6. Не создавай доменную логику «с нуля» — только plan + templates + bundled.
7. После успешного apply переходи в post-apply usage pipeline:
   - `execution/bullrun/emit-initial-tasks.md`
   - `execution/bullrun/create-task-indexes.md`
   - `execution/bullrun/handoff-to-bullrun-start.md`

## Выход

- Обновлённые `outputs/apply-report.md`, `outputs/applied-project-structure.md`
- Файлы в целевом проекте (если не dry run)
