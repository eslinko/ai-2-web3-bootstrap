# Arweave uploader — extraction output

## Источники в эталоне

### Confirmed from code

- `arweave-uploader/dist/server.js` — маршруты, orchestration crystalize, mock publish switch.
- `arweave-uploader/dist/publish/validate-token.js` — JWT RS256 `upload_token`.
- `arweave-uploader/dist/publish/validate-data-item.js` — ANS-104, RSA-PSS, тег `Upload-Id`.
- `arweave-uploader/dist/publish/bundle-publish.js` — bundle v2 + `transactions.post`.
- `arweave-uploader/dist/publish/backend-calls.js` — PUT status, POST callback, Bearer.
- `arweave-uploader/dist/config.js` — PORT, relay token slot, Arweave host, загрузка JWK релея.
- `arweave-uploader/dist/auth.js` — Bearer `RELAY_AUTH_TOKEN` (helper).

### Confirmed from persistent docs

- `arweave-uploader/.env.example` — группы env (Arweave, JWT public key, backend URL/secret, mock backend).

### Hypotheses

- `isAuthorized` предназначался для pre-hook на `POST /v1/crystalize`, но в текущем `dist/server.js` не вызывается — возможный технический дрейф; при переносе нужно явное решение «relay gate да/нет».
- Доменная валидация «внутри» data части Data Item может дополняться на ноде до выдачи токена — полная цепочка см. `bot` upload routes (не полностью разобрано в этом output).

## Что перенесено в bootstrap-system (v1.7)

- Decision block `uploader.*` в interview + contradiction rules.
- Секции summary и generation switches для docs/code/env uploader layer.
- Строки в decision matrix и output selection rules.
- Docs templates: `templates/docs/arweave-uploader/UPLOADER_ARCHITECTURE.md`, `INGRESS_AND_AUTH.md`, `VERIFICATION_MODEL.md`, `PAYLOAD_CONTRACT.md`, `PUBLISH_AND_CALLBACK.md`.
- Code boundary stubs: `templates/code/arweave-uploader/src/{ingest,auth,verification,payload,publish,callback}/`.
- Reference + abstraction rules + этот output файл.

## Обновление v1.8 (bundled primary path)

- Управляющая логика v1.7 (**decisions**, противоречия, docs-рамка, env-группы) **сохранена**.
- **Primary** для нового проекта: **копия эталонного `arweave-uploader/`** (`uploader.delivery_mode = bundled_module`); stub-дерево в bootstrap templates — **optional / secondary** (см. `references/uploader-bundled-transition-notes.md`, `outputs/bundled-modules-transition.md`).

## Что не перенесено

- Полная реализация runtime (оставлена в эталонном репо).
- Конкретные body-схемы callback из `bot/api/routes/uploads.py` как обязательный канон bootstrap (только указание «согласовать с node»).
- Любые секреты/ключи.

## Требует уточнения автора

- Должен ли relay (`RELAY_AUTH_TOKEN`) быть обязательным в prod-шаблоне bootstrap по умолчанию.
- Нужно ли явное решение `uploader.publish_mode = direct_tx` для проектов вне bundle-паттерна эталона.
- Минимальный vs полный `payload_contract_mode` для стартеров без Floou-specific node.
