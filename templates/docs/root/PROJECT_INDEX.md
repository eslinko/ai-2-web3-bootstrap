# Project index — {{PROJECT_NAME}}

## Entry points

| Компонент | Команда / путь | Порт по умолчанию |
|-----------|----------------|-------------------|
| Web2-нода | | 8000 |
| arweave-uploader | | 3000 |
| Hardhat node | `npx hardhat node` | 8545 |

## Дерево модулей (кратко)

- `node/` — FastAPI
- `contracts/` — Solidity + Hardhat
- `arweave-uploader/` — crystallization
- `scripts/` — deploy, validators, E2E
- `custom-gpt/` — instructions
- `docs/` — эта документация
- `keys/` — только локальные ключи (не в git)

## SSOT

| Артефакт | Где |
|----------|-----|
| API | OpenAPI `/openapi.json` |
| Инструкции AI | `custom-gpt/instructions/` |

## Зависимости между репозиториями

- Нет / monorepo only / …
