# Arweave uploader — {{PROJECT_NAME}}

## Документы

| Файл | Назначение |
|------|------------|
| [CRYSTALLIZATION_FLOOU](./CRYSTALLIZATION_FLOOU.md) | Шаги crystalize → callback |
| [SIGNING_MODEL](./SIGNING_MODEL.md) | JWT, JWK, кто подписывает data item |
| [ARWEAVE_TO_EVM_BRIDGE](./ARWEAVE_TO_EVM_BRIDGE.md) | Связь tx id с registry |

## Эталон кода

- `POST /v1/crystalize`, `GET /health`
- `loadConfig()` / JWK из env или файла
