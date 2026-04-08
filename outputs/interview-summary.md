# Interview summary — canonical skeleton (v2.0)

Заполнить по **`02-interview-summary-spec.md`**. После интервью блок `generate:` дополнить или пересчитать через **`execution/compute-switches.md`**. Materialization: **`07-apply-layer.md`**, **`execution/apply/`**. Образец: **`outputs/interview-summary.example.md`**.

---

## Meta

- project_name: (заполнить)
- project_slug: (заполнить)
- date: (ISO)
- bootstrap_system_version: 2.0
- participants: (заполнить)

## Enabled layers

| layer | enabled |
|-------|---------|
| node | |
| contracts | |
| arweave_uploader | |
| custom_gpt | |
| scripts | |
| wallet_signing | (legacy; согласовать с wallet.layer_mode) |
| wallet_mock_runner | |
| integrations.hmac | |
| integrations.supabase | |
| integrations.vault | |

## Security decisions

Заполнить из интервью (см. `01-interview-orchestrator.md` §2.9):

- api_auth_mode: `hmac` | `bearer` | `mixed`
- gpt_actions_protection: `bearer` | `none`
- edge_auth_mode: `shared_bearer` | `hmac` | `none`
- upload_token_mode: `jwt_rs256` | `none`
- wallet_auth_mode: `challenge_signature` | `none`
- arweave_signing_mode: `mock_jwk` | `external_signer_later`
- evm_signing_mode: `node_private_key` | `wallet_mock_runner` | `external_wallet_later`
- secrets_source: `env_only` | `vault` | `hybrid`

## Auth modes by channel

- channel.gpt_actions: …
- channel.uploader_callbacks: …
- commerce / прочие каналы: …

(Явная сводка: какой режим auth на каждый канал.)

## Signing modes

- Arweave: …
- EVM: …

## Secrets source

- (env_only / vault / hybrid + обязательные env-группы)

## Wallet prototype decisions

- layer_mode: `bundled_mock_runner` | `external_wallet_later` | `none`
- prototype_policy: `fixed_single_user` | `defined_later` (при bundled)
- role: `signing_companion` | `externalized_later`

## GPT layer decisions

- enabled: `true` | `false`
- elicitation_mode: …
- output_structure_mode: …
- rulebook_mode: …
- rulebook_source: …
- backend_handoff_mode: …
- domain_capture_type: …
- actions_integration: …

## Dialogue / elicitation model

- (кратко)

## Rulebook / validation model

- (кратко)

## GPT output contract

- (кратко)

## Backend handoff model

- (кратко)

## Scripts layer decisions

См. `references/scripts-layer-strategy.md`. При `layer.scripts = false` — обычно `scripts.enabled = false`, подрешения N/A.

- enabled: `true` | `false`
- mode: `minimal_helpers` | `orchestration_scaffold` | `reference_only`
- deploy_pattern: `router_based` | `simple_named_scripts` | `defined_later`
- validation_pattern: `phase_based` | `minimal_checks` | `none`
- shell_glue: `enabled` | `disabled`
- deployment_spec: `json_spec_enabled` | `docs_only` | `none`
- tests_harness: `reference_only` | `include_minimal` | `exclude`

## Deploy / orchestration model (scripts)

- (router vs named scripts, связь с Hardhat/артефактами)

## Validation model (scripts)

- (фазы vs minimal; при генерации — `templates/docs/scripts/VALIDATION_MODEL.md`)

## Shell glue model

- (sync/smoke; без секретов в теле скриптов)

## Deployment spec model

- (JSON vs docs-only; не канон эталонного `variant-a.json`)

## Scripts testing / harness model

- (reference / minimal / exclude; не полный эталонный `scripts/tests` по умолчанию)

## Uploader layer decisions

- enabled: `true` | `false`
- delivery_mode: `bundled_module` | `scaffold_only` | `none`
- mode: …
- caller_auth_mode: …
- verification_mode: …
- publish_mode: …
- callback_mode: …
- payload_contract_mode: …
- wallet_dependency_mode: …

## Uploader ingress model

- (кратко)

## Uploader verification model

- (кратко)

## Uploader publish model

- (кратко)

## Uploader callback model

- (кратко)

## Uploader payload contract

- (кратко)

## Excluded layers

- (явный список того, что не генерировать)

## Apply strategy

См. `01-interview-orchestrator.md` §2.13. Defaults: `new_project`, `safe_no_overwrite`, `copy_enabled`, `skip_optional`.

- `apply.target_mode`: `new_project` | `existing_repo` | `dry_run_only`
- `apply.overwrite_policy`: `safe_no_overwrite` | `replace_generated_only` | `defined_later`
- `apply.bundled_copy_mode`: `copy_enabled` | `copy_disabled`
- `apply.optional_scaffolds_mode`: `skip_optional` | `include_optional` | `defined_later`

## Apply constraints

- `apply.target_root`: (путь целевого репо, если известен)
- `apply.donor_repo_ref`: (опционально)
- `apply.notes`:

## Decision table

| decision_id | question_key | value | affects (tags) |
|-------------|--------------|-------|----------------|
| D1 | auth.model | | |
| D2 | deployment.profile | | |
| D3 | storage.profile | | N/A если uploader/callbacks выключены — см. validation |
| D4 | contract.strategy | | N/A если contracts false |
| D5+ | docs_depth | minimal \| standard \| full | docs |
| … | wallet.layer_mode (+ prototype_policy, role) | | |
| … | security.* | | |
| … | gpt.* | | |
| … | uploader.* (включая delivery_mode) | | |
| … | scripts.* | | |
| … | apply.* | | |

(Дополнить строками для всех задействованных решений из интервью.)

## Generation switches

Полный строгий набор ключей v2.0 (все boolean). Значения ниже — **стартовый skeleton** до `compute-switches`; агент выставляет derived по решениям.

```yaml
generate:
  docs_root: true
  docs_node: false
  docs_contracts: false
  docs_custom_gpt: false
  docs_arweave: false
  docs_wallet: false
  docs_gpt_architecture: false
  docs_gpt_rulebook: false
  docs_gpt_output_contract: false
  docs_uploader_architecture: false
  docs_uploader_contract: false
  docs_uploader_callback: false
  docs_security: false
  docs_tasks: true
  code_node: false
  code_contracts: false
  code_uploader: false
  code_uploader_ingest: false
  code_uploader_verification: false
  code_uploader_publish: false
  code_uploader_callback: false
  code_uploader_scaffold_helpers: false
  bundled_wallet_mock_runner: false
  bundled_arweave_uploader: false
  code_wallet_mock: false
  code_gpt_contracts: false
  code_gpt_service_mapping: false
  code_security: false
  code_scripts_smoke: false
  docs_scripts_architecture: false
  docs_scripts_runbook: false
  code_scripts_router: false
  code_scripts_helpers: false
  code_scripts_shell_glue: false
  code_scripts_validators: false
  docs_deployment_spec: false
  scripts_phase_validation: false
  scripts_json_spec: false
  scripts_harness_reference: false
  env_root: true
  env_node: false
  env_contracts: false
  env_arweave: false
  env_wallet_mock: false
  env_security: false
  env_scripts: false
  security_hmac: false
  security_bearer_gpt: false
  security_edge_auth: false
  security_jwt_upload: false
  security_wallet_auth: false
  security_arweave_signing: false
  security_evm_signing: false
  security_vault: false
  gpt_rulebook_required: false
  gpt_actions_integration: false
  gpt_strict_json: false
  gpt_event_mapping: false
  uploader_real_publish: false
  uploader_signed_data_item: false
  uploader_jwt_upload: false
  uploader_backend_callback: false
  apply_bundled_copy: true
  apply_optional_scaffolds: false
  keys_readme: false
```

Согласование подключей с решениями: см. подразделы **Security / GPT / Uploader / Scripts / Apply switches** в `02-interview-summary-spec.md`.

## Mandatory starter docs

- Минимум: пути под `docs/` для `SYSTEM_OVERVIEW.md`, `DATA_FLOOU.md`, `PROJECT_INDEX.md` (root)
- По слоям — см. `references/output-selection-rules.md`

## Mandatory starter code

- Из `templates/code/**` и/или `outputs/generation-plan.md` → `bundled_modules_to_copy`

## Mandatory env groups

- Отметить: `root`, `node`, `contracts`, `arweave`, `wallet-mock`, `security`, `scripts`, `shared-vars-catalog` — что обязательно для проекта

## Pending decisions

- (NEEDS_DECISION: вопрос, владелец, дедлайн / Phase)

## Donor residue to ignore

- (паттерны эталона, не переносимые — triage `01` §5)

## Risk flags

- (например mock_vs_prod, secrets_not_defined, openapi_drift)

## Vision / Domains / APIs / Chain / Storage / Env

- Краткие человекочитаемые абзацы; **без** дублирования блока `generate:`
