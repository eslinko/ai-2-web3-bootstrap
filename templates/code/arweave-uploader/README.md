# Arweave uploader — templates (v1.8)

## Primary path: bundled module

При **`uploader.delivery_mode = bundled_module`** (default) в новый проект копируется **эталонный** пакет **`arweave-uploader/`** целиком. Конфигурация и поведение — через **env** и согласование **payload/callback** с нодой; ядро сервиса на prototype stage **не реконструировать** по файлам из этого шаблона.

См. `templates/docs/arweave-uploader/BUNDLED_MODULE_NOTES.md`, `references/uploader-bundled-transition-notes.md`.

## Secondary (optional): pipeline stubs в `src/**`

Подкаталоги `src/ingest`, `auth`, `verification`, `payload`, `publish`, `callback` — **декомпозиция для объяснения границ** и резервный путь **`scaffold_only`**. Они **не** заменяют копирование эталона, если выбран bundled mode.

Включение этих файлов в генерацию — флаг **`generate.code_uploader_scaffold_helpers`** (см. `02-interview-summary-spec.md`, `execution/compute-switches.md`).

## Прочее в этом шаблоне

- `src/server.mjs`, `package.json` — могут использоваться только в режиме **scaffold_only** или как ориентир; при **bundled_module** ориентируйтесь на эталонный репозиторий.
