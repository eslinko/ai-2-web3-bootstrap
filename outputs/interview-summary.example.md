# Interview summary — EXAMPLE (Acme-style, v2.0 apply-layer)

Не использовать как продакшен-проект — только образец заполнения.

## Meta

- project_name: Acme Protocol
- project_slug: acme
- date: 2026-04-08
- bootstrap_system_version: 2.0
- participants: operator, agent

## Enabled layers

| layer | enabled |
|-------|---------|
| node | true |
| contracts | true |
| arweave_uploader | true |
| custom_gpt | true |
| scripts | true |
| wallet_signing | false |
| wallet_mock_runner | true |

## Excluded layers

- none (wallet включён как bundled companion)

## Decision table

| decision_id | question_key | value | affects |
|-------------|--------------|-------|---------|
| D1 | auth.model | mixed | node, env |
| D2 | deployment.profile | local_only | env, tasks |
| D3 | storage.profile | mock_only | uploader, env |
| D4 | contract.strategy | registry_scaffold_only | contracts, docs |
| D5 | docs_depth | standard | docs |
| D6 | wallet.layer_mode | bundled_mock_runner | wallet, bundled |
| D7 | wallet.prototype_policy | fixed_single_user | wallet |
| D8 | wallet.role | signing_companion | wallet |
| D9 | security.api_auth_mode | mixed | security |
| D10 | security.gpt_actions_protection | bearer | security |
| D11 | security.edge_auth_mode | shared_bearer | security |
| D12 | security.upload_token_mode | jwt_rs256 | security |
| D13 | security.wallet_auth_mode | challenge_signature | security |
| D14 | security.arweave_signing_mode | mock_jwk | security |
| D15 | security.evm_signing_mode | node_private_key | security |
| D16 | security.secrets_source | env_only | security |
| D17 | gpt.enabled | true | gpt |
| D18 | gpt.elicitation_mode | mixed | gpt |
| D19 | gpt.output_structure_mode | strict_json | gpt |
| D20 | gpt.rulebook_mode | required | gpt |
| D21 | gpt.rulebook_source | single_document | gpt |
| D22 | gpt.backend_handoff_mode | service_mapped_json | gpt |
| D23 | gpt.domain_capture_type | ideas_and_desires | gpt |
| D24 | gpt.actions_integration | enabled | gpt |
| D25 | uploader.enabled | true | uploader |
| D26 | uploader.delivery_mode | bundled_module | uploader, bundled |
| D27 | uploader.mode | mock_only | uploader |
| D28 | uploader.caller_auth_mode | mixed | uploader |
| D29 | uploader.verification_mode | mixed | uploader |
| D30 | uploader.publish_mode | bundle_relay | uploader |
| D31 | uploader.callback_mode | optional | uploader |
| D32 | uploader.payload_contract_mode | strict | uploader |
| D33 | uploader.wallet_dependency_mode | mock_wallet_supported | uploader |
| D34 | scripts.enabled | true | scripts |
| D35 | scripts.mode | orchestration_scaffold | scripts |
| D36 | scripts.deploy_pattern | router_based | scripts |
| D37 | scripts.validation_pattern | phase_based | scripts |
| D38 | scripts.shell_glue | enabled | scripts |
| D39 | scripts.deployment_spec | json_spec_enabled | scripts |
| D40 | scripts.tests_harness | reference_only | scripts |
| D41 | apply.target_mode | new_project | apply |
| D42 | apply.overwrite_policy | safe_no_overwrite | apply |
| D43 | apply.bundled_copy_mode | copy_enabled | apply |
| D44 | apply.optional_scaffolds_mode | skip_optional | apply |

## Security decisions

- api_auth_mode: mixed
- gpt_actions_protection: bearer
- edge_auth_mode: shared_bearer
- upload_token_mode: jwt_rs256
- wallet_auth_mode: challenge_signature
- arweave_signing_mode: mock_jwk
- evm_signing_mode: node_private_key
- secrets_source: env_only

## Auth modes by channel

- GPT: bearer
- Edge callbacks: shared_bearer
- Commerce: hmac

## Signing modes

- Upload token: jwt_rs256
- Arweave: mock_jwk
- EVM: node_private_key

## Secrets source

- env_only

## Wallet prototype decisions

- layer_mode: bundled_mock_runner
- prototype_policy: fixed_single_user
- role: signing_companion

## GPT layer decisions

- enabled: true
- elicitation_mode: mixed
- output_structure_mode: strict_json
- rulebook_mode: required
- rulebook_source: single_document
- backend_handoff_mode: service_mapped_json
- domain_capture_type: ideas_and_desires
- actions_integration: enabled

## Dialogue / elicitation model

- mixed (guided + open clarification)

## Rulebook / validation model

- required + single document source

## GPT output contract

- strict_json, versioned payload expected

## Backend handoff model

- service_mapped_json

## Uploader layer decisions

- enabled: true
- delivery_mode: bundled_module
- mode: mock_only
- caller_auth_mode: mixed
- verification_mode: mixed
- publish_mode: bundle_relay
- callback_mode: optional
- payload_contract_mode: strict
- wallet_dependency_mode: mock_wallet_supported

## Uploader ingress model

- HTTP ingress по контракту эталонного uploader; caller trust: relay bearer + upload JWT

## Uploader verification model

- mixed: JWT + проверка signed Data Item в **bundled** ядре эталона

## Uploader publish model

- bundle_relay; mock_only — без обязательного on-chain в dev

## Uploader callback model

- optional backend sync (URL + shared secrets с node)

## Uploader payload contract

- strict: SSOT схемы согласовать с node/GPT при интеграции

## Scripts layer decisions

- enabled: true
- mode: orchestration_scaffold
- deploy_pattern: router_based
- validation_pattern: phase_based
- shell_glue: enabled
- deployment_spec: json_spec_enabled
- tests_harness: reference_only

## Deploy / orchestration model (scripts)

- Router-based entry; named scripts не исключены для точечных задач

## Validation model (scripts)

- Phase-based stub + docs; не полный эталон validators

## Shell glue model

- enabled: sync + smoke шаблоны

## Deployment spec model

- JSON minimal example + README формата

## Scripts testing / harness model

- reference_only: методология в docs/tasks, без полного harness

## Apply strategy

- apply.target_mode: new_project
- apply.overwrite_policy: safe_no_overwrite
- apply.bundled_copy_mode: copy_enabled
- apply.optional_scaffolds_mode: skip_optional

## Apply constraints

- apply.target_root: (указать при первом apply)
- apply.donor_repo_ref: (эталонный монорепо для bundled copy)
- apply.notes:

## Generation switches

```yaml
generate:
  docs_root: true
  docs_node: true
  docs_contracts: true
  docs_custom_gpt: true
  docs_arweave: true
  docs_wallet: true
  docs_gpt_architecture: true
  docs_gpt_rulebook: true
  docs_gpt_output_contract: true
  docs_security: true
  docs_tasks: true
  code_node: true
  code_contracts: true
  code_uploader: true
  code_uploader_scaffold_helpers: false
  bundled_wallet_mock_runner: true
  bundled_arweave_uploader: true
  code_wallet_mock: true
  code_gpt_contracts: true
  code_gpt_service_mapping: true
  code_security: true
  code_scripts_smoke: true
  docs_scripts_architecture: true
  docs_scripts_runbook: true
  code_scripts_router: true
  code_scripts_helpers: true
  code_scripts_shell_glue: true
  code_scripts_validators: true
  docs_deployment_spec: true
  scripts_phase_validation: true
  scripts_json_spec: true
  scripts_harness_reference: true
  env_root: true
  env_node: true
  env_contracts: true
  env_arweave: true
  env_wallet_mock: true
  env_security: true
  env_scripts: true
  security_hmac: true
  security_bearer_gpt: true
  security_edge_auth: true
  security_jwt_upload: true
  security_wallet_auth: true
  security_arweave_signing: true
  security_evm_signing: true
  security_vault: false
  gpt_rulebook_required: true
  gpt_actions_integration: true
  gpt_strict_json: true
  gpt_event_mapping: false
  docs_uploader_architecture: true
  docs_uploader_contract: true
  docs_uploader_callback: true
  code_uploader_ingest: false
  code_uploader_verification: false
  code_uploader_publish: false
  code_uploader_callback: false
  uploader_real_publish: false
  uploader_signed_data_item: true
  uploader_jwt_upload: true
  uploader_backend_callback: true
  apply_bundled_copy: true
  apply_optional_scaffolds: false
  keys_readme: false
```

## Mandatory starter docs

- docs/root/SYSTEM_OVERVIEW.md, DATA_FLOOU.md, PROJECT_INDEX.md
- docs/node/* (если standard+)
- docs/arweave-uploader/* (включая BUNDLED_MODULE_NOTES при uploader)
- docs/wallet/* при bundled wallet

## Mandatory env groups

- root, node, contracts, arweave, shared-vars-catalog
- wallet-mock при bundled wallet

## Pending decisions

- none

## Donor residue to ignore

- ReferenceWallet, scripts_backup*, root zips

## Risk flags

- mock_vs_prod: mock_only storage; bundled эталонные модули требуют явного donor path в generation-plan

## Vision

Acme Protocol — пример summary v2.0 (apply-layer + bundled wallet + uploader + scripts-aware).
