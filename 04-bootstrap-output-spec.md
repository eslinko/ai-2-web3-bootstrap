# Bootstrap output specification — v2.1 (apply + bullrun usage mode + scripts-aware + bundled prototype)

## 1. Цель

Контракт **условной** генерации: что создаётся **всегда**, что — **только при включённом слое/режиме**, что — **отложено** до фазы.

**Источник истины решений:** `outputs/interview-summary.md` (Generation switches + Decision table).

---

## 2. Глобальные артефакты (почти всегда)

| Output | Trigger | Source of truth | Минимальное содержание |
|--------|---------|-----------------|------------------------|
| `outputs/interview-summary.md` | Завершено интервью | Оператор + `02-interview-summary-spec` | Все обязательные секции v2.0 (+ `scripts.*`, **Apply strategy**) |
| Root `docs/` минимум | `generate.docs_root` не false | `templates/docs/root/*` | SYSTEM_OVERVIEW, DATA_FLOOU, PROJECT_INDEX |
| `shared-vars-catalog.md` (проект) | Есть ≥1 сервис с env | `templates/env/shared-vars-catalog.md` | Таблицы контуров без секретов |

---

## 2.5 Bundled outputs vs generated outputs

| Класс | Что входит | Источник истины |
|--------|------------|-----------------|
| **Bundled (copy as is)** | `wallet/mock-runner` при `wallet.layer_mode = bundled_mock_runner`; эталонный `arweave-uploader/` при `uploader.delivery_mode = bundled_module` (default) | Донорский монорепо / эталон; пути в `outputs/generation-plan.md` → `bundled_modules_to_copy` |
| **Generated around bundled** | `docs/wallet/**`, `docs/arweave-uploader/**`, `wallet-mock.env.example`, `arweave.env.example`, integration notes, limitations | `templates/docs/**`, `templates/env/**`, `references/bundled-code-placement-rules.md` |
| **Generated scaffold-only** | Optional uploader pipeline stubs, wallet signer stubs | `templates/code/arweave-uploader/src/**` при `code_uploader_scaffold_helpers`; `templates/code/wallet/*.stub` — secondary |
| **Configurable (decisions)** | `uploader.*`, `wallet.*`, `security.*`, payload/callback semantics | `outputs/interview-summary.md` Decision table |

**Правило v1.8:** не подменять bundled ядро uploader/wallet мелкими stubs, если цель — рабочий prototype path.

---

## 3. Условные outputs по слоям

### 3.1 node

| Output | Trigger | SoT | Минимум |
|--------|---------|-----|---------|
| `docs/node/**` | `layer.node` | templates | README + NODE_ARCHITECTURE если API не trivial |
| `templates/code/node/**` | `generate.code_node` | templates | health + config pattern |
| `node.env.example` | `mandatory env` включает node | `templates/env/node.env.example` | Группы по auth.model |

**Reduced:** если `channel.api_only` и нет GPT — убрать из docs упоминания Bearer; оставить HMAC если integrations.

---

### 3.2 contracts

| Output | Trigger | SoT | Минимум |
|--------|---------|-----|---------|
| `docs/contracts/**` | `layer.contracts` | templates | README + HARDHAT_SETUP |
| `templates/code/contracts/**` | `generate.code_contracts` | templates | hardhat.config + deploy_router |
| `root.env` / `contracts.env` | contracts + deploy | templates/env | DEPLOYER*, RPC |

**Reduced:** `contract.strategy = registry_scaffold_only` → не генерировать TOKENIZATION_FLOOU заполненным; оставить заголовки и «hooks».

**Отложено:** `active_token_layer` без готовности ноды → задачи Phase 2–3, не обязательный код в Phase 1.

---

### 3.3 arweave-uploader

Источник решений: `uploader.*` (включая **`uploader.delivery_mode`**) + `layer.arweave_uploader` + switches `generate.docs_uploader_*`, `generate.bundled_arweave_uploader`, `generate.code_uploader_scaffold_helpers`, `generate.uploader_*`.

| Output | Trigger | SoT | Минимум |
|--------|---------|-----|---------|
| **Bundled код** | `bundled_arweave_uploader = true` | эталонный `arweave-uploader/` | полный пакет как в эталоне; настройка через env |
| `docs/arweave-uploader/**` | `layer.arweave_uploader` | templates | UPLOADER_ARCHITECTURE, BUNDLED_MODULE_NOTES, потоковые docs по switches |
| Optional pipeline stubs | `code_uploader_scaffold_helpers = true` | `templates/code/arweave-uploader/src/**` | только secondary для scaffold_only / обучения |
| `arweave.env.example` | uploader в scope | templates/env | группы relay, JWT verify, backend callback, publish |

**Только mock:** не требовать заполненных JWK relay в примерах; пометить в docs `Risk flags`.

**Real:** обязательны `keys/README` + relay JWK в env-классах + задачи Phase 1.

Детальный контракт по режимам — §3.9.

---

### 3.4 custom-gpt

| Output | Trigger | SoT | Минимум |
|--------|---------|-----|---------|
| `docs/custom-gpt/**` | `layer.custom_gpt` | templates | INSTRUCTION_SYSTEM, AI_TO_APP_HANDOFF |

**Исключено:** если `layer.custom_gpt = false` — не создавать папку `custom-gpt/` в docs; упомянуть в PROJECT_INDEX «не в scope».

---

### 3.5 scripts (mixed layer v1.9)

Источник решений: `scripts.*` + `layer.scripts` + switches `generate.docs_scripts_*`, `generate.code_scripts_*`, `generate.env_scripts`, `generate.scripts_*`, `generate.docs_deployment_spec`. Стратегия: `references/scripts-layer-strategy.md`. **Не** bundled весь эталонный `scripts/`.

| Output | Trigger | SoT |
|--------|---------|-----|
| Docs `docs/scripts/**` из шаблонов | `generate.docs_scripts_architecture` | `templates/docs/scripts/*` |
| Runbook-style scripts docs | `generate.docs_scripts_runbook` | `DEPLOY_ORCHESTRATION_MODEL.md`, `SHELL_GLUE.md`, cross-refs |
| Router stub | `generate.code_scripts_router` | `templates/code/scripts/router/*` |
| Config + helpers | `generate.code_scripts_helpers` | `templates/code/scripts/config/*`, `lib/*` |
| Shell templates | `generate.code_scripts_shell_glue` | `templates/code/scripts/shell/*` |
| Smoke shell (короткий) | `generate.code_scripts_smoke` | `templates/code/scripts/deploy/floou_health_smoke.sh` |
| Validator stub | `generate.code_scripts_validators` | `templates/code/scripts/validators/*` |
| Phase validation docs акцент | `generate.scripts_phase_validation` | `VALIDATION_MODEL.md` |
| Deployment spec (README + пример JSON) | `generate.docs_deployment_spec` + опционально `generate.scripts_json_spec` | `templates/code/scripts/deployment/*` |
| Harness methodology reference | `generate.scripts_harness_reference` | ссылки в docs/tasks; **не** полный `scripts/tests` эталона |
| `scripts.env.example` | `generate.env_scripts` | `templates/env/scripts.env.example` |

**Условно по режимам:**

- При **`scripts.enabled = false`:** не генерировать scripts starter (все scripts-related `generate.*` = false).
- При **`scripts.mode = orchestration_scaffold`:** обычно router (если `router_based`) + config + docs runbook.
- При **`scripts.mode = minimal_helpers`:** shell + helpers; без обязательного router.
- При **`scripts.validation_pattern = phase_based`:** stub validator + `scripts_phase_validation`.
- при **`scripts.deployment_spec = json_spec_enabled`:** минимальный JSON example; не канон `variant-a.json`.
- **Reference-only / docs:** `reference_only` — преимущественно docs; код только если явно включены glue/router switches.

**Исключено по умолчанию:** весь эталонный `lib/actions`, полные `validators`, `scripts/tests`, operator junk files — см. `outputs/scripts-layer-integration.md`.

---

### 3.5.1 Scripts outputs (сводка)

| Класс | Содержание |
|-------|------------|
| Всегда при `scripts.enabled` + `layer.scripts` | Категории env при `env_scripts`; при `docs_scripts_architecture` — overview |
| Только `orchestration_scaffold` | router stub (при `router_based`), расширенный runbook |
| Только `phase_based` | validator stub + phase validation docs/markers |
| Только docs / reference | `reference_only`, harness refs, deployment README без JSON, если `docs_only` |
| Исключено | massive validators, full test harness, blind copy эталонных сценариев |

---

### 3.6 wallet (bundled signing companion)

Решения: **`wallet.layer_mode`**, `wallet.prototype_policy`, `wallet.role`, `layer.wallet_mock_runner`, `layer.node`. Паттерн очереди: `references/mock-wallet-pattern.md`. Bundled-канон: `references/wallet-bundled-prototype.md`.

| Output | Trigger | SoT | Минимум |
|--------|---------|-----|---------|
| **Bundled `wallet/mock-runner`** | `generate.bundled_wallet_mock_runner` | эталонное дерево | почти полная копия эталона; см. plan |
| `docs/wallet/**` | `generate.docs_wallet` | `templates/docs/wallet/*` | WALLET_LAYER_OVERVIEW, MOCK_RUNNER_RUNTIME, SIGNING_COMPANION, PROTOTYPE_LIMITATIONS (+ при необходимости WALLET_STRATEGY, SIGNING_MODEL) |
| `wallet-mock.env.example` | `generate.env_wallet_mock` | `templates/env/wallet-mock.env.example` | классы переменных; **fixed mock identity**, node/uploader refs |
| secondary stubs | опционально | `templates/code/wallet/*` | не primary при bundled |

**`wallet.layer_mode = bundled_mock_runner`:** docs + env + **bundled copy**; в `DATA_FLOOU`/`PROJECT_INDEX` — связь нода ↔ companion ↔ uploader.

**`external_wallet_later` / `none`:** без bundled mock-runner; узкий roadmap в docs.

**Reduced:** `docs_depth = minimal` → минимум OVERVIEW + RUNTIME + LIMITATIONS.

**Future:** multi-user, custody, UX wallet — только docs; не расширять bundled ядро без решения.

---

### 3.7 security outputs

Источник решений: `security.*` в summary + switches `generate.security_*`.

| Output | Trigger | SoT | Минимум |
|--------|---------|-----|---------|
| `docs/security/**` | `generate.docs_security` | `templates/docs/security/*` | SECURITY_OVERVIEW, AUTH_MODES, SIGNING_ARCHITECTURE, SECRETS_MANAGEMENT, INTERSERVICE_SECURITY |
| `security.env.example` | `generate.env_security` | `templates/env/security.env.example` | группы HMAC/Bearer/JWT/Arweave/EVM/Vault без секретов |
| security code boundaries | `generate.code_security` | `templates/code/node/**/security*`, `services/signing/**`, `services/auth/**` | интерфейсные/stub файлы, без runtime-логики |
| `generate.security_hmac` | `security.api_auth_mode` включает HMAC | summary decision table | HMAC docs/env/task tags |
| `generate.security_bearer_gpt` | `security.gpt_actions_protection = bearer` | summary decision table | Bearer GPT docs/env/task tags |
| `generate.security_edge_auth` | `security.edge_auth_mode != none` | summary decision table | edge callback auth docs/env/task tags |
| `generate.security_jwt_upload` | `security.upload_token_mode = jwt_rs256` | summary decision table | JWT key classes в env, upload token docs |
| `generate.security_wallet_auth` | `security.wallet_auth_mode = challenge_signature` | summary decision table | wallet-auth docs/code/task tags |
| `generate.security_arweave_signing` | arweave signing in scope | summary decision table | Arweave signing docs/env tags |
| `generate.security_evm_signing` | evm signing in scope | summary decision table | EVM signing docs/env tags |
| `generate.security_vault` | `security.secrets_source` = vault/hybrid | summary decision table | Vault env/docs/task tags |

**Всегда:** не унифицировать контуры в один auth; отражать HMAC/Bearer/JWT/wallet-auth/Arweave/EVM раздельно.

---

### 3.8 GPT outputs

Источник решений: `gpt.*` + switches `generate.docs_gpt_*`, `generate.code_gpt_*`, `generate.gpt_*`.

| Output | Trigger | SoT | Минимум |
|--------|---------|-----|---------|
| `docs/gpt/GPT_ARCHITECTURE.md` | `gpt.enabled = true` и `generate.docs_gpt_architecture` | `templates/docs/gpt/*` | роль GPT, место в floou, связь с node/backend |
| `docs/gpt/DIALOGUE_MODEL.md` | `gpt.enabled = true` | `templates/docs/gpt/*` | elicitation mode и путь «мысли -> структура» |
| `docs/gpt/RULEBOOK_MODEL.md` | `generate.docs_gpt_rulebook` | `templates/docs/gpt/*` | rulebook mode/source и валидационный контур |
| `docs/gpt/OUTPUT_CONTRACT.md` | `generate.docs_gpt_output_contract` | `templates/docs/gpt/*` | JSON contract sections, required fields, versioning |
| `docs/gpt/BACKEND_HANDOFF.md` | `gpt.enabled = true` | `templates/docs/gpt/*` | mapping в service/event workflows |
| code boundaries: ingest/validation/mapping/contracts | `generate.code_gpt_contracts` или `generate.code_gpt_service_mapping` | `templates/code/node/**` | stubs без runtime реализации |
| `generate.gpt_rulebook_required` | `gpt.rulebook_mode = required` | summary decision table | rulebook docs/task tags обязательны |
| `generate.gpt_strict_json` | `gpt.output_structure_mode = strict_json` | summary decision table | output contract обязателен |
| `generate.gpt_event_mapping` | `gpt.backend_handoff_mode = event_mapped_json` | summary decision table | event mapping docs/code tags |
| `generate.gpt_actions_integration` | `gpt.actions_integration = enabled` | summary decision table | linkage с security bearer/docs/tasks |

**Всегда при `gpt.enabled = true`:** не сводить слой к prompt-writing; фиксировать отдельно dialogue/rulebook/output/handoff.

---

### 3.9 Arweave uploader outputs (uploader-aware)

Источник: `uploader.*` + `generate.docs_uploader_*`, `generate.code_uploader_*`, `generate.uploader_*`.

| Output | Trigger | SoT | Минимум |
|--------|---------|-----|---------|
| Базовый пакет uploader docs | `uploader.enabled = true` | `templates/docs/arweave-uploader/*` | UPLOADER_ARCHITECTURE + как минимум один из специализированных файлов по включённым switches |
| Ingress/auth docs | `generate.docs_uploader_architecture` или полный путь | `INGRESS_AND_AUTH.md` | caller trust + JWT/relay |
| Payload contract docs | `generate.docs_uploader_contract` | `PAYLOAD_CONTRACT.md` | режим strict / validated_upstream / minimal |
| Callback docs | `generate.docs_uploader_callback` | `PUBLISH_AND_CALLBACK.md` | callback контракт и trust к ноде |
| Optional pipeline stubs | `generate.code_uploader_scaffold_helpers` и соответствующие `code_uploader_*` | `templates/code/arweave-uploader/src/**` | secondary; см. `src/OPTIONAL_SCAFFOLD_README.md` |
| **Только `real_publish` / `hybrid` (+ real path)** | `generate.uploader_real_publish` | env + docs | `USE_REAL_ARWEAVE`, relay JWK, network; `keys/README` при необходимости |
| **Только `signed_data_item_required` / `mixed` (подпись Item)** | `generate.uploader_signed_data_item` | verification docs + stubs | `VERIFICATION_MODEL.md`, `validate-data-item` boundary |
| **Только JWT на crystalize** | `generate.uploader_jwt_upload` | verification + security cross-ref | публичный ключ на uploader; согласование с `security.upload_token_mode` |
| **Callback/status к ноде** | `generate.uploader_backend_callback` | callback stubs + env | `BACKEND_URL`, `NODE_AUTH_TOKEN` классы |
| **`publish_mode = defined_later`** | — | docs | секция Pending / Risk; не выдавать полный publish implementation |
| **`direct_tx`** | `uploader.publish_mode = direct_tx` | docs | явные network/tx assumptions или отложено до Phase N |

**Всегда при `uploader.enabled = true`:** не сводить к «upload файла»; раздельно фиксировать ingress trust, verification, publish, callback и границу с wallet.

**По умолчанию v1.8:** `uploader.delivery_mode = bundled_module` — артефакт кода в plan указывать в **`bundled_modules_to_copy`**, а не как обязательный набор stub-файлов из bootstrap templates.

---

## 4. Режимы storage / deployment (пересечения)

| Комбинация | Дополнительно генерировать |
|--------------|----------------------------|
| `mock_only` + uploader | BACKEND_USE_MOCK в arweave env; задачи mock alignment |
| `arweave_real` + uploader | полный arweave env + keys README |
| `local_only` | не генерировать Vault-секции в node.env как обязательные |
| `production_ready_later` | DEPLOYMENT.md с «hooks», не полный runbook |

---

## 5. MVP vs full

**MVP bootstrap (минимум честного старта):**

- interview-summary с Generation switches
- root docs тройка
- env examples для **включённых** слоёв
- один health path (нода и/или uploader по слоям)

**Не MVP:** полный Floou E2E, CI, production secrets, автосинк OpenAPI.

---

## 6. Apply outputs (v2.x materialization)

Источник: `outputs/interview-summary.md` (**Apply strategy** + `generate.apply_*`) + **`outputs/generation-plan.md`**. Процедура: **`07-apply-layer.md`**, промпты **`execution/apply/*`**.

| Результат | Успешная materialization |
|-----------|---------------------------|
| **Успех** | Целевое дерево содержит все строки **`generated_templates_to_apply`** с `generate.* = true`; bundled строки выполнены при `apply_bundled_copy`; отсутствуют записи из **`excluded_items`**; созданы **`outputs/apply-report.md`** и (рекомендуется) **`outputs/applied-project-structure.md`**. |
| **new_project** | Минимум: root docs тройка + env examples для включённых слоёв + список каталогов из plan; bundled модули при включённых switches. |
| **dry_run_only** | Файлы целевого репо **не** обязательны; обязательны отчёты apply + структура «как было бы». |
| **existing_repo** | Запрещено перезаписывать существующие файлы без **`apply.overwrite_policy`** ≠ `safe_no_overwrite` или без решения оператора; коллизии → `apply-report.md`. |

См. **`references/apply-rules.md`**, **`04`** не дублирует движок — только контракт ожидаемых артефактов.

---

## 7. Bullrun usage outputs (v2.1)

После Apply + initial task emission должны существовать:

- `outputs/initial-task-emission.md`
- `outputs/task-indexes-created.md`
- task-файлы в `*/docs/analysis/tasks/` по контекстным зонам
- тематические `*-index.md` (по необходимости зоны)
- handoff-готовность к `/.cursor/commands/bullrun-start.md`

### Обязательные task zones

- `docs/analysis/tasks/` (global) — всегда
- локальные зоны для включённых слоёв (`node`, `contracts`, `arweave-uploader`, `wallet`, `scripts`, `security`, `gpt`) — если слой в scope

### Когда индекс обязателен

- при наличии >=3 задач в зоне;
- или при наличии нескольких подсекций/подсистем с независимыми статусами;
- или если зона используется как вход для bullrun-прогонов.

### Handoff-ready state

Считается готовым, если:

1. apply завершён или dry-run задокументирован;
2. initial tasks созданы по task-standard;
3. индексы созданы/обновлены по index-standard;
4. агент остановился и предложил продолжение через `bullrun-start.md`.

---

## 8. Версия

- **v2.1** — Usage layer: initial task emission + task indexes + handoff к `bullrun-start.md`.
- **v2.0** — Apply layer: materialization по plan + bundled/template/skip; `07-apply-layer.md`, `execution/apply/*`, apply outputs.
- **v1.9** — Scripts-aware mixed layer (сохранён).
- **v1.8** — Bundled prototype modules: wallet + arweave-uploader **copy as is** (primary), docs/env/generated around; optional uploader scaffold; §2.5.

- **v1.7** — Uploader-aware decisions и архитектурная рамка (сохранена); stubs понижены в приоритете.
- **v1.6** — GPT-aware outputs и switches по `gpt.*`.
- **v1.5** — security outputs и switches по `security.*`.
- **v1.3** — условная генерация по summary + wallet outputs по `wallet_strategy`.
- **v1.2** — условная генерация по summary.
- История: `CHANGELOG.md`.
