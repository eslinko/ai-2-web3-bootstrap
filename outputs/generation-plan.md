# Generation plan — canonical skeleton (v2.0)

Заполняется промптом **`execution/plan-bootstrap.md`** после валидного `outputs/interview-summary.md` с блоком `generate:`.  
**Вход для apply:** `07-apply-layer.md`, `execution/apply/apply-bootstrap.md`.

---

## Meta

- source_summary: `outputs/interview-summary.md`
- generated_at: (ISO datetime)
- bootstrap_system_version: 2.0
- apply_target_mode: (копия `apply.target_mode` из summary или TBD)
- donor_repo_ref: (опционально; путь/commit эталона для bundled source)

## Enabled layers (copy from summary)

| layer | enabled |
|-------|---------|
| node | |
| contracts | |
| arweave_uploader | |
| custom_gpt | |
| scripts | |
| wallet_signing | |
| wallet_mock_runner | |
| integrations.hmac | |
| integrations.supabase | |
| integrations.vault | |

## bundled_modules_to_copy

**Цель:** эталонные деревья **почти as is**; физическое копирование — только если `generate.apply_bundled_copy` и политика apply разрешают (см. `references/bundled-apply-rules.md`).

| source path (donor) | target path (new project) | reason | required decisions / switches |
|----------------------|---------------------------|--------|------------------------------|
| `wallet/mock-runner/**` | `wallet/mock-runner/` | Bundled signing companion | `bundled_wallet_mock_runner`, `apply_bundled_copy`, `apply.bundled_copy_mode = copy_enabled` |
| `arweave-uploader/**` | `arweave-uploader/` | Bundled uploader package | `bundled_arweave_uploader`, `apply_bundled_copy`, `apply.bundled_copy_mode = copy_enabled` |

Дополнительно: triage-исключения внутри дерева; реальный путь донора указывает оператор.

## generated_templates_to_apply

Пути **template source** относительно `bootstrap-system/templates/`.

| template source | target path (new project) | reason | required switches (`generate:`) |
|-----------------|---------------------------|--------|----------------------------------|
| `docs/root/*` | `docs/` (или согласовано) | Root starter docs | `docs_root` |
| `docs/node/*` | `docs/node/` | Node architecture | `docs_node` |
| `docs/contracts/*` | `docs/contracts/` | Chain docs | `docs_contracts` |
| `docs/custom-gpt/*` | `docs/custom-gpt/` | GPT instructions space | `docs_custom_gpt` |
| `docs/wallet/*` | `docs/wallet/` | Wallet layer docs | `docs_wallet` |
| `docs/security/*` | `docs/security/` | Security contours | `docs_security` |
| `docs/gpt/*` | `docs/gpt/` | GPT architecture | `docs_gpt_*` |
| `docs/arweave-uploader/*` | `docs/arweave-uploader/` | Uploader docs | `docs_uploader_*` |
| `docs/scripts/*` | `docs/scripts/` | Scripts layer docs | `docs_scripts_architecture` / runbook |
| `env/*.example` и каталог | `env/` или корень (см. output spec) | Env groups | соответствующие `env_*` |
| `code/node/**` | `…` | Node scaffold | `code_node` |
| `code/contracts/**` | `contracts/` | Hardhat starter | `code_contracts` |
| `code/scripts/**` | `scripts/` | Mixed scripts scaffold | `code_scripts_*`, `docs_deployment_spec`, … |

(Дополнить строками по всем `generate.* == true` из summary.)

## optional_scaffolds_to_skip

| template source | why optional | disabled by (decision/switch) |
|-----------------|--------------|----------------------------------|
| `templates/code/arweave-uploader/src/**` | Pipeline stubs secondary | `code_uploader_scaffold_helpers = false` или `apply_optional_scaffolds = false` |
| … | | |

## excluded_items

- Слои с `generate.* = false`
- Triage `donor_residue_ignore` / эталонный мусор
- Файлы из triage (ключи, `.env` эталона, …)

## Task categories (from `03-task-generator.md`)

| category | triggered_by |
|----------|--------------|
| | |

## initial_tasks_to_emit

Предварительный список категорий initial tasks после apply (без deep implementation):

| category | source signal |
|----------|---------------|
| apply-followup | `outputs/apply-report.md` conflicts/manual follow-ups |
| security-hardening | `security.*` + unresolved hardening risks |
| gpt-contract-alignment | `gpt.*` strict/rulebook gaps |
| uploader-runtime-alignment | `uploader.*` + callback/publish risks |
| scripts-operationalization | `scripts.*` + deployment/spec gaps |
| contracts-integration | chain decisions + pending hooks |

## task_zones_to_initialize

Инициализировать контекстные зоны задач:

- `docs/analysis/tasks/` (global)
- `node/docs/analysis/tasks/` (если node в scope)
- `contracts/docs/analysis/tasks/` (если contracts в scope)
- `arweave-uploader/docs/analysis/tasks/` (если uploader в scope)
- `wallet/docs/analysis/tasks/` (если wallet bundled/external roadmap)
- `scripts/docs/analysis/tasks/` (если scripts в scope)
- `security/docs/analysis/tasks/` (если security contours in scope)
- `gpt/docs/analysis/tasks/` (если gpt в scope)

## task_indexes_to_initialize

Тематические индексы (aggregator-only) по зонам:

- `docs/analysis/tasks/global-tasks-index.md`
- `node/docs/analysis/node-tasks-index.md`
- `contracts/docs/analysis/contracts-tasks-index.md`
- `arweave-uploader/docs/analysis/uploader-tasks-index.md`
- `wallet/docs/analysis/wallet-tasks-index.md`
- `scripts/docs/analysis/scripts-tasks-index.md`
- `security/docs/analysis/security-tasks-index.md`
- `gpt/docs/analysis/gpt-tasks-index.md`

## Notes

- Риски / pending из summary
- См. `outputs/bundled-modules-transition.md`, `outputs/scripts-layer-integration.md`, **`outputs/apply-layer-integration.md`**
