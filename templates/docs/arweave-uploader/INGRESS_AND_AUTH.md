# Ingress and auth — {{PROJECT_NAME}}

## API surface

- Health/readiness маршрут (паттерн эталона: `GET /health`).
- Основной ingress (паттерн эталона: `POST /v1/crystalize`) с JSON-телом.

## Ожидаемое тело запроса (паттерн)

Поля уровня транспорта (имена могут быть зафиксированы в вашем node↔uploader контракте):

- `upload_id` — идентификатор сессии загрузки в ноде.
- `upload_token` — capability token (в эталоне JWT RS256 с claims привязки к id и лимиту размера).
- `signed_data_item` — base64url закодированный **подписанный** ANS-104 Data Item.
- `payload_size` — размер полезной нагрузки для сверки с токеном.

## Caller trust

| Режим (`uploader.caller_auth_mode`) | Смысл |
|-------------------------------------|-------|
| `shared_bearer` | Опциональный shared secret на ingress (паттерн `RELAY_AUTH_TOKEN` в эталоне). |
| `jwt_upload_token` | Основной контур доверия — валидный `upload_token` по публичному ключу. |
| `mixed` | Оба уровня: и relay gate, и JWT. |

**Важно:** вынести в документацию явное решение, используется ли relay-gate на маршруте crystalize (в эталонном `auth.js` есть helper; подключение к маршруту должно быть согласовано при реализации).

## Внешний vs внутренний контур

- **Внешний (к клиенту uploader):** relay Bearer (если включён), TLS/сеть.
- **Внутренний:** проверка JWT и подписи Data Item; исходящий Bearer к ноде на status/callback.
