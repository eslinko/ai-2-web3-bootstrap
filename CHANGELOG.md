# Changelog — bootstrap-system

## v2.1 — 2026-04-08

**Bullrun usage mode:** bootstrap теперь завершает setup task-driven runway и передаёт управление в `bullrun-start.md`.

### Добавлено

- `BULLRUN_LAUNCH.md`, `08-bullrun-usage-mode.md`
- `references/task-emission-rules.md`, `references/task-placement-rules.md`, `references/task-indexing-bridge.md`
- `execution/bullrun/emit-initial-tasks.md`, `create-task-indexes.md`, `handoff-to-bullrun-start.md`
- `outputs/initial-task-emission.md`, `outputs/task-indexes-created.md`, `outputs/bullrun-usage-integration.md`
- `04-bootstrap-output-spec.md` § Bullrun usage outputs

### Обновлено

- `06-execution-flow.md`, `07-apply-layer.md`, `execution/README.md`
- `execution/plan-bootstrap.md`, `outputs/generation-plan.md` (sections `initial_tasks_to_emit`, `task_zones_to_initialize`, `task_indexes_to_initialize`)
- `00-start-here.md`

## v2.0 — 2026-04-08

**Apply layer:** materialization целевого проекта по `generation-plan.md` (bundled copy + templates + skip lists) через промпты агента; не отдельный engine.

### Добавлено

- `07-apply-layer.md`
- `references/apply-rules.md`, `references/apply-validation.md`, `references/bundled-apply-rules.md`
- `execution/apply/apply-bootstrap.md`, `validate-apply-inputs.md`, `build-target-tree.md`
- `outputs/applied-project-structure.md`, `outputs/apply-report.md`, `outputs/apply-layer-integration.md`
- Решения **`apply.*`** в `01`, секции **Apply strategy/constraints** в `02`, switches **`apply_bundled_copy`**, **`apply_optional_scaffolds`**
- `04-bootstrap-output-spec.md` § Apply outputs; расширен **`outputs/generation-plan.md`** (таблицы source/target/reason/switches)
- Phase 6 в `06-execution-flow.md`; обновлены `execution/README.md`, `execution/plan-bootstrap.md`, `execution/build-summary.md`, `execution/compute-switches.md` §10
- Строки матрицы `apply.*`; § copy vs generate в `references/bundled-modules-strategy.md`; §8 в `bundled-code-placement-rules.md`; §12 в `output-selection-rules.md`

### Обновлено

- `outputs/interview-summary.md`, `outputs/interview-summary.example.md`, `outputs/raw-answers.example.yaml`
- `references/bootstrap-decision-matrix.md`, `references/execution-validation.md`

## v1.9 — 2026-04-07

**Scripts-aware mixed layer:** решения `scripts.*`, отдельные `generate.*` switches, scaffold из `templates/code/scripts` и docs из `templates/docs/scripts` без blind copy эталонного `scripts/`.

### Добавлено

- `references/scripts-layer-strategy.md`, `references/scripts-abstraction-rules.md`, `outputs/scripts-layer-integration.md`
- `templates/docs/scripts/*` (overview, orchestration, validation, shell glue, deployment spec)
- Расширение `templates/code/scripts/` (router, config, lib, shell templates, validators stub, deployment minimal JSON + README)
- `templates/env/scripts.env.example`; § scripts в `templates/env/shared-vars-catalog.md`
- Решения и raw keys: `scripts.enabled`, `scripts.mode`, `scripts.deploy_pattern`, `scripts.validation_pattern`, `scripts.shell_glue`, `scripts.deployment_spec`, `scripts.tests_harness`
- Generation switches: `docs_scripts_*`, `code_scripts_*`, `docs_deployment_spec`, `scripts_phase_validation`, `scripts_json_spec`, `scripts_harness_reference`, `env_scripts`
- Contradiction **C31–C36**; validation E2 для scripts; `execution/compute-switches.md` §9; `plan-bootstrap` mappings

### Обновлено

- `01-interview-orchestrator.md`, `02-interview-summary-spec.md`, `references/bootstrap-decision-matrix.md`, `references/output-selection-rules.md` (§10 Scripts), `04-bootstrap-output-spec.md` (§3.5 scripts)
- `execution/compute-switches.md`, `execution/plan-bootstrap.md`, `references/execution-validation.md`
- `outputs/interview-summary.example.md`

## v1.8 — 2026-04-07

**Bundled prototype modules:** `wallet/mock-runner` и `arweave-uploader` на primary path копируются **почти as is** из эталона; bootstrap генерирует **вокруг** docs, env, plan metadata и limitations.

### Добавлено

- `references/bundled-modules-strategy.md`, `references/bundled-code-placement-rules.md`
- `references/wallet-bundled-prototype.md`, `outputs/wallet-bundled-extraction.md`
- `references/uploader-bundled-transition-notes.md`, `outputs/bundled-modules-transition.md`
- `templates/docs/wallet/WALLET_LAYER_OVERVIEW.md`, `MOCK_RUNNER_RUNTIME.md`, `SIGNING_COMPANION_MODEL.md`, `PROTOTYPE_LIMITATIONS.md`
- `templates/docs/arweave-uploader/BUNDLED_MODULE_NOTES.md`
- `templates/code/wallet/mock-runner/README.md`, `templates/code/arweave-uploader/src/OPTIONAL_SCAFFOLD_README.md`
- Решения: `wallet.layer_mode`, `wallet.prototype_policy`, `wallet.role`; `uploader.delivery_mode` (default `bundled_module`)
- Switches: `bundled_wallet_mock_runner`, `bundled_arweave_uploader`, `code_uploader_scaffold_helpers`
- `outputs/generation-plan.md`: секции `bundled_modules_to_copy`, `generated_templates_to_apply`, `optional_scaffolds_to_skip`
- Contradiction **C29–C30**

### Обновлено

- `01-interview-orchestrator.md`, `02-interview-summary-spec.md`, `references/bootstrap-decision-matrix.md`, `references/output-selection-rules.md`, `04-bootstrap-output-spec.md` (§2.5 bundled vs generated)
- `execution/compute-switches.md`, `execution/plan-bootstrap.md`, `execution/build-summary.md`, `references/execution-validation.md`, `03-task-generator.md`
- `outputs/interview-summary.example.md`, `outputs/raw-answers.example.yaml`, `05-project-index-rules.md`, `templates/env/wallet-mock.env.example`, `templates/env/shared-vars-catalog.md`, `templates/folders/*`, `templates/docs/wallet/README.md`, `WALLET_STRATEGY.md`
- `references/arweave-uploader-abstraction-rules.md`, `outputs/arweave-uploader-architecture-extraction.md`
- `00-start-here.md`, `06-execution-flow.md`, `execution/README.md`

## v1.7 — 2026-04-07

**Uploader-aware decision layer:** Arweave uploader как **контролируемый вход** (ingest → caller trust → verification → payload → publish → callback), а не «загрузка файла».

### Добавлено

- `references/arweave-uploader-architecture-extraction.md` — extraction reference (ingress, auth, crypto, payload, publish, callback, граница wallet).
- `references/arweave-uploader-abstraction-rules.md` — инварианты vs кастомизация, разделение ответственности.
- `outputs/arweave-uploader-architecture-extraction.md` — отчёт экстракции (источники эталона, гипотезы, перенос).
- `templates/docs/arweave-uploader/*`: `UPLOADER_ARCHITECTURE.md`, `INGRESS_AND_AUTH.md`, `VERIFICATION_MODEL.md`, `PAYLOAD_CONTRACT.md`, `PUBLISH_AND_CALLBACK.md`.
- Pipeline boundaries в `templates/code/arweave-uploader/src/{ingest,auth,verification,payload,publish,callback}/` (README + stubs).

### Обновлено

- `01-interview-orchestrator.md` v1.7: блок **Arweave uploader decisions**, contradiction checks **C21–C28**, mandatory keys `uploader.*`.
- `02-interview-summary-spec.md` v1.7: секции Uploader (decisions, ingress, verification, publish, callback, payload), **Uploader switches** в `generate:`.
- `references/bootstrap-decision-matrix.md`, `references/output-selection-rules.md` §8: строки и правила для `uploader.*`.
- `04-bootstrap-output-spec.md` v1.7: **Arweave uploader outputs** (§3.9).
- `templates/env/arweave.env.example`, `templates/env/security.env.example`, `templates/env/shared-vars-catalog.md` — явные группы под uploader/JWT callback/relay.
- `execution/compute-switches.md`: вывод uploader switches из `uploader.*`.
- `execution/build-summary.md`, `execution/plan-bootstrap.md`, `references/execution-validation.md`, `03-task-generator.md`, `06-execution-flow.md`, `00-start-here.md`, `execution/README.md`, `outputs/interview-summary.example.md`, `outputs/generation-plan.md`.

## v1.6 — 2026-04-08

**GPT-aware decision layer:** GPT архитектура (elicitation/rulebook/json handoff) стала первоклассной частью bootstrap pipeline.

### Добавлено

- `references/gpt-architecture-extraction.md` — extraction reference по GPT layer из эталона.
- `references/gpt-abstraction-rules.md` — bridge rules для переносимого GPT паттерна.
- `outputs/gpt-architecture-extraction.md` — extraction output (sources/confirmed/hypotheses/transfer).
- `templates/docs/gpt/*`:
  - `GPT_ARCHITECTURE.md`
  - `DIALOGUE_MODEL.md`
  - `RULEBOOK_MODEL.md`
  - `OUTPUT_CONTRACT.md`
  - `BACKEND_HANDOFF.md`
- Code boundary templates:
  - `templates/code/node/services/gpt_ingest/*`
  - `templates/code/node/services/gpt_validation/*`
  - `templates/code/node/services/gpt_mapping/*`
  - `templates/code/node/src/domain/contracts/gpt_payload/*`

### Обновлено

- `01-interview-orchestrator.md` v1.6: блок **GPT layer decisions**, contradiction checks `C15–C20`, raw answers и mandatory keys под `gpt.*`.
- `02-interview-summary-spec.md` v1.6: GPT sections + GPT switches.
- `references/bootstrap-decision-matrix.md` v1.6: строки по `gpt.*`.
- `references/output-selection-rules.md` v1.6: правила включения GPT docs/code/env по решениям.
- `04-bootstrap-output-spec.md` v1.6: раздел **GPT outputs**.
- `03-task-generator.md` v1.6: GPT task categories.
- Execution and examples: `execution/build-summary.md`, `execution/compute-switches.md`, `execution/plan-bootstrap.md`, `references/execution-validation.md`, `outputs/interview-summary.example.md`, `outputs/generation-plan.md`, `06-execution-flow.md`.
- `templates/env/security.env.example`: GPT-related refs (`GPT_RULEBOOK_SOURCE_REF`, contract version/mode flags).
- `00-start-here.md`: v1.6 + ссылки на GPT references.

## v1.5 — 2026-04-08

**Security-aware decision layer:** security/crypto контуры стали первоклассными decisions/switches в bootstrap pipeline.

### Добавлено

- `01-interview-orchestrator.md` v1.5: блок **Security & Crypto decisions** + contradiction checks `C9–C14`.
- `02-interview-summary-spec.md` v1.5: секции `Security decisions`, `Auth modes by channel`, `Signing modes`, `Secrets source`, `Security switches`.
- Новые switches: `docs_security`, `code_security`, `env_security`, `security_hmac`, `security_bearer_gpt`, `security_edge_auth`, `security_jwt_upload`, `security_wallet_auth`, `security_arweave_signing`, `security_evm_signing`, `security_vault`.
- `references/bootstrap-decision-matrix.md` v1.5 и `references/output-selection-rules.md` v1.4: строки/правила для security decisions.
- `04-bootstrap-output-spec.md` v1.5: раздел **Security outputs**.
- `references/security-architecture.md`: референс по контурам и каналам безопасности.
- `templates/docs/security/*`: `SECURITY_OVERVIEW.md`, `AUTH_MODES.md`, `SIGNING_ARCHITECTURE.md`, `SECRETS_MANAGEMENT.md`, `INTERSERVICE_SECURITY.md`.
- `templates/env/security.env.example`: группы HMAC/Bearer/JWT/Arweave/EVM/Vault.
- `templates/code/node/...`: boundary stubs в `api/middleware/security`, `api/security`, `services/signing`, `services/auth`.

### Обновлено

- `03-task-generator.md`: security task categories.
- execution docs: `execution/build-summary.md`, `execution/compute-switches.md`, `execution/plan-bootstrap.md`, `references/execution-validation.md`, `06-execution-flow.md`.
- outputs/examples: `outputs/interview-summary.example.md`, `outputs/generation-plan.md`.
- `00-start-here.md`: версия и ссылки на security references.

## v1.4 — 2026-04-08

**Mock wallet layer** как архитектурный паттерн (эталон `wallet/mock-runner`), без обязательного production wallet.

### Добавлено

- `references/mock-wallet-pattern.md` (уже в репо) — канон; `outputs/mock-wallet-extraction.md` — отчёт экстракции.
- Решение **`wallet_strategy`** + слой **`layer.wallet_mock_runner`** в `01-interview-orchestrator.md` (§2.8, raw YAML, C7–C8).
- `02-interview-summary-spec.md` v1.4 — switches `docs_wallet`, `code_wallet_mock`, `env_wallet_mock`.
- `references/bootstrap-decision-matrix.md` v1.4, `references/output-selection-rules.md` v1.3 — § Wallet.
- `04-bootstrap-output-spec.md` v1.3 — расширен §3.6 wallet.
- Шаблоны: `templates/docs/wallet/*` (README, WALLET_STRATEGY, SIGNING_MODEL, MOCK_WALLET_LIMITATIONS), `templates/env/wallet-mock.env.example`, `templates/code/wallet/*` (stubs).
- `templates/env/shared-vars-catalog.md` — §5 mock wallet.
- Обновлены: `03-task-generator.md`, `execution/compute-switches.md`, `execution/plan-bootstrap.md`, `references/execution-validation.md`, `outputs/generation-plan.md`, `outputs/interview-summary.example.md`, `06-execution-flow.md`.

## v1.3 — 2026-04-08

**Execution-aware interpreter:** процедурный pipeline для Cursor-агента (без runtime engine).

### Добавлено

- `06-execution-flow.md` — фазы 1–5: interview → raw → summary → switches → selection → generation plan.
- `execution/run-interview.md`, `build-summary.md`, `compute-switches.md`, `plan-bootstrap.md` — исполняемые промпты.
- `references/execution-validation.md` — ошибки, defaults, stop/continue.
- `outputs/generation-plan.md` — артефакт плана; `outputs/raw-answers.example.yaml`; `outputs/interview-summary.example.md`.
- `01-interview-orchestrator.md` — §6 raw answers YAML, обязательные ключи, handoff к summary.
- `02-interview-summary-spec.md` — строгие ключи `generate:` (+ `env_contracts`), правила default/derived.

### Не делается в v1.3

- Автоматическое копирование шаблонов в целевой репозиторий; полная файловая генерация — вне этого слоя.

## v1.2 — 2026-04-07

**Decision-aware layer:** interview intelligence, машиночитаемый summary, rule-based task generator, условный output spec, индекс как state registry.

### Добавлено

- `01-interview-orchestrator.md` — decision blocks, branching, contradiction checks, triage в flow.
- `02-interview-summary-spec.md` — секции Enabled/Excluded, Decision table, Generation switches, риски.
- `03-task-generator.md` — mapping rules, фазы 0–4, dependency heuristics, обязательные поля задачи.
- `04-bootstrap-output-spec.md` — триггеры по слоям и режимам (mock/real, local/prod).
- `05-project-index-rules.md` — обязательные секции, связь summary ↔ backlog ↔ manifest.
- `references/bootstrap-decision-matrix.md` — таблица решений → affects.
- `references/output-selection-rules.md` — когда включать docs/code/env, lightweight режим.

### Не делается в v1.2

- CI/CD scaffold, полный dependency solver, авто OpenAPI sync, proving run (следующий слой).

## v1.1 — 2026-04-06

**Grounded** эталонным workspace Amanita (код + persistent docs + конфиги).

### Добавлено

- **Code starters:** `templates/code/node/` (FastAPI config, dependencies, health), `contracts/` (hardhat + deploy_router), `arweave-uploader/src/server.mjs`, `scripts/deploy/floou_health_smoke.sh`.
- **Env:** расширенные `root`, `node`, `arweave`, `shared-vars-catalog` по группам из эталона.
- **Docs templates:** секции decisions / boundaries / risks / hooks во всех основных зонах.
- **References:** переписаны с привязкой к эталону без имён проекта.
- **Output contract:** детализация фаз A/B/C и MVP в `04-bootstrap-output-spec.md`.

### Без изменений намеренно

- Interview branching, полный dependency graph, proving run — следующий слой.

## v1.0 — (initial)

- Каркас pipeline, references, templates, outputs placeholders.
