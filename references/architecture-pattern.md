# Reference: architecture pattern (grounded in эталонный монорепо)

Источники фактов: структура корня (`contracts/`, `scripts/`, `bot/` в эталоне → **`node/`** в bootstrap), `bot/api/main.py`, `scripts/deploy_full.js`, `arweave-uploader/dist/server.js`, `hardhat.config.js`.

## Слои и стыки

| Слой | Роль | Стык «вверх/вниз» |
|------|------|-------------------|
| Instruction (Custom GPT) | Диалог, политика, **не SoT** | HTTP + Bearer → нода |
| Web2-нода | FastAPI, оркестрация, DI, маршруты | HMAC (интеграции) / Bearer (GPT); RPC + ABI → chain |
| Crystallization service | Подпись data item, bundle, callback | Bearer → нода; JWT upload token |
| Contracts | Реестры, токены, upgrade | Hardhat deploy router, `DEPLOY_ACTION` |
| Scripts | Деплой, валидация данных, E2E shell | dotenv из корня репо |

## Инварианты (обобщённые, не имена Amanita)

1. **Один якорный адрес registry** в конфиге ноды; остальные контракты — через `get()` в runtime (паттерн из `bot/.env.example` комментариев).
2. **Два доверительных профиля API**: интеграции с HMAC vs AI Actions с Bearer — разные секреты.
3. **ABI в ноде** — из каталога артефактов (`ABI_BASE_DIR`), синхронизируемого после `hardhat compile` (скрипт вида `sync_artifacts_to_node`).
4. **upload_id** — корреляция между prepare на ноде, кэшем payload и crystallization сервисом.

## Что не тащить как обязательный паттерн

Экспериментальные каталоги, бэкапы `scripts`, сторонние референс-кошельки — см. `suspicious-files-triage.md`.
