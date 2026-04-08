# Execution prompt: build-summary

**Роль:** превратить **raw answers** в `outputs/interview-summary.md` по спецификации `02-interview-summary-spec.md`.

## Вход

- `bootstrap-system/outputs/raw-answers.yaml` (или эквивалент в сообщении пользователя)

## Инструкции для агента

1. Прочитай `02-interview-summary-spec.md`.
2. Создай или перезапиши `outputs/interview-summary.md` со всеми обязательными секциями H2:
   - Meta (включая `bootstrap_system_version: 2.0`)
   - Enabled layers (таблица из `raw.layers`)
   - Excluded layers (пусто или из triage)
   - Decision table (строки из `raw.decisions`, `channels`, `integrations` с присвоением id D1, D2, …)
   - Mandatory starter docs / code / env — списки-заглушки или по правилам из spec
   - Pending decisions, Donor residue, Risk flags — из raw или пусто
   - Vision — краткий абзац из названия проекта
3. Добавь секции `Security decisions`, `Auth modes by channel`, `Signing modes`, `Secrets source` из raw answers.
4. Добавь секции **`Wallet prototype decisions`** (`wallet.layer_mode`, `wallet.prototype_policy`, `wallet.role`) при `layer.node = true` (см. `02`).
5. Добавь секции `GPT layer decisions`, `Dialogue / elicitation model`, `Rulebook / validation model`, `GPT output contract`, `Backend handoff model` из raw answers.
6. Если включён слой `arweave_uploader` и ответы содержат `uploader.*`: добавь секции **Uploader layer decisions** (включая **`uploader.delivery_mode`**, default `bundled_module`), **Uploader ingress model**, **Uploader verification model**, **Uploader publish model**, **Uploader callback model**, **Uploader payload contract** (см. `02-interview-summary-spec.md`).
7. Если в raw есть `scripts.*` (или `layer.scripts`): добавь секции **Scripts layer decisions** и подсекции **Deploy / orchestration**, **Validation**, **Shell glue**, **Deployment spec**, **Scripts testing / harness** по `02-interview-summary-spec.md`.
8. Добавь секции **Apply strategy** и **Apply constraints** из `raw.apply.*` или defaults из `01` §2.13.
9. Блок **Generation switches** (`generate:`) либо оставь пустым с комментарием «см. compute-switches», либо заполни всеми ключами `false` кроме `docs_root: true`, `docs_tasks: true`, **`apply_bundled_copy: true`**, **`apply_optional_scaffolds: false`** как временный заголовок (включая **bundled_***, wallet/security/gpt/uploader/**scripts** — см. `02`).

## Не делать

- Полное вычисление derived switches — это следующий промпт.

## Выход

- Готовый `outputs/interview-summary.md` (без финальной валидации switches).
