# Mock wallet pattern (эталон: `wallet/mock-runner`)

Извлечено из Amanita workspace; не описывает финальный продуктовый wallet.

---

## 1. Роль mock wallet в эталонной системе

**Observation:** Долгоживущий Node-процесс эмулирует **клиента с кошельком**: опрашивает **node (bot API)** и выполняет подписи для Floou, без WebApp/UX.

**Evidence:** `wallet/mock-runner/index.js` (poll loop, `handleSignArweave`, `handleSignContract`); `wallet/docs/mock-runner.md`.

**Interpretation:** Очередь подписей — **SoT на ноде**; runner — stateless клиент, который подписывает и вызывает uploader/бота.

**Reusable implication:** Паттерн «signing client process + node queue + optional uploader» для bootstrap при `wallet_strategy = mock_single_user`.

---

## 2. Где включается в Floou

**Observation:** После `POST /activities/draft` нода кладёт события в очередь; runner читает `GET /v1/pending-sign-requests`, обрабатывает `sign_arweave` затем (после callback uploader) `sign_contract`.

**Evidence:** `index.js` `getPendingEvents`, `processEvents`; `wallet/docs/mock-runner.md` §3.

**Interpretation:** Цепочка: **node → sign-payload → (runner) → uploader crystalize → callback node → sign_contract → submit node → RPC**.

**Confirmed from code.**

---

## 3. Виды подписи

| Домен | Материал | Куда результат |
|-------|----------|------------------|
| Arweave ANS-104 Data Item | Режимы: `local-valid` (фикстура uploader), `poc-jwk` (RSA JWK в env), `dummy` (отладка) | `POST {uploader}/v1/crystalize` |
| EVM | `ethers.Wallet(WALLET_MOCK_PRIVATE_KEY)`, `WALLET_MOCK_RPC_URL` | `POST /v1/sign-requests/{id}/submit` (сырая tx) |

**Evidence:** `index.js` строки 46–60, 233–330, 332–474; README mock-runner.

**Interpretation:** **Два независимых криптоконтура** — не смешивать ключи Arweave JWK и EVM hex.

**Reusable implication:** Документировать два класса секретов в `templates/docs/wallet/SIGNING_MODEL.md`.

---

## 4. Identity model

**Observation:** Один **USER_ID** (совпадает с `X-User-Id` при draft). Опционально **wallet-auth**: challenge → verify → Bearer; адрес EVM из `WALLET_MOCK_PRIVATE_KEY`.

**Evidence:** `USER_ID` обязателен в `main()`; `refreshWalletAuthSession`; `mock-runner-launch-guide.md` §3.

**Interpretation:** **Single-user POC identity**, не multi-tenant.

**Hypothesis:** Несколько пользователей в одном процессе не поддерживаются — не обобщать без нового ТЗ.

---

## 5. Что reusable

- Poll + обработчик типов событий (`sign_arweave` / `sign_contract`).
- Разделение режимов Arweave-подписи (fixture vs JWK vs dummy).
- Wallet-auth handshake к ноде (challenge_signature).
- Санитизация логов (`log-sanitize.mjs`).

---

## 6. Что strictly temporary

- Один процесс на всех «пользователей» (фактически один `USER_ID`).
- Хранение ключей в `.env` рядом с runner (dev-only).
- Зависимость от пути `ARWEAVE_UPLOADER_PATH` для фикстуры `local-valid`.
- `FLOOU_DONE_MARKER_FILE` для shell-оркестратора.

---

## 7. Отражение в bootstrap

- Решение **`wallet_strategy`** в interview + слой **`layer.wallet_mock_runner`** (или документированное отсутствие).
- Шаблоны: `templates/docs/wallet/**`, `templates/env/wallet-mock.env.example`, опционально `templates/code/wallet/**`.
- Задачи: `wallet-mock-runner-bootstrap`, `floou-signing-e2e` при mock + node + uploader.

---

## 8. Риски

Путаница mock с production custody; коммит `.env` с ключами; ожидание multi-user из одного runner; несовпадение RSA размера JWK с uploader whitelist (2048 vs 4096) — **Confirmed from persistent docs** (`mock-runner-launch-guide.md` §2.4).
