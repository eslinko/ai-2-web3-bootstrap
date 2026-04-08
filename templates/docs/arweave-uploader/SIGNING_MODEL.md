# Signing model — {{PROJECT_NAME}}

## 1. Роли ключей

| Ключ / секрет | Где | Назначение |
|---------------|-----|------------|
| JWK Arweave | uploader env / file | Подпись bundle / relay (по дизайну эталона) |
| Upload JWT | выдаёт нода | Доступ к crystalize для данного `upload_id` |
| Bearer uploader→node | shared secret | Callback и status |

## 2. Не смешивать

- EVM deployer key ≠ Arweave JWK
- GPT Bearer ≠ uploader Bearer

## 3. Hooks

- Инструкция генерации в `templates/keys/README.md`
