# Output selection rules (v2.0)

Правила **когда** включать шаблоны; цель — не раздувать маленький проект до полного монорепо.

**Вход:** `outputs/interview-summary.md` (Enabled layers, Generation switches, `docs_depth`).

---

## 1. Starter docs

| Условие | Включить | Пропустить / урезать |
|---------|----------|----------------------|
| `layer.node = true` | `docs/node/**` standard | — |
| `layer.node = false` | — | весь `docs/node/`; в root указать «no HTTP API in repo» |
| `layer.custom_gpt = false` | — | `docs/custom-gpt/**`; в PROJECT_INDEX: not in scope |
| `layer.custom_gpt = true` | минимум INSTRUCTION_SYSTEM + AI_TO_APP_HANDOFF | OUTPUT_SCHEMA если нет OpenAPI yet — пометить stub |
| `layer.contracts = true` и `contract.strategy = registry_scaffold_only` | README + HARDHAT_SETUP + короткий CONTRACT_ARCHITECTURE | TOKENIZATION_FLOOU: только заголовки и hooks |
| `layer.arweave_uploader = false` | — | `docs/arweave-uploader/**`; DATA_FLOOU без отдельного uploader-сервиса |
| `docs_depth = minimal` | root тройка + только docs для enabled слоёв (README each) | CACHE_LAYER, длинные pipeline docs |
| `docs_depth = full` | все файлы из templates/docs для enabled слоёв | — |
| любой включённый `generate.security_*` | `docs/security/**` | нельзя сводить к «one auth»; оставить разделение контуров |

---

## 2. Starter code

| Условие | Включить | Урезать |
|---------|----------|---------|
| Любой проект с `layer.node` | `templates/code/node/` | — |
| `layer.contracts = false` | — | не копировать `templates/code/contracts/` |
| `layer.arweave_uploader = false` | — | не копировать uploader starter |
| `generate.code_security = true` | `templates/code/node/api/middleware/security/**`, `templates/code/node/api/security/**`, `templates/code/node/services/signing/**`, `templates/code/node/services/auth/**` | не копировать runtime-реализацию, только boundary stubs |
| `lightweight_project` (флаг в summary: мало слоёв) | только node **или** только contracts, не оба если не нужно | убрать `scripts/smoke` если нет uploader и нода без второго сервиса — smoke только node |

**Lightweight:** если `enabled_layers_count <= 2` — по умолчанию один smoke target (см. interview).

---

## 3. Env groups

| Слои | Обязательные env-файлы |
|------|------------------------|
| contracts only | `root.env` или `contracts.env` |
| node only | `node.env` (урезанный без WEB3 если нет chain) |
| node + contracts | root + node + shared-vars |
| + uploader | + arweave.env |
| GPT Actions | секции Bearer в node.env |
| HMAC | секции HMAC в node.env |
| Mock wallet / bundled companion (`layer.wallet_mock_runner` или `wallet.layer_mode = bundled_mock_runner`) | + `wallet-mock.env.example`; **fixed mock identity**, node URL, uploader URL, Arweave/EVM refs — см. `templates/env/wallet-mock.env.example` и `shared-vars-catalog` §5 |
| Security layer | + `security.env.example` (группы HMAC/Bearer/JWT/Arweave/EVM/Vault) |
| Без secrets в v1 | оставить пустые ключи + комментарии «fill before staging» |

---

## 4. Wallet (`wallet.layer_mode`, `layer.wallet_mock_runner`)

| Условие | `docs_wallet` | `code_wallet_mock` | `env_wallet_mock` | `bundled_wallet_mock_runner` | Примечание |
|---------|---------------|--------------------|--------------------|------------------------------|------------|
| `wallet.layer_mode = external_wallet_later` | минимум roadmap (`WALLET_STRATEGY.md` и др.) | false | false | false | Подпись вне репозитория. |
| `wallet.layer_mode = none` | false (или только указатель в root по желанию) | false | false | false | Нет signing client в scope. |
| `wallet.layer_mode = bundled_mock_runner` **и** `layer.wallet_mock_runner` **и** `layer.node` | true: `templates/docs/wallet/**` (минимум OVERVIEW + RUNTIME + LIMITATIONS при `minimal`) | true (маркер «wallet-код в репо») | true | true | **Primary:** копия эталонного `wallet/mock-runner/` в `bundled_modules_to_copy`; stubs из `templates/code/wallet` — secondary. |
| bundled **но** `layer.node = false` | **invalid** — C7 в `01` | — | — | — | — |

Legacy: `wallet_strategy` из старых summary трактовать по маппингу в `01-interview-orchestrator.md` §2.8.

**Связь с uploader:** companion подписывает Data Item и вызывает uploader при crystallize, если uploader в scope. См. `templates/docs/arweave-uploader/BUNDLED_MODULE_NOTES.md`.

---

## 5. Не копировать из паттерна монорепо

- Второй deploy router, если `layer.scripts = false`.
- Полный набор validators, если нет каталога on-chain.
- Дубли `wallet/` и `ReferenceWallet/`.
- Ключи, бэкапы, zip — из triage.

---

## 6. Security (auth/signing/secrets decisions)

| Условие | Включить docs | Включить env | Включить code |
|---------|---------------|--------------|---------------|
| `security.api_auth_mode = hmac` | `AUTH_MODES.md` (HMAC секции) | `security_hmac` + `env_security` | middleware `hmac` stub |
| `security.api_auth_mode` включает bearer | `AUTH_MODES.md` (Bearer секции) | `security_bearer_gpt` при GPT режиме | bearer guard stub |
| `security.edge_auth_mode = shared_bearer` | `INTERSERVICE_SECURITY.md` edge bearer | `security_edge_auth` + NODE/EDGE token vars | edge bearer verifier stub |
| `security.upload_token_mode = jwt_rs256` | `SIGNING_ARCHITECTURE.md` JWT upload | `security_jwt_upload` + key classes | jwt signer/verifier boundary stubs |
| `security.wallet_auth_mode = challenge_signature` | `AUTH_MODES.md` wallet-auth | `security_wallet_auth` | wallet-auth service/guard stubs |
| `security.arweave_signing_mode = mock_jwk` | `SIGNING_ARCHITECTURE.md` Arweave JWK | `security_arweave_signing` | arweave signing boundary stub |
| `security.evm_signing_mode` != `external_wallet_later` | `SIGNING_ARCHITECTURE.md` EVM | `security_evm_signing` | evm signing boundary stub |
| `security.secrets_source` включает vault | `SECRETS_MANAGEMENT.md` Vault | `security_vault` + `VAULT_*` groups | secrets provider stub |

---

## 7. GPT layer (`gpt.*` decisions)

| Условие | Включить docs | Включить env | Включить code |
|---------|---------------|--------------|---------------|
| `gpt.enabled = true` | `templates/docs/gpt/GPT_ARCHITECTURE.md`, `DIALOGUE_MODEL.md`, `BACKEND_HANDOFF.md` | GPT channel vars в node/security env | `services/gpt_ingest/**`, `services/gpt_mapping/**` boundaries |
| `gpt.rulebook_mode = required` | `RULEBOOK_MODEL.md` обязателен | rulebook source refs (если заданы) | `services/gpt_validation/**` boundaries |
| `gpt.rulebook_mode = optional` | `RULEBOOK_MODEL.md` как optional section | optional refs | validation stubs optional |
| `gpt.output_structure_mode = strict_json` | `OUTPUT_CONTRACT.md` обязателен | schema/contract version refs | `domain/contracts/gpt_payload/**`, contract stubs |
| `gpt.output_structure_mode = json_plus_explanation` | `OUTPUT_CONTRACT.md` + section dual output | optional mode flag | contract stub + presenter mapping stub |
| `gpt.output_structure_mode = multi_stage` | `OUTPUT_CONTRACT.md` + stage flow section | stage flags optional | ingest/validation/mapping boundaries all on |
| `gpt.backend_handoff_mode = event_mapped_json` | `BACKEND_HANDOFF.md` event mapping section | event channel refs optional | `code_gpt_service_mapping=true` with event mapper stubs |
| `gpt.backend_handoff_mode = service_mapped_json` | `BACKEND_HANDOFF.md` service mapping section | service refs optional | service mapper stubs |
| `gpt.actions_integration = enabled` | GPT architecture + auth linkage sections | Bearer/security linkage refs | integration boundaries in node api/service |

**Лёгкий GPT слой:** `gpt.enabled=true`, `gpt.rulebook_mode=none`, `gpt.output_structure_mode=json_plus_explanation`, `gpt.backend_handoff_mode=generic_structured_payload` → только базовые docs + ingest boundary.

**Расширенный GPT слой:** strict_json + required rulebook + mapped handoff → полный набор docs + contracts + validation/mapping stubs.

---

## 8. Arweave uploader layer (`uploader.*`, `uploader.delivery_mode`)

**Базовое условие:** `uploader.enabled = true` и `layer.arweave_uploader = true`.

**Primary (default):** `uploader.delivery_mode = bundled_module` — **код** берётся из **`bundled_modules_to_copy` → эталонный `arweave-uploader/`**; шаблонные `templates/code/arweave-uploader/src/**` **не** обязательны.

| Условие | Docs | Env | Code |
|---------|------|-----|------|
| Uploader в scope | `UPLOADER_ARCHITECTURE.md` + `BUNDLED_MODULE_NOTES.md` + потоковые файлы по режимам | `arweave.env.example` | **Bundled:** эталонный пакет; **scaffold_only:** `templates/code/arweave-uploader/**` |
| `docs_uploader_architecture` | полный/урезанный набор architecture docs | как выше | bundled **или** stubs только если `code_uploader_scaffold_helpers` |
| `docs_uploader_contract` | + `PAYLOAD_CONTRACT.md` | комментарии к контракту | optional `src/payload/**` только при scaffold helpers |
| `docs_uploader_callback` | + `INGRESS_AND_AUTH.md`, `PUBLISH_AND_CALLBACK.md` | callback классы | optional `src/callback/**` при scaffold helpers |
| `bundled_arweave_uploader` | как выше | как выше | **copy as is** эталона |
| `code_uploader_scaffold_helpers` | ссылки в ARCHITECTURE / `src/OPTIONAL_SCAFFOLD_README.md` | — | `src/{ingest,auth,verification,payload,publish,callback}/**` |
| `uploader_real_publish` | real path в docs | relay JWK + network | в **bundled** — настройка эталонного кода env |
| `uploader_signed_data_item` | `VERIFICATION_MODEL.md` | — | bundled core **или** verification stubs |
| `uploader_jwt_upload` | INGRESS + security | JWT public на uploader | bundled **или** stub |
| `uploader_backend_callback` | PUBLISH_AND_CALLBACK | edge auth классы | bundled **или** stub |

**`delivery_mode = scaffold_only`:** нет обязательной bundled-копии; включить `templates/code/arweave-uploader` и/или собственную реализацию — зафиксировать в plan.

**Лёгкий mock-only:** укороченные docs + env mock flags; ядро всё равно может быть **bundled** эталоном с `USE_REAL_ARWEAVE=false`.

Доп. канон: `references/uploader-bundled-transition-notes.md`.

---

## 10. Scripts layer (`scripts.*`, mixed scaffold)

**Базовое условие:** `scripts.enabled = true` **и** `layer.scripts = true`. Иначе не включать scripts starter (кроме явного triage: один pointer в root — по усмотрению).

| Нужно включить | Условие |
|----------------|---------|
| Docs `templates/docs/scripts/` (overview + модели) | `generate.docs_scripts_architecture` → минимум `SCRIPTS_LAYER_OVERVIEW.md` и модели по подрежимам |
| Runbook / orchestration docs (`generate.docs_scripts_runbook`) | `scripts.mode = orchestration_scaffold` или `scripts.deploy_pattern != defined_later` или есть связь scripts с contracts/node/uploader |
| Router scaffold `templates/code/scripts/router/` | `generate.code_scripts_router` — обычно `deploy_pattern = router_based` и `mode = orchestration_scaffold` |
| Config + helpers `config/`, `lib/` | `generate.code_scripts_helpers` — `minimal_helpers` или `orchestration_scaffold` |
| Shell glue `templates/code/scripts/shell/` | `generate.code_scripts_shell_glue` при `scripts.shell_glue = enabled` |
| Smoke `deploy/floou_health_smoke.sh` | `generate.code_scripts_smoke` — чаще при `shell_glue = enabled` и наличии node или uploader для URL |
| Validators stub | `generate.code_scripts_validators` при `scripts.validation_pattern = phase_based` |
| Акцент phase validation в docs | `generate.scripts_phase_validation` при `phase_based` |
| Deployment spec README + пример папки `deployment/` | `generate.docs_deployment_spec` при `deployment_spec != none` |
| Минимальный JSON пример pipeline | `generate.scripts_json_spec` при `deployment_spec = json_spec_enabled` |
| Harness reference (docs/tasks) | `generate.scripts_harness_reference` при `tests_harness` в `reference_only` или `include_minimal` |
| `templates/env/scripts.env.example` | `generate.env_scripts` при потребности в категориях env для automation |
| Только reference | `scripts.mode = reference_only` — преимущественно docs; router-код не обязателен без отдельного switch |

**Не включать по умолчанию:** эталонный `lib/actions`, полный `validators/`, `scripts/tests`, `quick_start_automation.sh`, `deploy_full.old.js`, `Untitled`, канон **`variant-a.json`** — см. `references/scripts-abstraction-rules.md`.

**Связь с Floou/GPT:** deployment spec и runbook могут ссылаться на GPT handoff и node ingest — держать cross-links в `SCRIPTS_LAYER_OVERVIEW.md`, не дублировать OpenAPI.

---

## 11. Связь с матрицей

Каждое правило выше должно иметь строку-обоснование в `bootstrap-decision-matrix.md` или в Decision table summary. Решения **`apply.*`** — отдельные строки матрицы v2.0.

---

## 12. Apply phase (v2.0)

| Условие | Поведение |
|---------|-----------|
| `apply.target_mode = dry_run_only` | План и отчёты **без** записи файлов в целевой репозиторий |
| `apply.overwrite_policy = safe_no_overwrite` | Существующие файлы не трогать; коллизия → `apply-report.md` |
| `generate.apply_bundled_copy = false` | Строки bundled в plan могут оставаться как **reference**, исполнитель apply **не** копирует эталон |
| `apply_optional_scaffolds = false` | Не применять optional pipeline stubs и прочие optional из plan |

Полная процедура: **`07-apply-layer.md`**, **`references/apply-rules.md`**.

---

Доп. канон по mock wallet: `references/mock-wallet-pattern.md`, `references/wallet-bundled-prototype.md`, `references/bundled-modules-strategy.md`.
Доп. канон по security surface: `references/security-crypto-inventory.md`.
Доп. канон по uploader: `references/arweave-uploader-architecture-extraction.md`.
