# Wallet bundled prototype (mock-runner)

## 1. Роль wallet в общей архитектуре

**Signing companion** для Floou: клиент без wallet UX, который автоматически опрашивает ноду, подписывает запрошенные Arweave Data Item и/или EVM транзакции, и вызывает uploader (`crystalize`) при необходимости. Связывает **node + uploader + contracts** в E2E прототипе.

## 2. Почему он bundled

Реализация mock-runner **стабильна**, опирается на тот же OpenAPI/контракт очереди, что и эталон; кастомизация нового продукта в первую очередь идёт через **ноду, payload, env**, а не через переписывание цикла poll/sign. Bootstrap v1.8 копирует модуль **почти as is** (см. `references/bundled-modules-strategy.md`).

## 3. Почему на этом этапе он fixed / single-user

- Один идентификатор пользователя / одна фикстура identity в конфиге.
- **Fixed keys** (dev JWK / hex) допустимы только для local/staging prototype — явно задокументировано в `PROTOTYPE_LIMITATIONS.md`.
- Нет сценариев multi-user, recovery, UX выбора аккаунта.

## 4. Как он работает в цикле (упрощённо)

1. Конфиг: base URL ноды, режимы Arweave/EVM, при необходимости URL uploader.
2. Loop: запрос очереди подписей / заданий к подписи (контракт ноды).
3. Подпись материала, отправка результата на ноду; при crystallize — сборка/вызов uploader по контракту эталона.
4. **Automatic:** без ручного утверждения каждой операции (не продуктовый кошелёк).

## 5. Где его границы

- **Не** middleware ноды и **не** uploader: только клиент.
- **Не** хранилище секретов production-уровня: секреты — env + локальные пути к ключам вне git.
- Интеграция с `security.wallet_auth_mode` и upload JWT — по контракту ноды; детали в `templates/docs/wallet/` и security docs.

## 6. Что позже должно стать configurable

- Внешний wallet / WebApp, multi-user, политики approval.
- Ротация ключей, HSM, отдельный сервис подписи.
- Замена fixed identity на динамическую регистрацию.

**См.:** `outputs/wallet-bundled-extraction.md`, `templates/docs/wallet/WALLET_LAYER_OVERVIEW.md`.
