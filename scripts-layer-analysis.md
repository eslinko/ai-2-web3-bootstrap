# Scripts layer — анализ для решений bootstrap-system

**Область:** эталонный репозиторий Amanita, каталог `scripts/` и связанные точки входа.  
**Назначение:** один сводный документ для последующего решения — что **bundle as-is**, что **шаблон/scaffold**, что **reference-only** / **исключить**, без изменения кода в этой задаче.

**Связанные материалы:** `docs/architecture-extraction/10-scripts-layer.md` (краткая экстракция), `scripts/README.md`, `scripts/docs/Deploy_Architecture.md`.

---

## 1. Executive summary

### Классы scripts в эталоне

| Класс | Где проявляется |
|--------|------------------|
| **Deploy / action router** | `deploy_full.js` → `DeployRouter`, `DEPLOY_ACTION`, Hardhat `ethers.provider` |
| **Orchestration (numbered actions)** | `lib/actions/*`, `ActionsManager.executeAction` |
| **Configuration / env contract** | `lib/config/index.js`, `constants.js`, `lib/env-path.js` → `scripts/.env` |
| **Services (chain + Arweave)** | `lib/services/ContractManager.js`, `ArweaveManager.js` |
| **Core / shared business logic** | `lib/core/CoreLogic.js`, `CoreManager` |
| **Utilities used by actions** | `lib/utils/*`, `lib/upload_steps.js`, `lib/product_upload_steps.js`, tracking, CSV/form/product utils |
| **Validators (data quality gates)** | `validators/*.js`, `*.sh` |
| **Root-level one-off / helpers** | `transform_products_csv.js`, `utils/*`, `utility/*`, `clean_components_upload.bash` |
| **Shell glue (node/bot/Floou)** | `shell/*.sh`, корневые обёртки `sync_artifacts_to_bot.sh`, `run-bullrun-floou.sh` |
| **Automation / operator runway** | `quick_start_automation.sh` (крупный сценарий localhost) |
| **Quality / methodology** | `quality/check-test-anti-false-success.js` (targets `contracts/tests`) |
| **Tests as sub-product** | `scripts/tests/**` (unit/integration/e2e, harnesses) |
| **Structured deploy JSON (AI/orchestrator)** | `deployment/variant-a.json`, `deployment/README.md` |
| **Documentation** | `scripts/docs/**` (архитектура, действия, Floou, тесты) |

### Что похоже на bundled reusable layer

- **Паттерн** «роутер + централизованный config + сервисы + модули действий» (`deploy_full.js` + `lib/**`) — архитектурно переносимый каркас.
- **Инфраструктурные куски:** `Logger`, часть `ContractManager`/`EthersUtils`/`RpcProviderManager` (с оговорками по сетям), форма **env-path** (отдельный `scripts/.env`).
- **Sync artifacts → consumer приложения** — идея копирования ABI из `artifacts/` в runtime-папку (здесь `bot/artifacts/`).

**Но:** конкретные **имена контрактов**, **номера actions**, **роли**, **SELLER_BUSINESS_ID**, пути `data/sellers`, интеграция с **MagicRegistry / SpiralEngine / Amanita*** — глубоко **Amanita-specific**. Слепой bundle всего `lib/actions` в bootstrap без выделения абстракции даст ложное ощущение «универсального» скрипта.

### Что похоже на template / scaffold

- Каркас **DeployRouter** (initialize provider → managers → `route(action)`).
- **Конфиг-слой:** `validateEnv`, объект `config` с секциями `deployer`, `seller`, `contracts`.
- **Константы-мэппинг:** шаблон `CONTRACT_ENV_MAPPING` / aliases (подстановка имён проекта).
- **Shell:** минимальные обёртки «compile → sync artifacts → smoke» с параметризуемыми путями.
- **`deployment/*.json`** как **формат** по `deployment/README.md` — хороший кандидат на **reference + generate empty JSON**, не на копирование `variant-a.json` целиком.

### Что похоже на reference-only / docs-derived

- `scripts/docs/Deploy_Architecture.md`, `Deploy_Full.md`, per-action docs — **золото для паттернов**, не обязательно тащить как исполняемый код.
- **Сценарии SCENARIO_1_1 …** в `deployment/README.md` — **операционная модель**, не runtime-код.
- `harness-and-e2e.md` — паттерн тестовых стендов; в bootstrap отдельный выбор «копировать harness» vs «описать в docs».

### Что похоже на one-off / legacy / мусор / риск

- `deploy_full.old.js` — дубль/архив по имени; не primary entry (см. §7).
- **`Untitled`** в `scripts/` — артефакт IDE; не инвентаризировать как слой.
- **`quick_start_automation.sh`** — сотни строк, **захардкоженные localhost-ключи**, пути `bot/.env` / `WALLET_PORT` — **эталонный dev runway**, не generic bootstrap.
- **`quality/check-test-anti-false-success.js`** — полезная методология, но **привязана к `contracts/tests`** в корне; в другом репо путь может отличаться.
- Validators **огромны** (например `validate_catalog_pipeline.js` ~2k+ строк) и завязаны на **форматы данных и контрактных вызовов Amanita**.

---

## 2. Scripts inventory by class

### 2.1 Deploy & action orchestration (core JS)

| Элемент | Назначение | Reusability |
|---------|------------|-------------|
| `deploy_full.js` | CLI: `DEPLOY_ACTION`, опции action 5/13, `DeployRouter` | Высокая **как skeleton**; низкая **как целый файл** без замены action map |
| `lib/actions/index.js` | Реестр числовых actions → методы классов | Паттерн reusable; **конкретная таблица** — project-specific |
| `lib/actions/DeployActions.js` и др. | Реализации сценариев deploy/setup/catalog/invite/component/diagnostics | Низко-средняя: много доменной логики Amanita |
| `lib/core/*` | Общие куски бизнес-логики | Средняя: требует аудита зависимостей от контрактов |

### 2.2 Configuration & constants

| Элемент | Назначение | Reusability |
|---------|------------|-------------|
| `lib/env-path.js` | Канон: `scripts/.env` | Высокая **как идея** отдельного env для scripts |
| `lib/config/index.js` | Централизованный `config`, валидация `DEPLOYER_PRIVATE_KEY` | Высокая **как структура** |
| `lib/config/constants.js` | `CONTRACT_ENV_MAPPING`, `ROLES`, `PATHS`, UUPS-имена | Низкая **как значения**; высокая **как шаблон маппинга** |

### 2.3 Services & chain/Arweave integration

| Элемент | Назначение | Reusability |
|---------|------------|-------------|
| `lib/services/ContractManager.js` | Инициализация контрактов, адреса из env/MagicRegistry | Средняя: паттерн полезен; детали — Amanita |
| `lib/services/ArweaveManager.js` | Загрузки, gateway, учётные данные | Средняя: отдельно от uploader-сервиса |
| `lib/utils/RpcProviderManager.js` | Polygon / fallback endpoints | Средняя: завязка на chainId 137 и т.д. |

### 2.4 Validators

Файлы: `validate_catalog_pipeline.js`, `validate_component_upload.js`, `validate_catalog_upload.js`, `validate_product_mappings.js`, `manual_complex_fields_check.js`, `verify_component_cids.js`, `validate_full_catalog_pipeline.sh`.

| Назначение | Reusability |
|------------|-------------|
| Фазы проверки CSV/JSON/CID/on-chain до регистрации | **Паттерн phase-based validation** — reusable в docs/scaffold; **конкретные правила** — Amanita catalog/component model |

### 2.5 Root utilities & transforms

| Элемент | Назначение | Reusability |
|---------|------------|-------------|
| `transform_products_csv.js` | Вход для Action 41 (CSV → JSON) | Средняя, зависит от `lib/csv_parser`, `form_mapper` |
| `scripts/utils/*` | `validate_products.js`, `sync_component_mapping.js`, `view_upload_report.js` | Операторские / data-path specific |
| `scripts/utility/*` | `query_magic_registry.js`, `repair_component_state.js`, `diagnostic-rpc-receipt-after-switch.js` | Diagnostics / one-off hypothesis |

### 2.6 Shell & Floou

| Элемент | Назначение | Reusability |
|---------|------------|-------------|
| `shell/sync_artifacts_to_bot.sh` | `artifacts/contracts` → `bot/artifacts/contracts` | Идея reusable; **целевой путь `bot/`** — Amanita |
| `shell/post-floou-draft.sh` | POST `/activities/draft`, Bearer, `floou-draft-request.json` | Паттерн «ручной smoke API»; **URL/секреты** — env |
| `shell/run-bullrun-floou.sh` | Полный Floou E2E (см. docs) | Сильная связка wallet/uploader/node — **glue**, не универсальная библиотека |
| Корневые `sync_artifacts_to_bot.sh`, `run-bullrun-floou.sh` | Делегирование в `shell/` | Удобство для оператора |

### 2.7 Automation scripts

| Элемент | Назначение | Reusability |
|---------|------------|-------------|
| `quick_start_automation.sh` | Полный «с нуля» localhost: артефакты, ngrok, ключи | **Операторский сценарий эталона**; опасен как bundle (секреты, пути) |

### 2.8 Deployment JSON & docs format

| Элемент | Назначение | Reusability |
|---------|------------|-------------|
| `deployment/README.md` | Спецификация шагов bash/hardhat/manual/validation, state, extractors, сценарии для AI | **reference_only** + **generate_template** для пустого JSON |
| `deployment/variant-a.json` | Конкретный сценарий «Вариант A» | **project-specific** / reference example |

### 2.9 Quality

| Элемент | Назначение | Reusability |
|---------|------------|-------------|
| `quality/check-test-anti-false-success.js` | Статический grep по `contracts/tests` | Методология reusable; путь — настраивать |

### 2.10 Tests (`scripts/tests`)

| Подкаталог | Назначение | Reusability |
|------------|------------|-------------|
| `tests/unit`, `integration`, `e2e` | Покрытие `lib/` и сценариев actions | **Не production scripts**; копировать целиком — только если проект клонирует полный стек Amanita |
| `tests/helpers` | `IntegrationHarness`, `E2EHarness`, `MagicRegistryHelper` | Сильная ценность как **pattern**; высокая связность с контрактами |

### 2.11 Documentation (`scripts/docs`)

Ключевые файлы: `Deploy_Architecture.md`, `Deploy_Full.md`, `harness-and-e2e.md`, `actions/*.md`, `arweave-transaction-signing.md`, `bullrun-floou-manual.md` (в `docs/`), разделы testing.

| Назначение | Reusability |
|------------|-------------|
| Объяснение действий, архитектуры, Floou | **reference_only** / источник требований для bootstrap docs |

---

## 3. Per-group analysis (формат)

### 3.1 Группа: `deploy_full.js` + `lib/` (router + actions + services)

**Observation**  
Единый entry через Hardhat, DI менеджеров, числовой реестр операций (0,1,2,…,888).

**Evidence**  
`deploy_full.js` (`DeployRouter`, `route`, CLI `DEPLOY_ACTION`); `lib/actions/index.js` (`actionMap`, `getAvailableActions`).

**Interpretation**  
Это **оркестрационное ядро** монорепо: glue между Hardhat, контрактами, Arweave и файловыми данными.

**Bootstrap implication**  
- **`generate_template`** для каркаса роутера + пустых action-модулей + config/constants **как шаблоны имён**.  
- **`bundle_as_is`** — **не рекомендуется** для всего `lib/actions` без декомпозиции.  
- Альтернатива: **`reference_only`** (описать паттерн в docs) + минимальный stub.

---

### 3.2 Группа: `validators/`

**Observation**  
Многофазные проверки каталога/компонентов/mapping/CID + bash для CI.

**Evidence**  
`scripts/README.md`, `validators/*.js`, `validate_full_catalog_pipeline.sh`.

**Interpretation**  
**Quality gates** для данных перед on-chain шагами; тяжёлые зависимости от доменной модели каталога.

**Bootstrap implication**  
- **`reference_only`** для полной логики; **`generate_template`** — «фазовый» скелет валидатора с TODO.  
- **`bundle_as_is`** — только если новый проект **намеренно** наследует те же контракты и форматы данных.

---

### 3.3 Группа: `shell/` + Floou

**Observation**  
Sync ABI в слой приложения; POST draft к node API; полный bullrun Floou.

**Evidence**  
`shell/sync_artifacts_to_bot.sh` (пути `bot/artifacts`); `shell/post-floou-draft.sh` (`BOT_URL`, Bearer); `run-bullrun-floou.sh`.

**Interpretation**  
**Glue layer** между contracts → node consumer, и между GPT/Floou → HTTP API ноды.

**Bootstrap implication**  
- **`generate_template`** для параметризуемых shell (SOURCE/TARGET, BASE_URL).  
- **`reference_only`** для bullrun-сценария как целого.  
- **`bundle_as_is`** — разве что **короткие** `post-floou-draft`-подобные утилиты без жёсткой привязки к дереву эталона.

---

### 3.4 Группа: `quick_start_automation.sh`

**Observation**  
Длинный bash, цветной вывод, дефолтные Anvil/Hardhat ключи, логика копирования артефактов, сетевые порты.

**Evidence**  
Начало файла: `DEPLOYER_PRIVATE_KEY`, `SELLER_*`, `PROJECT_ROOT` от `bot/.env`.

**Interpretation**  
**Operator playbook в коде** для конкретного dev-стека Amanita.

**Bootstrap implication**  
- **`exclude_from_bootstrap`** как слепой copy **или** **`reference_only`**.  
- При переносе — только выжимка в markdown runbook.  
- **`needs_author_decision`** если команда заявляет «хотим тот же quick start».

---

### 3.5 Группа: `deployment/` (JSON spec)

**Observation**  
Документированный формат для AI/оркестратора: типы шагов, валидации, state.

**Evidence**  
`deployment/README.md`, `variant-a.json`.

**Interpretation**  
Метаданные **оркестрации**, не runtime Node-библиотека.

**Bootstrap implication**  
- **`generate_template`** — пустой/минимальный JSON + README со спецификацией.  
- **`reference_only`** — `variant-a.json` как пример Amanita.  
- **`bundle_as_is`** — не имеет смысла как «модуль».

---

### 3.6 Группа: `scripts/tests/`

**Observation**  
Большой объём тестов и хелперов, завязанных на Hardhat и имена контрактов.

**Evidence**  
`docs/harness-and-e2e.md`, структура `tests/e2e/workflows/*`.

**Interpretation**  
**Тестовый продукт**, расширяющий scripts; не обязателен для «bootstrap прикладного» репо без полного стека.

**Bootstrap implication**  
- По умолчанию **`exclude_from_bootstrap`** или опциональный флаг.  
- **`reference_only`** (harness patterns).  
- **`bundle_as_is`** только для форка Amanita.

---

### 3.7 Группа: `scripts/docs/`

**Observation**  
Детальная архитектура deploy_full v2, каталог, компоненты, действия.

**Evidence**  
`Deploy_Architecture.md`, `actions/*.md`.

**Interpretation**  
**Знание и контракты оператора**, не исполняемый слой.

**Bootstrap implication**  
- **`reference_only`** + выборочное **docs-derived** в bootstrap `templates/docs`.

---

## 4. Customization map

### Stable across projects (относительно)

- Идея **отдельного** `scripts/.env` и одного **env-path** модуля.
- **Роутер**: инициализация provider из Hardhat → сервисы → выполнение «операции по номеру/имени».
- **Логирование** с уровнями; разделение **config / constants / actions**.
- **Сборка ABI** в каталог, читаемый приложением (`artifacts` → `*_artifacts` consumer).
- **Формат** deployment JSON (steps, validation) как **контракт для AI/manual**.

### Usually customized

- Имена контрактов, env keys, адреса registry, список **actions** и их семантика.
- Пути `data/`, seller ids, форматы CSV/JSON каталога.
- Целевая папка для ABI (`bot/` vs `node/` vs другое).
- URL ноды, Floou endpoints, секреты Bearer.
- RPC / chain (localhost vs polygon vs др.); логика `RpcProviderManager`.

### Dangerous to bundle blindly

- Весь **`lib/actions`** как единый пакет.
- **`quick_start_automation.sh`** (встроенные ключи, предположения о дереве).
- **Validators** без ревью доменных предположений.
- **`deployment/variant-a.json`** как «канон» чужого проекта.

---

## 5. Integration map (scripts как glue)

| Слой | Связь со scripts |
|------|-------------------|
| **Contracts / Hardhat** | `deploy_full.js` через `hardhat`; артефакты из `artifacts/contracts`; action 0,1,5,12… |
| **Node (`bot/`)** | Sync ABI; `post-floou-draft` / bullrun дергают HTTP API; env `BOT_URL`, `GPT_ACTIONS_BEARER_SECRET` |
| **arweave-uploader** | Косвенно: Actions 42,444,52 и ArweaveManager; Floou shell сценарии согласуются с uploader в полном E2E |
| **wallet/mock-runner** | `run-bullrun-floou.sh` и связанные сценарии (см. `scripts/docs`, bullrun manual) |
| **env / security** | `scripts/.env` отделён от корня; секреты деплоя и GPT Actions; валидатор частично дублирует «честность» тестов |
| **GPT / Floou** | Draft POST, полный bullrun; JSON тела (`floou-draft-request.json`); документированные сценарии в `deployment/README.md` |

---

## 6. Candidate bootstrap strategy for scripts (предварительно)

### Likely bundled (фрагментарно, не весь `scripts/`)

- Короткие **shell** утилиты: «синк ABI» с параметрами SOURCE/TARGET (переписать пути под проект).
- Возможно **один** минимальный **post-* smoke** curl к health/draft (без Amanita URL).
- **Не** целиком `lib/` без рефакторинга под новый домен.

### Likely templated

- **`deploy_full.js`** — укороченный router + 1–2 demo actions.
- **`lib/config`** + **`constants`** — шаблон маппинга env → контракты.
- **Структура каталогов** `validators/` с README и одной простой фазой.
- **`deployment/`** — README спецификации + пустой JSON.

### Likely docs / reference only

- `scripts/docs/Deploy_Architecture.md`, `Deploy_Full.md`, `harness-and-e2e.md`, action-docs.
- Семантика SCENARIO_* и AI-orchestration из `deployment/README.md`.
- Описание phase-based validators без копирования 2k+ строк.

### Likely excluded (по умолчанию для generic bootstrap)

- `quick_start_automation.sh` (как есть).
- `deploy_full.old.js`, мусорные артефакты (`Untitled`).
- Полный комплект **`scripts/tests`** при узком bootstrap.
- Точная копия **`variant-a.json`**.
- Узкоспециализированные `utility/diagnostic-*` без явного запроса.

---

## 7. Suspicious / temporary / legacy items

| Путь | Почему сомнительно | Риск при blind include | Вопрос автору |
|------|-------------------|------------------------|---------------|
| `scripts/deploy_full.old.js` | Суффикс `.old` | Дублирование логики, путаница с entry | Нужен ли файл в репо или только история в git? |
| `scripts/Untitled` | Неименованный артефакт | Шум, возможный секрет/мусор | Удалить или переименовать? |
| `scripts/quick_start_automation.sh` | Встроенные dev ключи, жёсткие пути | Утечка паттерна небезопасных ключей в «шаблон» | Разрешён ли перенос сценария в bootstrap или только описание? |
| `scripts/README.md` ссылается на `archive/deploy_full_monolith_*` | В текущем дереве **archive** может отсутствовать | Рассинхрон доки | Актуализировать README или восстановить archive? |
| `quality/check-test-anti-false-success.js` | Жёсткий `contracts/tests` | Ложные срабатывания в другой структуре | Целевой путь тестов в новых репо? |
| Крупные validators | Размер + домен | Поддержка и лицензирование копипасты | Какие фазы обязательны для стартера? |

---

## 8. Open questions

1. Должен ли bootstrap **вообще** включать **числовой action registry** (как в Amanita) или переходить на **именованные команды** (`npm run deploy:magic-registry`) для переносимости?
2. Нужна ли в стартере **полная** цепочка Floou (**bullrun**) или достаточно **docs + опциональный** мини-smoke?
3. Каково официальное отношение к **`quick_start_automation.sh`**: internal-only или часть «эталона» для копирования?
4. Следует ли выделять **`lib/services/ArweaveManager`** в отдельный переносимый пакет или считать его частью «не отделять от uploader/scripts»?
5. Для **validators**: какой минимальный набор фаз считается **MVP bootstrap** vs full Amanita?
6. Нужен ли в bootstrap дубликат **`scripts/tests`** с harness или только ссылка на методологию `harness-and-e2e.md`?

---

## Итог для следующего шага

1. **Копировать как bundled code** имеет смысл в основном **короткие glue-слои** и **доказанно стабильные** хелперы с **явной параметризацией путей** — не весь `lib/actions`.
2. **Шаблоны** — router + config shape + заготовки validators + deployment JSON format + shell sync/smoke.
3. **Reference-only** — архитектурные docs, сценарии SCENARIO_*, bullrun playbook, большие validators, тестовые harnesses.
4. **Слишком завязано на Amanita** — конкретные actions (888, 555, 444…), имена контрактов и registry, `bot/` layout, бизнес-ид продавца, объёмные пайплайны каталога.

_Документ подготовлен на основе чтения кода и `scripts/docs/**` эталонного workspace; финальные решения для bootstrap-system не зафиксированы._
