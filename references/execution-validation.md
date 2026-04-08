# Execution validation (v2.0)

Правила для агента на шагах **compute-switches** и **plan-bootstrap**. Не заменяют человеческое решение — задают когда остановиться или спросить.

---

## 1. Классы ошибок

| Код | Условие | Реакция агента |
|-----|---------|----------------|
| E1 **missing_decision** | Обязательный ключ из `01` §6.2 отсутствует в raw answers | Задать один уточняющий вопрос **или** применить default из §3 |
| E2 **conflicting_switch** | `generate.*` противоречит слоям (например `code_uploader: true` при `layer.arweave_uploader: false`) | Исправить switch на false **или** остановиться и запросить правку summary |
| E3 **impossible_combo** | Срабатывает правило C1–C36 из `01-interview-orchestrator.md` | Сообщить пользователю, предложить 2 варианта разрешения из таблицы contradiction |
| E4 **missing_generate_key** | В `generate:` нет одного из строгих ключей из `02` | Дописать ключ с безопасным default (false) |
| E5 **ambiguous_docs_depth** | `minimal` + `full` набор docs одновременно | Применить `output-selection-rules` — урезать список |

---

## 2. Конфликтующие switches (примеры)

- `code_contracts: true` при `layer.contracts: false` → **E2**, исправить на `false`.
- `env_arweave: true` при `layer.arweave_uploader: false` и нет колбэка → **E2**, исправить на `false`.
- `keys_readme: true` при `storage.profile: mock_only` и нет требования к JWK → обычно **E2** или понизить до `false`.
- `code_wallet_mock: true` при `layer.wallet_mock_runner: false` или `wallet.layer_mode: external_wallet_later` → **E2**.
- `docs_wallet: true` (полный набор) при `wallet.layer_mode: external_wallet_later` без явного исключения в summary → **E2** или урезать до roadmap.
- `bundled_wallet_mock_runner: true` при `wallet.layer_mode != bundled_mock_runner` → **E2**.
- `security_hmac: true` при `security.api_auth_mode: bearer` → **E2**.
- `security_vault: true` при `security.secrets_source: env_only` → **E2**.
- `security_wallet_auth: true` при `layer.node: false` → **E3** (см. C10).
- `gpt_strict_json: true` при `docs_gpt_output_contract: false` → **E2**.
- `gpt_rulebook_required: true` при `docs_gpt_rulebook: false` → **E2**.
- `gpt_actions_integration: true` при `security_bearer_gpt` неопределён/false в защищённом профиле → **E3** (см. C19).
- `uploader_jwt_upload: true` при `security_jwt_upload: false` и `uploader.caller_auth_mode` требует JWT → **E2** или **E3** (см. C24).
- `uploader_backend_callback: true` при `uploader.callback_mode = none` → **E2**.
- `uploader_real_publish: true` при `uploader.mode = mock_only` → **E2**.
- `uploader_signed_data_item: true` при `uploader.verification_mode = token_only` → **E2**.
- `code_uploader_ingest` (или смежные `code_uploader_*`) при `generate.code_uploader: false` или `layer.arweave_uploader: false` → **E2**.
- `docs_uploader_architecture: true` при `uploader.enabled: false` → **E2**.
- `bundled_arweave_uploader: true` при `uploader.delivery_mode: scaffold_only` → **E2** (или переименовать mode).
- `code_uploader_scaffold_helpers: true` при `uploader.delivery_mode: bundled_module` без явного «stubs рядом» в summary → **E2** или Risk (редкая комбинация).
- `bundled_wallet_mock_runner: true` при `wallet.layer_mode != bundled_mock_runner` → **E2**.
- `code_scripts_router: true` при `scripts.deploy_pattern != router_based` или `scripts.mode != orchestration_scaffold` → **E2**.
- `code_scripts_helpers: true` при `scripts.mode == reference_only` → **E2**.
- любой `generate.docs_scripts_*` / `code_scripts_*` / `scripts_*` / `docs_deployment_spec` / `env_scripts` при `scripts.enabled: false` или `layer.scripts: false` → **E2**.
- `apply_bundled_copy: false` при `bundled_wallet_mock_runner: true` и политике «нужен mock-runner в репо» без явного Risk → **E2** или осознанный defer в summary.
- физический apply выполнен при `apply.target_mode = dry_run_only` с записью файлов в target — **нарушение промпта** (см. `references/apply-validation.md` A8).

---

## 3. Default values (если не спрашивать повторно)

| Поле | Default |
|------|---------|
| `decisions.docs_depth` | `standard` |
| `decisions.deployment.profile` | `local_only` |
| `layers.scripts` | `true` если пользователь не ответил, но включены contracts + node (опционально; лучше спросить) — **или** `false` для минимализма |
| `integrations.*` | `false` пока не указано иное |
| Пропуск `storage.profile` при `arweave_uploader: false` | N/A — не включать в Decision table; при вычислении switches не требовать `env_arweave` от storage |

**Правило:** defaults не должны включать платёжные секреты, реальные ключи или production profile.

---

## 4. Когда остановиться (stop)

- Два последовательных **E3** без ответа пользователя.
- Пользователь явно запретил автозаполнение defaults.

---

## 5. Когда продолжить с default

- Один **E1** на необязательном поле triage.
- `docs_tasks: true` при любой неопределённости backlog — оставить true (шаблон tasks почти безвреден).

---

## 6. Связь с артефактами

После успешной валидации: обновить `Risk flags` в summary при применении defaults («assumed local_only»).
