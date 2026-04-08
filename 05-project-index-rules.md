# Project index rules — v1.2 (project state registry)

## 1. Назначение

`PROJECT_INDEX.md` (в `docs/` нового проекта) — не только навигация по папкам, а **живой реестр состояния**: какие слои включены, что отложено, куда смотреть за решениями и артефактами.

**Канон кода** по-прежнему: репозиторий + OpenAPI. Индекс — **карта состояния** после bootstrap и эволюции.

---

## 2. Обязательные секции после bootstrap

| Секция | Содержание |
|--------|------------|
| **Project** | Имя, slug, ссылка на `outputs/interview-summary.md` (или копия ключевых решений в репо) |
| **Enabled layers** | Таблица: слой → статус (active / planned / n/a) |
| **Excluded from v1** | Явный список из summary |
| **Entry points** | Команды запуска: node, uploader, hardhat, smoke |
| **SSOT** | OpenAPI URL; инструкции GPT путь; где human docs |
| **Env** | Ссылки на `.env.example` по модулям; без значений секретов |
| **Decisions** | Ссылка на Decision table в interview-summary или `docs/DECISIONS.md` |
| **Tasks** | Ссылка на `outputs/task-backlog.md` или внутренний TASK_INDEX |
| **Apply (v2.0)** | Ссылка на `outputs/apply-report.md` / `outputs/applied-project-structure.md`, если выполнялся apply |
| **Pending** | Из summary `Pending decisions` |
| **Risks** | Кратко из `Risk flags` |

---

## 3. Отражение enabled / excluded

- Каждый слой из эталона (node, contracts, uploader, custom-gpt, scripts, wallet mock-runner / signing client) должен иметь строку: **включён** | **исключён** | **вне репо**; для wallet указать **`decisions.wallet.layer_mode`** (и bundled vs external). Для **scripts**: указать **`scripts.enabled`**, **`scripts.mode`** (mixed scaffold vs reference_only) и ссылку на `docs/scripts/` / `references/scripts-layer-strategy.md`.
- Исключённые слои **не** удалять из оглавления без объяснения — строка «not in scope v1».

---

## 4. Связи между артефактами

```text
interview-summary.md  →  PROJECT_INDEX (Decisions + Enabled)
        ↓
task-backlog.md       →  PROJECT_INDEX (Tasks)
        ↓
starter-docs-manifest →  PROJECT_INDEX (что создано из templates)
```

---

## 5. Pending decisions

- Дублировать id из summary (`NEEDS_DECISION`) в индекс с датой или фазой разрешения.
- При закрытии — обновить индекс и Decision table.

---

## 6. Обновление

- Любой PR, меняющий слой или контракт интеграции, обновляет **Enabled layers** и при необходимости **SSOT**.
- Ревью: не противоречит ли `interview-summary`.

---

## 7. Язык

По политике команды; для международных команд — EN в индексе, локаль в продуктовых docs.
