# Arweave uploader abstraction rules (bootstrap bridge)

## 1. Инварианты слоя (из эталона)

- Uploader — **контролируемый шлюз**: не принял arbitrary bytes без проверки capability и подписи.
- Явные стадии разделены по ответственности: **ingest → auth/token → verification (Data Item) → publish → callback**.
- **Upload token** (JWT RS256 в эталоне) связывает `upload_id`, лимит размера и срок действия с запросом.
- **Подпись Data Item** проверяется на uploader; подпись создаёт **не** uploader (клиент / wallet).
- **Publish** использует учётные данные релея (JWK сервиса), отдельно от подписанта контента.
- **Callback/status** к backend — отдельный доверенный канал (shared Bearer к ноде в эталоне).

## 2. Что кастомизируется под новый домен

- Схема тела callback и статусов (согласование с node API).
- Доменные теги в Data Item / доп. constraint поверх ANS-104.
- Режим ingress relay (`RELAY_AUTH_TOKEN` или эквивалент).
- Выбор mock vs real publish и политика ключей в окружениях.

## 3. Как отделять caller trust от payload validation

- **Caller trust:** кто имеет право дергать ingress (Bearer relay, mTLS, network policy) — ортогонально содержимому.
- **Payload validation:** структура JSON, размеры, соответствие JWT claims.
- **Crypto verification:** целостность и авторство Data Item (подпись, тег Upload-Id).

## 4. Как отделять verification от publish

- Verification отвечает на вопрос: «можно ли этот Item считать валидным для данного `upload_id` и cap?»
- Publish отвечает: «как отправить **уже проверенный** байтовый bundle в сеть?»
- Нельзя публиковать до успешной verification; при ошибке publish — отдельный failure код и статус в backend.

## 5. Как не перепутать uploader и wallet

- **Wallet / signing client:** держит ключ подписанта, формирует `signed_data_item`, вызывает uploader.
- **Uploader:** проверяет подпись и теги, публикует bundle своим релейным ключом, уведомляет ноду.
- Uploader **не** должен хранить приватный ключ подписанта пользователя для production-паттерна эталона.

## 6. Как не потерять callback semantics

- Явно документировать: когда шлётся `putStatus`, какие переходы статусов, что в `postCallback` (ids, timestamps).
- Связать с `security.edge_auth_mode`: callback без общего секрета в эталоне не задаётся как prod-ready.
- Различать «callback опционален в dev» и «обязателен в prod» — через decision `uploader.callback_mode`.

## 7. Bundled delivery (bootstrap v1.8)

- На **prototype primary path** ядро uploader — **копия эталонного пакета** (`uploader.delivery_mode = bundled_module`); инварианты §1 и решения `uploader.*` остаются в силе, но **не требуют** пошаговой реконструкции кода из stub-дерева.
- Кастомизация — **env**, **payload/callback семантика**, **integration docs**; не переписывать ядро «с нуля» без причины.
- Stub-дерево в `templates/code/arweave-uploader/src/**` — **secondary**, см. `references/uploader-bundled-transition-notes.md`.
