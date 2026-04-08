# Bundled code placement rules (v2.0)

## 1. Куда класть bundled wallet module

- **Целевой путь в новом проекте:** `wallet/mock-runner/` (или согласованный аналог в корне репозитория; зафиксировать в `generation-plan.md`).
- **Источник:** рабочее дерево эталона (например `wallet/mock-runner/` в донорском монорепо), не `templates/code/wallet/*.stub` — stubs в bootstrap остаются **вторичным** путём.
- Рядом: `docs/wallet/**` из шаблонов bootstrap (обзор, runtime, ограничения).

## 2. Куда класть bundled uploader module

- **Целевой путь:** `arweave-uploader/` в корне проекта (как в эталоне), unless triage задаёт другое имя.
- **Источник:** пакет эталона **целиком** (исходники или проверенный артефакт сборки — по политике команды; зафиксировать в plan notes).
- Рядом: `templates/docs/arweave-uploader/*` как **сгенерированные/скопированные** docs в `docs/arweave-uploader/`, плюс `BUNDLED_MODULE_NOTES.md`.

## 3. Какие README/notes должны идти рядом

- В **корне модуля** (после копирования): сохранить README эталона; при необходимости добавить `INTEGRATION.md` из generation-plan (коротко: env, порты, зависимости от ноды).
- В **bootstrap templates:** `templates/code/wallet/README.md`, `templates/code/wallet/mock-runner/README.md` — как инструкция «что копировать», а не как полная реализация.

## 4. Какие env files должны идти рядом

- `templates/env/wallet-mock.env.example` → проектный `env/wallet-mock.env.example` (или согласованный путь).
- `templates/env/arweave.env.example` → проектный фрагмент env для uploader.
- `templates/env/shared-vars-catalog.md` — агрегирует **классы** переменных между нодой, uploader, wallet (без значений секретов).

## 5. Что считается code copied as is

- Все файлы выбранного **bundled** пакета эталона для wallet-runner и arweave-uploader, кроме явно исключённых triage-паттернов (ключи, бэкапы, локальные `.env`).
- Версии `package.json` / lockfile переносятся **как в эталоне** до следующего осознанного обновления.

## 6. Что считается generated around bundled modules

- Документация bootstrap: `docs/wallet/*`, `docs/arweave-uploader/*` (архитектура Floou, bundled notes, ограничения).
- Фрагменты root/node docs, связывающие DATA_FLOOU с реальными путями сервисов.
- Чеклисты в `outputs/generation-plan.md` и задачи Phase 0–2 в `task-backlog`.
- **Optional:** подкаталог `templates/code/arweave-uploader/src/**` как объяснение границ pipeline — не подменяет собой копирование эталона при `uploader.delivery_mode = bundled_module`.

## 7. Когда bundled mode запрещён

- Политика безопасности / аудит: «нельзя переносить неаудированный эталонный код».
- Проект **не** использует отдельный uploader-сервис (`layer.arweave_uploader = false` и контур в ноде-only) — тогда uploader bundled не выбирается.
- Wallet **не** нужен в репо (`wallet.layer_mode = none`) — не копировать mock-runner.

## 8. Apply phase (v2.0)

- Строки **`bundled_modules_to_copy`** обязаны содержать **source**, **target**, **reason**, **required switches** перед apply.
- Фактическое копирование: только если **`generate.apply_bundled_copy`** и `apply.bundled_copy_mode = copy_enabled` (см. `references/bundled-apply-rules.md`).
- После copy — сгенерированные docs/env **рядом** с модулями по plan, без перезаписи ядра bundled без явного overlay в plan.
