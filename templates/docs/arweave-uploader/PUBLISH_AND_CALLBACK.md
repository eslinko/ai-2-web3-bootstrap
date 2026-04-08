# Publish and callback — {{PROJECT_NAME}}

## Publish (`uploader.publish_mode`)

| Значение | Паттерн |
|----------|---------|
| `bundle_relay` | Сборка ANS-104 bundle (v2) из Item, транзакция от имени **релейного JWK**, `transactions.post` (эталон `bundle-publish.js`). |
| `direct_tx` | Иной путь публикации (не из эталона; требует явных network assumptions в проекте). |
| `defined_later` | Заглушка в старте: документировать риск и pending decision. |

## Real vs mock

- **Mock:** не вызывать сеть; сгенерировать согласованный с тестами идентификатор tx (эталон: `USE_REAL_ARWEAVE=false`).
- **Real:** `USE_REAL_ARWEAVE=true`, валидный JWK релея, доступ к `ARWEAVE_HOST`.

## Callback (`uploader.callback_mode`)

| Значение | Поведение |
|----------|-----------|
| `backend_callback_required` | После успеха — `POST` callback к ноде; при отсутствии URL/секрета в эталоне — skip с логом (**prod** должен зафиксировать env). |
| `optional` | То же API, но допускается dev без среды. |
| `none` | Только ingest/publish без синхронизации с нодой (неполный Floou; risk flag). |

## Trust на исходящих вызовах

- `Authorization: Bearer` с секретом, согласованным с нодой (эталон: `NODE_AUTH_TOKEN` / синонимы в `.env.example`).
- Не смешивать с `GPT_ACTIONS_BEARER_SECRET` — другой контур.

## Идентификаторы и статусы

Фиксировать в документации проекта:

- переходы `failed` / `queued_for_publish` / успешный publish;
- что уходит в callback (`upload_id`, item id, `bundle_tx_id`, timestamp);
- как нода сопоставляет ответ клиенту uploader (`ack`, `arweave_url`).
