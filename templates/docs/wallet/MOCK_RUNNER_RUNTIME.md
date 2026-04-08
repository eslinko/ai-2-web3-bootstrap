# Mock-runner — runtime

## Что это

Процесс **wallet/mock-runner** из эталонного пакета: long-running скрипт, который по конфигу и env подключается к **NODE_BASE_URL**, обрабатывает задания подписи и при необходимости обращается к **ARWEAVE_UPLOADER_BASE_URL**.

## Конфигурация

- Переменные — см. `templates/env/wallet-mock.env.example` и `templates/env/shared-vars-catalog.md` §5.
- **Не коммитить** реальные ключи; identity и JWK — только локально или через secret manager на поздних стадиях.

## Ожидаемое окружение

- Запущенная **нода** с согласованным OpenAPI (очередь подписей / sign endpoints).
- При полном Floou: **arweave-uploader** и согласованные токены **uploader → node** (см. security/uploader docs).

## Bundled copy

После копирования модуля из эталона сохраните **его** README и скрипты запуска; дополните проектный `INTEGRATION.md` из `generation-plan`, если пути или порты отличаются от эталона.
