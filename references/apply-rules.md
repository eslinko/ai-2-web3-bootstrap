# Apply rules (bootstrap-system v2.0)

Правила **применения** plan к целевому дереву. Дополняют `references/bundled-code-placement-rules.md` и `references/output-selection-rules.md`.

---

## 1. Copy vs generate

| Операция | Источник | Когда |
|----------|---------|--------|
| **Copy (bundled)** | Донорский путь из `generation-plan.md` → `bundled_modules_to_copy` | `generate.bundled_wallet_mock_runner` / `generate.bundled_arweave_uploader` **и** `generate.apply_bundled_copy` **и** `apply.bundled_copy_mode = copy_enabled` |
| **Generate (template)** | `bootstrap-system/templates/**` | Строка в `generated_templates_to_apply` **и** соответствующий `generate.* == true` |
| **Skip** | — | Запись в `optional_scaffolds_to_skip` **или** `generate.* == false` **или** режим `skip_optional` для optional |

**Не считать «генерацией»:** копирование bundled as is — это **copy**, не render шаблона.

---

## 2. Overwrite policy

| `apply.overwrite_policy` | Поведение |
|--------------------------|-----------|
| `safe_no_overwrite` | Если целевой файл существует — **не** перезаписывать; зафиксировать в `apply-report.md` как conflict avoided |
| `replace_generated_only` | Перезаписывать только файлы, помеченные в plan как **generated** (bootstrap templates); bundled copy — не ломать существующий модуль без явного указания оператора |
| `defined_later` | Не применять автоматически; только отчёт и список ручных действий |

В режиме **`existing_repo`** при `safe_no_overwrite` обязательна сверка с оператором для любых пересечений путей.

---

## 3. Skip policy

- Всё из **`optional_scaffolds_to_skip`** не копировать из templates, даже если папка существует в `templates/`.
- **`apply.optional_scaffolds_mode = skip_optional`:** не включать optional scaffold строки plan (uploader `src/**` stubs и т.д.), если они помечены optional.
- **`include_optional`:** применять optional только если `generate.apply_optional_scaffolds == true` и plan явно включает строку.

---

## 4. Naming policy

- Целевые пути **как в `generation-plan.md`**; отклонения только по triage в summary с фиксацией в report.
- Имена каталогов bundled: по умолчанию `wallet/mock-runner/`, `arweave-uploader/` (см. `bundled-code-placement-rules.md`).

---

## 5. Folder placement policy

- **Docs:** из `templates/docs/<layer>/` → целевой `docs/<layer>/` или согласованное зеркало в plan.
- **Env:** `templates/env/*.example` → целевой путь в plan (часто `env/` или корень репо — зафиксировать один раз).
- **Code templates:** `templates/code/**` → целевой корень проекта, сохраняя относительную структуру подкаталогов.
- **Bundled:** точное зеркало подкаталога эталона в `target` из plan.

---

## 6. Coexistence bundled + generated

- Сначала **copy bundled** (если включено), затем **apply generated** docs/env рядом — не перезаписывать файлы внутри скопированного bundled пакета, кроме явно перечисленных в plan **overlay** (если когда-либо появится; по умолчанию — нет).
- Сгенерированные `docs/wallet` и `docs/arweave-uploader` **рядом** с деревьями кода, не внутри `wallet/mock-runner` (кроме README эталона).

---

## 7. Dry run

При `apply.target_mode = dry_run_only`: выполнить validate + `build-target-tree` + заполнить `apply-report.md` без записи файлов (или с симуляцией в чате).
