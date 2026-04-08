# Шаблон: корень монорепо

```
project-root/
├── contracts/            # starter: templates/code/contracts (hardhat + deploy_router.js)
├── scripts/
├── node/                 # web2-нода; starter в templates/code/node
├── custom-gpt/
├── arweave-uploader/     # starter: templates/code/arweave-uploader
├── keys/                 # README + .gitignore; см. templates/keys/
├── docs/                 # из templates/docs/
├── hardhat.config.js
├── package.json
└── README.md
```

Опционально: `wallet/` (bundled mock-runner + docs; см. `decisions.wallet.layer_mode`; без стороннего `ReferenceWallet/`), `supabase/`, `wp_plugin/`.
