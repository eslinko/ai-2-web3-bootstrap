# Wallet strategy (решение проекта)

**v1.8:** первичное решение в интервью — **`wallet.layer_mode`**, **`wallet.prototype_policy`**, **`wallet.role`**. Этот файл сохраняет человекочитаемое сопоставление и roadmap для **`external_wallet_later`**.

Фиксирует, **где живёт подпись** в жизненном цикле Floou: в репозитории (**bundled mock-runner**) или вне его.

## Варианты (`decisions.wallet.layer_mode`)

| Значение | Смысл | Что появляется в репо |
|----------|--------|------------------------|
| `bundled_mock_runner` | Один dev identity; **копия эталонного `wallet/mock-runner`** почти as is | bundled copy + `wallet-mock.env` + docs companion |
| `external_wallet_later` | Подпись вне репо | Roadmap + границы node API; **без** bundled copy |
| `none` | Signing companion не в scope | — |

## Legacy (`decisions.wallet_strategy`, только старые summary)

| Значение | Смысл |
|----------|--------|
| `mock_single_user` / `hybrid_transition` | → `bundled_mock_runner` + `fixed_single_user` (см. `01-interview-orchestrator.md`) |
| `external_wallet_later` | → то же имя в `wallet.layer_mode` |

## Когда спрашивать на интервью

- После того как зафиксированы `layer.node` и понимание Floou (очередь подписей на ноде).
- Если нужен полный E2E с crystallization — без клиента подписи контур не замкнуть (см. C8 в `01-interview-orchestrator.md`).

## Что меняет решение

- **Generation switches:** `bundled_wallet_mock_runner`, `docs_wallet`, `code_wallet_mock`, `env_wallet_mock` (см. `02-interview-summary-spec.md`).
- **Задачи:** `wallet-bundled-copy`, `wallet-mock-runner`, `floou-signing-e2e` при bundled + node (+ uploader при Arweave-ветке).
- **Исключения:** при `external_wallet_later` / `none` bundled mock-runner **не** входит в `bundled_modules_to_copy`.

## Migration hooks (при переходе с bundled на external wallet)

1. Все места, где mock читает секреты из `.env`, пометить как **dev-only**.
2. Контракт ноды (`pending-sign-requests`, `submit`, wallet-auth) держать стабильным — внешний клиент подставляется вместо процесса mock.
3. Не смешивать Arweave JWK и EVM private key в одной абстракции без явного разделения (см. `SIGNING_MODEL.md`).
