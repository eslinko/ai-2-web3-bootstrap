# Apply layer — интеграция (v2.0)

## Как plan превращается в проект

1. **`outputs/interview-summary.md`** фиксирует решения и **`generate:`** + **Apply strategy**.
2. **`execution/plan-bootstrap.md`** заполняет **`outputs/generation-plan.md`** таблицами: bundled rows, template rows, skips, excluded.
3. **`validate-apply-inputs`** проверяет согласованность.
4. **`build-target-tree`** пишет **`outputs/applied-project-structure.md`**.
5. **`apply-bootstrap`** копирует bundled и применяет шаблоны → целевой root; итог — **`outputs/apply-report.md`**.

## Что копируется

- **`wallet/mock-runner`**, **`arweave-uploader/`** — если switches и `apply.bundled_copy_mode` разрешают; источник — донор, не `templates/`.

## Что генерируется

- Docs, env examples, optional code scaffolds (node, contracts, scripts, security, GPT boundaries) из **`bootstrap-system/templates/`** по строкам plan и `generate.*`.

## Что пропускается

- Строки **`optional_scaffolds_to_skip`** и всё с `generate.* = false`.
- При **`skip_optional`** — optional uploader stubs и аналоги.

## Ограничения

- Нет отдельного исполняемого **engine** в репозитории — только промпты для агента Cursor.
- Донорский путь для bundled должен быть доступен среде оператора.

## Что остаётся ручным после apply

- Установка зависимостей, секреты, CI, первый deploy, согласование OpenAPI, наполнение GPT instructions, правки доменной логики.

См. **`07-apply-layer.md`**, **`references/apply-rules.md`**, **`references/bundled-apply-rules.md`**.
