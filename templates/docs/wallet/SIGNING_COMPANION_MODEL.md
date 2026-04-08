# Signing companion model

## Определение

**Signing companion** — клиент, который **сопровождает** ноду и uploader: выполняет крипто-операции по запросу backend-контуров, без UI выбора аккаунта и без модели «пользователь держит телефон с wallet app».

## Отличие от продуктового wallet

| | Companion (mock-runner) | Продуктовый wallet |
|--|------------------------|---------------------|
| UX | Нет | Есть |
| Пользователи | Один prototype user | Много |
| Ключи | Fixed dev конфиг | Custody, recovery |
| Цель | E2E Floou в dev | Продакшен |

## Границы ответственности

- **Companion:** хранит/читает dev ключи, подписывает, отправляет результаты на API.
- **Нода:** авторизует клиента (например challenge), формирует очередь, не хранит приватный ключ подписанта пользователя в production-паттерне эталона для Arweave-контента.
- **Uploader:** проверяет подпись Data Item и публикует bundle; не заменяет companion при создании подписи.

## Решения bootstrap

См. `wallet.layer_mode`, `wallet.role` в `01-interview-orchestrator.md` и `references/wallet-bundled-prototype.md`.
