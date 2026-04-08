# Uploader: переход к bundled primary path (v1.8)

## 1. Что из uploader-aware итерации (v1.7) сохраняется как valuable

- **Decisions** в интервью и summary: `uploader.enabled`, `mode`, `caller_auth_mode`, `verification_mode`, `publish_mode`, `callback_mode`, `payload_contract_mode`, `wallet_dependency_mode`, плюс **`uploader.delivery_mode`** (v1.8).
- **Contradiction checks C21–C28** — управляющая логика согласованности с node/security/wallet.
- **Модель слоя:** ingest → caller trust → verification (JWT / Data Item) → publish → callback; граница с wallet.
- **Docs logic:** когда включать ARCHITECTURE, INGRESS, VERIFICATION, PAYLOAD, PUBLISH/CALLBACK.
- **Env groups** в `arweave.env.example` и перекрёстные ссылки в `shared-vars-catalog.md` / `security.env.example`.
- **`references/arweave-uploader-architecture-extraction.md`**, **`arweave-uploader-abstraction-rules.md`** — канон абстракции без привязки к пошаговой генерации каждого файла uploader.

## 2. Что теперь считается optional / secondary

- Подробное **stub-дерево** `templates/code/arweave-uploader/src/{ingest,auth,verification,payload,publish,callback}/` — не primary способ получить uploader в новом проекте.
- Флаги **`generate.code_uploader_scaffold_helpers`** — включают эти заготовки **только** при `uploader.delivery_mode = scaffold_only` или явном запросе «обучающий скелет рядом с копией эталона».

## 3. Почему primary path теперь bundled

- Эталонный **arweave-uploader** на prototype stage трактуется как **фиксированный инфраструктурный модуль**: меньше пространства для безопасной кастомизации ядра, чем у доменной ноды/GPT.
- Кастомизация — через **env, payload semantics, callback контракт, auth modes**, интеграционные доки — см. `templates/docs/arweave-uploader/BUNDLED_MODULE_NOTES.md`.
- Так уменьшается **ложная уверенность**, что проект «собран из stubs» и соответствует эталонному runtime.

## 4. Default

- **`uploader.delivery_mode = bundled_module`** при включённом `layer.arweave_uploader` и `uploader.enabled`, если интервью не выбрал иное.

**См.:** `outputs/bundled-modules-transition.md`, `references/bundled-modules-strategy.md`.
