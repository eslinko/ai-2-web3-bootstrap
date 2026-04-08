# Bundled modules — apply rules (v2.0)

Дополнение к `references/bundled-modules-strategy.md` и `references/bundled-code-placement-rules.md` с фокусом на **фазу apply**.

---

## 1. Когда bundled реально копируются

Одновременно:

- В `interview-summary.md`: `generate.bundled_wallet_mock_runner` или `generate.bundled_arweave_uploader` = `true` (после compute-switches).
- В summary / plan: `apply.bundled_copy_mode = copy_enabled` и `generate.apply_bundled_copy = true`.
- В `generation-plan.md` есть строка в **`bundled_modules_to_copy`** с валидным **source** на эталон.
- `apply.target_mode` не `dry_run_only` **или** dry-run только строит отчёт без записи.

## 2. Когда только в плане / отчёте, без копирования

- `apply.bundled_copy_mode = copy_disabled` (например политика «не копировать неаудированный код»).
- `dry_run_only` — копирование не выполняется; в report статус **planned, not executed**.
- Отсутствует донорский путь — строка остаётся в plan как **intent** до указания оператором source.

## 3. Пути назначения

- Берутся из **`generation-plan.md`** (таблица bundled); default см. placement rules: `wallet/mock-runner/`, `arweave-uploader/`.
- Нормализовать trailing slashes; не вкладывать один модуль внутрь другого без явной строки plan.

## 4. Coexistence с generated docs/env

- **Порядок apply:** (1) создать родительские каталоги, (2) **bundled copy**, (3) **templates** docs/env/code вне корня пакетов bundled (unless plan says otherwise).
- Env examples могут ссылаться на относительные пути модулей — согласовать в `shared-vars-catalog` при генерации.

## 5. Успешный bundled apply

- Целевой `target` содержит ожидаемое дерево (ключевые файлы из эталона присутствуют).
- Секреты эталона (`.env`, ключи) **не** скопированы — см. triage `donor_residue_ignore`.
- В `apply-report.md` строки: модуль, source ref, target, результат.

## 6. Допустимые post-apply ручные действия

- `npm install` / `pip install` внутри скопированных пакетов.
- Заполнение `.env` из `*.env.example`.
- Привязка донорского commit/tag в README проекта.
- Настройка CI **вне** минимального apply scope.
