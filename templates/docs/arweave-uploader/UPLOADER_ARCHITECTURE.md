# Uploader architecture — {{PROJECT_NAME}}

## Роль слоя

Arweave uploader — **контролируемый вход** в публикацию: не анонимный «upload в сеть», а сервис с этапами **ingest → caller/trust → token → crypto verification → publish → backend sync**.

## Место в Floou

- **Upstream:** node выдаёт capability (`upload_token`), wallet/mock-runner подписывает Data Item.
- **Этот сервис:** проверяет токен и подпись, публикует bundle (или mock), сообщает результат ноде.
- **Downstream:** нода фиксирует `bundle_tx_id` / статусы и продолжает бизнес-процесс.

## Решения (снимок)

| Ключ | Значение |
|------|----------|
| `uploader.enabled` | {{uploader.enabled}} |
| `uploader.mode` | {{uploader.mode}} |
| `uploader.caller_auth_mode` | {{uploader.caller_auth_mode}} |
| `uploader.verification_mode` | {{uploader.verification_mode}} |
| `uploader.publish_mode` | {{uploader.publish_mode}} |
| `uploader.callback_mode` | {{uploader.callback_mode}} |
| `uploader.payload_contract_mode` | {{uploader.payload_contract_mode}} |
| `uploader.wallet_dependency_mode` | {{uploader.wallet_dependency_mode}} |

## Связь с security / node / wallet

- **Security (`security.*`):** JWT verify key на uploader; Bearer к ноде на callback; опционально relay secret на ingress.
- **Node:** контракты `/v1/uploads/*` и выдача `upload_token`.
- **Wallet:** владение ключом подписанта Data Item; uploader только валидирует подпись.
