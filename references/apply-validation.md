# Apply validation (errors apply phase)

Коды для агента на шагах **`validate-apply-inputs`** и **`apply-bootstrap`**. Не заменяют `execution-validation.md` для interview/switches.

---

## 1. Классы ошибок

| Код | Условие | Реакция |
|-----|---------|---------|
| A1 **missing_bundled_source** | Строка `bundled_modules_to_copy` указывает путь, недоступный агенту (нет донора) | Stop; попросить оператора указать корректный source или убрать строку из plan |
| A2 **missing_template** | `generated_templates_to_apply` ссылается на файл/папку, отсутствующую в `bootstrap-system/templates/` | Stop или исключить строку с Risk в report |
| A3 **conflicting_target_paths** | Два действия пишут один и тот же целевой файл разным содержимым | Stop при `safe_no_overwrite`; иначе разрулить порядком: bundled до generated с правилом non-overwrite внутри bundled |
| A4 **plan_missing_required_row** | `generate.foo == true`, но в plan нет соответствующей строки/чеклиста | Warning + дополнить plan **или** ослабить switch (согласовать с оператором) |
| A5 **bundled_disallowed** | В plan есть bundled copy, но `generate.bundled_arweave_uploader = false` (и аналогично wallet) или `apply.bundled_copy_mode = copy_disabled` | Удалить операцию из очереди; зафиксировать в report |
| A6 **template_switch_false** | В plan строка «применить template X», но `generate.*` для X = false | Не применять; A4 если это единственный источник для обязательного output |
| A7 **existing_repo_unsafe** | `apply.target_mode = existing_repo` и пересечение с непустыми путями при `safe_no_overwrite` | Список коллизий в report; не перезаписывать |
| A8 **dry_run_expected** | Режим `dry_run_only`, но агент пытается писать файлы | Запретить write; только отчёты |

---

## 2. Минимальные проверки согласованности

1. `interview-summary.md` содержит полный блок `generate:` (v1.9+).
2. `generation-plan.meta.source_summary` указывает на актуальный summary.
3. Для каждой строки bundled: присутствуют **source**, **target**, **reason**, **required switches** (см. обновлённый шаблон plan).
4. `excluded_items` из plan не противоречит обязательным секциям `04-bootstrap-output-spec.md` для выбранного режима.

---

## 3. После успешного apply

Обновить `outputs/apply-report.md`; при необходимости — `outputs/applied-project-structure.md` как snapshot «как получилось».
