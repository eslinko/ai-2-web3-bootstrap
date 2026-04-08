# Payload contract — {{PROJECT_NAME}}

## Режим (`uploader.payload_contract_mode`)

| Значение | Смысл |
|----------|--------|
| `strict` | Жёсткий контракт полей JSON + (опционально) ожидания по тегам/размерам; ошибки до publish. |
| `validated_upstream` | Минимальная проверка на uploader; доменная строгость на node/GPT до выдачи токена. |
| `minimal` | Только обязательные поля транспорта (`upload_id`, `upload_token`, `signed_data_item`, `payload_size`) как в эталоне. |

## Транспортный контракт (эталон)

Обязательные ключи верхнего уровня JSON; типы и коды ошибок фиксируются в реализации.

## Артефакты

- `upload_token` — строка JWT (RS256 в эталоне).
- `signed_data_item` — base64url от **сырых** байт подписанного Data Item.
- Связь размера: `payload_size` согласован с claims токена.

## Зависимости от других контрактов

- **Node:** выдача токена и препарация upload session.
- **Wallet:** корректная сборка Item и тег `Upload-Id`.
- **GPT / ingest (если есть):** не смешивать диалоговый output с бинарным Item — handoff через ноду/клиента подписи.
