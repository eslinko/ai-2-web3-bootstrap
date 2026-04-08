# Reference: smart-contract scaffold rules (эталон: `hardhat.config.js`, OpenZeppelin, `contracts/`)

## Структура

- `contracts/` — исходники Solidity.
- `artifacts/`, `cache/` — генерируемые; в `.gitignore` для чистого bootstrap или коммит по политике команды.
- Тесты: путь `contracts/tests` в эталоне задаётся в `hardhat.config.js` (`paths.tests`).

## Конфигурация

- `dotenv` из **корня** репозитория (как в эталоне: комментарий в `hardhat.config.js` про `path.join(__dirname, ".env")`).
- Несколько компиляторов Solidity — только если нужны разные `viaIR`/optimizer (эталон использует два компилятора).

## Деплой

- Роутер с **`DEPLOY_ACTION`** и модулями `lib/actions` (эталон `scripts/deploy_full.js`) — переносить **паттерн**, не цифры действий Amanita.
- Скрипты загружают `.env` из родителя `scripts/`: `path.join(__dirname, '..', '.env')`.

## Токенизация и регистры

- Паттерн **registry hub** снижает дублирование адресов в `.env` (см. комментарии в эталонном `bot/.env.example`).

## Верификация

- `etherscan.apiKey` по имени сети в `hardhat.config` — заполнять из env, не хардкодить.
