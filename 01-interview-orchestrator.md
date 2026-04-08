# Interview orchestrator — v2.0 (apply-layer + scripts-aware + bundled prototype + security + gpt + uploader)

**Роль:** операционный слой над `bootstrap-system`: собрать решения, проверить противоречия, зафиксировать в `outputs/interview-summary.md` по `02-interview-summary-spec.md`, затем кормить генерацию (`03`, `04`, `references/*`).

**Исполнение в Cursor-агенте:** пошаговый pipeline — `06-execution-flow.md`, промпты **`execution/*.md`** и **`execution/apply/*.md`** (v2.0).

**Эталон:** паттерны монорепо (node, contracts, uploader, scripts, GPT UI, wallet/mock-runner) — не абстрактная «идеальная анкета».

---

## 1. Порядок прохождения (рекомендуемый)

| Шаг | Блок | Когда задавать |
|-----|------|----------------|
| 0 | **Scope & naming** | Всегда: имя проекта, slug, язык docs |
| 1 | **Layer inclusion** | Всегда — определяет дерево |
| 2 | **Trust / auth** | Если включена **node** |
| 3 | **Deployment profile** | После слоёв — влияет на env и фазы задач |
| 4 | **Storage / crystallization** | Если **arweave-uploader** или callback из эталона |
| 5 | **Chain / contracts** | Если **contracts** |
| 6 | **Channels** | Если GPT / Telegram / только API |
| 7 | **Security & crypto** | После каналов: auth/signing/secrets контуры |
| 8 | **Arweave uploader layer** | После security: ingress/auth/verification/publish/callback |
| 9 | **GPT layer** | После uploader (или N/A): elicitation/rulebook/output/handoff |
| 10 | **Scripts layer decisions** | Если `layer.scripts` или планируется deploy/orchestration — иначе `scripts.enabled=false` + N/A в подрешениях |
| 11 | **Apply strategy (operational)** | Короткий блок: куда и как применять plan (**v2.0**); можно отложить до перед Phase 6, но зафиксировать defaults в summary |
| 12 | **Donor triage** | Всегда — что не переносить из эталона |
| 13 | **Contradiction pass** | Перед финализацией summary |

Пропускай блоки, если слой выключен (см. branching ниже).

---

## 2. Обязательные decision blocks

### 2.1 Какие слои включены

| Слой | Ключ в summary | Вопрос «зачем» |
|------|----------------|----------------|
| Custom GPT / instructions | `layer.custom_gpt` | Нужен ли диалоговый слой + вызовы API от имени продукта? |
| **node** (web2) | `layer.node` | Нужен ли HTTP API (FastAPI) как посредник? |
| **contracts** | `layer.contracts` | Нужен ли on-chain слой в этом репо? |
| **arweave-uploader** | `layer.arweave_uploader` | Нужен ли отдельный сервис crystallization (или только mock в ноде)? |
| **scripts** | `layer.scripts` | Нужны ли deploy router, валидаторы, E2E shell как в эталоне? |
| **wallet / signing** | `layer.wallet_signing` | Legacy-флаг; предпочтительно **`wallet.layer_mode`** + **`layer.wallet_mock_runner`** |
| **Optional integrations** | `layer.integrations.*` | WooCommerce/HMAC, Supabase, Vault — отдельными флагами |

**When to ask:** шаг 1, до выбора templates.

**Downstream:** см. `references/bootstrap-decision-matrix.md`.

---

### 2.2 Модель trust / auth

| Значение | Когда | Влияние |
|----------|-------|---------|
| `bearer_only` | Только GPT Actions / внутренние клиенты | env: `GPT_ACTIONS_BEARER_SECRET`; docs: custom-gpt handoff |
| `hmac_only` | Только интеграции партнёра | env: HMAC; middleware ноды |
| `mixed` | Эталонный паттерн Amanita | оба контура + порядок middleware в docs node |

**When to ask:** если `layer.node = true`.

**Affects:** `templates/env/node.env.example`, `templates/docs/node/NODE_ARCHITECTURE.md`, task category `node-security`.

---

### 2.3 Deployment profile

| Значение | Смысл | Влияние |
|----------|-------|---------|
| `local_only` | dev на машине, mock допустим | минимальный env; Phase 1 задач = health/smoke |
| `staged` | отдельная среда, ещё не prod | env профили; без полного Vault |
| `production_ready_later` | не сейчас, но заложить | summary: `Risk flags` + задачи Phase 4 отложены |

**When to ask:** после слоёв.

**Affects:** глубина `DEPLOYMENT.md`, наличие Vault-переменных в env, фазы в `03-task-generator.md`.

---

### 2.4 Storage / crystallization profile

| Значение | Условие | Влияние |
|----------|---------|---------|
| `mock_only` | uploader или нода только мокает publish | `USE_REAL_ARWEAVE=false`; задачи: mock alignment |
| `arweave_real` | реальная сеть | JWK в `keys/`, env uploader, задачи auth/callback |
| `hybrid` | local mock, staging real | два профиля env + явный раздел в summary |

**When to ask:** если `layer.arweave_uploader = true` **или** в ноде запланирован upload/callback контур.

**Affects:** `templates/docs/arweave-uploader/*`, `templates/env/arweave.env.example`, task `uploader-*`.

---

### 2.5 Contract strategy

| Значение | Влияние |
|----------|---------|
| `registry_scaffold_only` | минимум: hub + deploy_router stub; без полной токеномики |
| `tokenization_planned` | docs TOKENIZATION_FLOOU + задачи позже |
| `active_token_layer` | полный контур registry + нода `BlockchainService` паттерн |

**When to ask:** если `layer.contracts = true`.

**Affects:** глубина `contracts/` starter и `docs/contracts/*`.

---

### 2.6 Глубина документации (`docs_depth`)

| Значение | Когда спрашивать | Влияние |
|----------|------------------|---------|
| `minimal` | Малый состав слоёв или сжатые сроки | меньше файлов в `docs/node` и др.; см. `output-selection-rules.md` |
| `standard` | По умолчанию | шаблоны v1.1 как есть |
| `full` | Нужны все заготовки для enabled слоёв | полный набор templates/docs |

**When to ask:** после фиксации enabled layers.

---

### 2.7 Каналы обязательны

| Канал | Флаг | Влияние |
|-------|------|---------|
| API only | `channel.api_only` | нет Telegram в scaffold |
| GPT Actions | `channel.gpt_actions` | custom-gpt + Bearer + задачи OpenAPI alignment |
| Telegram / WebApp | `channel.telegram` | handlers, env `TELEGRAM_*`, `WALLET_APP_URL` |
| Uploader → node callbacks | `channel.uploader_callbacks` | совместимость `EDGE_TO_BACKEND` / `NODE_AUTH_TOKEN` |

**When to ask:** шаг 6, после auth.

---

### 2.8 Wallet prototype (bundled mock-runner)

Простой контур без глубокого decision tree: **есть ли в репо signing companion** и в каком виде.

| Решение | Значения | Когда спрашивать | Зачем | На что влияет |
|---------|----------|------------------|-------|---------------|
| `wallet.layer_mode` | `bundled_mock_runner` \| `external_wallet_later` \| `none` | после `layer.node`, если нужен Floou / подпись | Включает ли старт **копию эталонного `wallet/mock-runner` почти as is** | `bundled_modules_to_copy`, docs wallet, env_wallet_mock, задачи E2E |
| `wallet.prototype_policy` | `fixed_single_user` \| `defined_later` | если `layer_mode = bundled_mock_runner` | Фиксированная single-user модель vs отложенная детализация | глубина `PROTOTYPE_LIMITATIONS`, Pending |
| `wallet.role` | `signing_companion` \| `externalized_later` | вместе с `layer_mode` | Явно: companion в репо или подпись вне репо | docs `SIGNING_COMPANION_MODEL`, task categories |

**Правила:**

- При **`wallet.layer_mode = bundled_mock_runner`:** выставить **`layer.wallet_mock_runner = true`**, **`wallet.role = signing_companion`**, обычно **`wallet.prototype_policy = fixed_single_user`**.
- При **`external_wallet_later` / `none`:** **`layer.wallet_mock_runner = false`**; docs — минимум roadmap (`WALLET_STRATEGY.md` и др. по `output-selection-rules`).
- **Legacy:** поле `wallet_strategy` в raw YAML допускается для старых сессий; маппинг: `mock_single_user`/`hybrid_transition` → `bundled_mock_runner` + `fixed_single_user`; `external_wallet_later` → `external_wallet_later`. Новые интервью используют **`wallet.layer_mode`**.

**См.:** `references/bundled-modules-strategy.md`, `references/wallet-bundled-prototype.md`, `references/mock-wallet-pattern.md` (паттерн очереди), `outputs/wallet-bundled-extraction.md`.

---

### 2.9 Security & Crypto decisions

Решения фиксируют **несколько независимых контуров** (не сводить к одному auth).

| Решение | Значения | Когда спрашивать | Зачем важно | Что включает / выключает |
|---------|----------|------------------|-------------|---------------------------|
| `api_auth_mode` | `hmac` \| `bearer` \| `mixed` | если `layer.node = true` | Определяет базовую защиту HTTP API | middleware HMAC, bearer-guards, docs auth contract |
| `gpt_actions_protection` | `bearer` \| `none` | если `channel.gpt_actions = true` | Защита `/activities`, `/reference` | `GPT_ACTIONS_BEARER_SECRET`, docs/custom-gpt auth notes |
| `edge_auth_mode` | `shared_bearer` \| `hmac` \| `none` | если `layer.arweave_uploader = true` или `channel.uploader_callbacks = true` | Защита uploader→node callback/status | `NODE_AUTH_TOKEN`/`EDGE_*` или альтернативный канал |
| `upload_token_mode` | `jwt_rs256` \| `none` | если `layer.arweave_uploader = true` | Контракт `upload_token` в crystalize | JWT ключи (private/public), docs flow prepare→crystalize |
| `wallet_auth_mode` | `challenge_signature` \| `none` | если `wallet.layer_mode != external_wallet_later` и `!= none` или есть `/v1/sign-requests` в scope | Контроль доступа wallet клиента к sign endpoints | `wallet-auth` docs, bearer session для wallet |
| `arweave_signing_mode` | `mock_jwk` \| `external_signer_later` | если есть Arweave ветка (`layer.arweave_uploader` или wallet sign flow) | Определяет, кто подписывает Data Item | JWK/env placeholders или roadmap внешнего подписанта |
| `evm_signing_mode` | `node_private_key` \| `wallet_mock_runner` \| `external_wallet_later` | если `layer.contracts = true` или есть sign_contract flow | Где живёт подпись EVM tx | node ключи, wallet mock-runner scaffold, либо future hooks |
| `secrets_source` | `env_only` \| `vault` \| `hybrid` | после deployment/profile | Источник секретов и env контракт | включение Vault env/доков/задач ротации |

**When to ask:** после базовых слоёв и каналов, перед contradiction pass.

**Affects:** `references/bootstrap-decision-matrix.md`, `references/output-selection-rules.md`, `02` switches, `03` task categories, `04` security outputs.

---

### 2.10 GPT layer decisions

GPT рассматривается как архитектурный слой (диалог -> нормализация -> JSON контракт -> handoff), а не только prompt text.

| Решение | Значения | Когда спрашивать | Зачем важно | На что влияет |
|---------|----------|------------------|-------------|---------------|
| `gpt.enabled` | `true` \| `false` | после базовых слоёв | Включён ли GPT-layer как часть системы | docs, env, code boundaries, tasks, output |
| `gpt.elicitation_mode` | `guided_interview` \| `open_exploration` \| `mixed` | если `gpt.enabled = true` | Как вести человека от мыслей к структуре | dialogue docs, ingest boundaries, task style |
| `gpt.output_structure_mode` | `strict_json` \| `json_plus_explanation` \| `multi_stage` | если `gpt.enabled = true` | Формат выхода и стабильность handoff | JSON contract docs/code, strict switches |
| `gpt.rulebook_mode` | `required` \| `optional` \| `none` | если `gpt.enabled = true` | Нужна ли обязательная валидация по policy/rulebook | rulebook docs, validation boundaries, tasks |
| `gpt.rulebook_source` | `single_document` \| `multiple_documents` \| `interview_defined_later` | если `gpt.rulebook_mode != none` | Где хранится rulebook и как его подключать | docs refs, env refs, pending decisions |
| `gpt.backend_handoff_mode` | `service_mapped_json` \| `event_mapped_json` \| `generic_structured_payload` | если `gpt.enabled = true` | Как payload маппится в backend | handoff docs, mapping boundaries, tasks |
| `gpt.domain_capture_type` | `ideas_and_desires` \| `requests_and_proposals` \| `events_and_reports` \| `custom` | если `gpt.enabled = true` | Тип доменного материала, который GPT извлекает | dialogue model и output sections |
| `gpt.actions_integration` | `enabled` \| `disabled` | если `gpt.enabled = true` | Нужна ли интеграция через GPT Actions/Bearer | security linkage, env, tasks, output rules |

**When to ask:** после security decisions, до contradiction pass.

**Affects:** `02` (GPT sections + switches), matrix/rules, `templates/docs/gpt/**`, code boundaries `gpt_ingest/gpt_validation/gpt_mapping`, task categories.

---

### 2.11 Arweave uploader decisions

Uploader — **архитектурный слой** (ingest → caller trust → token → verification Data Item → publish → callback), а не «загрузчик файла».

| Решение | Значения | Когда спрашивать | Зачем важно | На что влияет |
|---------|----------|------------------|-------------|---------------|
| `uploader.enabled` | `true` \| `false` | если `layer.arweave_uploader = true` или crystallize в scope | Включать ли uploader как отдельный сервис в генерации | docs, env, code boundaries, tasks, switches |
| `uploader.mode` | `mock_only` \| `real_publish` \| `hybrid` | если `uploader.enabled = true` | Mock vs реальная сеть Arweave | `USE_REAL_ARWEAVE`, JWK relay, tasks smoke/real |
| `uploader.caller_auth_mode` | `shared_bearer` \| `jwt_upload_token` \| `mixed` | если `uploader.enabled = true` | Как устанавливается доверие к вызову crystalize | relay token, JWT public key на uploader, docs INGRESS |
| `uploader.verification_mode` | `signed_data_item_required` \| `token_only` \| `mixed` | если `uploader.enabled = true` | Нужна ли проверка подписи ANS-104 Data Item | verification stubs, wallet dependency |
| `uploader.publish_mode` | `bundle_relay` \| `direct_tx` \| `defined_later` | если `uploader.enabled = true` | Паттерн публикации (эталон = bundle relay) | publish stubs, network docs |
| `uploader.callback_mode` | `backend_callback_required` \| `optional` \| `none` | если `uploader.enabled = true` | Синхронизация с нодой после publish | backend URL, Bearer к ноде, callback stubs |
| `uploader.payload_contract_mode` | `strict` \| `validated_upstream` \| `minimal` | если `uploader.enabled = true` | Где живёт строгость payload | payload boundary docs/stubs |
| `uploader.wallet_dependency_mode` | `external_signer_required` \| `mock_wallet_supported` \| `defined_later` | если `verification_mode` требует подписанный Item | Кто подписывает Data Item до uploader | wallet/mock-runner tasks, docs граница |
| `uploader.delivery_mode` | `bundled_module` (default) \| `scaffold_only` \| `none` | если `uploader.enabled = true` | **Primary:** копия эталонного `arweave-uploader/`; **secondary:** только stubs из templates | `bundled_modules_to_copy` vs `code_uploader_scaffold_helpers`, plan metadata |

**When to ask:** после `security.*`, до GPT (если GPT в scope).

**Affects:** `02` uploader sections + switches, `references/bootstrap-decision-matrix.md`, `references/output-selection-rules.md` § Uploader, `templates/docs/arweave-uploader/*`, bundled copy vs `templates/code/arweave-uploader/src/*` (optional), `03` task categories, `04` uploader outputs.

---

### 2.12 Scripts layer decisions

Слой **scripts** в bootstrap — **mixed**: scaffold + reference + явные exclusions; не blind copy эталонного `scripts/`. Канон стратегии: `references/scripts-layer-strategy.md`, `references/scripts-abstraction-rules.md`.

| Решение | Значения | Когда спрашивать | Зачем важно | На что влияет |
|---------|----------|------------------|-------------|---------------|
| `scripts.enabled` | `true` \| `false` | шаг 10, после GPT; если `layer.scripts = false` — обычно `false` и подрешения N/A | Мастер-переключатель: участвует ли scripts в **генерации** артефактов | `generate.*` scripts, `templates/docs/scripts`, `templates/code/scripts`, env `scripts.env.example`, задачи scripts-bootstrap |
| `scripts.mode` | `minimal_helpers` \| `orchestration_scaffold` \| `reference_only` | если `scripts.enabled = true` | Глубина: только shell/helpers, полный каркас роутера, или в основном docs/референс | docs depth, router/config/validators/shell в plan |
| `scripts.deploy_pattern` | `router_based` \| `simple_named_scripts` \| `defined_later` | если `scripts.enabled = true` | Как организовать deploy/orchestration entry point | `generate.code_scripts_router`, runbook docs, структура `scripts/` в plan |
| `scripts.validation_pattern` | `phase_based` \| `minimal_checks` \| `none` | если `scripts.enabled = true` | Нужны ли фазовые gate-валидаторы как паттерн | `generate.code_scripts_validators`, `generate.scripts_phase_validation`, docs VALIDATION_MODEL |
| `scripts.shell_glue` | `enabled` \| `disabled` | если `scripts.enabled = true` | Bash sync/smoke без операторского мусора | `generate.code_scripts_shell_glue`, `code_scripts_smoke`, shell templates |
| `scripts.deployment_spec` | `json_spec_enabled` \| `docs_only` \| `none` | если `scripts.enabled = true` | JSON deployment spec vs только описание формата | `generate.docs_deployment_spec`, `generate.scripts_json_spec`, папка `deployment/` |
| `scripts.tests_harness` | `reference_only` \| `include_minimal` \| `exclude` | если `scripts.enabled = true` | Не тащить эталонный `scripts/tests` целиком | `generate.scripts_harness_reference`, задачи/риски, без full harness по умолчанию |

**When to ask:** шаг 10. Если оператор явно не хочет automation в репо — `scripts.enabled = false` даже при `layer.scripts = true` (зафиксировать противоречие с C31 или ослабить `layer.scripts`).

**Affects:** `02` (секции scripts + switches), `references/bootstrap-decision-matrix.md` (строки `scripts.*`), `references/output-selection-rules.md` § Scripts, `04` § Scripts outputs, `outputs/scripts-layer-integration.md`, `execution/compute-switches.md`.

---

### 2.13 Apply strategy decisions (v2.0 operational)

Короткий блок **без** расширения анкеты: как выполнять materialization после `generation-plan.md`.

| Решение | Значения | Когда спрашивать | Зачем | На что влияет |
|---------|----------|------------------|-------|---------------|
| `apply.target_mode` | `new_project` \| `existing_repo` \| `dry_run_only` | шаг 11 или перед Phase 6 | Новый root vs существующий репо vs только отчёты | `07-apply-layer.md`, `apply-bootstrap.md`, `apply-report.md` |
| `apply.overwrite_policy` | `safe_no_overwrite` \| `replace_generated_only` \| `defined_later` | вместе с target_mode | Коллизии с существующими файлами | физический apply |
| `apply.bundled_copy_mode` | `copy_enabled` \| `copy_disabled` | вместе с target_mode | Разрешить копирование эталонных модулей | `generate.apply_bundled_copy`, очередь bundled |
| `apply.optional_scaffolds_mode` | `skip_optional` \| `include_optional` \| `defined_later` | вместе с target_mode | Optional template stubs (uploader pipeline и т.д.) | `generate.apply_optional_scaffolds` |

**Defaults (если не спросили):** `new_project`, `safe_no_overwrite`, `copy_enabled`, `skip_optional` — зафиксировать в summary `Apply constraints`.

**Affects:** `02-interview-summary-spec.md` (Apply strategy), `execution/compute-switches.md`, `outputs/generation-plan.md`, `07-apply-layer.md`.

---

## 3. Branching logic (ключевые правила)

Формат: **если** → **то** (файлы / outputs).

| Решение | Условие | Templates / outputs |
|---------|---------|---------------------|
| Uploader в генерации | `layer.arweave_uploader` | + `templates/docs/arweave-uploader/**`, + `templates/env/arweave.env.example`, + code starter uploader, + `keys/README` если real |
| Chain в генерации | `layer.contracts` | + `contracts/` starter, `docs/contracts/**`, `root.env` deploy vars |
| Chain **не** в scope | `layer.contracts = false` | **не** генерировать полный contracts tree; optional один README «отложено» |
| Нет GPT | `layer.custom_gpt = false` | `custom-gpt` docs **optional**; не генерировать instruction modules placeholder pack |
| Есть GPT | `layer.custom_gpt = true` | обязательны `INSTRUCTION_SYSTEM`, `AI_TO_APP_HANDOFF`, задача OpenAPI↔GPT |
| Только local mock | `storage.profile = mock_only` | task backlog: smoke/mocks **до** «production hardening» |
| Mock wallet в старте | `wallet.layer_mode = bundled_mock_runner` **и** `layer.wallet_mock_runner = true` | + **bundled copy** эталонного `wallet/mock-runner/`, `docs/wallet/**`, `wallet-mock.env`, задачи signing E2E |
| Wallet отложен | `wallet.layer_mode = external_wallet_later` | минимум roadmap docs; **без** bundled mock-runner |
| Wallet не в репо | `wallet.layer_mode = none` | нет `bundled_modules_to_copy` для wallet |
| Security docs | есть хотя бы один security switch `generate.security_* = true` | + `templates/docs/security/**`, + `templates/env/security.env.example`, + security tasks |
| Vault источник секретов | `secrets_source = vault` или `hybrid` | + docs secrets mgmt, + env группы `VAULT_*`, + задачи vault-bootstrap |
| GPT architecture docs | `gpt.enabled = true` | + `templates/docs/gpt/**`, + gpt output/rulebook/handoff docs |
| GPT strict contracts | `gpt.output_structure_mode = strict_json` | + JSON contract docs + code stubs `gpt_payload` |
| GPT rulebook required | `gpt.rulebook_mode = required` | + rulebook docs + validation boundaries/tasks |
| GPT event mapping | `gpt.backend_handoff_mode = event_mapped_json` | + mapping docs/code/tasks под event categories |
| Uploader architecture | `uploader.enabled = true` | + `templates/docs/arweave-uploader/UPLOADER_ARCHITECTURE.md` и связанные docs по switches |
| Uploader contract docs | `generate.docs_uploader_contract = true` | + `PAYLOAD_CONTRACT.md`, опционально строгий контракт |
| Uploader callback docs | `generate.docs_uploader_callback = true` | + `PUBLISH_AND_CALLBACK.md` |
| Uploader scaffold helpers | `generate.code_uploader_scaffold_helpers = true` | + `templates/code/arweave-uploader/src/**` (secondary); см. `src/OPTIONAL_SCAFFOLD_README.md` |
| Uploader bundled | `uploader.delivery_mode = bundled_module` | `bundled_modules_to_copy` → эталонный `arweave-uploader/`; stubs **не** обязательны |
| Scripts в генерации | `scripts.enabled` **и** `layer.scripts` | `templates/docs/scripts/**`, фрагменты `templates/code/scripts/**` по switches; **не** bundled весь эталонный `scripts/` |
| Scripts reference-only | `scripts.mode = reference_only` | преимущественно `templates/docs/scripts/*` + deployment README template; **без** обязательного router-кода |
| Scripts orchestration | `scripts.mode = orchestration_scaffold` **и** `scripts.deploy_pattern = router_based` | `generate.code_scripts_router`, router stub + config |
| Phase validators | `scripts.validation_pattern = phase_based` | один phase-validator stub + `generate.scripts_phase_validation` |
| Shell glue | `scripts.shell_glue = enabled` | shell templates + опционально `deploy/floou_health_smoke.sh` при smoke |
| Deployment JSON | `scripts.deployment_spec = json_spec_enabled` | минимальный `pipeline.*.example.json` + README; **не** канон эталонного `variant-a.json` |
| Scripts выключены | `scripts.enabled = false` | все `generate.*` scripts/sub — `false`; не создавать scripts starter без явного triage-исключения |

Подробные триггеры: `references/output-selection-rules.md` § Wallet, § Security, § GPT, § Uploader, § **Scripts**.

---

## 4. Contradiction checks

Перед финалом summary прогоните таблицу.

| # | Trigger (противоречие) | Уточняющий вопрос | Разрешение (ожидаемое) |
|---|------------------------|-------------------|-------------------------|
| C1 | `contracts = false` **и** `contract.strategy = active_token_layer` | Где будет жить on-chain, если не в этом репо? | Понизить strategy **или** включить contracts |
| C2 | `arweave_uploader = false` **и** нужен «crystallization callback» в DATA_FLOOU | Callback куда: только внутри ноды без отдельного сервиса? | Включить uploader **или** упростить Floou в summary |
| C3 | `gpt_actions = true` **и** `custom_gpt = false` | Кто дергает API с Bearer? | Включить custom_gpt **или** пометить другой клиент в summary |
| C4 | `docs_minimal = true` **и** `strict_openapi_ssot = true` | Кто поддерживает синхрон OpenAPI при минимуме текста? | Принять «только OpenAPI + один README» **или** ослабить strict |
| C5 | `no_secrets_yet = true` **и** signed uploader→node callbacks | Callback без shared secret невозможен в модели эталона | Разрешить dev-only mock secret **или** отложить callbacks |
| C6 | `telegram = true` **и** `node = false` | Где крутится бот? | Включить node **или** внешний runtime в summary |
| C7 | `wallet.layer_mode = bundled_mock_runner` **и** `layer.node = false` | Очередь подписей на ноде — без ноды нет Floou signing | Включить node **или** `external_wallet_later` / `none` |
| C8 | `wallet.layer_mode = external_wallet_later` **и** требуется полный E2E crystalize сейчас | Без клиента подписи Floou не замкнуть | Включить `bundled_mock_runner` **или** отложить E2E в Pending |
| C9 | `api_auth_mode != hmac` **и** включены commerce endpoints | Чем защищён commerce API без HMAC? | Включить `hmac`/`mixed` **или** исключить commerce из scope |
| C10 | `wallet_auth_mode = challenge_signature` **и** `layer.node = false` | Где проверяется challenge/verify без API-ноды? | Включить node **или** `wallet_auth_mode=none` |
| C11 | `storage.profile = arweave_real` **и** `arweave_signing_mode` не задан | Кто подписывает Data Item/JWK в real-профиле? | Зафиксировать `mock_jwk` или `external_signer_later` |
| C12 | `upload_token_mode = jwt_rs256` **и** нет пары ключей в env контракте | Чем подписывать и чем проверять JWT? | Добавить ключевые группы в env/docs/tasks |
| C13 | `secrets_source = vault` **и** нет `VAULT_*` в обязательных env groups | Как подключаться к Vault? | Добавить `VAULT_ADDR`, `VAULT_TOKEN`, `VAULT_PATH` группы |
| C14 | `evm_signing_mode = node_private_key` **и** `layer.contracts = false` | Зачем node signing без on-chain слоя в repo? | Включить contracts **или** сменить режим EVM signing |
| C15 | `gpt.enabled = true` **и** `layer.node = false` **и** `gpt.backend_handoff_mode != generic_structured_payload` | Куда передавать JSON без backend слоя? | Включить node **или** перейти в generic/manual handoff |
| C16 | `gpt.output_structure_mode = strict_json` **и** не задан output contract | Где фиксируется схема strict JSON? | Включить docs/contract switches и секцию contract в summary |
| C17 | `gpt.rulebook_mode = required` **и** `gpt.rulebook_source = interview_defined_later` | Как валидировать без источника rulebook? | Перевести в `single/multiple_document` или отметить Pending до генерации |
| C18 | `gpt.backend_handoff_mode = event_mapped_json` **и** event/service layer не зафиксирован | В какую модель событий маппить? | Зафиксировать event model или сменить handoff mode |
| C19 | `gpt.actions_integration = enabled` **и** `security.gpt_actions_protection` не определён | Чем защищён GPT Actions канал? | Принять `bearer` или явно `none` с Risk flag |
| C20 | `gpt.elicitation_mode = open_exploration` **и** ожидается полностью детерминированный payload без нормализации | Как получить стабильный контракт на выходе? | Перейти в `mixed/guided_interview` или добавить multi-stage normalization |
| C21 | `uploader.enabled = true` **и** `layer.arweave_uploader = false` | Где живёт код uploader-сервиса? | Включить слой **или** `uploader.enabled = false` |
| C22 | `uploader.callback_mode = backend_callback_required` **и** `layer.node = false` | Куда слать callback без HTTP API ноды? | Включить node **или** сменить `callback_mode` |
| C23 | `uploader.mode` в (`real_publish`, `hybrid`) **и** нет релейного JWK/контракта publish | Чем подписывать tx bundle в реальной сети? | Задать `ARWEAVE_PRIVATE_KEY*` в env / keys + задачи |
| C24 | `uploader.verification_mode` в (`signed_data_item_required`, `mixed`) **и** `uploader.wallet_dependency_mode = defined_later` **и** нет mock-runner/внешнего подписанта в scope | Кто подпишет Data Item? | `mock_wallet_supported` + `layer.wallet_mock_runner` **или** `external_signer_required` с планом |
| C25 | `uploader.caller_auth_mode` в (`jwt_upload_token`, `mixed`) **и** `security.upload_token_mode = none` | Чем валидировать `upload_token` на uploader? | Включить `security.upload_token_mode = jwt_rs256` **или** сменить caller_auth |
| C26 | `uploader.callback_mode = backend_callback_required` **и** `security.edge_auth_mode = none` | Чем аутентифицировать uploader→node? | Включить `shared_bearer`/`hmac` на edge **или** ослабить callback_mode с Risk |
| C27 | `uploader.publish_mode = direct_tx` **и** `uploader.mode = real_publish` **и** нет зафиксированных network/tx assumptions | Как именно публиковать вне bundle-паттерна? | `defined_later` + Pending **или** описать direct_tx в docs |
| C28 | `uploader.payload_contract_mode = strict` **и** нет источника schema/contract в summary | Где SSOT строгого контракта? | Добавить секцию `Uploader payload contract` + docs/stub |
| C29 | `uploader.enabled = true` **и** `uploader.delivery_mode = none` | Нет ни bundled копии, ни scaffold-only пути | `bundled_module` (default) **или** `scaffold_only` |
| C30 | `wallet.layer_mode = bundled_mock_runner` **и** `layer.wallet_mock_runner = false` | Противоречие включения bundled wallet | `layer.wallet_mock_runner = true` **или** сменить `layer_mode` |
| C31 | `scripts.enabled = false` **и** (`layer.scripts = true` без triage «scripts deferred» **или** заданы не-N/A `scripts.deploy_pattern` / `scripts.mode`) | Слой в дереве без генерации или «висячие» подрешения | Согласовать `layer.scripts` **или** включить `scripts.enabled` **или** пометить N/A в raw answers |
| C32 | `scripts.deploy_pattern = router_based` **и** `layer.contracts = false` **и** нет внешнего chain scope в summary | Роутер обычно предполагает chain/deploy артефакты в репо | `simple_named_scripts` / `defined_later` **или** включить contracts **или** Risk + пояснение |
| C33 | `scripts.validation_pattern = phase_based` **и** нет data/payload flow (нет node **и** нет GPT ingest **и** нет uploader payload) | Фазовые валидаторы без материала для гейтов | `minimal_checks` / `none` **или** включить хотя бы один поток данных |
| C34 | `scripts.shell_glue = enabled` **и** `layer.node = false` **и** `layer.arweave_uploader = false` **и** `layer.contracts = false` | Нечем параметризовать smoke/sync кроме заглушек | Выставить `shell_glue = disabled` **или** включить целевой слой **или** принять «только шаблоны» с Risk |
| C35 | `scripts.deployment_spec = json_spec_enabled` **и** `scripts.deploy_pattern = defined_later` **и** нет описанного deployment flow в summary | JSON сценарии без модели оркестрации | `docs_only` **или** зафиксировать flow / `deploy_pattern` |
| C36 | `scripts.tests_harness = include_minimal` **и** в summary нет стратегии тестирования (нет `docs_tasks`, нет категории harness/E2E, `deployment.profile` не определён) | Minimal harness без якоря методологии | `reference_only` / `exclude` **или** добавить секцию testing strategy + tasks |

Записать итог в summary → `Pending decisions` или `Risk flags`.

---

## 5. Triage внутри интервью (не только ссылка)

Задайте явно (шаг 12 — Donor triage):

1. **Legacy naming:** переносим ли имя `bot` в новом проекте или только `node`? (эталон Amanita = `bot`, bootstrap = `node`.)
2. **Donor residue:** какие папки эталона **никогда** не копировать (бэкапы, zip, ReferenceWallet, личные каталоги) — список в `Donor residue to ignore`.
3. **Временные компоненты:** нужны ли в v1 одноразовые скрипты как в эталоне (`scripts_backup`, …) — по умолчанию **нет**.
4. **Experimental:** выносить ли anvil/альтернативные ноды в отдельный флаг — не включать в минимальный scaffold без решения.
5. **Generalize:** что сознательно остаётся **project-specific** (имена токенов, тексты GPT).

Результат → секции summary `Donor residue to ignore`, `Excluded layers`, `Risk flags`.

---

## 6. Формат ответов и ID решений (для execution layer)

### 6.1 Raw answers block

После прохождения вопросов агент формирует **единый блок** (в чате или временно в `outputs/raw-answers.yaml`), машиночитаемый:

```yaml
meta:
  project_name: ""
  project_slug: ""
  interview_date: ""  # ISO date
layers:
  node: true | false
  contracts: true | false
  arweave_uploader: true | false
  custom_gpt: true | false
  scripts: true | false
  wallet_signing: true | false   # legacy; предпочтительно wallet_mock_runner
  wallet_mock_runner: true | false  # scaffold mock-runner в repo
integrations:
  hmac: true | false
  supabase: true | false
  vault: true | false
decisions:
  auth.model: bearer_only | hmac_only | mixed
  deployment.profile: local_only | staged | production_ready_later
  storage.profile: mock_only | arweave_real | hybrid
  contract.strategy: registry_scaffold_only | tokenization_planned | active_token_layer
  docs_depth: minimal | standard | full
  wallet.layer_mode: bundled_mock_runner | external_wallet_later | none
  wallet.prototype_policy: fixed_single_user | defined_later   # если layer_mode = bundled_mock_runner
  wallet.role: signing_companion | externalized_later
  wallet_strategy: mock_single_user | external_wallet_later | hybrid_transition  # optional legacy; предпочтительно wallet.layer_mode
  security.api_auth_mode: hmac | bearer | mixed
  security.gpt_actions_protection: bearer | none
  security.edge_auth_mode: shared_bearer | hmac | none
  security.upload_token_mode: jwt_rs256 | none
  security.wallet_auth_mode: challenge_signature | none
  security.arweave_signing_mode: mock_jwk | external_signer_later
  security.evm_signing_mode: node_private_key | wallet_mock_runner | external_wallet_later
  security.secrets_source: env_only | vault | hybrid
  gpt.enabled: true | false
  gpt.elicitation_mode: guided_interview | open_exploration | mixed
  gpt.output_structure_mode: strict_json | json_plus_explanation | multi_stage
  gpt.rulebook_mode: required | optional | none
  gpt.rulebook_source: single_document | multiple_documents | interview_defined_later
  gpt.backend_handoff_mode: service_mapped_json | event_mapped_json | generic_structured_payload
  gpt.domain_capture_type: ideas_and_desires | requests_and_proposals | events_and_reports | custom
  gpt.actions_integration: enabled | disabled
  uploader.enabled: true | false   # обычно совпадает с layers.arweave_uploader
  uploader.mode: mock_only | real_publish | hybrid
  uploader.caller_auth_mode: shared_bearer | jwt_upload_token | mixed
  uploader.verification_mode: signed_data_item_required | token_only | mixed
  uploader.publish_mode: bundle_relay | direct_tx | defined_later
  uploader.callback_mode: backend_callback_required | optional | none
  uploader.payload_contract_mode: strict | validated_upstream | minimal
  uploader.wallet_dependency_mode: external_signer_required | mock_wallet_supported | defined_later
  uploader.delivery_mode: bundled_module | scaffold_only | none   # default bundled_module when uploader.enabled
  scripts.enabled: true | false
  scripts.mode: minimal_helpers | orchestration_scaffold | reference_only
  scripts.deploy_pattern: router_based | simple_named_scripts | defined_later
  scripts.validation_pattern: phase_based | minimal_checks | none
  scripts.shell_glue: enabled | disabled
  scripts.deployment_spec: json_spec_enabled | docs_only | none
  scripts.tests_harness: reference_only | include_minimal | exclude
  apply.target_mode: new_project | existing_repo | dry_run_only
  apply.overwrite_policy: safe_no_overwrite | replace_generated_only | defined_later
  apply.bundled_copy_mode: copy_enabled | copy_disabled
  apply.optional_scaffolds_mode: skip_optional | include_optional | defined_later
channels:
  api_only: true | false
  gpt_actions: true | false
  telegram: true | false
  uploader_callbacks: true | false
triage:
  donor_residue_ignore: []   # список строк
  excluded_layers_note: ""
```

Пропущенные ключи для **неактивных** слоёв допускаются (например, `storage.profile` не обязателен, если `arweave_uploader: false` — см. `references/execution-validation.md`).

### 6.2 Обязательные ключи (минимум для сборки summary)

| Ключ | Обязателен если |
|------|-----------------|
| `meta.project_name`, `project_slug` | всегда |
| все `layers.*` | всегда (явный true/false) |
| `decisions.auth.model` | `layers.node == true` |
| `decisions.storage.profile` | `layers.arweave_uploader == true` или `channels.uploader_callbacks == true` |
| `decisions.contract.strategy` | `layers.contracts == true` |
| `decisions.docs_depth` | всегда (default `standard`) |
| `decisions.wallet.layer_mode` (+ `prototype_policy`, `role` при необходимости) | `layers.node == true` (если нода выключена — N/A или `none`; default policy — см. validation) |
| `layers.wallet_mock_runner` | явный true/false после фиксации **`wallet.layer_mode`** (`true` при `bundled_mock_runner`) |
| `decisions.uploader.delivery_mode` | `decisions.uploader.enabled == true` |
| `decisions.security.api_auth_mode` | `layers.node == true` |
| `decisions.security.gpt_actions_protection` | `channels.gpt_actions == true` |
| `decisions.security.edge_auth_mode` | `layers.arweave_uploader == true` или `channels.uploader_callbacks == true` |
| `decisions.security.upload_token_mode` | `layers.arweave_uploader == true` |
| `decisions.security.wallet_auth_mode` | `layers.node == true` и есть wallet/signing flow |
| `decisions.security.arweave_signing_mode` | `layers.arweave_uploader == true` или wallet sign_arweave flow |
| `decisions.security.evm_signing_mode` | `layers.contracts == true` или sign_contract flow |
| `decisions.security.secrets_source` | всегда (default `env_only`) |
| `decisions.gpt.enabled` | всегда (`true` если GPT слой в scope) |
| `decisions.gpt.elicitation_mode` | `decisions.gpt.enabled == true` |
| `decisions.gpt.output_structure_mode` | `decisions.gpt.enabled == true` |
| `decisions.gpt.rulebook_mode` | `decisions.gpt.enabled == true` |
| `decisions.gpt.rulebook_source` | `decisions.gpt.rulebook_mode != none` |
| `decisions.gpt.backend_handoff_mode` | `decisions.gpt.enabled == true` |
| `decisions.gpt.domain_capture_type` | `decisions.gpt.enabled == true` |
| `decisions.gpt.actions_integration` | `decisions.gpt.enabled == true` |
| `decisions.uploader.enabled` | `layers.arweave_uploader == true` (если слой выключен — `false` или N/A) |
| `decisions.uploader.mode` | `decisions.uploader.enabled == true` |
| `decisions.uploader.caller_auth_mode` | `decisions.uploader.enabled == true` |
| `decisions.uploader.verification_mode` | `decisions.uploader.enabled == true` |
| `decisions.uploader.publish_mode` | `decisions.uploader.enabled == true` |
| `decisions.uploader.callback_mode` | `decisions.uploader.enabled == true` |
| `decisions.uploader.payload_contract_mode` | `decisions.uploader.enabled == true` |
| `decisions.uploader.wallet_dependency_mode` | `decisions.uploader.enabled == true` |
| `decisions.scripts.enabled` | всегда (default `true` если `layers.scripts == true`, иначе `false`) |
| `decisions.scripts.mode` | `decisions.scripts.enabled == true` |
| `decisions.scripts.deploy_pattern` | `decisions.scripts.enabled == true` |
| `decisions.scripts.validation_pattern` | `decisions.scripts.enabled == true` |
| `decisions.scripts.shell_glue` | `decisions.scripts.enabled == true` |
| `decisions.scripts.deployment_spec` | `decisions.scripts.enabled == true` |
| `decisions.scripts.tests_harness` | `decisions.scripts.enabled == true` |
| `decisions.apply.target_mode` | рекомендуется всегда (default `new_project` или explicit) |
| `decisions.apply.overwrite_policy` | рекомендуется всегда (default `safe_no_overwrite`) |
| `decisions.apply.bundled_copy_mode` | рекомендуется всегда (default `copy_enabled` если bundled в scope) |
| `decisions.apply.optional_scaffolds_mode` | рекомендуется всегда (default `skip_optional`) |
| `channels.*` | всегда |

### 6.3 Передача в summary

1. **Raw answers** → промпт `execution/build-summary.md` → файл `outputs/interview-summary.md` (полная структура по `02-interview-summary-spec.md`).
2. Затем **compute switches** (`execution/compute-switches.md`) дополняет YAML-блок `generate:` в summary.
3. Затем **plan** (`execution/plan-bootstrap.md`) → `outputs/generation-plan.md`.

Подробности фаз: **`06-execution-flow.md`**.

---

## 7. Выход

Валидный `outputs/interview-summary.md` → вход для:

- `references/bootstrap-decision-matrix.md` (проверка покрытия строк),
- `execution/compute-switches.md`,
- `03-task-generator.md`,
- `04-bootstrap-output-spec.md` (условная генерация + Apply outputs),
- `07-apply-layer.md` (materialization).

## 8. Качество

- Не добавлять вопросы, которые **не меняют** дерево, env, docs, code, tasks или index (см. матрицу).
- Каждое решение → строка в **Decision table** summary.
