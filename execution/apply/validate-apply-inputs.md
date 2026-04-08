# Execution prompt: validate-apply-inputs

**Роль:** проверить согласованность входов **перед** materialization.

## Вход

- `outputs/interview-summary.md`
- `outputs/generation-plan.md`
- Доступность `bootstrap-system/templates/` и (если заявлено) донорского репо для bundled

## Инструкции

1. **Summary ↔ plan:** `generation-plan.meta.source_summary` ссылается на тот же summary; `bootstrap_system_version` совместим (≥1.9 для scripts keys; v2.0 для apply секций).
2. **Switches:** для каждой строки `bundled_modules_to_copy` проверь соответствующий `generate.bundled_*` и `generate.apply_bundled_copy`, `apply.bundled_copy_mode`.
3. **Templates:** каждая строка `generated_templates_to_apply` имеет известный **template source** под `bootstrap-system/templates/` и корректный **target path**.
4. **Конфликты:** два разных источника на один target — см. `references/apply-validation.md` A3.
5. **Обязательные outputs:** для `new_project` применим минимум из `04-bootstrap-output-spec.md` § Apply outputs — при полном apply не оставлять пустым root docs, если `generate.docs_root`.
6. Результат: краткий чеклист OK / список кодов A* для исправления.

## Выход

- Текстовый отчёт в чате **или** секция в начале `apply-report.md` («Validation»)
