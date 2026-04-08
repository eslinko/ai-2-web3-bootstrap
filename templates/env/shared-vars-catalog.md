# Каталог переменных по контурам (эталон: bot/.env.example, hardhat.config.js, arweave-uploader/dist/config.js)

Легенда: **R** = обязательно для production-контура, **O** = опционально, **D** = только dev/test.

## 1. Chain / Hardhat (root или contracts)

| Переменная | R/O/D | Назначение |
|------------|-------|------------|
| `DEPLOYER_PRIVATE_KEY` | R (deploy) | Подпись деплоя |
| `POLYGON_MAINNET_RPC` / `*_RPC` | R | RPC endpoint |
| `POLYGONSCAN_API_KEY` | O | Верификация контракта |
| `MAGIC_REGISTRY_CONTRACT_ADDRESS` | R (runtime) | Якорный адрес registry |

## 2. Web2-нода (FastAPI)

| Переменная | R/O/D | Назначение |
|------------|-------|------------|
| `WEB3_PROVIDER_URI` | R | RPC для BlockchainService |
| `ABI_BASE_DIR` | O | Путь к артефактам относительно cwd |
| `GPT_ACTIONS_BEARER_SECRET` | R (если GPT Actions в prod) | Bearer для /activities и т.д. |
| `EDGE_TO_BACKEND_SECRET` / `NODE_AUTH_TOKEN` | R | Секрет uploader → node callbacks |
| `AMANITA_API_HMAC_SECRET_KEY` | R (если WooCommerce/HMAC) | Интеграции с подписью запросов |

## 3. arweave-uploader

| Переменная | R/O/D | Назначение |
|------------|-------|------------|
| `PORT` | O | Порт сервиса |
| `USE_REAL_ARWEAVE` | R/O | `false` = mock publish; `true` = реальная сеть |
| `RELAY_AUTH_TOKEN` | O | Опциональный Bearer gate на ingress (`Authorization: Bearer`) |
| `BACKEND_URL` | R (callback path) | База URL ноды для PUT status / POST callback |
| `NODE_AUTH_TOKEN` | R (callback path) | Bearer для исходящих вызовов к ноде (согласовать с `EDGE_TO_BACKEND_SECRET` / докой ноды) |
| `BACKEND_USE_MOCK` | D | Не ходить в ноду; симуляция ответов (тесты) |
| `UPLOAD_TOKEN_JWT_PUBLIC_KEY` / `_FILE` | R (jwt path) | Публичный ключ для проверки `upload_token` на uploader |
| `ARWEAVE_PRIVATE_KEY` или `_FILE` | R (real publish) | JWK **релея** для подписи tx публикации bundle |
| `ARWEAVE_PROTOCOL` / `HOST` / `PORT` | O | Сетевые предположения Arweave gateway |
| `UPLOADER_TO_BACKEND_SECRET` | O | Альтернативное имя класса секрета в линейке эталона; сверить с нодой |

## 4. Синхронизация секретов между сервисами

Эталон: одно значение Bearer для **uploader → node** на обоих концах; отдельно **GPT_ACTIONS_BEARER_SECRET** для OpenAI → node (не смешивать).

## 5. Mock wallet / signing client (`wallet-mock.env.example`)

Отдельный контур от ноды и uploader: **bundled signing companion** (`wallet.layer_mode = bundled_mock_runner`). **Fixed single-user** prototype; не production multi-user.

Классы переменных:

| Переменная / класс | R/O/D | Назначение |
|--------------------|-------|------------|
| `USER_ID` | R (mock E2E) | Согласование с нодой / draft activity |
| `NODE_BASE_URL` | R | **Node integration:** база HTTP API ноды (очередь подписей, wallet-auth) |
| `WALLET_MOCK_PRIVATE_KEY`, `WALLET_MOCK_RPC_URL` | D | **EVM signing refs**; mock-only |
| `ARWEAVE_SIGN_MODE`, JWK / path | D | **Arweave signing refs**; не смешивать с EVM hex-ключом |
| `ARWEAVE_UPLOADER_BASE_URL` | R при crystallize | **Uploader path:** база HTTP uploader для подписанного Data Item |

Полный перечень placeholder-имён: `templates/env/wallet-mock.env.example`. В production эти классы должны уйти в **secret management** или во **внешний wallet**.

## 6. GPT layer refs (`security.env.example` / node env groups)

| Переменная / класс | R/O/D | Назначение |
|--------------------|-------|------------|
| `GPT_ACTIONS_ENABLED` | O | Флаг/маркер включённой GPT Actions интеграции |
| `GPT_RULEBOOK_SOURCE_REF` | O | Ссылка на источник rulebook документа(ов) |
| `GPT_OUTPUT_CONTRACT_VERSION` | O | Версия JSON handoff контракта |
| `GPT_INGEST_MODE` | O | Режим ingest (`strict_json` / `json_plus_explanation` / `multi_stage`) |

## 7. Scripts / deploy automation (`scripts.env.example`)

Отдельный контур для **repo automation** (не путать с env ноды/uploader). Только категории и placeholder-имена; значения проекта подставляются в целевом репо.

| Переменная / класс | R/O/D | Назначение |
|--------------------|-------|------------|
| Deploy keys refs (`*_KEY_FILE`, `MNEMONIC_REF`, …) | O | Ссылки на файлы/Vault, не inline секреты |
| `RPC_URL`, `CHAIN_ID` | O | Локальный/staged chain для скриптов |
| `ARTIFACTS_DIR`, `ABI_SYNC_TARGET` | O | Источник/назначение sync ABI |
| `NODE_URL`, `UPLOADER_URL` | O | Smoke и локальная оркестрация |
| `SOURCE`, `TARGET` (shell glue) | O | Параметры шаблонов sync-artifacts |
| `DEPLOY_SCENARIO`, `DEPLOY_SPEC_PATH` | O | Режим чтения deployment spec |

Полный перечень placeholder-имён: `templates/env/scripts.env.example`. См. `references/scripts-layer-strategy.md`.

## 8. Что не класть в git

Любые ключи, JWK, pem, токены Vault — только `keys/` локально + `.gitignore` (см. `templates/keys/README.md`).
