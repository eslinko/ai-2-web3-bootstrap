# Bundled modules transition — combined output (v1.8)

## Что теперь bundled as is

| Модуль | Условие | Источник |
|--------|---------|----------|
| `wallet/mock-runner` | `wallet.layer_mode = bundled_mock_runner` | Эталонное дерево `wallet/mock-runner/` |
| `arweave-uploader` | `layer.arweave_uploader` + `uploader.enabled` + `uploader.delivery_mode = bundled_module` (default) | Эталонный пакет `arweave-uploader/` |

## Что генерируется вокруг bundled modules

- **Docs:** `templates/docs/wallet/*`, `templates/docs/arweave-uploader/*` (в т.ч. `BUNDLED_MODULE_NOTES.md`).
- **Env:** `wallet-mock.env.example`, `arweave.env.example`, фрагменты node/security env по решениям.
- **Notes / limitations:** prototype-only, fixed keys, single-user.
- **Plan metadata:** `bundled_modules_to_copy`, `generated_templates_to_apply`, `optional_scaffolds_to_skip` в `outputs/generation-plan.md`.

## Что осталось fixed в prototype mode

- Один пользователь mock-runner; эталонное ядро uploader без переписывания под каждый проект.
- Доверие к секретам через **env + gitignore**, не через встроенный Vault в v1 старта.

## Что позже перевести в configurable / generated architecture

- Замена mock-runner на внешний wallet и продвинутый custody.
- Вынесение или замена ядра uploader, если политика или домен требуют иного ingress/publish (тогда `uploader.delivery_mode` ≠ `bundled_module` и отдельный архитектурный цикл).

## Optional / secondary

- `templates/code/arweave-uploader/src/**` pipeline stubs — для обучения границам, **не** замена копии эталона.
