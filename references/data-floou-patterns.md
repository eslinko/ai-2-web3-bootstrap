# Reference: data Floou patterns (эталон: `ActivityRegistryService`, `uploads` routes, `arweave-uploader` POST `/v1/crystalize`)

## Устойчивый поток (обобщённо)

1. Клиент → **POST draft** с доменным телом + заголовок пользователя (`X-User-Id` в эталоне).
2. Нода: сохранить черновик → **prepare** (байты, JWT, anchor, tags) → **payload cache** → **push** «подписать» (кошелёк / mock-runner).
3. Клиент/uploader: **POST crystalize** с `signed_data_item`, `upload_token`, `upload_id`.
4. Uploader: проверка токена → валидация data item → `putStatus(queued)` → publish (real/mock) → **POST callback** на ноду с `bundle_tx_id`.
5. Нода: финализатор / state machine — по проекту.

## Идентификаторы

- `upload_id` — сквозной ключ между нодой и uploader.
- `bundle_tx_id` / `item_id` — из Arweave pipeline (см. `backend-calls.js` / callback body в эталоне).

## Обобщение vs эталон

Имена эндпоинтов и полей берите из **OpenAPI ноды**; этот файл фиксирует только **порядок фаз**, не схему JSON.

## Риски

Mock-пути (`BACKEND_USE_MOCK`, mock tx id) дают зелёные тесты без сети — явно помечайте в отчётах E2E.
