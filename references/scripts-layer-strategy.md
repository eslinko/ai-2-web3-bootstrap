# Scripts layer strategy (bootstrap v1.9)

**Источник анализа:** `docs/scripts-layer-analysis.md` (эталонный workspace) и локальная копия при необходимости: `bootstrap-system/scripts-layer-analysis.md`.

## 1. Роль scripts layer в архитектуре

**Glue между** Hardhat/contracts, локальными данными (CSV/JSON), Arweave-операциями, HTTP API ноды и операторскими сценариями (Floou, smoke). Это не отдельный runtime-сервис, а **автоматизация репозитория**: роутер действий, конфиг из env, shell-утилиты, валидаторы данных.

## 2. Почему scripts не должны идти целиком bundled

- **Домен Amanita** зашит в номера actions, имена контрактов, MagicRegistry, размер validators.
- **Operator playbook** (`quick_start_automation.sh` и т.п.) содержит жёсткие пути и dev-ключи.
- **Тестовый harness** (`scripts/tests`) — отдельный продукт, не обязателен для стартера.
- Bootstrap должен передавать **паттерны** (router, config shape, phase validation, deployment JSON spec), а не копировать монорепо `scripts/` слепо.

## 3. Классы scripts в эталоне

| Класс | Примеры в эталоне |
|--------|-------------------|
| Deploy / orchestration router | `deploy_full.js`, `lib/actions/*` |
| Configuration | `lib/config`, `lib/env-path.js` |
| Services (chain / Arweave) | `ContractManager`, `ArweaveManager` |
| Validators (data gates) | `validators/*.js` |
| Shell glue | `shell/*.sh`, sync artifacts |
| Deployment spec (JSON) | `deployment/README.md`, `variant-a.json` |
| Tests / harness | `scripts/tests/**` |
| Docs | `scripts/docs/**` |

## 4. Классификация для bootstrap

| Тип | Что включается |
|-----|----------------|
| **template/scaffold** | Router-stub, config/constants/env-path skeleton, один phase-validator template, shell templates (sync/smoke), deployment README + пустой JSON |
| **bundled helper** | Не эталонный `scripts/` целиком; максимум — короткие параметризуемые скрипты из templates (уже в `templates/code/scripts`) |
| **reference-only** | Архитектура Deploy_Full, harness-and-e2e, полные validators, `variant-a.json` как пример эталона |
| **ex excluded by default** | `lib/actions` целиком, huge validators, `scripts/tests` полностью, `quick_start_automation.sh`, `deploy_full.old.js`, `Untitled`, канонический `variant-a.json` |

## 5. Связь с другими слоями

| Слой | Связь |
|------|--------|
| **Contracts** | Hardhat run, артефакты `artifacts/` |
| **Node** | Smoke URL, Bearer для draft, синк ABI в consumer-папку |
| **Wallet** | Floou/bullrun сценарии опосредованно |
| **Uploader** | Health/smoke, интеграция в полных E2E |
| **Security / env** | `scripts/.env` отдельно; секреты деплоя и GPT Actions |
| **GPT / Floou** | POST draft, JSON тела, deployment spec для AI |

**См.:** `references/scripts-abstraction-rules.md`, `outputs/scripts-layer-integration.md`.
