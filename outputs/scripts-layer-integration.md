# Scripts layer — интеграция в bootstrap-system (v1.9)

## Источник

Анализ: `docs/scripts-layer-analysis.md` (эталон). Стратегия: `references/scripts-layer-strategy.md`.

## Что признано templated (scaffold)

- Router-stub (`templates/code/scripts/router/`).
- Config + constants + env-path (`templates/code/scripts/config/`).
- Минимальный logger / helpers (`templates/code/scripts/lib/`).
- Shell: sync-artifacts + smoke-health templates (`templates/code/scripts/shell/`).
- Один phase-validator stub (`templates/code/scripts/validators/`).
- Deployment spec: README template + minimal JSON example (`templates/code/scripts/deployment/`).
- Существующий `deploy/floou_health_smoke.sh` — простой smoke pattern.

## Что признано reference-only

- Полная архитектура эталонного `deploy_full.js` + `lib/actions` — в **docs**, не в копируемом коде bootstrap.
- `scripts/docs/Deploy_Architecture.md` и аналоги — **вне** обязательного стартера; при желании ссылка из `SCRIPTS_LAYER_OVERVIEW.md`.
- Harness/E2E methodology — перекрёстная ссылка, флаг **`generate.scripts_harness_reference`**.

## Что признано excluded by default

- Весь каталог **`lib/actions`** эталона как bundle.
- Полные **validators** эталона.
- **`scripts/tests`** целиком.
- **`quick_start_automation.sh`**, **`deploy_full.old.js`**, **`Untitled`**.
- Эталонный **`variant-a.json`** как канон файла в генерации.

## Возможные bundled helpers

- Только то, что уже лежит в **`templates/code/scripts`** как **короткие** шаблоны; расширение bundled для scripts **не** планируется на уровне целого эталона.

## Decisions (interview)

См. `01-interview-orchestrator.md` § Scripts layer decisions:

- `scripts.enabled`, `scripts.mode`, `scripts.deploy_pattern`, `scripts.validation_pattern`, `scripts.shell_glue`, `scripts.deployment_spec`, `scripts.tests_harness`.

## Встройка в bootstrap

| Механизм | Изменение v1.9 |
|----------|----------------|
| `02-interview-summary-spec.md` | Секции scripts + switches `generate.docs_scripts_*`, `generate.code_scripts_*`, … |
| `references/bootstrap-decision-matrix.md` | Строки `scripts.*` |
| `references/output-selection-rules.md` | § Scripts layer |
| `04-bootstrap-output-spec.md` | § Scripts outputs |
| `execution/compute-switches.md` | Вывод scripts switches из `scripts.*` |
| `execution/plan-bootstrap.md` | Пути `templates/docs/scripts`, `templates/code/scripts`, `templates/env/scripts.env.example` |
| `references/execution-validation.md` | Contradiction **C31–C36** |

## Обязательные «не делать»

Системно зафиксировано: **не** bundle fully `lib/actions`, `validators`, `scripts/tests`, operator playbooks, `variant-a.json`, мусорные файлы — см. `references/scripts-abstraction-rules.md`.
