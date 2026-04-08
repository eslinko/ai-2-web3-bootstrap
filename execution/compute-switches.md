# Execution prompt: compute-switches

**Роль:** заполнить блок `generate:` в `outputs/interview-summary.md` и провалидировать.

## Вход

- `outputs/interview-summary.md` (с Enabled layers и Decision table)
- При необходимости: `outputs/raw-answers.yaml`

## Инструкции для агента

1. Прочитай `references/bootstrap-decision-matrix.md` и `references/output-selection-rules.md`.
2. Прочитай `references/execution-validation.md`.
3. Для **каждого** ключа из `02-interview-summary-spec.md` (секция Generation switches, включая wallet/security/gpt/uploader, **bundled**, **scripts**, **apply**) выставь `true`/`false`:
   - `docs_*` — true если слой включён и не урезан `docs_depth: minimal` (по правилам output-selection).
   - `code_*` — true если слой включён и нужен starter из templates/code **или** bundled-копия отмечена (см. `bundled_*` ниже).
   - `env_*` — true если нужен соответствующий `.env.example`.
   - `keys_readme` — true если `storage.profile` arweave_real **или** (uploader + реальные ключи ожидаются); иначе false.
   - **`bundled_wallet_mock_runner`** ⇢ `wallet.layer_mode = bundled_mock_runner`.
   - **`bundled_arweave_uploader`** ⇢ `layer.arweave_uploader` **и** `uploader.enabled` **и** `uploader.delivery_mode = bundled_module` (если ключ отсутствует — `bundled_module`; при `scaffold_only` или `none` — `false`).
   - **`code_uploader_scaffold_helpers`** ⇢ `uploader.delivery_mode = scaffold_only` **или** явный флаг в summary «stubs рядом с эталоном»; иначе `false`.
   - **`code_uploader`** ⇢ uploader в scope **и** (`bundled_arweave_uploader` **или** `code_uploader_scaffold_helpers`).
   - **`code_wallet_mock`** ⇢ `wallet.layer_mode = bundled_mock_runner` **и** `layer.node` (код wallet появится в репо — через **копию эталона**, см. plan).
4. Вставь или обнови fenced YAML-блок `generate:` в `interview-summary.md`.
5. Отдельно вычисли security switches из `security.*`:
   - `security_hmac` ⇢ `security.api_auth_mode` включает HMAC
   - `security_bearer_gpt` ⇢ `security.gpt_actions_protection = bearer`
   - `security_edge_auth` ⇢ `security.edge_auth_mode != none`
   - `security_jwt_upload` ⇢ `security.upload_token_mode = jwt_rs256`
   - `security_wallet_auth` ⇢ `security.wallet_auth_mode = challenge_signature`
   - `security_arweave_signing` ⇢ Arweave signing в scope
   - `security_evm_signing` ⇢ EVM signing в scope
   - `security_vault` ⇢ `security.secrets_source = vault|hybrid`
   - `docs_security` / `code_security` / `env_security` ⇢ хотя бы один `security_* = true`
6. Отдельно вычисли **uploader** switches из `uploader.*` (если `layer.arweave_uploader` и `uploader.enabled`; при `uploader.delivery_mode = none` — остановить по contradiction C29):
   - `docs_uploader_architecture` ⇢ `uploader.enabled = true`
   - `docs_uploader_contract` ⇢ `uploader.payload_contract_mode` в (`strict`, `validated_upstream`)
   - `docs_uploader_callback` ⇢ `uploader.callback_mode != none`
   - `code_uploader_ingest` / `code_uploader_verification` / `code_uploader_publish` / `code_uploader_callback` ⇢ все четыре `true` **только если** `code_uploader_scaffold_helpers = true`; иначе все `false` (bundled primary path не обязан include stub tree)
   - `uploader_real_publish` ⇢ `uploader.mode` в (`real_publish`, `hybrid`)
   - `uploader_signed_data_item` ⇢ `uploader.verification_mode` в (`signed_data_item_required`, `mixed`)
   - `uploader_jwt_upload` ⇢ `uploader.caller_auth_mode` в (`jwt_upload_token`, `mixed`)
   - `uploader_backend_callback` ⇢ `uploader.callback_mode` в (`backend_callback_required`, `optional`)
7. Отдельно вычисли gpt switches из `gpt.*`:
   - `docs_gpt_architecture` ⇢ `gpt.enabled = true`
   - `docs_gpt_rulebook` ⇢ `gpt.rulebook_mode != none`
   - `docs_gpt_output_contract` ⇢ `gpt.output_structure_mode` требует контракт (`strict_json` / `multi_stage`)
   - `code_gpt_contracts` ⇢ structured output mode (strict_json / multi_stage)
   - `code_gpt_service_mapping` ⇢ `gpt.backend_handoff_mode` в (`service_mapped_json`, `event_mapped_json`)
   - `gpt_rulebook_required` ⇢ `gpt.rulebook_mode = required`
   - `gpt_actions_integration` ⇢ `gpt.actions_integration = enabled`
   - `gpt_strict_json` ⇢ `gpt.output_structure_mode = strict_json`
   - `gpt_event_mapping` ⇢ `gpt.backend_handoff_mode = event_mapped_json`
8. **Scripts:** выставь ключи из раздела **«9. Scripts switches»** ниже; если не (`scripts.enabled` **и** `layer.scripts`), все перечисленные там ключи = `false`.
9. **Apply (v2.0):** выставь `apply_bundled_copy` и `apply_optional_scaffolds` по разделу **«10. Apply switches»** ниже.
10. Прогони **contradiction checks** из `01-interview-orchestrator.md` §4 и `execution-validation.md` (C1–C36).
11. При конфликте — спроси пользователя одним сообщением или примени разрешение из validation doc.

## 9. Scripts switches (`scripts.*`)

Пусть `S = scripts.enabled && layer.scripts`. Если не `S`, все перечисленные ниже = `false`.

| Ключ `generate.*` | Правило (при `S`) |
|-------------------|-------------------|
| `docs_scripts_architecture` | `true` (overview + модели; при `docs_depth=minimal` — только `SCRIPTS_LAYER_OVERVIEW` + один раздел по режиму) |
| `docs_scripts_runbook` | `true` если `scripts.mode == orchestration_scaffold` **или** `scripts.deploy_pattern != defined_later` **или** хотя бы один из `layer.contracts`, `layer.node`, `layer.arweave_uploader` |
| `code_scripts_router` | `true` если `scripts.mode == orchestration_scaffold` **и** `scripts.deploy_pattern == router_based`; при `reference_only` — `false` |
| `code_scripts_helpers` | `true` если `scripts.mode` в (`minimal_helpers`, `orchestration_scaffold`); при `scripts.mode == reference_only` — `false` |
| `code_scripts_shell_glue` | `true` если `scripts.shell_glue == enabled` |
| `code_scripts_validators` | `true` если `scripts.validation_pattern == phase_based` |
| `scripts_phase_validation` | `true` если `scripts.validation_pattern == phase_based` |
| `docs_deployment_spec` | `true` если `scripts.deployment_spec` в (`json_spec_enabled`, `docs_only`) |
| `scripts_json_spec` | `true` если `scripts.deployment_spec == json_spec_enabled` |
| `scripts_harness_reference` | `true` если `scripts.tests_harness` в (`reference_only`, `include_minimal`) |
| `env_scripts` | `true` |
| `code_scripts_smoke` | `true` если `scripts.shell_glue == enabled` **и** (`layer.node` **или** `layer.arweave_uploader`) |

При **`scripts.mode == reference_only`:** `code_scripts_router` и `code_scripts_helpers` = `false`; остальные ключи таблицы — без изменений (shell/validators/deployment/harness могут быть `true` по своим полям `scripts.*`).

## 10. Apply switches (v2.0)

Поля **`apply.*`** читаются из summary (или defaults из `01` §2.13).

| Ключ `generate.*` | Правило |
|---------------------|---------|
| `apply_bundled_copy` | `false` если `apply.bundled_copy_mode = copy_disabled`; иначе `true`. Если секция Apply отсутствует — `true`. |
| `apply_optional_scaffolds` | `true` только если `apply.optional_scaffolds_mode = include_optional`; при `skip_optional` или `defined_later` — `false` (для `defined_later` — `false` до явного решения). Если секция отсутствует — `false`. |

**Замечание:** `dry_run_only` **не** переводит `apply_bundled_copy` в `false`: dry-run влияет только на запись файлов в промпте apply, не на наличие строк в plan.

## Выход

- Обновлённый `outputs/interview-summary.md` с полным `generate:`.
- Краткий отчёт: что derived, что default.
