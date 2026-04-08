# Wallet layer — bootstrap docs (v1.8 bundled)

Каталог описывает **слой подписи** Floou: не продуктовый wallet UX, а **signing companion** (mock-runner), согласованный с нодой, uploader и contracts.

## Стратегия v1.8

**Primary:** код `wallet/mock-runner` **копируется почти as is** из эталона (`wallet.layer_mode = bundled_mock_runner`). Документация и env **генерируются вокруг** копии.

См. `references/bundled-modules-strategy.md`, `references/wallet-bundled-prototype.md`, `outputs/wallet-bundled-extraction.md`.

## Содержание папки

| Файл | Назначение |
|------|------------|
| `WALLET_LAYER_OVERVIEW.md` | Bundled prototype, роль слоя, связи |
| `MOCK_RUNNER_RUNTIME.md` | Runtime, env, зависимости от ноды/uploader |
| `SIGNING_COMPANION_MODEL.md` | Модель companion vs продуктовый wallet |
| `PROTOTYPE_LIMITATIONS.md` | Single-user, fixed keys, что заменить |
| `WALLET_STRATEGY.md` | Roadmap / alternatives при `external_wallet_later` (legacy имя файла) |
| `SIGNING_MODEL.md` | Arweave vs EVM контуры, классы env |
| `MOCK_WALLET_LIMITATIONS.md` | Доп. формулировки ограничений (при необходимости) |

## Решения в интервью

`wallet.layer_mode`, `wallet.prototype_policy`, `wallet.role` — см. `01-interview-orchestrator.md` §2.8.

Паттерн очереди и Floou: `references/mock-wallet-pattern.md`.
