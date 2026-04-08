# Security & cryptography — inventory (эталонный workspace Amanita)

**Назначение:** единая карта **фактов** о ключах, подписи, шифровании, аутентификации и межсервисной защите.  
**Метод:** обход репозитория (без `node_modules`, без глубокого анализа рисков).  
**Дата снимка:** 2026-04-06.

---

## 1. Общая карта

**Observation:** В репозитории пересекаются несколько независимых контуров доверия: (1) **HMAC API** для commerce-потока; (2) **Bearer** для Custom GPT Actions и для **Edge→Backend** (uploader→node); (3) **JWT RS256** для `upload_token` (бот подписывает, uploader проверяет); (4) **Arweave ANS-104** — RSA-PSS Data Item + отдельный **JWK** на uploader для relay; (5) **EVM** — приватные ключи деплоя/селлера, подпись tx в `BlockchainService` и в wallet mock-runner (`ethers` / `eth_account`); (6) **wallet-auth** — challenge + EIP-191 подпись (`eth_account.messages.encode_defunct` + `recover_message`).

**Evidence:** см. разделы 2.x ниже и §3.

**Notes:** Документы в `docs/analysis/**` не использовались как основной источник; фиксируются при пересечении с кодом/конфигами.

---

## 2. Inventory по категориям

### 2.1 Keys & Secrets

Формат: **name** — **где найден** — **тип** — **где используется (факт)**.

| name | где найден | тип | где используется |
|------|------------|-----|------------------|
| `TELEGRAM_BOT_TOKEN` | `bot/.env.example` | API token (Telegram) | бот Telegram (не FastAPI crypto; секрет для Bot API) |
| `MAGIC_REGISTRY_CONTRACT_ADDRESS` | `bot/.env.example`, `hardhat.config.js` | EVM address | привязка web3 к реестру |
| `WEB3_PROVIDER_URI`, `BLOCKCHAIN_PROFILE`, `CHAIN_ID` / `CHAIN_ID_INT` | `bot/.env.example`, `bot/config.py` | RPC / profile | `BlockchainService`, проверки chain |
| `SELLER_PRIVATE_KEY`, `SELLER_ADDRESS` | `bot/.env.example`, `bot/config.py` (Vault/env) | EVM private key | `BlockchainService.transact_*`, on-chain ops |
| `DEPLOYER_PRIVATE_KEY` | `hardhat.config.js`, `scripts/lib/config/index.js` | EVM private key | Hardhat deploy, `ContractManager` |
| `POLYGON_MAINNET_RPC`, `POLYGON_MUMBAI_RPC`, `DOGEOS_TESTNET_RPC` | `hardhat.config.js` | RPC URLs (могут содержать API key в path) | сети Hardhat |
| `SELLER_PRIVATE_KEY` / `ARWEAVE_PRIVATE_KEY` из Vault | `bot/config.py` (`_load_secrets_from_vault`) | EVM / Arweave material | fallback загрузки секретов |
| `VAULT_ADDR`, `VAULT_TOKEN`, `VAULT_PATH` | `bot/.env.example`, `bot/config.py` | Vault access | `SECRETS_PROVIDER=vault` |
| `OWN_AUTH_TOKEN` | `bot/.env.example` | shared secret (fallback) | приоритет после `NODE_AUTH_TOKEN` / `EDGE_TO_BACKEND_SECRET` в `uploads.py` |
| `NODE_AUTH_TOKEN` | комментарии `bot/.env.example`, `arweave-uploader/.env.example` | Bearer shared secret | uploader → bot `PUT/POST` uploads; должен совпадать на обоих концах |
| `EDGE_TO_BACKEND_SECRET` | `bot/.env.example`, код `uploads.py` | Bearer shared secret | альтернатива имени `NODE_AUTH_TOKEN` на боте |
| `ARWEAVE_AUTH_TOKEN`, `ARWEAVE_SERVICE_URL` | `bot/.env.example` | token / URL | интеграция с Arweave service (как задокументировано в example) |
| `GPT_ACTIONS_BEARER_SECRET` | `bot/.env.example`, `bot/api/config.py` | Bearer shared secret | `GptActionsBearerMiddleware` — `/activities`, `/reference` |
| `AMANITA_API_HMAC_SECRET_KEY` | `bot/api/config.py`, env | HMAC secret | `HMACMiddleware` |
| `AMANITA_API_SECRET` | `bot/config.py`, тесты | HMAC / legacy secret | `ApiKeyService`/тесты (`sk_seller_*` default в config) |
| `AMANITA_API_KEY` | тесты `conftest.py` | API key id | HMAC клиентские тесты |
| `AMANITA_API_ENCRYPTION_KEY` | `bot/services/core/api_key.py` | Fernet key material | шифрование хранения секретов API keys локально |
| `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | `bot/.env.example` | JWT / service secret | Supabase клиент |
| `UPLOAD_TOKEN_JWT_PRIVATE_KEY`, `UPLOAD_TOKEN_JWT_PRIVATE_KEY_FILE` | `bot/services/upload/jwt_upload_token.py`, `.env.example` | RSA PEM (sign JWT) | подпись `upload_token` RS256 |
| `UPLOAD_TOKEN_JWT_PUBLIC_KEY`, `UPLOAD_TOKEN_JWT_PUBLIC_KEY_FILE` | `arweave-uploader/.env.example`, `dist/publish/validate-token.js` | RSA PEM / JWK (verify) | проверка JWT на uploader `crystalize` |
| `ARWEAVE_PRIVATE_KEY`, `ARWEAVE_PRIVATE_KEY_FILE` | `arweave-uploader/.env.example` | Arweave JWK JSON | `bundle-publish`, relay tx |
| `RELAY_AUTH_TOKEN` | `arweave-uploader/.env.example` | Bearer (optional) | заголовок к relay (док в example) |
| `BACKEND_MOCK_TEST_SECRET` | `arweave-uploader/dist/server.js`, `.env.example` | shared secret | mock override header `X-Backend-Mock-Secret` |
| `WALLET_MOCK_PRIVATE_KEY`, `WALLET_MOCK_ADDRESS`, `WALLET_MOCK_RPC_URL` | `wallet/mock-runner/.env.example`, `index.js` | EVM key / RPC | mock-runner challenge + `sign_contract` |
| `WALLET_MOCK_ARWEAVE_*`, `ARWEAVE_UPLOADER_PATH`, `USER_ID`, `BOT_URL`, `WALLET_AUTH_*` | `wallet/mock-runner` | mixed | poll, crystalize, wallet-auth |
| `SMOKE_JWT_PRIVATE_KEY_*` | `arweave-uploader/scripts/smoke-real-crystalize.js`, `.env.example` | RSA PEM | smoke JWT для crystalize |
| `ReferenceWallet/vordium-wallet/.env.example` | путь в репо | (сторонний шаблон) | не смешивать с `wallet/mock-runner` — отмечено в triage-доках |

**Observation:** Реальные `.env` в снимке glob **не** перечислены как файлы (в репозитории найдены в основном `.env.example`); оператор может иметь локальные `.env` вне инвентаря.

**Evidence:** glob `**/.env*` → `bot/.env.example`, `arweave-uploader/.env.example`, `wallet/mock-runner/.env.example`, `wallet/webapp/.env.example`, `ReferenceWallet/vordium-wallet/.env.example`.

---

### 2.2 Signing & Crypto

| файл / участок | функция / механика | что делает |
|----------------|-------------------|------------|
| `bot/api/middleware/auth.py` | `HMACMiddleware`, `_validate_signature`, `hmac.new`, `hmac.compare_digest` | HMAC-SHA256 по строке `method\npath\nbody\ntimestamp\nnonce` |
| `bot/api/utils/hmac_client.py` | клиентская сборка HMAC | подпись исходящих запросов (утилита) |
| `bot/tests/api/test_api_auth.py`, `auth_utils.py`, `test_dependency_injection.py` | `generate_hmac_headers` | тестовая генерация HMAC |
| `bot/services/core/api_key.py` | `Fernet`, `PBKDF2HMAC`, `hashlib`, `hmac` | хранение/шифрование метаданных API keys |
| `bot/services/upload/jwt_upload_token.py` | `sign_upload_token`, PyJWT RS256 | JWT `upload_token` |
| `bot/services/core/blockchain.py` | `Account.from_key`, `sign_transaction`, `send_raw_transaction`, `submit_sign_request_raw_transaction`, `_parse_signed_transaction_chain_and_to` | подпись и broadcast EVM tx |
| `bot/api/services/wallet_auth.py` | `encode_defunct`, `Account.recover_message`, `verify_signature` | EIP-191 подпись challenge, выдача session token |
| `arweave-uploader/dist/publish/validate-data-item.js` | `crypto.createPublicKey`, `crypto.verify`, RSA-PSS | валидация ANS-104 Data Item |
| `arweave-uploader/dist/publish/bundle-publish.js` | `crypto.createHash("sha256")`, `arweave.transactions.sign(tx, jwk)` | bundle id, подпись relay tx |
| `arweave-uploader/dist/publish/validate-token.js` | `crypto.verify` (JWT RS256) | проверка `upload_token` |
| `arweave-uploader/dist/logging.js` | `crypto.createHash("sha256")` | хеширование для логов (sanitize) |
| `arweave-uploader/tests/fixtures/valid-data-item.js` | `crypto.generateKeyPairSync`, `crypto.sign` | фикстуры Data Item |
| `wallet/mock-runner/index.js` | `ethers.Wallet`, `signMessage`, `signTransaction` | EVM challenge + contract tx |
| `wallet/mock-runner/arweave-data-item-jwk.mjs` | `crypto.createPrivateKey`, `crypto.sign` RSA-PSS | сборка Data Item из JWK |
| `wallet/mock-runner/test-jwk-spki-preflight.mjs` | `crypto.generateKeyPairSync` | диагностика SPKI |
| `wallet/mock-runner/log-sanitize.mjs` | (рефакторинг логов) | вырезание секретов из логов |
| `scripts/lib/services/ContractManager.js` | `ethers.Wallet`, `ContractFactory`, `getSigner` | деплой с приватным ключом |
| `contracts/tests/*.js` | `ethers` signers, `getSigners` | тестовые кошельки |

**Observation:** OpenZeppelin **AccessControl** в `.sol` — ролевая модель on-chain, не «крипто подпись сообщений» в web2 смысле.

**Evidence:** grep по `contracts/**/*.sol` на `AccessControl`, `onlyOwner`.

---

### 2.3 Auth & Protection

| механизм | endpoints / зона | headers / механика |
|----------|------------------|---------------------|
| HMAC | commerce `/api-keys`, `/products`, `/media`, `/description` и др. (см. README api) | `X-API-Key`, `X-Timestamp`, `X-Nonce`, `X-Signature` |
| Пропуск HMAC | префиксы `/activities`, `/reference`, `/v1/uploads`, `/v1/pending-sign-requests`, `/v1/sign-requests`, `/v1/wallet-auth` | `_should_skip_auth` в `auth.py` |
| GPT Bearer | `/activities`, `/reference` | `Authorization: Bearer` = `GPT_ACTIONS_BEARER_SECRET` (`gpt_actions_bearer.py`, `secrets.compare_digest`) |
| Edge Bearer | `PUT /v1/uploads/{id}/status`, `POST /v1/uploads/callback` | `verify_edge_bearer` — токен из `NODE_AUTH_TOKEN` → `EDGE_TO_BACKEND_SECRET` → `OWN_AUTH_TOKEN` |
| Wallet guard | `GET sign-payload`, `GET/POST sign-requests`, `GET pending-sign-requests` | `authenticate_wallet_request` — Bearer session (`wallet_auth_token`) или fallback `X-User-Id` |
| Wallet challenge | `POST /v1/wallet-auth/challenge`, `POST /v1/wallet-auth/verify` | тело: wallet_address, user_id, signature |
| Trusted hosts | приложение FastAPI | `APIConfig.TRUSTED_HOSTS` в `main.py` |
| CORS | `CORSMiddleware` | `main.py` |
| Auth test | `POST /auth-test` | проверка HMAC (`main.py`) |

**Evidence:** `bot/api/main.py`, `bot/api/middleware/auth.py`, `bot/api/middleware/gpt_actions_bearer.py`, `bot/api/routes/uploads.py`, `bot/api/utils/wallet_auth_guard.py`, `bot/docs/tech/api/api.md`, `bot/api/README.md`.

---

### 2.4 Inter-service security

| пара | как защищено (факт из кода/доков) |
|------|-----------------------------------|
| arweave-uploader → node | `Authorization: Bearer` + общий секрет (`NODE_AUTH_TOKEN`); вызовы `backend-calls.js` |
| node → uploader | не «обратный» Bearer в базовом Floou; клиент crystalize — wallet/mock-runner или внешний |
| wallet mock-runner → node | `Authorization: Bearer` после wallet-auth или `X-User-Id` fallback; `X-Wallet-Address` |
| wallet mock-runner → uploader | `POST /v1/crystalize` с `upload_token` + `signed_data_item` |
| GPT (OpenAI) → node | опционально `GPT_ACTIONS_BEARER_SECRET` |
| WooCommerce / partner → node | HMAC (`api.md`, middleware) |

**Evidence:** `arweave-uploader/dist/publish/backend-calls.js`, `bot/api/routes/uploads.py`, `wallet/mock-runner/index.js`, `GPT UI/docs/gpt-actions-bot-api-auth-mapping.md`.

---

### 2.5 Env & Config

| файл | назначение (кратко) |
|------|---------------------|
| `bot/.env.example` | секреты бота: Telegram, web3, Vault, uploads Bearer, GPT Bearer, Supabase, seller keys |
| `arweave-uploader/.env.example` | JWK, JWT public, backend URL/token, mock flags, smoke JWT |
| `wallet/mock-runner/.env.example` | identity, bot URL, EVM/Arweave keys, auth mode |
| `wallet/webapp/.env.example` | только `VITE_*` публичные — секреты явно запрещены комментарием |
| `hardhat.config.js` | `DEPLOYER_PRIVATE_KEY`, RPC, registry — загрузка `scripts/.env` через `SCRIPTS_DOTENV_PATH` |
| `scripts/lib/config/index.js` | `DEPLOYER_PRIVATE_KEY`, `SELLER_PRIVATE_KEY`, `ARWEAVE_KEY_PATH` и др. |
| `bot/api/config.py` | `GPT_ACTIONS_BEARER_SECRET`, HMAC окна/TTL |
| `bot/config.py` | Vault vs env, `CHAIN_ID`, секреты продавца |

---

### 2.6 Wallet security (`wallet/mock-runner`)

**Observation:** Один POC identity (`USER_ID`); два криптоконтура — Arweave Data Item (режимы `local-valid` / `dummy` / `poc-jwk`) и EVM (`ethers`).

**Evidence:** `wallet/mock-runner/index.js`, `arweave-data-item-jwk.mjs`, `README.md`, `wallet/docs/mock-runner.md`, `wallet/docs/mock-runner-launch-guide.md`.

**Notes:** `log-sanitize.mjs` — снижение утечек в stdout.

---

### 2.7 Contracts / EVM

**Observation:** Приватные ключи используются в Hardhat/deploy скриптах и в `BlockchainService` для подписи транзакций; смарт-контракты используют OpenZeppelin AccessControl/roles.

**Evidence:** `hardhat.config.js`, `scripts/lib/services/ContractManager.js`, `bot/services/core/blockchain.py`, `contracts/**/*.sol` (AccessControl).

---

### 2.8 Arweave

**Observation:** Uploader валидирует JWT (`validate-token.js`) и Data Item (`validate-data-item.js`), публикует bundle (`bundle-publish.js`), вызывает backend callbacks с Bearer (`backend-calls.js`).

**Evidence:** `arweave-uploader/dist/publish/*.js`, `arweave-uploader/dist/server.js`, `arweave-uploader/.env.example`, `docs/architecture-extraction/08-arweave-layer.md`.

---

### 2.9 Scripts

**Observation:** `ContractManager.js` — деплой с `ethers` и private key; `post-floou-draft.sh` — Bearer для GPT; `smoke-real-crystalize.js` — JWT для crystalize; bullrun docs ссылаются на секреты оркестратора.

**Evidence:** `scripts/lib/services/ContractManager.js`, `scripts/shell/post-floou-draft.sh`, `arweave-uploader/scripts/smoke-real-crystalize.js`, `scripts/docs/bullrun-floou-manual.md`.

---

## 3. Raw findings (без фильтра)

Список путей и тем, зафиксированных при сканировании как связанные с безопасностью/криптографией (включая документацию и тесты):

### Код (bot)

- `bot/api/main.py`
- `bot/api/config.py`
- `bot/api/middleware/auth.py`
- `bot/api/middleware/gpt_actions_bearer.py`
- `bot/api/utils/wallet_auth_guard.py`
- `bot/api/utils/hmac_client.py`
- `bot/api/routes/uploads.py`
- `bot/api/routes/sign_requests.py`
- `bot/api/routes/pending_sign_requests.py`
- `bot/api/routes/wallet_auth.py`
- `bot/api/routes/activities.py`
- `bot/api/services/wallet_auth.py`
- `bot/services/core/blockchain.py`
- `bot/services/core/api_key.py`
- `bot/services/upload/jwt_upload_token.py`
- `bot/services/application/activity/activity_registry_service.py`
- `bot/services/wallet_push/sign_request_store.py`
- `bot/config.py`
- `bot/tests/**` — множество файлов с HMAC, Bearer, JWT, integration Edge secret (`test_upload_flow_api.py`, `upload_harness.py`, `test_gpt_actions_bearer_middleware.py`, `test_wallet_auth_enforcement.py`, и др.)

### Код (arweave-uploader)

- `arweave-uploader/dist/server.js`
- `arweave-uploader/dist/publish/validate-data-item.js`
- `arweave-uploader/dist/publish/validate-token.js`
- `arweave-uploader/dist/publish/bundle-publish.js`
- `arweave-uploader/dist/publish/backend-calls.js`
- `arweave-uploader/dist/env-startup-diagnostics.js`
- `arweave-uploader/dist/logging.js`
- `arweave-uploader/tests/**` (JWT fixtures, `valid-data-item`, `publish-floou.test.js`, `server.test.js`)
- `arweave-uploader/scripts/smoke-real-crystalize.js`

### Код (wallet)

- `wallet/mock-runner/index.js`
- `wallet/mock-runner/arweave-data-item-jwk.mjs`
- `wallet/mock-runner/log-sanitize.mjs`
- `wallet/mock-runner/test-jwk-spki-preflight.mjs`
- `wallet/mock-runner/test-poc-jwk-roundtrip.mjs`

### Код (contracts / root)

- `hardhat.config.js`
- `contracts/tests/**/*.js` (ethers signers)
- `contracts/**/*.sol` (AccessControl, onlyOwner — см. grep)

### Scripts

- `scripts/lib/services/ContractManager.js`
- `scripts/lib/config/index.js`
- `scripts/lib/actions/DeployActions.js` (косвенно — ключи в env)
- `scripts/shell/post-floou-draft.sh`
- `scripts/docs/bullrun-floou-manual.md`, `scripts/docs/DEBUG_DEPLOY.md`

### Документация (не analysis как SSOT, но упомянута при обходе)

- `bot/docs/tech/api/api.md`, `bot/docs/tech/api/README.md`, `bot/api/README.md`
- `bot/docs/tech/api/auth-hmac-and-architecture.md`
- `arweave-uploader/docs/**` (api, backend-integration, signing — по оглавлению пакета)
- `docs/architecture-extraction/01-system-overview.md`, `04-data-flow.md`, `06-bot-layer.md`, `07-custom-gpt-layer.md`, `08-arweave-layer.md`, `12-suspicious-or-temporary-items.md`, `13-reusable-pattern-extraction.md`
- `GPT UI/docs/gpt-actions-bot-api-auth-mapping.md`, `GPT UI/docs/custom-gpt-architecture-principles-for-dialog-ingest-api.md`, `GPT UI/instructions/safety-compliance.md`
- `wallet/docs/mock-runner.md`, `wallet/docs/mock-runner-launch-guide.md`

### Env examples

- `bot/.env.example`
- `arweave-uploader/.env.example`
- `wallet/mock-runner/.env.example`
- `wallet/webapp/.env.example`
- `ReferenceWallet/vordium-wallet/.env.example`

### Прочее

- `bootstrap-system/templates/env/*.env.example` — шаблоны групп секретов для derived проектов (не эталонный runtime, но относится к «классам» секретов).

---

**Конец инвентаря.** Для уточнения строковых совпадений рекомендуется повторить `rg -i 'sign|verify|hmac|bearer|secret|private|jwk|jwt|crypto|ethers'` по подпапкам без `node_modules`.
