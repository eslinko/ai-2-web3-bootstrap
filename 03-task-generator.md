# Task generator — v1.8 (rule-based procedure)

## Вход

- `outputs/interview-summary.md` (обязательно: **Decision table**, **Generation switches**, **Enabled layers**)
- `references/bootstrap-decision-matrix.md`
- `references/output-selection-rules.md`
- Внешний `task-standard` (опционально) — расширяет поля задачи, не заменяет правила ниже

## Выход

- `outputs/task-backlog.md` — упорядоченный список с **phase** и **deps**

---

## 1. Mapping rules (если → категория задач)

| Условие (из summary) | Включить категорию / префикс id |
|----------------------|--------------------------------|
| `layer.contracts` | `contracts-bootstrap`, `hardhat-compile`, `deploy-router-wire` |
| `layer.node` | `node-bootstrap`, `api-health`, `middleware-order-doc` |
| `layer.arweave_uploader` | `uploader-bootstrap`, `callback-contract`, `keys-instructions` |
| `uploader.delivery_mode = bundled_module` | `uploader-bundled-copy`, sync env/docs с эталоном |
| `uploader.delivery_mode = scaffold_only` | `uploader-scaffold-from-templates`, `uploader-pipeline-boundaries` (если нужны объясняющие stubs) |
| `uploader.enabled = true` | `uploader-ingest-auth-doc`; pipeline-stub задачи — только при `code_uploader_scaffold_helpers` |
| `uploader.mode` в (`real_publish`, `hybrid`) | `uploader-real-publish`, `arweave-relay-prod-checklist` |
| `uploader.mode = mock_only` | `uploader-mock-publish-alignment`, `BACKEND_USE_MOCK-docs` (если есть нода/callback) |
| `uploader.caller_auth_mode` в (`jwt_upload_token`, `mixed`) | `uploader-jwt-trust-alignment`, `upload-token-verify-keys-doc` |
| `uploader.verification_mode` в (`signed_data_item_required`, `mixed`) | `uploader-signed-payload-verification`, `wallet-boundary-doc` |
| `uploader.publish_mode = bundle_relay` | `uploader-bundle-relay-contract` |
| `uploader.publish_mode = direct_tx` | `uploader-direct-tx-assumptions` (Phase 0 уточнение сети) |
| `uploader.callback_mode` в (`backend_callback_required`, `optional`) | `uploader-backend-callback-sync`, `callback-auth-secret-alignment` |
| `uploader.payload_contract_mode = strict` | `uploader-payload-schema-source`, `cross-layer-payload-contract` (node/GPT при необходимости) |
| `uploader.wallet_dependency_mode = external_signer_required` | `uploader-external-signer-integration` |
| `storage.profile = arweave_real` | `uploader-jwk`, `relay-auth` (усиление реального publish) |
| `storage.profile = mock_only` | `mock-alignment`, `BACKEND_USE_MOCK-docs` |
| `layer.custom_gpt` **или** channel GPT Actions | `gpt-instructions-skeleton`, `openapi-gpt-alignment` |
| `auth.model` включает HMAC | `hmac-middleware`, `partner-integration-doc` |
| `auth.model` включает Bearer | `gpt-bearer-env`, `bearer-middleware-order` |
| `security.api_auth_mode = hmac` | `security-hmac-contract` |
| `security.gpt_actions_protection = bearer` | `security-gpt-bearer` |
| `security.edge_auth_mode != none` | `security-edge-auth` |
| `security.upload_token_mode = jwt_rs256` | `security-upload-jwt` |
| `security.wallet_auth_mode = challenge_signature` | `security-wallet-auth` |
| `security.arweave_signing_mode = mock_jwk` | `security-arweave-signing` |
| `security.evm_signing_mode = node_private_key` | `security-evm-node-key` |
| `security.evm_signing_mode = wallet_mock_runner` | `security-evm-wallet-runner` |
| `security.secrets_source = vault` или `hybrid` | `security-vault-bootstrap`, `security-secrets-contract` |
| `gpt.enabled = true` | `gpt-layer-bootstrap`, `gpt-ingest-boundaries` |
| `gpt.elicitation_mode = guided_interview` | `gpt-dialogue-guided` |
| `gpt.elicitation_mode = open_exploration` | `gpt-dialogue-open` |
| `gpt.output_structure_mode = strict_json` | `gpt-output-contract`, `gpt-schema-versioning` |
| `gpt.output_structure_mode = multi_stage` | `gpt-multi-stage-handoff` |
| `gpt.rulebook_mode = required` | `gpt-rulebook-required`, `gpt-validation-gate` |
| `gpt.backend_handoff_mode = service_mapped_json` | `gpt-service-mapping` |
| `gpt.backend_handoff_mode = event_mapped_json` | `gpt-event-mapping` |
| `gpt.actions_integration = enabled` | `gpt-actions-binding`, `gpt-security-alignment` |
| `layer.wallet_signing` (legacy) | уточнить через `wallet.layer_mode` |
| `wallet.layer_mode = bundled_mock_runner` **и** `layer.wallet_mock_runner` | `wallet-bundled-copy`, `wallet-mock-runner-bootstrap`, `floou-signing-e2e` (с uploader при Arweave-ветке) |
| `wallet.layer_mode = external_wallet_later` | **не** добавлять bundled mock-runner задачи; опционально `wallet-client-roadmap-doc` |
| `wallet.layer_mode = none` | нет wallet companion задач (кроме явного security wallet-auth на ноде) |
| legacy `wallet_strategy = hybrid_transition` | трактовать как bundled + `wallet-migration-hooks` |
| `scripts.enabled` **и** `layer.scripts` | категория `scripts-bootstrap`; детализация по `scripts.*`: `orchestration_scaffold` + `router_based` → `scripts-router-stub`, `phase_based` → `scripts-phase-validator-stub`, `shell_glue` → `scripts-shell-smoke-sync`, `deployment_spec != none` → `deployment-spec-doc`, `tests_harness != exclude` → `scripts-harness-reference` (без full эталонного harness) |
| `scripts.enabled = false` | не добавлять scripts-bootstrap задачи |
| `deployment.profile = local_only` | `smoke-health`, `local-env-profile` |
| Apply phase (v2.0) | при `apply.target_mode != dry_run_only`: `apply-bootstrap-run`, `post-apply-env-fill`; при dry-run — только `apply-plan-validation` |
| `contract.strategy = active_token_layer` | `blockchain-service-boundaries`, `registry-integration` |
| Telegram channel | `telegram-handlers-stub`, `webapp-url-env` |

Не добавлять задачи, если слой **false** в Enabled layers (кроме явного «deferred» в Pending).

---

## 2. Task phase rules

| Phase | Имя | Содержание |
|-------|-----|------------|
| 0 | Decisions / interfaces / env | Зафиксировать summary, env groups, границы API (OpenAPI контур) |
| 1 | Scaffold & health | Нода + (опц.) contracts compile + uploader listen; smoke |
| 2 | Core data Floou | Потоки DATA_FLOOU, upload_id correlation, callback путь |
| 3 | Integrations | GPT↔API, HMAC partner, wallet push, Supabase если включено |
| 4 | Hardening / CI / sync / polish | Отложено, если `deployment.profile = local_only` и явно не запрошено |

---

## 3. Minimal dependency heuristics (не полный граф)

Жёсткий порядок «раньше → позже»:

1. **Env / secrets contract** (Phase 0) перед любым runtime.
2. **OpenAPI / Pydantic контуры** (Phase 0–1) перед **GPT binding** (Phase 3).
3. **Contracts compile** (Phase 1) перед **node chain integration** (Phase 2–3).
4. **Uploader callback secret alignment** (Phase 1–2) перед **e2e crystallization** (Phase 2–3).

Мягкие связи (указывать в поле `deps` как id):

- `node-health` → `uploader-health` → `smoke-script`
- `registry-deploy` → `sync-artifacts-to-node` (если contracts + node)

---

## 4. Output shape discipline (обязательные поля задачи)

Каждая задача в backlog **до** внешнего task-standard:

| Поле | Описание |
|------|----------|
| `id` | Уникальный строковый id |
| `title` | Одна строка |
| `phase` | 0–4 |
| `category` | Из mapping rules |
| `goal` | Зачем |
| `acceptance` | Как проверить |
| `deps` | Список id или `[]` |
| `trigger_from_summary` | Какое решение/switch включило задачу |
| `owner_skill` | rough: backend, contracts, devops, docs |

Внешний **task-standard** может добавить: AC детализацию, тесты, ссылки на репо.

---

## 5. Правила

- Не генерировать задачи «из эталона Amanita», если слой **excluded** в summary.
- Противоречия summary → стоп или задача «resolve decision D#» в Phase 0.
