# Bundled modules strategy (bootstrap-system v2.0)

## 1. Какие модули допустимо включать bundled

- **Инфраструктурные** сервисы и клиенты, уже **рабочие в эталоне**: стабильный контракт входов/выходов, настройка через env, без домена как главного места кастомизации.
- В рамках **prototype stage**: когда цель — быстро замкнуть Floou (node ↔ uploader ↔ wallet ↔ contracts), а не строить платформу замены ядра.
- Примеры в этом репозитории: **`wallet/mock-runner`** (signing companion), **`arweave-uploader`** (контролируемый ingress в Arweave-слой).

Недопустимо путать bundled с «копировать всё монорепо»: только явно перечисленные модули и их зависимости по `references/bundled-code-placement-rules.md`.

## 2. Почему bundled inclusion допустим на prototype stage

- Снижает **time-to-working-path**: меньше stub-деревьев вместо проверенного кода.
- Фиксирует **архитектурные инварианты** (очередь подписей, crystalize, callback) в рабочем виде.
- Кастомизация переносится на **env, контракты payload, документацию интеграции**, а не на переписывание ядра на старте.

## 3. Чем bundled module отличается от generated scaffold

| | Bundled module | Generated scaffold |
|--|----------------|-------------------|
| Источник | Эталонный пакет **копируется почти целиком** | Фрагменты из `templates/code/**` |
| Цель | Рабочий companion | Демонстрация границ / заготовка |
| Риск дрейфа | Нужна дисциплина версий/notes | Меньше кода — проще поддерживать шаблон |
| Primary в bootstrap v2.0 | wallet + uploader (prototype) | node/contracts boundaries, GPT stubs, optional uploader pipeline stubs; **apply** по plan |

## 4. Что обязательно должно генерироваться вокруг bundled module

- **Docs:** обзор слоя, runtime, ограничения, ссылки на интеграцию с node/uploader/security (см. `templates/docs/wallet/**`, `templates/docs/arweave-uploader/**`).
- **Env:** группы переменных без секретов; согласование имён с нодой и uploader (`templates/env/*.example`, `shared-vars-catalog.md`).
- **Integration notes:** что синхронизировать при копировании (порты, URL, токены, версии API).
- **Plan metadata:** `outputs/generation-plan.md` — секции `bundled_modules_to_copy` vs `generated_templates_to_apply` vs `optional_scaffolds_to_skip`.
- **Limitations:** prototype-only (single-user, fixed keys, отсутствие wallet UX).

## 5. Когда bundled module позже должен стать configurable/generated

- Требуется **multi-user**, custody, продуктовый wallet UX.
- Нужно **другое ядро publish** или иной протокол ingress, не сводимый к env/payload.
- Политика безопасности запрещает **fixed keys** или перенос эталонного кода без аудита.

## 6. Почему `wallet/mock-runner` и `arweave-uploader` подпадают под стратегию

- Оба **уже поддерживают общую архитектуру** Floou; меняются в основном через env и семантику payload/callback.
- Они **не являются** главным объектом доменной кастомизации нового продукта на первом этапе — в отличие от GPT-контента, доменных контрактов ноды и смарт-регистров.
- Для **arweave-uploader** управляющая логика (decisions, противоречия, ingress/auth/verification/publish/callback) остаётся в документации и summary; **ядро кода** на prototype path копируется as is, а не реконструируется по stub-дереву.

**См. также:** `references/bundled-code-placement-rules.md`, `references/wallet-bundled-prototype.md`, `references/uploader-bundled-transition-notes.md`, `outputs/bundled-modules-transition.md`, **`references/bundled-apply-rules.md`**, **`references/apply-rules.md`**.

---

## 7. Copy vs generate vs apply (v2.0)

| Класс | Механизм | Источник истины |
|-------|----------|-----------------|
| **Bundled copy** | Физическое копирование эталона | `generation-plan.md` → `bundled_modules_to_copy`; `generate.bundled_*` **и** `generate.apply_bundled_copy` |
| **Generated around bundled** | Шаблоны docs/env/notes | `generated_templates_to_apply` |
| **Template layers** (node, scripts, security, GPT stubs, …) | Копирование/адаптация из `templates/` | Та же таблица `generated_templates_to_apply` + `generate.*` |
| **Apply execution** | Агент по `execution/apply/*` | `07-apply-layer.md`, не отдельный бинарник |

Без фазы **apply** plan остаётся спецификацией; materialization — опциональный следующий шаг.
