# Execution prompt: plan-bootstrap

**Роль:** построить **только план** генерации без копирования файлов в целевой проект.

## Вход

- `outputs/interview-summary.md` (с заполненным `generate:`)
- `04-bootstrap-output-spec.md`
- `references/bootstrap-decision-matrix.md`

## Инструкции для агента

1. Для каждого ключа `generate.* == true` сопоставь каталоги шаблонов:
   - `docs_root` → `templates/docs/root/*`
   - `docs_node` → `templates/docs/node/*`
   - аналогично для contracts, custom-gpt, arweave, tasks
   - `docs_wallet` → `templates/docs/wallet/*` (OVERVIEW, RUNTIME, COMPANION, LIMITATIONS — см. `templates/docs/wallet/README.md`)
   - `bundled_wallet_mock_runner` → **не** из templates: зафиксировать **путь эталона** `wallet/mock-runner/**` в `bundled_modules_to_copy` (`references/bundled-code-placement-rules.md`)
   - `docs_gpt_architecture` / `docs_gpt_rulebook` / `docs_gpt_output_contract` → `templates/docs/gpt/*`
   - `docs_security` → `templates/docs/security/*`
   - `docs_uploader_architecture` / `docs_uploader_contract` / `docs_uploader_callback` → `templates/docs/arweave-uploader/*` (см. `output-selection-rules` §8 — не все файлы при minimal)
   - `code_wallet_mock` → при **bundled**: запись в `bundled_modules_to_copy` (эталон); опционально secondary `templates/code/wallet/**` (stubs-only note в plan)
   - `code_gpt_contracts` → `templates/code/node/src/domain/contracts/gpt_payload/**`
   - `code_gpt_service_mapping` → `templates/code/node/services/{gpt_ingest,gpt_validation,gpt_mapping}/**`
   - `code_security` → `templates/code/node/**/security*` + `templates/code/node/services/{signing,auth}/**`
   - `bundled_arweave_uploader` → эталонный каталог `arweave-uploader/**` в `bundled_modules_to_copy` (default при `uploader.delivery_mode = bundled_module`)
   - `code_uploader_ingest` … `callback` → **только если** `generate.code_uploader_scaffold_helpers = true` → `templates/code/arweave-uploader/src/**` (+ `OPTIONAL_SCAFFOLD_README.md`)
   - `env_wallet_mock` → `templates/env/wallet-mock.env.example` (+ при необходимости строки в `shared-vars-catalog.md`)
   - `env_security` → `templates/env/security.env.example`
   - `docs_scripts_architecture` / runbook → `templates/docs/scripts/*` (по switches; при `minimal` docs depth — подмножество)
   - `code_scripts_router` → `templates/code/scripts/router/**`
   - `code_scripts_helpers` → `templates/code/scripts/config/**`, `templates/code/scripts/lib/**`
   - `code_scripts_shell_glue` → `templates/code/scripts/shell/**`
   - `code_scripts_validators` → `templates/code/scripts/validators/**`
   - `code_scripts_smoke` → `templates/code/scripts/deploy/floou_health_smoke.sh`
   - `docs_deployment_spec` / `scripts_json_spec` → `templates/code/scripts/deployment/**` (README + пример JSON при необходимости)
   - `env_scripts` → `templates/env/scripts.env.example`
   - остальные `code_*` → `templates/code/<module>/**`
   - остальные `env_*` → `templates/env/<file>`
2. Заполни **`bundled_modules_to_copy`** таблицей: для **каждой** строки обязательны колонки **source path** (донор), **target path**, **reason**, **required decisions/switches** (например `generate.bundled_wallet_mock_runner`, `generate.apply_bundled_copy`, `apply.bundled_copy_mode`). Строки только если bundled логически включён; если `apply_bundled_copy = false`, пометь в reason «planned, copy disabled by apply».
3. Заполни **`generated_templates_to_apply`** таблицей: **template source** (относительно `bootstrap-system/templates/`), **target path** в новом проекте, **reason**, **required switches** (`generate.docs_node` и т.д.).
4. Заполни **`optional_scaffolds_to_skip`**: для каждой строки — **template source**, **why optional**, **what decision/switch disabled it** (например `code_uploader_scaffold_helpers = false`).
5. Заполни **`excluded_items`**: что **не** должно попасть в проект (слои false, triage, minimal docs).
6. Сопоставь **task categories** по `03-task-generator.md`.
7. Заполни секции:
   - `initial_tasks_to_emit` (категории initial tasks после apply),
   - `task_zones_to_initialize` (`*/docs/analysis/tasks/`),
   - `task_indexes_to_initialize` (`*/docs/analysis/*-index.md`).
8. Заполни остальные поля `outputs/generation-plan.md`.

## Не делать

- Не создавать файлы вне `bootstrap-system/outputs/` на этом шаге.
- Не выполнять полную генерацию нового репозитория на этом шаге; **следующая фаза:** `execution/apply/*` и `07-apply-layer.md`.

## Выход

- Файл `outputs/generation-plan.md` полностью заполненный (формат v2.1 — + task zones/index init).
