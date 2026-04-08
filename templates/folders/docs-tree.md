# Шаблон: docs/

```
docs/
├── concept/
├── tech/
├── safety/
├── gpt/                       # если generate.docs_gpt_* — GPT architecture/rulebook/contract/handoff
├── security/                  # если generate.docs_security — auth/signing/secrets contracts
├── wallet/                    # если generate.docs_wallet — WALLET_LAYER_OVERVIEW, MOCK_RUNNER_RUNTIME, … (+ bundled notes)
├── arweave-uploader/          # architecture + BUNDLED_MODULE_NOTES при bundled uploader
└── architecture-extraction/   # опционально для derived projects
```

Правило: аналитика в `docs/analysis/` не смешивать с каноном без проверки.
