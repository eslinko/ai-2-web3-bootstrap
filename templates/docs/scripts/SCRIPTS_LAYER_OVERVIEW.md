# Scripts layer overview

## Роль

Слой **scripts** связывает **contracts** (Hardhat, артефакты), **node** (HTTP API), **wallet** (через сценарии Floou, если включены), **uploader** (health/smoke и будущие bridge-операции) и **operator playbooks**. Это не отдельный сервис, а **автоматизация репозитория**.

## Почему mixed layer

Bootstrap не копирует целиком `scripts/` эталонного проекта: иначе переносятся **доменные номера actions**, **огромные validators** и **операторские секреты**. Вместо этого:

- **Scaffold** — router/config/shell templates.
- **Reference** — форматы deployment JSON, фазы валидации, harness methodology в docs.
- **Excluded** — полный `lib/actions`, полный `validators`, полный `tests` harness по умолчанию.

## Связи

| Компонент | Связь со scripts |
|-----------|-------------------|
| Contracts | `hardhat run`, сбор артефактов |
| Node | smoke URL, draft API (если включён GPT path) |
| Wallet | косвенно через сценарии деплоя/Floou |
| Uploader | health, интеграция в E2E |
| Security/env | отдельный env для deploy-скриптов |
| GPT/Floou | тела запросов, deployment spec для AI |

См. выбранный **`scripts.mode`** и **`scripts.deploy_pattern`** в summary интервью.
