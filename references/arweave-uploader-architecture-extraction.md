# Arweave uploader architecture extraction (эталон Amanita)

Документ фиксирует **слой uploader** как контролируемый вход в Arweave-ветку Floou (не «голый upload»). Основан на коде `arweave-uploader/dist/*`, примерах env и интеграции с нодой.

---

## 1. Role of uploader layer

**Observation:** Uploader — отдельный HTTP-сервис crystallization: принимает подготовленный запрос, проверяет JWT upload cap, валидирует подписанный ANS-104 Data Item, публикует bundle в Arweave (или мок), синхронизирует статусы и результат с backend.

**Evidence:** `arweave-uploader/dist/server.js` (`POST /v1/crystalize`), `bundle-publish.js`, `backend-calls.js`.

**Notes:** В Floou uploader стоит между «node выдал upload_token + клиент подписал Data Item» и «зафиксирован tx id / callback в ноде».

---

## 2. Ingress pattern

**Observation:** Поверхность API минимальна: `GET /health`, `POST /v1/crystalize`. Тело `crystalize`: JSON с полями `upload_id`, `upload_token`, `signed_data_item` (base64url), `payload_size`.

**Evidence:** `dist/server.js` (парсинг body, проверки `missing_field`).

**Notes:** Формат входа — явный контракт; без любого из полей запрос отклоняется до crypto-этапов.

---

## 3. Caller trust / auth pattern

**Observation:** Доверие к **вызывающей стороне** на ingress реализуется опционально через `RELAY_AUTH_TOKEN` + `auth.js` (`isAuthorized`: Bearer сравнение). В текущем `dist/server.js` импорт `isAuthorized` есть, но **вызов на маршруте `POST /v1/crystalize` не подключён** — при наличии токена в конфиге логируется предупреждение «endpoint is open». Фактическая проверка caller trust в основном контуре идёт через **JWT upload_token** (кто может тратить byte-budget и привязку к `upload_id`).

**Evidence:** `dist/auth.js`, `dist/server.js` (лог `relay.auth.disabled`), `dist/publish/validate-token.js`.

**Notes:** В абстракции разделять: (A) relay/shared-secret на границе сервиса; (B) JWT как capability token на конкретный upload; (C) исходящий `Bearer NODE_AUTH_TOKEN` к ноде — отдельный контур.

---

## 4. Verification pattern

**Observation:** Обязательная последовательность:  
1) `verifyUploadToken` — RS256 JWT, claims `upload_id`, `max_bytes`, `exp`, сверка с телом и `payload_size`.  
2) `validateDataItem` — парсинг ANS-104, RSA-PSS подпись, проверка тега `Upload-Id` == `upload_id`.

**Evidence:** `dist/publish/validate-token.js`, `dist/publish/validate-data-item.js`, `dist/server.js` (ветки `token_invalid`, `signature_invalid`).

**Notes:** Wallet/клиент **подписывает** Data Item; uploader **проверяет** подпись и согласованность тега, не «доверяет слепо» бинарю.

---

## 5. Payload validation pattern

**Observation:** Структурная валидация на uploader: типы полей JSON, неотрицательный `payload_size`, декодирование `signed_data_item`. Семантика домена (что внутри data части Item) в эталоне не полностью раскрывается на uploader — упор на crypto+теги+размер относительно JWT.

**Evidence:** `dist/server.js`, `validate-data-item.js` (теги, подпись).

**Notes:** Строгий «бизнес-payload schema» может жить в node/GPT контрактах; uploader паттерн — **граница crypto + upload_token binding**.

---

## 6. Publish pattern

**Observation:** Реальный путь: `bundleAndPublish` — сборка binary bundle (ANS-104 v2) из одного Data Item, `arweave.createTransaction`, sign JWK uploader-релея, `transactions.post`. Мок: `USE_REAL_ARWEAVE=false` → `createMockPublish`, фиктивный `bundle_tx_id` (формат как tx id).

**Evidence:** `dist/publish/bundle-publish.js`, `dist/server.js` (`useRealArweave`), `dist/config.js` (JWK для relay).

**Notes:** Uploader держит **отдельный JWK для оплаты/постинга bundle** (релей), не путать с ключом подписанта Data Item в клиенте.

---

## 7. Callback pattern

**Observation:** После этапов: `PUT {BACKEND_URL}/v1/uploads/{upload_id}/status` (failed / queued_for_publish), по успеху — `POST .../v1/uploads/callback` с `Authorization: Bearer NODE_AUTH_TOKEN`. При отсутствии `BACKEND_URL` или секрета — skip с логом. Есть режим `BACKEND_USE_MOCK` для тестов.

**Evidence:** `dist/publish/backend-calls.js`, `arweave-uploader/.env.example`.

**Notes:** Симметрия секрета с нодой критична для trust на callback channel (`security.edge_auth_mode` в bootstrap).

---

## 8. Reusable vs project-specific

| Reusable pattern | Project-specific |
|------------------|------------------|
| staged pipeline: token → validate DI → publish → callback | точные URL ноды, имена failure_code |
| JWT RS256 cap token + PEM public на uploader | доменные теги кроме Upload-Id |
| ANS-104 verify + bundle wrapper | содержимое data payload |
| mock vs real publish switch | конкретные env имена (частично конвенция Amanita) |
| backend sync via Bearer | форма JSON callback (эталон в bot routes) |

---

## 9. Risks of abstraction

- Свести uploader к «принять файл и залить» — потеря **JWT binding** и **проверки подписи Data Item**.
- Смешать **JWK релея** (publish) и **JWK/ключ подписанта** (client) — ошибка модели угроз.
- Игнорировать **callback semantics** — рассинхрон состояния upload в ноде.
- Не зафиксировать дрейф: `isAuthorized` для relay не подключён к маршруту в текущем dist — при переносе явно решить, нужен ли relay gate на ingress.
