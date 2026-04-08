# Wallet layer — обзор

## Bundled prototype

Слой **wallet/mock-runner** в bootstrap v1.8 поставляется как **bundled module**: рабочий код копируется **почти целиком** из эталонного монорепо, а не собирается из разрозненных stubs.

## Роль

**Signing companion** для Floou: автоматический цикл опроса ноды, подпись Arweave Data Item и/или EVM транзакций, вызов uploader при crystallize. **Нет wallet UX** — это инфраструктурный клиент для разработки и E2E.

## Связь с системой

| Компонент | Связь |
|-----------|--------|
| Node | Очередь подписей, wallet-auth (если включено) |
| arweave-uploader | Публикация после подписанного Data Item |
| Contracts | EVM подпись при деплое/операциях из эталонного контура |

## Документация рядом

- `MOCK_RUNNER_RUNTIME.md` — как модуль живёт в рантайме
- `SIGNING_COMPANION_MODEL.md` — модель «companion», не продуктовый кошелёк
- `PROTOTYPE_LIMITATIONS.md` — single-user, fixed keys, что заменить позже

**Стратегия:** `references/bundled-modules-strategy.md`, `references/wallet-bundled-prototype.md`.
