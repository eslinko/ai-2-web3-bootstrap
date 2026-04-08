# Bootstrap decision matrix (v2.0)

Центральный мост: **interview → summary → tasks → outputs**.  
Значения в колонках «Affects» — теги для скриптов/чеклистов, не обязательно отдельные файлы.

| Decision | Possible values | Affects folders | Affects docs | Affects env | Affects code | Affects tasks | Affects output shape |
|----------|-----------------|-----------------|--------------|-------------|--------------|---------------|----------------------|
| `layer.node` | true / false | `node/` | `docs/node/**`, root DATA_FLOOU | `node.env.example` | `templates/code/node/**` | node-bootstrap, smoke | включает/выключает node outputs |
| `layer.contracts` | true / false | `contracts/` | `docs/contracts/**` | `root.env`, `contracts.env` | hardhat + deploy_router | contracts-bootstrap, compile | глубина/наличие contracts outputs |
| `layer.arweave_uploader` | true / false | `arweave-uploader/` | `docs/arweave-uploader/**` | `arweave.env.example` | **bundled** эталон **или** scaffold (см. `uploader.delivery_mode`) | uploader, callback | bundled vs generated split |
| `layer.custom_gpt` | true / false | `custom-gpt/` (instructions) | `docs/custom-gpt/**` | `GPT_ACTIONS_*` on node | — | gpt-instructions, openapi-align | включает custom-gpt docs pack |
| `layer.scripts` | true / false | `scripts/` | scripts docs по `scripts.*` | категории `scripts.env` при `env_scripts` | mixed scaffold из templates | scripts-bootstrap | coarse inclusion; деталь — `scripts.enabled` |
| `scripts.enabled` | true / false | `scripts/` | все `templates/docs/scripts/**` при true | `templates/env/scripts.env.example` | `templates/code/scripts/**` по режиму | scripts tasks + harness refs | мастер **generation** для слоя |
| `scripts.mode` | minimal_helpers / orchestration_scaffold / reference_only | — | глубина overview + runbook | — | router/config vs shell-only vs docs-mostly | orchestration vs ops tasks | output density |
| `scripts.deploy_pattern` | router_based / simple_named_scripts / defined_later | — | `DEPLOY_ORCHESTRATION_MODEL.md`, runbook | — | `code_scripts_router` | deploy entry tasks | router scaffold vs stubs |
| `scripts.validation_pattern` | phase_based / minimal_checks / none | — | `VALIDATION_MODEL.md` | — | `code_scripts_validators` | data-gate tasks | validator template vs none |
| `scripts.shell_glue` | enabled / disabled | `shell/` | `SHELL_GLUE.md` | URL/path groups in scripts env | sync/smoke templates | smoke/sync tasks | `code_scripts_shell_glue`, smoke |
| `scripts.deployment_spec` | json_spec_enabled / docs_only / none | `deployment/` | `DEPLOYMENT_SPEC.md` + README | spec path hints | JSON minimal example | spec alignment tasks | `docs_deployment_spec`, `scripts_json_spec` |
| `scripts.tests_harness` | reference_only / include_minimal / exclude | — | harness methodology | — | не full эталонный tests | harness/E2E task tags | `scripts_harness_reference` |
| `layer.wallet_signing` | true / false | (legacy) | pointer | — | — | use `wallet.layer_mode` + `layer.wallet_mock_runner` | legacy alias для wallet shape |
| `layer.wallet_mock_runner` | true / false | `wallet/mock-runner` (bundled) | `docs/wallet/**` | `wallet-mock.env.example` | **эталонная копия** mock-runner (+ опционально stubs) | wallet-mock-runner, floou-signing-e2e | `bundled_wallet_mock_runner` |
| `wallet.layer_mode` | bundled_mock_runner / external_wallet_later / none | `wallet/` | глубина wallet docs | mock env vs нет | bundled copy vs нет | signing backlog | primary wallet decision v1.8 |
| `wallet.prototype_policy` | fixed_single_user / defined_later | — | LIMITATIONS depth | — | — | prototype tasks | prototype vs deferred detail |
| `wallet.role` | signing_companion / externalized_later | — | SIGNING_COMPANION docs | — | — | companion vs external | clarifies intent |
| `wallet_strategy` | legacy mock_single_user / external_wallet_later / hybrid_transition | optional | маппится на `wallet.layer_mode` | — | — | — | **deprecated** в пользу `wallet.layer_mode` |
| `auth.model` | bearer_only / hmac_only / mixed | — | node middleware docs | HMAC + Bearer groups | middleware order | security tasks | auth sections in node outputs |
| `security.api_auth_mode` | hmac / bearer / mixed | `node/api/middleware/security` | `docs/security/AUTH_MODES.md` | HMAC/Bearer env groups | middleware skeleton toggles | security-auth | `generate.security_hmac` (+ bearer context) |
| `security.gpt_actions_protection` | bearer / none | — | `docs/security/INTERSERVICE_SECURITY.md` | `GPT_ACTIONS_BEARER_SECRET` | gpt bearer guard stub | gpt-security | `generate.security_bearer_gpt` |
| `security.edge_auth_mode` | shared_bearer / hmac / none | node↔uploader routes | `docs/security/INTERSERVICE_SECURITY.md` | `NODE_AUTH_TOKEN`/HMAC groups | edge auth guard stub | callback-security | `generate.security_edge_auth` |
| `security.upload_token_mode` | jwt_rs256 / none | uploader + node upload flow | `docs/security/SIGNING_ARCHITECTURE.md` | JWT private/public key groups | jwt token service stub | upload-token-security | `generate.security_jwt_upload` |
| `security.wallet_auth_mode` | challenge_signature / none | `node/api/security`, wallet routes | `docs/security/AUTH_MODES.md` | wallet auth ttl/domain groups | wallet auth guard/service stubs | wallet-auth | `generate.security_wallet_auth` |
| `security.arweave_signing_mode` | mock_jwk / external_signer_later | wallet/uploader signing boundaries | `docs/security/SIGNING_ARCHITECTURE.md` | Arweave JWK groups | arweave signer boundary stub | arweave-signing | `generate.security_arweave_signing` |
| `security.evm_signing_mode` | node_private_key / wallet_mock_runner / external_wallet_later | node services + wallet | `docs/security/SIGNING_ARCHITECTURE.md` | EVM key groups | evm signing boundary stub | evm-signing | `generate.security_evm_signing` |
| `security.secrets_source` | env_only / vault / hybrid | ops folders/env contracts | `docs/security/SECRETS_MANAGEMENT.md` | `VAULT_*` / env groups | secrets provider boundary stub | secrets-management | `generate.security_vault` |
| `gpt.enabled` | true / false | `custom-gpt/` + node ingest boundaries | `docs/gpt/**` | GPT channel vars | `services/gpt_*`, payload contracts | gpt-layer-bootstrap | включает GPT outputs switches |
| `gpt.elicitation_mode` | guided_interview / open_exploration / mixed | — | `docs/gpt/DIALOGUE_MODEL.md` | optional mode flags | ingest boundary behavior notes | gpt-dialogue-model | влияет на dialogue model depth |
| `gpt.output_structure_mode` | strict_json / json_plus_explanation / multi_stage | payload contract folders | `docs/gpt/OUTPUT_CONTRACT.md` | schema/version refs | `domain/contracts/gpt_payload/**` | gpt-contract | `generate.gpt_strict_json` + contract switches |
| `gpt.rulebook_mode` | required / optional / none | validation folders | `docs/gpt/RULEBOOK_MODEL.md` | rulebook refs | `services/gpt_validation/**` | gpt-rulebook | `generate.gpt_rulebook_required` |
| `gpt.rulebook_source` | single_document / multiple_documents / interview_defined_later | docs refs | `docs/gpt/RULEBOOK_MODEL.md` | source reference vars | validation source resolver stub | gpt-rulebook-source | docs refs/pending decisions shape |
| `gpt.backend_handoff_mode` | service_mapped_json / event_mapped_json / generic_structured_payload | mapping folders | `docs/gpt/BACKEND_HANDOFF.md` | handoff mode flag | `services/gpt_mapping/**` | gpt-handoff-mapping | `generate.gpt_event_mapping` / mapping switches |
| `gpt.domain_capture_type` | ideas_and_desires / requests_and_proposals / events_and_reports / custom | — | `docs/gpt/DIALOGUE_MODEL.md` | optional domain flag | ingest model hints | gpt-domain-capture | output section emphasis |
| `gpt.actions_integration` | enabled / disabled | actions integration docs | `docs/gpt/GPT_ARCHITECTURE.md` | bearer/security linkage vars | api integration boundaries | gpt-actions-integration | `generate.gpt_actions_integration` |
| `uploader.enabled` | true / false | `arweave-uploader/` | `docs/arweave-uploader/**` | `arweave.env.example` | bundled эталон + optional scaffold | uploader-bootstrap | `bundled_arweave_uploader`, scaffold flags |
| `uploader.delivery_mode` | bundled_module / scaffold_only / none | — | BUNDLED_MODULE_NOTES | env only vs full | **bundled copy** vs `templates/code/arweave-uploader` | plan copy vs stub | `bundled_modules_to_copy` |
| `uploader.mode` | mock_only / real_publish / hybrid | uploader + keys | publish/callback docs | `USE_REAL_ARWEAVE`, JWK relay | publish boundary | uploader-mock-real-split | `uploader_real_publish` |
| `uploader.caller_auth_mode` | shared_bearer / jwt_upload_token / mixed | ingress | `INGRESS_AND_AUTH.md` | `RELAY_AUTH_TOKEN`, JWT public | `src/auth`, `src/verification` | uploader-ingress-trust | `uploader_jwt_upload`, relay vars |
| `uploader.verification_mode` | signed_data_item_required / token_only / mixed | verification | `VERIFICATION_MODEL.md` | JWT + crypto env classes | `src/verification` | uploader-crypto-gate | `uploader_signed_data_item` |
| `uploader.publish_mode` | bundle_relay / direct_tx / defined_later | publish | `PUBLISH_AND_CALLBACK.md` | network vars | `src/publish` | uploader-publish-path | publish stub shape |
| `uploader.callback_mode` | backend_callback_required / optional / none | callback | `PUBLISH_AND_CALLBACK.md` | `BACKEND_URL`, `NODE_AUTH_TOKEN` | `src/callback` | uploader-backend-sync | `uploader_backend_callback` |
| `uploader.payload_contract_mode` | strict / validated_upstream / minimal | payload | `PAYLOAD_CONTRACT.md` | optional strict flags | `src/payload` | uploader-payload-contract | `docs_uploader_contract` |
| `uploader.wallet_dependency_mode` | external_signer_required / mock_wallet_supported / defined_later | wallet docs cross-ref | `VERIFICATION_MODEL.md` § boundary | mock wallet env | wallet stubs linkage | uploader-signer-dependency | wallet + uploader task coupling |
| `deployment.profile` | local_only / staged / production_ready_later | — | DEPLOYMENT.md глубина | Vault vars optional | — | phase 4 deferred | deployment docs depth |
| `storage.profile` | mock_only / arweave_real / hybrid | — | arweave REAL vs MOCK notes | USE_REAL, JWK | uploader real vs mock | keys, mock tasks | arweave key/readme shape |
| `contract.strategy` | registry_scaffold_only / tokenization_planned / active_token_layer | depth of `contracts/` | TOKENIZATION depth | deploy vars | — | chain integration | contracts depth shape |
| `channel.gpt_actions` | true / false | — | custom-gpt if layer on | Bearer on node | — | OpenAPI bind | GPT channel docs/task shape |
| `channel.telegram` | true / false | `handlers/` | — | TELEGRAM_*, WALLET_APP_URL | handlers stub | telegram | telegram outputs shape |
| `channel.uploader_callbacks` | true / false | — | uploads route doc | EDGE/NODE_AUTH sync | — | callback contract | callback outputs shape |
| `docs_depth` | minimal / standard / full | — | количество файлов в root/node/… | — | — | docs-bootstrap size | global docs density |
| `exclude_donor_patterns` | list | не копировать triage-пути | — | — | — | — | excluded outputs list |
| `apply.target_mode` | new_project / existing_repo / dry_run_only | target root | — | — | apply phase tasks | apply-report shape |
| `apply.overwrite_policy` | safe_no_overwrite / replace_generated_only / defined_later | — | — | — | apply safety | collision handling |
| `apply.bundled_copy_mode` | copy_enabled / copy_disabled | bundled dirs | — | physical bundled copy | apply queue | `generate.apply_bundled_copy` |
| `apply.optional_scaffolds_mode` | skip_optional / include_optional / defined_later | optional stubs | — | optional template dirs | apply queue | `generate.apply_optional_scaffolds` |
| `generate.apply_bundled_copy` | true / false | — | — | bundled copy step | apply | derived from `apply.bundled_copy_mode` |
| `generate.apply_optional_scaffolds` | true / false | — | — | optional scaffolds | apply | derived from `apply.optional_scaffolds_mode` |

**Связка wallet:** при `wallet.layer_mode = bundled_mock_runner` ожидается `layer.wallet_mock_runner = true` и `layer.node = true`; при `external_wallet_later` / `none` — `layer.wallet_mock_runner = false`. Подробности: `references/mock-wallet-pattern.md`, `references/bundled-modules-strategy.md`.

**Связка uploader:** default **`uploader.delivery_mode = bundled_module`**; кастомизация ядра на prototype stage не ожидается — env, payload, callback semantics.

**Использование:** каждая строка interview → заполнить столбец value → проставить affects → заполнить `Generation switches` в summary.
