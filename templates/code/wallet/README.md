# Wallet — templates (v1.8)

## Primary path: bundled mock-runner

При **`wallet.layer_mode = bundled_mock_runner`** в новый проект копируется **эталонный** пакет `wallet/mock-runner/**` (см. `templates/code/wallet/mock-runner/README.md`, `references/bundled-code-placement-rules.md`).

Этот каталог **`templates/code/wallet/*`** не обязан содержать полную реализацию: stubs ниже — **secondary**, для демонстрации границ подписи или если bundled временно недоступен.

## Secondary: stubs в этом каталоге

- `signing-types.example.mjs` — контракты типов.
- `arweave-signer.stub.mjs`, `evm-signer.stub.mjs` — заглушки.
- `identity.config.example.json` — пример identity без секретов.

## Документация

`templates/docs/wallet/**` — обязательны при включении bundled wallet docs/env в plan.
