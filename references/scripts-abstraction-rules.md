# Scripts abstraction rules (bootstrap bridge)

## 1. Инварианты слоя

- Отдельный **контур env** для скриптов деплоя (идея **canonical path**, например `scripts/.env`).
- **Один entry** для оркестрации (роутер или явный набор named scripts — зафиксировано решением `scripts.deploy_pattern`).
- **Явная граница** между «инфраструктурой скрипта» (config, logger, provider) и «доменными действиями» (конкретные контракты/каталог).

## 2. Что шаблонизировать

- Каркас **router** + пустой/минимальный **registry** операций.
- **config/index** + **constants** (плейсхолдеры имён контрактов и env keys).
- **Shell**: SOURCE/TARGET для artifacts, BASE_URL для smoke.
- **Phase-based validator**: один файл-образец фаз без доменной логики эталона.
- **Deployment spec**: README формата + минимальный JSON.

## 3. Что нельзя blind-bundle

- Весь **`lib/actions`** эталона и таблица номеров **888/555/444** как канон.
- **Крупные validators** и весь каталог **`scripts/tests`** по умолчанию.
- **`quick_start_automation.sh`**, **`deploy_full.old.js`**, артефакты без имён (**`Untitled`**).
- Эталонный **`variant-a.json`** как обязательный файл нового проединкта.

## 4. Что оставлять reference-only

- Документация **`scripts/docs/**`** эталона (архитектура, сценарии).
- Методология **harness / E2E** — описание в docs, не обязательно код.
- **SCENARIO_*** матрицы из deployment README — знание, не обязательно JSON копия.

## 5. Operator playbook vs reusable automation

- **Playbook** (длинный bash, ngrok, дефолтные ключи) — для оператора **конкретного** репо; в bootstrap только **ссылка/pattern** или исключение.
- **Reusable automation** — короткие, параметризуемые, без секретов в теле скрипта.

## 6. Когда minimal, когда richer

- **`scripts.mode = minimal_helpers`** — shell smoke + sync template, мало JS.
- **`orchestration_scaffold`** — router + config + опционально validators template.
- **`reference_only`** — только docs scripts layer + deployment spec README как текстовый паттерн, без обязательного кода.

Согласуй с `scripts.enabled`, `layer.scripts` и `docs_depth`.
