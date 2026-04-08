# Mock wallet layer — архитектурная экстракция (эталонный workspace)

**Дата:** 2026-04-08  
**Область:** `wallet/mock-runner/`, `wallet/docs/` (persistent вне `docs/analysis` где возможно).

---

## 1. Роль в Floou

### Observation

Mock-runner — **daemon-процесс** (бесконечный poll), эмулирующий кошелёк для E2E токенизации без wallet UX.

### Evidence

- `wallet/mock-runner/index.js` — `main()` → `for (;;) { pollOnce(); sleep }`.
- `wallet/docs/mock-runner.md` — «Runner не хранит состояние очереди: источник истины — бот».

### Interpretation

**Runtime model:** CLI/daemon (`npm start` / `node index.js`), не библиотека в ноде.

### Reusable implication

Starter: отдельный пакет `wallet/mock-runner` с entrypoint `index.js`.

**Confirmed from code.**

---

## 2. Связи: node, uploader, contracts

### Observation

- **Node:** HTTP API — `pending-sign-requests`, `sign-payload`, `sign-requests`, `wallet-auth`, `submit`.
- **Uploader:** только для `sign_arweave` — `POST /v1/crystalize`.
- **Contracts:** косвенно — `createActivity` на адрес из `GET /sign-requests` + `WALLET_MOCK_RPC_URL` для подписи локально; broadcast через ноду.

### Evidence

- `index.js` URL-пути; `CREATE_ACTIVITY_ABI`; `ethers.JsonRpcProvider(WALLET_MOCK_RPC_URL)`.

### Interpretation

Runner **не** линкуется с Hardhat напрямую; RPC должен совпадать с сетью бота (`chain_id` check в логах).

### Reusable implication

Документировать «signing client → node broadcast», не «runner → anvil напрямую» как обязательную архитектуру.

**Confirmed from code.**

---

## 3. Типы подписи и identity

### Observation

- **EVM:** один `ethers.Wallet` из `WALLET_MOCK_PRIVATE_KEY`.
- **Arweave:** отдельно — JWK через `loadWalletMockArweaveJwk` в режиме `poc-jwk`, либо фикстура без JWK в `local-valid`.

### Evidence

- `index.js` `initSigner`, `handleSignArweave` ветки по `ARWEAVE_SIGN_MODE`.
- `arweave-data-item-jwk.mjs` (import в index).

### Interpretation

**Не** единый «unified signing facade» — два явных пути в коде.

### Reusable implication

Шаблоны SIGNING_MODEL: два контура, один POC-пользователь (`USER_ID`).

**Confirmed from code.**

---

## 4. Документация

### Observation

Канонические persistent: `wallet/docs/mock-runner.md`, `mock-runner-launch-guide.md`, `mock-runner/README.md`. Analysis-таски — вторичный контекст (ссылки внутри mock-runner.md).

### Evidence

Список файлов; перекрёстные ссылки на `arweave-uploader/docs`, bullrun.

### Interpretation

Знание о режимах JWK/RSA — **confirmed from persistent docs** (launch-guide §2.4).

---

## 5. Временное vs reusable

| Временное (эталон) | Reusable pattern |
|--------------------|------------------|
| Один USER_ID, один процесс | Очередь на сервере + тонкий клиент подписи |
| `.env` с ключами рядом | Группы env WALLET_* / разделение EVM vs Arweave |
| local-valid через путь к uploader | Режим «валидация без своего JWK» для CI |
| FLOOU_DONE_MARKER_FILE | Маркер для оркестратора — опционально |

---

## 6. Что перенесено в bootstrap-system

- `references/mock-wallet-pattern.md`
- `outputs/mock-wallet-extraction.md` (этот файл)
- `01-interview-orchestrator.md` — §2.8 `wallet_strategy`, raw YAML, branching, C7–C8
- `02-interview-summary-spec.md` v1.4 — switches `docs_wallet`, `code_wallet_mock`, `env_wallet_mock`
- `references/bootstrap-decision-matrix.md` v1.4, `references/output-selection-rules.md` v1.3 (§ Wallet)
- `04-bootstrap-output-spec.md` — §3.6 wallet
- `03-task-generator.md` — mapping по `wallet_strategy`
- `templates/docs/wallet/` — README, WALLET_STRATEGY, SIGNING_MODEL, MOCK_WALLET_LIMITATIONS
- `templates/env/wallet-mock.env.example`, `templates/env/shared-vars-catalog.md` §5
- `templates/code/wallet/` — README, stubs, `identity.config.example.json`
- `execution/compute-switches.md`, `execution/plan-bootstrap.md`, `references/execution-validation.md`, `06-execution-flow.md`
- `outputs/generation-plan.md`, `outputs/interview-summary.example.md`

## 7. Сознательно не перенесено

- Полный код `index.js` (только ссылки и starter-hints).
- `wallet/webapp/`, Railway POC — отдельный продуктовый контур.
- Multi-user wallet model.

---

## 8. Hypotheses / открытое

- **Hypothesis:** Точное поведение при `WALLET_AUTH_MODE=legacy` в продакшене — реже используется; основной путь `challenge_signature`.

---

## 9. Что уточнить у оператора (при необходимости)

- Нужен ли в bootstrap **обязательный** mock-runner при каждом `layer.arweave_uploader` или только при полном Floou E2E?
- Внешний wallet (Browser extension) — отдельный roadmap, не в этой экстракции.
