# Crystallization Floou — {{PROJECT_NAME}}

## 1. Последовательность (эталон: `dist/server.js`)

1. Приём `upload_id`, `upload_token`, `signed_data_item`, `payload_size`
2. Проверка JWT upload token
3. Валидация data item (подпись, теги)
4. `putStatus(queued_for_publish)`
5. Bundle publish (real или mock)
6. `postCallback` на ноду с `bundle_tx_id`

## 2. Состояния ошибок

| Код | Когда |
|-----|-------|
| token_invalid | |
| signature_invalid | |
| publish_failed | |

## 3. Интеграция с нодой

- `BACKEND_URL` + пути `/v1/uploads/...`

## 4. Hooks

- Реализация `POST /v1/crystalize` в starter → полная логика
