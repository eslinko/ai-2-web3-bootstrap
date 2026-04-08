# Optional pipeline scaffold (secondary)

Подпапки `ingest/`, `auth/`, `verification/`, `payload/`, `publish/`, `callback/` содержат **README и stub-файлы**, чтобы явно показать этапы uploader-слоя (ingest → trust → verification → publish → callback).

## Когда использовать

- `uploader.delivery_mode = scaffold_only`, **или**
- `generate.code_uploader_scaffold_helpers = true` **рядом** с копией эталона (обучение/документирование границ).

## Когда не использовать как primary

- `uploader.delivery_mode = bundled_module` **и** `code_uploader_scaffold_helpers = false` — в проект кладётся **только** эталонный `arweave-uploader/`, без подмены его внутренностей этим деревом.

См. корневой `README.md` пакета шаблона и `references/bundled-modules-strategy.md`.
