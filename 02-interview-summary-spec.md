# Interview summary — машиночитаемая спецификация генерации (v2.0)

**Файл:** `outputs/interview-summary.md`  
**Назначение:** единый **control document** для task generation, bootstrap output и `PROJECT_INDEX`; пригоден для полуавтоматической подстановки (YAML-блоки внутри Markdown допустимы).

---

## Обязательная структура (секции H2)

### Meta

- `project_name`, `project_slug`, `date`, `bootstrap_system_version`, `participants`

### Enabled layers

Список или таблица: слой → `true`/`false`.

Минимальный набор ключей (boolean):

- `layer.node`
- `layer.contracts`
- `layer.arweave_uploader`
- `layer.custom_gpt`
- `layer.scripts`
- `layer.wallet_signing` (legacy; согласовать с `decisions.wallet.layer_mode`)
- `layer.wallet_mock_runner` — `true` при **`wallet.layer_mode = bundled_mock_runner`** (bundled копия эталонного mock-runner); иначе `false`
- `layer.integrations.hmac` / `supabase` / `vault` (по факту интервью)

### Security decisions

Отдельный блок (таблица или YAML) для security-решений:

- `security.api_auth_mode`: `hmac` \| `bearer` \| `mixed`
- `security.gpt_actions_protection`: `bearer` \| `none`
- `security.edge_auth_mode`: `shared_bearer` \| `hmac` \| `none`
- `security.upload_token_mode`: `jwt_rs256` \| `none`
- `security.wallet_auth_mode`: `challenge_signature` \| `none`
- `security.arweave_signing_mode`: `mock_jwk` \| `external_signer_later`
- `security.evm_signing_mode`: `node_private_key` \| `wallet_mock_runner` \| `external_wallet_later`
- `security.secrets_source`: `env_only` \| `vault` \| `hybrid`

### Auth modes by channel

Явная сводка: `channel.gpt_actions`, `channel.uploader_callbacks`, commerce API и какой режим auth применяется на каждый канал.

### Signing modes

Явная сводка: Arweave signing и EVM signing (кто подписывает, где хранится материал подписи).

### Secrets source

Явный выбор источника секретов (`env_only`/`vault`/`hybrid`) и обязательные env-группы под это решение.

### Wallet prototype decisions

Простой блок (без глубокого дерева):

- `wallet.layer_mode`: `bundled_mock_runner` \| `external_wallet_later` \| `none`
- `wallet.prototype_policy`: `fixed_single_user` \| `defined_later` (актуально при bundled)
- `wallet.role`: `signing_companion` \| `externalized_later`

Legacy: `wallet_strategy` в Decision table допустим для обратной совместимости; предпочтительны ключи выше. См. `references/wallet-bundled-prototype.md`, `references/bundled-modules-strategy.md`.

### GPT layer decisions

Отдельный блок (таблица или YAML) для GPT-решений:

- `gpt.enabled`: `true` \| `false`
- `gpt.elicitation_mode`: `guided_interview` \| `open_exploration` \| `mixed`
- `gpt.output_structure_mode`: `strict_json` \| `json_plus_explanation` \| `multi_stage`
- `gpt.rulebook_mode`: `required` \| `optional` \| `none`
- `gpt.rulebook_source`: `single_document` \| `multiple_documents` \| `interview_defined_later`
- `gpt.backend_handoff_mode`: `service_mapped_json` \| `event_mapped_json` \| `generic_structured_payload`
- `gpt.domain_capture_type`: `ideas_and_desires` \| `requests_and_proposals` \| `events_and_reports` \| `custom`
- `gpt.actions_integration`: `enabled` \| `disabled`

### Dialogue / elicitation model

Кратко фиксирует: стратегия диалога с человеком, тип вопросов, режим снижения хаоса (`guided/open/mixed`).

### Rulebook / validation model

Кратко фиксирует: обязательность rulebook, источник rulebook, уровень валидации GPT output.

### GPT output contract

Кратко фиксирует формат handoff (`strict_json` и т.д.), обязательные секции payload и версионирование контракта.

### Backend handoff model

Кратко фиксирует mapping mode: service/event/generic structured payload.

### Scripts layer decisions

Мастер-переключатель и режимы **mixed** слоя (см. `references/scripts-layer-strategy.md`):

- `scripts.enabled`: `true` \| `false`
- `scripts.mode`: `minimal_helpers` \| `orchestration_scaffold` \| `reference_only`
- `scripts.deploy_pattern`: `router_based` \| `simple_named_scripts` \| `defined_later`
- `scripts.validation_pattern`: `phase_based` \| `minimal_checks` \| `none`
- `scripts.shell_glue`: `enabled` \| `disabled`
- `scripts.deployment_spec`: `json_spec_enabled` \| `docs_only` \| `none`
- `scripts.tests_harness`: `reference_only` \| `include_minimal` \| `exclude`

**Согласование с `layer.scripts`:** при `layer.scripts = false` ожидается `scripts.enabled = false` и подрешения N/A (или явный Risk / отложенный scope).

### Deploy / orchestration model (scripts)

Кратко: `scripts.deploy_pattern`, точка входа (router vs named scripts), связь с Hardhat и артефактами.

### Validation model (scripts)

Кратко: `scripts.validation_pattern`, фазы vs минимальные проверки, отсылка к `templates/docs/scripts/VALIDATION_MODEL.md` при генерации.

### Shell glue model

Кратко: `scripts.shell_glue`, sync/smoke шаблоны, отсутствие операторских секретов в теле скриптов.

### Deployment spec model

Кратко: `scripts.deployment_spec`, JSON vs docs-only, использование minimal example (не канон эталонного `variant-a.json`).

### Scripts testing / harness model

Кратко: `scripts.tests_harness` — reference docs vs minimal checklist vs исключение; **не** полный эталонный `scripts/tests` по умолчанию.

### Uploader layer decisions

- `uploader.enabled`: `true` \| `false`
- `uploader.mode`: `mock_only` \| `real_publish` \| `hybrid`
- `uploader.caller_auth_mode`: `shared_bearer` \| `jwt_upload_token` \| `mixed`
- `uploader.verification_mode`: `signed_data_item_required` \| `token_only` \| `mixed`
- `uploader.publish_mode`: `bundle_relay` \| `direct_tx` \| `defined_later`
- `uploader.callback_mode`: `backend_callback_required` \| `optional` \| `none`
- `uploader.payload_contract_mode`: `strict` \| `validated_upstream` \| `minimal`
- `uploader.wallet_dependency_mode`: `external_signer_required` \| `mock_wallet_supported` \| `defined_later`

### Uploader ingress model

Кратко: API surface, формат crystalize body, ingress auth (relay vs открытый endpoint).

### Uploader verification model

Кратко: порядок проверок JWT / Data Item, режим `verification_mode`.

### Uploader publish model

Кратко: `publish_mode`, real vs mock, сетевые предположения.

### Uploader callback model

Кратко: обязательность callback, секрет к ноде, ожидаемые статусы.

### Uploader payload contract

Кратко: `payload_contract_mode`, где SSOT строгой схемы (если `strict`).

### Excluded layers

Явный список того, что **не** генерировать, даже если есть в эталоне-монорепо.

### Apply strategy (v2.0)

Операционные решения materialization (см. `07-apply-layer.md`, `01` §2.13):

- `apply.target_mode`: `new_project` \| `existing_repo` \| `dry_run_only`
- `apply.overwrite_policy`: `safe_no_overwrite` \| `replace_generated_only` \| `defined_later`
- `apply.bundled_copy_mode`: `copy_enabled` \| `copy_disabled`
- `apply.optional_scaffolds_mode`: `skip_optional` \| `include_optional` \| `defined_later`

### Apply constraints

- `apply.target_root`: (опционально) путь к корню целевого репозитория
- `apply.donor_repo_ref`: (опционально) commit/tag/путь донора для bundled source
- `apply.notes`: ограничения для `existing_repo`, CI, политика секретов

### Decision table

| decision_id | question_key | value | affects (tags) |
|-------------|--------------|-------|----------------|
| D1 | auth.model | mixed \| bearer_only \| hmac_only | node, env |
| D2 | deployment.profile | local_only \| staged \| production_ready_later | env, tasks |
| D3 | storage.profile | mock_only \| arweave_real \| hybrid | uploader, env, tasks |
| D4 | contract.strategy | registry_scaffold_only \| tokenization_planned \| active_token_layer | contracts, docs |
| D5+ | wallet.layer_mode (+ prototype_policy, role) | bundled_mock_runner \| external_wallet_later \| none | bundled_wallet_mock_runner, docs_wallet, env_wallet_mock, tasks |
| D6+ | security.* | см. список Security decisions | security_docs, security_env, security_code, security_tasks |
| D7+ | gpt.* | см. список GPT layer decisions | gpt_docs, gpt_contracts, gpt_mapping, gpt_tasks |
| D8+ | uploader.* (включая delivery_mode) | см. Uploader layer decisions | uploader_docs, bundled_arweave_uploader, optional scaffolds, uploader_env, uploader_tasks |
| D9+ | scripts.* | см. Scripts layer decisions | scripts_docs, scripts_code, scripts_env, scripts_tasks, scripts_output_shape |
| D10+ | apply.* | см. Apply strategy | apply_phase, bundled_copy, optional_scaffolds |
| … | … | … | … |

Теги должны маппиться на строки `references/bootstrap-decision-matrix.md`.  
Решение **`wallet.layer_mode`** обязательно в Decision table при **`layer.node = true`**. При отсутствии signing-клиента в репо: `external_wallet_later` или `none` + `layer.wallet_mock_runner = false`.

### Generation switches

**Строгий набор ключей** (все boolean; отсутствие ключа = ошибка валидации после `compute-switches`, если не помечено как N/A в `execution-validation`):

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

**Правила:**

| Тип | Описание |
|-----|----------|
| **Default** | Если слой выключен в raw answers → соответствующие `docs_*`, `code_*`, `env_*` = `false` (кроме `docs_root`, `docs_tasks` по политике ниже). |
| **Required** | `docs_root: true` всегда (кроме явного «docs excluded» в triage — тогда зафиксировать в Excluded и Risk). |
| **Derived** | Вычисляются агентом по `references/bootstrap-decision-matrix.md` + `output-selection-rules.md`: например `keys_readme: true` если `storage.profile == arweave_real` или `layer.arweave_uploader` + real. |
| **env_contracts** | `true` если `layer.contracts` и нужны deploy-переменные в отдельном файле (по умолчанию как в `templates/env/contracts.env.example`). |
| **docs_wallet / code_wallet_mock / env_wallet_mock** | `true` если `decisions.wallet.layer_mode = bundled_mock_runner`, **`layer.wallet_mock_runner = true`** и **`layer.node = true`**. `code_wallet_mock` = true означает «включить wallet-код»: при bundled это **копия эталона**, не обязательно дерево из `templates/code/wallet` stubs. При `external_wallet_later` — узкий roadmap; при `none` — wallet/docs выключены. См. `references/output-selection-rules.md` § Wallet. |
| **bundled_wallet_mock_runner** | `true` если `wallet.layer_mode = bundled_mock_runner` и нет triage-запрета. |
| **bundled_arweave_uploader** | `true` если `uploader.enabled`, `layer.arweave_uploader` и **`uploader.delivery_mode = bundled_module`** (default). |
| **code_uploader_scaffold_helpers** | `true` только если **`uploader.delivery_mode = scaffold_only`** или явно нужны optional stubs рядом с bundled (редко). Иначе `false`. |
| **security_* switches** | Вычисляются из `security.*` решений: `security_hmac` если `api_auth_mode` включает HMAC; `security_bearer_gpt` если `gpt_actions_protection=bearer`; `security_edge_auth` если edge mode не `none`; `security_jwt_upload` если `upload_token_mode=jwt_rs256`; `security_wallet_auth` если `wallet_auth_mode=challenge_signature`; `security_arweave_signing` если arweave signing в scope; `security_evm_signing` если evm signing в scope; `security_vault` если `secrets_source` включает Vault. |
| **docs_security / code_security / env_security** | `true` если включён хотя бы один `security_*` switch и `layer.node=true`; для `env_security` достаточно любого security-контрагента (node/uploader/wallet). |
| **gpt_* switches** | Вычисляются из `gpt.*`: `gpt_rulebook_required` если `gpt.rulebook_mode=required`; `gpt_actions_integration` если `gpt.actions_integration=enabled`; `gpt_strict_json` если `gpt.output_structure_mode=strict_json`; `gpt_event_mapping` если `gpt.backend_handoff_mode=event_mapped_json`; `docs_gpt_architecture` если `gpt.enabled=true`; `docs_gpt_rulebook` если `gpt.rulebook_mode!=none`; `docs_gpt_output_contract` если `gpt.output_structure_mode` требует контракт; `code_gpt_contracts` если нужен структурированный handoff; `code_gpt_service_mapping` если `service_mapped_json` или `event_mapped_json`. |
| **uploader_* switches** | Вычисляются из `uploader.*` при `uploader.enabled=true` и включённом `layer.arweave_uploader` — см. `execution/compute-switches.md` §6; детальное включение docs/code — `references/output-selection-rules.md` §8. |
| **scripts.* switches** | Базовое условие: `scripts.enabled` **и** `layer.scripts`. Иначе все `generate.docs_scripts_*`, `generate.code_scripts_*`, `generate.docs_deployment_spec`, `generate.scripts_*`, `env_scripts` = `false`. Детальная логика — `execution/compute-switches.md` §9 и `references/output-selection-rules.md` §10. |
| **apply_* (v2.0)** | `apply_bundled_copy`: `true` если `apply.bundled_copy_mode = copy_enabled` (при `copy_disabled` — `false`, даже при `bundled_*` в generate). `apply_optional_scaffolds`: `true` только если `apply.optional_scaffolds_mode = include_optional`. Иначе `false`. При `dry_run_only` ключи не отключают plan-строки, но apply не пишет файлы (см. `references/apply-rules.md`). |

Правила заполнения — `references/output-selection-rules.md`.  
Алгоритм вычисления — `execution/compute-switches.md` + `06-execution-flow.md` Phase 3.

### Security switches

Обязательные булевы ключи (внутри `generate:`):

- `generate.security_hmac`
- `generate.security_bearer_gpt`
- `generate.security_edge_auth`
- `generate.security_jwt_upload`
- `generate.security_wallet_auth`
- `generate.security_arweave_signing`
- `generate.security_evm_signing`
- `generate.security_vault`

Они должны быть согласованы с `Security decisions` и таблицей `Auth modes by channel`.

### GPT switches

Обязательные булевы ключи (внутри `generate:`):

- `generate.docs_gpt_architecture`
- `generate.docs_gpt_rulebook`
- `generate.docs_gpt_output_contract`
- `generate.code_gpt_contracts`
- `generate.code_gpt_service_mapping`
- `generate.gpt_rulebook_required`
- `generate.gpt_actions_integration`
- `generate.gpt_strict_json`
- `generate.gpt_event_mapping`

Они должны быть согласованы с `GPT layer decisions`, `Rulebook / validation model`, `Backend handoff model`.

### Uploader switches

Обязательные булевы ключи (внутри `generate:`):

- `generate.docs_uploader_architecture`
- `generate.docs_uploader_contract`
- `generate.docs_uploader_callback`
- `generate.bundled_arweave_uploader`
- `generate.code_uploader_scaffold_helpers`
- `generate.code_uploader_ingest`
- `generate.code_uploader_verification`
- `generate.code_uploader_publish`
- `generate.code_uploader_callback`
- `generate.uploader_real_publish`
- `generate.uploader_signed_data_item`
- `generate.uploader_jwt_upload`
- `generate.uploader_backend_callback`

`code_uploader_*` (ingest…callback) выставлять в `true` **только** если `code_uploader_scaffold_helpers = true` (иначе `false` при bundled primary path).

Согласовать с `Uploader layer decisions`, **`uploader.delivery_mode`** и `security.*` (JWT upload token, edge auth).

### Scripts switches

Обязательные булевы ключи (внутри `generate:`) для v1.9:

- `generate.docs_scripts_architecture`
- `generate.docs_scripts_runbook`
- `generate.code_scripts_router`
- `generate.code_scripts_helpers`
- `generate.code_scripts_shell_glue`
- `generate.code_scripts_validators`
- `generate.docs_deployment_spec`
- `generate.scripts_phase_validation`
- `generate.scripts_json_spec`
- `generate.scripts_harness_reference`
- `generate.env_scripts`
- `generate.code_scripts_smoke` (legacy имя: короткий smoke shell; см. §9 compute-switches)

Согласовать с **`scripts.*`** в Decision table и `references/scripts-layer-strategy.md`.

### Apply switches (v2.0)

Внутри `generate:`:

- `generate.apply_bundled_copy`
- `generate.apply_optional_scaffolds`

Согласовать с **`apply.*`** в секции Apply strategy.

### Wallet bundled switches

- `generate.bundled_wallet_mock_runner` — копия эталонного `wallet/mock-runner` в plan (`bundled_modules_to_copy`).
- Обычно вместе с `docs_wallet`, `env_wallet_mock`; `code_wallet_mock` остаётся маркером «код wallet в проекте», при bundled исполнитель копирует эталон, а не расширяет stubs.

### Mandatory starter docs

Список **путей относительно `docs/`** которые обязаны быть созданы (не пустые заголовки).

Минимум всегда (если не исключено в Excluded):

- `docs/.../SYSTEM_OVERVIEW.md`, `DATA_FLOOU.md`, `PROJECT_INDEX.md` (root)

Дополнительно по слоям — см. output-selection-rules.

### Mandatory starter code

Список путей из `templates/code/**` которые копируются 1:1 или с подстановкой **плюс** явные элементы из **`outputs/generation-plan.md` → `bundled_modules_to_copy`** (wallet, uploader — эталонные деревья, не обязательно из bootstrap templates).

### Mandatory env groups

Имена групп из `templates/env/`:

- `root`, `node`, `contracts`, `arweave` (если слой uploader / crystallization), `wallet-mock` (если `env_wallet_mock`), `security` (если `env_security`), `scripts` (если `env_scripts` → `templates/env/scripts.env.example`), `shared-vars-catalog` (+ GPT / uploader cross-refs по решению)

Указать какие **обязательны** для данного проекта.

### Pending decisions

Список `NEEDS_DECISION`: вопрос, владелец, дедлайн или «before Phase N».

### Donor residue to ignore

Явный список паттернов/папок эталона, не переносимых (см. triage в `01-interview-orchestrator.md`).

### Risk flags

Краткие метки: `mock_vs_prod`, `secrets_not_defined`, `openapi_drift`, …

### Vision / Domains / APIs / Chain / Storage / Env (legacy content)

Сохранить краткие человекочитаемые абзацы из v1.1 — для людей; **не** дублировать Generation switches.

---

## Формат файла

- Markdown + при необходимости **встроенный YAML** в fenced block для `generate:`.
- Таблицы GitHub-flavored для Decision table и Enabled layers.

---

## Входы в downstream

| Потребитель | Что читает |
|-------------|------------|
| Execution / plan | Полный файл + raw answers (если сохранены) |
| Task generator | Decision table, Enabled layers, Generation switches, Pending |
| Output spec | Generation switches, storage.profile, deployment.profile |
| PROJECT_INDEX | Enabled + Excluded + ссылка на этот файл |

---

## Пример полностью заполненного summary (сокращённый)

Полный образец см. `outputs/interview-summary.example.md` (если присутствует в репозитории) или шаблон `outputs/interview-summary.md`.

Минимально должны быть заполнены: **Meta**, **Enabled layers**, **Apply strategy** (или явные defaults), **Decision table** для всех задействованных `decisions.*`, блок **`generate:`** со всеми ключами из раздела «Generation switches» выше (включая **apply_***).
