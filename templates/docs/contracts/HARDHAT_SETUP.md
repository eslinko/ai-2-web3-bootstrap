# Hardhat setup — {{PROJECT_NAME}}

## 1. Файлы

- `hardhat.config.*` в корне пакета contracts
- `.env` рядом с конфигом (паттерн эталона)

## 2. Сети

| Сеть | chainId | RPC env |
|------|---------|---------|
| localhost | 31337 | |
| | | |

## 3. Команды

```text
npx hardhat compile
npx hardhat test
DEPLOY_ACTION=n npx hardhat run scripts/deploy_router.js --network <name>
```

## 4. Verify

- `POLYGONSCAN_API_KEY` или аналог

## 5. Синхронизация ABI в ноду

- Скрипт копирования `artifacts` → `node/artifacts/contracts` (имя задать в проекте)
