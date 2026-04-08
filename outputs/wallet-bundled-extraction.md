# Wallet bundled extraction — output (v1.8)

## Исследованные пути эталона

- `wallet/mock-runner/` (монорепо Amanita) — основной bundled источник для prototype signing companion.
- Смежные контуры: API ноды (очередь подписей, wallet-auth), `arweave-uploader` (crystalize), при наличии — contracts artifacts для EVM подписи.

## Confirmed from code

- Наличие **poll / loop** и вызовов HTTP API ноды по контракту эталона.
- Разделение **Arweave** и **EVM** контуров подписи (разные env-классы).
- Вызов uploader в ветке crystallize при включённом Floou-пути (точные пути — по эталону).

## Confirmed from docs

- Mock-runner **не** продуктовый UX wallet; **single-user** / dev keys — норма для prototype.
- Синхронизация с `NODE_BASE_URL`, опционально `ARWEAVE_UPLOADER_BASE_URL` (см. `templates/env/wallet-mock.env.example`).

## Что переносится almost as is

- Дерево `wallet/mock-runner/**` из эталона (без секретов, без локальных `.env`).
- Зависимости (`package.json` / lock) — как в эталоне до отдельного решения об обновлении.

## Что остаётся fixed (prototype)

- Одна mock identity; автоматический signing loop; отсутствие multi-user.

## Что позже должно стать configurable

- Внешний wallet, multi-user, политики хранения ключей, отказ от fixed JWK/hex в репозитории.

## Связь с bootstrap

- Решения: `wallet.layer_mode`, `wallet.prototype_policy`, `wallet.role` + `references/wallet-bundled-prototype.md`.
- План копирования: `outputs/generation-plan.md` → `bundled_modules_to_copy`.
