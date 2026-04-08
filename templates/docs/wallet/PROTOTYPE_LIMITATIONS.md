# Прототипные ограничения (wallet bundled)

## Fixed single-user

- Один `USER_ID` / одна mock identity на стенде.
- Не использовать как модель для продакшен-магазина или публичного продукта без доработки.

## Fixed keys

- Dev **JWK** / **hex** ключи допустимы **только** для local/staging.
- В production-design ключи выносятся из репозитория и ротируются через secret management.

## Нет wallet UX

- Нет экранов подтверждения, сессий пользователя wallet app, multi-device.
- Любая «согласованность» с человеком — вне этого модуля (GPT, админка, и т.д.).

## Что заменить позже

- Внешний wallet / WebApp, **`wallet.layer_mode = external_wallet_later`** или смешанная миграция.
- Политики подписи (лимиты, audit log, approval).
- См. `references/wallet-bundled-prototype.md` §6.

## Связь с MOCK_WALLET_LIMITATIONS

Файл `MOCK_WALLET_LIMITATIONS.md` (если присутствует в том же каталоге) может дублировать юридические/продуктовые формулировки; **этот документ** — канон для bundled prototype v1.8.
